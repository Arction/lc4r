#' Describe a lightningchart js series.
#' @export
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
    line_color = NULL
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

  # return series description
  series
}