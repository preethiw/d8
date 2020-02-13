/**
 * @file
 * Contains some stuff used by Google Charts used in Region Expenses subsection.
 */
(function ($) {


  /**
   * Initialize Drupal.un object and Drupal.un.chart if they are not already initialized.
   */
  Drupal.un = Drupal.un || {};
  Drupal.un.gchart = Drupal.un.gchart || {};


  /**
   * Drupal.un.gchart.timers for storing js timeouts.
   */
  Drupal.un.gchart.timers = Drupal.un.gchart.timers || {};


  /**
   * Store functions that need to be called on load and on window resize.
   * Each region defines it's own function that is saved into this variable.
   * These functions are pushed into here by inline js.
   * Later on they are called on window load and on window resize.
   */
  Drupal.un.gchart.functions = [];
  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [31.5, 14.5], //non-core, core
      [1.2, 4.1],
      [16.8, 5.2],
      [3.6, 5.3],
      [0.1, 1.1]
    ];
    var html_id = 'arab-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [46, 5.3, 22, 8.9, 1.2];
    var html_id = 'arab-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });

  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [20.3, 42.5], //non-core, core
      [2.3, 11.4],
      [7.5, 12.4],
      [39.1, 23.3],
      [0, 1.4]
    ];
    var html_id = 'asia-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [62.8, 13.7, 19.9, 62.4, 1.4];
    var html_id = 'asia-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });


  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [78.6, 49], //non-core, core
      [7.7, 5.7],
      [13.4, 6.6],
      [6.4, 14.7],
      [0, 1.1]
    ];
    var html_id = 'africa-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [127.6, 13.4, 20, 21.1, 1.1];
    var html_id = 'africa-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });

  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [5.7, 5.8], //non-core, core
      [.4, 2.1],
      [2.6, 2.4],
      [1.7, 4.6],
      [0, 2.7]
    ];
    var html_id = 'europe-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [11.5, 2.5, 5, 6.3, 2.7];
    var html_id = 'europe-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });

  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [11.9, 13.1], //non-core, core
      [3.8, 7.5],
      [4, 3.9],
      [2, 6.8],
      [0, 2]
    ];
    var html_id = 'latin-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [25, 11.3, 7.9, 8.8, 2];
    var html_id = 'latin-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });

  Drupal.un.gchart.functions.push(function () {
    //Chart 1 - Bars
    var values = [
      [73.2, 31.5], //non-core, core
      [5.8, 7.1],
      [6.1, 5.3],
      [8.8, 16.3],
      [1.2, 2.8]
    ];
    var html_id = 'westafrica-chart1';
    Drupal.un.gchart.renderBar(values, html_id);

    //Chart 2 - Doughnut
    var values = [104.7, 12.9, 11.4, 25.1, 4];
    var html_id = 'westafrica-chart2';
    Drupal.un.gchart.renderDoughnut(values, html_id);
  });


  /**
   * Call all registered chart functions.
   */
  $(window).on('load', function () {
    // Define logic to call all registered functions.
    var callRegisteredChartFunctions = function () {
      for (var i = 0, I = Drupal.un.gchart.functions.length; i < I; i++) {
        Drupal.un.gchart.functions[i].call();
      }
    };

    // Call all functions on load.
    callRegisteredChartFunctions();

    // Call all functions on window resize.
    $(window).resize(function () {
      clearTimeout(Drupal.un.gchart.timers.all);
      Drupal.un.gchart.timers.all = setTimeout(function () {
        callRegisteredChartFunctions();
      }, 300);
    });
  });



  /**
   * Configuration of translatable chart bars/pieces labels.
   */
  Drupal.un.gchart.labels = [
    Drupal.t('Integrated sexual and reproductive health'),
    Drupal.t('Adolescents'),
    Drupal.t('Gender equality and rights'),
    Drupal.t('Data for development'),
    Drupal.t('Organizational efficiency and effectiveness')
  ];


  /**
   * Renders the Region Expenses bar chart.
   */
  Drupal.un.gchart.renderBar = function (values, html_id) {
    // Prepare 'non-core' and 'core' labels (for tooltips).
    var nc = '<br />&nbsp;<br />' + Drupal.t('From non-core resources') + ': ';
    var fc = '<br />' + Drupal.t('From core resources') + ': ';

    // Build tooltip content.
    var tp = [];
    for (i = 0, I = values.length; i < I; i++) {
      tp[i] =
              '<div class="gvt-content">' +
              Drupal.un.gchart.labels[i] + ': <strong>' +
              Number((values[i][0] + values[i][1]).toFixed(2)) + '</strong>' +
              nc + values[i][0] + fc + values[i][1] +
              '</div>';
    }

    // Build chart data.
    var data = google.visualization.arrayToDataTable([
      ['', '', {role: 'style'}, {type: 'string', role: 'tooltip', 'p': {'html': true}}],

      [Drupal.un.gchart.labels[0], Number((values[0][0] + values[0][1]).toFixed(2)), 'color: #4295d1', tp[0]],
      [Drupal.un.gchart.labels[1], Number((values[1][0] + values[1][1]).toFixed(2)), 'color: #f7941e', tp[1]],
      [Drupal.un.gchart.labels[2], Number((values[2][0] + values[2][1]).toFixed(2)), 'color: #7bcab1', tp[2]],
      [Drupal.un.gchart.labels[3], Number((values[3][0] + values[3][1]).toFixed(2)), 'color: #7e79a9', tp[3]],
      [Drupal.un.gchart.labels[4], Number((values[4][0] + values[4][1]).toFixed(2)), 'color: #c0dc7d', tp[4]]
    ]);

    // Find out what is top value in this chart (use in options).
    var maxval = 0;
    for (var i = 0, I = values.length; i < I; i++) {
      var total = values[i][0] + values[i][1];
      if (maxval < total) {
        maxval = total;
      }
    }

    // Set options.
    var options = {
      backgroundColor: 'none',
      width: '100%',
      height: 240,
      chartArea: {width: '100%', height: '90%'},
      bar: {groupWidth: '70%'},
      legend: {position: 'none'},
      tooltip: {isHtml: true},
      vAxis: {},
      hAxis: {
        textPosition: 'in',
        textStyle: {
          color: '#F7941E',
          bold: true,
          auraColor: 'none',
          fontSize: 12
        },
        gridlines: {
          color: '#bbb',
          count: 5
        },
        minorGridlines: {
          color: '',
          count: 0
        },
        minValue: 0,
        viewWindow: {
          min: 0,
          max: maxval + 1
        }
      }
    };

    // Create chart.
    var chart = new google.visualization.BarChart(document.getElementById(html_id));
    chart.draw(data, options);
  };


  /**
   * Renders the Region Expenses doughnut chart.
   */
  Drupal.un.gchart.renderDoughnut = function (values, html_id) {
    // Build chart data.
    var data = google.visualization.arrayToDataTable([
      ['', ''],
      [Drupal.un.gchart.labels[0], values[0]],
      [Drupal.un.gchart.labels[1], values[1]],
      [Drupal.un.gchart.labels[2], values[2]],
      [Drupal.un.gchart.labels[3], values[3]],
      [Drupal.un.gchart.labels[4], values[4]]
    ]);

    // Set options.
    var options = {
      colors: ['#4295d1', '#f7941e', '#7bcab1', '#7e79a9', '#c0dc7d'],
      backgroundColor: 'none',
      width: '100%',
      height: 240,
      chartArea: {width: '100%', height: '90%'},
      legend: {position: 'none'},
      tooltip: {showColorCode: true, isHtml: true},
      pieHole: 0.52,
      pieSliceTextStyle: {
        fontSize: 11
      }
    };

    // Create chart.
    var chart = new google.visualization.PieChart(document.getElementById(html_id));
    chart.draw(data, options);
  }


})(jQuery);
