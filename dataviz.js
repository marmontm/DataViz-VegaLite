/*
* Analyze data from the weather station of Troyes
* Node version 4.6.1
*
* @category Lab
* @package  gl02-dataviz
* @version  1.0.0
* @author   Maxime MARMONT <maxime.marmont@utt.fr>
* @License  MIT License
* @link     https://github.com/marmontm/DataViz-VegaLite
* */



const dataviz = require('caporal');
const fs = require('fs');
const colors = require('colors');
const vg = require('vega');
const vegalite = require('vega-lite');

dataviz
  .version('1.0.0')

  .command(
    'export',
    'Making chart about weather data, then export it to a PNG file'
  )
  .argument('<input>', 'CSV file containing data to load')
  .argument('[output]', 'Output image file containing the chart')
  .action((args, options, logger) => {
    let outputFileName;
    if (args.output) {
      outputFileName = args.output;
    } else {
      outputFileName = 'weatherreport.png';
    }

    let weatherChart = {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      data: { url: args.input, format: { type: 'csv' } },
      /*
      *
      * Chart composed in layers :
      *
      * 1 :     Stacked Bar for weather type over the months
      * 2.1 :   Line for Mean Min Temperature (blue) over the months
      * 2.2 :   Line for Mean Max Temperature (red) over the months
      *
      * */
      // Primary layers start here
      layer: [
        // Layer 1 : Stacked Bar for weather type over the months
        {
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'jour',
              type: 'ordinal',
              axis: { title: 'Month of the year' }
            },
            y: {
              aggregate: 'count',
              type: 'quantitative',
              axis: {
                title: 'Number of records',
                orient: 'left'
              }
            },
            color: {
              field: 'meteo',
              type: 'nominal',
              scale: {
                domain: ['sun', 'fog', 'drizzle', 'rain', 'snow'],
                range: ['#e7ba52', '#c7c7c7', '#aec7e8', '#748db4', '#ba8bbd']
              },
              legend: { title: 'Weather type' }
            }
          }
        },
        {
          // Secondary layers start here
          layer: [
            // Layer 2.1 : Line for Mean Min Temperature (blue) over the months
            {
              mark: 'line',
              encoding: {
                x: {
                  timeUnit: 'month',
                  field: 'jour',
                  type: 'ordinal'
                },
                y: {
                  aggregate: 'mean',
                  field: 't_min',
                  type: 'quantitative',
                  axis: {
                    grid: false,
                    orient: 'right',
                    title: 'Mean max / min temp. in °C'
                  },
                  scale: { zero: false }
                },
                color: {
                  value: '#00368d'
                }
              }
            },
            // Layer 2.2 : Line for Mean Max Temperature (red) over the months
            {
              mark: 'line',
              encoding: {
                x: {
                  timeUnit: 'month',
                  field: 'jour',
                  type: 'ordinal'
                },
                y: {
                  aggregate: 'mean',
                  field: 't_max',
                  type: 'quantitative',
                  axis: {
                    grid: false,
                    orient: 'right',
                    title: 'Mean max / min temp. in °C'
                  },
                  scale: { zero: false }
                },
                color: {
                  value: '#f73b47'
                }
              }
            }
          ]
          // End of secondary layers
        }
      ],
      resolve: { scale: { y: 'independent' } }
    };

    const outputChart = vegalite.compile(weatherChart).spec;

    let runtime = vg.parse(outputChart);
    let view = new vg.View(runtime)
      .renderer('canvas')
      .background('#FFF')
      .run();
    let myCanvas = view.toCanvas();
    myCanvas.then(function(res) {
      fs.writeFileSync(outputFileName, res.toBuffer());
      view.finalize();
      logger.info(outputChart);
      logger.info('Chart output : ./' + outputFileName);
    });
  });

dataviz.parse(process.argv);
