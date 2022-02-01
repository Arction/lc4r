#' Describe a lightningchart js series.
#' @export
lcSeries <- function(
    type = 'scatter',
    x = NULL,
    y = NULL,
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
  series$point_size <- point_size
  series$point_color <- point_color
  series$point_shape <- point_shape
  series$line_thickness <- line_thickness
  series$line_color <- line_color

  # return series description
  series
}