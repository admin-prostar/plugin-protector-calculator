import sqlite3
import xml.etree.ElementTree as ET
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import csv

def get_meta_value(item: ET.Element, meta_key: str) -> str:
    """Extract meta value from item's postmeta elements."""
    for postmeta in item.findall('.//wp:postmeta', {'wp': 'http://wordpress.org/export/1.2/'}):
        key = postmeta.find('wp:meta_key', {'wp': 'http://wordpress.org/export/1.2/'})
        if key is not None and key.text == meta_key:
            value = postmeta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
            if value is not None and value.text:
                return value.text
    return ""

def write_report(report_dir: Path, region: str, data_type: str, data: List[Dict]) -> None:
    """Write a detailed report of imported data to CSV."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = report_dir / f'{region}_{data_type}_import_{timestamp}.csv'
    
    if not data:
        print(f"No {data_type} data to report for {region}")
        return
        
    # Get all possible fields from the data
    fields = set()
    for item in data:
        fields.update(item.keys())
    
    with open(report_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=sorted(fields))
        writer.writeheader()
        writer.writerows(data)
    
    print(f"Detailed report written to: {report_file}")

def import_components(conn: sqlite3.Connection, xml_path: Path, region: str, report_dir: Path) -> None:
    """Import components from XML file into database."""
    print(f"Importing {region} components...")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    imported_data = []
    
    for item in root.findall('.//item'):
        # Get basic item data
        title = item.find('.//title').text
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'}).text
        
        # Get meta values
        bunnings_number = get_meta_value(item, 'bunnings_number')
        price = get_meta_value(item, 'price')
        description = get_meta_value(item, 'description')
        units = get_meta_value(item, 'units')
        panel_width = get_meta_value(item, 'panel_width')
        finish = get_meta_value(item, 'finish')
        status = get_meta_value(item, 'status') or 'publish'
        
        # Store data for reporting
        component_data = {
            'post_id': post_id,
            'title': title,
            'bunnings_number': bunnings_number,
            'price': price,
            'description': description,
            'units': units,
            'panel_width': panel_width,
            'finish': finish,
            'status': status,
            'region': region,
            'imported_at': now
        }
        imported_data.append(component_data)
        
        # Insert into database
        cursor.execute('''
            INSERT INTO components (
                post_id, title, bunnings_number, price,
                description, units, panel_width, finish,
                status, region, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            post_id, title, bunnings_number, price,
            description, units, panel_width, finish,
            status, region, now, now
        ))
    
    conn.commit()
    print(f"Imported {cursor.rowcount} {region} components")
    
    # Write detailed report
    write_report(report_dir, region, 'components', imported_data)

def import_systems(conn: sqlite3.Connection, xml_path: Path, region: str, report_dir: Path) -> None:
    """Import systems and their components from XML file into database."""
    print(f"Importing {region} systems...")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    imported_data = []
    
    for item in root.findall('.//item'):
        # Get basic item data
        title = item.find('.//title').text
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'}).text
        
        # Get meta values
        heading = get_meta_value(item, 'heading')
        subheading = get_meta_value(item, 'subheading')
        description = get_meta_value(item, 'description')
        system_type = get_meta_value(item, 'system_type')
        icon_code = get_meta_value(item, 'icon_code')
        icon_colour = get_meta_value(item, 'icon_colour')
        status = get_meta_value(item, 'status') or 'publish'
        
        # Get components list
        components_str = get_meta_value(item, 'posts')
        components = []
        if components_str:
            try:
                # Parse the serialized PHP array format
                components_str = components_str.replace('a:', '').replace('{', '').replace('}', '')
                parts = components_str.split(';')
                for part in parts:
                    if part and 's:' in part:
                        comp_id = part.split('"')[1]
                        components.append({'id': comp_id, 'quantity': 1})
            except Exception as e:
                print(f"Warning: Could not parse components for system {title}: {e}")
        
        # Store data for reporting
        system_data = {
            'post_id': post_id,
            'title': title,
            'heading': heading,
            'subheading': subheading,
            'description': description,
            'system_type': system_type,
            'icon_code': icon_code,
            'icon_colour': icon_colour,
            'status': status,
            'region': region,
            'components': json.dumps(components),
            'imported_at': now
        }
        imported_data.append(system_data)
        
        # Insert system
        cursor.execute('''
            INSERT INTO systems (
                post_id, title, heading, subheading, description,
                system_type, icon_code, icon_colour, status,
                region, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            post_id, title, heading, subheading, description,
            system_type, icon_code, icon_colour, status,
            region, now, now
        ))
        
        system_id = cursor.lastrowid
        
        # Insert system components
        for comp in components:
            cursor.execute('''
                INSERT INTO system_components (
                    system_id, component_id, quantity
                ) VALUES (?, ?, ?)
            ''', (system_id, comp['id'], comp['quantity']))
    
    conn.commit()
    print(f"Imported {cursor.rowcount} {region} systems")
    
    # Write detailed report
    write_report(report_dir, region, 'systems', imported_data)

def import_media(conn: sqlite3.Connection, xml_path: Path, region: str, report_dir: Path) -> None:
    """Import media items from XML file into database."""
    print(f"Importing {region} media...")
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    imported_data = []
    
    for item in root.findall('.//item'):
        # Get basic item data
        title = item.find('.//title').text
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'}).text
        
        # Get meta values
        file_path = get_meta_value(item, '_wp_attached_file')
        file_type = get_meta_value(item, '_wp_attachment_metadata')
        
        # Parse width and height from metadata
        width = None
        height = None
        if file_type:
            try:
                metadata = json.loads(file_type)
                if 'width' in metadata:
                    width = metadata['width']
                if 'height' in metadata:
                    height = metadata['height']
            except json.JSONDecodeError:
                pass
        
        # Store data for reporting
        media_data = {
            'post_id': post_id,
            'title': title,
            'file_path': file_path,
            'file_type': file_type,
            'width': width,
            'height': height,
            'region': region,
            'imported_at': now
        }
        imported_data.append(media_data)
        
        # Insert into database
        cursor.execute('''
            INSERT INTO media (
                post_id, title, file_path, file_type,
                width, height, region, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            post_id, title, file_path, file_type,
            width, height, region, now, now
        ))
    
    conn.commit()
    print(f"Imported {cursor.rowcount} {region} media items")
    
    # Write detailed report
    write_report(report_dir, region, 'media', imported_data)

def import_options(conn: sqlite3.Connection, json_path: Path, region: str, report_dir: Path) -> None:
    """Import WordPress options from JSON file into database."""
    print(f"Importing {region} options...")
    
    with open(json_path, 'r') as f:
        options_data = json.load(f)
    
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    imported_data = []
    
    for option_name, option_data in options_data.items():
        # Store data for reporting
        option_info = {
            'option_name': option_name,
            'option_value': option_data['value'],
            'autoload': option_data['autoload'],
            'region': region,
            'imported_at': now
        }
        imported_data.append(option_info)
        
        cursor.execute('''
            INSERT INTO options (
                option_name, option_value, autoload,
                region, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            option_name,
            option_data['value'],
            option_data['autoload'],
            region,
            now, now
        ))
    
    conn.commit()
    print(f"Imported {cursor.rowcount} {region} options")
    
    # Write detailed report
    write_report(report_dir, region, 'options', imported_data)

def main():
    # Define paths
    base_path = Path(__file__).parent.parent
    db_path = base_path / 'tools' / 'calculator-AU.db'
    data_dir = base_path / 'other' / 'data' / 'AU'
    report_dir = base_path / 'other' / 'reports' / 'AU'
    report_dir.mkdir(parents=True, exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    try:
        # Add region column to tables if it doesn't exist
        cursor = conn.cursor()
        for table in ['components', 'systems', 'media', 'options']:
            try:
                cursor.execute(f'ALTER TABLE {table} ADD COLUMN region TEXT')
            except sqlite3.OperationalError:
                # Column already exists
                pass
        conn.commit()
        
        # Process each region
        for region in ['AU', 'NZ']:
            region_dir = data_dir / region
            if not region_dir.exists():
                print(f"\nSkipping {region} - directory not found: {region_dir}")
                continue
                
            print(f"\nProcessing {region} data...")
            
            # Get the most recent XML files for this region
            components_xml = max(region_dir.glob('protectorfencecalculator.components.*.xml'))
            systems_xml = max(region_dir.glob('protectorfencecalculator.systems.*.xml'))
            media_xml = max(region_dir.glob('protectorfencecalculator.media.*.xml'))
            options_json = max(region_dir.glob('protectorfencecalculator.wp_options.*.json'))
            
            print(f"Using files:")
            print(f"- Components: {components_xml}")
            print(f"- Systems: {systems_xml}")
            print(f"- Media: {media_xml}")
            print(f"- Options: {options_json}")
            
            # Import data for this region
            import_components(conn, components_xml, region, report_dir)
            import_systems(conn, systems_xml, region, report_dir)
            import_media(conn, media_xml, region, report_dir)
            import_options(conn, options_json, region, report_dir)
        
        print("\nDatabase population completed successfully!")
        print(f"Detailed reports can be found in: {report_dir}")
        
    except Exception as e:
        print(f"\nError: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    main() 