import xml.etree.ElementTree as ET
import sqlite3
from pathlib import Path
from datetime import datetime
import re

def get_meta_value(item: ET.Element, meta_key: str) -> str:
    """Extract meta value from item's postmeta elements."""
    for postmeta in item.findall('.//wp:postmeta', {'wp': 'http://wordpress.org/export/1.2/'}):
        key = postmeta.find('wp:meta_key', {'wp': 'http://wordpress.org/export/1.2/'})
        if key is not None and key.text == meta_key:
            value = postmeta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
            if value is not None and value.text:
                return value.text
    return ""

def import_components(xml_path: Path, conn: sqlite3.Connection):
    """Import components from XML file into database."""
    tree = ET.parse(xml_path)
    root = tree.getroot()
    cursor = conn.cursor()
    
    for item in root.findall('.//item'):
        post_type = item.find('.//wp:post_type', {'wp': 'http://wordpress.org/export/1.2/'})
        if post_type is None or post_type.text != 'component':
            continue
            
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'})
        title = item.find('.//title')
        status = item.find('.//wp:status', {'wp': 'http://wordpress.org/export/1.2/'})
        
        if not all([post_id, title, status]):
            continue
            
        # Extract component data
        component_data = {
            'post_id': int(post_id.text),
            'title': title.text,
            'bunnings_number': get_meta_value(item, 'bunnings_number'),
            'price': float(get_meta_value(item, 'price') or 0),
            'description': get_meta_value(item, 'description'),
            'units': get_meta_value(item, 'units'),
            'panel_width': get_meta_value(item, 'panel_width'),
            'finish': get_meta_value(item, 'finish'),
            'status': status.text,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Insert into database
        cursor.execute('''
        INSERT OR REPLACE INTO components 
        (post_id, title, bunnings_number, price, description, units, panel_width, finish, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            component_data['post_id'],
            component_data['title'],
            component_data['bunnings_number'],
            component_data['price'],
            component_data['description'],
            component_data['units'],
            component_data['panel_width'],
            component_data['finish'],
            component_data['status'],
            component_data['created_at'],
            component_data['updated_at']
        ))
    
    conn.commit()
    print(f"Imported components from {xml_path}")

def import_systems(xml_path: Path, conn: sqlite3.Connection):
    """Import systems from XML file into database."""
    tree = ET.parse(xml_path)
    root = tree.getroot()
    cursor = conn.cursor()
    
    for item in root.findall('.//item'):
        post_type = item.find('.//wp:post_type', {'wp': 'http://wordpress.org/export/1.2/'})
        if post_type is None or post_type.text != 'system':
            continue
            
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'})
        title = item.find('.//title')
        status = item.find('.//wp:status', {'wp': 'http://wordpress.org/export/1.2/'})
        
        if not all([post_id, title, status]):
            continue
            
        # Extract system data
        system_data = {
            'post_id': int(post_id.text),
            'title': title.text,
            'heading': get_meta_value(item, 'heading'),
            'subheading': get_meta_value(item, 'subheading'),
            'description': get_meta_value(item, 'description'),
            'system_type': get_meta_value(item, 'system_type'),
            'icon_code': get_meta_value(item, 'icon_code'),
            'icon_colour': get_meta_value(item, 'icon_colour'),
            'status': status.text,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Insert into database
        cursor.execute('''
        INSERT OR REPLACE INTO systems 
        (post_id, title, heading, subheading, description, system_type, icon_code, icon_colour, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            system_data['post_id'],
            system_data['title'],
            system_data['heading'],
            system_data['subheading'],
            system_data['description'],
            system_data['system_type'],
            system_data['icon_code'],
            system_data['icon_colour'],
            system_data['status'],
            system_data['created_at'],
            system_data['updated_at']
        ))
        
        # Extract component relationships
        components_meta = get_meta_value(item, 'components')
        if components_meta:
            # Parse components string (format: "component_id:quantity,component_id:quantity")
            for comp in components_meta.split(','):
                if ':' in comp:
                    comp_id, quantity = comp.split(':')
                    cursor.execute('''
                    INSERT OR REPLACE INTO system_components (system_id, component_id, quantity)
                    VALUES (?, ?, ?)
                    ''', (system_data['post_id'], int(comp_id), int(quantity)))
    
    conn.commit()
    print(f"Imported systems from {xml_path}")

def import_media(xml_path: Path, conn: sqlite3.Connection):
    """Import media from XML file into database."""
    tree = ET.parse(xml_path)
    root = tree.getroot()
    cursor = conn.cursor()
    
    for item in root.findall('.//item'):
        post_type = item.find('.//wp:post_type', {'wp': 'http://wordpress.org/export/1.2/'})
        if post_type is None or post_type.text != 'attachment':
            continue
            
        post_id = item.find('.//wp:post_id', {'wp': 'http://wordpress.org/export/1.2/'})
        title = item.find('.//title')
        
        if not all([post_id, title]):
            continue
            
        # Extract media data
        file_path = get_meta_value(item, '_wp_attached_file')
        if not file_path:
            continue
            
        # Parse metadata for dimensions
        metadata = get_meta_value(item, '_wp_attachment_metadata')
        width = height = 0
        if metadata:
            # Extract dimensions using regex
            width_match = re.search(r'"width";s:\d+:"(\d+)"', metadata)
            height_match = re.search(r'"height";s:\d+:"(\d+)"', metadata)
            if width_match and height_match:
                width = int(width_match.group(1))
                height = int(height_match.group(1))
        
        media_data = {
            'post_id': int(post_id.text),
            'title': title.text,
            'file_path': file_path,
            'file_type': file_path.split('.')[-1].lower(),
            'width': width,
            'height': height,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        # Insert into database
        cursor.execute('''
        INSERT OR REPLACE INTO media 
        (post_id, title, file_path, file_type, width, height, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            media_data['post_id'],
            media_data['title'],
            media_data['file_path'],
            media_data['file_type'],
            media_data['width'],
            media_data['height'],
            media_data['created_at'],
            media_data['updated_at']
        ))
    
    conn.commit()
    print(f"Imported media from {xml_path}")

def main():
    base_path = Path(__file__).parent.parent
    db_path = Path(__file__).parent / 'calculator-AU.db'
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    try:
        # Import all XML files
        import_components(base_path / 'other' / 'data' / 'AU' / 'protectorfencecalculator.components.2025-06-17.xml', conn)
        import_systems(base_path / 'other' / 'data' / 'AU' / 'protectorfencecalculator.systems.2025-06-17.xml', conn)
        import_media(base_path / 'other' / 'data' / 'AU' / 'protectorfencecalculator.media.2025-06-16.xml', conn)
        
        print("Import completed successfully!")
        
    finally:
        conn.close()

if __name__ == '__main__':
    main() 