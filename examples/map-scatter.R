library(lc4r)
library(WDI)

literacy_globe <- WDI(country = "all", indicator = "SE.ADT.LITR.ZS", start = 2000, end = 2022, extra = TRUE)

print(
  lc4r(
    list(
      lcSeries(
        type = 'map',
        map_view = 'World'
      ),
      lcSeries(
        type = 'scatter',
        x = literacy_globe$longitude,
        y = literacy_globe$latitude,
        point_size = pmax(literacy_globe$SE.ADT.LITR.ZS / 10, 3),
        axis_x = 'map',
        axis_y = 'map',
      )
    ),
    title = 'World literacy indicators bubble chart'
  )
)
