/**
 * @file
 * UNFPA Global Annual Report general js logic.
 */
(function ($) {



/**
 * Carousel behaviour.
 */
Drupal.behaviors.unfpaGlobalArCarousel = {
  attach: function (context, settings) {
    $('.ar17-indicators-slider', context).once('unfpaGlobalArCarousel').each(function() {
      var $slider = $(this);

      // Initializes Owl 2 slider.
      var init_slider = function($obj) {
        $obj.owlCarousel({
          items: 1,
          margin: 12,
          loop: true,
          center: true,
          autoWidth: true,
          nav: true,
          responsive: {
            1172: {
              items: 3,
              center: false
            }
          }
        });
      };
      
      setTimeout(function() {
        $slider.addClass('has-owl');
        Drupal.unfpaGlobalAr.equalHeight($slider.find('.ar17-indicators-label'));
        init_slider($slider);
      }, 200);
      
      var timeout;
      $(window).resize(function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          Drupal.unfpaGlobalAr.equalHeight($slider.find('.ar17-indicators-label'));
        }, 200);
      });
    });
  }
};



})(jQuery);
