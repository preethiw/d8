<?php

namespace Drupal\migrate_plus\Plugin\migrate\destination;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\Database;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\migrate\Event\ImportAwareInterface;
use Drupal\migrate\Event\MigrateImportEvent;
use Drupal\migrate\MigrateException;
use Drupal\migrate\MigrateSkipProcessException;
use Drupal\migrate\Plugin\migrate\destination\DestinationBase;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides table destination plugin.
 *
 * Use this plugin for a table not registered with Drupal Schema API.
 *
 * @MigrateDestination(
 *   id = "table"
 * )
 */
class Table extends DestinationBase implements ContainerFactoryPluginInterface, ImportAwareInterface {

  /**
   * The name of the destination table.
   *
   * @var string
   */
  protected $tableName;

  /**
   * IDMap compatible array of id fields.
   *
   * @var array
   */
  protected $idFields;

  /**
   * Array of fields present on the destination table.
   *
   * @var array
   */
  protected $fields;

  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $dbConnection;

  /**
   * Maximum number of rows to insert in one query.
   *
   * @var int
   */
  protected $batchSize;

  /**
   * The query object being built row-by-row.
   *
   * @var array
   */
  protected $rowsToInsert = [];

  /**
   * The highest ID seen or created so far on this table.
   *
   * @var int
   */
  protected $lastId = 0;

  /**
   * Constructs a new Table.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\migrate\Plugin\MigrationInterface $migration
   *   The migration.
   * @param \Drupal\Core\Database\Connection $connection
   *   The database connection.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration, Connection $connection) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $migration);
    $this->dbConnection = $connection;
    $this->tableName = $configuration['table_name'];
    $this->idFields = $configuration['id_fields'];
    $this->fields = isset($configuration['fields']) ? $configuration['fields'] : [];
    $this->batchSize = isset($configuration['batch_size']) ? $configuration['batch_size'] : 1;
    $this->supportsRollback = TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {
    $db_key = !empty($configuration['database_key']) ? $configuration['database_key'] : NULL;
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $migration,
      Database::getConnection('default', $db_key)
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    if (empty($this->idFields)) {
      throw new MigrateException('Id fields are required for a table destination');
    }
    return $this->idFields;
  }

  /**
   * {@inheritdoc}
   */
  public function fields(MigrationInterface $migration = NULL) {
    return $this->fields;
  }

  /**
   * {@inheritdoc}
   */
  public function import(Row $row, array $old_destination_id_values = []) {
    // Skip batching (if configured) for updates.
    $batch_inserts = ($this->batchSize > 1 && empty($old_destination_id_values));
    $ids = [];
    foreach ($this->idFields as $field => $fieldInfo) {
      if ($row->hasDestinationProperty($field)) {
        $ids[$field] = $row->getDestinationProperty($field);
      }
      elseif (!$row->hasDestinationProperty($field) && empty($fieldInfo['use_auto_increment'])) {
        throw new MigrateSkipProcessException('All the id fields are required for a table migration.');
      }
      // When batching, we do the auto-incrementing ourselves.
      elseif ($batch_inserts && $fieldInfo['use_auto_increment']) {
        if (count($this->rowsToInsert) === 0) {
          // Get the highest existing ID, so we will create IDs above it.
          $this->lastId = $this->dbConnection->query("SELECT MAX($field) AS MaxId FROM {{$this->tableName}}")
            ->fetchField();
          if (!$this->lastId) {
            $this->lastId = 0;
          }
        }
        $id = ++$this->lastId;
        $ids[$field] = $id;
        $row->setDestinationProperty($field, $id);
      }
    }

    // When batching, make sure we have the same properties in the same order
    // every time.
    $values = [];
    if ($batch_inserts) {
      $destination_properties = array_keys($this->migration->getProcess());
      $destination_properties = array_merge($destination_properties,
        array_keys($this->idFields));
      sort($destination_properties);
      $destination_values = $row->getDestination();
      foreach ($destination_properties as $property_name) {
        $values[$property_name] = $destination_values[$property_name] ?? NULL;
      }
    }
    else {
      $values = $row->getDestination();
    }

    if ($this->fields) {
      $values = array_intersect_key($values, $this->fields);
    }

    if ($batch_inserts) {
      $this->rowsToInsert[] = $values;
      if (count($this->rowsToInsert) >= $this->batchSize) {
        $this->flushInserts();
      }
      $status = TRUE;
    }
    // Row contains empty id field with use_auto_increment enabled.
    elseif (count($ids) < count($this->idFields)) {
      $status = $id = $this->dbConnection->insert($this->tableName)
        ->fields($values)
        ->execute();
      foreach ($this->idFields as $field => $fieldInfo) {
        if (isset($fieldInfo['use_auto_increment']) && $fieldInfo['use_auto_increment'] === TRUE && !$row->hasDestinationProperty($field)) {
          $row->setDestinationProperty($field, $id);
          $ids[$field] = $id;
        }
      }
    }
    else {
      $status = $this->dbConnection->merge($this->tableName)
        ->keys($ids)
        ->fields($values)
        ->execute();
    }
    return $status ? $ids : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function rollback(array $destination_identifier) {
    $delete = $this->dbConnection->delete($this->tableName);
    foreach ($destination_identifier as $field => $value) {
      $delete->condition($field, $value);
    }
    $delete->execute();
  }

  /**
   * Execute the insert query and reset everything.
   */
  public function flushInserts() {
    if (count($this->rowsToInsert) > 0) {
      $batch_query = $this->dbConnection->insert($this->tableName)
        ->fields(array_keys($this->rowsToInsert[0]));
      foreach ($this->rowsToInsert as $row) {
        $batch_query->values(array_values($row));
      }
      // Empty the queue first, so if the statement throws an error we don't
      // end up here trying to execute the same statement (plus one row).
      $this->rowsToInsert = [];
      $batch_query->execute();
    }
  }

  /**
   * {@inheritDoc}
   */
  public function preImport(MigrateImportEvent $event) {
  }

  /**
   * {@inheritDoc}
   */
  public function postImport(MigrateImportEvent $event) {
    // At the conclusion of a given migration, make sure batched inserts go in.
    $this->flushInserts();
  }

  /**
   * Make absolutely sure batched inserts are processed (especially for stubs).
   */
  public function __destruct() {
    // At the conclusion of a given migration, make sure batched inserts go in.
    $this->flushInserts();
  }

}
