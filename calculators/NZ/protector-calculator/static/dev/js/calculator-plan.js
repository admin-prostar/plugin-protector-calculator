
// Views
// ----------------------------------------------

var CalculatorPlanView = Backbone.Marionette.ItemView.extend({

    template: '#calculator-plan-template',

    ui: {
    },

    events: {
    },

    initialize: function() {
        this.model.on('sidesRecalculated', this.render, this);
        this.model.on('rotationChanged', this.redrawPlans, this);

        $('body').on('click', '.calculator-plan', function() {
            $(this).toggleClass('is-enlarged');
            if ($(this).hasClass('is-enlarged')) {
                var windowHeight = window.innerHeight - 80;
                $('.calculator-plan svg').css('height', windowHeight + 'px');
            } else {
                $('.calculator-plan svg').css('height', '500px');
            }
            Calculator.trigger('matchHeight');
        });

        $('body').on('click', '.icon_rotate', function(e) {
            e.stopPropagation();
            e.preventDefault();

            // Hackedy hack hack... :(
            window.fencedata.set('viewRotation',  (window.fencedata.get('viewRotation') + 90) % 360);
            window.fencedata.trigger('rotationChanged');
        });
    },

    onRender: function() {
        // Draw plan
        if (this.model.get('sides')) {
            this.drawPlan( );
        }
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
        var model = this.model;

        a.side = "A";
        b.side = "B";
        c.side = "C";
        d.side = "D";

        var sideData = { a: a, b: b, c: c, d: d };
        var largest          = 0;
        var rotate           = 90;
        var svgSize          = { width: "100%", height: "500"};
        var corners          = [];
        var strokeSize       = 2;
        // var backgroundColour = maskColour;
        var snap             = Snap( svgSize.width, svgSize.height );
        var planGroup        = snap.paper.g();

        snap.attr({'viewBox': '0 0 680 680'});

        // Find largest panel size and divide by the inside square size so we can fit within the svg
        // ----------------------------------------------

        for(side in sideData) {
            if( sideData[side].calculatedWidth > largest ) {
                largest = sideData[side].calculatedWidth;
            }
        }

        // Loop through each side and add to svg
        // ----------------------------------------------

        for(side in sideData) {
            if( sideData[side].len ) {
                var nextSide = addSide(snap.paper, sideData[side]);
                planGroup.add(nextSide);
            }
        }


        this.snap = snap;
        this.planGroup = planGroup;

        this.redrawPlans();


        // TODO - Need to move this

        function addSide(paper, side) {

            var sideGroup  = paper.g(),
                panelGroup = paper.g(),
                strokeSize = 5;

            sideGroup.add(panelGroup);


            // Create side base
            // ----------------------------------------------
            var sideLine = paper.line( 1, 0, 1, side.calculatedWidth).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
            sideGroup.add(sideLine);

            // Overall side dimension
            // ----------------------------------------------
            var sideDimension = paper.line( -400, 0, -400, side.calculatedWidth).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
            var sideDimensionEndOne = paper.line( -450, 1, -50, 1).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
            var sideDimensionEndTwo = paper.line( -450, side.calculatedWidth, -50, side.calculatedWidth).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
            var sideDimensionText = paper.text( -480, side.calculatedWidth/2, side.calculatedWidth+'mm').attr( {'fill': planColor , 'font-size':'80px' , 'font-family':'arial' , 'font-weight':'bold', 'text-anchor': 'middle'} );
            t = new Snap.Matrix();
            t.rotate( -90, sideDimensionText.getBBox().cx, sideDimensionText.getBBox().cy);
            if ( side.side === "B" ) {
                t.rotate(180, sideDimensionText.getBBox().cx, sideDimensionText.getBBox().cy);
            }
            sideDimensionText.transform(t);
            sideGroup.add(sideDimension, sideDimensionEndOne, sideDimensionEndTwo, sideDimensionText);

            // Side label e.g. "A, B, C, D"
            // ----------------------------------------------
            var sideLabelText = paper.text( 0, side.calculatedWidth/2, 'Side '+side.side + ' ('+side.calculatedWidth+'mm)' ).attr( {'fill':planColor , 'font-size':'128px' , 'font-family':'arial' , 'font-weight':'bold'} );
            sideGroup.add(sideLabelText);



            // Rotate side labels so they are the correct orientation
            // ----------------------------------------------
            var transformSideLabelText = new Snap.Matrix();
            transformSideLabelText.rotate( -90, sideLabelText.getBBox().cx, sideLabelText.getBBox().cy).translate(0, -1150);
            if ( side.side === "B" ) {
                transformSideLabelText.rotate(180, sideLabelText.getBBox().cx, sideLabelText.getBBox().cy);
            }
            sideLabelText.transform( transformSideLabelText );

            // Pool side text added to certain systems
            if(model.get('type') !== 'balustrading') {
                var poolsideLabelText = paper.text( 0, side.calculatedWidth/2, 'POOL SIDE ').attr( {'fill':'#000000' , 'font-size':'88px' , 'font-family':'arial' , 'font-weight':'bold'} );
                sideGroup.add(poolsideLabelText);

                var transformPoolSideLabelText = new Snap.Matrix();
                transformPoolSideLabelText.rotate( -90, poolsideLabelText.getBBox().cx, poolsideLabelText.getBBox().cy).translate(0, -80);
                if ( side.side === "B" ) {
                    transformPoolSideLabelText.rotate(180, poolsideLabelText.getBBox().cx, poolsideLabelText.getBBox().cy);
                }
                poolsideLabelText.transform( transformPoolSideLabelText );
            }
            // Panels
            // ---------------------------------------------

            var numPanels = side.panels.length;
            var currentOffset = side.gaps[0] / 2;
            var postWidth = side.gaps[0] * 2;

            // Iniial Staring post
            // ---------------------------------------------
            if (side.side == 'A') {
                drawPost(side, panelGroup);
            }

            // Draw the panels
            for (var i = 0; i < numPanels; i++) {


                // Frameless systems align the gate left
                // ---------------------------------------------
                if ( ! side.post && i == 0) {

                    drawGate();

                    // First panel after the gaps needs a previous size label of 10
                    if (side.gatedrawn) {
                        side.gatedrawn = false;
                        drawPanel(side.panels[i], side.gaps[i], 20);//);
                    } else {
                        drawPanel(side.panels[i], side.gaps[i]);//);
                    }

                } else {

                    drawPanel(side.panels[i], side.gaps[i]);
                }


                // Move current position along the fence side
                // ---------------------------------------------
                currentOffset = currentOffset +  side.panels[i] + side.gaps[i];

                // Add a panel post
                // ---------------------------------------------
                drawPost();

                // Draw framed fence gates in the centre for now
                // TODO: This should honor the gate position selected
                // ---------------------------------------------
                if (side.post && (i+1)/numPanels >= 0.5) {
                    drawGate();
                }

            }

            // There may be a side with no panels and just a gate, in which case we need to draw it...
            if (numPanels == 0) {
                if (side.post) {
                    drawGate();
                }
            }


           // Position each side joining the previous side
           // ----------------------------------------------
            var sideGroupTrans = new Snap.Matrix();
            if( corners[corners.length - 1] !== undefined ){
                sideGroupTrans.translate(corners[corners.length - 1].x, corners[corners.length - 1].y );
                if( side.side === "B" ) {
                    sideGroupTrans.rotate( -90, 0, 0 );
                } else if( side.side === "C" ) {
                    sideGroupTrans.rotate( -180, 0, 0 );
                } else if( side.side === "D" ) {
                    sideGroupTrans.rotate( -270, 0, 0 );
                }
            }
            sideGroup.transform(sideGroupTrans);

            // Get previous line corner
            // ----------------------------------------------

            if ( side.side === "A" ) {
                corners.push( {
                    x:panelGroup.getBBox().x2 - postWidth/2 ,
                    y:sideGroup.getBBox().y2 - postWidth/2
                } );
            } else if( side.side === "B" ) {
                corners.push( {
                    x: corners[0].x + panelGroup.getBBox().height - postWidth/4,
                    y: corners[0].y
                });
            } else if( side.side === "C" ) {
                corners.push( {
                    x: corners[1].x ,
                    y: corners[1].y - panelGroup.getBBox().height + postWidth/4
                } );
            }

            return sideGroup;


            /**
             * TODO - Need to move this
             *
             * @return void
             */
            function drawGate()
            {
                // Maybe draw a gate?
                if (side.gate) {

                    if ( ! side.post) {

                        // Draw hinge panel for frameless systems
                        drawPanel(1000, 10, side.gaps[i]);
                        currentOffset = currentOffset +  1010;
                        side.gateWidth = side.gateWidth - 1010;

                        drawPanel(890, 10, 20, true);

                    } else {

                        console.log("Drawing gate");
                        console.log("890 | " + side.gateWidth + " | " + side.gaps[i] + " | true " + side.gatePosition);
                        drawPanel(890, side.gateWidth - 890, side.gaps[i], true, side.gatePosition);

                    }


                    currentOffset = currentOffset + side.gateWidth + 10;
                    side.gate = false;
                    side.gatedrawn = true;

                    drawPost();

                }
            }


            /**
             * TODO - Need to move this
             *
             * @return void
             */
            function drawPost() {

                var post = paper.rect(-1 * postWidth/2, currentOffset - postWidth/2 - (side.gaps[0] / 2), postWidth, postWidth);
                panelGroup.add(post);
                if(side.post) {
                    post.attr({
                        'fill': '#000',
                        'fill-opacity': '0.8'
                    })
                } else {
                    post.attr({
                        'fill-opacity': '0'
                    })
                }
            }

            /**
             * TODO - Need to move this
             *
             * @param  int      panelLength
             * @param  int      panelSpacing
             * @param  int      previousSpacing
             * @param  boolean  isGatePanel
             * @return void
             */
            function drawPanel(panelLength, panelSpacing, previousSpacing, isGatePanel, gatePosition) {

                previousSpacing = previousSpacing || panelSpacing;

                // Draw the panel
                // ---------------------------------------------
                var panel = paper.rect(-1 * strokeSize, currentOffset, strokeSize*2, panelLength).attr({
                    'fill': '#000'
                });
                panelGroup.add(panel);

                if (isGatePanel) {


                    var t = new Snap.Matrix();
                    window.gatePanel = panel;
                    if (model.get('systemId') == 'sf9' || gatePosition == 'right') {
                        t.rotate(-25, panel.getBBox().x + 65, panel.getBBox().y2 +35);
                        panel.transform(t);
                        // Draw the opening arc
                        var c = paper.path(Snap.format(
                            "M{a} {b}C{x1} {y1} {x2} {y2} {x} {y}",
                            {
                                a: 0,
                                b: currentOffset-panelSpacing/2,
                                x1: panel.getBBox().x,
                                y1: currentOffset+panelSpacing/1.5,
                                x2: panel.getBBox().x,
                                y2: panel.getBBox().y,
                                x: panel.getBBox().x,
                                y: panel.getBBox().y
                            })).attr({
                            "stroke": "#000",
                            "stroke-opacity": "0.4",
                            "stroke-width": strokeSize*2,
                            "stroke-dasharray": strokeSize*6 + ' ' + strokeSize*4,
                            "fill": "none"

                        });
                    } else {
                        t.rotate(25, panel.getBBox().x - 35, panel.getBBox().y);
                        panel.transform(t);

                        // Draw the opening arc
                        var c = paper.path(Snap.format(
                            "M{a} {b}C{x1} {y1} {x2} {y2} {x} {y}",
                            {
                                a: 0,
                                b: currentOffset+panelLength+panelSpacing/2,
                                x1: panel.getBBox().cx,
                                y1: currentOffset+panelLength+panelSpacing/1.5,
                                x2: panel.getBBox().cx,
                                y2: currentOffset+panelLength+panelSpacing/1.5,
                                x: panel.getBBox().x,
                                y: panel.getBBox().y+panel.getBBox().height
                            })).attr({
                            "stroke": "#000",
                            "stroke-opacity": "0.4",
                            "stroke-width": strokeSize*2,
                            "stroke-dasharray": strokeSize*6 + ' ' + strokeSize*4,
                            "fill": "none"

                        });
                    }

                    sideGroup.add(c);
                }

                // Draw dimensions against posts
                // ---------------------------------------------
                if (side.post ) {

                    // Panel dimension line
                    var panelDimension = paper.line( -200, currentOffset, -200, currentOffset+panelLength).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
                    sideGroup.add(panelDimension);

                    // Add the indicator line (not needed for the last panel)
                    if (i < numPanels-1) {
                        var panelDimensionEnd = paper.line(
                            -250,
                            currentOffset + panelLength + (panelSpacing/2), // current offset + panelsize + gap
                            -50 - (postWidth/2),
                            currentOffset+panelLength+(panelSpacing/2)  // current offset + panelsize + gap
                        ).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
                        sideGroup.add(panelDimensionEnd)
                    }

                } else {

                    // Panel dimension line
                    var panelDimension = paper.line( -200, currentOffset, -200, currentOffset+panelLength).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
                    sideGroup.add(panelDimension);

                    // Add the indicator lines
                    var panelDimensionEnd = paper.line(
                        -250,
                        currentOffset + panelLength, // current offset + panelsize + gap
                        -50 - (postWidth/2),
                        currentOffset+panelLength // current offset + panelsize + gap
                    ).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
                    sideGroup.add(panelDimensionEnd);
                    var panelDimensionEnd = paper.line(
                        -250,
                        currentOffset, // current offset + panelsize + gap
                        -50 - (postWidth/2),
                        currentOffset  // current offset + panelsize + gap
                    ).attr( {stroke:'rgba(0,0,0,0.25)' , strokeWidth:strokeSize} );
                    sideGroup.add(panelDimensionEnd);
                }


                var panelDimensionGroup = paper.g();

                if (side.post) {

                    // Add the post centre dimension (U+2104)
                    var panelDimensionText = paper.text(
                            -220,
                            panelDimension.getBBox().cy + 120,
                            (panelLength+panelSpacing)+'mm'
                        )
                        .attr( {'fill':planColor , 'font-size':'80px' , 'font-family':'arial' , 'font-weight':'bold', 'text-anchor': 'middle'} );
                    panelDimensionGroup.add(panelDimensionText);

                    var letterL = paper.text(
                        panelDimensionText.getBBox().x - 60,
                        panelDimensionText.getBBox().cy + 34,
                        'L'
                    ).attr( {'fill':planColor , 'font-size':'110px' , 'font-family':'arial' , 'font-weight':'normal', 'text-anchor': 'middle'} );

                    var letterC = paper.text(
                        letterL.getBBox().x + 12,
                        letterL.getBBox().y + 80,
                        'c'
                    ).attr( {'fill':planColor , 'font-size':'94px' , 'font-family':'arial' , 'font-weight':'normal', 'text-anchor': 'middle'} );
                    panelDimensionGroup.add(letterL);
                    panelDimensionGroup.add(letterC);
                }

                // Add the panel size
                var panelDimensionText = paper.text(
                        -250,
                        panelDimension.getBBox().cy,
                        (panelLength)+'mm'
                    )
                    .attr( {'fill':planColor , 'font-size':'80px' , 'font-family':'arial' , 'font-weight':'bold', 'text-anchor': 'middle'} );
                panelDimensionGroup.add(panelDimensionText);
                sideGroup.add(panelDimensionGroup);

                // Transfor the text sideways
                var t = new Snap.Matrix();
                t.rotate( -90, panelDimension.getBBox().cx -35, panelDimension.getBBox().cy);
                if ( side.side === "B" ) {
                    t.rotate(180, panelDimension.getBBox().cx-45, panelDimension.getBBox().cy+30);
                }
                panelDimensionGroup.transform(t);


                if ( ! side.post) {

                    // No posts, add the panel spacing dimensions
                    if (i == 0 && ! isGatePanel) {

                        // first panel gets an extra for the first gap offset
                        var panelSpacingText = paper.text(
                                -320,
                                panelDimension.getBBox().y,
                                (previousSpacing/2)+'mm'
                            )
                            .attr( {'fill':planColor , 'font-size':'70px' , 'font-family':'arial' , 'font-weight':'bold', 'text-anchor': 'middle'} );
                        var t = new Snap.Matrix();
                        t.rotate( -90, panelSpacingText.getBBox().cx, panelSpacingText.getBBox().cy);
                        if ( side.side === "B" ) {
                            t.rotate(180, panelSpacingText.getBBox().cx-25, panelSpacingText.getBBox().cy);
                        }
                        panelSpacingText.transform(t);
                        sideGroup.add(panelSpacingText);

                    }

                    if ( ! isGatePanel) {

                        // TODO: Fix this, it's a hacky way to get rid of the 5mm label issue.
                        var panelSpacingLabel = Math.max(10, ((i == side.panels.length - 1) ? panelSpacing/2 : panelSpacing))

                        // Trailing dimension
                        var panelSpacingText = paper.text(
                                -320,
                                panelDimension.getBBox().y+panelDimension.getBBox().height,
                                panelSpacingLabel +'mm'
                            )
                            .attr( {'fill':planColor , 'font-size':'64px' , 'font-family':'arial' , 'font-weight':'bold', 'text-anchor': 'middle'} );

                        var t = new Snap.Matrix();
                        t.rotate( -90, panelSpacingText.getBBox().cx, panelSpacingText.getBBox().cy);
                        if ( side.side === "B" ) {
                            t.rotate(180, panelSpacingText.getBBox().cx-35, panelSpacingText.getBBox().cy);
                        }
                        panelSpacingText.transform(t);
                        sideGroup.add(panelSpacingText);
                    }

                }
            }

        }

        // Set height to 500px after draw to avoid print issues
        $('.calculator-plan svg').css('height', '500px');
    },

    redrawPlans: function() {

        // Center the plan
        // ----------------------------------------------

        var viewRotation = new Snap.Matrix();
        viewRotation.rotate( this.model.get('viewRotation'));
        this.planGroup.transform(viewRotation);
        this.snap.attr({ 'viewBox': this.planGroup.getBBox().vb});

        // Move the svg into position
        // ----------------------------------------------
        if ($('#calculator-plan-big:visible').length) {
            $('#calculator-plan-big').html('');
            $('#calculator-plan-big').append(  $(this.snap.node).clone() ).append('<i class="icon icon_search"></i><i class="icon  icon_rotate"></i>');
        } else {
            $('#calculator-plan-small').html('');
            $('#calculator-plan-small').append( $(this.snap.node).clone() ).append('<i class="icon icon_search"></i><i class="icon  icon_rotate"></i>');
        }

        $('.calculator-plan').addClass('is-visible');
        Calculator.trigger('matchHeight');
    }

});
