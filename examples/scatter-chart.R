library(tidyverse)
library(lc4r)

scatter_data <- read_csv('./data-small-scatter.csv')

print(
  lc4r(
    lcSeries(
      type='scatter',
      x = scatter_data$x0,
      y = scatter_data$y0
    )
  )
)
