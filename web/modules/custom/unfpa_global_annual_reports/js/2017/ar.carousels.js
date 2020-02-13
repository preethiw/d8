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
    $('.ar17-indicators-slider, .ar17-region-expurp-slider', context).once('unfpaGlobalArCarousel').each(function() {
      var $slider = $(this);

      // Initializes Owl 2 slider.
      var init_slider = function($obj) {
        $obj.owlCarousel({
          items: 1,
          margin: 12,
          loop: true,
          center: true,
          autoWidth: true,
          nav: true
        });
      };

      // React function called on load and on resize.
      var react = function() {
        if (!Drupal.unfpaGlobalAr.isWideViewport()) {
          if (!$slider.hasClass('owl-loaded')) {
            // 'owl-loaded' class is added/removed automatically by Owl2 plugin.
            // Custom 'has-owl' class is used in CSS and is added early,
            // so extra CSS is applied before Owl initializes.
            $slider.addClass('has-owl');
            init_slider($slider);
          }
        }
        else if ($slider.hasClass('owl-loaded')) {
          $slider.trigger('destroy.owl.carousel');
          $slider.removeClass('has-owl');
        }
      };

      react();

      var timeout = null;
      $(window).resize(function() {
        clearTimeout(timeout);
        timeout = setTimeout(react, 200);
      });
    });
  }
};



})(jQuery);
