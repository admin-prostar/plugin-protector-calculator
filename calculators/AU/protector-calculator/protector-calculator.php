<?php
/**
 * Plugin Name: Protector Calculator
 * Description: Pool Fence and Balustrade calculator
 * Version: 1.0.0
 * Author: August
 * Author URI: https://www.august.com.au
 * Text Domain: protector-calculator
 */

namespace ProtectorCalculator;

define( 'CALC_DIRECTORY', trailingslashit( dirname( __FILE__ ) ) );

spl_autoload_register( function( $class ) {
    $exploded_class = explode( "\\", $class );

    if ( count( $exploded_class ) <= 1 ) {
        return;
    }

    $className = array_pop( $exploded_class );
    $namespace = implode( "\\", $exploded_class );

    if ( $namespace != __NAMESPACE__ ) {
        return;
    }

    $path = CALC_DIRECTORY . "lib/{$className}.php";
    if ( file_exists( $path ) ) {
        include( $path );
    }
} );

$calculatorPlugin = \ProtectorCalculator\Main::getInstance();
add_action('init', [$calculatorPlugin, 'init']);