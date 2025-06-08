from flask import Flask, render_template, jsonify, request
import pandas as pd
from datetime import datetime, timedelta
import logging
import os
from shopify_integration import ShopifyIntegration
import threading
import time
import json

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
CONFIG_FILE = 'config.json'
DEFAULT_CONFIG = {
    'shopify_enabled': False,
    'shopify_shop_url': '',
    'shopify_access_token': ''
}

def load_config():
    try:
        if os.path.exists(CONFIG_FILE):
            with open(CONFIG_FILE, 'r') as f:
                return json.load(f)
        return DEFAULT_CONFIG
    except Exception as e:
        logger.error(f"Error loading config: {str(e)}")
        return DEFAULT_CONFIG

def save_config(config):
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f)
    except Exception as e:
        logger.error(f"Error saving config: {str(e)}")

# Initialize Shopify integration if enabled
config = load_config()
shopify_integration = None
if config['shopify_enabled'] and config['shopify_shop_url'] and config['shopify_access_token']:
    try:
        shopify_integration = ShopifyIntegration(
            shop_url=config['shopify_shop_url'],
            access_token=config['shopify_access_token']
        )
    except Exception as e:
        logger.error(f"Error initializing Shopify integration: {str(e)}")

ML_FORECAST_FILE = 'inventory_forecast_results.csv'
ALERT_WINDOW_DAYS = 7

def background_sync():
    """Background task to sync orders periodically"""
    if not shopify_integration:
        return
        
    while True:
        try:
            logger.info("Starting background sync with Shopify")
            new_orders = shopify_integration.sync_orders(days=7)
            logger.info(f"Synced {new_orders} new orders from Shopify")
            time.sleep(3600)  # Sync every hour
        except Exception as e:
            logger.error(f"Error in background sync: {str(e)}")
            time.sleep(300)  # Wait 5 minutes before retrying

def check_ml_alerts():
    alerts = []
    try:
        if not os.path.exists(ML_FORECAST_FILE):
            return alerts
        df = pd.read_csv(ML_FORECAST_FILE)
        today = pd.Timestamp(datetime.now().date())
        # Check for each row if either model predicts stockout within ALERT_WINDOW_DAYS
        for _, row in df.iterrows():
            for model_col in ['Prophet_Estimated_Stockout_Date', 'XGB_Estimated_Stockout_Date']:
                if pd.notnull(row[model_col]):
                    try:
                        stockout_date = pd.to_datetime(row[model_col])
                        days_until_stockout = (stockout_date - today).days
                        if 0 <= days_until_stockout <= ALERT_WINDOW_DAYS:
                            alerts.append({
                                'type': 'stockout',
                                'title': 'Stockout Predicted',
                                'message': f"{model_col.replace('_', ' ')} for SKU {row['SKU_ID']} is predicted on {stockout_date.strftime('%Y-%m-%d')} (in {days_until_stockout} days)",
                                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                            })
                    except Exception as e:
                        logger.error(f"Error parsing date for {model_col}: {str(e)}")
    except Exception as e:
        logger.error(f"Error checking ML alerts: {str(e)}")
    return alerts

@app.route('/')
def index():
    try:
        logger.info("Loading main page")
        return render_template('index.html', shopify_enabled=config['shopify_enabled'])
    except Exception as e:
        logger.error(f"Error in index route: {str(e)}")
        return render_template('error.html', error=str(e))

@app.route('/api/config', methods=['GET'])
def get_config():
    try:
        return jsonify(load_config())
    except Exception as e:
        logger.error(f"Error getting config: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/config', methods=['POST'])
def update_config():
    try:
        new_config = request.json
        save_config(new_config)
        
        # Reinitialize Shopify if enabled
        global shopify_integration
        if new_config['shopify_enabled'] and new_config['shopify_shop_url'] and new_config['shopify_access_token']:
            try:
                shopify_integration = ShopifyIntegration(
                    shop_url=new_config['shopify_shop_url'],
                    access_token=new_config['shopify_access_token']
                )
            except Exception as e:
                logger.error(f"Error initializing Shopify integration: {str(e)}")
                return jsonify({"error": "Failed to initialize Shopify integration"}), 500
        else:
            shopify_integration = None
            
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Error updating config: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    try:
        alerts = check_ml_alerts()
        return jsonify(alerts)
    except Exception as e:
        logger.error(f"Error getting alerts: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sync-status', methods=['GET'])
def get_sync_status():
    if not shopify_integration:
        return jsonify({
            'enabled': False,
            'last_sync': None,
            'total_orders': 0
        })
        
    try:
        if os.path.exists('input_data.csv'):
            df = pd.read_csv('input_data.csv')
            last_date = pd.to_datetime(df['date'].max())
            return jsonify({
                'enabled': True,
                'last_sync': last_date.strftime('%Y-%m-%d %H:%M:%S'),
                'total_orders': len(df)
            })
        return jsonify({
            'enabled': True,
            'last_sync': None,
            'total_orders': 0
        })
    except Exception as e:
        logger.error(f"Error getting sync status: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        # Save the uploaded file as the ML forecast file
        file.save(ML_FORECAST_FILE)
        return jsonify({"status": "success"})
    except Exception as e:
        logger.error(f"Error uploading CSV: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    try:
        # Start background sync thread only if Shopify is enabled
        if shopify_integration:
            sync_thread = threading.Thread(target=background_sync, daemon=True)
            sync_thread.start()
        
        logger.info("Starting Flask application on port 5001")
        app.run(host='0.0.0.0', port=5001, debug=True)
    except Exception as e:
        logger.error(f"Error starting Flask application: {str(e)}") 