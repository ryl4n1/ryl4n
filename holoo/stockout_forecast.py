import pandas as pd
import numpy as np
from prophet import Prophet
from datetime import datetime, timedelta
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

def load_data(file_path):
    """Load and preprocess the data"""
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    return df

def prepare_prophet_data(df, sku, end_date=None):
    """Prepare data for Prophet model"""
    sku_data = df[df['sku_id'] == sku].copy()
    if end_date:
        sku_data = sku_data[sku_data['date'] <= end_date]
    prophet_df = sku_data[['date', 'units_sold']].rename(columns={'date': 'ds', 'units_sold': 'y'})
    return prophet_df, sku_data

def train_prophet_model(prophet_df):
    """Train Prophet model"""
    model = Prophet(yearly_seasonality=False, 
                   weekly_seasonality=True,
                   daily_seasonality=False)
    model.fit(prophet_df)
    return model

def train_xgboost_model(sku_data):
    """Train XGBoost model"""
    # Create features
    sku_data['day_of_week'] = sku_data['date'].dt.dayofweek
    sku_data['month'] = sku_data['date'].dt.month
    sku_data['day'] = sku_data['date'].dt.day
    
    # Prepare features and target
    features = ['day_of_week', 'month', 'day']
    X = sku_data[features]
    y = sku_data['units_sold']
    
    # Train model
    model = xgb.XGBRegressor(objective='reg:squarederror', random_state=42)
    model.fit(X, y)
    return model, features

def forecast_sales(model, features, last_date, forecast_days=30):
    """Generate sales forecast"""
    # Create future dates
    future_dates = pd.date_range(start=last_date + timedelta(days=1), periods=forecast_days)
    
    # Prepare features for future dates
    future_df = pd.DataFrame({
        'date': future_dates,
        'day_of_week': future_dates.dayofweek,
        'month': future_dates.month,
        'day': future_dates.day
    })
    
    # Make predictions
    forecast = model.predict(future_df[features])
    return pd.Series(forecast, index=future_dates)

def calculate_stockout_date(current_inventory, daily_sales, start_date):
    """Calculate estimated stockout date"""
    if daily_sales <= 0:
        return None
    days_until_stockout = int(current_inventory / daily_sales)
    return start_date + timedelta(days=days_until_stockout)

def get_stockout_alert(days_until_stockout):
    """Generate stockout alert based on days until stockout"""
    if days_until_stockout is None:
        return "NO ALERT"
    elif days_until_stockout <= 3:
        return "CRITICAL: Stockout within 3 days!"
    elif days_until_stockout <= 7:
        return "URGENT: Stockout within a week!"
    elif days_until_stockout <= 14:
        return "WARNING: Stockout within two weeks"
    else:
        return "OK"

def main():
    # Load data
    df = load_data('input_data.csv')
    
    # Get unique SKUs
    skus = df['sku_id'].unique()
    
    # Initialize results storage
    results = []
    
    for sku in skus:
        # Get all dates for this SKU
        dates = df[df['sku_id'] == sku]['date'].unique()
        
        # For each date, make a forecast
        for current_date in dates:
            # Prepare data up to current date
            prophet_df, sku_data = prepare_prophet_data(df, sku, current_date)
            
            if len(prophet_df) < 7:  # Need at least a week of data
                continue
                
            # Train Prophet model
            prophet_model = train_prophet_model(prophet_df)
            
            # Train XGBoost model
            xgb_model, features = train_xgboost_model(sku_data)
            
            # Get current inventory
            current_inventory = sku_data['inventory_level'].iloc[-1]
            
            # Skip if already out of stock
            if current_inventory == 0:
                continue
            
            # Generate forecasts
            future_dates = pd.date_range(start=current_date + timedelta(days=1), periods=30)
            prophet_forecast = prophet_model.predict(pd.DataFrame({'ds': future_dates}))
            xgb_forecast = forecast_sales(xgb_model, features, current_date)
            
            # Combine forecasts (simple average)
            combined_forecast = (prophet_forecast['yhat'].values + xgb_forecast.values) / 2
            
            # Calculate average daily sales
            avg_daily_sales = np.mean(combined_forecast)
            
            # Calculate stockout date
            stockout_date = calculate_stockout_date(current_inventory, avg_daily_sales, current_date)
            
            # Calculate days until stockout
            days_until_stockout = (stockout_date - current_date).days if stockout_date else None
            
            # Get alert
            alert = get_stockout_alert(days_until_stockout)
            
            # Store results
            results.append({
                'Date': current_date,
                'SKU': sku,
                'Current Inventory': current_inventory,
                'Average Daily Sales': round(avg_daily_sales, 2),
                'Days Until Stockout': days_until_stockout,
                'Estimated Stockout Date': stockout_date,
                'Alert': alert
            })
    
    # Create results DataFrame
    results_df = pd.DataFrame(results)
    
    # Sort by date
    results_df = results_df.sort_values('Date')
    
    # Save results
    results_df.to_csv('stockout_forecast_results.csv', index=False)
    print("\nForecast Results:")
    print(results_df.to_string(index=False))

if __name__ == "__main__":
    main() 