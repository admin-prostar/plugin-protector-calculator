ev.home = {

    config: {
        header: '.layout__home__header',
        callstoaction: '.layout__home__cta__container>li',
        callstoactionAfter: '.layout__home__cta__content__after'
    },

    init: function() {
        var self = this;
        self.events();
        self.ctaSetup();
        self.banners();
        if( $(self.config.header).length ) {
            $(window).on('debouncedresize', function () {
                self.ctaSetup();
            });
        }
    },

    events: function() {
        var self   = this;
        var config = self.config;


        /**
         * [Calls to action - activate an item]
         * @param  {[type]} e [description]
         */
        $(config.callstoaction).on('click', function(e) {

            var $this = $(this);

            // Larger than 992px - toggle panel visibility
            if( Modernizr.mq("screen and (min-width:992px)") || $('html').hasClass('no-csstransitions') ) {

                // Hide any previously expanded panels
                $(config.callstoaction).not($this).each(function() {
                    if( $(this).data('active') ) {
                        self.ctaRemoveTransition( $(this) );
                    }
                });

                var active = $this.data('active');
                // Show selected panel
                if (active === true ) {
                    self.ctaRemoveTransition( $this );
                } else {
                    self.ctaAddTransition( $this );
                }

            // Smaller than 992px - expand sub links
            } else {

                var cta = $this.hasClass('is-active');

                $(config.callstoaction).removeClass('is-active');
                if( cta ) {
                    $this.removeClass('is-active');
                } else {
                    $this.addClass('is-active');
                }

            }
        });

        // Prevent bunnings link opening at desktop level
        $(config.callstoaction).on('click', '.layout__home__cta__bunnings__link', function(e) {
            if( Modernizr.mq("screen and (min-width:992px)") ) {
                e.preventDefault();
            }
        });

        // Home bunnings link open
        $('.layout__home__cta__copy__link').on('click', function() {
            var link = $(this).closest('a').attr('href');

            window.open(link, 'link');
        });


        /**
         * [Close any open calls to action when any other part of the document is clicked]
         * @param  {[event]} e [Click event]
         */
        $(window).on('click', function(e) {
            if( $(e.target).closest('.layout__home__cta__content').length === 0 ) {
                self.ctaRemoveTransition( $(config.callstoaction) );
            }
        });

    },

    /**
     * [setupCTA Setup the height of the calls to action to allow transitioning]
     */
    ctaSetup: function() {
        var config = this.config;
        var ctas   = $(config.callstoaction);

        for(var i=0; i<ctas.length; i++) {
            var cta    = ctas.eq(i);
            var height = cta.outerHeight();
            cta.attr('data-height', height);
        }
    },

    /**
     * [ctaTransition Calls to action add transition]
     * @param  {[jquery object]} el [The calls to action element to apply the transition to]
     */
    ctaAddTransition: function( el ) {

        var config = this.config;
        var height = el.attr('data-height') - 80;

        if( $('html').hasClass('no-csstransitions') ) {
            el.data('active', true).addClass('layout__home__cta--open').animate({'top': '-' + height + 'px'}, 500);
            el.find(config.callstoactionAfter).animate({'top': height + 'px'}, 500);
        } else {
            el.data('active', true).addClass('layout__home__cta--open').css({'transform': 'translateY(-' + height + 'px)'});
            el.find(config.callstoactionAfter).css({'transform': 'translateY(' + height + 'px)'});
        }
    },

    /**
     * [ctaRemoveTransition Calls to action remove transition]
     * @param  {[jquery object]} el [The calls to action element to remove the transition from]
     */
    ctaRemoveTransition: function( el ) {

        var config = this.config;

        if( $('html').hasClass('no-csstransitions') ) {
            el.data('active', false).removeClass('layout__home__cta--open').css({'top': '0'});
            el.find(config.callstoactionAfter).css({'top': '0'});
        } else {
            el.data('active', false).removeClass('layout__home__cta--open').css({'transform': 'translateY(0px)'});
            el.find(config.callstoactionAfter).css({'transform': 'translateY(0px)'});
        }
    },

    /**
     * [banners Home banner carousel]
     */
    banners: function() {

        var $carouselContainer = $('.layout__home__header');
        var $carousel          = $('.layout__home__gallery > ul');

        $carousel.imagesLoaded().always(function(){
            $carousel.carouFredSel({
                responsive: true,
                scroll : {
                    fx : "crossfade",
                    items: 1
                },
                items: {
                    height: 'variable',
                    visible: {
                        min: 1,
                        max: 1
                    }
                },
                pagination: '#pagination',
                auto: {
                    timeoutDuration: 4000,
                    pauseOnHover: true
                },
                onCreate: function() {
                    setTimeout(function() {
                        $carouselContainer.addClass('carousel-show');
                    }, 1000);
                }
            });
        });
    }
};
ev.home.init();
