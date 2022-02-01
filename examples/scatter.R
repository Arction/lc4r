library(lc4r)

print(
  lc4r(
    lcSeries(
      type='scatter',
      x = diamonds$carat,
      axis_x = 'Carat',
      y = diamonds$price,
      axis_y = 'Price (€)',
      point_size = 2.0,
    )
  )
)
