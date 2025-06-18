# Protector Fence Calculator Tools

This directory contains various tools for managing the Protector Fence Calculator WordPress plugin data.

## Setup

1. Create a Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

## Available Tools

### 1. Database Setup (`db_setup.py`)

Creates and initializes the SQLite database with the required tables.

```bash
python db_setup.py
```

This will create a `calculator.db` file in the tools directory with the following tables:
- components
- systems
- system_components
- media
- options

### 2. Generate XML Files (`generate_xml.py`)

Generates WordPress-compatible XML files from the SQLite database.

```bash
python generate_xml.py
```

This will create the following files in the `other/data/AU` directory:
- `protectorfencecalculator.components.{date}.xml`
- `protectorfencecalculator.systems.{date}.xml`
- `protectorfencecalculator.media.{date}.xml`
- `protectorfencecalculator.wp_options.{date}.json`

### 3. Update Prices (`update_prices.py`)

Updates component prices in the XML file using a Bunnings price list CSV.

```bash
python update_prices.py
```

Requirements:
- Bunnings price list CSV file in `other/bunnings_items_pricing/bunnings_prices-AU.csv`
- Components XML file in `other/data/AU/protectorfencecalculator.components.{date}.xml`
- Systems XML file in `other/data/AU/protectorfencecalculator.systems.{date}.xml`

Outputs:
- Updated components XML file
- Price update report in `other/reports/AU/price_updates_{timestamp}.csv`
- Missing items report in `other/reports/AU/missing_prices_{timestamp}.csv`

The missing items report includes:
- Bunnings number
- Title
- Current price
- Description
- Units (pack size)
- Panel width
- Finish type
- Systems using the item
- Related items

### 4. Import Options (`import_options.py`)

Imports WordPress options from a JSON file into the SQLite database.

```bash
python import_options.py
```

Requirements:
- WordPress options JSON file in `other/data/AU/protectorfencecalculator.wp_options.{date}.json`

## Importing into WordPress

After generating the XML and JSON files, follow these steps to import into WordPress:

1. Import media:
   - Go to Tools -> Import
   - Select "WordPress" importer
   - Import `protectorfencecalculator.media.{date}.xml`

2. Import components:
   - Go to Tools -> Import
   - Select "WordPress" importer
   - Import `protectorfencecalculator.components.{date}.xml`

3. Import systems:
   - Go to Tools -> Import
   - Select "WordPress" importer
   - Import `protectorfencecalculator.systems.{date}.xml`

4. Import options:
   - Go to Tools -> Import
   - Select "Options" importer
   - Import `protectorfencecalculator.wp_options.{date}.json`
   - Select all options prefixed with "options_"
   - Keep "Override existing options" unchecked

## Notes

- Always backup your WordPress database and uploads directory before importing
- The XML files are generated with timestamps to prevent overwriting existing files
- The price update tool generates detailed reports to help identify missing or problematic items
- Make sure to activate the required WordPress plugins (WordPress Importer and WP Options Importer) before importing 