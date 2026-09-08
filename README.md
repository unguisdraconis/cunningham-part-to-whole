# Cunningham Part-to-Whole

This archived learning experiment was created as part of Jeremiah King's 2026 [#30DayChartChallenge](https://30daychartchallenge.org/) Cunningham visualization series. The specific challenge day and prompt have not been recovered.

![Historical Cunningham part-to-whole stacked-bar experiment.](src/assets/social-preview.png)

## What the experiment attempted

The project explored whether Cunningham cast relationships could be summarized in a single 100% stacked bar using the 15 most frequent names plus an `Other` category. It used repeated name-work relationships, pointer-displayed percentages, React, D3, and SVG.

## Why it is archived

The visualization was originally described as showing shares of "total performances," but the implementation actually counts name-work memberships across 183 work records. Its continuation-row parser also reads both the `Music` and `Original cast` columns into the same cast-like name pool. That adds 18 music-credit relationships, representing 10 composer strings, to `Other`.

The displayed denominator is therefore 1,392 memberships rather than 1,374 cast-work memberships. The named top-15 counts are unaffected, while `Other` is displayed as 885 instead of the cast-only value of 867. The chart is preserved as a historical visualization-learning artifact, not presented as a defensible current analysis of performance share.

## Data provenance

The source dataset is:

> Clarisse Bardiot. *Merce Cunningham*. Version 1. Zenodo. [doi:10.5281/zenodo.3774548](https://doi.org/10.5281/zenodo.3774548).

The dataset is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

The tracked [`src/data/cunningham.tsv`](src/data/cunningham.tsv) is byte-identical to Zenodo's `donnees-cunningham.csv` (MD5 `2fa9f8a4ab76d5a8c3fe163aa11e1709`). The local extension reflects that the source file is tab-delimited; its contents were not rewritten.

No separate license is currently specified for the application software.

## Series context

The principal project in the Cunningham series is [`cunningham-3d`](https://github.com/unguisdraconis/cunningham-3d). Stronger retained supporting experiments include [`cunningham-marimekko`](https://github.com/unguisdraconis/cunningham-marimekko), [`cunningham-slope`](https://github.com/unguisdraconis/cunningham-slope), and [`cunningham-pictogram`](https://github.com/unguisdraconis/cunningham-pictogram).
