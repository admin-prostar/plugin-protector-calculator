<?php

namespace ProtectorCalculator;

class System
{
    const POST_TYPE_SLUG = 'system';

    public function __construct()
    {
        $this->register_post_type();
        $this->register_custom_fields();
        add_filter( 'acf/fields/relationship/result', [$this, 'register_relationship_result'], 10, 4);
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
                    'name'               => _x( 'System', 'Post Type Name - Plural' ),
                    'singular_name'      => _x( 'System', 'Post Type Name' ),
                    'menu_name'          => _x( 'Systems', 'Post Type Menu Name' ),
                    'add_new'            => _x( 'Add New', 'Post Type Add New'),
                    'add_new_item'       => _x( 'Add New System', 'Add New Item' ),
                    'new_item'           => _x( 'New System', 'New Item' ),
                    'edit_item'          => _x( 'Edit System', 'Edit Item' ),
                    'view_item'          => _x( 'View System', 'View Item' ),
                    'all_items'          => _x( 'All Systems', 'All Items' ),
                    'search_items'       => _x( 'Search Components', 'Search Items' ),
                    'parent_item_colon'  => _x( 'Parent Systems', 'Parent Items' ),
                    'not_found'          => _x( 'No Systems Found', 'No Items Found' ),
                    'not_found_in_trash' => _x( 'No Systems found in Trash', 'No Items Found In Trash' ),
                ],
                'description'          => _x( 'Posts for the System page', 'Post Type Description' ),
                'public'               => true,
                'publicly_queryable'   => false,
                'hierarchical'         => true,
                'supports'             => [
                    'title',
                    'revisions',
                    'page-attributes'
                ],
                'menu_icon' => 'dashicons-category',
                'taxonomies' => [],
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
                'key' => 'group_5ad2d0883068e',
                'title' => 'System',
                'fields' => array (
                    array (
                        'key' => 'field_5ad2d0a6b9449',
                        'label' => 'Heading',
                        'name' => 'heading',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 1,
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
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d6dbb944a',
                        'label' => 'Subheading',
                        'name' => 'subheading',
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
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5add687d776a0',
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
                        'rows' => '',
                        'new_lines' => 'wpautop',
                    ),
                    array (
                        'key' => 'field_5ad310759d653',
                        'label' => 'System Type',
                        'name' => 'system_type',
                        'type' => 'select',
                        'instructions' => '',
                        'required' => 1,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'choices' => array (
                            'pool-fencing' => 'Pool Fence',
                            'balustrading' => 'Balustrade',
                            'wire-balustrading' => 'Wire Balustrade',
                        ),
                        'default_value' => array (
                        ),
                        'allow_null' => 1,
                        'multiple' => 0,
                        'ui' => 0,
                        'ajax' => 0,
                        'return_format' => 'value',
                        'placeholder' => '',
                    ),
                    array (
                        'key' => 'field_5ae118c5662eb',
                        'label' => 'Image',
                        'name' => 'image',
                        'type' => 'image',
                        'instructions' => 'Image displayed on system selection. Recommended dimensions: 950px(w) x 800px(h).',
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
                        'key' => 'field_5ad2d6e3b944b',
                        'label' => 'Icon Code',
                        'name' => 'icon_code',
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
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d74bb944c',
                        'label' => 'Icon Colour',
                        'name' => 'icon_colour',
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
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5af11d83f8a49',
                        'label' => 'Icon Image',
                        'name' => 'icon_image',
                        'type' => 'image',
                        'instructions' => 'Optional background image for system icons.',
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
                        'key' => 'field_5ad2d78db944d',
                        'label' => 'Channel',
                        'name' => 'channel',
                        'type' => 'true_false',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'message' => '',
                        'default_value' => 0,
                        'ui' => 1,
                        'ui_on_text' => '',
                        'ui_off_text' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d850b944e',
                        'label' => 'Minimum Gap',
                        'name' => 'min_gap',
                        'type' => 'number',
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
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d899b944f',
                        'label' => 'Maximum Gap',
                        'name' => 'max_gap',
                        'type' => 'number',
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
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d95e7ecd2',
                        'label' => 'Wall Spacing',
                        'name' => 'wall_spacing',
                        'type' => 'number',
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
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d96c7ecd3',
                        'label' => 'Wall Fixing',
                        'name' => 'wall_fixing',
                        'type' => 'number',
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
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ad2d8afb9450',
                        'label' => 'Gate Width',
                        'name' => 'gate_width',
                        'type' => 'number',
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
                        'min' => '',
                        'max' => '',
                        'step' => '',
                    ),
                    array (
                        'key' => 'field_5ad30c88703f2',
                        'label' => 'Posts',
                        'name' => 'posts',
                        'type' => 'relationship',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'post_type' => array (
                            0 => 'component',
                        ),
                        'taxonomy' => array (
                            0 => 'category:post',
                        ),
                        'filters' => array (
                            0 => 'search',
                        ),
                        'elements' => '',
                        'min' => '',
                        'max' => '',
                        'return_format' => 'object',
                    ),
                    array (
                        'key' => 'field_5ad30c9c703f3',
                        'label' => 'Panels',
                        'name' => 'panels',
                        'type' => 'relationship',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'post_type' => array (
                            0 => 'component',
                        ),
                        'taxonomy' => array (
                            0 => 'category:panel',
                        ),
                        'filters' => array (
                            0 => 'search',
                        ),
                        'elements' => '',
                        'min' => '',
                        'max' => '',
                        'return_format' => 'object',
                    ),
                    array (
                        'key' => 'field_5ad2d9787ecd4',
                        'label' => 'Components',
                        'name' => 'components',
                        'type' => 'relationship',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'post_type' => array (
                            0 => 'component',
                        ),
                        'taxonomy' => array (
                            0 => 'category:component',
                        ),
                        'filters' => array (
                            0 => 'search',
                        ),
                        'elements' => '',
                        'min' => '',
                        'max' => '',
                        'return_format' => 'object',
                    ),
                    array (
                        'key' => 'field_5ad30cb2703f4',
                        'label' => 'Additonal Items',
                        'name' => 'additionals',
                        'type' => 'relationship',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'post_type' => array (
                            0 => 'component',
                        ),
                        'taxonomy' => array (
                            0 => 'category:additional',
                        ),
                        'filters' => array (
                            0 => 'search',
                        ),
                        'elements' => '',
                        'min' => '',
                        'max' => '',
                        'return_format' => 'object',
                    ),
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'system',
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

    /**
     * Append description to ACF component results
     */
    public function register_relationship_result( $title, $post, $field, $post_id ) {

        // load a custom field from this $object and show it in the $result
        $description = get_field('description', $post->ID);

        // append to title
        $title = '[' . $title . '] ' . $description;

        // return
        return $title;
    }


    /**
     * Returns an array of system data for calculator use
     */
    public function system_data()
    {
        $system_data = [];

        $systems = get_posts(array(
            'posts_per_page'	=> -1,
            'post_type'			=> 'system',
            'orderby' => 'menu_order',
            'order' => 'ASC'
        ));

        if( $systems ):
            foreach( $systems as $system ):

                $systemId = $system->ID;
                $parentId = $system->post_parent;

                // Get finishes
                $finish = "";
                $finishes = get_the_terms($systemId, "finish");
                if (count($finishes) === 1) :
                    if (isset($finishes[0])) :
                        $finish = $finishes[0]->name;
                    endif;
                elseif (count($finishes) > 1) :
                    $finish = [];
                    foreach($finishes as $finishType) :
                        $finish[] = $finishType->name;
                    endforeach;
                endif;

                // Get panel widths
                $panelWidths = [];
                if ($panels = get_field('panels', $systemId)) :
                    foreach ($panels as $panel) :
                        $panelId = $panel->ID;
                        // Ignore panels with subcategories (gates, hinges etc)
                        $categories = get_the_category($panelId);
                        if (count($categories) === 1) :
                            $panelWidths[] = intval(get_field('panel_width', $panelId));
                        endif;
                    endforeach;
                endif;

                $system_type = get_field('system_type', $systemId);
                if (strstr($system_type, "balustrading")) $system_type = "balustrading";

                if ($system_type != "" && !isset($system_data[$system_type])) :
                    $system_data[$system_type] = [];
                endif;

                if (get_field('max_gap', $systemId) !== "") :
                    $gap = [
                        'min' => intval(get_field('min_gap', $systemId)),
                        'max' => intval(get_field('max_gap', $systemId))
                    ];
                else:
                    $gap = intval(get_field('min_gap', $systemId));
                endif;

                $systemType = get_field('system_type', $systemId);

                $sizeDifference = (!isset($panelWidths[0]) || $systemType === "wire-balustrading") ? 1 : $panelWidths[0] - $panelWidths[1];

                $systemImage = get_field('image', $systemId);
                $systemImage = (!empty($systemImage)) ? $systemImage['url'] : get_template_directory_uri() . "/static/img/calculator/" . $system->post_title . ".jpg";

                $system_data[get_field('system_type', $systemId)][$system->post_title] = [
                    'id' => $systemId,
                    'post_parent' => $parentId,
                    'title' => get_field('heading', $systemId),
                    'subTitle' => get_field('subheading', $systemId),
                    'systemType' => $systemType,
                    'systemImage' => $systemImage,
                    'iconCode' => get_field('icon_code', $systemId),
                    'iconColour' => get_field('icon_colour', $systemId),
                    'finishes' => $finish,
                    'sizes' => $panelWidths,
                    'sizeDifference' => $sizeDifference,
                    'channel' => get_field('channel', $systemId),
                    'gap' => $gap,
                    // TODO: Add max_gap where applicable
                    'wallSpacing' => intval(get_field('wall_spacing', $systemId)),
                    'wallFixing' => intval(get_field('wall_fixing', $systemId)),
                    'gateWidth' => intval(get_field('gate_width', $systemId)),
                    'description' => get_field('description', $systemId)
                ];

            endforeach;
        endif;

        return $system_data;
    }

    /**
     * Returns an array mapping systems to component sets
     */
    public function component_mapping()
    {
        $component_mapping = [];

        $systems = get_posts(array(
            'posts_per_page'	=> -1,
            'post_type'			=> 'system',
            'orderby' => 'menu_order',
            'order' => 'ASC'
        ));

        if( $systems ):
            foreach( $systems as $system ):
                $systemId = $system->ID;
                foreach (["components", "panels", "posts"] as $type) :
                    if ($components = get_field($type, $systemId)) :
                        foreach ($components as $component) :
                            $componentId = $component->ID;
                            $categories = get_the_category($componentId);
                            foreach ($categories as $category):

                                if (!isset($component_mapping[$type])):
                                    $component_mapping[$type] = [];
                                endif;

                                if ($type == "panels" && count($categories) == 1):
                                    $component_mapping[$type][get_the_title($systemId) . "-" . get_field("panel_width", $componentId)] = get_field('part_number', $componentId);
                                elseif ($category->category_parent != 0) :
                                    // Only use second part of hyphenated categories
                                    $cat_array = explode("-", $category->slug);
                                    $category_slug = (!in_array($category->slug, ["corner-hinge", "corner-latch", "corner-handrail", "handrail-bracket", "minipost-6", "wire-pack", "terminal-pack"])) ? array_pop($cat_array) : $category->slug;
                                    if (isset($component_mapping[$type][get_the_title($systemId) . "-" . $category_slug])) :
                                        if (!is_array($component_mapping[$type][get_the_title($systemId) . "-" . $category_slug])):
                                            $first_element = $component_mapping[$type][get_the_title($systemId) . "-" . $category_slug];
                                            $component_mapping[$type][get_the_title($systemId) . "-" . $category_slug] = [];
                                            $component_mapping[$type][get_the_title($systemId) . "-" . $category_slug][] = $first_element;
                                        endif;
                                        $component_mapping[$type][get_the_title($systemId) . "-" . $category_slug][] = get_field('part_number', $componentId);
                                    else:
                                        $component_mapping[$type][get_the_title($systemId) . "-" . $category_slug] = get_field('part_number', $componentId);
                                    endif;
                                endif;

                            endforeach;
                        endforeach;
                    endif;
                endforeach;

                // Additionals
                $type = "additionals";
                $components = get_field($type, $systemId);
                if (is_array($components)):
                    foreach ($components as $component) :
                        $componentId = $component->ID;
                        if (!isset($component_mapping[$type])):
                            $component_mapping[$type] = [];
                        endif;
                        if (!isset($component_mapping[$type][get_the_title($systemId)])):
                            $component_mapping[$type][get_the_title($systemId)] = [];
                        endif;

                        $component_mapping[$type][get_the_title($systemId)][] = get_field('part_number', $componentId);
                    endforeach;
                endif;

            endforeach;
        endif;

        return $component_mapping;
    }

}