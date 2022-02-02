library(lc4r)
library(RColorBrewer)

print(
  lc4r(lcSeries(
    type = 'surface',
    heightmap = volcano,
    palette = heat.colors(10),
    wireframe = TRUE
  ), title = 'Volcano surface')
)
