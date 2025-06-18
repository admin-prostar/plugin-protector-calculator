CalculatorFormView
// Views
// ----------------------------------------------

var CalculatorFormView = Backbone.Marionette.ItemView.extend({

    template: '#calculator-form-template',

    ui: {
        submit                     : '.js-calculator-submit',

        // Type
        typeButton                 : '.js-type',
        poolImage                  : '#poolImage',
        balustradeImage            : '#balustradeImage',

        // Systems
        systemAdd                  : '.calculator__systems .btn',
        systemEdit                 : '.calculator__systems .js-edit',

        // Finishes
        finishAdd                  : '.calculator__finishes .btn',
        finishEdit                 : '.calculator__finish__selected .js-edit',

        // Options
        optionsAdd                 : '.calculator__options .btn',
        optionsEdit                : '.calculator__options__selected .js-edit',
        optionGroups               : '.calculator__options .optionGroup',

        // Sides
        sidesNumber                : '#calculator-sides-total',
        sideRow                    : '.calculator__side',
        sidesAdd                   : '.calculator__sides button',
        sidesEdit                  : '.calculator__sides__selected .js-edit',
        sidesNumRows               : '.calculator__sides__numrows',
        sideLength                 : '.side-length',
        maxPanelSize               : '.calculator__side__size',

        // Gate
        gateAdd                    : '.calculator__gate button',
        gateSide                   : '#gate-side',
        gatePosition               : '.gate-position',
        gateEdit                   : '.calculator__gate__selected .js-edit',

        bunningsLink               : '.calculator__bunnings__url',
        continueWorking            : '.calculator__components-summary__success [data-js-btn-continue]'
    },

    events: {
        'click @ui.bunningsLink' : 'trackBunnings',

        // Type
        'click @ui.typeButton'     : 'chooseType',

        // Systems
        'click @ui.systemAdd'      : 'addSystem',
        'click @ui.systemEdit'     : 'editSystem',

        // Finishes
        'click @ui.finishAdd'      : 'addFinish',
        'click @ui.finishEdit'     : 'editFinish',

        // Options
        'click @ui.optionsAdd'      : 'addOptions',
        'click @ui.optionsEdit'     : 'editOptions',

        // Sides
        'click @ui.sidesAdd'       : 'addSides',
        'change @ui.sidesNumber'   : 'showSides',
        'click @ui.sidesEdit'      : 'editSides',
        'keyup @ui.sideLength'     : 'restrictCharacters',

        // Gate
        'click @ui.gateAdd'        : 'addGate',
        'change @ui.gateSide'      : 'addGateOffset',
        'click @ui.gateEdit'       : 'editGate',
        'keyup @ui.gateOffset'     : 'validateGateOffset',

        // Components Summary form
        'click @ui.continueWorking': 'resetSummary'
    },

    initialize: function() {
        this.model.on('change', this.render, this);

        // Hmmm... Far from ideal... This should be in the application and trigger an event.
        var t = this;
        $('.calculator__graphics__select .js-type').on('click', function(e) {
            t.chooseType(e);
        });

        // Check for users selecting an option directly
        var hash = window.location.hash;
        this.processHash(hash, true);

        window.onpopstate = function(){
            t.processHash(window.location.hash)
        }
    },

    onRender: function() {

        // Initialize form validation
        this.validateForm();

        $('input').not('.js-unstyled').iCheck();

        ev.accordion.init();

        // Update max panel sizes based on system - this is so shit
        var code = this.model.get('systemId');
        if( code !== "" ) {
            panelSizes = systems[code].sizes;
            var panelSizeHtml = '';
            if (panelSizes.length > 0) {
                _.each(panelSizes, function (panelSize) {
                    panelSizeHtml += '<option value="' + panelSize + '">' + panelSize + '</option>';
                });
            } else {
                // Hide panel selections
                panelSizeHtml += '<option value="900">900</option>';
            }
            $('.side-max-panel-size option').remove();
            $('.side-max-panel-size').html(panelSizeHtml);
        }

        // When switching between types and having a previously selected system it doesn't collapse the list
        // so check when rendering to see if there is a selected system and collapse the list
        if( $('.calculator__system:visible .calculator__select-selected').length ) {
            $('#calculator').removeClass('system-is-visible').addClass('system-chosen');
        }

        // TODO: We're not currently allowing for wall fixings :/
        $('.calculator__side__fixing').hide();

        Calculator.trigger('matchHeight');

        // Submit the freeform form via Ajax
        var t = this;
        $('form.calculator__components-summary').ajaxForm({
            // Validate form
            beforeSubmit: function() {
                return $(".calculator__components-summary").valid();
            },
            // Send form if valid
            success: function() {
                if(typeof ga != 'undefined') {
                    ga('send', 'pageview', {
                        'page': '/calculator/' + t.model.get('type') + '/estimate/complete',
                        'title': 'Fence Calculator – ' + t.model.get('typeName') + ' ' + t.model.get('systemIconCode') + ' Form Complete'
                    });
                    $('.calculator__components-summary__success').show();
                }
            }
        });

        // Check for when the right column has loaded and match the heights
        $('.calculator__graphics').imagesLoaded().always(function(){
            Calculator.trigger('matchHeight');
        });

    },

    processHash: function(hash, ignorePushState) {
        if ( hash ) {
            var hashParts = hash.match(/^#(pool\-fencing|balustrading)(?:\/([a-z0-9]{2,6}))?$/i);
            var type, typeName;
            if (hashParts && hashParts.length > 1) {
                type = hashParts[1];
                if (type === "pool-fencing") {
                    typeName = "Pool Fencing System";
                } else if (type === "balustrading") {
                    typeName = "Balustrading System";
                }
                this.selectType(type, typeName, ignorePushState);

                if (hashParts[2] != undefined) {
                    this.setSystem(hashParts[2]);
                }

                // Wait a little until rendering is complete before we initialize things...
                setTimeout(function() {
                    ev.accordion.init();
                }, 500);


            }
        }
    },

    trackBunnings: function() {

        var total = 0;
        $('#component__list .sub_total').each(function() {
            total += parseFloat($(this).text());
        });

        if(typeof ga != 'undefined') {
            ga('send',
                'event',
                'Fence Calculator - Bunnings Button',
                'Click',
                this.model.get('typeName') + ' ' + this.model.get('systemIconCode') + ' ' + this.model.get('system') + ' ' + this.model.get('systemSubtitle'),
                parseFloat(total.toFixed(2))
            );
        }

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
                    element.parents('.icheckbox').next('label').after(error);
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


    changeTypeImage: function(imageName) {
        // TODO: Replace file path with environment variable
        var src = "/wp-content/themes/protector/static/img/calculator/" + imageName + ".jpg";

        // Use uploaded images if available
        if (imageName == "pool-fencing" && ($('#poolImage').text().indexOf("uploads") > -1)) {
            src = $('#poolImage').text();
        } else if ($('#balustradeImage').text().indexOf("uploads") > -1) {
            src = $('#balustradeImage').text();
        }

        $('.calculator__graphics__systems img').attr('src', src);
    },

    emptySystemImage: function() {
        $('.calculator__graphics__sides img').attr('src', '');
    },

    changeSystemImage: function(imageName) {
        var sidesSrc = this.model.get('systemImage');
        var planSrc = "/wp-content/themes/protector/static/img/calculator/plan-" + imageName + ".jpg";

        $('.calculator__graphics__sides img').attr('src', sidesSrc);
        //$('.calculator__graphics__plan .calculator__plan img').attr('src', planSrc);
        $('.calculator__graphics__plan .calculator__plan img').attr('src', sidesSrc);
    },


    chooseType: function( e ) {

        e.preventDefault();

        var $choice  = $(e.currentTarget);
        var type     = $choice.attr('data-type');
        var typeName = $choice.attr('data-type-name');

        this.selectType( type, typeName );

        if(typeof ga != 'undefined') {
            ga('send', 'pageview', {
                'page': '/calculator/' + type,
                'title': 'Fence Calculator - ' + typeName
            });
        }

    },


    /**
     * [selectType Select the type of system and add to model]
     */
    selectType: function( type, typeName, ignorePushState) {

        // Change the right hand column image
        this.changeTypeImage(type);

        // Unhide systems
        this.showSystems();

        // Save type to model
        this.model.set({'type':type , 'typeName':typeName});

        // If type is balustrade then remove any gate data from the model and hide gates panels
        this.model.set({
            'gateside'    : '',
            'gateposition': ''
        }, {silent: true});
        $('#calculator').removeClass('gates-is-visible gate-positioning-is-visible gate-chosen');

        // Update ui state
        $('#calculator').addClass('system-is-visible');

        // Show the appropriate systems
        $('.calculator__system').removeClass('is-visible');
        $('.calculator__system.systems-' + type).addClass('is-visible');

        if (history.pushState && ! ignorePushState && '#'+this.model.get('type') != window.location.hash) {
            history.pushState({}, '', '#' + this.model.get('type'));
        }

        // Match the side heights
        Calculator.trigger('matchHeight');
    },

    // Sytems
    addSystem: function( e ) {

        if ($(e.currentTarget).text() !== "Options") {
            var code = $(e.currentTarget).val();

            // Handle option selection
            if (code.indexOf("|") > -1) {

                var codeSplit = code.split("|");
                code = codeSplit[0];
                var optionSplit = codeSplit[1].split(":");

                // Find option array and replace with single component code
                $.each(['components', 'panels', 'posts'], function(index, value) {
                    if (optionSplit[0] in mapping[value]) {
                        mapping[value][optionSplit[0]] = optionSplit[1];
                    }
                });

            } else {
                console.log("setting system");
                this.setSystem(code);
            }
        }
    },

    setSystem: function(code) {

        // If system has a single finish then set here otherwise empty
        //console.log(code);
        //console.log(systems[code]);
        var finish = ((typeof systems[code] != 'undefined') && Array.isArray(systems[code].finishes)) ? "" : systems[code].finishes;

        this.setFinish(finish);

        // Save system to model
        this.model.set({'systemId':code, 'system':systems[code].title, 'systemType':systems[code].systemType, 'systemSubtitle':systems[code].subTitle , 'systemImage':systems[code].systemImage , 'systemIconCode':systems[code].iconCode , 'systemIconColour':systems[code].iconColour, 'systemUrlTitle':systems[code].urlTitle});

        // Change the right hand column image
        this.changeSystemImage(code);

        console.log(this.model);

        // Reset default max panel size
        this.resetMaxPanelSize();

        // Hide all non choices
        $('#calculator').removeClass('system-is-visible').addClass('system-chosen');

        // Show the Sides
        $('#calculator').addClass('sides-is-visible');

        if ($('#calculator').hasClass('side-chosen')) {
            this.model.calculateSides();
        }

        // Match the side heights
        Calculator.trigger('matchHeight');

        if (history.pushState) {
            history.pushState({}, '', '#' + this.model.get('type') + '/' + this.model.get('systemId'));
        }

    },

    editSystem: function() {
        console.log("editing systems");

        this.model.set({'system':'', 'systemType':'' , 'systemSubtitle':'' , 'systemIconCode':'' , 'systemIconColour':''});

        // Reset sides
        this.showSides(this.ui.sidesNumber);
        $('.side-chosen').removeClass('side-chosen');

        // Show all systems
        this.showSystems();

        // Reset src on sides image
        this.emptySystemImage();

        // Match the side heights
        Calculator.trigger('matchHeight');
    },

    showSystems: function() {
        $('.calculator__system .calculator__select-selected').removeClass('calculator__select-selected');
        $('.system-chosen').removeClass('system-chosen').addClass('system-is-visible');
        $('.calculator__system .accordion-is-expanded').removeClass('accordion-is-expanded');

        // Match the side heights
        Calculator.trigger('matchHeight');
    },

    hideSingleOptions: function() {
        var completeCount = 0;
        var groupCount = this.ui.optionGroups.length;

        $.each(this.ui.optionGroups, function () {

            // If less than one option exists for each group the hide set
            if ($(this).find('.btn').length < 2) {
                $(this).css('display', 'none');

                var code = $(this).find('.btn').val();

                // Handle option selection
                if (code.indexOf("|") > -1) {

                    var codeSplit = code.split("|");
                    code = codeSplit[0];
                    var optionSplit = codeSplit[1].split(":");

                    // Find option array and replace with single component code
                    $.each(['components', 'panels', 'posts'], function (index, value) {
                        if (optionSplit[0] in mapping[value]) {
                            mapping[value][optionSplit[0]] = optionSplit[1];
                        }
                    });
                }
                completeCount++;
            }
        });

        if ((completeCount > 0) && (completeCount >= groupCount)) {
            console.log("all options selected");
            // Set flag to indicate options selected
            this.model.set({ 'optionsSelected':null });
        }
    },

    // Finishes
    addFinish: function( e ) {

        var finish = $(e.currentTarget).val();
        this.setFinish(finish);

    },

    setFinish: function(finish) {

        // Save finish to model
        this.model.set({ 'finish':finish, 'optionsSelected':false });
        console.log(this.model);

        if ($('#calculator').hasClass('side-chosen')) {
            this.model.calculateSides();
        }

        // TODO: Trigger option selections when only one remains
        if (this.ui.optionsAdd.length == 1) {

            this.ui.optionsAdd.trigger("click");

        } else {

            this.hideSingleOptions();

        }
    },

    editFinish: function() {
        //this.showFinish();
        this.model.set({'finish':''});

        // Reset src on sides image
        //this.emptySystemImage();

        // Match the side heights
        //Calculator.trigger('matchHeight');
    },

    showFinish: function() {
        $('.calculator__finish .calculator__select-selected').removeClass('calculator__select-selected');
        $('.system-chosen').removeClass('system-chosen').addClass('system-is-visible');
        $('.calculator__system .accordion-is-expanded').removeClass('accordion-is-expanded');

        // Match the side heights
        //Calculator.trigger('matchHeight');
    },


    // Options
    addOptions: function( e ) {

        var code = $(e.currentTarget).val();

        // Handle option selection
        if (code.indexOf("|") > -1) {

            var codeSplit = code.split("|");
            code = codeSplit[0];
            var optionSplit = codeSplit[1].split(":");

            // Find option array and replace with single component code
            $.each(['components', 'panels', 'posts'], function(index, value) {
                if (optionSplit[0] in mapping[value]) {
                    mapping[value][optionSplit[0]] = optionSplit[1];
                }
            });
        }

        // Set flag to indicate options selected
        this.model.set({ 'optionsSelected': $(e.currentTarget).text() });

        // TODO: Allow for multiple option groups

        if ($('#calculator').hasClass('side-chosen')) {
            this.model.calculateSides();
        }

        // Could use a model field to flag if options selected, and then clear value on a system/finish change
        //$(e.currentTarget).css('cssText', 'background-color: green !important');
    },

    editOptions: function() {

        //this.showFinish();
        //if (this.model.get('optionsSelected') !== null) {
            this.model.set({'optionsSelected': false});
            this.hideSingleOptions();
        //}

        // Reset src on sides image
        //this.emptySystemImage();

        // Match the side heights
        //Calculator.trigger('matchHeight');
    },

    showFinish: function() {
        $('.calculator__finish .calculator__select-selected').removeClass('calculator__select-selected');
        $('.system-chosen').removeClass('system-chosen').addClass('system-is-visible');
        $('.calculator__system .accordion-is-expanded').removeClass('accordion-is-expanded');

        // Match the side heights
        //Calculator.trigger('matchHeight');
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

        // Set max panel size based on previously selected value
        this.setMaxPanelSize();

        // Match the side heights
        Calculator.trigger('matchHeight');
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

//        // Trigger render again as changes to model are silent
//        this.render();

        // Show sides selected and hide side options
        $('#calculator').addClass('side-chosen');
        $('.sides-is-visible').removeClass('sides-is-visible');

        // Show the gate if type is pool fencing
        if( this.model.get('type') === 'pool-fencing' ) {
            if( ! $('#calculator').hasClass('gate-chosen') ) {
                $('#calculator').addClass('gates-is-visible');
            }
        } else {

            // Show the components summary view
            $('#calculator').addClass('components-is-visible');
        }

        // Update the sides select list
        var sidesHtml = '<option value="">Please select</option>';
        for( var i=0; i<this.model.get('sides'); i++ ) {
            sidesHtml += '<option value="' + sides[i] + '">' + sides[i] + '</option>';
        }
        this.ui.gateSide.find('option').remove();
        this.ui.gateSide.html(sidesHtml);

        this.model.calculateSides();

        // Match the side heights
        Calculator.trigger('matchHeight');
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

        // Set max panel size based on previously selected value
        this.setMaxPanelSize();

        // Hide sides selected
        $('.side-chosen').removeClass('side-chosen');

        // Show the sides
        $('#calculator').addClass('sides-is-visible');

        $('#calculator').removeClass('gates-is-visible');

        // Match the side heights
        Calculator.trigger('matchHeight');
    },

    setMaxPanelSize: function() {
        var sidesArray = [
            this.model.get('A'),
            this.model.get('B'),
            this.model.get('C'),
            this.model.get('D')
        ];

        for(var i=0; i<sides.length; i++) {
            $('.side-max-panel-size').eq(i).find('option[value=' + sidesArray[i].maxPanelSize + ']').attr('selected', 'selected');
        }
    },

    resetMaxPanelSize: function() {
        var sidesArray = [
            this.model.get('A'),
            this.model.get('B'),
            this.model.get('C'),
            this.model.get('D')
        ];

        for(var i=0; i<sides.length; i++) {
            sidesArray[i].maxPanelSize = "";
            $('.side-max-panel-size').eq(i).find('option').eq(0).attr('selected', 'selected');
        }
    },

    addGate: function( e ) {

        // Save gate position to model
        // ----------------------------------------------

        // Save gate position to model
        this.model.set( 'gateside', this.ui.gateSide.val());
        this.model.set( 'gateposition', this.ui.gatePosition.val());

        // View showing/hiding
        // ----------------------------------------------

        // Show the gate
        $('#calculator').removeClass('gates-is-visible').addClass('gate-chosen');

        // Show the components summary view
        $('#calculator').addClass('components-is-visible');

        // Show the sides
        $('#calculator').addClass('sides-is-visible');

        // Trigger a gate added event
        this.model.calculateSides();

        // Match the side heights
        Calculator.trigger('matchHeight');

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
        Calculator.trigger('matchHeight');
    },

    editGate: function( e ) {
        e.preventDefault();
        $('#calculator').removeClass('gate-chosen').addClass('gates-is-visible');

        // Update the sides select list
        var sidesHtml = '<option value="">Please select</option>';
        for( var i=0; i<this.model.get('sides'); i++ ) {
            sidesHtml += '<option value="' + sides[i] + '">' + sides[i] + '</option>';
        }
        this.ui.gateSide.find('option').remove();
        this.ui.gateSide.html(sidesHtml);

        // Match the side heights
        Calculator.trigger('matchHeight');
    },

    validateGateOffset: function() {
        this.ui.gatePosition.removeAttr('checked').parent().removeClass('is-active');
    },

    resetSummary: function(e) {
        e.preventDefault();

        $('.calculator__components-summary input').val('');

        $('.calculator__components-summary__success').slideUp(500);
    }

});
