import sqlite3
from pathlib import Path
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Dict, List
import json

def create_xml_element(parent: ET.Element, tag: str, text: str = None, attrib: Dict = None) -> ET.Element:
    """Create an XML element with optional text and attributes."""
    element = ET.SubElement(parent, tag, attrib or {})
    if text:
        element.text = text
    return element

def create_meta_element(parent: ET.Element, key: str, value: str) -> None:
    """Create a WordPress meta element."""
    postmeta = ET.SubElement(parent, 'wp:postmeta', {'xmlns:wp': 'http://wordpress.org/export/1.2/'})
    create_xml_element(postmeta, 'wp:meta_key', key)
    create_xml_element(postmeta, 'wp:meta_value', value)

def generate_components_xml(conn: sqlite3.Connection, output_path: Path) -> None:
    """Generate components XML file."""
    cursor = conn.cursor()
    
    # Create root element
    root = ET.Element('rss', {
        'version': '2.0',
        'xmlns:excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
        'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:wp': 'http://wordpress.org/export/1.2/'
    })
    
    # Create channel element
    channel = ET.SubElement(root, 'channel')
    create_xml_element(channel, 'title', 'The Architects Choice')
    create_xml_element(channel, 'link', 'https://thearchitectschoice.com.au')
    create_xml_element(channel, 'description')
    create_xml_element(channel, 'pubDate', datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000'))
    create_xml_element(channel, 'language', 'en-AU')
    create_xml_element(channel, 'wp:wxr_version', '1.2')
    
    # Get all components
    cursor.execute('''
    SELECT post_id, title, bunnings_number, price, description, units, panel_width, finish, status
    FROM components
    ORDER BY post_id
    ''')
    
    for row in cursor.fetchall():
        item = ET.SubElement(channel, 'item')
        
        # Basic item information
        create_xml_element(item, 'title', row[1])
        create_xml_element(item, 'link', f'https://thearchitectschoice.com.au/?post_type=component&p={row[0]}')
        create_xml_element(item, 'pubDate', datetime.now().strftime('%a, %d %b %Y %H:%M:%S +0000'))
        create_xml_element(item, 'dc:creator', 'sd3admin')
        create_xml_element(item, 'guid', f'https://thearchitectschoice.com.au/?post_type=component&p={row[0]}')
        create_xml_element(item, 'description')
        create_xml_element(item, 'content:encoded')
        create_xml_element(item, 'excerpt:encoded')
        
        # WordPress specific elements
        create_xml_element(item, 'wp:post_id', str(row[0]))
        create_xml_element(item, 'wp:post_date', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        create_xml_element(item, 'wp:post_date_gmt', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        create_xml_element(item, 'wp:post_modified', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        create_xml_element(item, 'wp:post_modified_gmt', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        create_xml_element(item, 'wp:comment_status', 'closed')
        create_xml_element(item, 'wp:ping_status', 'closed')
        create_xml_element(item, 'wp:post_name', row[1].lower().replace(' ', '-'))
        create_xml_element(item, 'wp:status', row[8])
        create_xml_element(item, 'wp:post_parent', '0')
        create_xml_element(item, 'wp:menu_order', '0')
        create_xml_element(item, 'wp:post_type', 'component')
        create_xml_element(item, 'wp:post_password')
        create_xml_element(item, 'wp:is_sticky', '0')
        
        # Meta values
        create_meta_element(item, 'bunnings_number', row[2])
        create_meta_element(item, 'price', str(row[3]))
        create_meta_element(item, 'description', row[4])
        create_meta_element(item, 'units', row[5])
        create_meta_element(item, 'panel_width', row[6])
        create_meta_element(item, 'finish', row[7])
    
    # Write to file
    tree = ET.ElementTree(root)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Generated components XML at {output_path}")

def generate_systems_xml(conn: sqlite3.Connection, output_path: Path) -> None:
    """Generate systems XML file."""
    cursor = conn.cursor()
    
    # Create root element (same as components)
    root = ET.Element('rss', {
        'version': '2.0',
        'xmlns:excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
        'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:wp': 'http://wordpress.org/export/1.2/'
    })
    
    channel = ET.SubElement(root, 'channel')
    # Add channel elements (same as components)
    
    # Get all systems with their components
    cursor.execute('''
    SELECT s.post_id, s.title, s.heading, s.subheading, s.description, 
           s.system_type, s.icon_code, s.icon_colour, s.status,
           GROUP_CONCAT(sc.component_id || ':' || sc.quantity) as components
    FROM systems s
    LEFT JOIN system_components sc ON s.post_id = sc.system_id
    GROUP BY s.post_id
    ORDER BY s.post_id
    ''')
    
    for row in cursor.fetchall():
        item = ET.SubElement(channel, 'item')
        
        # Basic item information (similar to components)
        create_xml_element(item, 'title', row[1])
        create_xml_element(item, 'link', f'https://thearchitectschoice.com.au/?post_type=system&p={row[0]}')
        # ... (other basic elements)
        
        # WordPress specific elements
        create_xml_element(item, 'wp:post_id', str(row[0]))
        create_xml_element(item, 'wp:post_type', 'system')
        # ... (other wp elements)
        
        # Meta values
        create_meta_element(item, 'heading', row[2])
        create_meta_element(item, 'subheading', row[3])
        create_meta_element(item, 'description', row[4])
        create_meta_element(item, 'system_type', row[5])
        create_meta_element(item, 'icon_code', row[6])
        create_meta_element(item, 'icon_colour', row[7])
        if row[9]:  # components
            create_meta_element(item, 'components', row[9])
    
    # Write to file
    tree = ET.ElementTree(root)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Generated systems XML at {output_path}")

def generate_media_xml(conn: sqlite3.Connection, output_path: Path) -> None:
    """Generate media XML file."""
    cursor = conn.cursor()
    
    # Create root element (same as components)
    root = ET.Element('rss', {
        'version': '2.0',
        'xmlns:excerpt': 'http://wordpress.org/export/1.2/excerpt/',
        'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
        'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
        'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        'xmlns:wp': 'http://wordpress.org/export/1.2/'
    })
    
    channel = ET.SubElement(root, 'channel')
    # Add channel elements (same as components)
    
    # Get all media
    cursor.execute('''
    SELECT post_id, title, file_path, file_type, width, height
    FROM media
    ORDER BY post_id
    ''')
    
    for row in cursor.fetchall():
        item = ET.SubElement(channel, 'item')
        
        # Basic item information
        create_xml_element(item, 'title', row[1])
        create_xml_element(item, 'link', f'https://thearchitectschoice.com.au/?attachment_id={row[0]}')
        # ... (other basic elements)
        
        # WordPress specific elements
        create_xml_element(item, 'wp:post_id', str(row[0]))
        create_xml_element(item, 'wp:post_type', 'attachment')
        # ... (other wp elements)
        
        # Meta values
        create_meta_element(item, '_wp_attached_file', row[2])
        metadata = f'a:5:{{s:5:"width";s:{len(str(row[4]))}:"{row[4]}";s:6:"height";s:{len(str(row[5]))}:"{row[5]}";s:4:"file";s:{len(row[2])}:"{row[2]}";s:5:"sizes";a:0:{{}}s:10:"image_meta";a:11:{{s:8:"aperture";s:1:"0";s:6:"credit";s:0:"";s:6:"camera";s:0:"";s:7:"caption";s:0:"";s:17:"created_timestamp";s:1:"0";s:9:"copyright";s:0:"";s:12:"focal_length";s:1:"0";s:3:"iso";s:1:"0";s:13:"shutter_speed";s:1:"0";s:5:"title";s:0:"";s:11:"orientation";s:1:"0";}}}}'
        create_meta_element(item, '_wp_attachment_metadata', metadata)
    
    # Write to file
    tree = ET.ElementTree(root)
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    print(f"Generated media XML at {output_path}")

def generate_options_json(conn: sqlite3.Connection, output_path: Path) -> None:
    """Generate WordPress options JSON file."""
    cursor = conn.cursor()
    
    # Get all options
    cursor.execute('''
    SELECT option_name, option_value, autoload
    FROM options
    ORDER BY option_name
    ''')
    
    # Convert to WordPress options format
    options_dict = {}
    for row in cursor.fetchall():
        options_dict[row[0]] = {
            'value': row[1],
            'autoload': row[2]
        }
    
    # Write to file
    with open(output_path, 'w') as f:
        json.dump(options_dict, f, indent=2)
    
    print(f"Generated options JSON at {output_path}")

def main():
    base_path = Path(__file__).parent.parent
    db_path = Path(__file__).parent / 'calculator-AU.db'
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    try:
        # Generate XML files
        timestamp = datetime.now().strftime("%Y-%m-%d")
        generate_components_xml(conn, base_path / 'other' / 'data' / 'AU' / f'protectorfencecalculator.components.{timestamp}.xml')
        generate_systems_xml(conn, base_path / 'other' / 'data' / 'AU' / f'protectorfencecalculator.systems.{timestamp}.xml')
        generate_media_xml(conn, base_path / 'other' / 'data' / 'AU' / f'protectorfencecalculator.media.{timestamp}.xml')
        generate_options_json(conn, base_path / 'other' / 'data' / 'AU' / f'protectorfencecalculator.wp_options.{timestamp}.json')
        
        print("XML and JSON generation completed successfully!")
        
    finally:
        conn.close()

if __name__ == '__main__':
    main() 