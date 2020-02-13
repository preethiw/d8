/**
 * @file
 * UNFPA Global Annual Report 2018 Navigation logic.
 */
(function ($) {



/**
 * Scroll to a section if provided in the url.
 */
Drupal.unfpaGlobalAr18.scrollOnload = function () {
  var url = location.href;
  var url_split = url.split('#!/');
  var section_id = url_split[1];

  // Return if there is no section id.
  if (section_id === undefined) {
    return;
  }

  // Get scroll target element.
  var $target = $('#' + section_id);

  // Return if there is target to scroll to.
  if ($target.length == 0) {
    return;
  }

  // Scroll to target.
  setTimeout(function () {
    var top_offset = $target.offset().top;
    var go_1 = top_offset - 1000;
    // Account for nav height when using top_offset
    var go_2 = top_offset + 1 - 52;

    $('html, body')
      .scrollTop(go_1)
      .animate({scrollTop: go_2}, 2000);
  }, 700);

};



/**
 * Window On Load.
 */
$(window).on('load', function () {
  // Scroll to a section if provided in the url.
  Drupal.unfpaGlobalAr18.scrollOnload();
});




/**
 * Navigation behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18Nav = {
  attach: function (context, settings) {
    $('.ar18-nav', context).once('unfpaGlobalAr18Nav').each(function() {
      var $window = $(window);
      var $document = $(document);
      var $nav = $(this);

      var $nav_bar = $nav.find('.ar18-navbar');
      var $nav_current = $nav.find('.ar18-nav-current');
      var $nav_expand = $nav.find('.ar18-nav-expand');

      var $menu = $nav.find('.ar18-menu');
      var $menu_links = $menu.find('.ar18-menu-sections a');
      var $menu_close = $nav.find('.ar18-menu-close');

      /* --- Nav Menu Opening / Closing --- */

      // Function for opening menu.
      var menu_open = function () {
        $nav_bar.addClass('ar18-navbar-menu-opened');
        $menu.addClass('ar18-menu-opened');
      };

      // Function for closing menu.
      var menu_close = function () {
        $nav_bar.removeClass('ar18-navbar-menu-opened');
        $menu.removeClass('ar18-menu-opened');
      };

      $nav_expand.click(function () {
        menu_open();
      });

      $menu_close.click(function () {
        menu_close();
      });

      /* --- Nav Menu Links Clicking --- */

      $menu_links.click(function (event) {
        event.preventDefault();

        // Scroll to section.
        var $link = $(this);
        // Href is always '#' sign + section id, e.g. '#region-3'.
        var href = $link.attr('href');
        // Use nav height as negative offset when scrolling to
        // sections so the section's heading isn't cover by nav.
        Drupal.unfpaGlobalAr18.scrollTo(href, -52);

        // Set URL hash.
        var section_id = href.substr(1);
        window.location.hash = '#!/' + section_id;

        // Also close menu.
        menu_close();
      });

      /* --- Nav Bar Reacting On Scrolling  --- */

      var $sections = $('.ar18-section');

      // Function for setting active menu link.
      var menu_set_active = function (id) {
        $menu_links.removeClass('active');
        // If any section is active then style menu item as active.
        if (id) {
          var $active_link = $menu_links.filter('[href="#' + id + '"]');
          if ($active_link.length) {
            $active_link.addClass('active');
            $nav_current.text($active_link.text());
          }
          else {
            $nav_current.text(Drupal.t('Annual Report 2018'));
          }
        }
        // If no section is active then it means we are on top of the site.
        // In this case the nav should become hidden.
        else {
          menu_close();
          $nav_current.text(Drupal.t('Annual Report 2018'));
        }
      };

      // React function, called on load, on scroll and on resize.
      var nav_react = function () {
        window.requestAnimationFrame(function () {
          var scrolltop = $document.scrollTop();

          // Set active menu item based on section that is in viewport.
          var active_section_id = false;

          $sections.each(function () {
            var $section = $(this);
            var section_postop = $section.offset().top;
            // Account for nav height when using scrollTop.
            if (section_postop <= scrolltop + 52) {
              active_section_id = $section.attr('id');
            }
          });

          menu_set_active(active_section_id);
        });
      };

      $window.on('load', function () {
        nav_react();
      });

      // Do stuff on window scroll.
      $window.scroll(function () {
        nav_react();
      });

      // Do stuff on window resize.
      var resize_timeout = null;
      $window.resize(function () {
        clearTimeout(resize_timeout);
        resize_timeout = setTimeout(function () {
          nav_react();
        }, 100);
      });
    });
  }
};



})(jQuery);
