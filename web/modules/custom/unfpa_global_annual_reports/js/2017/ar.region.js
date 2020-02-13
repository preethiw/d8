/**
 * @file
 * UNFPA Global Annual Report region js logic.
 */
(function ($) {



/**
 * Region expenses table behaviours.
 * 
 * Programme expenses shwoing of more countries.
 * Programme expenses side sliding for narrow viewports.
 * 
 */
Drupal.behaviors.unfpaGlobalArRegionExpensesTable = {
  attach: function (context, settings) {
    $('.ar17-region-progexp-data', context).once('unfpaGlobalArRegionExpensesTable').each(function() {
      var $wrapper = $(this);
      
      /* --- Programme expenses shwoing of more countries. --- */
      
      var $more_button = $wrapper.find('.ar17-region-progexp-more button');
      var $more_rows = $wrapper.find('.ar17-region-progexp-more-rows');
      
      $more_button.click(function() {
        if ($more_rows.is(':visible')) {
          $more_rows.fadeOut(300);
          $more_button
            .removeClass('ar17-region-progexp-more-active')
            .text(Drupal.t('More countries'));
        }
        else {
          $more_rows.fadeIn(300);
          $more_button
            .addClass('ar17-region-progexp-more-active')
            .text(Drupal.t('Less countries'));
        }
      });
      
      /* --- Programme expenses side sliding for narrow viewports. --- */
      
      var $pager_1 = $wrapper.find('.ar17-region-progexp-data-pager span:nth-child(1)');
      var $pager_2 = $wrapper.find('.ar17-region-progexp-data-pager span:nth-child(2)');
      var $prev = $wrapper.find('.ar17-region-progexp-data-prev');
      var $next = $wrapper.find('.ar17-region-progexp-data-next');
      var $values = $wrapper.find('.ar17-region-progexp-values');
      var $bgs = $wrapper.find('.ar17-region-progexp-data-bgs');
      var regular_order = true;
      
      // Function for showing first column.
      var show_first_column = function() {
        $values.each(function () {
          var $values_set = $(this);
          var $val1 = $values_set.find('.ar17-region-progexp-val-1');
          var $val2 = $values_set.find('.ar17-region-progexp-val-2');

          $val1.insertBefore($val2);
          $bgs.removeClass('.ar17-region-progexp-data-bgs-inverted');
        });

        $prev.hide();
        $next.show();
        $pager_1.addClass('active');
        $pager_2.removeClass('active');

        regular_order = true;
      };

      // Function for showing second column.
      var show_second_column = function() {
        $values.each(function() {
          var $values_set = $(this);
          var $val1 = $values_set.find('.ar17-region-progexp-val-1');
          var $val2 = $values_set.find('.ar17-region-progexp-val-2');

          $val2.insertBefore($val1);
          $bgs.addClass('.ar17-region-progexp-data-bgs-inverted');
        });

        $prev.show();
        $next.hide();
        $pager_1.removeClass('active');
        $pager_2.addClass('active');

        regular_order = false;
      };

      // Handle controls clicks.
      $pager_1.click(show_first_column);
      $pager_2.click(show_second_column);
      $prev.click(show_first_column);
      $next.click(show_second_column);
      
      // Revert columns order if wider viewport.
      var timeout = null;
      $(window).resize(function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          if (Drupal.unfpaGlobalAr.getViewportWidth() >= 480 && regular_order == false) {
            show_first_column();
          }
        }, 200);
      });
    });
  }
};



/**
 * Region expenses by purpose carousel behaviour.
 */
Drupal.behaviors.unfpaGlobalArRegionCarousel = {
  attach: function (context, settings) {
    $('.ar17-region-expurp-slider', context).once('unfpaGlobalArRegionCarousel').each(function() {
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



/**
 * Region expenses by purpose bars growing behaviour.
 */
Drupal.behaviors.unfpaGlobalArRegionGrowingBars = {
  attach: function (context, settings) {
    $('.ar17-region-expurp', context).once('unfpaGlobalArRegionGrowingBars').each(function() {
      var $wrapper = $(this);
      var $window = $(window);
      var $bars = $wrapper.find('.ar17-region-expurp-bar-anim');
      var resize_timeout;
      
      // Animate bars on scroll.
      var animate_bars = function() {
        var scrolltop = $window.scrollTop();
        var viewport_height = $window.height();
        
        $bars.each(function() {
          var $bar = $(this);
          var postop = $bar.offset().top;

          if (scrolltop > postop - viewport_height * 0.8) {
            $bar.animate({'width': '100%'}, 500, 'easeOutQuad');
          }
        });
      };
      
      // Deanimates bars.
      var deanimate_bars = function() {
        $bars.stop().css('width', 0);
      };

      // React function called on load, scroll, resize, etc.
      // React function called on load, scroll, resize, etc.
      var react = function() {
        if (Drupal.unfpaGlobalAr.isElementVisible($wrapper.get(0), 0)) {
          window.requestAnimationFrame(animate_bars);
        }
        else if (!Drupal.unfpaGlobalAr.isElementVisible($wrapper.get(0), -300)) {
          window.requestAnimationFrame(deanimate_bars);
        }
      };

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
