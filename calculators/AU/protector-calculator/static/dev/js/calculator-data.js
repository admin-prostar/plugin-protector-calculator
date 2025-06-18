
// Application
// ----------------------------------------------

var Calculator = new Backbone.Marionette.Application();

Calculator.on('matchHeight', function() {
    if( Modernizr.mq('only screen and (min-width: 992px)') ) {
        //$('.calculator-content').matchHeight();
        $.fn.matchHeight._update();
    }
    if( Modernizr.mq('only screen and (min-width: 480px)') ) {
        $('.calculator__summary').matchHeight();
        $.fn.matchHeight._update();
    }
});

// Regions
// ----------------------------------------------

Calculator.addRegions({
    calculatorContent: '#calculator-content',
    calculatorPlan: '#calculator__graphics__plan',
    calculatorSummary: '#calculator__summary'
});


// System data
// ----------------------------------------------
/*
var systems = {
    sf9: {
        title: 'Semi Frameless',
        subTitle: '930mm Stainless Steel Post',
        urlTitle: 'semi-frameless-930mm-stainless-steelpost',
        iconCode: 'SF-9',
        iconColour: 'green',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: 22,
        wallSpacing: 104,
        wallFixing: 25,
        gateWidth: 960
    },
    sfa: {
        title: 'Semi Frameless',
        subTitle: '1250mm Aluminium Post',
        urlTitle: 'semi-frameless-1250mm-aluminium-system',
        iconCode: 'SF-A',
        iconColour: 'forest',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: 25,
        wallSpacing: 104,
        wallFixing: 25,
        gateWidth: 975
    },
    ffm: {
        title: 'Fully Frameless',
        subTitle: 'Stainless Steel Mini Post - Surface Mount',
        urlTitle: 'fully-frameless-mini-post-system',
        iconCode: 'FF-M',
        iconColour: 'yellow',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: {
            min: 20,
            max: 70
        },
        gateWidth: 1922
    },
    ffma: {
        title: 'Fully Frameless',
        subTitle: 'Aluminium Mini Post - Surface Mount',
        urlTitle: 'fully-frameless-mini-post-system',
        iconCode: 'FF-M',
        iconColour: 'yellow',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: {
            min: 20,
            max: 70
        },
        gateWidth: 1922
    },
    ffmd: {
        title: 'Fully Frameless',
        subTitle: 'Stainless Steel Mini Post - Deck Mount',
        urlTitle: 'fully-frameless-mini-post-system',
        iconCode: 'FF-M',
        iconColour: 'yellow',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: {
            min: 20,
            max: 70
        },
        gateWidth: 1922
    },
    ffmc: {
        title: 'Fully Frameless',
        subTitle: 'Stainless Steel Mini Post - Core Drill',
        urlTitle: 'fully-frameless-mini-post-system',
        iconCode: 'FF-M',
        iconColour: 'yellow',
        sizes: [1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300],
        sizeDifference: 100,
        channel: false,
        gap: {
            min: 20,
            max: 70
        },
        gateWidth: 1922
    },


    ffc: {
        title: 'Fully Frameless',
        subTitle: 'Channel',
        urlTitle: 'fully-frameless-channel-system',
        iconCode: 'FF-C',
        iconColour: 'orange',
        sizes: [1200, 1100, 1000, 900, 800, 700, 600],
        sizeDifference: 100,
        channel: true,
        gap: {
            min: 20,
            max: 70
        },
        gateWidth: 1820
    },
    sf6: {
        title: 'Semi Frameless',
        subTitle: '600mm Stainless Steel Post',
        urlTitle: 'semi-frameless-600mm-stainless-steel-system',
        iconCode: 'SF-6',
        iconColour: 'pink',
        sizes: [1100, 1050, 1000, 950, 900, 850, 800, 750, 700, 650, 600],
        sizeDifference: 50,
        channel: false,
        gap: 22,
        wallSpacing: 104,
        wallFixing: 25
    },
    bffc: {
        title: 'Fully Frameless',
        subTitle: 'Channel System Balustrade',
        urlTitle: 'fully-frameless-channel-system1',
        iconCode: 'FF-C',
        iconColour: 'red',
        sizes: [1200, 1150, 1100, 1050, 1000, 950, 900, 850, 800, 750, 700, 650, 600],
        sizeDifference: 50,
        channel: true,
        gap: {
            min: 10,
            max: 90
        }
    }
};
*/
var panelSizes;
var sides = ['A', 'B', 'C', 'D'];
