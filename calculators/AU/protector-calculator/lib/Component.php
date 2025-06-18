<?php

namespace ProtectorCalculator;

class Component
{
    const POST_TYPE_SLUG = 'component';

    public function __construct()
    {
        $this->register_post_type();
        $this->register_custom_fields();
    }

    /**
     * Register the post type
     */
    private function register_post_type()
    {
        register_post_type(
            self::POST_TYPE_SLUG,
            [
                'labels' => [
                    'name'               => _x( 'Component', 'Post Type Name - Plural' ),
                    'singular_name'      => _x( 'Component', 'Post Type Name' ),
                    'menu_name'          => _x( 'Components', 'Post Type Menu Name' ),
                    'add_new'            => _x( 'Add New', 'Post Type Add New'),
                    'add_new_item'       => _x( 'Add New Component', 'Add New Item' ),
                    'new_item'           => _x( 'New Component', 'New Item' ),
                    'edit_item'          => _x( 'Edit Component', 'Edit Item' ),
                    'view_item'          => _x( 'View Component', 'View Item' ),
                    'all_items'          => _x( 'All Components', 'All Items' ),
                    'search_items'       => _x( 'Search Components', 'Search Items' ),
                    'parent_item_colon'  => _x( 'Parent Component', 'Parent Items' ),
                    'not_found'          => _x( 'No Components Found', 'No Items Found' ),
                    'not_found_in_trash' => _x( 'No Components found in Trash', 'No Items Found In Trash' ),
                ],
                'description'          => _x( 'Posts for the Component page', 'Post Type Description' ),
                'public'               => true,
                'publicly_queryable'   => false,
                'hierarchical'         => true,
                'supports'             => [
                    'title',
                    'revisions',
                    'page-attributes'
                ],
                'menu_icon' => 'dashicons-list-view',
                'taxonomies' => ['category'],
                'has_archive'          => false,
                'has_singular'         => false,
                'rewrite'              => [
                    'slug' => self::POST_TYPE_SLUG,
                ],
            ]
        );
    }

    /**
     * Register ACF fields for the review group
     */
    private function register_custom_fields()
    {
        if( function_exists('acf_add_local_field_group') ):

            acf_add_local_field_group(array (
                'key' => 'group_5ac5a917a691d',
                'title' => 'Component',
                'fields' => array (
                    array (
                        'key' => 'field_5ac5a91defe7a',
                        'label' => 'Part Number',
                        'name' => 'part_number',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => 128,
                    ),
                    array (
                        'key' => 'field_5ac5aa50efe7b',
                        'label' => 'Bunnings Number',
                        'name' => 'bunnings_number',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => 128,
                    ),
                    array (
                        'key' => 'field_5ac5aac2efe7d',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'textarea',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'maxlength' => '',
                        'rows' => 6,
                        'new_lines' => 'wpautop',
                    ),
                    array (
                        'key' => 'field_5ac5aaedefe7e',
                        'label' => 'Price',
                        'name' => 'price',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => 128,
                    ),
                    array (
                        'key' => 'field_5ac5ab19efe80',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'instructions' => 'Image (or icon) displayed beside component. Recommended dimensions: 52px(w) x 56px(h).',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'return_format' => 'array',
                        'preview_size' => 'thumbnail',
                        'library' => 'all',
                        'min_width' => '',
                        'min_height' => '',
                        'min_size' => '',
                        'max_width' => '',
                        'max_height' => '',
                        'max_size' => '',
                        'mime_types' => '',
                    ),
                    array (
                        'key' => 'field_5ac5ab6fefe82',
                        'label' => 'Width',
                        'name' => 'panel_width',
                        'type' => 'number',
                        'instructions' => 'If this component is a panel or handrail enter it\'s width here so the calculator can select the correct size.',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ae9a4290c78c',
                        'label' => 'Pack Size',
                        'name' => 'units',
                        'type' => 'number',
                        'instructions' => 'Number of items included in pack',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'placeholder' => '',
                        'prepend' => '',
                        'append' => '',
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ae94eff7e13a',
                        'label' => 'Other Pack Sizes',
                        'name' => 'quantities',
                        'type' => 'repeater',
                        'instructions' => 'Alternate quantities',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'collapsed' => '',
                        'min' => 0,
                        'max' => 0,
                        'layout' => 'table',
                        'button_label' => '',
                        'sub_fields' => array (
                            array (
                                'key' => 'field_5ae9a3649b53e',
                                'label' => 'Quantity',
                                'name' => 'quantity',
                                'type' => 'number',
                                'instructions' => 'Number of items included in pack',
                                'required' => 0,
                                'conditional_logic' => 0,
                                'wrapper' => array (
                                    'width' => '50',
                                    'class' => '',
                                    'id' => '',
                                ),
                                'default_value' => '',
                                'placeholder' => '',
                                'prepend' => '',
                                'append' => '',
                                'min' => '',
                                'max' => '',
                                'step' => '',
                            ),
                            array (
                                'key' => 'field_5ae9a39b9b53f',
                                'label' => 'Component',
                                'name' => 'quantity_component',
                                'type' => 'relationship',
                                'instructions' => 'Alternate quantity component',
                                'required' => 0,
                                'conditional_logic' => 0,
                                'wrapper' => array (
                                    'width' => '50',
                                    'class' => '',
                                    'id' => '',
                                ),
                                'post_type' => array (
                                    0 => 'component',
                                ),
                                'taxonomy' => array (
                                ),
                                'filters' => array (
                                    0 => 'search',
                                ),
                                'elements' => '',
                                'min' => '',
                                'max' => 1,
                                'return_format' => 'object',
                            ),
                        ),
                    ),
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'component',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
                'hide_on_screen' => '',
                'active' => 1,
                'description' => '',
            ));

        endif;
    }

}