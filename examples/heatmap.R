library(lc4r)
library(RColorBrewer)

print(
  lc4r(lcSeries(
    type = 'heatmap',
    intensity = volcano,
    palette = heat.colors(10)
  ))
)
