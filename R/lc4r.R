#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
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
