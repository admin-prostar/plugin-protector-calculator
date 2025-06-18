/**
 * [nav Everton nav stuffs]
 * @type {Object}
 */
ev.nav = {
    config: {
        mobileTrigger: '.js-mobile-nav-trigger',
        parent:        '.nav__parent',
        parentLink:    '.nav__parent__link',
        dropdown:      '.nav__parent ul'
    },
    init: function() {
        this.events();
    },
    events: function() {
        var self   = this;
        var config = self.config;

        /**
         * [Showing/hiding mobile and tablet navigation][state: mobile-tablet]
         * @param  {[event]} e [Click event]
         */
        $(config.mobileTrigger).on('click', function(e) {
            e.preventDefault();

            ev.helpers.toggleClass( $('body'), 'is-visible-tablet-nav is-visible-mobile-nav' );
            ev.helpers.toggleClass( $(config.mobileTrigger), 'is-active' );
        });

        $(config.parentLink).on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
            if($(this).parents(config.parent).hasClass('is-active-mobile-subnav')){
                ev.helpers.removeClass( $(this).parents(config.parent), 'is-active-mobile-subnav' );
            }else{
                ev.helpers.removeClass( $(config.parent), 'is-active-mobile-subnav' );
                ev.helpers.addClass( $(this).parents(config.parent), 'is-active-mobile-subnav' );
            }
            
        });

        /**
         * [Show the dropdown navigation][state: desktop]
         */
        function hoverIn(){
            var $this = $(this);
            self.showDropdown( $this );
        }

        /**
         * [Hide the dropdown navigation][state: desktop]
         */
        function hoverOut(){
            var $this = $(this);
            self.hideDropdown( $this );
        }

        /**
         * [Trigger dropdown navigation on hover][state: desktop]
         */
        $(config.parent).hoverIntent({
            over: hoverIn,
            out: hoverOut,
            timeout: 300,
            interval: 100
        });

        /**
         * [Trigger dropdown navigation on focus/tabbing][state: desktop] WTF TOCOMEBACKTO
         */

        $('.nav').on('focus', 'a', function(e){
            if($(e.currentTarget).parent().hasClass("nav__parent")){
                self.showDropdown($(this).parents(config.parent));
            }else if($(e.currentTarget).hasClass("nav__sub")){
            }else{
                self.hideDropdown($(config.parent));
            }
        });

    },



    /**
     * [showDropdown Show the dropdown navigation]
     * @param  {[jquery object]} el [The dropdown parent item]
     */
    showDropdown: function( el ) {
        ev.helpers.addClass( el, 'dropdown-is-active' );
    },

    /**
     * [hideDropdown Hide the dropdown navigation]
     * @param  {[jquery object]} el [The dropdown parent item]
     */
    hideDropdown: function( el ) {
        ev.helpers.removeClass( el, 'dropdown-is-active' );
    },

    /**
     * [clearDropdownTimer Clear the timer for hiding the dropdown navigation]
     */
    clearDropdownTimer: function() {
        var self = this;
        clearTimeout(self.dropdownTimer);
    }
};
ev.nav.init();