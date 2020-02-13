<?php

namespace Drupal\unfpa_global_annual_reports\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Provides route responses for the Example module.
 */
class AnnualReportController extends ControllerBase {

  /**
   * Annual Report For 2014.
   */
  public function unfpa_global_annual_reports_2014() {

    return [
      '#theme' => 'annual_reports_2014_template',
      '#attached' => [
        'library' => [
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2014',
        ],
      ],
    ];
  }

  /**
   * Annual Report For 2015.
   */
  public function unfpa_global_annual_reports_2015() {

    return [
      '#theme' => 'annual_reports_2015_template',
      '#attached' => [
        'library' => [
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2014',
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2015',
        ],
      ],
    ];
  }

  /**
   * Annual Report For 2016.
   */
  public function unfpa_global_annual_reports_2016() {

    return [
      '#theme' => 'annual_reports_2016_template',
      '#attached' => [
        'library' => [
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2014',
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2016',
        ],
      ],
    ];
  }

  /**
   * Annual Report For 2017.
   */
  public function unfpa_global_annual_reports_2017() {

    return [
      '#theme' => 'annual_reports_2017_template',
      '#attached' => [
        'library' => [
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2017',
        ],
      ],
    ];
  }

  /**
   * Annual Report For 2016.
   */
  public function unfpa_global_annual_reports_2018() {

    return [
      '#theme' => 'annual_reports_2018_template',
      '#attached' => [
        'library' => [
          'unfpa_global_annual_reports/unfpa_global_annual_reports_2018',
        ],
      ],
    ];
  }

}
