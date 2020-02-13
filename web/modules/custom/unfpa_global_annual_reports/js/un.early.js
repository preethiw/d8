/**
 * @file
 * Contains some stuff that must run before all other our scripts.
 * 
 * This is needed to ensure compatibility with older mobile devices
 * that have lower javascript performance.
 */
(function ($) {


/**
 * Initialize Drupal.un object if it doesn't exist.
 */
Drupal.un = Drupal.un || {};


/**
 * Device type detection.
 */
Drupal.un.deviceCheck = {
  init: function() {
    window.isMobile = this.isMobile();
    window.isIpad = this.isIpad();
    window.isDesktop = this.isDesktop();
  },

  isMobile: function() {
    return (jQuery.browser.mobile ? true : false);
  },
  isIpad: function() {
   return (navigator.userAgent.match(/iPad/i) != null);
  },
  isDesktop: function() {
    return (jQuery.browser.mobile || Drupal.un.deviceCheck.isIpad() ? false : true);
  },
  is768plus: function() {
    return ($(window).width() > 768);
  },
  backgroundSize: function() {
    return (Modernizr.backgroundsize ? true : false);
  }
};


/**
 * Call device detection right away.
 */
Drupal.un.deviceCheck.init();


/**
 * Document ready.
 */
$(document).ready(function() {
  // For 'mobile' views all sections must be visible as they scroll normally
  // and without the fade effect. Also the fixed positioned fading backgrounds
  // must be hidden as in this case we are using backgrounds attached in sections.
  if (!Drupal.un.deviceCheck.is768plus()) {
    $('.rp-section').css({'opacity': 1});
    $('.rp > .bg').css({'opacity': 0});
    $('section .bg').show(0);
  }
});


})(jQuery);
