# DataViz-VegaLite
GL02 A18 - DataViz with VegaLite

## Usage of DataViz
1. Download my [full repo on Github](https://github.com/marmontm/DataViz-VegaLite) or the [latest release](https://github.com/marmontm/DataViz-VegaLite/releases) containing only the files you need to run DataViz.

2. Make sure you have inside your directory the following files:  
`dataviz.js`, `package.json`, and a `.csv` file to analyze in the same format like `dataset07168.csv` provided in the repo.

3. Make sure you have Node.JS (4.6+) installed on your computer.

4. **DataViz** is a command line tool. Open your terminal, then go to the directory where you downloaded the files.

5. Install the required Node modules :  
`npm install`

6. Run DataViz :  
`node dataviz.js export <inputFile.csv> [outputFile.png]`

    Like : `node dataviz.js export dataset07168.csv weatherchart.png`
  
    > Note: The output filename is not mandatory. If not specified, `weatherreport.png` will be used instead.

7. Great, if you did everything good, you should see `Chart output : ./<outputFile.png>` at the end of your terminal and the corresponding file in your directory!

## Example
You can find in this repo an example **dataset** (`dataset07168.csv`) with its corresponding **chart** (`weatherreport.png`).

## Copyright
The author of this repo should be quoted if you decide to use or fork and add stuff on this work.   
  
© 2018 Maxime MARMONT ([@marmontm](https://github.com/marmontm/))   
For the University of Technology of Troyes (France)  
