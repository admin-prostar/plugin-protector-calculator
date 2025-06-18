
// Entities
// ----------------------------------------------

var DataModel = Backbone.Model.extend({
    defaults: {
        "type"             : "",
        "typeName"         : "",
        "sides"            : "",
        "systemUrlTitle"   : "",
        "systemImage"      : "",
        "systemIconColour" : "",
        "systemIconCode"   : "",
        "systemId"         : "",
        "system"           : "",
        "systemType"       : "",
        "finish"           : "",
        "optionsSelected"  : false,
        "systemSubtitle"   : "",
        "gateside"         : "",
        "gateoffset"       : "",
        "gateposition"     : "",
        "calculated"       : false,
        "viewRotation"     : 0,
        "options"          : [],

        A: {
            len: undefined,
            calculatedWidth: undefined,
            panels: [],
            gaps: [],
            fixingPoint: "post",
            maxPanelSize: ""
        },
        B: {
            len: undefined,
            calculatedWidth: undefined,
            panels: [],
            gaps: [],
            fixingPoint: "post",
            maxPanelSize: ""
        },
        C: {
            len: undefined,
            calculatedWidth: undefined,
            panels: [],
            gaps: [],
            fixingPoint: "post",
            maxPanelSize: ""
        },
        D: {
            len: undefined,
            calculatedWidth: undefined,
            panels: [],
            gaps: [],
            fixingPoint: "post",
            maxPanelSize: ""
        }
    },

    /**
     * Calculate panels required for each displayed side
     */
    calculateSides: function() {
        // Loop over each side and calculate data
        var sides = ['A', 'B', 'C', 'D'];
        for( var i=0; i < this.get('sides'); i++ ){
            if (this.get('gateside') == sides[i]) {
                this.calculateSide( sides[i], this.get('gateposition'), (i == 0) );
            } else {
                this.calculateSide( sides[i] );
            }
        }
        this.trigger('sidesRecalculated');
    },

    /**
     * [calculateSide Calculate the panels for each size]
     * @param  {[int]} sideWidth [Width of the side]
     * @param  {[int]} gate [Number of gates on the side]
     * @param  {[int]} maxPanelSize [The maximum panel size]
     * @param  {[string]} systemId [The id of the system]
     */
    calculateSide: function( sideAlpha, gatePosition, firstSide ) {

        var side            = _.clone( this.get( sideAlpha ) ); // Shallow clone of each side model data
        var systemId        = this.get('systemId');
        //var availableSizes  = systems[systemId].gap;

        // console.log(systems[systemId]);

        var widthAsMeasured = parseInt(side.len, 10);
        var width           = widthAsMeasured;
        var maxPanelSize    = parseInt(side.maxPanelSize, 10) + 5;
        var panelSpacing    = systems[systemId].gap;
        var outsideSpacing    = systems[systemId].wallSpacing;
        var panelIncrement  = parseInt(systems[systemId].sizeDifference, 10);
        var gate            = (gatePosition !== undefined && gatePosition !== "");
        var gateWidth       = parseInt(systems[systemId].gateWidth, 10) + 10; // Add 10mm for minimum latch requirement

        console.log('Side ' + sideAlpha + ' ('+width+'mm wide with a maximum panel size of '+maxPanelSize+')');

        // Check for a gate.
        if (gate) {

            // Check if it'll fit first...
            if ((width - panelIncrement) <= gateWidth ) {
                gate = false;
                this.set('gateside', '');

                alert('Warning, the gate requires a side of at least '+(gateWidth + panelIncrement * 2)+'mm.');

            } else {

                // If present, subtract the gate site (including any gaps). For frameless fence systems, the gate includes a hinge panel.
                width = width - gateWidth;
                // console.log('Adding a gate of ' + gateWidth + ' (leaving '+width+'mm wide with a maximum panel size of '+maxPanelSize+')');



            }
        }
        var choosenPanelSpacing,
            panelCount = 0,
            panelOneCount = 0,
            panelTwoWidth,
            panelOneWidth,
            panelTwoCount = 0,
            lengthVariation = 0;


        // TODO: Need to find a better way to do this. Mini posts systems are currently identified by an array of gap values (min/max).
        if( typeof panelSpacing === "number" ) {

            console.log("Max panel size = " + maxPanelSize);

            // Posts
            side.post = true;

            console.log('Calculating based on panel + fixed '+ panelSpacing  +'mm spacing for post centres.');

            // Adjust width to allow outside spacing for posts
            // TODO: Allow for post vs wall fixings (don't adjust wall fixings).
            width = width - outsideSpacing;

            console.log('Total width allowing outside post spacing: '+ width +'mm');

            // work out how many panels
            panelCount = Math.ceil(width / (maxPanelSize + panelSpacing));

            console.log('Panels to include: '+ panelCount);

            // Remove that many panel gaps
            width = width - (panelCount * panelSpacing);

            console.log('Total Panel width at average spacing: '+ width);

            lengthVariation = width % panelIncrement;

            console.log('Varies from panel increment by '+ lengthVariation + 'mm');

            width = width - lengthVariation;

            console.log('Side length revised to '+ width  +'mm assuming an ouside gap of '+lengthVariation+'mm.');

            choosenPanelSpacing = panelSpacing;

        } else {

            // No posts
            side.post = false;

            //console.log('Calculating based on panel + variable '+ panelSpacing.min + 'mm min and ' + panelSpacing.max  +'mm max gap.');

            var averagePanelSpacing = (panelSpacing.min + panelSpacing.max) / 2;

            // console.log('Ideal panel spacing of '+ averagePanelSpacing + 'mm');

            // work out how many panels
            panelCount = Math.ceil(width / (maxPanelSize + averagePanelSpacing));

            // console.log('Panels to include: '+ panelCount);

            // Remove that many panel gaps
            var panelWidth = width - (panelCount * averagePanelSpacing);

            // console.log('Total Panel width at average spacing: '+ panelWidth);

            // Calculate the variation
            lengthVariation = panelWidth % panelIncrement;

            // console.log('Varies from panel increment by '+ lengthVariation + 'mm');

            // Increase gaps to accommodate variation (uip to our max gap size)
            choosenPanelSpacing = Math.min(panelSpacing.max, averagePanelSpacing + Math.floor(lengthVariation / panelCount));

            // console.log('Panel spacing revised to '+ choosenPanelSpacing + 'mm');

            // recalculate the panel width with the revised panel spacing
            width = width - (panelCount * choosenPanelSpacing);

            // console.log('Total Panel width at revised spacing: '+ width);

            // Recalculate the variation in length
            lengthVariation = width % panelIncrement;
            width = width - lengthVariation;

            //console.log('Side length revised to '+ width  +'mm assuming an ouside gap of '+lengthVariation+'mm ('+(lengthVariation/2)+'mm at each end).');

            //console.log('Calculating based on panel + fixed '+ choosenPanelSpacing  +'mm spacing.');

        }

        side.panels = [];
        side.gaps = [];

        if (gate && width == 0) {

            // A gate only (don't calculate a zero width panel
            panelCount = 0;
            panelOneCount = 0;
            panelTwoCount = 0;
            panelOneWidth = 0;
            panelTwoWidth = 0;
            side.gaps.push(choosenPanelSpacing);

        } else {

            console.log("1: Width = " + width + " | Panel count = " + panelCount);

            // Calculate the number of panels to use
            while (width/panelCount % panelIncrement > 0) {
                panelOneCount++;
                width = width - panelIncrement;
            }

            panelTwoWidth = width / panelCount; // How is this calculated?

            console.log("2: Width = " + width + " | Panel count = " + panelCount);
            console.log("Panel two width = " + panelTwoWidth + " | Panel Increment = " + panelIncrement);

            panelOneWidth = panelTwoWidth + panelIncrement; // What the!?
            panelTwoCount = panelCount - panelOneCount;

            for(i = 0; i < panelOneCount; i++) {
                side.panels.push(panelOneWidth)
            }
            for(i = 0; i < panelTwoCount; i++) {
                side.panels.push(panelTwoWidth)
            }
            for(i = 0; i < panelCount; i++) {
                side.gaps.push(choosenPanelSpacing)
            }
        }

        var newOverallWidth = (panelOneCount*panelOneWidth)+ (panelTwoCount*panelTwoWidth)+(panelCount * choosenPanelSpacing) + (gate ? gateWidth : 0);

        console.log(
            panelOneCount+' @ '+panelOneWidth+'mm and '+panelTwoCount+'@'+panelTwoWidth+'mm' +
            ' + ' + panelCount + '@'+choosenPanelSpacing+'mm gaps' +
            ' (with 2 outside gaps @'+(lengthVariation/2)+'mm)'
        );
        console.log('New Total Calculated Width: '+newOverallWidth + 'mm');

        // Save calculated data to the side
        side.calculatedWidth = newOverallWidth;
        side.gate = gate;
        side.gateWidth = gate ? gateWidth : 0;
        side.gatePosition = gate ? gatePosition : '';

        // SFA gates must have a fixed panel alongside to hinge from (they flex too much otherwise). Flip the layout if it's the first panel
        if (systemId == 'sfa' && gate) {
            if (side.panels.length == 0) {
                side.gatePosition = 'right';
            }
        }

        //console.log(side);

        this.set( sideAlpha, side );
    },


    calculateComponents: function() {

        var componentlist = {
            'panels': {},
            'posts': {},
            'components': {},
            'system_id': this.get('systemId'),
            'sides' : this.get('sides'),
            'joins' : 0
        };

        var selected_options = this.get('options');

         // Loop over each side and calculate data
        var wireLength = 0;
        var leftovers = [];
        var sides = ['A', 'B', 'C', 'D'],
            i,
            overalPanelLength = 0;

        // Can we sort sides by length at this point?

        for( var i=0; i < this.get('sides'); i++ ){

            var side = this.get(sides[i]),
                systemId = this.get('systemId');

            // First side
            if (i == 0) {
                if (side.post) {
                    // Add a start end post
                    postCode = mapping['posts'][systemId+'-end'];

                    componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                    componentlist.posts[postCode]++;
                }
            }

            // Start with glass panels
            for(var p = 0; p < side.panels.length; p++) {

                // Add to the overall length for channel calcs later on
                overalPanelLength += side.panels[p] + side.gaps[p];

                // Add the panel
                if (this.get('system') != "Wire Balustrade") {
                    //console.log(systemId + '-' + side.panels[p]);
                    // If mapping value doesn't exist then sent through custom panel identifier
                    if (mapping['panels'][systemId + '-' + side.panels[p]]) {
                        panelCode = mapping['panels'][systemId + '-' + side.panels[p]];
                    } else {
                        panelCode = systemId + '-' + side.panels[p];
                    }
                    //console.log(panelCode);
                    componentlist.panels[panelCode] = componentlist.panels[panelCode] || 0;
                    componentlist.panels[panelCode]++;
                }

                // Add Posts
                if ( ! side.post) {

                    // mini post system
                    if ( ! systems[systemId].channel) {
                        // two posts per panel
                        if ($.isArray(mapping['posts'][systemId+'-minipost'])) {
                            // If an array of options still exists then prompt for selection`
                            // TODO: Take user to option selection
                            alert("Please select a Mini Post type");
                            return;
                        } else {
                            panelCode = mapping['posts'][systemId + '-minipost'];
                            componentlist.posts[panelCode] = componentlist.posts[panelCode] || 0;
                            componentlist.posts[panelCode] += 2;
                        }
                    }

                } else {

                    // Add a trailing post
                    if (p == side.panels.length-1) {
                        if ((i+1) < this.get('sides')) {
                            // Add a corner post
                            postCode = mapping['posts'][systemId+'-corner'];

                            componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                            componentlist.posts[postCode]++;
                        } else {
                            // add an end post
                            postCode = mapping['posts'][systemId+'-end'];

                            componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                            componentlist.posts[postCode]++;
                        }
                    } else {
                        // Add a join post
                        postCode = mapping['posts'][systemId+'-join'];
                        componentlist.joins++;

                        componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                        componentlist.posts[postCode]++;
                    }

                }

            }


            // No panels (probably just a gate), so we need to add the trailing post
            if (side.panels.length == 0) {

                // Add a trailing post
                if ((i+1) < this.get('sides')) {
                    // Add a corner post
                    postCode = mapping['posts'][systemId+'-corner'];

                    componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                    componentlist.posts[postCode]++;
                } else {
                    // add an end post
                    postCode = mapping['posts'][systemId+'-end'];

                    componentlist.posts[postCode] = componentlist.posts[postCode] || 0;
                    componentlist.posts[postCode]++;
                }
            }

            // Add gate panels
            if (this.get('gateside') == sides[i]) {

                // include the gate panel
                componentlist.panels[mapping['panels'][systemId+'-gatepanel']] = 1;

                if (side.post ) {

                    if (this.get('system').indexOf("Semi Frameless") > -1) {

                        // TODO: Add fixed gate Hardware
                        componentlist.components[mapping['components'][systemId+'-hinge']] = 1;
                        componentlist.components[mapping['components'][systemId+'-latch']] = 1;

                        // If it's the first side, there's no panels and there's a following side
                        if ((i == 0) && (side.panels.length == 0) && ((i+1) < this.get('sides'))) {
                            // - remove a corner and add an end.
                            componentlist.posts[mapping['posts'][systemId+'-corner']]--;
                            componentlist.posts[mapping['posts'][systemId+'-end']]++;
                        }

                        // Otherwise, if there's only one panel
                        if (side.panels.length == 1) {
                            //  - replace the join with an end,
                            //componentlist.posts[systemId+'-join']--;
                            componentlist.posts[mapping['posts'][systemId+'-end']]++;
                            //  - if there's another side following
                            if (((i+1) < this.get('sides'))) {
                                // - replace the trailing corner with an end
                                componentlist.posts[mapping['posts'][systemId+'-corner']]--;
                                componentlist.posts[mapping['posts'][systemId+'-end']]++;
                            }
                        }

                        if (side.panels.length > 1) {
                            // replace two joins with ends for a gate in the middle of the side
                            componentlist.posts[mapping['posts'][systemId+'-join']]-= 1;
                            componentlist.posts[mapping['posts'][systemId+'-end']]+= 2;
                        }

                    } else {

                        // Add gate hinge/latch posts where required... reducing join posts used

                        if (side.panels.length > 1) {

                            // Gate in the middle of the panel, just reduce the join posts
                            componentlist.posts[mapping['posts'][systemId+'-hinge']] = 1;
                            componentlist.posts[mapping['posts'][systemId+'-latch']] = 1;
                            componentlist.posts[mapping['posts'][systemId+'-join']] = Math.max(0, componentlist.posts[mapping['posts'][systemId+'-join']] - 1);

                        } else {

                            if ((i+1) < this.get('sides')) {

                                // There's another side to come, add a corner latch post
                                componentlist.posts[mapping['posts'][systemId+'-hinge']] = 1;
                                componentlist.posts[mapping['posts'][systemId+'-corner-latch']] = 1;
                                componentlist.posts[mapping['posts'][systemId+'-corner']] = Math.max(0, componentlist.posts[mapping['posts'][systemId+'-corner']] - 1);

                            } else {

                                //alert("Warning: A corner/end post clash has been detected\n. Please increase the gate side length, or move\n the gate to another position.");
                                // Last one... assume a standard latch post?
                                componentlist.posts[mapping['posts'][systemId+'-hinge']] = 1;
                                componentlist.posts[mapping['posts'][systemId+'-latch']] = 1;
                                componentlist.posts[mapping['posts'][systemId+'-end']] = Math.max(0, componentlist.posts[mapping['posts'][systemId+'-end']] - 1);

                            }
                        }
                    }

                } else {

                   // Minipost have an extra hinge panel
                    componentlist.panels[mapping['panels'][systemId+'-hingepanel']] = 1;
                    componentlist.posts[mapping['posts'][systemId+'-minipost']] += 2;


                    // Add minipost hinges/latch
                    componentlist.components[mapping['components'][systemId+'-hinge']] = 1;
                    componentlist.components[mapping['components'][systemId+'-latch']] = 1;

                }
            }

            // Wire Balustrades - Calculate Wire Packs
            if (this.get('system') == "Wire Balustrade") {

                // Wire balustrade packs
                wirePackCode = mapping['components'][systemId + '-wire-pack'];
                terminalCode = mapping['components'][systemId + '-terminal-pack'];
                componentlist.components[wirePackCode] = componentlist.components[wirePackCode] || 0;
                componentlist.components[terminalCode] = componentlist.components[terminalCode] || 0;

                // Loop through each strand
                for (var x = 0; x < 11; x++) {

                    // Calculate single packs required for each strand
                    wireLength = side.calculatedWidth;
                    wirePacks = Math.ceil(wireLength / 7000); // Assume all wire packs are 7m long for now


                    //console.log("Row " + i + " | Strand " + x + " | Wire Length = " + wireLength + " | Wire packs = " + wirePacks);

                    remainder = (wireLength > 7000) ? 7000 - (wireLength % 7000) : 7000 - wireLength;
                    overflow = (wireLength > 7000) ? wireLength % 7000 : wireLength;

                    //console.log("Remainder = " + remainder + " | Overflow = " + overflow);

                    //console.log(leftovers);

                    // Can we use a leftover instead?
                    if (leftovers.length > 0) {
                        $.each(leftovers, function (index, value) {
                            if (overflow <= value) {

                                if (wirePacks > 0) {

                                    // Use leftover and deduct a wirekit from earlier calculation
                                    console.log("Using leftover value: " + value + " and deducting a wire kit");
                                    wirePacks--;

                                    // Add terminal kit
                                    componentlist.components[terminalCode]++;

                                    // Set remainder to zero as the last pack has been removed
                                    remainder = 0;
                                    leftovers[index] = value - overflow;
                                }

                                // Remove leftover from array
                                if (leftovers[index] <= 0) {
                                    leftovers.splice(index, 1);
                                }
                            }
                        });
                    }

                    //console.log(leftovers);

                    // Add any spare lengths to leftovers array
                    if (remainder > 0) {
                        // TODO: Handle sides that are > 7000mm

                        console.log("Adding remainder = " + remainder);

                        leftovers.push(remainder);
                        leftovers.sort(function (a, b) {
                            return a - b
                        });
                    }

                    // Add wirepacks and terminal kits to components list
                    if (wirePacks > 0) {
                        componentlist.components[wirePackCode] = componentlist.components[wirePackCode] + wirePacks;
                    }
                }
            }
        }

        //console.log(leftovers);

        // Wire comes in packs of two
        if (this.get('system') == "Wire Balustrade") {
            //componentlist.components[mapping['components'][systemId + '-wire-pack']] = componentlist.components[mapping['components'][systemId + '-minipost']] % 6;

            // Wire packs contain 2 rolls of wire
            componentlist.components[mapping['components'][systemId + '-wire-pack']] = Math.ceil(componentlist.components[mapping['components'][systemId + '-wire-pack']] / 2);

            // Terminal packs contain 2 terminals
            componentlist.components[mapping['components'][systemId + '-terminal-pack']] = Math.ceil(componentlist.components[mapping['components'][systemId + '-terminal-pack']] / 2);

        }

        // Channel System Lengths
        if ( systems[systemId].channel) {
            // TODO: Replace hardcoded channel length calculation
            channelCode = mapping['posts'][systemId+'-channel'];
            componentlist.posts[channelCode] = Math.ceil(overalPanelLength / 3000);
        }

        // Aluminium Handrail
        if (systemId + "-handrail" in mapping['components']) {
            // TODO: Replace hardcoded handrail length calculation
            var handrailWidth = (this.get('system') == "Wire Balustrade") ? 2600 : 2400;
            componentlist.components[mapping['components'][systemId + '-handrail']] = Math.ceil(overalPanelLength / handrailWidth);
            //console.log("handrail added");

            // Add a handrail corner for each corner post
            componentlist.components[mapping['components'][systemId + '-corner-handrail']] = componentlist.posts[mapping['posts'][systemId+'-corner']];
        }

        return componentlist

    }

});
