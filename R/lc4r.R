#' Create an interactive chart based on LightningChart JS.
#'
#' In RStudio, this chart can be seen and interacted with in the **Viewer** tab.
#'
#' LightningChart JS is a hardware accelerated high-performance data visualization library
#' that allows visualizing much larger quantities of data than the built-in R data visualization tools.
#'
#' \code{lcjs4r} is an open source project. Anyone can suggest improvements or get involved
#' in the \code{GitHub} page [lcjs4r](https://github.com/Arction/lcjs4r).
#'
#' @param components    A single component or \code{list} of components to visualize.
#'                      Define components with [lcSeries()]
#' @param title         Optional title to display at the top of the chart.
#'
#' @import htmlwidgets
#' @export
#' @seealso   [lcSeries()]
lc4r <- function(
  components,
  title = NULL
) {
  args <- list()
  args$components <- components
  args$title <- title

  # create widget
  htmlwidgets::createWidget(
    name = 'lc4r',
    package = 'lc4r',
    args
  )
}

#' Shiny bindings for lc4r
#'
#' Output and render functions for using lc4r within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a lc4r
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name lc4r-shiny
#'
#' @export
lc4rOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'lc4r', width, height, package = 'lc4r')
}

#' @rdname lc4r-shiny
#' @export
renderlc4r <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, lc4rOutput, env, quoted = TRUE)
}
