/**
 * @file
 * Makes links with 'colorbox-load' class open in colorbox.
 * 
 * Also takes care of passing some parameters from the a href ?param=val
 * into colorbox function.
 * 
 * This code is copied from colorbox module's colorbox_load js file.
 */
(function ($) {


Drupal.behaviors.initColorboxLoad = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $.urlParams = function (url) {
      var p = {},
          e,
          a = /\+/g,// Regex for replacing addition symbol with a space.
          r = /([^&=]+)=?([^&]*)/g,
          d = function (s) { return decodeURIComponent(s.replace(a, ' ')); },
          q = url.split('?');
      while (e = r.exec(q[1])) {
        e[1] = d(e[1]);
        e[2] = d(e[2]);
        switch (e[2].toLowerCase()) {
          case 'true':
          case 'yes':
            e[2] = true;
            break;
          case 'false':
          case 'no':
            e[2] = false;
            break;
        }
        if (e[1] == 'width') { e[1] = 'innerWidth'; }
        if (e[1] == 'height') { e[1] = 'innerHeight'; }
        p[e[1]] = e[2];
      }
      return p;
    };
    $('.colorbox-load', context)
      .once('init-colorbox-load', function () {
        var params = $.urlParams($(this).attr('href'));
        var options = {
          title: Drupal.t('Video'),
          overlayClose: false,
          maxWidth: '98%',
          maxHeight: '98%'
        };
        $(this).colorbox($.extend({}, options, params));
      });
  }
};


})(jQuery);
