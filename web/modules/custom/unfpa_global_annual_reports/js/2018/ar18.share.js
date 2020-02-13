/**
 * @file
 * UNFPA Global Annual Report 2018 social sharing js logic.
 */
(function ($) {



/**
 * Share Link behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18ShareLink = {
  attach: function (context, settings) {
    $('.ar18-sharelink a', context).once('unfpaGlobalAr18ShareLink').each(function() {
      var $link = $(this);

      $link.click(function (event) {
        // Get modal.
        var $modal = $('.ar18-sharemodal').eq(0);
        var $modal_img = $modal.find('.ar18-sharemodal-image img');
        var $modal_description = $modal.find('.ar18-sharemodal-description');
        var $modal_facebook = $modal.find('.ar18-sharemodal-button.facebook');
        var $modal_twitter = $modal.find('.ar18-sharemodal-button.twitter');

        // Get details from share link.
        var share_url_fb = $link.data('url-fb');
        var share_url_tw = $link.data('url-tw');
        var share_img = $link.data('img');
        var share_description = $link.find('.ar18-sharelink-description').text();

        // Apply details to modal.
        $modal_img.attr('src', share_img);
        $modal_description.html(share_description);
        $modal_facebook.attr('href', share_url_fb);
        $modal_twitter.attr('href', share_url_tw);

        // Show the modal.
        $modal.addClass('ar18-sharemodal-shown');
      });
    });
  }
};



/**
 * Share Modal behaviour.
 */
Drupal.behaviors.unfpaGlobalAr18ShareModal = {
  attach: function (context, settings) {
    $('.ar18-sharemodal', context).once('unfpaGlobalAr18ShareModal').each(function() {
      var $modal = $(this);
      var $close = $modal.find('.ar18-sharemodal-close, .ar18-sharemodal-bg');
      var $share_button = $modal.find('.ar18-sharemodal-button');

      // Closing of modal.
      $close.click(function (event) {
        $modal.removeClass('ar18-sharemodal-shown');
      });

      // Opening share popup.
      $share_button.click(function (event) {
        event.preventDefault();

        var url = $(this).attr('href');

        // Setup popup options.
        var options = 'width=600,height=600,toolbars=0,scrollbars=1,resizable=1';

        // Open popup window.
        window.open(url, Drupal.t('Sharing'), options);
      });
    });
  }
};




})(jQuery);
