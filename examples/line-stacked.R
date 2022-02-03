library(lc4r)

# Two line charts with same X axis
# indicated by same value of 'axis_x'

print(
  lc4r(list(
    lcSeries(
      type = 'line',
      y = rnorm(1000),
      axis_x = 'sample'
    ),
    lcSeries(
      type = 'line',
      y = rnorm(1000, 2, 0.2),
      axis_x = 'sample'
    )
  ))
)
