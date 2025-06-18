<?php
for ( $i = 0; $i < $depth = 10; $i ++ ) {
    $wp_root_path = str_repeat( '../', $i );

    if ( file_exists( "{$wp_root_path}wp-load.php" ) ) {
        require_once( "{$wp_root_path}wp-load.php" );
        require_once( "{$wp_root_path}wp-admin/includes/admin.php" );
        break;
    }
}

$panels = (array) @$_POST['panels'];
$posts = (array) @$_POST['posts'];
$components_post = (array) @$_POST['components'];
$system_id = @$_POST['system_id'];
$sides = @$_POST['sides'];
$joins = @$_POST['joins'];

?>
<table class="table--responsive" cellspacing="0" cellpadding="0">
    <tbody>

    <?php
    /**
     * Loop through panels
     */
    $component_groups = [
        'panels' => $panels,
        'posts' => $posts,
        'components' => $components_post
    ];

    // Add child products to the component array. Not the most elegant/efficient solution but it will do for now.
    foreach($component_groups as $group => $selections):
        foreach($selections as $component => $qty):
            if ($qty > 0):

                $components = get_posts(array(
                    'post_type' => 'component',
                    'title' => @strtolower($component)
                ));

                if ($components) :

                    $cid = $components[0]->ID;

                    // Check for child components and add "additionals" array
                    $childComponents = get_children([
                        'post_parent' => $cid,
                        'post_type' => 'component',
                        'numberposts' => -1
                    ]);

                    if (count($childComponents)) {
                        foreach ($childComponents as $childComponent) {
                            // Get categories
                            $componentId = $childComponent->ID;
                            $categories = get_the_category($componentId);
                            $componentCategory = (count($categories)) ? $categories[0]->slug . "s" : 'additionals';

                            if ($componentCategory == "additionals") {
                                $mapping['additionals'][$system_id][] = get_field('part_number', $childComponent);
                            } else {
                                // Add onto current group
                                $subcategory = (isset($categories[1])) ? $categories[1]->slug : false;
                                $packsize = get_field('units', $componentId);

                                if ($subcategory == "corner-handrail") {
                                    $childQty = ($sides < 4) ? $sides - 1 : $sides;
                                } else if ($subcategory == "handrail-bracket") {
                                    $childQty = ceil($joins / $packsize);
                                } else {
                                    $childQty = 1;
                                }
                                $component_groups[$componentCategory][get_the_title($componentId)] = $childQty;
                            }
                        }
                    }

                    // Handle alternate pack size
                    $packsizes = get_field('quantities', $cid);

                    if ($packsizes != "") {
                        $packquantity = $packsizes[0]['quantity'];
                        $packcomponent = $packsizes[0]['quantity_component'];
                        $partnumber = $packcomponent[0]->post_title;
                        $postcount = $component_groups[$group][$component];
                        $component_groups[$group][$component] = $component_groups[$group][$component] % $packquantity;
                        $component_groups[$group][$partnumber] = floor($postcount / $packquantity);
                    }

                    // Handle default pack sizes
                    $packsize = get_field('units', $cid);
                    if ($packsize > 1) {
                        $component_groups[$group][$component] = ceil($component_groups[$group][$component] / $packsize);
                    }
                endif;
            endif;
        endforeach;
    endforeach;

    $undefinedComponents = [];

    foreach($component_groups as $group => $selections):
        foreach($selections as $component => $qty):
            if ($qty > 0):

                $components = get_posts(array(
                    'post_type' => 'component',
                    'title' => @strtolower($component)
                ));

                if ($components) :

                    $cid = $components[0]->ID;
                    $attributeArray = [];
                    $finishes = get_the_terms($cid, "finish");
                    $packsize = get_field('units', $cid);

                    if (isset($finishes[0]) && $finishes[0]->name != "") $attributeArray[] = $finishes[0]->name;
                    if ($packsize > 1) $attributeArray[] = $packsize . "-Pack";
                    $attributes = (count($attributeArray)) ? "<span style='white-space: nowrap;'>(" . implode(" | ", $attributeArray) . ")</span>" : "";
                    ?>

                    <tr class="screen">
                        <td colspan="11" class="calculator__email__cell" style="line-height: 1px; font-size: 1px;">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" style="display: block;" width="100%" height="1">-->
                        </td>
                    </tr>

                    <tr class="calculator__email__hidden screen">
                        <td class="calculator__email__cell" colspan="6">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" bgcolor="#d2eefe">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" colspan="2" bgcolor="#d2eefe">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                    </tr>

                    <tr>
                        <td class="calculator__summary__img table-responsive-image" style="width:65px; padding: 0px; color: #1f2b51;">
                            <?php
                            $image = get_field('image', $cid);
                            if (!empty($image)):
                                $filename = $image['url'];
                                $filestyle = "display: block; margin: 0 auto !important; height: 78px; padding-top: 0px;";
                            else:
                                $fileslug = (strstr(get_field('description', $cid), "Mini-Post")) ? "post-mini" : substr($group, 0, -1);
                                $filename = plugin_dir_url(dirname(__FILE__)) . '../static/img/calculator/' . $fileslug . '.png';
                                $filestyle = "display: block; margin: 0 auto !important; height: 56px;";
                            endif;
                            ?>
                            <a href="#img-<?php echo $cid; ?>"><img height="56" src="<?php echo $filename; ?>" alt="Panel" style="<?php echo $filestyle; ?>" /></a>
                            <!-- image modal -->
                            <div class="light-modal" id="img-<?php echo $cid; ?>" role="dialog" aria-labelledby="light-modal-label" aria-hidden="false">
                                <div class="basic light-modal-content animated">
                                    <img src="<?php echo $filename; ?>" alt="Panel" style="display: block; margin: 0 auto; padding: 20px;">
                                    <a href="#" class="light-modal-close-icon" aria-label="close">x</a>
                                </div>
                            </div>
                        </td>
                        <td class="calculator__email__cell">
                            <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="25" style="display: block; width: 100%;"></td>
                        <td class="calculator__summary__product table-responsive-product" style= "width:207px; font-weight: bold; color: #1f2b51; font-size: 14px; font-family: sans-serif;">
                            <?php echo get_the_title($cid); ?> <?php echo strip_tags(get_field('description', $cid)) . $attributes; ?><br>
                            <span class="default-font">Bunnings No. <?php the_field('bunnings_number', $cid); ?></span>
                        </td>
                        <td class="calculator__email__cell screen">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__summary__price table-responsive-price" style="width: 80px; color: #1f2b51; font-size: 14px; font-family: sans-serif;">$<?php echo (get_field('price', $cid)) ? number_format(get_field('price', $cid), 2, '.', '') : 0; ?></td>
                        <td class="calculator__email__cell screen">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell " width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__summary__qty table-responsive-qty" style="width:90px; text-align:center; color: #1f2b51; font-size: 20px; font-weight: bold; font-family: sans-serif;" bgcolor="#d2eefe">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 0;">
                                <tr>
                                    <td class="calculator__email__cell screen tablet-hidden" width="5">&nbsp;</td>
                                    <td class="calculator__email__cell">x <?php echo htmlentities($qty);?></td>
                                    <td class="calculator__email__cell screen tablet-hidden" width="5">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                        <td class="calculator__email__cell screen" width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell calculator__email__cell__light screen" bgcolor="#d2eefe">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__summary__subtotal table-responsive-subtotal" style="text-align:right; color: #1f2b51; font-size: 24px; font-family: sans-serif; padding: 20px;" bgcolor="#d2eefe">$<span class="sub_total"><?php echo number_format((get_field('price', $cid) * htmlentities($qty)), 2, '.', ''); ?></span></td>
                    </tr>

                    <tr class="calculator__email__hidden screen">
                        <td class="calculator__email__cell" colspan="6">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" bgcolor="#d2eefe">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" width="1">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" width="1" height="100%" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell" colspan="2" bgcolor="#d2eefe">
                            <!--                            <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                    </tr>
                <?php
                else:
                    // Handle undefined components
                    if ($component != "undefined") :
                        $undefinedComponents[$group][$component] = $qty;
                    endif;
                endif;
            endif;
        endforeach;
    endforeach;
    ?>

    </tbody>
    <tfoot>

    <tr class="screen">
        <td colspan="11" class="calculator__email__cell" style="line-height: 1px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/table-border-dark.gif" alt="" style="display: block; width: 100%;" height="1"></td>
    </tr>

    <tr class="calculator__email__hidden screen">
        <td class="calculator__email__cell">&nbsp;</td>
        <td colspan="5" class="calculator__email__cell" bgcolor="#2AB0E4" style="line-height: 10px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;"></td>
        <td class="calculator__email__cell" width="1"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/table-border-dark.gif" alt="" width="1" height="100%" style="display: block;"></td>
        <td colspan="4" class="calculator__email__cell" bgcolor="#2AB0E4" style="line-height: 10px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;"></td>
    </tr>

    <tr>
        <td class="td--unstyled table-responsive-hide"></td>
        <td colspan="4" class="calculator__summary__estimate table-responsive-hide" style="font-size: 20px; font-family: sans-serif;" align="center" bgcolor="#2ab0e4">Estimate*</td>
        <td class="calculator__email__cell calculator__email__cell__dark screen" bgcolor="#2AB0E4">
            <!--                <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
        </td>
        <td class="calculator__email__cell screen" width="1" bgcolor="#2AB0E4">
            <!--                <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border-dark.gif" alt="" width="1" height="100%" style="display: block;">-->
        </td>
        <td colspan="4" class="calculator__summary__total table-responsive-estimate" style="font-size: 41px; font-family: sans-serif; padding: 20px;" align="right" bgcolor="#2ab0e4">
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 0;">
                <tr>
                    <td class="calculator__email__cell screen tablet-hidden" width="5">&nbsp;</td>
                    <td class="calculator__email__cell"><sup style="font-size:20px;">$</sup> <span id="grand_total"></span></td>
                    <td class="calculator__email__cell screen tablet-hidden" width="5">&nbsp;</td>
                </tr>
            </table>
        </td>
    </tr>

    <tr class="calculator__email__hidden screen">
        <td class="calculator__email__cell">&nbsp;</td>
        <td colspan="5" class="calculator__email__cell" bgcolor="#2AB0E4" style="line-height: 10px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;"></td>
        <td class="calculator__email__cell" width="1"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/table-border-dark.gif" alt="" width="1" height="100%" style="display: block;"></td>
        <td colspan="4" class="calculator__email__cell" bgcolor="#2AB0E4" style="line-height: 10px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;"></td>
    </tr>

    <tr class="screen">
        <td colspan="11" class="calculator__email__cell" style="line-height: 10px; font-size: 1px;"><img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;"></td>
    </tr>

    <?php if (count($undefinedComponents)) : ?>
        <tr style="border: 1px solid #333;">
            <td style="background: #eee !important; border: 0;" class=""></td>
            <td colspan="10" style="background: #eee !important; border: 0; padding: 20px 0;" class="">
                <h4 style="font-family: sans-serif;">The following items are available by special order only:</h4>
                <ul style="padding-left: 20px;">
                <?php
                foreach($undefinedComponents as $group => $selections):
                    foreach($selections as $component => $qty):
                        if (strstr($component, "-") && $group == "panels") :
                            $componentArray = explode("-", $component);
                            $componentWidth = $componentArray[1];
                            $componentTitle = "Glass Pool Panel (" . $componentWidth . "W" . " x 1200H 12mm) x " . $qty;
                        else:
                            $componentTitle = ucfirst($group) . " | x" . $qty;
                        endif;
                        echo "<li class='table-responsive-product' style='font-weight: bold; color: #1f2b51; font-size: 14px; font-family: sans-serif;'>" . $componentTitle . "</li>";
                    endforeach;
                endforeach;
                ?>
                </ul>
                <p style="font-size: 14px; margin-top: -10px !important; font-family: sans-serif;"><?php echo get_field('special_order_contact', 'option'); ?></p>
            </td>
        </tr>
    <?php endif; ?>

    <tr>
        <td style="background: none; border: 0;" class="calculator__print__hidden"></td>
        <td colspan="10" style="background: none; border: 0; padding: 20px 0;" class="calculator__terms__copy">
            <p class="calculator__summary__disclaimer" style="font-size:12px; font-family: sans-serif;">* All items calculated are estimates only and the price list is based on RRP. Please confirm final components, quantities and prices with your Bunnings Team Member prior to placing your order.</p>
            <p class="calculator__summary__disclaimer" style="font-size:12px; font-family: sans-serif;"><strong>Check Local Regulatory Requirements:</strong> Before installing your pool fence or balustrade check information provided by your local council to ensure it complies with any local by-laws.</p>
        </td>
    </tr>

    </tfoot>
</table>

<div class="calculator__additional">

    <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="30" style="display: block; width: 100%;" class="screen">

    <h2 style="color: #1f2b51; font-size: 20px; font-family: sans-serif; font-weight: normal;"><i class="icon icon_plus" style="font-size: 15px; margin-right: 5px; margin-top: -4px;"></i> What else you may need</h2>

    <p>To install your glass fence, you may need a tape measure, a chalk reel, a power drill and drill bits, suitable fixing hardware, a spirit level, and safety wear (boots, glasses and clothing)<?php echo (isset($mapping['additionals'][$system_id])) ? ", plus the following products:" : "."; ?></p>

    <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;">

    <!--    <table cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #b0e2f9;">-->
    <table cellpadding="0" cellspacing="0" width="100%">
        <tbody>
        <?php
        if (isset($mapping['additionals'][$system_id])):
            foreach($mapping['additionals'][$system_id] as $additional):

                $components = get_posts(array(
                    'post_type' => 'component',
                    'title' => $additional
                ));

                if ($components) :
                    $cid = $components[0]->ID;

                    $finishes = get_the_terms($cid, "finish");
                    $finish = (isset($finishes[0]) && $finishes[0]->name != "") ? " (" . $finishes[0]->name . ")" : "";
                    ?>

                    <tr class="screen">
                        <td colspan="8" class="calculator__email__cell" style="line-height: 1px; font-size: 1px;">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/table-border.gif" alt="" style="display: block;" width="100%" height="1">-->
                        </td>
                    </tr>

                    <tr class="calculator__email__hidden screen">
                        <td colspan="6" class="calculator__email__cell" style="line-height: 10px; font-size: 1px;">
                            <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;">
                        </td>
                        <td bgcolor="#d2eefe">
                            <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;">
                        </td>
                        <td bgcolor="#d2eefe">
                            <img src="<?php echo $pluginsUrl; ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="10" style="display: block; width: 100%;">
                        </td>
                    </tr>

                    <tr>

                        <?php
                        $image = get_field('image', $cid);
                        if (!empty($image)):
                            $filename = $image['url'];
                            $filestyle = "display: block; margin: 0 auto !important; height: 78px; padding-top: 0px;";
                            ?>
                            <td style="padding: 0px;" class="calculator__additional__img">
                                <a href="#img-<?php echo $cid; ?>"><img src="<?php echo $filename; ?>" alt="Panel" style="<?php echo $filestyle; ?>" /></a>
                                <!-- image modal -->
                                <div class="light-modal" id="img-<?php echo $cid; ?>" role="dialog" aria-labelledby="light-modal-label" aria-hidden="false">
                                    <div class="basic light-modal-content animated">
                                        <img src="<?php echo $filename; ?>" alt="Panel" style="display: block; margin: 0 auto; padding: 20px;">
                                        <a href="#" class="light-modal-close-icon" aria-label="close">x</a>
                                    </div>
                                </div>
                            </td>
                            <?php
                        else:
                            $fileslug = (strstr(get_field('description', $cid), "Mini-Post")) ? "post-mini" : substr($group, 0, -1);
                            $filename = plugin_dir_url(dirname(__FILE__)) . '../static/img/calculator/' . $fileslug . '.png';
                            $filestyle = "display: block; margin: 0 auto !important; height: 56px;";
                            ?>
                            <td class="calculator__additional__img">Additional</td>
                            <?php
                        endif;
                        ?>

                        <td class="calculator__email__cell screen">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell screen">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell screen">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__additional__product" style="color: #1f2b51; font-size: 14px; font-family: sans-serif; padding: 20px;"><?php echo get_the_title($cid); ?> <?php echo strip_tags(get_field('description', $cid)) . "<span style='white-space: nowrap;'>" . $finish . "</span>"; ?><br>
                            <span class="default-font">Bunnings No. <?php the_field('bunnings_number', $cid); ?></span>
                        </td>
                        <td class="calculator__email__cell calculator__additional__comment screen">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__email__cell calculator__additional__comment screen" bgcolor="#d2eefe">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="25" style="display: block;">-->
                        </td>
                        <td class="calculator__additional__comment" style="font-family: sans-serif; padding: 20px; <?php if (get_field('price', $cid)) { ?>font-size: 24px; color: #1f2b51;<?php } ?>" bgcolor="#d2eefe"><?php echo (get_field('price', $cid)) ? "$" . number_format(get_field('price', $cid), 2, '.', '') : "Available at Bunnings"; ?></td>
                    </tr>

                    <tr class="calculator__email__hidden screen">
                        <td colspan="6" class="calculator__email__cell" style="line-height: 10px; font-size: 1px;">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td bgcolor="#d2eefe">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                        <td bgcolor="#d2eefe">
                            <!--                        <img src="--><?php //echo get_template_directory_uri(); ?><!--/static/img/calculator/email/spacer.gif" alt="" width="100%" height="10" style="display: block;">-->
                        </td>
                    </tr>

                    <?php
                endif;
            endforeach;
        endif;
        ?>
        </tbody>
    </table>
</div>