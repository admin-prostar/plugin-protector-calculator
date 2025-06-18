import sqlite3
from pathlib import Path
import csv
from datetime import datetime
from typing import List, Dict, Set

def get_component_dependencies(conn: sqlite3.Connection, component_id: int) -> Dict:
    """Get all dependencies for a component."""
    cursor = conn.cursor()
    
    # Get systems that use this component
    cursor.execute('''
    SELECT s.id, s.title, s.system_type, sc.quantity
    FROM systems s
    JOIN system_components sc ON s.post_id = sc.system_id
    WHERE sc.component_id = ?
    ''', (component_id,))
    systems = cursor.fetchall()
    
    # Get related components (used in same systems)
    cursor.execute('''
    SELECT DISTINCT c.id, c.title, c.bunnings_number
    FROM components c
    JOIN system_components sc ON c.post_id = sc.component_id
    WHERE sc.system_id IN (
        SELECT system_id 
        FROM system_components 
        WHERE component_id = ?
    )
    AND c.post_id != ?
    ''', (component_id, component_id))
    related = cursor.fetchall()
    
    # Get media attachments
    cursor.execute('''
    SELECT m.id, m.title, m.file_path
    FROM media m
    JOIN component_media cm ON m.id = cm.media_id
    WHERE cm.component_id = ?
    ''', (component_id,))
    media = cursor.fetchall()
    
    return {
        'systems': systems,
        'related_components': related,
        'media': media
    }

def analyze_component_removal(conn: sqlite3.Connection, component_id: int) -> Dict:
    """Analyze the impact of removing a component."""
    cursor = conn.cursor()
    
    # Get component details
    cursor.execute('''
    SELECT title, bunnings_number, description, status
    FROM components
    WHERE post_id = ?
    ''', (component_id,))
    component = cursor.fetchone()
    
    if not component:
        return {'error': 'Component not found'}
    
    # Get dependencies
    deps = get_component_dependencies(conn, component_id)
    
    # Analyze impact
    impact = {
        'component': {
            'id': component_id,
            'title': component[0],
            'bunnings_number': component[1],
            'description': component[2],
            'status': component[3]
        },
        'impact': {
            'systems_affected': len(deps['systems']),
            'related_components': len(deps['related_components']),
            'media_attachments': len(deps['media'])
        },
        'details': deps
    }
    
    return impact

def generate_removal_report(conn: sqlite3.Connection, component_ids: List[int]) -> str:
    """Generate a detailed report about component removal impact."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = Path(__file__).parent.parent / 'other' / 'reports' / 'AU' / f'component_removal_{timestamp}.csv'
    
    # Create reports directory if it doesn't exist
    report_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(report_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Component ID',
            'Title',
            'Bunnings Number',
            'Status',
            'Systems Affected',
            'Related Components',
            'Media Attachments',
            'Impact Level',
            'Recommendation'
        ])
        
        for comp_id in component_ids:
            impact = analyze_component_removal(conn, comp_id)
            if 'error' in impact:
                continue
                
            # Determine impact level and recommendation
            impact_level = 'HIGH' if impact['impact']['systems_affected'] > 0 else 'LOW'
            recommendation = 'DO NOT REMOVE' if impact['impact']['systems_affected'] > 0 else 'Safe to remove'
            
            writer.writerow([
                comp_id,
                impact['component']['title'],
                impact['component']['bunnings_number'],
                impact['component']['status'],
                impact['impact']['systems_affected'],
                impact['impact']['related_components'],
                impact['impact']['media_attachments'],
                impact_level,
                recommendation
            ])
    
    return report_path

def main():
    db_path = Path(__file__).parent / 'calculator-AU.db'
    conn = sqlite3.connect(db_path)
    
    try:
        # Example: Analyze specific components
        component_ids = [1, 2, 3]  # Replace with actual component IDs
        report_path = generate_removal_report(conn, component_ids)
        print(f"Removal analysis report generated: {report_path}")
        
    finally:
        conn.close()

if __name__ == '__main__':
    main() 