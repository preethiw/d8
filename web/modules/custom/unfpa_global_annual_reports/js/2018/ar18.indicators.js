/**
 * @file
 * UNFPA Global Annual Report 2018 indicators js logic.
 */
(function ($) {



/**
 * Indicators carousel behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18Indicators = {
  attach: function (context, settings) {
    $('.ar18-indicators-slider', context).once('unfpaGlobalAr18Indicators').each(function() {
      var $slider = $(this);

      // Initializes Owl 2 slider.
      var init_slider = function ($obj) {
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

      setTimeout(function () {
        $slider.addClass('has-owl');
        Drupal.unfpaGlobalAr18.equalHeight($slider.find('.ar18-indicators-label'));
        init_slider($slider);
      }, 200);

      var timeout;
      $(window).resize(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          Drupal.unfpaGlobalAr18.equalHeight($slider.find('.ar18-indicators-label'));
        }, 200);
      });
    });
  }
};



})(jQuery);
