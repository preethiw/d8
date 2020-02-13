/**
 * @file
 * UNFPA Global Annual Report general js logic.
 */
(function ($) {



/**
 * Initialize AR object if it doesn't exist.
 */
Drupal.unfpaGlobalAr = Drupal.unfpaGlobalAr || {};



/**
 * Measures real viewport width.
 *
 * Measuring just document width would return width without scrollbar
 * but we want width including scrollbar so it is consistent with
 * how CSS media querries work.
 *
 * @return viewport width in pixels.
 */
Drupal.unfpaGlobalAr.getViewportWidth = function () {
  var element = window;
  var property = 'innerWidth';

  if (!('innerWidth' in window)) {
    element = document.documentElement || document.body;
    property = 'clientWidth';
  }

  return element[property];
};


/**
 * Device viewport detection.
 * 
 * @return true is viewport is small, false otherwise.
 */
Drupal.unfpaGlobalAr.isWideViewport = function () {
  return (Drupal.unfpaGlobalAr.getViewportWidth() >= 768);
};



/**
 * Device type detection.
 *
 * @return true device is mobile, false otherwise.
 */
Drupal.unfpaGlobalAr.isTouchMobile = function () {
  var mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  var touch = ('ontouchstart' in window) || ('msmaxtouchpoints' in window.navigator);
  
  return (mobile && touch);
};



/**
 * Checks if element is vertically within the viewport.
 *
 * @param el: DOM element to test against.
 *
 * @param delay: Allows to to delay (in pixels) the moment when el becomes
 * treated as visible/invisible in viewport.
 * 
 * @return true if element is visible in viewport, false otherwise.
 *
 * http://stackoverflow.com/a/21627295
 */
Drupal.unfpaGlobalAr.isElementVisible = function (el, delay) {
  var top = el.getBoundingClientRect().top;
  var bottom = el.getBoundingClientRect().bottom;

  // Take into account that this object might be not visible
  // because of parent container overflow hidden.
  var rect;
  el = el.parentNode;

  do {
    rect = el.getBoundingClientRect();
    if (top <= rect.bottom === false) {
      return false;
    }
    el = el.parentNode;
  }
  while (el != document.body);

  // If object is visible in its parent container then return regular calculation.
  return top + delay <= document.documentElement.clientHeight && bottom >= 0 + delay;
};



/**
 * Function for calculating parallax movements.
 * 
 * The x_value is converted to percent and then converted to point on the
 * new scale with range from out_min to out_max.
 * 
 * @param x_min: scale minimal value. If x_value is less, it will be treated as this value.
 *
 * @param x_max: scale maximal value. if x_value is more, it will be treated as this value.
 * 
 * @param x_value: the value to process.
 * 
 * @param out_min: output scale minimal value.
 * 
 * @param out_max: output scale maximal value.
 * 
 * @return point on the new scale with range from out_min to out_max.
 */
Drupal.unfpaGlobalAr.calculateShift = function (x_min, x_max, x_value, out_min, out_max) {
  // If x_min is bigger than x_max then input is invalid so return out_min.
  if (x_min > x_max) {
    return out_min;
  }
  // Process remaining normal calculations.
  if (x_value <= x_min) {
    return out_min;
  }
  else if (x_value >= x_max) {
    return out_max;
  }
  else {
    var fraction = (x_value - x_min) / (x_max - x_min);
    return (out_max - out_min) * fraction + out_min;
  }
};



/**
 * Social sites sharing popup.
 */
Drupal.unfpaGlobalAr.sharePopup = function (url) {
  // Setup popup window.
  var width = 600;
  var height = 600;

  var opts =
    'width=' + width + ',height=' + height +
    ',toolbars=0,scrollbars=1,resizable=1';

  // Open popup window.
  window.open(url, Drupal.t('Sharing'), opts);
};



/**
 * Equal height.
 */
Drupal.unfpaGlobalAr.equalHeight = function ($items) {
  if ($items.length < 2) {
    return;
  }

  // First reset whatever might have been previously set.
  $items.css({'min-height': 0});

  // Work out equal height.
  var top_height = 0;
  $items.each(function () {
    var current_height = $(this).height();
    if (top_height < current_height) {
      top_height = current_height;
    }
  });
  $items.css({'min-height': top_height});
};



/**
 * Init.
 */
Drupal.behaviors.unfpaGlobalArInit = {
  attach: function (context, settings) {
    $('.ar17', context).once('unfpaGlobalArInit').each(function() {
      // Remove target _blank attribute from share links and replace
      // the value of href so these links use only their onclick attribute.
      $('.ar-share a').each(function () {
        var $lnk = $(this);
        $lnk.attr({'target': '', 'href': 'javascript:;'});
      });
    });
  }
};



})(jQuery);
