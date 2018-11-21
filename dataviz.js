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

  .command('export', 'Making chart about weather data, then export it to a PNG file')
  .argument('<input>', 'CSV file containing data to load')
  .argument('[output]', 'Output image file containing the chart')
  .action((args, options, logger) => {
    let outputFileName;
    if (args.output) {
      outputFileName = args.output;
    } else {
      outputFileName = 'precipitation.png';
    }

    let precipitationChart = {
      data: { url: args.input, format: { type: 'csv' } },
      mark: 'tick',
      encoding: {
        x: { field: 'precipitation', type: 'quantitative' }
      }
    };

    const myChart = vegalite.compile(precipitationChart).spec;

    let runtime = vg.parse(myChart);
    let view = new vg.View(runtime)
      .renderer('canvas')
      .background('#FFF')
      .run();
    let myCanvas = view.toCanvas();
    myCanvas.then(function(res) {
      fs.writeFileSync(outputFileName, res.toBuffer());
      view.finalize();
      logger.info(myChart);
      logger.info('Chart output : ./' + outputFileName);
    });
  });

dataviz.parse(process.argv);
