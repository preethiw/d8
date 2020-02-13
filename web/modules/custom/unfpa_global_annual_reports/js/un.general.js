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
 * Development stuff.
 */
$(document).ready(function() {
  if (1 == 2) {
    $('body').prepend('<div class="viewport-real" style="position: fixed; top: 0; left: 0; background: red; color: white; z-index: 9999; line-height: 1em; padding: 2px;"></div>');
    
    $('.viewport-real').text(window.innerWidth + 'px');
    
    $(window).resize(function() {
      $('.viewport-real').text(window.innerWidth + 'px');
    });
  }
});


/**
 * Initialize Drupal.un object if it doesn't exist.
 */
Drupal.un = Drupal.un || {};
Drupal.un.timers = Drupal.un.timers || {};


/**
 * Equal height.
 */
Drupal.un.equalHeight = function($items) {
  if ($items.length > 0) {
    var top_height = 0;
    
    $items.each(function() {
      var current_height = $(this).outerHeight();
      if (top_height < current_height) {
        top_height = current_height;
      }
    });
    $items.css({'min-height': top_height});
  }
};


/**
 * Action facts header match heights.
 */
Drupal.un.actionFactsHeaders = function() {
  $('.action-facts').each(function() {
    var $headers = $(this).find('.fact-name');
    // First reset whatever might have been previously set.
    $headers.css({'min-height': 0});
    // Now match height of all headers.
    if (Drupal.un.deviceCheck.is768plus()) {
      Drupal.un.equalHeight($headers);
    }
  });
};


/**
 * Document ready.
 */
$(document).ready(function() {
  // Match heights of all InAction facts headers.
  Drupal.un.actionFactsHeaders();
  $(window).resize(function() {
    clearTimeout(Drupal.un.timers.actionFactsHeaders);
    Drupal.un.timers.actionFactsHeaders = setTimeout(function() {
      Drupal.un.actionFactsHeaders();
    }, 200);
  });
});


/**
 * Continue reading.
 */
Drupal.behaviors.unContinueReading = {
  attach: function (context, settings) {
    $('.rp-readmore', context).once('unContinueReading').each(function() {
      $(this).click(function(event) {
        event.preventDefault();
        
        var $link = $(this);
        var $more = $link.prev('.rp-readmore-content');
        
        if ($link.hasClass('rp-readmore-expanded')) {
          $more.slideUp(200, function() {
            $link.removeClass('rp-readmore-expanded');
            // Need to refresh position since document content length changed.
            // See un.scrolling.js.
            Drupal.un.refresh();
          });
        }
        else {
          $more.slideDown(200, function() {
            $link.addClass('rp-readmore-expanded');
            // Need to refresh position since document content length changed.
            // See un.scrolling.js.
            Drupal.un.refresh();
          });
        }
      });
    });
  }
};


/**
 * Region Indicators Owl Carousel.
 */
Drupal.behaviors.unRegionIndicators = {
  attach: function (context, settings) {
    $('.region-indicators', context).once('unRegionIndicators').each(function() {
      var $ri = $(this);
      var $inner = $ri.find('.region-indicators-inner-2');
      
      // Also append spans to prev/next for styling.
      var afterInitCallback = function() {
        $inner.find('.owl-prev').html('<span>' + Drupal.t('Prev') + '</span>');
        $inner.find('.owl-next').html('<span>' + Drupal.t('Next') + '</span>');
      };
      
      $inner.owlCarousel({
        items: 3,
        itemsDesktop: [1000,3],
        itemsTablet: [900,2],
        itemsMobile: [480,1],
        pagination: false,
        navigation: true,
        rewindNav: true,
        afterInit: afterInitCallback,
        autoPlay: 5000,
        stopOnHover: true
      });
    });
  }
};


/**
 * Report 2015 tiles.
 */
Drupal.behaviors.unTiles = {
  attach: function (context, settings) {
    $('.rp-tiles > ul', context).once('unRegionIndicators').each(function() {
      
      // Save references and vars.
      
      var $tiles = $(this);
      var $buttons = $tiles.find('.rp-tile-collapsed button');
      var items_count = $tiles.find('li.rp-tile').length;
      var original_order = $tiles.clone().html();
      var masonry_on = true;
      
      // Initialize tiles masonry.
      
      var tilesMasonryInit = function() {
        $tiles.masonry({
          itemSelector: 'li.rp-tile',
          columnWidth: 210,
          gutter: 30
        });
        $tiles.masonry();
      };

      setTimeout(function() {
        tilesMasonryInit();
        original_order = $tiles.clone().html();

        // Need to refresh position since document content length changed.
        // See un.scrolling.js.
        Drupal.un.refresh();
      }, 1500);
      
      // Reset and reposition tiles masonry.
      
      var tilesMasonryRedo = function(action) {
        if (action == 'reload' || action == 'both') {
          // Need to reload items since their order might have changed.
          $tiles.masonry('reloadItems');
        }
        if (action == 'reposition' || action == 'both') {
          // Reposition all tiles after opening single tile detail view.
          $tiles.masonry();
        }

        // Need to refresh position since document content length changed.
        // See un.scrolling.js.
        Drupal.un.refresh();
      };
      
      // Reverts original tiles order after it was changed.
      
      var tilesRevertOrder = function() {
        $tiles.html(original_order);
      };
      
      // Handle some changes on window resize.
      
      var tilesOnResize = function() {
        if (Drupal.un.deviceCheck.is768plus()) {
          var $items = $tiles.find('li.rp-tile');
          $items.removeClass('last-in-row');
          var width = $tiles.outerWidth();
          var in_row = Math.floor((width + 30) / 240);
          var $last_in_rows = $items.filter(':nth-child(' + in_row + 'n)');
          // Assign class to each tile that is last in row.
          $last_in_rows.addClass('last-in-row');
          
          // 768+ viewport - if masonry is not on then enable it.
          if (!masonry_on) {
            tilesMasonryInit();
            $tiles.find('.rp-tile-collapsed').show();
            $tiles.find('.rp-tile-expanded').hide();
            masonry_on = true;
          }
        }

        // 768 or less viewport - if masonry is on then disable it.
        else if (masonry_on) {
          $tiles.masonry('destroy');
          $tiles.find('.rp-tile-collapsed').hide();
          $tiles.find('.rp-tile-expanded').show();
          masonry_on = false;
        }
      };
      
      tilesOnResize();
      $(window).resize(function() {
        tilesOnResize();
      });
      
      // Tile expanding functionality.
      
      $buttons.on('click', function() {
        var $button = $(this);
        var $li = $button.parents('li:first');
        var $collapsed = $li.find('.rp-tile-collapsed');
        var $expanded = $li.find('.rp-tile-expanded');

        // Reset other tiles.
        var $items = $tiles.find('li.rp-tile');
        $items.find('.rp-tile-expanded').hide();
        $items.find('.rp-tile-collapsed').show();

        // Chage display of current tile.
        $collapsed.hide();
        $expanded.show();

        // Discover if this is a tile that has less than 4 tiles following it
        // on the list and if so change order so it has.
        var item_index = $li.index() + 1;
        var range = items_count - item_index;
        if (range < 4 && items_count > 3) {
          // Get subset of last 3 tiles to move them after our tile.
          var $tiles_to_move = $items.not($li).slice(-3);
          $tiles_to_move.insertAfter($li);
          // Reconstruct css classes after changing order.
          tilesOnResize();
        }

        // Discover if this is the last person in row and if yes switch its
        // place with previous person. We have to do it since expanded item
        // requires width of two tiles so it can't be last in row.
        if ($li.hasClass('last-in-row')) {
          $li.removeClass('last-in-row');
          var $prevItem = $li.prev();
          $prevItem.addClass('last-in-row');
          $prevItem.insertAfter($li);
        }
        
        // Reload items and reposition masonry after changing order and opening.
        tilesMasonryRedo('both');
      });
      
      // Tile closing functionlity.

      $('.rp-tile-close').on('click', function() {
        var $items = $tiles.find('li.rp-tile');
        $items.find('.rp-tile-expanded').hide();
        $items.find('.rp-tile-collapsed').show();
        
        // Or use the following lines to revert original order on closing.
        $tiles.css({'opacity': 0.2});
        tilesRevertOrder();
        $tiles.animate({'opacity': 1}, 500);
        // Reload items and reposition masonry after changing order and opening.
        tilesMasonryRedo('reload');
      });
    });
  }
};



/**
 * Report 2015 introduction 4 columns animation.
 */
Drupal.behaviors.unIntro4Cols = {
  attach: function (context, settings) {
    $('.intro-numbcols > ul', context).once('unIntro4Cols').each(function() {
      var $numbcols = $(this);

      // Animate 4 cols when they come into view.
      
      var waypoint = new Waypoint({
        element: $numbcols.get(0),
        handler: function(direction) {
          // Using animate.css
          $numbcols.addClass('animated zoomInDown');
        },
        offset: '75%'// Do when element is 75% off from the top of the window.
      });

      var waypoint2 = new Waypoint({
        element: $numbcols.get(0),
        handler: function(direction) {
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
      $lis.each(function() {
        var $li = $(this);
        $li.addClass('animated infinite');
        
        $li.hover(function() {
          $li.addClass('pulse');
        }, function() {
          $li.removeClass('pulse');
        })
      });
    });
  }
};


})(jQuery);