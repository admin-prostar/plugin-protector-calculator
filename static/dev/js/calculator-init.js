// Start App
// ----------------------------------------------

Calculator.on("start", function(options){

    window.fencedata = new DataModel();

    var calculatorFormView =  new CalculatorFormView({
        model: window.fencedata
    });

    var calculatorPlanView =  new CalculatorPlanView({
        model: window.fencedata
    });

    var calculatorSummaryView =  new CalculatorSummaryView({
        model: window.fencedata
    });

    Calculator.calculatorContent.show(calculatorFormView);
    Calculator.calculatorPlan.show(calculatorPlanView);
    Calculator.calculatorSummary.show(calculatorSummaryView);

});

Calculator.start();
