<?php
$systemOptions = [];
$finishOptions = [];
$componentOptions = [];

$poolImage = get_field('pool_fence_image', 'option');
$poolImage = (!empty($poolImage) && isset($poolImage['url'])) ? $poolImage['url'] : plugin_dir_url(dirname(__FILE__)) . "../static/img/calculator/calculator-fencing.jpg";

$balustradeImage = get_field('balustrade_image', 'option');
$balustradeImage = (!empty($balustradeImage) && isset($balustradeImage['url'])) ? $balustradeImage['url'] : plugin_dir_url(dirname(__FILE__)) . "../static/img/calculator/calculator-balustrade.jpg";
?>

<!-- Print logo -->
<!--<img src="http://www.everton.com.au/static/everton/img/logo-print.png" alt="Everton" width="100" height="34">-->
<!--<header class="header" role="header"></header>-->

<!-- Stashing Type Images for JS access -->
<div id="poolImage" class="hidden"><?php echo $poolImage; ?> </div>
<div id="balustradeImage" class="hidden"><?php echo $balustradeImage; ?></div>

        <?php
        foreach ($system_data as $type => $systems):
            $systemType = (strstr($type, "balustrading")) ? "balustrading" : $type;

            foreach ($systems as $systemCode => $system):

                // Add system options
                $childSystems = get_children(array(
                    'post_parent' => $system['id'],
                    'post_type' => 'system',
                    'number_posts' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC'
                ));

                if (count($childSystems)) :

                    foreach ($childSystems as $sid => $childSystem) :
                        $key = $childSystem->post_title;
                        if (isset($systemOptions[$systemCode]) && !is_array($systemOptions[$systemCode])) :
                            $systemOptions[$systemCode] = [];
                        endif;
                        $systemOptions[$systemCode][$key] = strip_tags(get_field('subheading', $sid));
                    endforeach;

                else:

                    // System Finishes
                    if (is_array($system['finishes'])):
                        $finishOptions[$systemCode] = [];
                        foreach ($system['finishes'] as $systemFinish) :
                            $finishOptions[$systemCode][] = $systemFinish;
                        endforeach;
                    endif;

                    // TODO: Add a dedicated handrail selector here

                    // Component options
                    $componentOptions[$systemCode] = [];
                    foreach ($component_mapping as $type => $components):
                        foreach ($components as $key => $component) :
                            // Array values from mapping array indicate an option.  Also add singular handrail components.
                            //if ($type != "additionals" && strstr($key, $systemCode) && (is_array($component))) :
                            //if ($type != "additionals" && strstr($key, $systemCode) && (is_array($component) || strstr($key, "-handrail"))) :
                            if ($type != "additionals" && strstr($key, $systemCode) && (is_array($component) || ($key == "ffmb-handrail"))) :

                                $componentArray = (!is_array($component)) ? [$component] : $component;

                                foreach ($componentArray as $component_code):

                                    // Lookup component
                                    $componentItem = get_posts(array(
                                        'post_type' => 'component',
                                        'title' => @strtolower($component_code),
                                        'orderby' => 'menu_order',
                                        'order' => 'ASC'
                                    ));

                                    if ($componentItem) :
                                        $cid = $componentItem[0]->ID;
                                        $finishes = get_the_terms($cid, "finish");
                                        $finish = (count($finishes) > 0) ? $finishes[0]->name : "";
                                        $componentOptions[$systemCode][$key][$component_code] = [
                                            'finish' => $finish,
                                            'description' => strip_tags(get_field('description', $cid))
                                        ];
                                    endif;

                                endforeach;
                            endif;
                        endforeach;
                    endforeach;
                endif;
            endforeach;
        endforeach;

        //echo "<pre>" . print_r($systemOptions, true); exit;
        //echo "<pre>" . print_r($finishOptions, true); exit;
        //echo "<pre>" . print_r($componentOptions, true); exit;
        ?>

        <main class="calculator">
            <div class="container" id="calculator">

                <input type="hidden" name="csrf_token" value="25600818a5dbfd7808f7a03baf982c09437fd9b9">

                <div id="calculator-graphics" class="calculator__graphics calculator-content">

                    <div class="calculator__graphics__select">
                        <a href="#" class="calculator__system-choice js-type" data-type="pool-fencing" data-type-name="Pool Fencing System">

                            <img src="<?php echo $poolImage; ?>" alt="Pool Fencing Systems">
                        <span class="calculator__system-choice__text">
                            <span class="table">
                                <span class="td">Pool Fencing<br> Systems</span>
                            </span>
                        </span>
                        </a>
                        <a href="#" class="calculator__system-choice calculator__system-choice--last js-type" data-type="balustrading" data-type-name="Balustrading System">
                            <img src="<?php echo $balustradeImage; ?>" alt="Balustrading Systems">
                        <span class="calculator__system-choice__text">
                            <span class="table">
                                <span class="td">Balustrading<br> Systems</span>
                            </span>
                        </span>
                        </a>


                    </div>

                    <div class="calculator__graphics__systems">
                        <img src="" alt="" />
                    </div>

                    <div class="calculator__graphics__sides">
                        <img style="width: 100%;" src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/calculator-fencing-large.jpg" alt="" />
                    </div>



                    <div class="calculator__graphics__plan" id="calculator__graphics__plan"></div>

                    <div class="calculator__graphics__summary">
                        <div class="calculator__plan">

                            <div class="calculator__summary__header">
                                <div class="calculator__summary__diagram calculator__summary">
                                    <div id="calculator-plan-small" class="calculator-plan">
                                        <div class="loader">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div class="js-calculator-plan"></div>
                                        <i class="icon icon_search"></i>
                                    </div>
                                </div>

                                <div class="calculator__summary__dimensions calculator__summary" id="calculator__summary">

                                </div>
                            </div>

                            <div class="calculator__summary__details"></div>


                            <div id="component__list">

                            </div>


                            <ul class="calculator__ctas screen">
                                <li class="calculator__ctas__estimate">
                                    <a href="#calculator__components-summary" class="scrollto media" title="Send me an estimate">
                                        <i class="icon icon_contact media__img"></i>
                                        <span class="media__bd">Send me an estimate</span>
                                    </a>
                                </li>
                                <?php if (get_field('bunnings', 'option')) : ?>
                                    <li class="calculator__ctas__bunnings">
                                        <a href="<?php echo (get_field('bunnings_link', 'option')) ? get_field('bunnings_link', 'option') : "http://www.bunnings.com.au"; ?>" class="calculator__bunnings__local media" title="Find your local Bunnings Warehouse" target="_blank">
                                            <i class="icon icon_location-11 media__img"></i>
                                        <span class="media__bd">
                                            Find your local
                                            <span class="calculator__bunnings__logo"></span>
                                        </span>
                                        </a>
                                    </li>
                                <?php endif; ?>
                                <li class="calculator__ctas__print">
                                    <a href="#" class="js-print media" title="Print estimate">
                                        <i class="icon icon_print media__img"></i>
                                        <span class="media__bd">Print estimate</span>
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </div>



                </div>

                <div id="calculator-content" class="calculator-content">

                    <h2><?php echo the_field('intro', 'options'); ?></h2>

                    <div class="calculator__intro">
                        <p>Installing your own glass pool fencing or balustrading system? We’re here to help you every step of the way.</p>

                        <p>The key to any do-it-yourself project is planning. Our handy, easy-to-use calculator will eliminate any guesswork and provide you with an itemisation of required components, a layout of your project and even give you an accurate cost estimate.</p>

                        <h4>Get a pool fence or balustrade estimate</h4>

                        <p>Select your favourite Everton system, input your measurements and in just a few moments you'll have a list of components you can take with you to Bunnings. Start calculating now.</p>

                        <p><em><strong>Note:</strong> For less typical installations (ie. those requiring more than 4 sides, non-90 degree corners, sloping sites, mixed surfaces etc) we suggest contacting us directly to discuss your requirements.</em></p>

                        <p><em><strong>Check Local Regulatory Requirements:</strong> Before installing your pool fence or balustrade check information provided by your local council to ensure it complies with any local by-laws.</em></p>

                    </div>

                </div>

            </div>
        </main>

<script type="text/application" id="calculator-summary-template">
        <!--<span class="system__icon system__icon--medium system__icon--<%= systemIconColour %>"  style="display: none;"><%= systemIconCode %></span>-->
        <a href="#" class="icon icon_print js-print" style="display: none;"></a>
        <h3 class="calculator__summary__system"style="margin-bottom: 0; font-family: sans-serif; font-size: 14px;"><%= system %></h3>
        <p style="margin-top: 0; margin-bottom: 30px !important; font-family: sans-serif; font-size: 13px;"><%= systemSubtitle %></p>

        <div class="calculator__summary__sides">
            <% if(A.len != ""){ %>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tr class="screen"><td colspan="2" class="calculator__email__cell border_img"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/table-border.gif" alt="" style="display: block; width: 100%;" height="1"></td></tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                    <tr>
                        <td class="calculator__summary__side" width="60%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            Side A
                            <% if( A.fixingPoint == "wall" ) { %>
                                <br> with Wall Fixing
                            <% } %>
                            <% if( A.post && A.fixingPoint == "post" ) { %>
                                <br> with Post Fixing
                            <% } %>
                             <% if( gateside == "A" ) { %>
                                <br> with Gate
                            <% } %>
                        </td>
                        <td class="calculator__summary__length" align="right" width="40%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            <%=A.calculatedWidth%>mm
                        </td>
                    </tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                </table>
            <% } %>
            <% if(B.len != ""){ %>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tr class="screen"><td colspan="2" class="calculator__email__cell border_img"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/table-border.gif" alt="" style="display: block; width: 100%;" height="1"></td></tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                    <tr>
                        <td class="calculator__summary__side" width="60%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            Side B
                            <% if( B.fixingPoint == "wall" ) { %>
                                <br> with Wall Fixing
                            <% } %>
                            <% if( B.post && B.fixingPoint == "post" ) { %>
                                <br> with Post Fixing
                            <% } %>
                             <% if( gateside == "B" ) { %>
                                <br> with Gate
                            <% } %>
                        </td>
                        <td class="calculator__summary__length" align="right" width="40%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            <%=B.calculatedWidth%>mm
                        </td>
                    </tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                </table>
            <% } %>
            <% if(C.len != ""){ %>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tr class="screen"><td colspan="2" class="calculator__email__cell border_img"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/table-border.gif" alt="" style="display: block; width: 100%;" height="1"></td></tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                    <tr>
                        <td class="calculator__summary__side" width="60%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            Side C
                            <% if( C.fixingPoint == "wall" ) { %>
                                <br> with Wall Fixing
                            <% } %>
                            <% if(C.post &&  C.fixingPoint == "post" ) { %>
                                <br> with Post Fixing
                            <% } %>
                            <% if( gateside == "C" ) { %>
                                <br> with Gate
                            <% } %>
                        </td>
                        <td class="calculator__summary__length" align="right" width="40%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            <%=C.len%>mm
                        </td>
                    </tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                </table>
            <% } %>
            <% if(D.len != ""){ %>
                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tr class="screen"><td colspan="2" class="calculator__email__cell border_img"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/table-border.gif" alt="" style="display: block; width: 100%;" height="1"></td></tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                    <tr>
                        <td class="calculator__summary__side" width="60%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            Side D
                            <% if( D.fixingPoint == "wall" ) { %>
                                <br> with Wall Fixing
                            <% } %>
                            <% if( D.post && D.fixingPoint == "post" ) { %>
                                <br> with Post Fixing
                            <% } %>
                             <% if( gateside == "D" ) { %>
                                <br> with Gate
                            <% } %>
                        </td>
                        <td class="calculator__summary__length" align="right" width="40%" style="font-weight:bold; float: left; font-family: sans-serif; font-size: 13px;">
                            <%=D.calculatedWidth%>mm
                        </td>
                    </tr>
                    <tr class="screen"><td colspan="2" class="calculator__email__cell"><img src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/email/spacer.gif" alt="" height="5" style="display: block; width: 100%;"></td></tr>
                </table>

            <% } %>
        </div>

    </script>

<script type="text/application" id="calculator-plan-template">
        <div class="calculator__plan">
            <div class="calculator__plan__header">
                <img style="width: 100%;" src="<?php echo plugins_url(); ?>/protector-calculator/static/img/calculator/plan-<%=systemId%>.jpg">
            </div>

            <div id="calculator-plan-big" class="calculator-plan">
                <div class="loader">
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                   <span></span>
                </div>
                <div class="js-calculator-plan"></div>
                <i class="icon icon_search"></i>
            </div>
        </div>
    </script>

<script type="text/application" id="calculator-form-template">

<!--<h1>Calculate what you need</h1>-->

<?php if (get_field('heading', 'option')) : ?>
    <h2><?php echo get_field('heading', 'option'); ?></h2>
<?php else: ?>
    <h2>An easy to use tool to help plan and cost your project.</h2>
<?php endif; ?>

<div class="calculator__intro">
    <?php if (get_field('intro', 'option')) : ?>
        <?php echo get_field('intro', 'option'); ?>
    <?php else: ?>
        <p>Installing your own glass pool fencing or balustrading system? We’re here to help you every step of the way.</p>
        <p>The key to any do-it-yourself project is planning. Our handy, easy-to-use calculator will eliminate any guesswork and provide you with an itemisation of required components, a layout of your project and even give you an accurate cost estimate.</p>
        <h4>Get a pool fence or balustrade estimate</h4>
        <p>Select your favourite system, input your measurements and in just a few moments you'll have a list of components you can take with you to Bunnings. Start calculating now.</p>
    <?php endif; ?>
</div>

<a href="#" class="pill pill--borderless-r js-type <% if(type == 'pool-fencing'){%>pill--selected<%} %>" data-type="pool-fencing" data-type-name="Pool Fencing System">
    <!--<i class="icon icon_pool_fencing"></i>-->
    Pool Fencing
</a><a href="#" class="pill pill--borderless-l js-type <% if(type == 'balustrading'){%>pill--selected<%} %>" data-type="balustrading" data-type-name="Balustrading System">
    <!--<i class="icon icon_balustrading"></i>-->
    Balustrading
</a>

<div class="accordion calculator__systems">
    <div class="calculator__title accordion-is-expanded">
        <h3>Select a System</h3>
    </div>
    <div class="accordion__content accordion-is-expanded">

    <?php
    foreach ($system_data as $type => $systems):

        //if (($type != "wire-balustrading") || (($type == "wire-balustrading") && is_user_logged_in())) :

            $systemType = (strstr($type, "balustrading")) ? "balustrading" : $type; ?>

            <div class="accordion accordion--selector calculator__system systems-<?php echo $systemType; ?> <% if(type == '<?php echo $systemType; ?>') { %>is-visible<% } %>">

                <?php
                foreach ($systems as $systemCode => $system):
                    if ($system['post_parent'] == 0) : ?>

                        <div href="#" class="accordion__title calculator__option <% if( systemId.substr(0, 3) == '<?php echo $systemCode; ?>' ){%>calculator__select-selected<%} %>">
                            <!--<span class="system__icon system__icon--medium system__icon--<?php echo $system['iconColour']; ?> calculator__select__note"><?php echo $system['iconCode']; ?></span>-->
                            <p>
                                <strong><?php echo $system['title']; ?></strong><br>
                                <?php echo $system['subTitle']; ?>
                            </p>
                            <span class="accordion--selector__arrow calculator__option__after"></span>
                            <a href="#" class="accordion--selector__button js-edit">Edit</a>
                            <?php if (isset($systemOptions[$systemCode]) && count($systemOptions[$systemCode])): ?>
                                <button class="btn btn--open-accordion">Options</button>
                            <?php else: ?>
                                <button class="btn" value="<?php echo $systemCode; ?>">Select</button>
                            <?php endif; ?>
                        </div>
                        <div class="accordion__content">
                            <p><?php echo $system['description']; ?></p>

                            <?php if (isset($systemOptions[$systemCode]) && count($systemOptions[$systemCode])): ?>
                                <p><b>Select which style of <?php echo $system['subTitle']; ?> you would like:</b></p>
                                <?php foreach ($systemOptions[$systemCode] as $sysCode => $systemFinish): ?>
                                    <p><button class="btn" value="<?php echo $sysCode; ?>"><?php echo $systemFinish; ?></button></p>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    <?php
                    endif;
                    ?>
                <?php endforeach; ?>

            </div>

        <?php
        // endif;
        ?>

    <?php
    endforeach;
    ?>

    </div>
</div>

<!--- *************** -->

<% if (system != "") { %>

<?php if (count($finishOptions)): ?>

    <% if (systemId in <?php echo json_encode($finishOptions); ?>) { %>

    <% if (finish == "") { %>

    <div class="accordion calculator__finishes">
        <div class="calculator__title calculator__option accordion-is-expanded">
            <h3>Select Finish</h3>
        </div>

        <div class="accordion__content accordion-is-expanded">
            <div class="calculator__result calculator__sides__rows" id="calculator-sides-rows">

                <p><b>Select a finish to continue:</b></p>
                <?php foreach ($finishOptions as $systemCode => $finishes): ?>
                    <% if (systemId == "<?php echo $systemCode; ?>") { %>
                    <?php foreach ($finishes as $finish): ?>
                        <p><button class="btn" value="<?php echo $finish; ?>"><?php echo $finish; ?></button></p>
                    <?php endforeach; ?>
                    <% } %>
                <?php endforeach; ?>

            </div>
        </div>
    </div>

    <% } else { %>

    <div class="calculator__option calculator__select-selected calculator__finish__selected">
        <i class="icon icon_tick calculator__option__before"></i>
        <p><strong>Select Finish</strong></p>
        <p>- <%=finish %></p>
        <a href="#" class="accordion--selector__button js-edit">Edit</a>
    </div>

    <% } %>

    <% } %>

<?php endif; ?>

<?php if (count($componentOptions)): ?>

    <% if (systemId in <?php echo json_encode($componentOptions); ?> && finish != "") { %>

        <% if (optionsSelected == false) { %>

            <div class="accordion calculator__options">
                <div class="calculator__title calculator__option accordion-is-expanded">
                    <h3>Component Options</h3>
                </div>

                <div class="accordion__content accordion-is-expanded">
                    <div class="calculator__result calculator__sides__rows" id="calculator-sides-rows">

                        <?php foreach ($componentOptions as $systemCode => $systemOptions): ?>
                            <% if (systemId == "<?php echo $systemCode; ?>") { %>
                                <?php foreach ($systemOptions as $group_key => $option_group): ?>

                                    <div class="optionGroup">

                                        <?php $keyArray = explode("-", $group_key); ?>
                                        <p><b>Select a <?php echo (strstr($group_key, "minipost")) ? "Mini Post" : array_pop($keyArray); ?> type to continue:</b></p>
                                        <?php $groupCount = 0; ?>

                                        <?php foreach ($option_group as $component_code => $option): ?>

                                            <% if (type == "pool-fencing") { %>

                                                <?php
                                                // Add a no handrail option for compatible systems
                                                if (($groupCount == 0) && (strstr($group_key, "handrail"))): ?>
                                                    <p><button class="btn" value="<?php echo $systemCode . "|" . $group_key . ":"; ?>">No Handrail</button></p>
                                                <?php endif; ?>

                                            <% } %>

                                            <% if (finish == "<?php echo $option['finish']; ?>") { %>
                                                <p><button class="btn" value="<?php echo $systemCode . "|" . $group_key . ":" . $component_code; ?>"><?php echo $option['description']; ?></button></p>
                                            <% } %>

                                            <?php $groupCount++; ?>

                                        <?php endforeach; ?>

                                    </div>

                                <?php endforeach; ?>
                            <% } %>
                        <?php endforeach; ?>

                        <!-- <button class="btn btn--right">Continue</button> -->
                    </div>
                </div>
            </div>

        <% } else if (optionsSelected !== null) { %>

            <div class="calculator__option calculator__select-selected calculator__options__selected">
                <i class="icon icon_tick calculator__option__before"></i>
                <p><strong>Component Options</strong></p>
                <p>- <%= optionsSelected %></p>
                <a href="#" class="accordion--selector__button js-edit">Edit</a>
            </div>

        <% } %>

    <% } %>

<?php endif; ?>

<% } %>

<!-- ************** -->




<div class="accordion calculator__sides">
    <div class="calculator__title calculator__option accordion-is-expanded">
        <div class="calculator__option__before">
            <!-- <span class="checkbox-styled"><input type="checkbox" class="js-unstyled"></span> -->
        </div>
        <h3>Add Sides</h3>
    </div>

    <div class="accordion__content accordion-is-expanded">

        <div class="calculator__decision">
            <div class="calculator__sides__total">
                <label for="">How many sides?</label>
                <div class="styled-select">
                    <select name="calculator-sides-total" id="calculator-sides-total">
                        <option value="">Please select</option>
                        <option value="1" <% if(sides == 1){%>selected<%} %>>1</option>
                        <option value="2" <% if(sides == 2){%>selected<%} %>>2</option>
                        <option value="3" <% if(sides == 3){%>selected<%} %>>3</option>
                        <option value="4" <% if(sides == 4){%>selected<%} %>>4</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="calculator__result calculator__sides__rows" id="calculator-sides-rows">

            <div class="calculator__side calculator__side-1 row form__row">
                <div class="calculator__side__length form--append" <% if (systemType == "wire-balustrading") { %>style="width: 100%;"<% } %>>
                    <label for="side-a-length">Side A length</label>
                    <input type="number" value="<%=A.len%>" name="side-a-length" id="side-a-length" class="side-length"><span class="form--append__appendage">mm</span>
                </div>

                <div class="calculator__side__size" <% if (systemType == "wire-balustrading") { %>style="display: none;"<% } %>>
                    <label for="side-a-max-panel-size">Max panel size</label>
                    <div class="styled-select">
                        <select id="side-a-max-panel-size" name="side-a-max-panel-size" class="side-max-panel-size"></select>
                    </div>
                </div>

                <div class="calculator__side__fixing">
                    <label for="">Fixing point</label>
                    <label for="side-a-fixing-wall" class="radio--tab radio--tab--no-border <% if(A.fixingPoint == "wall"){%>is-active<%} %>">
                    <input type="radio" <% if(A.fixingPoint == "wall"){%>checked<%} %> value="wall" id="side-a-fixing-wall" name="side-a-fixing" class="side-fixing-point js-unstyled">
                    <span>Wall</span>
                    </label>
                    <label for="side-a-fixing-post" class="radio--tab last <% if(A.fixingPoint == "post"){%>is-active<%} %>">
                    <input type="radio" <% if(A.fixingPoint == "post"){%>checked<%} %> value="post" id="side-a-fixing-post" name="side-a-fixing" class="side-fixing-point js-unstyled">
                    <span>Post</span>
                    </label>
                </div>
            </div>

            <div class="calculator__side calculator__side-2 row form__row">
                <div class="calculator__side__length form--append" <% if (systemType == "wire-balustrading") { %>style="width: 100%;"<% } %>>
                    <label for="side-b-length">Side B length</label>
                    <input type="number" value="<%=B.len%>" name="side-b-length" id="side-b-length" class="side-length"><span class="form--append__appendage">mm</span>
                </div>

                <div class="calculator__side__size" <% if (systemType == "wire-balustrading") { %>style="display: none;"<% } %>>
                    <label for="side-b-max-panel-size">Max panel size</label>
                    <div class="styled-select">
                        <select id="side-b-max-panel-size" name="side-b-max-panel-size" class="side-max-panel-size"></select>
                    </div>
                </div>

                <div class="calculator__side__fixing">
                    <label for="">Fixing point</label>
                    <label for="side-b-fixing-wall" class="radio--tab radio--tab--no-border <% if(B.fixingPoint == "wall"){%>is-active<%} %>">
                    <input type="radio" <% if(B.fixingPoint == "wall"){%>checked<%} %> value="wall" id="side-b-fixing-wall" name="side-b-fixing" class="side-fixing-point js-unstyled">
                    <span>Wall</span>
                    </label>
                    <label for="side-b-fixing-post" class="radio--tab last <% if(B.fixingPoint == "post"){%>is-active<%} %>">
                    <input type="radio" <% if(B.fixingPoint == "post"){%>checked<%} %> value="post" id="side-b-fixing-post" name="side-b-fixing" class="side-fixing-point js-unstyled">
                    <span>Post</span>
                    </label>
                </div>
            </div>

            <div class="calculator__side calculator__side-3 row form__row">
                <div class="calculator__side__length form--append" <% if (systemType == "wire-balustrading") { %>style="width: 100%;"<% } %>>
                    <label for="side-c-length">Side C length</label>
                    <input type="number" value="<%=C.len%>" name="side-c-length" id="side-c-length" class="side-length"><span class="form--append__appendage">mm</span>
                </div>

                <div class="calculator__side__size" <% if (systemType == "wire-balustrading") { %>style="display: none;"<% } %>>
                    <label for="side-c-max-panel-size">Max panel size</label>
                    <div class="styled-select">
                        <select id="side-c-max-panel-size" name="side-c-max-panel-size" class="side-max-panel-size"></select>
                    </div>
                </div>

                <div class="calculator__side__fixing">
                    <label for="">Fixing point</label>
                    <label for="side-c-fixing-wall" class="radio--tab radio--tab--no-border <% if(C.fixingPoint == "wall"){%>is-active<%} %>">
                    <input type="radio" <% if(C.fixingPoint == "wall"){%>checked<%} %> value="wall" id="side-c-fixing-wall" name="side-c-fixing" class="side-fixing-point js-unstyled">
                    <span>Wall</span>
                    </label>
                    <label for="side-c-fixing-post" class="radio--tab last <% if(C.fixingPoint == "post"){%>is-active<%} %>">
                    <input type="radio" <% if(C.fixingPoint == "post"){%>checked<%} %> value="post" id="side-c-fixing-post" name="side-c-fixing" class="side-fixing-point js-unstyled">
                    <span>Post</span>
                    </label>
                </div>
            </div>

            <div class="calculator__side calculator__side-4 row form__row">
                <div class="calculator__side__length form--append" <% if (systemType == "wire-balustrading") { %>style="width: 100%;"<% } %>>
                    <label for="side-d-length">Side D length</label>
                    <input type="number" value="<%=D.len%>" name="side-d-length" id="side-d-length" class="side-length"><span class="form--append__appendage">mm</span>
                </div>

                <div class="calculator__side__size" <% if (systemType == "wire-balustrading") { %>style="display: none;"<% } %>>
                    <label for="side-d-max-panel-size">Max panel size</label>
                    <div class="styled-select">
                        <select id="side-d-max-panel-size" name="side-d-max-panel-size" class="side-max-panel-size"></select>
                    </div>
                </div>

                <div class="calculator__side__fixing">
                    <label for="">Fixing point</label>
                    <label for="side-d-fixing-wall" class="radio--tab radio--tab--no-border <% if(D.fixingPoint == "wall"){%>is-active<%} %>">
                    <input type="radio" <% if(D.fixingPoint == "wall"){%>checked<%} %> value="wall" id="side-d-fixing-wall" name="side-d-fixing" class="side-fixing-point js-unstyled">
                    <span>Wall</span>
                    </label>
                    <label for="side-d-fixing-post" class="radio--tab last <% if(D.fixingPoint == "post"){%>is-active<%} %>">
                    <input type="radio" <% if(D.fixingPoint == "post"){%>checked<%} %> value="post" id="side-d-fixing-post" name="side-d-fixing" class="side-fixing-point js-unstyled">
                    <span>Post</span>
                    </label>
                </div>
            </div>

            <button class="btn btn--right">Continue</button>

        </div>

    </div>
</div>

<div class="calculator__option calculator__select-selected calculator__sides__selected">
    <i class="icon icon_tick calculator__option__before"></i>
    <p><strong>Add Sides</strong></p>
    <p class="calculator__select__note calculator__sides__numrows"><%=sides %></p>
    <a href="#" class="accordion--selector__button js-edit">Edit</a>
</div>

<div class="accordion calculator__gate">
    <div class="calculator__title calculator__option accordion-is-expanded">
        <div class="calculator__option__before">
            <!--<span class="checkbox-styled"><input type="checkbox" class="js-unstyled"></span>-->
        </div>
        <h3>Add a gate</h3>
    </div>
    <div class="accordion__content accordion-is-expanded">

        <div class="calculator__decision">
            <div class="calculator__gate__side">
                <label>Which side?</label>
                <div class="styled-select">
                    <select name="gate-side" id="gate-side">
                        <option value="">Please select</option>
                        <% if(sides >= 1){%><option value="A" <% if(gateside =='A'){%>selected<%} %> >A</option><% } %>
                        <% if(sides >= 2){%><option value="B" <% if(gateside =='B'){%>selected<%} %> >B</option><% } %>
                        <% if(sides >= 3){%><option value="C" <% if(gateside =='C'){%>selected<%} %> >C</option><% } %>
                        <% if(sides >= 4){%><option value="D" <% if(gateside =='D'){%>selected<%} %> >D</option><% } %>
                    </select>
                </div>
            </div>
        </div>
        <input type="hidden" name="gate-position" id="gate-position-centre" class="gate-position js-unstyled" checked value="centre" />

        <!--
        <div class="calculator__result" id="calculator-gate-side">
             <div class="form__row row calculator__gate__positioning">
                <div class="calculator__gate__position">
                    <label for="">Position</label>
                    <label for="gate-position-left" class="radio--tab radio--tab--no-border first">
                        <input type="radio" name="gate-position" id="gate-position-left" class="gate-position js-unstyled" value="Left"><span>Left</span>
                    </label>
                    <label for="gate-position-centre" class="radio--tab radio--tab--no-border">
                        <input type="radio" name="gate-position" id="gate-position-centre" class="gate-position js-unstyled" value="Centre"><span>Centre</span>
                    </label>
                    <label for="gate-position-right" class="radio--tab last">
                        <input type="radio" name="gate-position" id="gate-position-right" class="gate-position js-unstyled" value="Right"><span>Right</span>
                    </label>
                </div>

            </div>
        </div>
        -->
        <button class="btn btn--right">Continue</button>

    </div>
</div>

<div class="calculator__option calculator__select-selected calculator__gate__selected">
    <i class="icon icon_tick calculator__option__before"></i>
    <p><strong>Add a Gate</strong></p>
    <i class="calculator__select__note icon icon_gate"></i>
    <a href="#" class="accordion--selector__button js-edit">Edit</a>
</div>

<div class="accordion calculator__summary__form">
    <div class="calculator__title calculator__option calculator__option--nobefore accordion-is-expanded">
        <h3>Components Summary</h3>
    </div>
    <div class="accordion__content accordion-is-expanded">

        <div class="calculator__components-summary__success message message--success">
            <p>Thanks, a copy of your component list has been sent to the specified email address.</p>
            <p><a href="/" class="btn">Home</a> <a href="#" class="btn" data-js-btn-continue>Continue working with calculator</a></p>
        </div>

        <form action="/wp-json/calculator/v1/send/" accept-charset="utf-8" id="calculator__components-summary" class="calculator__components-summary" method="post"><div style="display:none">
                <input type="hidden" name="params_id" value="16330381" />
                <input type="hidden" name="csrf_token" value="25600818a5dbfd7808f7a03baf982c09437fd9b9" />
            </div>
            <p>Fields marked with <abbr class="req" title="Required field">*</abbr> are required.</p>

            <div class="form__row">
                <label for="first_name">First Name <abbr class="req" title="Required field">*</abbr></label>
                <input type="text" id="first_name" name="first_name" class="required" />
            </div>

            <div class="form__row">
                <label for="last_name">Last Name <abbr class="req" title="Required field">*</abbr></label>
                <input type="text" id="last_name" name="last_name" class="required" />
            </div>

            <div class="form__row">
                <div class="calculator__phone">
                    <label for="phone">Phone</label>
                    <input type="text" id="phone" name="phone" />
                </div>
                <div class="calculator__postcode">
                    <label for="postcode">Postcode</label>
                    <input type="text" id="postcode" name="postcode"/>
                </div>
            </div>

            <div class="form__row">
                <div class="calculator__email">
                    <label for="email">Send estimate to my email address <abbr class="req" title="Required field">*</abbr></label>
                    <input type="text" id="email" name="email" class="required" />
                </div>
                <div class="calculator__submit">
                    <button type="submit" class="btn js-calculator-submit">Send</button>
                </div>
            </div>

            <div class="form__row calculator__terms">
                <input type="checkbox"  name="terms" id="terms">
                <label for="terms">I accept the <a href="/terms">Terms &amp; Conditions</a> <abbr class="req" title="Required field">*</abbr></label>
            </div>

            <div class="form__row form__row--inline">
                <input type="checkbox" name="newsletter" id="newsletter" checked="checked" value="yes">
                <label class="input-note" for="newsletter">Would you like to receive communication from us?</label>
            </div>

            <textarea name="component_list" id="component_list"></textarea>

        </form>

    </div>
</div>

<?php if (get_field('bunnings', 'option')) : ?>
    <p class="calculator__bunnings">
        <a href="<?php echo (get_field('bunnings_link', 'option')) ? get_field('bunnings_link', 'option') : "http://www.bunnings.com.au"; ?>" title="Bunnings Warehouse" target="_blank">
            <span class="calculator__bunnings__url">bunnings.com.au</span>
            <span class="calculator__bunnings__local">
                Find your local
                <span class="calculator__bunnings__logo"></span>
            </span>
        </a>
    </p>
<?php endif; ?>

<br /><br />
<?php if (get_field('footnotes', 'option')) : ?>
        <?php echo get_field('footnotes', 'option'); ?>
    <?php else: ?>
    <p><br /><em><strong>Note:</strong> For less typical installations (ie. those requiring more than 4 sides, non-90 degree corners, sloping sites, mixed surfaces etc) we suggest contacting us directly to discuss your requirements.</em></p>
    <p><em><strong>Check Local Regulatory Requirements:</strong> Before installing your pool fence or balustrade check information provided by your local council to ensure it complies with any local by-laws.</em></p>
<?php endif; ?>

</script>

<script type='text/javascript'>

    <?php
    // Reindex by system code
    $system_codes = [];
    foreach($system_data as $system_type):
        foreach($system_type as $code => $system):
            $system_codes[$code] = $system;
        endforeach;
    endforeach;
    ?>

    var systems = <?php echo json_encode($system_codes, JSON_PRETTY_PRINT); ?>;
    var mapping = <?php echo json_encode($component_mapping, JSON_PRETTY_PRINT); ?>;
    <?php $color_mid = get_field('colour_mid', 'option'); ?>
    var planColor = '<?php echo ($color_mid) ? $color_mid : '#2ab0e4'; ?>';

</script>