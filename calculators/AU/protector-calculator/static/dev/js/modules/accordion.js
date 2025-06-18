ev.accordion = {

    config: {
        accordion:              '.accordion',
        accordionTitle:         '.accordion__title',
        accordionContent:       '.accordion__content',
        accordionExpandedClass: 'accordion-is-expanded'
    },

    init: function() {
        this.events();
    },

    events: function() {
        var self   = this;
        var config = this.config;

        /**
         * [Clicking on accordion title to expand content]
         */
        $(config.accordionTitle).on('click', function(e) {
            e.preventDefault();

            var $this   = $(this);
            var content = $this.next( config.accordionContent );
            var scope   = $this.closest( config.accordion );

             if(content.hasClass(config.accordionExpandedClass)){
                 ev.accordion.contractAccordion( content, $this );
             }else{
                ev.accordion.expandAccordion( content, $this, scope );
             }
        });

    },

    /**
     * [expandAccordion Expand the targeted accordion content]
     * @param  {[jquery object]} content [The content area to be expanded]
     * @param  {[jquery object]} title [The title which was clicked on]
     * @param  {[jquery object]} scope [The parent accordion]
     */
    expandAccordion: function( content, title, scope ) {
        var self   = this;
        var config = this.config;

        // Contract any expanded accordion content areas
        if( scope.find('.' + self.config.accordionExpandedClass).length ) {
            var contractContent = scope.find('.' + self.config.accordionExpandedClass + self.config.accordionContent);
            var contractTitle   = scope.find('.' + self.config.accordionExpandedClass + self.config.accordionTitle);

            self.contractAccordion( contractContent, contractTitle );
        }

        ev.helpers.addClass( content, config.accordionExpandedClass );
        ev.helpers.addClass( title, config.accordionExpandedClass );
    },

    contractAccordion: function( content, title ) {
        var config = this.config;
        ev.helpers.removeClass( content, config.accordionExpandedClass );
        ev.helpers.removeClass( title, config.accordionExpandedClass );
    }

};
ev.accordion.init();

ev.subAccordion = {
    init: function() {
        this.events();
    },
    events: function (){
        $('.accordion__table__subtitle').on('click', function(e) {
            e.preventDefault();

            var $this   = $(this);
            var content = $this.next('.accordion__table__subcontent');
            var scope   = $this.closest('li');

             if(content.hasClass(ev.accordion.config.accordionExpandedClass)){
                 ev.accordion.contractAccordion( content, $this );
             }else{
                ev.accordion.expandAccordion( content, $this, scope );
             }
        });
    }
};
ev.subAccordion.init();
