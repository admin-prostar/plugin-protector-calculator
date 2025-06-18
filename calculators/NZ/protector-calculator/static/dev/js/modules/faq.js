
jQuery(document).ready(function($){
    var c = 'hidden--answer';
    $('.faq--answer').each(function(){
        var $t = $(this).parent();
        $t.addClass(c).find('h3').bind('click', function(){
            $t.toggleClass(c);
        })
    })
});
