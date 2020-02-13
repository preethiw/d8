/**
 * @file
 * Single % value doughnut chart drawing using chart.js library.
 * 
 * This file works in conjunction with un_get_graph_doughnut() PHP function.
 * Rendering chart happens through Drupal.un.chart.render(options).
 * 
 * To render chart, first print the result of un_get_graph_doughnut().
 * Then call Drupal.un.chart.render(options) on it's DOM items.
 * 
 * See Drupal.behaviors.unInitCharts().
 */
(function ($) {


/**
 * Initialize Drupal.un object and Drupal.un.chart if they are not already initialized.
 */
Drupal.un = Drupal.un || {};
Drupal.un.chart = Drupal.un.chart || {};


/**
 * Variables.
 */
Drupal.un.chart.charts = {};
Drupal.un.chart.timers = {};


/**
 * Default options.
 */
Drupal.un.chart.defaults = { 
  size: 160,
  cutout: 52,
  color: '#5889b5',// Value color.
  color2: '#e1e2e3',// "empty" part color.
  click: false,
  link: false
};


/**
 * Chart drawing.
 *
 * Required options: {value, chart_id}.
 */
Drupal.un.chart.render = function(options) {

  var options = $.extend({}, Drupal.un.chart.defaults, options);

  // If no chart then create it.
  if (!Drupal.un.chart.charts[options.chart_id]) {
    var $ch = $('#' + options.chart_id);
    // Set max-width of the container div.
    $ch.css({'max-width': options.size + 'px'});

    // Create canvas.
    var canvas = $('<canvas>', {id: 'Chart-' + options.chart_id, width: options.size, height: options.size});
    $ch.append(canvas);

    // Create chart.
    var animate_rotate = false;
    if (!window.isMobile) {
      animate_rotate = true;
    }
    Drupal.un.chart.charts[options.chart_id] = 
    new Chart($('#Chart-' + options.chart_id).get(0).getContext('2d')).Doughnut(
      [{
        value: options.value,
        label: '1',
        color: options.color
      }, {
        value: 100 - options.value,
        color: options.color2
      }],
      {
        percentageInnerCutout: options.cutout,
        showTooltips: false,
        segmentShowStroke : false,
        responsive: true,
        animateRotate: animate_rotate
      }
    );

    // Create label.
    // Make a label percentage a link if necessary.
    if (options.link || options.click) {
      var perc = $('<a href="' + (options.link ? options.link : 'javascript:;') + 
        '" class="chart-label">' + options.value + '%</a>');
      if (options.click) {
        perc.click(options.click);
      }
    }
    // Or use regular span.
    else {
      var perc = $('<span class="chart-label">' + options.value + '%</span>');
    }

    var label = $('<span ' +
      'id="Chart-' + options.chart_id + '-Label"' +
      'class="chart-label-wrap unt-font">' +
    '</span>');
    label.append(perc);
    
    $ch.append(label);
  }

  // Else if chart exists then update it if options.value was passed.
  // This is only called when dynamically updating chart value.
  else {
    Drupal.un.chart.charts[options.chart_id].segments[0].value = options.value;
    Drupal.un.chart.charts[options.chart_id].update();

    var perc = $('#Chart-' + options.chart_id + '-Label .chart-label');
    perc.html(options.value + '%');
  }

  // Create and position/reposition chart % label.
  Drupal.un.chart.positionLabel(options);
  $(window).resize(function() {
    clearTimeout(Drupal.un.timers[options.chart_id]);
    Drupal.un.timers[options.chart_id] = setTimeout(function() {
      Drupal.un.chart.positionLabel(options);
    }, 200);
  });
};


/**
 * Chart label handling.
 */
Drupal.un.chart.positionLabel = function(options) {
  // Get chart and label.
  var $ch = $('#' + options.chart_id);
  var $lb = $('#Chart-' + options.chart_id + '-Label');

  // Set label size
  var lsize = (options.cutout / 100) * $ch.width() + 2;//+2px to make sure.
  $lb.find('.chart-label').attr('style', 'line-height: ' + (lsize - 1) + 'px');
  $lb.css({'height': lsize + 'px', 'width': lsize + 'px'});

  // Set label position.

  var container = {
    top: $ch.offset().top,
    left: $ch.offset().left,
    height: $ch.height(),
    width: $ch.width()
  };

  // Find position.
  var position = {
    top: container.top + container.height / 2 - (lsize / 2),
    left: container.left + container.width / 2 - (lsize / 2)
  };

  $lb.offset(position);
};


/**
 * Generate random chart id.
 */
Drupal.un.chart.generateId = function(length) {
  var id = 'C';
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    id += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return id;
};


/**
 * Init charts behaviour.
 */
Drupal.behaviors.unInitCharts = {
  attach: function (context, settings) {
    // Default donut colors.
    
    $('.graph-doughnut', context).not('.doughnut-color-2').once('unInitCharts').each(function() {      
      var container = $(this);     
      var color;
        if ($(this).parents().hasClass('africa-east-and-southern')) {
          color = '#ea5b24';
        }
        else if ($(this).parents().hasClass('africa-west-and-central')) {
          color = '#fcc300';
        }
        else if ($(this).parents().hasClass('arab-states')) {
          color = '#73c3db';
        }
        else if ($(this).parents().hasClass('asia-and-the-pacific')) {
          color = '#c7d300';
        }
        else if ($(this).parents().hasClass('eastern-europe-and-central-asia')) {
          color = '#449cd6';
        }
        else if ($(this).parents().hasClass('latin-america-and-the-caribbean')) {
          color = '#eb609f';
        }
        else {
          color = '#5889b5';
        }
      container.attr({'id': Drupal.un.chart.generateId(7)});     
      if (!window.isMobile) {
        var waypoint = new Waypoint({
          element: document.getElementById(container.attr('id')),
          offset: '600px',
          handler: function(direction) {
            Drupal.un.chart.render({
              value: container.data('value'),
              chart_id: container.attr('id'),
              size: container.data('size'),
              color: color
            });
          }
        })
      }
      else {
        Drupal.un.chart.render({
          value: container.data('value'),
          chart_id: container.attr('id'),
          size: container.data('size'),
          color: color
        });
      }
    });

    // Alternative color dougnut.
    $('.graph-doughnut.doughnut-color-2', context).once('unInitCharts').each(function() {      
      var container = $(this);

      container.attr({'id': Drupal.un.chart.generateId(7)});

      if (!window.isMobile) {
        var waypoint = new Waypoint({
          element: document.getElementById(container.attr('id')),
          offset: '600px',
          handler: function(direction) {
            Drupal.un.chart.render({
              value: container.data('value'),
              chart_id: container.attr('id'),
              size: container.data('size'),
              color: '#e9e7d4',
              color2: '#8ec1e8'
            });
          }
        });
      }
      else {
        Drupal.un.chart.render({
          value: container.data('value'),
          chart_id: container.attr('id'),
          size: container.data('size'),
          color: '#e9e7d4',
          color2: '#8ec1e8'
        });
      }
    });
  }
};


})(jQuery);
