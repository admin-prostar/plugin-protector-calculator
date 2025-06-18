
// Views
// ----------------------------------------------

var CalculatorSummaryView = Backbone.Marionette.ItemView.extend({

    template: '#calculator-summary-template',

    ui: {
        print                      : '.js-print',

    },

    events: {
        'click @ui.print'          : 'print',
    },

    initialize: function() {

        this.model.on('sidesRecalculated', this.render, this);

        this.model.on('sidesRecalculated', this.updateComponents, this);

        $('#component__list').hide();
    },

    onRender: function() {
        Calculator.trigger('matchHeight');
    },

    /**
     * [print Print page]
     */
    print: function( e ) {
        e.preventDefault();
        window.print();
        var total = 0;
        $('#component__list .sub_total').each(function() {
            total += parseFloat($(this).text());
        });
        if(typeof ga != 'undefined') {
            ga('send',
                'event',
                'Fence Calculator - Print',
                'Print',
                this.model.get('typeName') + ' ' + this.model.get('systemIconCode') + ' ' + this.model.get('system') + ' ' + this.model.get('systemSubtitle'),
                parseFloat(total.toFixed(2))
            );
        }
        if (typeof gtag != 'undefined') {
            gtag('event', 'Print', {
                'event_category' : 'Fence Calculator - Print',
                'event_label' : this.model.get('typeName') + ' ' + this.model.get('systemIconCode') + ' ' + this.model.get('system') + ' ' + this.model.get('systemSubtitle'),
                'value' : parseFloat(total.toFixed(2))
            });
        }
    },

    updateComponents: function() {

        var components = this.model.calculateComponents();
        components.csrf_token = $('input[name=csrf_token]').val();
        var t = this;
        $.post('/wp-json/calculator/v1/components/', components, function(data) {

            var emailData = $('.calculator__summary__dimensions').html().replace(/\s{2,}/g, ' ');

            $('#component__list').html(data).show();

            var total = 0;
            $('#component__list .sub_total').each(function() {
                total += parseFloat($(this).text());
            });
            $('#grand_total').text(total.toFixed(2));

            if ($('.calculator__graphics__summary:visible').length) {

                if (typeof gtag !== 'undefined') {

                    // pageview automatically sent with gtag.js
                    gtag('event', 'Estimate', {
                        'event_category' : 'Fence Calculator - Estimate',
                        'event_label' : t.model.get('typeName') + ' ' + t.model.get('systemIconCode') + ' ' + t.model.get('system') + ' ' + t.model.get('systemSubtitle'),
                        'value' : parseFloat(total.toFixed(2))
                    });

                } else if (typeof ga !== 'undefined') {

                    ga('send', 'pageview', {
                        'page': '/calculator/' + t.model.get('type') + '/estimate',
                        'title': 'Fence Calculator – ' + t.model.get('typeName') + ' ' + t.model.get('systemIconCode') + ' Estimate'
                    });
                    ga('send', 'event', 'Fence Calculator - Estimate', 'Estimate', t.model.get('typeName') + ' ' + t.model.get('systemIconCode') + ' ' + t.model.get('system') + ' ' + t.model.get('systemSubtitle'), parseFloat(total.toFixed(2)));

                }

            }
            emailData += $('#component__list').html().replace(/\s{2,}/g, ' ');

            $('#component_list').html(emailData);

            Calculator.trigger('matchHeight');
        });
    }

});
