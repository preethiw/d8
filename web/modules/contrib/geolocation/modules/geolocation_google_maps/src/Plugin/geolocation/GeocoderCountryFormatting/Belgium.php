<?php

namespace Drupal\geolocation_google_maps\Plugin\geolocation\GeocoderCountryFormatting;

use Drupal\geolocation_google_maps\GoogleCountryFormattingBase;

/**
 * Provides address formatting.
 *
 * @GeocoderCountryFormatting(
 *   id = "google_be",
 *   country_code = "be",
 *   geocoder = "google_geocoding_api",
 * )
 */
class Belgium extends GoogleCountryFormattingBase {

  /**
   * {@inheritdoc}
   */
  public function format(array $atomics) {
    $address_elements = parent::format($atomics);
    if (
      $atomics['streetNumber']
      && $atomics['route']
    ) {
      $address_elements['addressLine1'] = $atomics['route'] . ' ' . $atomics['streetNumber'];
    }

    return $address_elements;
  }

}
