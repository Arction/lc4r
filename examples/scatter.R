library(lc4r)
library(ggplot2) # <-- only loaded for the "diamonds" data set

print(
  lc4r(
    lcSeries(
      type='scatter',
      x = diamonds$carat,
      axis_x = 'Carat',
      y = diamonds$price,
      axis_y = 'Price (€)',
      point_size = 2.0
    )
  )
)
