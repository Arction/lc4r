library(lc4r)

print(
  lc4r(list(
    lcSeries(
      type = 'line',
      y = rnorm(1000)
    ),
    lcSeries(
      type = 'line',
      y = rnorm(1000, 2, 0.2)
    ),
    lcSeries(
      type = 'line',
      y = rnorm(1000, 1.5, 0.4)
    )
  ))
)
