/**
 * @file
 * Contains logic responsible for sections scrolling, fading and navigation logic.
 */
(function ($) {


/**
 * Initialize Drupal.un object if it doesn't exist.
 */
Drupal.un = Drupal.un || {};


/**
 * Variables.
 */
// Timer for storing references to js setTimeout.
Drupal.un.timers = Drupal.un.timers || {};

// Sections as used in the page (array of 'section-1', 'section-2', 'section-3' etc).
Drupal.un.sections = [];
// Populate dynamically right away.
$('.rp-section').each(function(index) {
  var id = $(this).attr('data-section');
  Drupal.un.sections.push('section-' + id);
});

// Variable stating which report page we are at (2014 vs 2015).
Drupal.un.repversion = 2014;
if ($('.rp').hasClass('rp15')) {
  Drupal.un.repversion = 2015;
}
  if ($('.rp').hasClass('rp16')) {
    Drupal.un.repversion = 2016;
  }

// Sections 4 and 5 have subsections.
// This variable is populated dynamically.
Drupal.un.subsections = {
  4: [],
  5: []
};

// Keep track of current active (displayed) section and subsection.
Drupal.un.current = 0;
Drupal.un.subcurrent = 0;

// Keep track of positions of sections within the document.
Drupal.un.positions = {};
Drupal.un.subpositions = {};

// Reference to jquery skrollr object.
Drupal.un.skrollr = {};



/**
 * Scroll to a section if provided in the url.
 */
Drupal.un.scrollOnload = function() {
  var url = location.href;
  var hash = url.split('#!/');

  if (hash[1] != 'undefined') {
    var $anchor = $('.sc-anchor#' + hash[1]);
    if ($anchor.length > 0) {
      var go1 = Math.round($anchor.offset().top) - 350;
      var go2 = Math.round($anchor.offset().top);
      setTimeout(function() {
        $('html, body')
          .scrollTop(go1)
          .animate({scrollTop: go2}, 1000);
      }, 700);
    }
  }
};


/**
 * Find out subsections ids and store them in Drupal.un.subsections.
 */
Drupal.un.findSubsections = function() {
  $('.section-4 .subsection').each(function() {
    var id = $(this).attr('data-section');
    Drupal.un.subsections[4].push(id);
  });
  $('.section-5 .subsection').each(function() {
    var id = $(this).attr('data-section');
    Drupal.un.subsections[5].push(id);
  });
};


/**
 * Initialization function called on $(window).load (and $(window).resize?).
 */
Drupal.un.init = function() {
  Drupal.un.refresh();
  Drupal.un.timers.init = setTimeout(function() {
    Drupal.un.positioning();
  }, 240);
};


/**
 * Refresh information about sections/subsections px positions within the page.
 */
Drupal.un.refresh = function() {
  clearTimeout(Drupal.un.timers.refresh);
  Drupal.un.timers.refresh = setTimeout(function() {

    var wh = $(window).height();

    // Last section min-height must be at least viewport height + 1px - top/bottom paddings.
    if (Drupal.un.deviceCheck.is768plus()) {
      var min_height = $(window).height() + 1;
      $('.section-6').css({'min-height': min_height + 'px'});
    }
    else {
      $('.section-6').css({'min-height': 0});
    }

    // Save positions of sections.
    for (var i = 0, I = Drupal.un.sections.length; i < I; i++) {
      // Section id, like 'section-1'.
      var id = Drupal.un.sections[i];
      var $cid = $('.' + id);
      Drupal.un.positions[id] = {};
      Drupal.un.positions[id].top = Math.round($cid.offset().top);
      Drupal.un.positions[id].bottom = Drupal.un.positions[id].top + $cid.outerHeight();
    }

    // Save positions of subsections.
    for (var sec in Drupal.un.subsections) {
      // 'sec' is parent section number.
      var sec_name = 'section-' + sec;

      for (var s = 0, S = Drupal.un.subsections[sec].length; s < S; s++) {
        // 'sub' is subsection number (nid).
        var sub = Drupal.un.subsections[sec][s];
        Drupal.un.subpositions[sub] = {};
        // Subsection top position.
        Drupal.un.subpositions[sub].top = 
          Math.round($('.section-' + sub).offset().top);
        // Subsection bottom position.
        Drupal.un.subpositions[sub].bottom = 
          Drupal.un.subpositions[sub].top + 
          $('.section-' + sub).outerHeight();
      }
    }

    // Refresh skrollr.
    if (typeof(Drupal.un.skrollr.refresh) != 'undefined') {
      Drupal.un.skrollr.refresh();
    }

  }, 100);
};


/**
 * Position tracking function, called on $(window).scroll. Handles the following:
 * - showing/hiding and highlighting navigation items
 * - changing subnav look and position
 * - fading background images
 * - fading in/out sections
 */
Drupal.un.positioning = function() {
  var  wt = $(window).scrollTop();
  var num = 0;

  for (var pos in Drupal.un.positions) {
    // If this 'pos' (section) is visible within the viewport.
    if (wt >= Drupal.un.positions[pos].top && wt <= Drupal.un.positions[pos].bottom) {
      num = pos.replace('section-', '');

      // If this is already current displayed section.
      if (num == Drupal.un.current) {
        // Look for subnavs to highlight.
        for (var subpos in Drupal.un.subpositions) {
          if (wt >= Drupal.un.subpositions[subpos].top && wt <= Drupal.un.subpositions[subpos].bottom) {
            if (subpos != Drupal.un.subcurrent) {
              // Got subnav that should be marked active.
              Drupal.un.subcurrent = subpos;
              $('.rp-nav ul a').removeClass('active');
              $('.rp-nav li[data-section="' + subpos + '"] > a').addClass('active');
            }
            break;
          }
        }
      }

      // Else: this is not current active section.
      else {
        if (window.isDesktop && Drupal.un.deviceCheck.is768plus()) {
          // Change site background + copy it's bg color to <body>.
          $('.rp > .bg').not('.bg-' + num).fadeOut(); 
          $('.rp > .bg-' + num).fadeIn();
          var bg_color = $('.rp > .bg-' + num).css('background-color');
          $('html, body').css({'background-color': bg_color});
          
          // Fade in/out section content.
          $('.' + pos).css({'opacity': 0}).stop().animate({opacity: 1.0}, $(window).height()/2);
          for (var g = num, G = Drupal.un.sections.length; g < G; g++) {
            $('.' + Drupal.un.sections[g]).css({opacity: 0});
          }
        }

        // Fade in/out nav heading.
        $('.nav-headings > div').not('.heading-' + num).stop().fadeOut();
        $('.heading-' + num).stop().css({display: 'block', opacity: 0})
          .animate({opacity: 1.0}, 700);

        // Fade in/out nav white vs black (report 2014 only).
        if (Drupal.un.repversion == 2014) {
          if (num == '2' || num == '4') {
            $('#nav-black').fadeOut('fast');
            $('#nav-white').fadeIn('fast');
          }
          else {
            $('#nav-black').fadeIn('fast');
            $('#nav-white').fadeOut('fast');
          }
        }

        // Control nav items active class.
        $('.rp-nav a').removeClass('active');
        $('.rp-nav li[data-section="' + num + '"] > a').addClass('active');
        
        // Control nav sub-ul visibility.
        $('.rp-nav ul').fadeOut();
        $('.rp-nav li[data-section="' + num + '"] > ul').fadeIn();
      }

      // Save what section is current.
      Drupal.un.current = num;
      break;
    }
  }

  // Reposition nav based on current section number.
  if (num > 0) {
    var nav_left = ($(window).width() - $('.section-1').outerWidth()) / 2;
    $('.rp nav').css({position: 'fixed', left: nav_left + 'px'}).addClass('nav-fixed');
  }
  else {
    $('.rp nav').css({position: 'absolute', left: 0}).removeClass('nav-fixed');
  }
};



/**
 * Additional stuff to be done on any device window resize.
 */
Drupal.un.onAnydeviceResize = function() {
  clearTimeout(Drupal.un.timers.onAnydeviceResize);
  Drupal.un.timers.onAnydeviceResize = setTimeout(function() {
    // Decide if section should be visible all at once or fading.
    if (!Drupal.un.deviceCheck.is768plus()) {
      $('.rp-section').css({'opacity': 1});
      $('.rp > .bg').css({'opacity': 0});
      $('section .bg').show(0);
    }
    else {
      $('.rp-section').css({'opacity': 1});
      $('.rp > .bg').css({'opacity': 1});
      $('section .bg').hide(0);
    }
  }, 100);
};



/**
 * Additional stuff to be done on desktop window resize.
 */
Drupal.un.onDesktopResize = function() {
  clearTimeout(Drupal.un.timers.onDesktopResize);
  Drupal.un.timers.onDesktopResize = setTimeout(function() {
    // Reposition fixed-positioned subnav on window resize.
    if ($('.rp nav').hasClass('nav-fixed')) {
      var nav_left = ($(window).width() - $('.section-1').outerWidth()) / 2;
      $('.rp nav').css({left: nav_left + 'px'});
    }

    // Last section min-height must be at least viewport height + 1px.
    if (Drupal.un.deviceCheck.is768plus()) {
      var min_height = $(window).height() + 1;
      $('.section-6').css({'min-height': min_height + 'px'});
    }
    else {
      $('.section-6').css({'min-height': 0});
    }
  }, 100);
};


/**
 * Window On Load.
 */
$(window).on('load', function() {
  // Scroll to a section if provided in the url.
  Drupal.un.scrollOnload();
  // Find subsections.
  Drupal.un.findSubsections();

  // On Resize - All Devices.
  $(window).resize(function() {
    Drupal.un.onAnydeviceResize();
  });

  // Various stuff that happens for desktops only.
  if (window.isDesktop) {
    // Initialize.
    Drupal.un.init();
    // Refresh on window resize and reposition fixed nav.
    $(window).resize(function() {
      Drupal.un.init();
      Drupal.un.onDesktopResize();
    });
    // Position tracking on window scroll.
    $(window).scroll(function() {
      Drupal.un.positioning(); 
    });
    // Initialize jQuery skrollr.
    setTimeout(function() {
      Drupal.un.skrollr = skrollr.init({
        forceHeight: false,
        edgeStrategy: 'set',
        easing: {
          WTF: Math.random,
          inverted: function(p) {
            return 1-p;
          }
        }
      });
    }, 500);
  }
});


/**
 * General behvaiour.
 */
Drupal.behaviors.unMain = {
  attach: function (context, settings) {
    // Remove bg images for browsers that don't support background-size.
    if (!Drupal.un.deviceCheck.backgroundSize() || Drupal.un.deviceCheck.isMobile()) {
      $('section .bg, .rp > .bg').css({'background-image': 'none'});
    }
  }
};


/**
 * Prepare navigation behaviour.
 */
Drupal.behaviors.unPrepareNav = {
  attach: function (context, settings) {
    $('.rp nav', context).once('unPrepareNav', function () {
      $('.rp-nav').attr({id: 'nav-black'});
      var navb = $('#nav-black');

      // Duplicate #nav-black as #nav-white.
      navb.after('<ul class="rp-nav" id="nav-white">' + navb.html() + '</ul>');

      // Apply clicks to nav items for main sections.
      $('.rp-nav > li a').each(function() {
        var $a = $(this);
        if (!$a.hasClass('no-scroll-link')) {
          $a.click(function(event) {
            event.preventDefault();

            var href = $a.attr('href').replace(/#/, '');
            var $section = $('.sc-anchor#' + href).parents('.subsection, .rp-section').eq(0);
            var sec = $section.data('section');

            // Main sections.
            if ($section.hasClass('rp-section')) {
              if (sec != Drupal.un.current) {
                if ((parseInt(sec) != (parseInt(Drupal.un.current) + 1)) &&
                  (parseInt(sec) != (parseInt(Drupal.un.current) - 1)) && 
                  sec < Drupal.un.current) { 
                  // Gotta go up.
                  $('html, body').scrollTop(Drupal.un.positions['section-' + sec].bottom - 0);
                }
                else if (((parseInt(sec) - 1) != parseInt(Drupal.un.current)) &&
                ((parseInt(sec) + 1) != parseInt(Drupal.un.current)) &&
                sec > Drupal.un.current) {
                  // Gotta go down.
                  $('html, body').scrollTop(Drupal.un.positions['section-' + sec].top - 200);
                }
              }

              location.href = '#!/' + href;
              var padd_top = parseInt($('.section-' + sec).css('padding-top').replace(/px/gi, ''));

              $('html, body').animate({scrollTop:
                $('.section-' + sec).offset().top + padd_top}, 1000);
            }

            // Subsections.
            else if ($section.hasClass('subsection')) {
              if (sec != Drupal.un.subcurrent) {
                if ((parseInt(sec) != (parseInt(Drupal.un.subcurrent) + 1)) &&
                  (parseInt(sec) != (parseInt(Drupal.un.subcurrent) - 1)) && 
                  sec < Drupal.un.subcurrent) { 
                  // Gotta go up.
                  $('html, body').scrollTop(Drupal.un.subpositions[sec].bottom - 0);
                }
                else if (((parseInt(sec) - 1) != parseInt(Drupal.un.subcurrent)) &&
                ((parseInt(sec) + 1) != parseInt(Drupal.un.subcurrent)) &&
                sec > Drupal.un.subcurrent) {
                  // Gotta go down.
                  $('html, body').scrollTop(Drupal.un.subpositions[sec].top - 400);
                }
              }

              location.href = '#!/' + href;

              $('html, body').animate({scrollTop:
                $('.section-' + sec).offset().top + 2}, 1000);
            }
          });
        }
      });
    });
  }
};



/**
 * Mobile navigation behaviour.
 */
Drupal.behaviors.unMobileNav = {
  attach: function (context, settings) {
    $('.nav-mobile', context).once('unMobileNav', function () {
      var $nav = $(this);
      var $label = $nav.find('.nav-mobile-label');
      var $ul = $(this).find('ul');
      var $links = $nav.find('a');

      $label.click(function() {
        if ($ul.is(':visible')) {
          $ul.slideUp(200);
          $label.removeClass('active');
        }
        else {
          $ul.slideDown(200);
          $label.addClass('active');
        }
      });

      $links.each(function() {
        var $lnk = $(this);

        $lnk.click(function(e) {
          e.preventDefault();

          // Hide expanded mobile nav on click.
          if ($ul.is(':visible')) {
            $ul.slideUp(200);
            $label.removeClass('active');
          }

          // Scroll to desired section (recognized by #).
          var hash = $lnk.attr('href');
          // Find out parent section of this #.
          var $section = $(hash).parents('.rp-section');

          $('html, body').animate({
            // 46 is mobile nav height, +2px to make sure.
            scrollTop: $($section).offset().top + 2 - 46
          }, 1000, function() {
            // After the animation is done, we need to fire it again
            // because while scrolling through the page, some new items
            // might have been rendered so the offset() became outdated.
            $('html, body').animate({
              scrollTop: $($section).offset().top + 2 - 46
            }, 500);
          });
        });
      });
    });
  }
};





})(jQuery);