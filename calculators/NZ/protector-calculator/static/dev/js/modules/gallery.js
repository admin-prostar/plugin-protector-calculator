/**
 * [gallery Gallery & category page]
 * @type {Object}
 */

ev.gallery = {

    config: {
        carousel: '.gallery__carousel',
        pagination: '.gallery__controls'
    },

    init: function() {
        this.setup();
        this.checkhash();
        this.events();
        this.carousel();
        this.setupPagination();
    },
    setup: function(){
        this.hideSlider();
        $('.layout-gallery__item').matchHeight();
    },
    events: function() {
        var self   = this;
        var config = self.config;

        $(window).on('debouncedresize', function () {
            ev.gallery.destroySlider(config.pagination);
            self.setupPagination();
        });

        $('body').on('click', '.gallery__zoom__close', function(e){
            e.preventDefault();
            ev.gallery.closeGallery();
        });

        // Carousel swipe event
        $('.gallery__carousel').swipe({
            swipeLeft:ev.gallery.carouselSwipeLeft,
            swipeRight:ev.gallery.carouselSwipeRight
        });

        // Thumbnail navigation click event
        $('.gallery__controls').on(hitEvent, 'a', function() {
            $('.gallery__controls .is-active').removeClass('is-active');
            $(this).addClass('is-active');
        });

        // View gallery details
        $('.js-gallery .layout-gallery__item').on('click', function(e){
            e.preventDefault();

            var thumbnail = $(this);
            var id        = thumbnail.attr('id');
            var url       = '/inspiration-gallery/gallery/'+id;

            // Find the first gallery zoom wrapper if larger than 768
            if (Modernizr.mq("only screen and (min-width: 768px)")) {
                var targetGallery = thumbnail.parent().find('.gallery__zoom__wrapper--1');

            // Find the closest gallery zoom wrapper if mobile/tablet
            } else {
                var targetGallery = thumbnail.prev('.gallery__zoom__wrapper');
            }

            // Check for previously open galleries
            if( $('.limbo').length ) {
                ev.gallery.closeGallery();

                $('.layout-gallery').on('galleryclosed', function() {
                    $('.layout-gallery').off('galleryclosed');
                    ev.gallery.createGallery(url, thumbnail, targetGallery);
                });
            } else {
                ev.gallery.createGallery(url, thumbnail, targetGallery);
            }

        });
        // Expand/contract details
        $('.layout-gallery').on('click', '.gallery__detail__article__link', function(e) {
            e.preventDefault();

            if (Modernizr.mq("only screen and (min-width: 992px)")) {
                $(this).parents('.gallery__detail__article').toggleClass('is-expanded');
            }
        });
    },
    // Check URL hash for any entry id's on the page
    // and automatically open matching gallery item
    checkhash: function() {
        $(function() {
            var hash = window.location.hash;

            if (hash !== "" && $('.layout-gallery__item' + hash.replace('/', '-')).length) {
                $('.layout-gallery__item' + hash).trigger('click');
            }
        });
    },
    createGallery: function(url, thumbnail, targetGallery) {
        var self   = this;
        var config = self.config;

        // Expand gallery
        targetGallery.addClass('active');

        $.get(url, function(data){

            // Add gallery data
            targetGallery.html(data);

            // Remove loading
            thumbnail.removeClass('loading');

            // Activate the thumbnail
            thumbnail.addClass('limbo');

            // Create carousel
            ev.gallery.carousel();

            // Scroll to top of gallery
            $('html, body').animate({
                scrollTop: $(targetGallery).offset().top
            }, 1000);

            //check to make sure all images have loaded
            targetGallery.imagesLoaded().always(function(){

                setTimeout(function() {

                    // Fade in gallery once images have loaded
                    targetGallery.find('.gallery__zoom').addClass('is-active');

                    // Hide loading animation
                    $('.gallery__zoom__wrapper .loader').addClass('is-inactive');

                    // Listen for swipe events on main gallery
                    $('.gallery__carousel').swipe({
                        swipeLeft:ev.gallery.carouselSwipeLeft,
                        swipeRight:ev.gallery.carouselSwipeRight
                    });

                    // Trigger the first thumbnail image to be active
                    $(config.pagination).find('a').eq(0).addClass('is-active');

                }, 800);

                $(window).trigger('resize');

            });
        });
    },
    closeGallery: function(){
        //closes all galleries
        $('.gallery__zoom__wrapper').removeClass('active').removeAttr('style');
        $('.js-gallery .layout-gallery__item').removeClass('limbo');
        // setTimeout(function(){
            ev.gallery.emptyGallery();
        // },500);
    },
    emptyGallery: function(){
        $('.gallery__zoom__wrapper').children().fadeOut(500, function(){
            $('.gallery__zoom__wrapper').html('');
            $('.layout-gallery').trigger('galleryclosed');
        });
    },
    carouselSwipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
        var config = ev.gallery.config;
        $(config.carousel).trigger('prev');
    },
    carouselSwipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
        var config = ev.gallery.config;
        $(config.carousel).trigger('next');
    },
    carousel: function() {
        var config = this.config;
        $(config.carousel).imagesLoaded().always(function(){
            $('.layout__detail__gallery').addClass('carousel-is-loaded');
            $(config.carousel).carouFredSel({
                responsive: true,
                auto: false,
                prev: '#prev',
                next: '#next',
                height: 'variable',
                infinite  : false,
                width: '100%',
                scroll : {
                    fx : "crossfade",
                    onAfter: function(data) {
                        var paginationImage = $('.gallery__controls__wrapper img[data-original="' + $(data.items.visible[0]).find('img').attr('data-original') + '"]');
                        $(config.pagination).trigger('slideTo',  paginationImage.parents('li') );
                        $('.gallery__controls .is-active').removeClass('is-active');
                        paginationImage.parents('a').addClass('is-active');
                    }
                },
                items: {
                    height: 'variable',
                    visible: 1
                },
                onCreate: function() {
                    setTimeout(function() {
                        $('.layout__detail__gallery').addClass('carousel-show');
                    }, 1000);
                }
            });
        });
    },
    setupPagination: function() {
        var config = this.config;
        if (Modernizr.mq("only screen and (min-width: 1200px)")) {
            ev.gallery.paginationBig(4);
        } else if (Modernizr.mq("only screen and (min-width: 768px)")) {
            ev.gallery.paginationBig(3);
        } else {
            ev.gallery.paginationSmall(4);
        }
        $(config.pagination).find('a').eq(0).addClass('is-active');
    },
    paginationSmall: function( numThumbs ){
        var config = this.config;

        // Attach a unique class name to each thumbnail image
        $(config.pagination).find('a').each(function(i) {
            var $this = $(this);
            $this.addClass( 'itm'+i );

            // add onclick event to thumbnail to make the main
            // carousel scroll to the right slide
            $this.click(function() {
                $(config.carousel).trigger( 'slideTo', [i, 0, true] );
                return false;
            });
        });

        $(config.pagination).imagesLoaded().always(function(){
            ev.gallery.showSlider();
            $(config.pagination).carouFredSel({
                circular: true,
                infinite: false,
                responsive: true,
                auto: false,
                prev: '#prev',
                next: '#next',
                width: '70%',
                items: {
                    visible: numThumbs,
                    minimum: numThumbs + 1,
                    height: "variable"
                },
                scroll : {
                    items : 2,
                    onBefore: function( data ) {
                        ev.gallery.unhighlight( data.items.old );
                    },
                    onAfter : function( data ) {
                        ev.gallery.highlight( data.items.visible );
                    }
                }
            },{
                wrapper: {
                    classname : "caroufredsel__wrapper--border"
                }
            });
        });
    },
    paginationBig: function( numThumbs ){
        var config = this.config;

        /* Attach a unique class name to each thumbnail image */
        $(config.pagination).find('a').each(function(i) {
            $(this).addClass( 'itm'+i );

            /* add onclick event to thumbnail to make the main
            carousel scroll to the right slide*/
            $(this).click(function() {
                $(config.carousel).trigger( 'slideTo', [i, 0, true] );
                return false;
            });
        });
        $(config.pagination).imagesLoaded().always(function(){
            ev.gallery.showSlider();
            $(config.pagination).carouFredSel({
                circular: true,
                infinite: false,
                responsive: false,
                auto: false,
                direction: "up",
                prev: '#prev',
                next: '#next',
                items: {
                    visible: numThumbs,
                    minimum: numThumbs + 1,
                    height: "variable"
                }
            },{
                wrapper: {
                    classname : "caroufredsel__wrapper--border"
                }
            });
        });
    },
    hideSlider: function() {
        $('.gallery__controls__wrapper').css('opacity', 0);
    },
    // This is a bit of a hack but it's better than having the thumbnails jumping all over the place
    showSlider: function() {
        setTimeout(function() {
            $('.gallery__controls__wrapper').animate({'opacity': 1}, 300);
        }, 500);
    },
    destroySlider: function (sliderId) {
        ev.gallery.hideSlider();
        $(sliderId).trigger('destroy');
    },
    highlight: function( items ) {
        items.filter(":eq(1)").addClass("active");
    },
    unhighlight: function( items ) {
        items.removeClass("active");
    }

}
ev.gallery.init();