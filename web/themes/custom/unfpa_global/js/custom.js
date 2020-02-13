//function to click on nav button and show side navigation on mobile
(function ($) {

  var flag = false;
  $(window).on("load resize", function (e) {
    if (flag === false) {
      $('#toggle-nav').click(function (ev) {
        $(this).toggleClass('open');
        $('.main-header').toggleClass('toggled');
        if ($(this).hasClass('open')) {
          $('.main-nav').addClass('open');
          $('html').css('overflow', 'hidden');
        } else {
          $('.main-nav').removeClass('open');
          $('html').css('overflow', 'auto');
        }
        ev.stopPropagation();
      });
      e.stopPropagation();
      flag = true;
    }
    if ($(window).width() > 1090) {
      $('.main-nav').removeClass('visually-hidden mbmenuleft-minus-value').addClass('visually-show mbmenuleft-plus-value');
      $('#toggle-nav').removeClass('open');
      $('.main-nav').removeClass('open');
      $('html').css('overflow', 'auto');
    }
  });

// if li has child ul open dropdown.
  $(".navigation > li").each(function () {
    if ($(this).has("ul").length) {
      $(this).addClass('haschild');
      if ($(this).hasClass("haschild")) {        
        if ($(window).width() > 1090) {          
          $(this).mouseenter(function () {            
            $(this).find('ul.child-menu').addClass('open');
            $(this).addClass('down');
          }).mouseleave(function () {
            $(this).find('ul.child-menu').removeClass('open');
            $(this).removeClass('down');
          });
        }
        $(this).click(function () {
          $(this).toggleClass('expended');
          if ($(this).hasClass('expended')) {
            $(this).addClass('down');
            $(this).children('ul.child-menu').addClass('open').slideDown();
            $(this).siblings().removeClass('expended');
            $(this).siblings().children('ul.child-menu').removeClass('open').slideUp();
          } else {
            $(this).children('ul.child-menu').removeClass('open').slideUp();
            $(this).removeClass('down');
          }
        });
      }
    }
    if ($(this).has("ul").length > 1) {
      $(this).has("ul").addClass('col-4');
    }

  });
  $("li.expanded").each(function () {
    if ($(this).find('ul').length > 1) {
      $(this).find('ul.child-menu').addClass('col-4');
    }
  });
  // function for header search button and field.
  $(".search-button").click(function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $('.main-nav .donate').addClass('slideLeft');
      $('.main-nav .search-box').addClass('active');
    } else {
      $('.main-nav .donate').removeClass('slideLeft');
      $('.main-nav .search-box').removeClass('active');
    }
  });

})(jQuery);