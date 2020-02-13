/**
 * @file
 * UNFPA Global Annual Report intro/section heads js logic.
 */
(function ($) {




/**
 * Intro / section heads behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18Intro = {
  attach: function (context, settings) {
    $('.ar18-section-head', context).once('unfpaGlobalAr18Intro').each(function() {
      var $wrapper = $(this);
      var $window = $(window);
      var $animate = $wrapper.find('.ar18-section-head-content');
      var resize_timeout;

      // Animate bars on scroll.
      var animate = function () {
        var scrolltop = $window.scrollTop();
        var viewport_height = $window.height();
        var postop = $animate.offset().top;

        if (scrolltop > postop - viewport_height * 0.8) {
          $animate.addClass('ar18-intro-animated');
        }
      };

      // Deanimates.
      var deanimate = function () {
        $animate.removeClass('ar18-intro-animated');
      };

      // React function called on load, scroll, resize, etc.
      var react = function () {
        if (Drupal.unfpaGlobalAr18.isElementVisible($wrapper.get(0), 0)) {          
          window.requestAnimationFrame(animate);
        }
        else if (!Drupal.unfpaGlobalAr18.isElementVisible($wrapper.get(0), -300)) {
          window.requestAnimationFrame(deanimate);
        }
      };

      $animate.css({'transition': 'all 1s ease-out'});

      // Animate on load.
      $window.on('load', function () {
        react();
      });

      // Animate on scroll.
      $window.scroll(function () {
        react();
      });

      // Animate on resize.
      $window.resize(function () {
        clearTimeout(resize_timeout);
        resize_timeout = setTimeout(function () {
          react();
        }, 100);
      });

    });
  }
};



})(jQuery);
