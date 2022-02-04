library(lc4r)

countries_population <- subset(population, year==2013)
countries_population <- countries_population[,c('country', 'population')]
names(countries_population) <- NULL

print(
  lc4r(
    lcSeries(
      type = 'map',
      map_view = 'Europe',
      map_data = countries_population,
      palette = list('#ffffff', '#ffff00', '#ff0000')
    ),
    title = 'Europe countries population colored'
  )
)
