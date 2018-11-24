const dataviz = require('caporal');
const fs = require('fs');
const colors = require('colors');
const vg = require('vega');
const vegalite = require('vega-lite');

dataviz
  .version('1.0.0')
  // // you specify arguments using .argument()
  // // 'app' is required, 'env' is optional
  // .command('deploy', 'Deploy an application')
  // .argument('<app>', 'App to deploy', /^myapp|their-app$/)
  // .argument(
  //   '[env]',
  //   'Environment to deploy on',
  //   /^dev|staging|production$/,
  //   'local'
  // )
  // // you specify options using .option()
  // // if --tail is passed, its value is required
  // .option('--tail <lines>', 'Tail <lines> lines of logs after deploy', prog.INT)
  // .action(function(args, options, logger) {
  //   // args and options are objects
  //   // args = {"app": "myapp", "env": "production"}
  //   // options = {"tail" : 100}
  // });

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
      // Insert Vega JSON here //
      layer: [
        // Layer 1 : Stacked Bar Chart for Weather Type
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
          layer: [
            // Layer 2 : Plot Minimal and Maximal Temperatures over the months
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
                    title: 'Mean temperature in °C'
                  },
                  scale: { zero: false }
                },
                color: {
                  value: '#0072ff'
                }
              }
            },
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
                    title: 'Mean temperature in °C'
                  },
                  scale: { zero: false }
                },
                color: {
                  value: '#ff414b'
                }
              }
            }
          ]
        }
      ],
      resolve: { scale: { y: 'independent' }}
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
