# Inventory Forecasting Script

This script uses Facebook's Prophet to forecast when SKUs will go out of stock based on historical sales data and current inventory levels.

## Requirements

- Python 3.7+
- Required packages (install using `pip install -r requirements.txt`):
  - pandas
  - numpy
  - prophet

## Input Data Format

The script expects a CSV file named `input_data.csv` with the following columns:
- `sku_id`: Unique identifier for each SKU
- `date`: Date of the sales record (YYYY-MM-DD format)
- `units_sold`: Number of units sold on that date
- `inventory_level`: Current inventory level for the SKU

## Usage

1. Prepare your input data in the required CSV format
2. Place the CSV file in the same directory as the script
3. Run the script:
   ```bash
   python inventory_forecast.py
   ```

## Output

The script generates a CSV file named `inventory_forecast_results.csv` containing:
- SKU ID
- Average daily sales forecast for the next 30 days
- Estimated stockout date
- Restock alert (Yes/No) if stockout is projected within 14 days

## Notes

- The script uses Prophet's default parameters with daily, weekly, and yearly seasonality enabled
- Forecasts are generated for 30 days into the future
- A restock alert is triggered if the estimated stockout date is within 14 days 