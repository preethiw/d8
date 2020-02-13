/**
 * @file
 * UNFPA Global Annual Report region js logic.
 */
(function ($) {



/**
 * Region top facts behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18RegionTopFacts = {
  attach: function (context, settings) {
    $('.ar18-region-topfacts', context).once('unfpaGlobalAr18RegionTopFacts').each(function() {
      var $wrapper = $(this);
      var $names = $wrapper.find('.ar18-region-topfact-name');
      var $infos = $wrapper.find('.ar18-region-topfact-info');

      setTimeout(function () {
        Drupal.unfpaGlobalAr18.equalHeight($names);
        Drupal.unfpaGlobalAr18.equalHeight($infos);
      }, 200);

      var timeout;
      $(window).resize(function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          Drupal.unfpaGlobalAr18.equalHeight($names);
          Drupal.unfpaGlobalAr18.equalHeight($infos);
        }, 200);
      });
    });
  }
};



/**
 * Region expenses table behaviours.
 */
Drupal.behaviors.unfpaGlobalAr18RegionExpensesTable = {
  attach: function (context, settings) {
    $('.ar18-region-progexp-data', context).once('unfpaGlobalAr18RegionExpensesTable').each(function() {
      var $wrapper = $(this);

      // Programme expenses shwoing of more countries.
      var $more_button = $wrapper.find('.ar18-region-progexp-more button');
      var $more_rows = $wrapper.find('.ar18-region-progexp-more-rows');

      $more_button.click(function () {
        if ($more_rows.is(':visible')) {
          $more_rows.fadeOut(300);
          $more_button
            .removeClass('ar18-region-progexp-more-active')
            .text(Drupal.t('More countries'));
        }
        else {
          $more_rows.fadeIn(300);
          $more_button
            .addClass('ar18-region-progexp-more-active')
            .text(Drupal.t('Less countries'));
        }
      });
    });
  }
};



/**
 * Region expenses by purpose carousel behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18RegionCarousel = {
  attach: function (context, settings) {
    $('.ar18-region-expurp-slider', context).once('unfpaGlobalAr18RegionCarousel').each(function() {
      var $slider = $(this);

      // Initializes Owl 2 slider.
      var init_slider = function ($obj) {
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
      var react = function () {
        if (!Drupal.unfpaGlobalAr18.isWideViewport()) {
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
      $(window).resize(function () {
        clearTimeout(timeout);
        timeout = setTimeout(react, 200);
      });
    });
  }
};



})(jQuery);
