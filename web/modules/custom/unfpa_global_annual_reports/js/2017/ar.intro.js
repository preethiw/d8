/**
 * @file
 * UNFPA Global Annual Report intro/section heads js logic.
 */
(function ($) {




/**
 * Intro / section heads behaviour.
 */
Drupal.behaviors.unfpaGlobalArIntro = {
  attach: function (context, settings) {
    $('.ar17-section-head', context).once('unfpaGlobalArIntro').each(function() {
      var $wrapper = $(this);
      var $window = $(window);
      var $animate = $wrapper.find('.ar17-section-head-content');
      var resize_timeout;
      
      // Animate bars on scroll.
      var animate = function() {
        var scrolltop = $window.scrollTop();
        var viewport_height = $window.height();
        var postop = $animate.offset().top;
 
        if (scrolltop > postop - viewport_height * 0.8) {
          $animate.addClass('ar17-intro-animated');
        }
      };
      
      // Deanimates bars.
      var deanimate = function() {
        $animate.removeClass('ar17-intro-animated');
      };

      // React function called on load, scroll, resize, etc.
      var react = function() {
        if (Drupal.unfpaGlobalAr.isElementVisible($wrapper.get(0), 0)) {
          window.requestAnimationFrame(animate);
        }
        else if (!Drupal.unfpaGlobalAr.isElementVisible($wrapper.get(0), -300)) {
          window.requestAnimationFrame(deanimate);
        }
      };

      $animate.css({'transition': 'all 1s ease-out'});

      // Animate circles on load if they are in viewport.
      $window.on('load', function() {
        react();
      });

      // Animate circles on scroll if they come into viewport.
      $window.scroll(function () {
        react();
      });

      // Animate circles on resize if they are become visiblew in viewport.
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
