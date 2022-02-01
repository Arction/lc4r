# Status

**This R package is currently in early stages of drafting**.

We are actively testing how different LightningChart JS features fit in the R ecosystem.

The package can be freely used or even customized. Feel free to create issues and pull requests if you have improvement suggestions.

Please note that LightningChart JS is not allowed to be used commercially without [purchasing a license](https://www.arction.com/lightningchart-js-pricing/).

# Features

**Scatter charts**

- Fully interactive (zooming, panning, data cursor)
- Up to **75 million** (75 000 000) data points
- `circle`, `square` and `triangle` markers
- Supports individual point sizes and transparent points

![Interactive R Scatter Chart](./screenshots/scatter.jpeg)

![Interactive R Bubble Chart](./screenshots/bubble.jpeg)

**Heatmap charts**

- Fully interactive (zooming, panning, data cursor)
- Up to **1.2 billion** (1 200 000 000) data points
- Supports R color palettes (native, `RColorBrewer`, `Viridis`)
- Automatic bilinear color interpolation based on adjacent cell values

![Interactive R Heatmap Chart](./screenshots/heatmap.jpeg)

## LightningChart JS

LightningChart JS is the proven performance leader in the field of JavaScript data visualization. We are changing the capabilities of web data visualization by providing **high-performance charts with real-time capabilities and optimized CPU usage**.

You can learn more about the product on our web site [lightningchart.com](https://www.arction.com/lightningchart-js/).

To see our charts in action, you can check our [Interactive Examples gallery](https://www.arction.com/lightningchart-js-interactive-examples/). This can give you an idea of the different use cases for LightningCharts.

## LightningChart for R

Write here about features of the `lcjs4r` package.

# Installation and usage

The latest version of `lcjs4r` can be installed via R `devtools`.

If you don't have `devtools` installed, do that with the following command in R console:

```r
install.packages("devtools")
```

Install the latest `lcjs4r` version with following R console command:

```r
devtools::install_github("Arction/lcjs4r")
```

# Usage

**Example, scatter chart**

```r
library(lc4r)

lc4r(
    lcSeries(x = scatter_data$x0, y = scatter_data$y0),
)
```

**Example, multiple series in same chart**

```r
library(lc4r)

lc4r(list(
    lcSeries(x = scatter_data$x0, y = scatter_data$y0),
    lcSeries(x = scatter_data$x0, y = scatter_data$y0)
))
```

# Contributing

Write here some instructions how the package can be developed, forked and contributed.
