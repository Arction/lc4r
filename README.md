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
