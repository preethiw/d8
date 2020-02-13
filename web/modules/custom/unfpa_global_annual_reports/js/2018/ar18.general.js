/**
 * @file
 * UNFPA Global Annual Report 2018 general js logic.
 */
(function ($) {



/**
 * Initialize Ar18 object if it doesn't exist.
 */
Drupal.unfpaGlobalAr18 = Drupal.unfpaGlobalAr18 || {};



/**
 * Measures real viewport width.
 *
 * Measuring just document width would return width without scrollbar
 * but we want width including scrollbar so it is consistent with
 * how CSS media querries work.
 *
 * @return
 *   Viewport width in pixels.
 */
Drupal.unfpaGlobalAr18.getViewportWidth = function () {
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
 * @return
 *   True is viewport is wide, false otherwise.
 */
Drupal.unfpaGlobalAr18.isWideViewport = function () {
  return (Drupal.unfpaGlobalAr18.getViewportWidth() >= 768);
};



/**
 * Device type detection.
 *
 * @return boolean
 *   True if device is touch mobile, false otherwise.
 */
Drupal.unfpaGlobalAr18.isTouchDevice = function () {
  var touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  var mq = function (query) {
    return window.matchMedia(query).matches;
  };

  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');

  if (!touch) {
    touch = mq(query);
  }

  return (Drupal.unfpaGlobalAr18.getViewportWidth() < 1500 && touch);
};



/**
 * Checks if element is vertically within the viewport.
 *
 * See http://stackoverflow.com/a/21627295.
 *
 * @param el
 *   DOM element to test against.
 * @param delay
 *   Allows to to delay (in pixels) the moment when el becomes
 *   treated as visible/invisible in viewport.
 *
 * @return boolean
 *   True if element is visible in viewport, false otherwise.
 */
Drupal.unfpaGlobalAr18.isElementVisible = function (el, delay) {
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
  } while (el != document.body);

  // If object is visible in its parent container then return regular calculation.
  return top + delay <= document.documentElement.clientHeight && bottom >= 0 + delay;
};



/**
 * Function for calculating parallax movements.
 *
 * The x_value is converted to percent and then converted to point on the
 * new scale with range from out_min to out_max.
 *
 * @param x_min
 *   Scale minimal value. If x_value is less, it will be treated as this value.
 * @param x_max
 *   Scale maximal value. if x_value is more, it will be treated as this value.
 * @param x_value
 *   The value to process.
 * @param out_min
 *   Output scale minimal value.
 * @param out_max
 *   Output scale maximal value.
 *
 * @return float
 *   Point on the new scale with range from out_min to out_max.
 */
Drupal.unfpaGlobalAr18.calculateShift = function (x_min, x_max, x_value, out_min, out_max) {
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
 * Sets equal height for provided jquery items.
 *
 * @param $items object
 *   jQuery object containing items to select equal height for.
 */
Drupal.unfpaGlobalAr18.equalHeight = function ($items) {
  if ($items.length < 2) {
    return;
  }

  // First reset whatever might have been previously set.
  $items.css({'min-height': 0});

  // Get top height.
  var top_height = 0;
  $items.each(function () {
    var current_height = $(this).height();
    if (top_height < current_height) {
      top_height = current_height;
    }
  });

  // Set new min height.
  $items.css({'min-height': top_height});
};



/**
 * Scrolls to an element within the page.
 *
 * @param selector string
 *   HTML class or id of element to which the page should scroll to.
 * @param offset int
 *   Additional offset from the element to which the page should scroll to.
 * @param speed int
 *   Speed at which to scroll to.
 */
Drupal.unfpaGlobalAr18.scrollTo = function (selector, offset, speed) {
  // By default scrolling to top of page.
  var scroll_to = 0;

  // If id is provided then scroll to provided element instead.
  if (selector) {
    var $element = $(selector);

    // Don't scroll if no element.
    if ($element.length == 0) {
      return;
    }

    scroll_to = $element.offset().top + 1;
  }

  // Optional offset.
  offset = (typeof offset !== 'undefined') ? offset : 0;
  scroll_to = scroll_to + offset;

  // Optional speed.
  speed = (typeof speed !== 'undefined') ? speed : 500;

  $('html, body').stop().animate({
    scrollTop: scroll_to
  }, speed, 'easeInOutQuad');
};



})(jQuery);
