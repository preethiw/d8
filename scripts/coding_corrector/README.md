## Automatic coding corrector

### Requirements
 - PHP\_CodeSniffer version 3.4.2 (stable) - known compatible version, install it globally https://github.com/squizlabs/PHP_CodeSniffer#composer

Before merging a PR, let's execute from the repository root:
```bash
./scripts/coding_corrector/coding_corrector.sh
```

Then commit and push the resulting changes, as those are only changes to match coding standard rules.
