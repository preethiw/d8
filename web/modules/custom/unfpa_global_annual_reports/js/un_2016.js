/**
 * @file
 * General logic used by this module.
 * 
 * Contains stuff like:
 * - equal height
 * - continue reading
 * - region indicators carousel
 */
(function ($) {
  /**
   * Report 2016 introduction 4 columns animation.
   */
  Drupal.behaviors.ungraph = {
    attach: function (context, settings) {
      $('.intro-facts > div, .action-facts > div', context).once('ungraph').each(function () {
        var $numbcols = $(this);
        // Animate 4 cols when they come into view.

        var waypoint = new Waypoint({
          element: $numbcols.get(0),
          handler: function (direction) {
            // Using animate.css
            $numbcols.addClass('animated zoomInDown');
          },
          offset: '85%'// Do when element is 75% off from the top of the window.
        });

        var waypoint2 = new Waypoint({
          element: $numbcols.get(0),
          handler: function (direction) {
            $numbcols.removeClass('animated zoomInDown');
          },
          offset: '100%'
        });

        // Fix for page load when $numbcols is already above to waypoint.

        var from_top_of_viewport = $numbcols.get(0).getBoundingClientRect().top;
        var viewport_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (from_top_of_viewport < (viewport_height * 0.75)) {
          $numbcols.addClass('animated zoomInDown');
        }

        // Animate each col on mouse over.

        var $lis = $numbcols.find('li');
        $lis.each(function () {
          var $li = $(this);
          $li.addClass('animated infinite');

          $li.hover(function () {
            $li.addClass('pulse');
          }, function () {
            $li.removeClass('pulse');
          })
        });
      });

      var $active_tab;
      $('#transparency').on('click', '#donut-chart-tabs li', function () {
        $active_tab = $(this);
        switchTab($active_tab);
      });
    }
  };

  function switchTab($tab) {
    var chart = $tab.attr('tabfor');
    $('#donut-chart-tabs li').removeClass('active');
    $tab.addClass('active');
    $('.donut-chart').css({'visibility': 'hidden'});
    $('.bchart').css({'visibility': 'hidden'});
    $('#donutchart-' + chart).css({'visibility': 'visible'});
    $('.bchart.' + chart).css({'visibility': 'visible'});
  }
})(jQuery);
