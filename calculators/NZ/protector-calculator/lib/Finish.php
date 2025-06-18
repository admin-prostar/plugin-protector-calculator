<?php

namespace ProtectorCalculator;

class Finish
{
    const TAXONOMY_SLUG = 'finish';

    public function __construct()
    {
        $this->register_taxonomy();
    }

    private function register_taxonomy()
    {
        register_taxonomy(
            self::TAXONOMY_SLUG,
            [
                Component::POST_TYPE_SLUG,
                System::POST_TYPE_SLUG
            ],
            [
                'labels'       => [
                    'name'                       => _x( 'Finish', 'Finish Tax: Name' ),
                    'singular_name'              => _x( 'Finish', 'Finish Tax: Singular Name' ),
                    'menu_name'                  => _x( 'Finishes', 'Finish Tax: Menu Name' ),
                    'all_items'                  => _x( 'All Finishes', 'Finish Tax: All Items' ),
                    'edit_item'                  => _x( 'Edit Finish', 'Finish Tax: Edit Item' ),
                    'view_item'                  => _x( 'View Finish', 'Finish Tax: View Item' ),
                    'update_item'                => _x( 'Update Finish', 'Finish Tax: Update Item' ),
                    'add_new_item'               => _x( 'Add New Finish', 'Finish Tax: Add New Item' ),
                    'new_item_name'              => _x( 'New Finish Name', 'Finish Tax: New Item Name' ),
                    'parent_item'                => _x( 'Parent Finish', 'Finish Tax: Parent Item' ),
                    'parent_item_colon'          => _x( 'Parent Finish:', 'Finish Tax: Parent Item:' ),
                    'search_items'               => _x( 'Search Finishes', 'Finish Tax: Search Items' ),
                    'popular_items'              => _x( 'Popular Finishes', 'Finish Tax: Popular Items' ),
                    'separate_items_with_commas' => _x( 'Separate Finishes with commas', 'Finish Tax: Separate items with comma' ),
                    'add_or_remove_items'        => _x( 'Add or Remove Finishes', 'Finish Tax: add or remove items' ),
                    'choose_from_most_used'      => _x( 'Choose from the most used Finishes', 'Finish Tax: choose from the most used items' ),
                    'not_found'                  => _x( 'No Finishes Found', 'Finish Tax: no items found' ),
                ],
                'description'  => _x( 'Finish', 'Finish Tax: description' ),
                'hierarchical' => false,
                'rewrite'      => [
                    'hierarchical' => false,
                    'with_front'   => false,
                ],
                'hierarchical' => true,
                'show_ui' => true,
                'show_admin_column' => true,
            ]
        );
    }
}
