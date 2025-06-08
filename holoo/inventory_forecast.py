import pandas as pd
import numpy as np
from prophet import Prophet
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore', category=UserWarning)
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

def load_data(file_path):
    """Load and preprocess the input data."""
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    return df

def create_features(df):
    """Create time-based and lag features for ML forecasting."""
    df = df.copy()
    df['dayofweek'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['lag1'] = df['units_sold'].shift(1)
    df['lag7'] = df['units_sold'].shift(7)
    df = df.fillna(0)
    return df

def forecast_sku_sales_prophet(df, sku_id):
    """Generate sales forecast for a single SKU using Prophet."""
    # Filter data for specific SKU
    sku_data = df[df['sku_id'] == sku_id].copy()
    
    # Prepare data for Prophet
    prophet_df = sku_data.rename(columns={'date': 'ds', 'units_sold': 'y'})
    
    # Initialize and fit Prophet model
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=True
    )
    model.fit(prophet_df)
    
    # Create future dataframe for 30 days
    future = model.make_future_dataframe(periods=30, freq='D')
    forecast = model.predict(future)
    
    return forecast

def forecast_sku_sales_xgb(df, sku_id):
    sku_data = df[df['sku_id'] == sku_id].copy()
    sku_data = create_features(sku_data)
    features = ['dayofweek', 'month', 'day', 'lag1', 'lag7']
    X = sku_data[features]
    y = sku_data['units_sold']
    # Train on all available data
    model = XGBRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    # Forecast next 30 days
    last_row = sku_data.iloc[-1:]
    forecasts = []
    for i in range(30):
        next_date = last_row['date'].values[0] + np.timedelta64(1, 'D')
        next_features = {
            'dayofweek': next_date.astype('datetime64[D]').astype(object).weekday(),
            'month': next_date.astype('datetime64[M]').astype(object).month,
            'day': next_date.astype('datetime64[D]').astype(object).day,
            'lag1': last_row['units_sold'].values[0],
            'lag7': last_row['lag7'].values[0] if 'lag7' in last_row else 0
        }
        X_pred = pd.DataFrame([next_features])
        y_pred = model.predict(X_pred)[0]
        forecasts.append({'ds': pd.to_datetime(next_date), 'yhat': y_pred})
        # Update last_row for next iteration
        new_row = last_row.copy()
        new_row['date'] = pd.to_datetime(next_date)
        new_row['units_sold'] = y_pred
        new_row['lag1'] = last_row['units_sold'].values[0]
        new_row['lag7'] = last_row['lag6'].values[0] if 'lag6' in last_row else 0
        last_row = new_row
    forecast_df = pd.DataFrame(forecasts)
    return forecast_df

def calculate_stockout_date(current_inventory, forecast_df):
    """Calculate when inventory will be depleted based on forecasted sales."""
    # Use the entire forecast, not just dates after now
    cumulative_sales = forecast_df['yhat'].cumsum()
    stockout_mask = cumulative_sales > current_inventory
    if stockout_mask.any():
        stockout_date = forecast_df.loc[stockout_mask.idxmax(), 'ds']
        return stockout_date
    return None

def main():
    # Load data
    try:
        df = load_data('input_data.csv')
    except FileNotFoundError:
        print("Error: input_data.csv not found. Please ensure the file exists in the current directory.")
        return
    
    # Get unique SKUs
    skus = df['sku_id'].unique()
    
    # Create output dataframe
    results = []
    
    for sku in skus:
        # Get current inventory for this SKU
        current_inventory = df[df['sku_id'] == sku]['inventory_level'].iloc[-1]
        
        # Generate forecast
        forecast_df_prophet = forecast_sku_sales_prophet(df, sku)
        forecast_df_xgb = forecast_sku_sales_xgb(df, sku)
        
        # Calculate stockout date
        stockout_date_prophet = calculate_stockout_date(current_inventory, forecast_df_prophet)
        stockout_date_xgb = calculate_stockout_date(current_inventory, forecast_df_xgb)
        
        # Get last 30 days of forecasted sales (regardless of date)
        last_30_prophet = forecast_df_prophet.tail(30)
        last_30_xgb = forecast_df_xgb.tail(30)
        # Calculate average daily sales for the last 30 forecasted days
        avg_daily_sales_prophet = last_30_prophet['yhat'].mean()
        avg_daily_sales_xgb = last_30_xgb['yhat'].mean()
        # Determine if restock alert is needed
        restock_alert_prophet = False
        restock_alert_xgb = False
        if stockout_date_prophet and (stockout_date_prophet - forecast_df_prophet['ds'].iloc[0]).days <= 14:
            restock_alert_prophet = True
        if stockout_date_xgb and (stockout_date_xgb - forecast_df_xgb['ds'].iloc[0]).days <= 14:
            restock_alert_xgb = True
        results.append({
            'SKU_ID': sku,
            'Prophet_Avg_Daily_Sales_Next_30_Days': round(avg_daily_sales_prophet, 2),
            'Prophet_Estimated_Stockout_Date': stockout_date_prophet.strftime('%Y-%m-%d') if stockout_date_prophet else 'No stockout projected',
            'Prophet_Restock_Alert': 'Yes' if restock_alert_prophet else 'No',
            'XGB_Avg_Daily_Sales_Next_30_Days': round(avg_daily_sales_xgb, 2),
            'XGB_Estimated_Stockout_Date': stockout_date_xgb.strftime('%Y-%m-%d') if stockout_date_xgb else 'No stockout projected',
            'XGB_Restock_Alert': 'Yes' if restock_alert_xgb else 'No'
        })
    
    # Create and save results
    results_df = pd.DataFrame(results)
    results_df.to_csv('inventory_forecast_results.csv', index=False)
    print("Forecast complete. Results saved to 'inventory_forecast_results.csv'")

if __name__ == "__main__":
    main() 