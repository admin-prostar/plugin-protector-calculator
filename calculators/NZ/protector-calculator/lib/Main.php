<?php

namespace ProtectorCalculator;

class Main
{
    private static $instance = false;
    static $init_complete = false;

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'rest_api_init']);
//        add_filter( 'wp_mail_content_type', [$this, 'set_email_content_type']);
//        add_action('wp_mail_failed', [$this, 'onMailError'], 10, 1 );
    }

    /**
     * Fires after WordPress has finished loading but before any headers are sent.
     *
     * Most of WP is loaded at this stage, and the user is authenticated. WP continues to load on the init
     * hook that follows (e.g. widgets), and many plugins instantiate themselves on it for all sorts
     * of reasons (e.g. they need a user, a taxonomy, etc.).
     */
    public static function init()
    {
        if ( ! self::$init_complete ) {

            self::$init_complete = true;

            // Register Post Types
            new Component();
            new System();
            new Settings();

            // Register Taxonomies
            new Finish();

            // Shortcodes
            new Shortcode();
        }
    }

    /**
     * Function to instantiate our class and make it a singleton
     */
    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    public function rest_api_init()
    {
        register_rest_route('calculator/v1', '/components/', array(
            'methods' => 'POST',
            'callback' => [$this, 'get_components']
        ));

        register_rest_route('calculator/v1', '/send/', array(
            'methods' => 'POST',
            'callback' => [$this, 'send_components']
        ));
    }

    /**
     * Return component table
     */
    public function get_components(\WP_REST_Request $request)
    {
        $system = new System();
        $mapping = $system->component_mapping();

        header('Content-Type: text/html');
        include( plugin_dir_path( __FILE__ ) . 'views/components.php');
        exit;
    }

    /**
     * Email component table
     */
    public function send_components(\WP_REST_Request $request)
    {
        $to = $_POST['email'];
        $subject = 'Fence Calculator - Component Summary';
        $body = str_replace('\"', '"', $_POST['component_list']);

        // Replace off brand colours
        $body = str_replace('#d2eefe', '#eeeeee', $body);
        $body = str_replace('#2ab0e4', '#cccccc', $body);
        $body = str_replace('#2AB0E4', '#cccccc', $body);

        // Strip lightbox html to avoid duplicate images
        $body = preg_replace('/<div class=\"basic light-modal-content(.*?)<\/div>/is', '', $body);

        $header = '<table width="100%" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td align="center" bgcolor="#000000">
            <table width="590" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td colspan="2"><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="15"></td>
            </tr>
            <tr>
            <td align="left"><img src="https://thearchitectschoice.com.au/wp-content/themes/The-Architects-Choice/images/logo-1-2.png" style="display:block;" alt="The Architects Choice" height="37"></td>
            <td align="right">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="12"></td>
            </tr>
            <tr>
            <td align="right"><!-- tagline --></td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td colspan="2"><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="25"></td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td bgcolor="#ffffff" align="center">
            <table width="590" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="25"></td>
            </tr>
            <tr>
            <td align="left">
            <h1 style="font-size: 22px; font-weight: normal; font-family: sans-serif; color: #000000;">Estimate Details</h1>';

        $footer = '</td>
            </tr>
            <tr>
            <td><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="25"></td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td align="center" bgcolor="#000000">
            <table width="590" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
            <td colspan="2"><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="40"></td>
            </tr>
            <tr>
            <td align="left" style="font-size: 14px; color: #f6f3e8; font-family: sans-serif;"></td>
            <td align="right" style="font-size: 14px; color: #f6f3e8; font-family: sans-serif;">The Architects Choice</td>
            </tr>
            <tr>
            <td colspan="2"><img src="' . plugins_url() . '/protector-calculator/static/img/calculator/email/spacer.gif" style="display:block;" alt="" width="100%" height="40"></td>
            </tr>
            </table>
            </td>
            </tr>
            </table>';

        $body = $header . $body . $footer;

        $headers = array('Content-Type: text/html; charset=UTF-8','From: The Architects Choice <support@thearchitectschoice.com.au>');

        wp_mail( $to, $subject, $body, $headers );

        return "success";
    }
}