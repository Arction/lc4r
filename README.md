# Status

**This R package is currently in early stages of drafting**.

We are actively testing how different LightningChart JS features fit in the R ecosystem.

The package can be freely used or even customized. Feel free to create issues and pull requests if you have improvement suggestions.

Please note that LightningChart JS is not allowed to be used commercially without [purchasing a license](https://www.arction.com/lightningchart-js-pricing/).

# Features

Write here about features of the `lcjs4r` package.

# About LightningChart JS

LightningChart JS is the proven performance leader in the field of JavaScript data visualization. We are changing the capabilities of web data visualization by providing **high-performance charts with real-time capabilities and optimized CPU usage**.

You can learn more about the product on our web site [lightningchart.com](https://www.arction.com/lightningchart-js/).

To see our charts in action, you can check our [Interactive Examples gallery](https://www.arction.com/lightningchart-js-interactive-examples/). This can give you an idea of the different use cases for LightningCharts.

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
