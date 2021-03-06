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
      emptyFill,
      PalettedFill,
      ColorShadingStyles,
      UIOrigins,
      synchronizeAxisIntervals,
      AxisTickStrategies,
      translatePoint,
      transparentFill,
      AutoCursorModes
    } = lcjs;

    return {
      renderValue: async function (args) {
        let { components, title } = args;

        const theme = Themes.lightNew;
        const maxRows = 10;
        const dashboard = lightningChart({
          resourcesBaseUrl: 'https://cdn.jsdelivr.net/npm/@arction/lcjs@3.4.0/dist/resources'
        }).Dashboard({
          theme,
          numberOfColumns: 1,
          numberOfRows: maxRows,
        });
        const charts = [];
        const updateDashboardSizeDistribution = () => {
          for (let i = 0; i < maxRows; i += 1) {
            dashboard.setRowHeight(i, 0.00001);
          }
          const usedRows = [
            ...new Set(charts.map((chart) => chart.rowIndex)),
          ].sort();
          usedRows.forEach((rowIndex) => dashboard.setRowHeight(rowIndex, 1));

          if (title) {
            const topCharts = charts.filter(
              (chart) => chart.rowIndex === usedRows[0]
            );
            topCharts.forEach((chart) => chart.chart.setPadding({ top: 24 }));
          }
          const bottomCharts = charts.filter(
            (chart) => chart.rowIndex === usedRows[usedRows.length - 1]
          );
          bottomCharts.forEach((chart) =>
            chart.chart.setPadding({ bottom: 20 })
          );
        };

        // #region Args: Chart title
        if (title) {
          dashboard
            .addUIElement(undefined, dashboard.uiScale)
            .setText(title)
            .setBackground((background) =>
              background.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
            )
            .setOrigin(UIOrigins.CenterTop)
            .setPosition({ x: 50, y: 100 });
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

        // #endregion

        const axisGroupsX = {};

        for (const component of components) {
          const { id_ } = component;
          // Assume id_ === 'series'
          const {
            type,
            x,
            y,
            axis_x,
            axis_y,
            axis_z,
            intensity,
            heightmap,
            palette,
            point_size,
            point_color,
            point_shape,
            line_thickness,
            line_color,
            map_data,
            map_view
          } = component;

          const is3D = component.type === "surface";
          const isMap = component.type === "map";
          const is2D = !is3D && !isMap;

          // #region Find or create chart for series

          let chart, rowIndex, axisX, axisY, axisZ;
          const sharedAxisX =
            axis_x &&
            axis_x.length > 0 &&
            charts.find((existingChart) => existingChart.axis_x === axis_x);
          const sharedAxisY =
            axis_y &&
            axis_y.length > 0 &&
            charts.find((existingChart) => existingChart.axis_y === axis_y);
          const mapAxis = (axis_x === 'map' || axis_y === 'map') && charts.find((existingChart) => existingChart.isMap)

          if (sharedAxisY) {
            // Place series into existing chart, on the same Y axis
            chart = sharedAxisY.chart;
          } else if (mapAxis) {
            // Place chart over map.
            if (!is2D) { throw new Error(`Only 2D chart can be placed over map`)  }
            rowIndex = mapAxis.rowIndex
            chart = dashboard.createChartXY({ columnIndex: 0, rowIndex })
              .setBackgroundFillStyle(transparentFill)
              .setSeriesBackgroundFillStyle(transparentFill)
              .setAutoCursorMode(AutoCursorModes.disabled)
              .setMouseInteractions(false)
            chart.forEachAxis((axis) =>
              axis.setTickStrategy(AxisTickStrategies.Empty).setStrokeStyle(emptyLine).setTitleFillStyle(emptyFill)
            );
            mapAxis.chart.onViewChange((view) => {
              chart.setPadding({
                left: view.margin.left,
                right: view.margin.right,
                top: view.margin.top,
                bottom: view.margin.bottom,
              });
              chart
                .getDefaultAxisX()
                .setInterval(
                  view.longitudeRange.start,
                  view.longitudeRange.end,
                  false,
                  true
                );
              chart
                .getDefaultAxisY()
                .setInterval(
                  view.latitudeRange.start,
                  view.latitudeRange.end,
                  false,
                  true
                );
            });
          }
          if (!chart) {
            // Create new chart for series
            rowIndex = charts.reduce(
              (prev, cur) => Math.max(prev, cur.rowIndex + 1),
              0
            );
            const dashboardOptions = { columnIndex: 0, rowIndex };
            chart = is2D ? dashboard.createChartXY(dashboardOptions) :
              is3D ? dashboard.createChart3D(dashboardOptions) :
              isMap ? dashboard.createMapChart({...dashboardOptions, type: map_view}) :
              undefined
            if (!chart) {
              throw new Error(`unidentified chart type`)
            }

            if (sharedAxisX) {
              // Synchronize X axis with an existing chart
              axisGroupsX[axis_x] = axisGroupsX[axis_x] || [
                sharedAxisX.chart.getDefaultAxisX(),
              ];
              axisGroupsX[axis_x].push(chart.getDefaultAxisX());
            }
          }
          chart.setTitle("");
          axisX = axisX || ('getDefaultAxisX' in chart && chart.getDefaultAxisX());
          axisY = axisY || ('getDefaultAxisY' in chart && chart.getDefaultAxisY());
          axisZ = axisZ || ('getDefaultAxisZ' in chart && chart.getDefaultAxisZ());
          charts.push({
            chart,
            rowIndex,
            is3D,
            is2D,
            isMap,
            axis_x,
            axis_y,
            axis_z,
          });

          if (isMap) {
            // In case of map chart, wait until map data is loaded before continuing with chart creation.
            await new Promise(resolve => chart.onMapDataReady(resolve))
          }

          // #endregion

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

          if (axis_x !== undefined) {
            axisX.setTitle(axis_x);
            if (axis_x === "") {
              axisX.setTickStrategy(AxisTickStrategies.Empty);
            }
          }
          if (axis_y !== undefined) {
            axisY.setTitle(axis_y);
            if (axis_y === "") {
              axisY.setTickStrategy(AxisTickStrategies.Empty);
            }
          }
          if (axis_z !== undefined && axisZ) {
            axisZ.setTitle(axis_z);
            if (axis_z === "") {
              axisZ.setTickStrategy(AxisTickStrategies.Empty);
            }
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
                  lut: parsePalette(lcjs, palette, calculateMinMaxFromMatrix(intensityMatrix)),
                })
              );
            }
          } else if (type === "surface") {
            // heightmap values must be specified
            if (!heightmap) {
              throw new Error("'heightmap' not specified");
            }

            const heightMatrix = Array.from(heightmap);
            const columns = heightMatrix.length;
            const rows = heightMatrix[0].length;
            series = chart
              .addSurfaceGridSeries({
                columns,
                rows,
                dataOrder: "columns",
              })
              .invalidateHeightMap(heightMatrix)
              .setWireframeStyle(emptyLine);

            if (palette) {
              series.setFillStyle(
                new PalettedFill({
                  lookUpProperty: "y",
                  lut: parsePalette(lcjs, palette, calculateMinMaxFromMatrix(heightMatrix)),
                })
              );
            }
          } else if (type === "map") {
            ifTry(map_data, _ => {
              // Expect first column to be either ISO_AE country code or name of country, and second column a numeric value.
              let min = Number.MAX_SAFE_INTEGER
              let max = -Number.MAX_SAFE_INTEGER
              chart.invalidateRegionValues((region) => {
                const iRegionData = map_data[0].findIndex(countryIdentifier => region.name === countryIdentifier || region.ISO_A3 === countryIdentifier)
                if (iRegionData < 0) return undefined
                const regionValue = map_data[1][iRegionData]
                min = Math.min(min, regionValue)
                max = Math.max(max, regionValue)
                return regionValue
              })
              if (palette) {
                chart.setFillStyle(
                  new PalettedFill({
                    lookUpProperty: "value",
                    lut: parsePalette(lcjs, palette, {min, max}),
                  })
                );
              }
            })
          }
          if (!series) {
            continue
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
          ifTry("setColorShadingStyle" in series, (_) => {
            series.setColorShadingStyle(new ColorShadingStyles.Phong());
          });
          ifTry("add" in series, (_) => {
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
          });
        };

        // #endregion

        ifTry(true, (_) => {
          updateDashboardSizeDistribution();
        });

        ifTry(true, (_) => {
          charts.forEach((chart) => {
            if ("getDefaultAxisX" in chart.chart) {
              chart.chart.getDefaultAxisX().fit(false);
            }
            if ("getDefaultAxisY" in chart.chart) {
              chart.chart.getDefaultAxisY().fit(false);
            }
            if ("getDefaultAxisZ" in chart.chart) {
              chart.chart.getDefaultAxisZ().fit(false);
            }
          });
        });

        ifTry(true, (_) => {
          Object.values(axisGroupsX).forEach((axisGroup) => {
            synchronizeAxisIntervals(...axisGroup);
            axisGroup.forEach((axis, i) => {
              if (i < axisGroup.length - 1) {
                axis
                  .setTickStrategy(AxisTickStrategies.Empty)
                  .setTitle("")
                  .setStrokeStyle(emptyLine);
              }
            });
            requestAnimationFrame(() => {
              const maxMarginLeft = axisGroup.reduce(
                (prev, cur) =>
                  Math.max(
                    prev,
                    translatePoint(
                      { x: cur.getInterval().start, y: 0 },
                      { x: cur, y: cur.chart.getDefaultAxisY() },
                      cur.chart.pixelScale
                    ).x
                  ),
                0
              );
              axisGroup.forEach((axis) => {
                axis.chart
                  .setPadding({ left: 0 })
                  .getDefaultAxisY()
                  .setThickness(maxMarginLeft);
              });
            });
          });
        });
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
function parsePalette(lcjs, paletteInput, minMax) {
  const { LUT, ColorHEX } = lcjs;
  try {

    const colors = Array.from(paletteInput);
    return new LUT({
      interpolate: true,
      steps: colors.map((colorStringHex, iStep) => ({
        value: minMax.min + (iStep / colors.length) * (minMax.max - minMax.min),
        color: ColorHEX(colorStringHex),
      })),
    });
  } catch (e) {
    console.warn(`parsePalette error ${e.message}`)
    // Return error palette
    return undefined
  }
}

function calculateMinMaxFromMatrix(matrix) {
    // Calculate value range (min - max)
    let min = Number.MAX_SAFE_INTEGER;
    let max = -Number.MAX_SAFE_INTEGER;
    for (const vector of valueMatrix) {
      for (const value of vector) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
    return {min, max}
}

/**
 * Syntax sugar function for checking if some case is true, and then executing a callback that will not throw an error (even if there is an unexpected error !).
 */
function ifTry(condition, clbk) {
  if (condition) {
    try {
      clbk();
    } catch (e) {
      console.warn(`ifTry block errored ${e.message}`)
    }
  }
}
