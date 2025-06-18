import json
import sqlite3
from pathlib import Path
from datetime import datetime

def import_options(json_path: Path, conn: sqlite3.Connection):
    """Import WordPress options from JSON file into database."""
    cursor = conn.cursor()
    
    # Read JSON file
    with open(json_path, 'r') as f:
        options_data = json.load(f)
    
    # Process each option
    for option_name, option_data in options_data.items():
        # Skip non-options_ prefixed items unless specifically requested
        if not option_name.startswith('options_'):
            continue
            
        # Extract option value and autoload status
        option_value = option_data.get('value', '')
        autoload = option_data.get('autoload', 'yes')
        
        # Insert or update option
        cursor.execute('''
        INSERT OR REPLACE INTO options 
        (option_name, option_value, autoload, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ''', (
            option_name,
            option_value,
            autoload,
            datetime.now(),
            datetime.now()
        ))
    
    conn.commit()
    print(f"Imported options from {json_path}")

def export_options(conn: sqlite3.Connection, output_path: Path):
    """Export options from database to JSON file."""
    cursor = conn.cursor()
    
    # Get all options
    cursor.execute('SELECT option_name, option_value, autoload FROM options')
    options = cursor.fetchall()
    
    # Convert to dictionary format
    options_dict = {}
    for option_name, option_value, autoload in options:
        options_dict[option_name] = {
            'value': option_value,
            'autoload': autoload
        }
    
    # Write to JSON file
    with open(output_path, 'w') as f:
        json.dump(options_dict, f, indent=2)
    
    print(f"Exported options to {output_path}")

def main():
    base_path = Path(__file__).parent.parent
    db_path = Path(__file__).parent / 'calculator-AU.db'
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    try:
        # Import options
        options_path = base_path / 'other' / 'data' / 'AU' /'protectorfencecalculator.wp_options.2025-06-17.json'
        if options_path.exists():
            import_options(options_path, conn)
            print("Options import completed successfully!")
        else:
            print(f"Warning: Options file not found at {options_path}")
        
    finally:
        conn.close()

if __name__ == '__main__':
    main() 