<?php

namespace ProtectorCalculator;

class Shortcode
{
    const SHORTCODE = 'fence-calculator';

    public function __construct()
    {
        // register the shortcode
        add_shortcode(self::SHORTCODE, [$this, 'render_shortcode']);
        add_action('wp_head', [$this, 'my_custom_styles']);
    }

    public function render_shortcode()
    {
        //if (is_user_logged_in()) {

            wp_register_script("pc-modernizr", plugins_url("../static/dist/js/libs/modernizr.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-combined", plugins_url("../static/dist/js/combined.min.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-jqform", plugins_url("../static/dist/js/libs/jquery.form.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-snap", plugins_url("../static/dist/js/libs/snap.svg.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-underscore", plugins_url("../static/dist/js/libs/underscore.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-backbone", plugins_url("../static/dist/js/libs/backbone.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-marionette", plugins_url("../static/dist/js/libs/backbone.marionette.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-data", plugins_url("../static/dev/js/calculator-data.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-model", plugins_url("../static/dev/js/calculator-model.js", __FILE__), array(), "1.1", false);
            wp_register_script("pc-form", plugins_url("../static/dev/js/calculator-form.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-plan", plugins_url("../static/dev/js/calculator-plan.js", __FILE__), array(), "1.0", false);
            wp_register_script("pc-summary", plugins_url("../static/dev/js/calculator-summary.js", __FILE__), array(), "1.1", false);
            wp_register_script("pc-init", plugins_url("../static/dev/js/calculator-init.js", __FILE__), array(), "1.0", false);

            wp_enqueue_script('pc-modernizr');
            wp_enqueue_script('pc-combined');
            wp_enqueue_script('pc-jqform');
            wp_enqueue_script('pc-snap');
            wp_enqueue_script('pc-underscore');
            wp_enqueue_script('pc-backbone');
            wp_enqueue_script('pc-marionette');
            wp_enqueue_script('pc-data');
            wp_enqueue_script('pc-model');
            wp_enqueue_script('pc-form');
            wp_enqueue_script('pc-plan');
            wp_enqueue_script('pc-summary');
            wp_enqueue_script('pc-init');

            wp_register_style('pc-calculator', plugins_url("../static/dist/css/core.css", __FILE__), array(), "1.0", "all");
            wp_register_style('pc-modal', plugins_url("../static/dist/css/light-modal.css", __FILE__), array(), "1.0", "all");
            wp_enqueue_style('pc-calculator');
            wp_enqueue_style('pc-modal');

            $system = new System();
            $system_data = $system->system_data();
            $component_mapping = $system->component_mapping();

            ob_start();
            include __DIR__ . '/views/calculator.php';
            $output = ob_get_clean();

            wp_reset_postdata();
            return $output;

//        } else {
//
//            echo '<div class="padding-both70"><div class="container"><div class="row"><div class="col-md-6 text-style5">'
//                .'<h2>Coming Soon</h2>'
//                .'</div></div></div></div>';
//
//        }
    }

    function my_custom_styles()
    {
        $custom_css = get_field('additional_css', 'option');
        $color_light = get_field('colour_light', 'option');
        $color_mid = get_field('colour_mid', 'option');
        $color_dark = get_field('colour_dark', 'option');
        $background_body = get_field('background_body', 'option');
        $background_lightest = get_field('background_lightest', 'option');
        $background_light = get_field('background_light', 'option');
        $background_mid = get_field('background_mid', 'option');
        $background_dark = get_field('background_dark', 'option');
        $button_primary = get_field('button_primary', 'option');

        $inline_css = "";

        if ($custom_css) :
            $inline_css .= strip_tags($custom_css);
        endif;

        $inline_css .= '.calculator .calculator__plan { background: none !important; }';
        
        if ($background_body) :
            $inline_css .= '.calculator h1 { background: ' . $background_body . ' !important; }';
        endif;
        
        if ($color_light) :
            $inline_css .= '.calculator input, .calculator select, .calculator textarea { color: ' . $color_light . ' !important; }';
            $inline_css .= '.calculator__option { color: ' . $color_light . ' !important; }';
        endif;
        
        if ($color_mid) :
            $inline_css .= '.calculator blockquote, .calculator blockquote a, .calculator blockquote a:visited, .calculator h2 { color: ' . $color_mid . ' !important; }';
        endif;
        
        if ($color_dark) :
            $inline_css .= '.calculator .calculator__title { color:  ' . $color_dark . '; }';
            $inline_css .= '.calculator td { border-bottom: 1px solid ' . $color_dark . ' !important; border-right: none !important; }';
            $inline_css .= '.calculator .accordion--selector__arrow:before { border-top: 5px solid ' . $color_dark . ' !important; }';
            $inline_css .= '.calculator .accordion__title.accordion-is-expanded .accordion--selector__arrow:before { border-top: 0 !important; }';

            $inline_css .= '.calculator .accordion--selector .accordion__title.accordion-is-expanded, .calculator .accordion--selector .accordion__title.accordion-is-expanded:before, .calculator .accordion--selector .accordion__title.accordion-is-expanded .accordion--selector__arrow { border-color: ' . $color_dark . ' !important; }';
            $inline_css .= '.calculator .accordion--selector .accordion__content.accordion-is-expanded { border-bottom: 1px solid ' . $color_dark . ' !important; }';
            $inline_css .= '.calculator .accordion--selector .accordion__content.accordion-is-expanded, .calculator .accordion--selector .accordion__content.accordion-is-expanded { color: ' . $color_dark . '  !important; }';
        endif;
        
        if ($background_lightest) :
            $inline_css .= '.calculator #calculator-plan-big { background: #fff !important; }';
            $inline_css .= '.calculator .calculator__select-selected { background: ' . $background_lightest . ' !important; }';
            $inline_css .= '.calculator .calculator__graphics__summary { background: ' . $background_lightest . ' !important; }';
            $inline_css .= '.calculator .calculator__summary__img, .calculator .calculator__summary__product { background: ' . $background_lightest . ' !important; }';
            $inline_css .= '.calculator .calculator__summary__price { background: ' . $background_lightest . ' !important; }';
            $inline_css .= '.calculator .pill--selected, .calculator .pill:focus, .calculator .pill:hover { background: ' . $background_lightest . ' !important; }';

            $inline_css .= '.calculator .accordion--selector .accordion__content.accordion-is-expanded, .calculator .accordion--selector .accordion__title.accordion-is-expanded { background: ' . $background_lightest . ' !important; }';

        endif;
        
        if ($background_light) :
            $inline_css .= '.calculator .calculator__summary__length, .calculator .calculator__summary__side { background: none !important; border: none !important; }';
            $inline_css .= '.calculator .td--unstyled { background: none !important; border: 0; }';
            $inline_css .= '.calculator .calculator__additional__img, .calculator .calculator__additional__product { background: none !important; }';
            $inline_css .= '.calculator td.calculator__print__hidden, .calculator td.calculator__terms__copy { background: none !important; }';
            $inline_css .= '.calculator__additional td { background: none;  }';
            $inline_css .= '.calculator td, .calculator th.th--blue { background: ' . $background_light . ' !important; }';
            $inline_css .= '.calculator .calculator__additional__comment { background: ' . $background_light . ' !important; }';
            $inline_css .= '.calculator .calculator__summary__estimate, .calculator .calculator__summary__total { background: ' . $background_light . ' !important; }';
        endif;
        
        if ($background_mid) :
            $inline_css .= '.calculator .calculator__bunnings a { color: #fff !important; background: ' . $background_mid . ' !important; }';
            $inline_css .= '.calculator .calculator__email__cell { background: none !important; border: 0px !important; padding: 0 !important; height: 100%; }';
            $inline_css .= '.calculator .btn, .calculator .btn:visited { background: ' . $background_mid . ' !important; }';
            $inline_css .= '.calculator .accordion--selector__button, .calculator .accordion--selector__button:focus, .calculator .accordion--selector__button:hover { color: #fff !important; background: ' . $background_mid . ' !important; }';
            $inline_css .= '.calculator .calculator__select-selected { border: 1px solid ' . $background_mid . ' !important; }';
            $inline_css .= '.calculator .Field-borders, .calculator input[type=date], .calculator input[type=datetime], .calculator input[type=email], .calculator input[type=month], .calculator input[type=number], .calculator input[type=password], .calculator input[type=tel], .calculator input[type=text], .calculator input[type=time], .calculator input[type=url], .calculator input[type=week], .calculator textarea, .calculator .styled-select select { border: 1px solid ' . $background_mid . ' !important; }';
        endif;
        
        if ($background_dark) :
            $inline_css .= '.calculator .calculator__ctas { background: ' . $background_dark . ' !important; }';
        endif;
        
        if ($button_primary) :
            $inline_css .= '.calculator .calculator__ctas__estimate a, .calculator__ctas__bunnings a, .calculator__ctas__print a { color: #fff !important; border: 1px solid #fff; background: ' . $button_primary . ' !important; }';
        endif;

        echo "<style>" . $inline_css . "</style>";
    }
}