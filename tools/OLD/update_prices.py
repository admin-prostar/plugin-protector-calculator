import xml.etree.ElementTree as ET
import csv
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Set
from collections import defaultdict

def normalize_bunnings_number(number: str) -> str:
    """Normalize Bunnings number by removing colons and leading/trailing whitespace."""
    if not number:
        return ""
    return number.replace(":", "").strip()

def load_prices_from_csv(csv_path: Path) -> Dict[str, float]:
    """Load prices from CSV file into a dictionary."""
    prices = {}
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        # Read first line to get header
        header = f.readline().strip().split(',')
        item_col = header[0]  # Should be "Item #"
        price_col = header[1]  # Should be "RZ1(AUD)"
        
        # Reset file pointer
        f.seek(0)
        reader = csv.DictReader(f)
        for row in reader:
            # Remove the colon from item numbers if present
            item_number = normalize_bunnings_number(row[item_col])
            if not item_number:  # Skip empty item numbers
                continue
            try:
                prices[item_number] = float(row[price_col])
            except (ValueError, KeyError) as e:
                print(f"Warning: Could not process row: {row} - Error: {e}")
    return prices

def get_meta_value(item: ET.Element, meta_key: str) -> str:
    """Extract meta value from item's postmeta elements."""
    for postmeta in item.findall('.//wp:postmeta', {'wp': 'http://wordpress.org/export/1.2/'}):
        key = postmeta.find('wp:meta_key', {'wp': 'http://wordpress.org/export/1.2/'})
        if key is not None and key.text == meta_key:
            value = postmeta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
            if value is not None and value.text:
                return value.text
    return ""

def analyze_dependencies(xml_path: Path, systems_xml_path: Path) -> Dict[str, Dict]:
    """Analyze item dependencies in systems and relationships."""
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Track all items and their relationships
    items = {}
    system_dependencies = defaultdict(set)  # Track which systems use which items
    related_items = defaultdict(set)  # Track items that are commonly used together
    
    # First pass: collect all items
    for item in root.findall('.//item'):
        bunnings_number = None
        title = None
        post_type = None
        
        # Get the item title and type
        title_elem = item.find('.//title')
        if title_elem is not None and title_elem.text:
            title = title_elem.text
            
        type_elem = item.find('.//wp:post_type', {'wp': 'http://wordpress.org/export/1.2/'})
        if type_elem is not None:
            post_type = type_elem.text
            
        # Get Bunnings number
        bunnings_number = normalize_bunnings_number(get_meta_value(item, 'bunnings_number'))
        
        if bunnings_number:
            items[bunnings_number] = {
                'title': title,
                'type': post_type,
                'description': get_meta_value(item, 'description'),
                'units': get_meta_value(item, 'units'),
                'panel_width': get_meta_value(item, 'panel_width'),
                'finish': get_meta_value(item, 'finish'),
                'used_in_systems': set(),
                'related_items': set()
            }
    
    # Second pass: analyze systems XML for dependencies
    if systems_xml_path.exists():
        systems_tree = ET.parse(systems_xml_path)
        systems_root = systems_tree.getroot()
        
        # Look for item references in system configurations
        for system in systems_root.findall('.//item'):
            system_id = None
            system_name = None
            
            # Get system identifier
            title_elem = system.find('.//title')
            if title_elem is not None and title_elem.text:
                system_name = title_elem.text
            
            # Look for component references in system metadata
            for postmeta in system.findall('.//wp:postmeta', {'wp': 'http://wordpress.org/export/1.2/'}):
                meta_key = postmeta.find('wp:meta_key', {'wp': 'http://wordpress.org/export/1.2/'})
                meta_value = postmeta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
                
                if meta_key is not None and meta_value is not None and meta_value.text:
                    # Look for Bunnings numbers in the value
                    for bunnings_number in items.keys():
                        if bunnings_number in meta_value.text:
                            system_dependencies[system_name].add(bunnings_number)
                            if bunnings_number in items:
                                items[bunnings_number]['used_in_systems'].add(system_name)
    
    # Third pass: analyze relationships between items
    for item_number, item_data in items.items():
        description = item_data['description'].lower()
        panel_width = item_data['panel_width']
        
        # Look for related items based on naming patterns and metadata
        for other_number, other_data in items.items():
            if item_number != other_number:
                # Check if items are part of the same system
                if item_data['used_in_systems'] & other_data['used_in_systems']:
                    related_items[item_number].add(other_number)
                    related_items[other_number].add(item_number)
                
                # Check for panel-post relationships
                if 'panel' in description and 'post' in other_data['description'].lower():
                    if panel_width and panel_width in other_data['description']:
                        related_items[item_number].add(other_number)
                        related_items[other_number].add(item_number)
    
    # Update items with related items
    for item_number in items:
        items[item_number]['related_items'] = related_items[item_number]
    
    return items

def update_xml_prices(xml_path: Path, prices: Dict[str, float], output_path: Path, dependencies: Dict[str, Dict]) -> Tuple[List[dict], List[dict]]:
    """Update prices in XML file based on Bunnings numbers."""
    # Parse the XML file
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Track updates and missing items
    updates = []
    not_found = []
    
    # Find all postmeta elements
    for item in root.findall('.//item'):
        bunnings_number = None
        price_meta = None
        title = None
        
        # Get the item title if available
        title_elem = item.find('.//title')
        if title_elem is not None and title_elem.text:
            title = title_elem.text
        
        # Find Bunnings number and price meta elements
        for postmeta in item.findall('.//wp:postmeta', {'wp': 'http://wordpress.org/export/1.2/'}):
            meta_key = postmeta.find('wp:meta_key', {'wp': 'http://wordpress.org/export/1.2/'})
            if meta_key is not None:
                if meta_key.text == 'bunnings_number':
                    meta_value = postmeta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
                    if meta_value is not None and meta_value.text:
                        bunnings_number = normalize_bunnings_number(meta_value.text)
                elif meta_key.text == 'price':
                    price_meta = postmeta
        
        # Update price if we found both bunnings number and price elements
        if bunnings_number and price_meta:
            if bunnings_number in prices:
                price_value = price_meta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'})
                if price_value is not None:
                    old_price = price_value.text
                    new_price = str(prices[bunnings_number])
                    price_value.text = new_price
                    
                    update_info = {
                        'bunnings_number': bunnings_number,
                        'title': title,
                        'old_price': old_price if old_price else '0',
                        'new_price': new_price,
                        'difference': float(new_price) - float(old_price if old_price else '0')
                    }
                    updates.append(update_info)
                    print(f"Updated price for item {bunnings_number} ({title}): ${old_price if old_price else '0'} -> ${new_price}")
            else:
                # Get dependency information
                dep_info = dependencies.get(bunnings_number, {})
                systems = dep_info.get('used_in_systems', set())
                related = dep_info.get('related_items', set())
                
                not_found_info = {
                    'bunnings_number': bunnings_number,
                    'title': title,
                    'current_price': price_meta.find('wp:meta_value', {'wp': 'http://wordpress.org/export/1.2/'}).text,
                    'description': get_meta_value(item, 'description'),
                    'units': get_meta_value(item, 'units'),
                    'panel_width': get_meta_value(item, 'panel_width'),
                    'finish': get_meta_value(item, 'finish'),
                    'used_in_systems': ','.join(sorted(systems)) if systems else '',
                    'related_items': ','.join(sorted(related)) if related else ''
                }
                not_found.append(not_found_info)
                print(f"Price not found for Bunnings number: {bunnings_number} ({title})")
    
    # Save the updated XML
    tree.write(output_path, encoding='utf-8', xml_declaration=True)
    
    return updates, not_found

def write_report(updates: List[dict], not_found: List[dict], report_dir: Path):
    """Write detailed reports about price updates and missing items."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Create report directory if it doesn't exist
    report_dir.mkdir(parents=True, exist_ok=True)
    
    # Write updates report
    updates_file = report_dir / f'price_updates_{timestamp}.csv'
    with open(updates_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['bunnings_number', 'title', 'old_price', 'new_price', 'difference'])
        writer.writeheader()
        for update in sorted(updates, key=lambda x: abs(x['difference']), reverse=True):
            writer.writerow(update)
    
    # Write missing items report with additional fields
    missing_file = report_dir / f'missing_prices_{timestamp}.csv'
    with open(missing_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'bunnings_number', 
            'title', 
            'current_price',
            'description',
            'units',
            'panel_width',
            'finish',
            'used_in_systems',
            'related_items'
        ])
        writer.writeheader()
        
        # Sort items by whether they're used in systems first, then by Bunnings number
        sorted_items = sorted(not_found, 
                            key=lambda x: (not bool(x['used_in_systems']), x['bunnings_number']))
        
        for item in sorted_items:
            writer.writerow(item)
    
    return updates_file, missing_file

def main():
    # Define paths relative to the parent directory
    base_path = Path(__file__).parent.parent
    xml_path = base_path / 'other' / 'data' / 'AU' /'protectorfencecalculator.components.2025-06-17.xml'
    systems_xml_path = base_path / 'other' / 'data' / 'AU' / 'protectorfencecalculator.systems.2025-06-17.xml'
    csv_path = base_path / 'other' / 'bunnings_items_pricing' / 'bunnings_prices-AU.csv'
    output_path = base_path / 'other' / 'data' / 'AU' / 'protectorfencecalculator.components.2025-06-17.updated.xml'
    report_dir = base_path / 'other' / 'reports' / 'AU'
    
    # Load prices from CSV
    print("Loading prices from CSV...")
    prices = load_prices_from_csv(csv_path)
    print(f"Loaded {len(prices)} prices from CSV")
    
    # Analyze dependencies
    print("\nAnalyzing item dependencies...")
    dependencies = analyze_dependencies(xml_path, systems_xml_path)
    print(f"Analyzed dependencies for {len(dependencies)} items")
    
    # Update XML with new prices
    print("\nUpdating XML file...")
    updates, not_found = update_xml_prices(xml_path, prices, output_path, dependencies)
    
    # Write detailed reports
    print("\nGenerating reports...")
    updates_file, missing_file = write_report(updates, not_found, report_dir)
    
    # Print summary
    print(f"\nSummary:")
    print(f"Total prices updated: {len(updates)}")
    print(f"Items not found in price list: {len(not_found)}")
    
    # Print dependency summary
    items_in_use = sum(1 for item in not_found if item['used_in_systems'] or item['related_items'])
    print(f"Missing items still in use: {items_in_use}")
    print(f"Missing items not referenced: {len(not_found) - items_in_use}")
    
    print(f"\nDetailed reports saved to:")
    print(f"- Updates: {updates_file}")
    print(f"- Missing items: {missing_file}")
    print(f"\nUpdated XML saved to: {output_path}")

if __name__ == '__main__':
    main() 