#!/bin/bash

# ---------------------------------------------------------------------------- #
#
# Apply / review the coding standard fixes.
#
# ---------------------------------------------------------------------------- #

FIX_MODE=1
STD="Drupal"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TRAVIS_BUILD_DIR=$(realpath "$SCRIPT_DIR/../../")
REVIEW_STANDARD="$STD"
IGNORED_PATTERNS="*.features.inc,*.features.*.inc,*.field_group.inc,*.strongarm.inc,*.ds.inc,*.context.inc,*.pages.inc,*.pages_default.inc,*.views_default.inc,*.file_default_displays.inc,*.facetapi_defaults.inc,*.panels_default.inc"

##
# Function to run the actual code review
#
# This function takes 2 params:
# @param string $1
#   The file path to the directory or file to check.
# @param string $2
#   The ignore pattern(s).
##
code_review () {
  CMD="phpcs"
  if [[ "${FIX_MODE}" -eq 1 ]]; then
    CMD="phpcbf"
  fi

  echo "${LWHITE}$1${RESTORE}"

  if ! "$CMD" --standard="$SCRIPT_DIR"/"$REVIEW_STANDARD"/ruleset.xml -p --colors --extensions=php,module,inc,install,test,profile,theme --ignore="$2" "$1"; then
    HAS_ERRORS=1
  fi
}

cd "$TRAVIS_BUILD_DIR" || exit 1
if [[ "${FIX_MODE}" -eq 1 ]]; then
  echo "${LBLUE}> Correcting Modules and Themes to follow the '${REVIEW_STANDARD}' standard. ${RESTORE}"
else
  echo "${LBLUE}> Sniffing Modules following '${REVIEW_STANDARD}' standard. ${RESTORE}"
fi
if [[ -d web/themes/custom ]]; then
  for dir in web/themes/custom/* ; do
    code_review "$dir" "$IGNORED_PATTERNS"
  done
fi
if [[ -d web/modules/custom ]]; then
  for dir in web/modules/custom/* ; do
    code_review "$dir" "$IGNORED_PATTERNS"
  done
fi

exit $HAS_ERRORS
