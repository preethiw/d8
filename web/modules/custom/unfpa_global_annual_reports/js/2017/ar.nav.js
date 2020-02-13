/**
 * @file
 * UNFPA Global Annual Report Navigation logic.
 */
(function ($) {



/**
 * Nav height global variable.
 */
Drupal.unfpaGlobalAr.navHeight = 52;



/**
 * Scroll to a section if provided in the url.
 */
Drupal.unfpaGlobalAr.scrollOnload = function () {
  var url = location.href;
  var hash = url.split('#!/');

  if (hash[1] != undefined) {
    var target_id = hash[1];
    var $target_section = $('#' + target_id);

    // Return if there is no section marching id.
    if ($target_section.length == 0) {
      return;
    }

    setTimeout(function () {
      var top_offset = $target_section.offset().top - Drupal.unfpaGlobalAr.navHeight;
      var go_1 = top_offset - 1000;
      var go_2 = top_offset + 1;

      $('html, body')
        .scrollTop(go_1)
        .animate({scrollTop: go_2}, 2000);
    }, 700);
  }
};



/**
 * Window On Load.
 */
$(window).on('load', function() {
  // Scroll to a section if provided in the url.
  Drupal.unfpaGlobalAr.scrollOnload();
});



/**
 * Navigation behaviour.
 */
Drupal.behaviors.unfpaGlobalArNav = {
  attach: function (context, settings) {
    $('.ar17-nav', context).once('unfpaGlobalArNav').each(function() {
      var $window = $(window);
      var $document = $(document);
      var $nav = $(this);
      var $nav_current = $nav.find('.ar17-nav-current');
      var $nav_ul = $nav.find('.ar17-nav-items');
      var $nav_links = $nav.find('a');
      var $nav_parent_lis = $nav.find('.ar17-nav-parent');
      var $nav_fadein_trigger = $('.ar17-nav-fadein').eq(0);
      var current_id = -1;
      var nav_displayed = false;
      var recheck_nav_section = false;
      
      // Nav CSS classes used by js hasClass(), addClass() and removeClass().
      var class_nav_opened = 'ar17-nav-opened';
      var class_active_link = 'ar17-nav-active';
      var class_parent_li = 'ar17-nav-parent';
      var class_parent_expanded = 'ar17-nav-parent-expanded';
      
      /* --- Basic Functions --- */
      
      // Function for fading in nav.
      var nav_fade_in = function() {
        $nav.fadeIn();
        nav_displayed = true;
        setTimeout(nav_animate_onshow, 200);
      };

      // Function for fading out nav.
      var nav_fade_out = function() {
        $nav.fadeOut();
        nav_displayed = false;
        nav_close();
      };

      // Function for getting nav current color.
      var nav_get_color = function() {
        return $nav.attr('data-color');
      };

      // Function for setting nav color.
      var nav_set_color = function(color) {
        $nav.removeClass('ar17-nav-blue ar17-nav-pink ar17-nav-green ar17-nav-violet ar17-nav-orange ar17-nav-yellow ar17-nav-blue2');
        $nav.addClass('ar17-nav-' + color);
        $nav.attr('data-color', color);
      };

      // Function for getting nav current indicator text.
      var nav_get_current = function() {
        return $nav_current.html();
      };

      // Function for setting nav current indicator to show section name.
      var nav_set_current = function(label) {
        $nav_current.html(label);
      };

      // Function for opening nav.
      var nav_open = function() {
        $nav.addClass(class_nav_opened);
        $nav_ul.slideDown(300);
        
        setTimeout(function() {
          // Fix for opening closed subnav.
          $nav_parent_lis.filter('.' + class_parent_expanded).each(function() {
            var $child_ul = $(this).find('ul');
            if ($child_ul.height() < 1) {
              $child_ul.attr('style', null).hide(0).slideDown(300);
            }
          });
        }, 200);

        // Fix for closing opened subnav.
        $nav_parent_lis.not('.' + class_parent_expanded).each(function() {
          var $child_ul = $(this).find('ul');
          if (!$child_ul.is(':visible')) {
            $child_ul.attr('style', null).hide(0);
          }
        });
      };

      // Function for closing nav.
      var nav_close = function() {
        $nav.removeClass(class_nav_opened);
        $nav_ul.slideUp(300);
      };
      
      /* --- Navigation on scroll fade in and animate on show. --- */

      var already_animated = false;

      // Animates nav on show.
      var nav_animate_onshow = function() {
        if (already_animated) {
          return;
        }
        already_animated = true;

        setTimeout(function () {
          nav_set_color('blue');
          nav_set_current(Drupal.t('Message from the ED'));
        }, 1000);
        setTimeout(function () {
          nav_set_color('pink');
          nav_set_current(Drupal.t('Pregnancy by choice'));
        }, 1300);
        setTimeout(function () {
          nav_set_color('green');
          nav_set_current(Drupal.t("Saving mothers' lives"));
        }, 1600);
        setTimeout(function () {
          nav_set_color('violet');
          nav_set_current(Drupal.t('Empowering the next generation'));
        }, 1900);
        setTimeout(function () {
          nav_set_color('orange');
          nav_set_current(Drupal.t('Regions'))
        }, 2200);
        setTimeout(function () {
          nav_set_color('blue2');
          nav_set_current(Drupal.t('Partnership'));
        }, 2500);
        if ($('.ar17-resources').length) {
          setTimeout(function () {
            nav_set_color('yellow');
            nav_set_current(Drupal.t('Resources and management'));
          }, 2800);
        }
        setTimeout(function () {
          recheck_nav_section = true;
          window.scrollTo(window.scrollX, window.scrollY - 1);
          window.scrollTo(window.scrollX, window.scrollY + 1);
        }, 3100);
      };

      // Fades nav in and out when needed.
      var nav_fading = function() {
        var window_scroll_top = $window.scrollTop();
        var trigger_scroll_top = $nav_fadein_trigger.offset().top - Drupal.unfpaGlobalAr.navHeight;

        if (window_scroll_top > trigger_scroll_top && !nav_displayed) {
          nav_fade_in();
        }
        else if (trigger_scroll_top > window_scroll_top && nav_displayed) {
          nav_fade_out();
        }
      };

      $window
        .on( "load", nav_fading )
        .scroll(nav_fading)
        .resize(nav_fading);

      /* --- Tracking of active nav link and updating nav colors. --- */

      var $sections = $('.ar17-section');

      // Track active nav item.
      var nav_track_active = function() {
        // Get active section.
        var scrolltop = $window.scrollTop();
        var new_id = -1;
        var color = 'orange';

        $sections.each(function() {
          if (($(this).offset().top - Drupal.unfpaGlobalAr.navHeight) < (scrolltop + 1)) {
            var $section = $(this);
            new_id = $section.attr('id');
            color = $section.attr('data-color');
          }
        });

        // If active section didn't change then return.
        if (new_id == current_id && !recheck_nav_section) {
          return;
        }
        
        current_id = new_id;
        recheck_nav_section = false;

        // De-highlight nav links.
        $nav_links.removeClass(class_active_link);
        $nav_parent_lis.removeClass(class_parent_expanded);
        $nav_parent_lis.find('ul').stop().slideUp(300);
        
        if (new_id != -1) {
          // Highlight current link.
          var $current_link = $nav_links.filter('[href*=\\#' + current_id + ']');          
          $current_link.addClass(class_active_link);

          // If this link has parent item, then expand it.
          var $parent_li = $current_link.parents('.' + class_parent_li);
          if ($parent_li.length) {
            $parent_li.addClass(class_parent_expanded);
            $parent_li.find('ul').stop().slideDown(300);
          }
          
          // Set current indication text to link text.
          nav_set_current($current_link.text());
        }
        else {
          nav_set_current('&nbsp;');
        }
        
        // Update nav color.
        nav_set_color(color);
      };

      // React function called on load, scroll, resize, etc.
      var nav_react = function() {
        window.requestAnimationFrame(nav_track_active);
      };

      $window
        .on( "load", nav_react )
        .scroll(nav_react);

      // Do stuff on window resize.
      var resize_timeout = null;
      $window.resize(function () {
        clearTimeout(resize_timeout);
        resize_timeout = setTimeout(function () {
          nav_react();
          // Additionally reset nav ul height (which was set by slideDown).
          $nav.find('ul').css('height', null);
        }, 100);
      });

      /* --- Interactions with nav: Opening and closing. --- */
      
      $nav_current.click(function() {
        if ($nav_ul.is(':visible')) {
          nav_close();
        }
        else {
          nav_open();
        }
      });
      
      /* --- Interaction with nav: Link clicking. --- */
      
      // Link clicking causes scrolling to section with pre-scroll to to closer
      // place in page which happens before the main scrolling. This prescroll
      // requires data-weight attributes set on all sections, so lets add these
      // attributes dynamically now.
      $sections.each(function(index) {
        $(this).attr('data-weight', index);
      });
      
      $nav_links.click(function (event) {
        var $a = $(this);
        event.preventDefault();
        
        // Find out if this is parent link which should show subnav on
        // click or if it is regular link which should cause scrolling.
        var $parent_li = $a.parent();
        var is_parent = $parent_li.hasClass(class_parent_li);
        
        // Handle clicking parent link (expands/collapses).
        if (is_parent) {
          var $child_ul = $parent_li.find('ul');
          
          if ($parent_li.hasClass(class_parent_expanded)) {
            $parent_li.removeClass(class_parent_expanded);
            $child_ul.stop().slideUp(300);
          }
          else {
            $parent_li.addClass(class_parent_expanded);
            $child_ul.stop().slideDown(300);
          }
        }
        
        // Handle clicking regular link (scrolls to section).
        else {
          var section_id = $a.attr('href').replace(/#/, '');
          var $section = $('#' + section_id);

          // Close nav bafore scrolling.
          nav_close();

          setTimeout(function() {
            // Do pre-scroll if we are within one of the 6 sections but not
            // within the same section as clicked nav item.
            if (section_id != current_id && current_id != -1) {
              var current_weight = parseInt($('#' + current_id).attr('data-weight'));
              var section_weight = parseInt($section.attr('data-weight'));

              if (section_weight < current_weight) {
                // Gotta go up.
                $('html, body').scrollTop($section.offset().top - Drupal.unfpaGlobalAr.navHeight + 300);
              }
              else if (section_weight > current_weight) {
                // Gotta go down.
                $('html, body').scrollTop($section.offset().top - Drupal.unfpaGlobalAr.navHeight - 300);
              }
            }

            // Set location.
            location.href = '#!/' + section_id;

            // Animate.
            $('html, body').animate(
              {scrollTop: $section.offset().top - Drupal.unfpaGlobalAr.navHeight + 1},
              1000
            );
          }, 300);
        }
      });

      /* --- Close nav on away click. --- */
      
      $nav
        .click(function(event) {
          event.stopPropagation();
        })
        .on('touchstart', function(event) {
          event.stopPropagation();
        });

      $('body')
        .click(nav_close)
        .on('touchstart', nav_close);
    });
  }
};



})(jQuery);
