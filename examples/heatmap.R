library(lc4r)

print(
  lc4r(lcSeries(
    type = 'heatmap',
    intensity = volcano,
    palette = heat.colors(10)
  ))
)
