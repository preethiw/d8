# www.unfpa.org/

#### The page describes how to setup local development environment for UNFPA.

# Composer
## Usage

First you need to [install composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos).

> Note: The instructions below refer to the [global composer installation](https://getcomposer.org/doc/00-intro.md#globally).
You might need to replace `composer` with `php composer.phar` (or similar) 
for your setup. It is a good practice to add composer to your path settings.

### Folder structure

Run `composer install`.

When installing the given `composer.json` some tasks are taken care of:

* Drupal will be installed in the `web`-directory.
* Autoloader is implemented to use the generated composer autoloader in `vendor/autoload.php`,
  instead of the one provided by Drupal (`web/vendor/autoload.php`).
* Modules (packages of type `drupal-module`) will be placed in `web/modules/contrib/`
* Theme (packages of type `drupal-theme`) will be placed in `web/themes/contrib/`
* Profiles (packages of type `drupal-profile`) will be placed in `web/profiles/contrib/`
* Created default writable versions of `settings.php` and `services.yml`.
* Created `web/sites/default/files`-directory.
* Latest version of drush is installed locally for use at `vendor/bin/drush`.
* Latest version of DrupalConsole is installed locally for use at `vendor/bin/drupal`.

### Updating Drupal Core

This project will attempt to keep all of your Drupal Core files up-to-date; the 
project [drupal-composer/drupal-scaffold](https://github.com/drupal-composer/drupal-scaffold) 
is used to ensure that your scaffold files are updated every time drupal/core is 
updated. If you customize any of the "scaffolding" files (commonly .htaccess), 
you may need to merge conflicts if any of your modified files are updated in a 
new release of Drupal core.

Follow the steps below to update your core files.

1. Run `composer update drupal/core --with-dependencies` to update Drupal Core and its dependencies.
1. Run `git diff` to determine if any of the scaffolding files have changed.   
1. Commit everything all together in a single commit, so `web` will remain in
   sync with the `core` when checking out branches or running `git bisect`.
1. In the event that there are non-trivial conflicts in step 2, you may wish 
   to perform these steps on a branch, and use `git merge` to combine the 
   updated core files with your customized files. This facilitates the use 
   of a [three-way merge tool such as kdiff3](http://www.gitshah.com/2010/12/how-to-setup-kdiff-as-diff-tool-for-git.html). This setup is not necessary if your changes are simple; 
   keeping all of your modifications at the beginning or end of the file is a 
   good strategy to keep merges easy.


### Installing a Module

The module needs to be installed with composer

Example: `composer require drupal/media_entity`


### Configuration Export/Import

The configuration should be exported using the following commands:

Example: `drush cex`

The configuration can be imported using the following command:

Example: `drupal cim`


#### Pre-requisites:
1. You should have an account on https://github.com/
3. Administrator should add you to the project - `https://github.com/UNFPAHQ/global-unfpa.git`
4. [Git](https://git-scm.com/) and [composer](https://getcomposer.org/doc/00-intro.md#installation-linux-unix-macos) installed (described above)

#### Access Repository
1. Run GitBash

2. Go to any folder where you would like to clone the UNFPA.org project repository
  ```
    cd /d/projects
  ```

3. Create a folder called `unfpa` and change directory to this folder
  ```
    mkdir unfpa
    cd unfpa
  ```

4. Clone the repository
  ```
    git clone https://github.com/UNFPAHQ/global-unfpa.git
  ```

5. You will be prompted to enter your github username and password.

6. Repository is cloned. 

7. Run Composer install
  ```
    composer install
  ```

8. Run drush's site-install command
  ```
    drush site-install minimal -y --db-url=mysql://user:pass@localhost/databasename --account-pass=admin --existing-config
  ```

9. Get a one time login password for admin.
  ```
    drush uli admin (should give you a one time login link for admin
  ```
