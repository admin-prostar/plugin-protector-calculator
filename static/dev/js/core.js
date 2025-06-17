var hitEvent = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';

// Main JS file for site
// --------------------------------------------------

var ev = ev || {};

/**
 * [nav Navigation]
 */
ev.nav = {
    init: function () {
        var self = this;

        $(window).on('debouncedresize', function () {
            if (Modernizr.mq("only screen and (min-width: 992px)")) {
                self.equalHeightDropdown();
            } else {
                $('.nav ul ul a').removeAttr('style');
            }
        }).resize();
    },
    equalHeightDropdown: function () {
        $('.nav ul ul a').matchHeight();
    }
};
ev.nav.init();

/**
 * [contact Contact page specific]
 */
ev.contact = {
    init: function () {
        $(".form__contact").validate({
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                email: {
                    email: "Email not valid."
                }
            }
        });
        $('.form__contact input[type="checkbox"]').on('ifChanged', function (event) {
            ev.contact.update();
        });
        $('#how-did-you-find-us').on('change', function () {
            var val = $(this).val();

            if (val === "Other") {
                $('.how_did_you_find_us_other').addClass('is-active');
            } else {
                $('.how_did_you_find_us_other').removeClass('is-active');
            }
        });
    },
    update: function () {

        var products = [];

        $(".form__contact input[type='checkbox']:checked").each(function () {
            products.push($(this).val());
        });

        $('.product-options-text').val(products.toString());
    }
};
ev.contact.init();

/**
 * warranty application and system selection
 */
ev.warranty = {
    init: function () {
        $("#application").change(function (e) {
            $select = $(this);
            $("#system option.options").hide();
            $(this).find("option").each(function () {
                if ($(this).val() && $(this).val() == $select.val()) {
                    $("#system option.cat-" + $(this).attr('data-id')).show();
                }
            });
        });
    }
};
ev.warranty.init();

/**
 * [fancy Fancybox modal]
 */
ev.fancy = {
    init: function () {
        $('.fancybox__video').fancybox({
            'type': 'iframe',
            'padding': 0,
            'width': 900,
            'height': 547
        });
    }
};
ev.fancy.init();

ev.bunningLinks = {
    init: function () {
        $('.nav-tabbed__bunnings a').on('click', function () {

            // gtag.js tracking
            if (typeof gtag != 'undefined') {
                gtag('event', 'Click', {
                    'event_category' : 'Bunnings Buttons',
                    'event_label' : 'Sidebar'
                });
            } else if (typeof ga !== 'undefined') { // analytics.js tracking
                ga('send',
                    'event',
                    'Bunnings Buttons',
                    'Click',
                    'Sidebar'
                );
            }
        });
        $('.bunnings--header').on('click', function () {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'Click', {
                    'event_category' : 'Bunnings Buttons',
                    'event_label' : 'Header'
                });
            } else if (typeof ga !== 'undefined') {
                ga('send',
                    'event',
                    'Bunnings Buttons',
                    'Click',
                    'Header'
                );
            }
        });
        $('.layout__home__cta__bunnings .layout__home__cta__copy a').on('click', function () {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'Click', {
                    'event_category' : 'Bunnings Buttons',
                    'event_label' : 'Home Page'
                });
            } else if (typeof ga !== 'undefined') {
                ga('send',
                    'event',
                    'Bunnings Buttons',
                    'Click',
                    'Home Page'
                );
            }
        });
        $('.calculator__ctas .calculator__ctas__estimate a').on('click', function () {
            var product_name = $('.calculator__summary__dimensions h3.calculator__summary__system').text() + " " + $('.calculator__summary__dimensions p').text();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'Click', {
                    'event_category' : 'Fence Calculator - Send Estimate (Bottom Button)',
                    'event_label' : product_name
                });
            } else if (typeof ga !== 'undefined') {
                ga('send',
                    'event',
                    'Fence Calculator - Send Estimate (Bottom Button)',
                    'Click',
                    product_name
                );
            }
        });
        $('.calculator__ctas .calculator__ctas__bunnings a').on('click', function () {
            var product_name = $('.calculator__summary__dimensions h3.calculator__summary__system').text() + " " + $('.calculator__summary__dimensions p').text();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'Click', {
                    'event_category' : 'Fence Calculator - Bunnings Button (Bottom Button)',
                    'event_label' : product_name
                });
            } else if (typeof ga !== 'undefined') {
                ga('send',
                    'event',
                    'Fence Calculator - Bunnings Button (Bottom Button)',
                    'Click',
                    product_name
                );
            }
        });
        $('.calculator__ctas .calculator__ctas__print a').on('click', function () {
            var product_name = $('.calculator__summary__dimensions h3.calculator__summary__system').text() + " " + $('.calculator__summary__dimensions p').text();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'Print', {
                    'event_category' : 'Fence Calculator - Print (Bottom Button)',
                    'event_label' : product_name
                });
            } else if (typeof ga !== 'undefined') {
                ga('send',
                    'event',
                    'Fence Calculator - Print (Bottom Button)',
                    'Print',
                    product_name
                );
            }
        });
    }
};
ev.bunningLinks.init();

/**
 * [extras Generic stuff]
 * @type {Object}
 */
ev.extras = function () {

    // Style radio and checkboxes
    $('input').not('.js-unstyled').iCheck();

    $('.checkbox-styled input[type=checkbox]').on('change', function () {
        var $this = $(this);
        $this.parent().toggleClass('is-selected');
    });

    // Create radio tab styling
    $('.radio--tab').on('click', function () {
        var $this = $(this);
        var target = $this.attr('for');
        var scope = $('#' + target).attr('name');
        $('[name=' + scope + ']').parent().removeClass('is-active');
        $this.addClass('is-active');
    });

    $('.scrollto').on('click', function (e) {
        e.preventDefault();
        var target = $(this).attr('href');
        if ($(target).length) {
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 1000);
        }
    });

    //Because yo said there was no other way
    $("#components .td--center").each(function () {
        if ($(this).find(".icon_tick").length === 0) {
            $(this).css({background: "#c1e8fb"});
        }
    });

    // Table row hover highlight
    $('.table--hover tr').hover(function () {
        $(this).addClass('is-hovered');
    }, function () {
        $(this).removeClass('is-hovered');
    });

    // Print
    $('.js-print').on('click', function (e) {
        e.preventDefault();
        window.print();
    });

};
ev.extras();

/**
 * [knowledgebase Knowledge base layout]
 * @type {Object}
 */
ev.knowledgebase = {
    init: function () {
        var self = this;
        self.events();
        $(window).load(function () {
            self.setHeight();
        });
    },
    events: function () {
        var self = this;
        var numberCheck = 0;
        var totalCheckboxes = $('.knowledge-base__filter input[type=checkbox]').length - 1;

        $('.knowledge-base__filter input[type=checkbox]').on('ifToggled', function (event) {
            self.toggleActive($(this).parents('label'));
            self.toggleActive($('.' + $(this).attr('data-target')));

            //checking to see if button clicked was "show all" or not
            if ($(this).attr('id') !== "knowledge-base-all") {
                $('#knowledge-base-all').iCheck('uncheck');
            }

            if ($('.knowledge-base__filter input[type=checkbox]:checked').length === totalCheckboxes) {
                window.location.href = window.location.pathname;
            } else {
                self.setFilter($(this).attr('data-target'));
            }
        });

        $(window).on('debouncedresize', function () {
            self.removeHeight();
            self.setHeight();
        });
    },
    setFilter: function (target) {
        var url;
        var regexp = new RegExp(target, 'g');

        // Check if filter is already there and remove
        if (window.location.href.match(regexp) && window.location.href.match(regexp).length) {

            url = window.location.href.replace(target, '');
            url = url.replace('|', '');

            // Add filter
        } else {

            // Filter already exists?
            if (window.location.search.split('=')[1] !== undefined && window.location.search.split('=')[1] !== "") {
                url = window.location.href + '|' + target;
            } else {
                target = $('.knowledge-base__filter label.active input').attr('data-target');

                if (window.location.search.indexOf('filter') === -1) {
                    url = window.location.href + '?filter=' + target;
                } else {
                    url = window.location.href + target;
                }
            }

        }

        window.location.href = url;
    },
    setHeight: function () {
        $('.knowledge-base__article a').matchHeight();
    },
    removeHeight: function () {
        $('.knowledge-base__articles article > div').removeAttr('style');
    },
    toggleActive: function (target) {
        target.toggleClass('active');
    }
};
ev.knowledgebase.init();

ev.swatchZoom = {
    init: function () {
        this.events();
    },
    events: function () {
        $('.square').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.square').not(this).removeClass('zoomed');
            $(this).toggleClass('zoomed');
        });
        $('html').on('click', function () {
            $('.square').removeClass('zoomed');
        });
    }
};
ev.swatchZoom.init();

ev.componentsFilter = {
    init: function() {
        this.events();
        this.handleHash();
    },
    events: function() {
        $('[data-js-components-link]').on('click', this.handleComponentChange);
    },
    /**
     * Open a table when a hash is supplied
     */
    handleHash: function() {
        var hash = window.location.hash;

        if (hash && hash.length) {
            // / Check if we're on components page
            var path = window.location.pathname;
            path = path.substring(1);
            path = path.split('/');
            if (path[1] === 'components') {
                $('a[href="' + hash.toUpperCase() + '"]').trigger('click');
            }
        } else if ($('[data-js-components-link]').length) {
            $('[data-js-components-link]').first().trigger('click');
        }
    },
    /**
     * Toggle components on/off based on user selection.
     * @param e
     */
    handleComponentChange: function(e) {
        e.preventDefault();

        var target = '.entry--' + $(this).attr('href').replace('#', '');
        var activeClass = 'is-active';

        // Toggle the nav link
        $('.legend__link.' + activeClass).removeClass(activeClass);
        $(this).addClass(activeClass);

        // Show/hide the system icons
        $('[data-js-component-system-icon]').show();
        $('[data-js-component-system-icon="'+$(this).attr('href').replace('#', '')+'"]').hide();
        $('[data-js-component-system-header]').hide();
        $('[data-js-component-system-header="'+$(this).attr('href').replace('#', '')+'"]').show();

        // Hide rows, then show only the target ones
        $('.components-list__row').hide();
        $(target).show();

        // Hide tables with no rows visible
        $('.components-list').show().each(function() {
            if( $('.components-list__row:visible', this).length === 0) {
                $(this).hide();
            }
        });
    }
};
ev.componentsFilter.init();

/**
 * [helpers Reusable helper methods]
 * @type {Object}
 */
ev.helpers = {

    /**
     * [addClass Add a nominated class to a nominated element]
     * @param {[jquery object]} el       [The element to add the class to]
     * @param {[string]} theclass        [The class to be added]
     */
    addClass: function (el, theclass) {
        el.addClass(theclass);
    },

    /**
     * [addClass Remove a nominated class to a nominated element]
     * @param {[jquery object]} el       [The element to remove the class from]
     * @param {[string]} theclass        [The class to be removed]
     */
    removeClass: function (el, theclass) {
        el.removeClass(theclass);
    },

    /**
     * [addClass Toggle a nominated class on a nominated element]
     * @param {[jquery object]} el       [The element to toggle the class on]
     * @param {[string]} theclass        [The class to be toggled]
     */
    toggleClass: function (el, theclass) {
        el.toggleClass(theclass);
    }
};

/**
 * [modal Modal control]
 */
ev.modal = {
    init: function () {
        this.events();
    },
    events: function () {
        var self = this;

        $('body').on('click', '.js-modal-close', function (e) {
            e.preventDefault();
            self.closeModal();
        });
        $(window).on('keydown', function (e) {
            if (e.keyCode === 27) {
                self.closeModal();
            }
        });
    },
    openModal: function () {
        $('body').addClass('modal--site-select-visible');
    },
    closeModal: function () {
        $('body').removeClass('modal--site-select-visible');
    }
};
ev.modal.init();

/**
 * [faq FAQ]
 */
ev.faq = {
    init: function() {
        var hash = window.location.hash;

        if (hash) {
            hash = hash.replace('#', '');
            hash = hash.split('--');

            // Ensure hash is valid and tabs are on the page
            if (hash.length === 2 && $('[data-tabs]')) {

                $(window).load(function() {
                    // hash[0] == tab
                    $('[data-id="' + hash[0] + '"] a').trigger('click');

                    // hash[1] == faq
                    $('html, body').animate({
                        scrollTop: $('#' + hash[1]).offset().top
                    }, 500);
                });

            }
        }
    }
};
ev.faq.init();

/**
 * video autoscroll
 **/
jQuery(document).ready(function ($) {

    if (window.location.hash === "#video" || window.location.hash === "video") {

        var video = $("div.layout-kb-article iframe").first();
        var src = video.attr("src");
        var letter;
        if (src.indexOf('?') > -1) {
            src += '&';
        } else {
            src += '?';
        }
        video.attr('src', src + 'autoplay=true');
        window.location.href="#video";
        window.setTimeout(
            function () {
                window.scrollTo(0, parseInt(video[0].offsetTop) + parseInt(video[0].height));
            }, 3000
        );

    }
});
