library(lc4r)

# Three line graphs along same Y axis
# indicated by same value of 'axis_y'

print(
  lc4r(list(
    lcSeries(
      type = 'line',
      y = rnorm(1000),
      axis_y = 'p'
    ),
    lcSeries(
      type = 'line',
      y = rnorm(1000, 2, 0.2),
      axis_y = 'p'
    ),
    lcSeries(
      type = 'line',
      y = rnorm(1000, 1.5, 0.4),
      axis_y = 'p'
    )
  ))
)
