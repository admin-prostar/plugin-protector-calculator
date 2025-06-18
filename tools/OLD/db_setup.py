import sqlite3
from pathlib import Path

def create_database():
    """Create SQLite database with necessary tables."""
    db_path = Path(__file__).parent / 'calculator-AU.db'
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create components table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS components (
        id INTEGER PRIMARY KEY,
        post_id INTEGER,
        title TEXT,
        bunnings_number TEXT,
        price REAL,
        description TEXT,
        units TEXT,
        panel_width TEXT,
        finish TEXT,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )
    ''')
    
    # Create systems table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS systems (
        id INTEGER PRIMARY KEY,
        post_id INTEGER,
        title TEXT,
        heading TEXT,
        subheading TEXT,
        description TEXT,
        system_type TEXT,
        icon_code TEXT,
        icon_colour TEXT,
        status TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )
    ''')
    
    # Create system_components table (for relationships)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS system_components (
        system_id INTEGER,
        component_id INTEGER,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (system_id) REFERENCES systems(id),
        FOREIGN KEY (component_id) REFERENCES components(id),
        PRIMARY KEY (system_id, component_id)
    )
    ''')
    
    # Create media table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY,
        post_id INTEGER,
        title TEXT,
        file_path TEXT,
        file_type TEXT,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )
    ''')
    
    # Create component_media table (for relationships)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS component_media (
        component_id INTEGER,
        media_id INTEGER,
        FOREIGN KEY (component_id) REFERENCES components(id),
        FOREIGN KEY (media_id) REFERENCES media(id),
        PRIMARY KEY (component_id, media_id)
    )
    ''')
    
    # Create options table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY,
        option_name TEXT UNIQUE,
        option_value TEXT,
        autoload TEXT DEFAULT 'yes',
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )
    ''')
    
    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_components_bunnings ON components(bunnings_number)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_systems_type ON systems(system_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_media_type ON media(file_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_options_name ON options(option_name)')
    
    conn.commit()
    conn.close()
    
    print(f"Database created at {db_path}")

if __name__ == '__main__':
    create_database() 