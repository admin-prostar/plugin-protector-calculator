=== Protector Fence Calculator ===

Generate a list of fence components from specified dimensions

## Installation

1. Backup database and uploads directory
2. Upload the plugin to the `/wp-content/plugins/` directory
3. Activate plugin from Wordpress admin panel


## Imports

- Import media, components and systems
    * Go to Tools -> Import
    * ** If no importers are available then install & activate Wordpress Importer plugin in 3rd party directory (https://en-au.wordpress.org/plugins/wordpress-importer/) **
    * Under "Wordpress" select Run Importer
    * Import items in the following order...
        1. Import media (/data/protectorfencecalculator.media.2018-06-21.xml)
        2. Import components (/data/protectorfencecalculator.components.2018-06-20.xml)
        3. Import systems (/data/protectorfencecalculator.systems.2018-06-20.xml)

- Import calculator settings
    * Go to Tools -> Import
    * If "options" importer is not available then install & activate WP Options Importer plugin in 3rd party directory (https://wordpress.org/plugins/options-importer/) **
    * Under "Options" select Run Importer
    * Import settings (/data/protectorfencecalculator.wp_options.2018-06-21.json)
    * Under "What would you like to import?" heading select "Specific Options
    * Select all options prefixed with "options_". For example...
        * options_additional_css
        * options_background_body
        * ...
        * options_pool_fence_image
    * Keep "Override existing options" unchecked