#' Function that describes a series in LightningChart JS for R.
#'
#' @description {
#' To create a chart, create a single \code{lcSeries} or a \code{list} of several series
#' and supply them to \code{lc4r} function.
#'
#' \code{lc4r(lcSeries( type = 'line', ... ))}
#'
#' All arguments are optional.
#' By combining relevant arguments, different visualizations can be created.
#'
#' }
#'
#' @param type  Select visualization type from preset options:
#'
#' \code{'scatter'}:
#'
#' Visualize set of XY coordinates with markers.
#'
#' Related arguments:
#' - \code{x}
#' - \code{y}
#' - \code{point_size}
#' - \code{point_color}
#' - \code{point_shape}
#'
#' \code{'line'}:
#'
#' Visualize set of XY coordinates with connected lines.
#'
#' X coordinates are optional and can be omitted.
#'
#' Related arguments:
#' - \code{x}
#' - \code{y}
#' - \code{line_thickness}
#' - \code{line_color}
#'
#' \code{'point-line'}:
#'
#' Visualize set of XY coordinates with connected lines AND markers.
#'
#' X coordinates are optional and can be omitted.
#'
#' Related arguments:
#' - \code{x}
#' - \code{y}
#' - \code{point_size}
#' - \code{point_color}
#' - \code{point_shape}
#' - \code{line_thickness}
#' - \code{line_color}
#'
#' \code{'heatmap'}:
#'
#' Visualize a number table as a heatmap (color cells by value).
#'
#' Number table is supplied with \code{intensity} argument (e.g., \code{intensity = volcano}).
#'
#' Color palette is supplied with \code{palette} argument (e.g. \code{palette = heat.colors(10)}).
#' First color is associated with lowest value and last color with highest value.
#'
#' \code{'surface'}:
#'
#' Visualize a number table as a 3D surface (cell value = height).
#'
#' Heightmap is supplied with \code{heightmap} argument (e.g., \code{heightmap = volcano}).
#'
#' Optionally, surface can be dynamically colored by height by supplying color palette (e.g. \code{palette = heat.colors(10)}).
#' First color is associated with lowest value and last color with highest value.
#'
#' \code{'map'}:
#'
#' Visualize a map. Map view is specified with \code{map_view} argument.
#'
#' Map regions can be colored individually by using \code{map_data} and \code{palette} arguments.
#'
#' Other 2D series can be placed above a map by \code{axis_x = 'map'}.
#' This can be used to plot scatter, bubble, line and such graphs using latitude/longitude coordinates.
#'
#' @param x   Specify list of X coordinates for series (table with 1 column and n rows)
#'
#' @param y   Specify list of Y coordinates for series (table with 1 column and n rows)
#'
#' @param axis_x  Specify X axis for series (e.g. \code{'Price'})
#'
#' Several series can be placed on the same X axis by specifying the exact same argument for \code{axis_x}
#'
#' @param axis_y  Specify Y axis for series (e.g. \code{'Price'})
#'
#' Several series can be placed on the same Y axis by specifying the exact same argument for \code{axis_y}
#'
#' @param axis_z  Specify Z axis for series (e.g. \code{'Price'})
#'
#' Z axis is only available when the series \code{type} indicates a 3D series.
#'
#' @param intensity   Specify an intensity data set (2D table of numbers, e.g. \code{intensity = volcano})
#'
#' Used with \code{type = 'heatmap'} series.
#'
#' @param heightmap   Specify a heightmap data set (2D table of numbers, e.g. \code{intensity = volcano})
#'
#' Used with \code{type = 'surface'} series.
#'
#' @param palette   Specify a color palette (e.g. \code{palette = heat.colors(10)})
#'
#' Used with \code{type = 'heatmap'} or \code{type = 'surface'} series.
#'
#' @param point_size  Specify size of point markers as pixels.
#'
#' Alternatively, a data set can be provided, in which case each point can have a different size.
#' e.g. \code{point_size = my_dataset$sizes}
#'
#' @param point_color Specify color of point markers as hexadecimal code (e.g. \code{'#ff0000'} for red)
#'
#' @param point_shape   Specify shape of point markers from preset options: \code{'circle'}, \code{'square'}, \code{'triangle'}
#'
#' @param line_thickness  Specify thickness of lines as pixels (e.g. \code{line_thickness = 2.0})
#'
#' @param line_color  Specify color of lines as hexadecimal code (e.g. \code{'#ff0000'} for red)
#'
#' @param map_data    Specify map regions data set.
#'
#' This should be a table with 2 columns, where first one contains region ISO_A3 code (e.g. \code{'FIN'}) or name (e.g. \code{'finland'})
#'
#' Second column contains numeric value which can be used for coloring with \code{palette} argument or simply viewed with interactive cursor.
#'
#' @param map_view    Specify map view when using \code{type = 'map'}. Possible options: \code{'World'}, \code{'Europe'}, \code{'Africa'}, \code{'Asia'}, \code{'NorthAmerica'}, \code{'SouthAmerica'}, \code{'Australia'}, \code{'USA'}, \code{'Canada'}
#'
#' @export
#' @seealso   [lc4r()]
lcSeries <- function(
    type = 'scatter',
    x = NULL,
    y = NULL,
    axis_x = NULL,
    axis_y = NULL,
    axis_z = NULL,
    intensity = NULL,
    heightmap = NULL,
    palette = NULL,
    point_size = NULL,
    point_color = NULL,
    point_shape = NULL,
    line_thickness = NULL,
    line_color = NULL,
    map_data = NULL,
    map_view = NULL
) {
  series <- list()
  series$id_ <- 'series'
  series$type <- type
  series$x <- x
  series$y <- y
  series$axis_x <- axis_x
  series$axis_y <- axis_y
  series$axis_z <- axis_z
  series$intensity <- intensity
  series$heightmap <- heightmap
  series$palette <- palette
  series$point_size <- point_size
  series$point_color <- point_color
  series$point_shape <- point_shape
  series$line_thickness <- line_thickness
  series$line_color <- line_color
  series$map_data <- map_data
  series$map_view <- map_view

  # return series description
  series
}
