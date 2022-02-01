HTMLWidgets.widget({
  name: "lc4r",
  type: "output",

  factory: function () {
    const {
      lightningChart,
      PointShape,
      Themes,
      SolidFill,
      emptyLine,
      PalettedFill,
    } = lcjs;

    const chart = lightningChart().ChartXY({
      theme: Themes.lightNew,
    });
    const axisX = chart.getDefaultAxisX();
    const axisY = chart.getDefaultAxisY();

    return {
      renderValue: function (args) {
        let { components, title_chart } = args;

        // #region Args: Chart title
        if (title_chart) {
          chart.setTitle(title_chart);
        } else {
          chart.setTitle("");
        }

        // #endregion

        // #region Args: Components
        if ("id_" in components) {
          // Only 1 component was supplied.
          components = [components];
        } else {
          // Parse list of components.
          components = Array.from(components);
        }

        components.forEach((component) => {
          const { id_ } = component;
          ifTry(id_ === "series", (_) => {
            const {
              type,
              x,
              y,
              axis_x,
              axis_y,
              intensity,
              palette,
              point_size,
              point_color,
              point_shape,
              line_thickness,
              line_color,
            } = component;

            const coordsX = x && parseArrayDataInput(x);
            const coordsY = y && parseArrayDataInput(y);
            let pointSizes = undefined;
            const pointShape =
              point_shape && typeof point_shape === "string"
                ? {
                    square: PointShape.Square,
                    circle: PointShape.Circle,
                    triangle: PointShape.Triangle,
                  }[point_shape.toLowerCase()]
                : PointShape.Circle;

            if (axis_x) {
              axisX.setTitle(axis_x);
            }
            if (axis_y) {
              axisY.setTitle(axis_y);
            }

            let series;
            if (type === "scatter") {
              series = chart.addPointSeries({
                pointShape,
              });
            } else if (type === "line") {
              series = chart.addLineSeries({
                dataPattern: deduceProgressiveOrNot(coordsX, coordsY),
              });
            } else if (type === "point-line") {
              series = chart.addPointLineSeries({
                pointShape,
                dataPattern: deduceProgressiveOrNot(coordsX, coordsY),
              });
            } else if (type === "heatmap") {
              // intensity values must be specified
              if (!intensity) {
                throw new Error("'intensity' not specified");
              }

              const intensityMatrix = Array.from(intensity);
              const columns = intensityMatrix.length;
              const rows = intensityMatrix[0].length;
              series = chart
                .addHeatmapGridSeries({
                  columns,
                  rows,
                  dataOrder: "columns",
                })
                .invalidateIntensityValues(intensityMatrix)
                .setWireframeStyle(emptyLine);

              if (palette) {
                series.setFillStyle(
                  new PalettedFill({
                    lookUpProperty: "value",
                    lut: parsePalette(lcjs, palette, intensityMatrix),
                  })
                );
              }
            }

            ifTry("setMouseInteractions" in series, (_) => {
              series.setMouseInteractions(false);
            });
            ifTry("setCursorInterpolationEnabled" in series, (_) => {
              series.setCursorInterpolationEnabled(false);
            });
            ifTry(
              "setPointSize" in series && typeof point_size === "number",
              (_) => {
                series.setPointSize(point_size);
              }
            );
            ifTry(
              "setIndividualPointSizeEnabled" in series &&
                typeof point_size === "object",
              (_) => {
                pointSizes = Array.from(point_size);
                series.setIndividualPointSizeEnabled(true);
              }
            );
            ifTry("setPointFillStyle" in series && point_color, (_) => {
              series.setPointFillStyle(
                new SolidFill({ color: parseColor(lcjs, point_color) })
              );
            });
            ifTry(
              "setStrokeStyle" in series && typeof line_thickness === "number",
              (_) => {
                series.setStrokeStyle((stroke) =>
                  stroke.setThickness(line_thickness)
                );
              }
            );
            ifTry("setStrokeStyle" in series && line_color, (_) => {
              series.setStrokeStyle((stroke) =>
                stroke.setFillStyle(
                  new SolidFill({ color: parseColor(lcjs, line_color) })
                )
              );
            });

            // #region Construct LCJS data points array and push to series
            const pointsCount = Math.max(
              coordsX ? coordsX.length : 0,
              coordsY ? coordsY.length : 0
            );
            const points = new Array(pointsCount).fill().map((_) => ({}));
            if (coordsX) {
              coordsX.forEach((x, i) => (points[i].x = x));
            } else {
              points.forEach((p, i) => (p.x = i));
            }
            if (coordsY) {
              coordsY.forEach((y, i) => (points[i].y = y));
            } else {
              points.forEach((p, i) => (p.y = i));
            }
            if (pointSizes) {
              pointSizes.forEach((size, i) => (points[i].size = size));
            }
            series.add(points);

            // #endregion
          });
        });

        // #endregion

        axisX.fit(false);
        axisY.fit(false);
      },
      resize: function (width, height) {
        chart.engine.layout();
      },
    };
  },
});

/**
 * Parse array data input.
 *
 * This could be for example a list of Y coordinates for a line plot,
 * or just as well the X coordinates.
 */
function parseArrayDataInput(input) {
  return Array.from(input);
}

/**
 * Deduces whether data is progressive or not.
 */
function deduceProgressiveOrNot(coordsX, coordsY) {
  if (!coordsX) {
    // X coordinates are not defined, data is progressive
    return { pattern: "ProgressiveX" };
  } else {
    // Check if all X coordinates progress in positive direction.
    let prevX = undefined;
    for (const coordX of coordsX) {
      if (coordX < prevX) {
        // Not progressive data.
        return undefined;
      }
      prevX = coordX;
    }
    // Progressive X data.
    return { pattern: "ProgressiveX" };
  }
}

/**
 * Parse input color to LCJS color.
 */
function parseColor(lcjs, colorInput) {
  const { ColorCSS } = lcjs;
  try {
    const color = ColorCSS(colorInput);
    return color;
  } catch (e) {
    // Return error color
    return ColorCSS("black");
  }
}

/**
 * Parse input color palette to LCJS Color lookup table.
 */
function parsePalette(lcjs, paletteInput, valueMatrix) {
  const { LUT, ColorHEX } = lcjs;
  try {
    // Calculate value range (min - max)
    let min = Number.MAX_SAFE_INTEGER;
    let max = -Number.MAX_SAFE_INTEGER;
    for (const vector of valueMatrix) {
      for (const value of vector) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }

    const colors = Array.from(paletteInput);
    return new LUT({
      interpolate: true,
      steps: colors.map((colorStringHex, iStep) => ({
        value: min + (iStep / colors.length) * (max - min),
        color: ColorHEX(colorStringHex),
      })),
    });
  } catch (e) {
    // Return error palette
    return new LUT({});
  }
}

/**
 * Syntax sugar function for checking if some case is true, and then executing a callback that will not throw an error (even if there is an unexpected error !).
 */
function ifTry(condition, clbk) {
  if (condition) {
    try {
      clbk();
    } catch (e) {}
  }
}
