library(lc4r)

library(tidyverse) # <-- required for pipe function (?)
library(gapminder)
data <- gapminder %>% filter(year=="2007") %>% dplyr::select(-year)

print(
  lc4r(
    lcSeries(
      type='scatter',
      x = data$gdpPercap,
      y = data$lifeExp,
      point_size = pmax(data$pop/20000000, 3),
      point_color = 'rgba(255, 0, 0, 0.5)'
    )
  )
)
