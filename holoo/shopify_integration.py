import shopify
import pandas as pd
from datetime import datetime, timedelta
import logging
import os

logger = logging.getLogger(__name__)

class ShopifyIntegration:
    def __init__(self, shop_url, access_token):
        self.shop_url = shop_url
        self.access_token = access_token
        self.setup_session()

    def setup_session(self):
        """Initialize Shopify session"""
        try:
            shopify.Session.setup(api_key=self.access_token, secret=None)
            session = shopify.Session(self.shop_url, '2024-01', self.access_token)
            shopify.ShopifyResource.activate_session(session)
        except Exception as e:
            logger.error(f"Error setting up Shopify session: {str(e)}")
            raise

    def get_recent_orders(self, days=7):
        """Fetch orders from the last N days"""
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            # Format dates for Shopify API
            start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%S%z')
            end_date_str = end_date.strftime('%Y-%m-%dT%H:%M:%S%z')
            
            # Fetch orders
            orders = shopify.Order.find(
                created_at_min=start_date_str,
                created_at_max=end_date_str,
                status='any',
                limit=250  # Maximum allowed by Shopify
            )
            
            # Process orders into DataFrame
            order_data = []
            for order in orders:
                # Get discount information
                discount_code = None
                discount_amount = 0
                if order.discount_codes:
                    discount_code = order.discount_codes[0].get('code')
                    discount_amount = float(order.discount_codes[0].get('amount', 0))
                
                for item in order.line_items:
                    order_data.append({
                        'order_id': order.id,
                        'sku_id': item.sku,
                        'date': order.created_at.date().isoformat(),
                        'time': order.created_at.time().isoformat(),
                        'units_sold': item.quantity,
                        'inventory_level': None,  # Will be updated by ML model
                        'discount_code': discount_code,
                        'discount_amount': discount_amount,
                        'order_amount': float(order.total_price),
                        'line_item_name': item.title,
                        'line_item_quantity': item.quantity,
                        'currency': order.currency,
                        'order_status': order.financial_status
                    })
            
            return pd.DataFrame(order_data)
            
        except Exception as e:
            logger.error(f"Error fetching orders from Shopify: {str(e)}")
            return pd.DataFrame()

    def save_orders_to_csv(self, df, filename='input_data.csv'):
        """Save orders to CSV file"""
        try:
            # If file exists, append new orders
            if os.path.exists(filename):
                existing_df = pd.read_csv(filename)
                combined_df = pd.concat([existing_df, df]).drop_duplicates(subset=['order_id'])
            else:
                combined_df = df
            
            # Sort by date and time
            combined_df = combined_df.sort_values(['date', 'time'])
            
            # Save to CSV
            combined_df.to_csv(filename, index=False)
            logger.info(f"Saved {len(df)} new orders to {filename}")
            
        except Exception as e:
            logger.error(f"Error saving orders to CSV: {str(e)}")
            raise

    def sync_orders(self, days=7):
        """Main method to sync orders"""
        try:
            df = self.get_recent_orders(days)
            if not df.empty:
                self.save_orders_to_csv(df)
            return len(df)
        except Exception as e:
            logger.error(f"Error syncing orders: {str(e)}")
            return 0 