<?php

namespace ProtectorCalculator;

class Settings
{
    const POST_TYPE_SLUG = 'calculator';

    public function __construct()
    {
        $this->register_custom_fields();
        $this->optionsPage();
    }

    /**
     * Register ACF fields for the review group
     */
    private function register_custom_fields()
    {
        if( function_exists('acf_add_local_field_group') ):

            acf_add_local_field_group(array (
                'key' => 'group_5ae180c5420fa',
                'title' => 'Calculator',
                'fields' => array (
                    array (
                        'key' => 'field_5ae180e18d67e',
                        'label' => 'Intro',
                        'name' => 'intro',
                        'type' => 'wysiwyg',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'tabs' => 'all',
                        'toolbar' => 'basic',
                        'media_upload' => 0,
                        'delay' => 0,
                    ),
                    array (
                        'key' => 'field_5ae269425a103',
                        'label' => 'Heading',
                        'name' => 'heading',
                        'type' => 'text',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => 'An easy to use tool to help plan and cost your project.',
                        'placeholder' => 'An easy to use tool to help plan and cost your project.',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => '',
                    ),
                    array (
                        'key' => 'field_5ae269a55a104',
                        'label' => 'Footnotes',
                        'name' => 'footnotes',
                        'type' => 'wysiwyg',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '',
                        'tabs' => 'all',
                        'toolbar' => 'basic',
                        'media_upload' => 0,
                        'delay' => 0,
                    ),
                    array (
                        'key' => 'field_5af11dd335f65',
                        'label' => 'Pool Fence Image',
                        'name' => 'pool_fence_image',
                        'type' => 'image',
                        'instructions' => 'Pool fence background image. Dimensions: 954px(W) x 430px(H).',
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
                        'key' => 'field_5af11e6a35f66',
                        'label' => 'Balustrade Image',
                        'name' => 'balustrade_image',
                        'type' => 'image',
                        'instructions' => 'Baulstrade background image. Dimensions: 954px(W) x 430px(H).',
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
                        'key' => 'field_5ae260ca89664',
                        'label' => 'Show Bunnings',
                        'name' => 'bunnings',
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
                        'key' => 'field_5b0defbf28b40',
                        'label' => 'Bunnings Link',
                        'name' => 'bunnings_link',
                        'type' => 'text',
                        'instructions' => 'Bunnings URL for product range',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => 'https://www.bunnings.com.au',
                        'placeholder' => 'https://www.bunnings.com.au',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => 100,
                    ),
                    array (
                        'key' => 'field_5b0defbf29c51',
                        'label' => 'Special Order Contact',
                        'name' => 'special_order_contact',
                        'type' => 'text',
                        'instructions' => 'Contact information below special order list',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => 'For enquiries please contact our sales team.',
                        'placeholder' => 'For enquiries please contact our sales team on (xx)xxxx xxxx.',
                        'prepend' => '',
                        'append' => '',
                        'maxlength' => 100,
                    ),
                    array (
                        'key' => 'field_5ae2610c89665',
                        'label' => 'Text (Light)',
                        'name' => 'colour_light',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#2ab0e4',
                    ),
                    array (
                        'key' => 'field_5ae27343e14b1',
                        'label' => 'Text (Mid)',
                        'name' => 'colour_mid',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#006db7',
                    ),
                    array (
                        'key' => 'field_5ae2628a8966a',
                        'label' => 'Text (Dark)',
                        'name' => 'colour_dark',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#1f2b51',
                    ),
                    array (
                        'key' => 'field_5af22b1a7a2be',
                        'label' => 'Body Background',
                        'name' => 'background_body',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#f6f3e8',
                    ),
                    array (
                        'key' => 'field_5ae28b51379e9',
                        'label' => 'Background (Lightest)',
                        'name' => 'background_lightest',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#ccedf4',
                    ),
                    array (
                        'key' => 'field_5ae261b389667',
                        'label' => 'Background (Light)',
                        'name' => 'background_light',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#d2eefe',
                    ),
                    array (
                        'key' => 'field_5ae261d489668',
                        'label' => 'Background (Mid)',
                        'name' => 'background_mid',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#2ab0e4',
                    ),
                    array (
                        'key' => 'field_5ae2620e89669',
                        'label' => 'Background (Dark)',
                        'name' => 'background_dark',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#1f2b51',
                    ),
                    array (
                        'key' => 'field_5ae27780b6120',
                        'label' => 'Button (Primary)',
                        'name' => 'button_primary',
                        'type' => 'color_picker',
                        'instructions' => '',
                        'required' => 0,
                        'conditional_logic' => 0,
                        'wrapper' => array (
                            'width' => '',
                            'class' => '',
                            'id' => '',
                        ),
                        'default_value' => '#a39974',
                    ),
                    array (
                        'key' => 'field_5af11cf3154c0',
                        'label' => 'Additional CSS',
                        'name' => 'additional_css',
                        'type' => 'textarea',
                        'instructions' => 'Additional CSS rules injected into page.',
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
                ),
                'location' => array (
                    array (
                        array (
                            'param' => 'options_page',
                            'operator' => '==',
                            'value' => 'calculator-settings',
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
     * Creates an admin options page
     */
    public function optionsPage() {

        if( function_exists('acf_add_options_page') ) {
            acf_add_options_page(array(
                'page_title' 	=> 'Calculator',
                'menu_title'	=> 'Calculator',
                'menu_slug' 	=> 'calculator-settings',
                'capability'	=> 'edit_posts',
                'redirect'		=> false
            ));
        }

    }

}