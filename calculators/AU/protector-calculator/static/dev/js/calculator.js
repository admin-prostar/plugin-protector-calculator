var Calculator = new Backbone.Marionette.Application();


// Regions
// ----------------------------------------------

Calculator.addRegions({
    calculator: '#calculator'
});


// System data
// ----------------------------------------------


var systems = {
    sfa: {
        title: 'Semi Frameless',
        subTitle: '930mm Stainless Steel Post',
        urlTitle: 'semi-frameless-930mm-stainless-steelpost',
        iconCode: 'SF-A',
        iconColour: 'forest',
        sizes: ['1300', '1200', '1100', '1000', '900', '800', '700', '600', '500', '400', '300'],
        sizeDifference: 100,
        gap: 22,
        wallFixing: 25
    },
    sf6: {
        title: 'Semi Frameless',
        subTitle: '1250mm Aluminium Post',
        urlTitle: 'semi-frameless-1250mm-aluminium-system',
        iconCode: 'SF-6',
        iconColour: 'pink',
        sizes: ['1300', '1200', '1100', '1000', '900', '800', '700', '600', '500', '400', '300'],
        sizeDifference: 100,
        gap: 25,
        wallFixing: 25
    },
    sf9: {
        title: 'Fully Frameless',
        subTitle: 'Mini Post',
        urlTitle: 'fully-frameless-mini-post-system',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: ['1300', '1200', '1100', '1000', '900', '800', '700', '600', '500', '400', '300'],
        sizeDifference: 100,
        gap: {
            min: 20,
            max: 70
        }
    },
    ffm: {
        title: 'Fully Frameless',
        subTitle: 'Channel',
        urlTitle: 'fully-frameless-channel-system',
        iconCode: 'FF-M',
        iconColour: 'yellow',
        sizes: ['1300', '1200', '1100', '1000', '900', '800', '700', '600'],
        sizeDifference: 100,
        gap: {
            min: 20,
            max: 70
        }
    },
    ffc: {
        title: 'QuikWire',
        subTitle: 'Stainless Steel',
        urlTitle: 'quikwire-stainless-steel-system',
        iconCode: 'FF-C',
        iconColour: 'orange',
        sizes: [],
        gap: 22
    },
    tmp1: {
        title: 'Semi Frameless',
        subTitle: '600mm Stainless Steel Post',
        urlTitle: 'semi-frameless-600mm-stainless-steel-system',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: ['1100', '1050', '1000', '950', '900', '850', '800', '750', '700', '650', '600'],
        sizeDifference: 50,
        gap: 25,
        wallFixing: 25
    },
    tmp2: {
        title: 'Fully Frameless',
        subTitle: 'Channel System Balustrade',
        urlTitle: 'fully-frameless-channel-system1',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: ['1300', '1200', '1100', '1000', '900', '800', '700', '600', '500', '400', '300'],
        sizeDifference: 100,
        gap: {
            min: 20,
            max: 70
        }
    },
    tmp3: {
        title: 'Quickwire',
        subTitle: 'Stainless Steel System',
        urlTitle: 'quikwire-stainless-steel-system1',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: []
    },
    tmp4: {
        title: 'Quickwire',
        subTitle: 'Timber Insert Kit',
        urlTitle: 'quikwire-timber-insert-kit',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: []
    }
};


// Views
// ----------------------------------------------

var CalculatorView = Backbone.Marionette.ItemView.extend({

    template: '#calculator-form',

    ui: {
        print                      : '.js-print',
        submit                     : '.js-calculator-submit',

        // Type
        typeButton                 : '.js-type',

        // Systems
        systemAdd                  : '.calculator__systems input[type=checkbox]',
        systemEdit                 : '.calculator__systems .js-edit',

        // Sides
        sidesNumber                : '#calculator-sides-total',
        sideRow                    : '.calculator__side',
        sidesAdd                   : '.calculator__sides input[type=checkbox]',
        sidesEdit                  : '.calculator__sides__selected .js-edit',
        sidesNumRows               : '.calculator__sides__numrows',
        sideLength                 : '.side-length',

        // Gate
        gateAdd                    : '.calculator__gate input[type=checkbox]',
        gateSide                   : '#gate-side',
        gateOffset                 : '.gate-offset',
        gatePosition               : '.gate-position',
        gateEdit                   : '.calculator__gate__selected .js-edit'
    },

    events: {
        'click @ui.print'          : 'print',
        'click @ui.submit'         : 'validateForm',

        // Type
        'click @ui.typeButton'     : 'selectType',

        // Systems
        'click @ui.systemAdd'      : 'addSystem',
        'click @ui.systemEdit'     : 'editSystem',

        // Sides
        'change @ui.sidesAdd'      : 'addSides',
        'change @ui.sidesNumber'   : 'showSides',
        'click @ui.sidesEdit'      : 'editSides',
        'keyup @ui.sideLength'     : 'restrictCharacters',

        // Gate
        'change @ui.gateAdd'       : 'addGate',
        'change @ui.gateSide'      : 'addGateOffset',
        'click @ui.gateEdit'       : 'editGate',
        'keyup @ui.gateOffset'     : 'validateGateOffset'
    },

    initialize: function() {
        this.model.on('change', this.render, this);

        this.on('matchHeight', function() {
            this.matchHeight();
        });
    },

    onRender: function() {
        ev.accordion.init();
        ev.extras();

        // Calculate each side
        this.calculateSides();

        // Update max panel sizes based on system - this is so shit
        var code = this.model.get('systemId');
        if( code !== "" ) {
            panelSizes = systems[code].sizes;
            var panelSizeHtml = '';
            _.each(panelSizes, function(panelSize) {
                panelSizeHtml += '<option value="' + panelSize + '">' + panelSize + '</option>';
            });
            $('.side-max-panel-size option').remove();
            $('.side-max-panel-size').html(panelSizeHtml);
        }

        // When switching between types and having a previously selected system it doesn't collapse the list
        // so check when rendering to see if there is a selected system and collapse the list
        if( $('.calculator__system:visible .calculator__select-selected').length ) {
            $('#calculator').removeClass('system-is-visible').addClass('system-chosen');
        }
    },

    onShow: function() {
        this.on('matchHeight', function() {
            this.matchHeight();
        });
        this.matchHeight();
    },

    /**
     * [print Print page]
     */
    print: function( e ) {
        e.preventDefault();
        window.print();
    },

    /**
     * [validateForm Validate the components summary form before sending to user]
     */
    validateForm: function() {
        $(".calculator__components-summary").validate({
            rules:{
                "first_name": "required",
                "last_name": "required",
                terms: "required",
                email: {
                  required: true,
                  email: true
                }
            },
            messages:{
                "first_name": "Please enter a first name",
                "last_name": "Please enter a last name",
                terms: "Please accept the terms & conditions",
                email: "Please enter a valid email address"
            },
            errorPlacement: function(error, element) {
                if (element.attr("name") == "terms") {
                    element.parent('.checkbox-styled').next('label').after(error);
                } else {
                    error.insertAfter(element);
                }
            }
        });
    },

    /**
     * [restrictCharacters Replace any non number characters with emptiness]
     */
    restrictCharacters: function( e ) {
        var value = $(e.currentTarget).val();
        var re    = /\D/g;
        value     = value.replace(/\D/g, '');
        $(e.currentTarget).val(value);
    },

    matchHeight: function() {
        if( Modernizr.mq('only screen and (min-width: 992px)') ) {
            //$('.calculator-content').matchHeight();
        }
        if( Modernizr.mq('only screen and (min-width: 480px)') ) {
            $('.calculator__summary').matchHeight();
        }
    },

    /**
     * [selectType Select the type of system and add to model]
     */
    selectType: function( e ) {
        e.preventDefault();

        var $choice  = $(e.currentTarget);
        var type     = $choice.attr('data-type');
        var typeName = $choice.attr('data-type-name');

        // Unhide systems
        this.showSystems();

        // Save type to model
        this.model.set({'type':type , 'typeName':typeName});

        // If type is baludatrade then remove any gate data from the model and hide gates panels
        this.model.set({
            'gateside'    : '',
            'gateoffset'  : '',
            'gateposition': ''
        }, {silent: true});
        $('#calculator').removeClass('gates-is-visible gate-positioning-is-visible gate-chosen');

        // Update ui state
        $('#calculator').addClass('system-is-visible');

        // Show the appropriate systems
        $('.calculator__system').removeClass('is-visible');
        $('.calculator__system.systems-' + type).addClass('is-visible');

        // Match the side heights
        this.trigger('matchHeight');
    },

    addSystem: function( e ) {
        var code = $(e.currentTarget).val();

        // Save system to model
        this.model.set({'systemId':code, 'system':systems[code].title , 'systemSubtitle':systems[code].subTitle , 'systemIconCode':systems[code].iconCode , 'systemIconColour':systems[code].iconColour, 'systemUrlTitle':systems[code].urlTitle});

        // Hide all non choices
        $('#calculator').removeClass('system-is-visible').addClass('system-chosen');

        // Show the Sides
        $('#calculator').addClass('sides-is-visible');

        // Match the side heights
        this.trigger('matchHeight');
    },

    editSystem: function() {
        this.showSystems();
        this.model.set({'system':'' , 'systemSubtitle':'' , 'systemIconCode':'' , 'systemIconColour':''});

        // Match the side heights
        this.trigger('matchHeight');
    },

    showSystems: function() {
        $('.calculator__system .calculator__select-selected').removeClass('calculator__select-selected');
        $('.system-chosen').removeClass('system-chosen').addClass('system-is-visible');
        $('.calculator__system .accordion-is-expanded').removeClass('accordion-is-expanded');

        // Match the side heights
        this.trigger('matchHeight');
    },

    /**
     * [showSides Show a row for each side]
     */
    showSides: function( e ) {
        var numSides = $(e.currentTarget).val();

        // Save the number of sides to model
        this.model.set('sides', numSides);

        // Remove any previous side data from model
        this.removeSides();

        $('#calculator').removeClass('sides-1-is-visible sides-2-is-visible sides-3-is-visible sides-4-is-visible').addClass('sides-' + numSides + '-is-visible');

        // Match the side heights
        this.trigger('matchHeight');
    },

    /**
     * [addSides Save sides data to model]
     */
    addSides: function() {

        for(var i=0; i<sides.length; i++) {

            // Save side length, max panel size & fixing point to model
            // ----------------------------------------------

            var side         = _.clone( this.model.get( sides[i] ) ); // Shallow clone of each side model data
            var length       = "";
            var maxPanelSize = "";

            // Set length
            if( this.ui.sideRow.eq(i).find('.side-length').val() != "" ) {
                length = this.ui.sideRow.eq(i).find('.side-length').val();
            } else {
                length = "";
            }
            side.len = length;

            // Set max panel size
            if( this.ui.sideRow.eq(i).find('.side-max-panel-size').val() != "" ) {
                maxPanelSize = this.ui.sideRow.eq(i).find('.side-max-panel-size').val();
            } else {
                maxPanelSize = "";
            }
            side.maxPanelSize = maxPanelSize;

            // Set fixing point
            side.fixingPoint = this.ui.sideRow.eq(i).find('.side-fixing-point:checked').val();

            // Add data to model
            this.model.set(sides[i], side, {silent: true});
            side = undefined;

        }

        // Trigger render again as changes to model are silent
        this.render();

        // Show sides selected and hide side options
        $('#calculator').addClass('side-chosen');
        $('.sides-is-visible').removeClass('sides-is-visible');

        // Show the gate if type is pool fencing
        if( this.model.get('type') === 'pool-fencing' ) {
            if( !$('#calculator').hasClass('gate-chosen') ) {
                $('#calculator').addClass('gates-is-visible');
            }

        // Show the components summary view
        } else {
            $('#calculator').addClass('components-is-visible');
            this.getComponentList();
        }

        // Update the sides select list
        var sidesHtml = '<option value="">Please select</option>';
        for( var i=0; i<this.model.get('sides'); i++ ) {
            sidesHtml += '<option value="' + sides[i] + '">' + sides[i] + '</option>';
        }
        this.ui.gateSide.find('option').remove();
        this.ui.gateSide.html(sidesHtml);

        // Draw plan
        this.drawPlan( 'calculator-plan-big', '#e3f5ff' );
        this.drawPlan( 'calculator-plan-small', '#fff' );

        // Match the side heights
        this.trigger('matchHeight');
    },

    calculateSides: function() {

        // Loop over each side and calculate data
        for( var i=0; i<this.model.get('sides'); i++ ){
            this.calculateSide( sides[i] );
        }

    },

    /**
     * [calculateSide Calculate the panels for each size]
     * @param  {[int]} sideWidth [Width of the side]
     * @param  {[int]} gate [Number of gates on the side]
     * @param  {[int]} maxPanelSize [The maximum panel size]
     * @param  {[string]} systemId [The id of the system]
     */
    calculateSide: function( sideAlpha ) {

        //console.log(this.model);

        var side            = _.clone( this.model.get( sideAlpha ) ); // Shallow clone of each side model data
        var width           = parseInt(side.len, 10);
        var maxSize         = parseInt(side.maxPanelSize, 10);
        var fixingPoint     = side.fixingPoint;
        var system          = this.model.get('systemUrlTitle');
        var systemId        = this.model.get('systemId');
        var gatePosition    = side.side;
        var gate            = 0;
        side.panels         = [];
        var panelsArray     = side.panels;
        side.gaps           = [];
        var gaps            = side.gaps;
        var whatGaps        = 22;
        var largePanelcount = 0;
        var panels          = 1;
        var widthDifference = systems[systemId].sizeDifference ? systems[systemId].sizeDifference : 100;
        var overallWidth    = width;
        var customPanel     = 0;
        var gateWidth       = 890;

        if( gatePosition !== undefined && gatePosition !== "" ) {
            gate = 1;
        }


        // Calculate width
        width               = width - gate*(gateWidth + 20);    // subtract gate opening

        // If system type == mini post or channel system gates require a hinge panel
        // so subtrack that from the width and add it in as a panel later
        // if( (system === "fully-frameless-mini-post-system" || system === "fully-frameless-channel-system") && gate ) {
        //     console.log('theres a gate');
        // }

        // Calculate number of panels
        panels              = Math.ceil( (width + whatGaps*(gate - 1)) / (maxSize + whatGaps) );

        // Calculate number of gaps
        var numGaps         = panels + 1 - gate;


        // Calculate gaps
        // Fixed gap size
        if( typeof systems[systemId].gap === "number" ) {

            var widthMinusGap   = (width - (numGaps * whatGaps));
            var customPanelSize = widthMinusGap % widthDifference;
            var gapAdjust       = whatGaps;
            var totalPanel      = Math.round( widthMinusGap - customPanelSize );

        // Variable gap size
        } else {

            // Get remainder once gaps have been removed from width and
            // width is divided between the width difference to ensure it divides evenly
            var widthMinusGap = (width - (numGaps * whatGaps));
            var adjust        = widthMinusGap % widthDifference;
            if (adjust == 0) { adjust = widthDifference; } //important
            var gapAdjust     = whatGaps - (widthDifference - adjust) / numGaps;
            var totalPanel    = Math.round( width - (numGaps * gapAdjust) );

        }

        // Panel sizes
        // Calculate the number of large panels
        while (totalPanel/panels % widthDifference > 0) {
            largePanelcount++;
            totalPanel = totalPanel - widthDifference;
        }

        panelSize      = totalPanel/panels; // Get the smallest panel size
        largePanelSize = panelSize + widthDifference;

        // Loop over each panel and display the correct width for each
        for (var k=0; k<panels; k++) {

            var a = 0,b = 0;

            // Gaps
            if (k>gate || k===0 || k===panels) {
                gaps.push( Math.round(gapAdjust) );
            }

            // Panels
            if (k < largePanelcount) {
                panelsArray.push(largePanelSize);
            }
            else {
                panelsArray.push(panelSize);
            }

        }

        // Add custom panel size
        if( customPanelSize !== 0 && customPanelSize !== undefined ) {
            panelsArray.push(customPanelSize);
        }

        // Add last gap
        gaps.push( Math.round(gapAdjust) );


        // Add data to model
        // ----------------------------------------------

        this.model.set( sideAlpha, side );

    },

    /**
     * [removeSides Empty side data on model]
     */
    removeSides: function() {
        var numSides = this.model.get('sides');

        for(var i=sides.length; i>=numSides; i--) {

            if( sides[i] !== undefined ) {

                var side = _.clone( this.model.get( sides[i] ) ); // Shallow clone of each side model data
                side.len = "";
                this.model.set(sides[i], side);

            }

        }
    },

    editSides: function( e ) {
        e.preventDefault();

        // Hide sides selected
        $('.side-chosen').removeClass('side-chosen');

        // Show the sides
        $('#calculator').addClass('sides-is-visible');

        // Match the side heights
        this.trigger('matchHeight');
    },

    addGate: function( e ) {

        // Save gate position to model
        // ----------------------------------------------

        var side = _.clone( this.model.get( this.ui.gateSide.val() ) ); // Shallow clone of each side model data

        // Get gate position
        if( this.ui.gateOffset.val() ) {
            side.gate = this.ui.gateOffset.val();
        } else if( this.ui.gateSide.val() ) {
            side.gate = this.ui.gatePosition.val();
        }

        // Save gate position to model
        this.model.set( this.ui.gateSide.val(), side );


        // View showing/hiding
        // ----------------------------------------------

        // Show the gate
        $('#calculator').removeClass('gates-is-visible').addClass('gate-chosen');

        // Show the components summary view
        $('#calculator').addClass('components-is-visible');
        this.getComponentList();

        // Show the sides
        $('#calculator').addClass('sides-is-visible');

        // Draw plan
        this.drawPlan( 'calculator-plan-big', '#e3f5ff' );
        this.drawPlan( 'calculator-plan-small', '#fff' );

        // Match the side heights
        this.trigger('matchHeight');

    },

    addGateOffset: function( e ) {
        var side = $(e.currentTarget).val();

        // Show the gate positioning form
        if( side !== "") {
            $('#calculator').addClass('gate-positioning-is-visible');
        } else {
            $('#calculator').removeClass('gate-positioning-is-visible');
        }

        // Match the side heights
        this.trigger('matchHeight');
    },

    editGate: function( e ) {
        e.preventDefault();

        $('#calculator').removeClass('gate-chosen').addClass('gates-is-visible');

        // Match the side heights
        this.trigger('matchHeight');
    },

    validateGateOffset: function() {
        this.ui.gatePosition.removeAttr('checked').parent().removeClass('is-active');
    },

    /**
     * [drawPlan Draw the plan]
     * @param  {[string]} element    [The element to add the svg to]
     * @param  {[string]} maskColour [The mask colour to account for different colour backgrounds - need to change this to an actual mask]
     */
    drawPlan: function( element, maskColour ) {

        var a = this.model.get('A');
        var b = this.model.get('B');
        var c = this.model.get('C');
        var d = this.model.get('D');

        a.side = "A";
        b.side = "B";
        c.side = "C";
        d.side = "D";

        var sideData = { a: a, b: b, c: c, d: d };
        var largest          = 0;
        var ratio;
        var svgSize          = { width: "100%", height: "100%", viewboxWidth: 670, viewboxHeight: 670 };
        var corners          = [];
        var strokeSize       = 1;
        var backgroundColour = maskColour;
        var gateSize         = 920;
        var snap             = Snap( svgSize.width, svgSize.height );
        var planGroup        = snap.paper.g();

        snap.attr({'viewBox':'0 0 680 680' , 'preserveAspectRatio':'xMinYMin meet' , id: 'plan-' + element});


        // Find largest panel size and divide by the inside square size so we can fit within the svg
        // ----------------------------------------------

        for(side in sideData) {
            if( sideData[side].len > largest ) {
                largest = sideData[side].len;
            }
        }
        ratio = largest/430;


        // Loop through each side and add to svg
        // ----------------------------------------------

        for(side in sideData) {
            if( sideData[side].len !== "" ) {
                var side = addSide(snap.paper, sideData[side].len, sideData[side].side, sideData[side].panels, sideData[side].gaps, sideData[side].post, sideData[side].gate);
                planGroup.add(side);
            }
        }

        // Center the plan
        // ----------------------------------------------

        var x = 0;
        var y = 0;
        if( planGroup.getBBox().x < 0 ) {
            x = planGroup.getBBox().x * -1;
        }
        if( planGroup.getBBox().y < 0 ) {
            y = planGroup.getBBox().y * -1;
        }

        var xPos = (svgSize.viewboxWidth - planGroup.getBBox().width)/2;
        var yPos = (svgSize.viewboxHeight - planGroup.getBBox().height)/2;

        planGroup.transform('t' + (xPos + x) + ', ' + (yPos + y));


        // Move the svg into position
        // ----------------------------------------------

        $('#' + element + ' .js-calculator-plan').html('');

        $('#' + element + ' .js-calculator-plan').html( $('#plan-' + element) );
        setTimeout(function() {
             $('.calculator-plan').addClass('is-visible');
        }, 600);


        // Match the side heights
        this.trigger('matchHeight');




        // TODO - Need to move this

        function addSide(paper, length, sideLabel, panelsArray, gapsArray, post, gate) {

            var sideGroup      = paper.g();
            var sidesGap       = 70;


            // Create post
            // If post == true then show a post else just show a gap
            // ----------------------------------------------

            if( post ) {
                var postSize       = 10;
                var postBg         = paper.rect(0, 0, postSize*2, postSize*2).attr({fill: backgroundColour});
                var postGroup      = paper.g();
                var postSquare     = paper.rect(postBg.getBBox().width/2 -(postSize/2), postBg.getBBox().height/2 -(postSize/2), postSize, postSize).attr({fill: '#2ab0e4'});
                var postDot        = paper.circle(postBg.getBBox().width/2, postBg.getBBox().height/2, 2).attr({fill: backgroundColour});
                postGroup.add(postBg, postSquare, postDot).transform('t-1000,-1000'); // Create post group and position off side of paper
            } else {
                var postSize       = 5;
                var postBg         = paper.rect(0, 0, postSize*2, postSize*2).attr({fill: backgroundColour});
                var postGroup      = paper.g();
                postGroup.add(postBg).transform('t-1000,-1000'); // Create post group and position off side of paper
            }



            // Create side lines
            // ----------------------------------------------

            var sideLineLength = length/ratio;
            var sideLine       = paper.line( 1, 0, 1, sideLineLength ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} );
            var sideLine2      = paper.line( 1, 0, 1, sideLineLength  ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} ).transform('t-' + sidesGap + ',');
            var sideLine3      = paper.line( 1, 0, 1, sideLineLength - postSize*3 ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} ).transform('t-' + sidesGap/2 + ',' + postSize*1.5);

            // Top and bottom borders
            var sideTop        = paper.line( 0, 1, 20, 1 ).transform( 't' + (sideLine2.getBBox().x - 10) + ',' + sideLine2.getBBox().y ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} );
            var sideBottom     = paper.line( 0, 0, 20, 0 ).transform( 't' + (sideLine2.getBBox().x - 10) + ',' + (sideLine2.getBBox().y2) ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} );


            // Side text
            var sideText       = paper.text( 0, 0, length ).attr( {'fill':'#2ab0e4' , 'font-size':'12px' , 'font-family':'arial'} );
            var sideTextBox    = sideText.getBBox();
            sideText.transform( 't0,' + sideTextBox.y*-1 ); // Position text at top left of paper

            // Side text background
            var sideTextBg     = paper.rect( 0, 0, sideTextBox.width + 10, sideTextBox.height ).attr( {'fill':backgroundColour} ).insertBefore( sideText );
            sideTextBg.transform( 't-5,0' ); // Center background under the text

            // Group the text and the background
            var sideTextGroup  = paper.g();
            sideTextGroup.add( sideTextBg, sideText );

            // Rotate and position the text group
            var transformTextGroup = new Snap.Matrix();
            transformTextGroup.translate( sideLine2.getBBox().cx - sideTextGroup.getBBox().height , sideLine2.getBBox().cy );

            // Rotate B side text so it's the correct orientation
            if( sideLabel === "B" ) {
                transformTextGroup.rotate(90, sideTextGroup.getBBox().cx, sideTextGroup.getBBox().cy);
            } else {
                transformTextGroup.rotate(-90, sideTextGroup.getBBox().cx, sideTextGroup.getBBox().cy);
            }

            sideTextGroup.transform( transformTextGroup );



            // Side label e.g. "A, B, C, D"
            // ----------------------------------------------

            var sideLabelText = paper.text( 0, 0, sideLabel ).attr( {'fill':'#2ab0e4' , 'font-size':'40px' , 'font-family':'arial' , 'font-weight':'bold'} );

            // Position label
            var transformSideLabelText = new Snap.Matrix();
            transformSideLabelText.translate( sideLine2.getBBox().x - sideLabelText.getBBox().width - 20 , sideLine2.getBBox().cy - sideLabelText.getBBox().cy );

            // Rotate side labels so they are the correct orientation
            if ( sideLabel === "B" ) {
                transformSideLabelText.rotate(90, sideLabelText.getBBox().cx, sideLabelText.getBBox().cy);
            } else if( sideLabel === "C" ) {
                transformSideLabelText.rotate(180, sideLabelText.getBBox().cx, sideLabelText.getBBox().cy);
            } else if( sideLabel === "D" ) {
                transformSideLabelText.rotate(-90, sideLabelText.getBBox().cx, sideLabelText.getBBox().cy);
            }

            sideLabelText.transform( transformSideLabelText );

            // Grouping
            sideGroup.add(sideLine, sideLine2, sideLine3, sideTop, sideBottom, sideTextGroup, sideLabelText);



            // Panels
            // ----------------------------------------------

            var numPanels = panelsArray.length;
            for( var i=0; i<=numPanels; i++ ) {

                var panelWidth           = panelsArray[i]/ratio;
                var panelWidthText       = panelsArray[i];
                var gap                  = gapsArray[i]/ratio;
                var panelTotalWidth      = panelWidth+gap ? panelWidth+gap : 0;
                var postPosition         = 0;
                var postsGroup           = paper.g();
                var post                 = postGroup.clone();
                var postRemove           = postSize / (numPanels+1); // Remove the size of the first and last post from each panel
                var gateWidth            = 0;



                // Get the previous post position
                // ----------------------------------------------

                for( var l=0; l<i; l++ ) {
                    var panelSize = panelsArray[l]/ratio;
                    postPosition += panelSize + gap - postRemove;
                }

                if( gate !== undefined && i === numPanels ) postPosition -= postSize/2;

                // Add in the last post TODO - need to check for a fixing point here and draw that
                if( isNaN(postPosition) ) {
                    postPosition = sideLine.getBBox().y2 - postSize;
                }



                // Create gate
                // ----------------------------------------------

                if( gate !== undefined ) {
                    var gateWidth      = gateSize/ratio;
                }

                if( gate === i ) {

                    var gateGroup      = paper.g();
                    var gateArch       = paper.circle(gateWidth, gateWidth, gateWidth).attr({stroke:'#2ab0e4' , strokeWidth:strokeSize, fill: backgroundColour});
                    var halfGateWidth  = gateArch.getBBox().width/2;
                    var halfGateHeight = gateArch.getBBox().height/2;
                    var gateSide       = paper.line(-1, halfGateHeight, halfGateWidth - postSize/2, halfGateHeight).attr({stroke:'#2ab0e4' , strokeWidth:strokeSize});
                    var gateMaskSquare = paper.rect(-2, -2, halfGateWidth + 2, halfGateHeight + 2).attr({fill: backgroundColour});
                    var gateText       = paper.text(0, 0, gateSize - 20).attr( {'fill':'#2ab0e4' , 'font-size':'12px' , 'font-family':'arial'} );
                    gateText.transform('t' + (halfGateWidth + 12) + ',' + (3 + halfGateWidth/2) +  ',r-90');
                    var gateTextTop    = paper.line(0, 0, 20, 0).attr({stroke:'#2ab0e4' , strokeWidth:strokeSize}).transform('t' + (halfGateWidth + 15) + ', 0');
                    var gateTextBottom = paper.line(0, 0, 20, 0).attr({stroke:'#2ab0e4' , strokeWidth:strokeSize}).transform('t' + (halfGateWidth + 15) + ', ' + halfGateHeight);
                    var gatePost       = postGroup.clone();

                    // Add a post for the gate
                    gatePost.transform('t' + (gateArch.getBBox().x + halfGateWidth - postSize/2) + ',' + (gateArch.getBBox().y - postSize) );

                    // Mask circle
                    gateArch.attr({mask: gateMaskSquare});

                    // Add gate elements to gate group
                    gateGroup.add(gateArch, gateSide, gateText, gateTextTop, gateTextBottom, gatePost);

                    var x = sideLine.getBBox().x - gateGroup.getBBox().width/2 + 5 - 10;
                    var y = sideLine.getBBox().y + postPosition + postSize/2;

                    gateGroup.transform('t' + x + ',' + y );

                }

                // If the gate has been added then add it to the postPosition
                if( i >= gate ) {
                    postPosition += gateWidth;
                }






                // Posts
                // ----------------------------------------------

                // Position
                var x = sideLine.getBBox().x - postSize;
                if( i === numPanels ) {
                    var y = sideLine.getBBox().y2 - postSize;
                } else {
                    var y = sideLine.getBBox().y + postPosition - postSize/2;
                }

                post.transform('t' + x + ',' + y );

                // Groupings
                postsGroup.add(post);



                // Panel top and bottom
                // ----------------------------------------------

                var panelTop             = paper.line( 0, 1, 20, 1 ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} );
                var panelBottom          = paper.line( 0, 1, 20, 1 ).attr( {stroke:'#2ab0e4' , strokeWidth:strokeSize} );

                // Position
                var x = sideLine3.getBBox().cx - panelTop.getBBox().width/2;
                if( i === 0 ) {
                    var yTop    = sideLine3.getBBox().y + postPosition;
                    var yBottom = sideLine3.getBBox().y + postPosition;
                } else if( i === numPanels ) {
                    var yBottom = sideLine3.getBBox().y2;
                } else {
                    var yTop    = sideLine3.getBBox().y + postPosition - postSize*2;
                    var yBottom = sideLine3.getBBox().y + postPosition - panelBottom.getBBox().y*2;
                }

                panelTop.transform('t' + x + ',' + yTop );
                panelBottom.transform('t' + x + ',' + yBottom );

                if( i === numPanels ) {
                    panelTop.remove();
                }



                // Panel text
                // ----------------------------------------------

                var panelText = paper.text( 0, 0, panelWidthText ).attr( {'fill':'#2ab0e4' , 'font-size':'12px' , 'font-family':'arial'} );
                panelText.transform( 't0,' + panelText.getBBox().y*-1 ); // Position text at top left of paper

                // Panel text background
                var panelTextBg = paper.rect( 0, 0, panelText.getBBox().width + 10, panelText.getBBox().height ).attr( {'fill':backgroundColour} ).insertBefore( panelText );
                panelTextBg.transform( 't-5,0' ); // Center background under the text

                // Group the text and the background
                var panelTextGroup = paper.g();
                panelTextGroup.add( panelTextBg, panelText );

                // Rotate and position the text group
                var transformTextGroup = new Snap.Matrix();
                var x = sideLine.getBBox().x - sidesGap/2 - panelTextGroup.getBBox().height/2;
                var y = (sideLine.getBBox().x + postPosition) + panelTotalWidth/2 + panelTextGroup.getBBox().width/2 - 2;

                if( sideLabel === "B" ) {
                    transformTextGroup.translate( x + panelTextGroup.getBBox().height , (sideLine.getBBox().x + postPosition) + postSize*2 - 2 + (panelTotalWidth/2 - postSize) - panelTextGroup.getBBox().width/2 );
                    transformTextGroup.rotate(90, 0, 0);
                } else {
                    transformTextGroup.translate( x , y );
                    transformTextGroup.rotate(-90, 0, 0);
                }

                panelTextGroup.transform( transformTextGroup );

                // Groupings
                sideGroup.add(panelTop, panelBottom, panelTextGroup, postsGroup);
                if( gateGroup ) sideGroup.add(gateGroup);

            }



            // Position each side joining the previous side
            // ----------------------------------------------

            sideGroupTrans = new Snap.Matrix();
            if( corners[corners.length - 1] !== undefined ){
                sideGroupTrans.translate(corners[corners.length - 1].x, corners[corners.length - 1].y );
                if( sideLabel === "B" ) {
                    sideGroupTrans.rotate( -90, 0, 0 );
                } else if( sideLabel === "C" ) {
                    sideGroupTrans.rotate( -180, 0, 0 );
                } else if( sideLabel === "D" ) {
                    sideGroupTrans.rotate( -270, 0, 0 );
                }
            }
            sideGroup.transform(sideGroupTrans);


            // Get previous line corner
            // ----------------------------------------------

            if ( sideLabel === "A" ) {
                if( gate !== undefined ) {
                    corners.push( { x:sideGroup.getBBox().x2 - postSize*1.5 - 46, y:sideGroup.getBBox().y2 - postSize +1 - 43 } );
                } else {
                    corners.push( { x:sideGroup.getBBox().x2 - postSize*1.5 , y:sideGroup.getBBox().y2 - postSize +1 } );
                }
            } else if( sideLabel === "B" ) {
                if( gate !== undefined ) {
                    corners.push( { x:sideGroup.getBBox().x2 - postSize + 1 - 50 , y:sideGroup.getBBox().y + postSize*1.5 + 46 } );
                } else {
                    corners.push( { x:sideGroup.getBBox().x2 - postSize + 1 , y:sideGroup.getBBox().y + postSize*1.5 } );
                }
            } else if( sideLabel === "C" ) {
                if( gate !== undefined ) {
                    corners.push( { x:sideGroup.getBBox().x + postSize*1.5 + 46 , y:sideGroup.getBBox().y + postSize - 1} );
                } else {
                    corners.push( { x:sideGroup.getBBox().x + postSize*1.5 , y:sideGroup.getBBox().y + postSize - 1 } );
                }
            }


            return sideGroup;

        }

    },

    getComponentList: function() {
        // console.log(JSON.stringify([this.model.attributes], null, ' '));

        $.ajax({
            //url: '/calculator/components',
            // TODO: Move to wp_rest endpoint
            url: '/wp-content/themes/protector/static/components.php',
            type: 'GET',
            data: this.model.toJSON()
        }).done(function(data) {

            var componentList = '<table class="table--responsive"><tbody>';

            componentList += data;

            componentList += '</table>';

            $('.calculator__summary__details').html( componentList );

        });
    }
});


// Entities
// ----------------------------------------------

var DataModel = Backbone.Model.extend({
    initialize: function() {
        this.bind('change', function() {
            // console.log(JSON.stringify([this.attributes], null, ' '));
        });
    },
    defaults: {
        "type"             : "",
        "typeName"         : "",
        "sides"            : "",
        "systemUrlTitle"   : "",
        "systemIconColour" : "",
        "systemIconCode"   : "",
        "systemId"         : "",
        "system"           : "",
        "systemSubtitle"   : "",
        "gateside"         : "",
        "gateoffset"       : "",
        "gateposition"     : "",


        A: {
            len: undefined,
            panels: [],
            gaps: [],
            fixingPoint: undefined,
            gate: undefined,
            side: undefined,
            post: true,
            maxPanelSize: ""
        },
        B: {
            len: undefined,
            panels: [],
            gaps: [],
            fixingPoint: undefined,
            gate: undefined,
            side: undefined,
            post: true,
            maxPanelSize: ""
        },
        C: {
            len: undefined,
            panels: [],
            gaps: [],
            fixingPoint: undefined,
            gate: undefined,
            side: undefined,
            post: true,
            maxPanelSize: ""
        },
        D: {
            len: undefined,
            panels: [],
            gaps: [],
            fixingPoint: undefined,
            gate: undefined,
            side: undefined,
            post: true,
            maxPanelSize: ""
        }
    }
});
var panelSizes;
var sides = ['A', 'B', 'C', 'D'];


// Start App
// ----------------------------------------------

Calculator.on("start", function(options){

    Calculator.calculator.show( new CalculatorView({
        model: new DataModel()
    }) );

    if (Backbone.history){
        Backbone.history.start();
    }

});

Calculator.start();
