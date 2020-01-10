const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');


console.log('Dirrectory for compiling:');
console.log(path.join(__dirname, "/view/frontend/web/js/"));

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "view/frontend/web/js/"),
    filename: "index_bundle.js"
  },
  /*externals: {
    'React': 'React',
    'ReactDOM': 'ReactDOM',
    'ReactRouter': 'ReactRouter'
  },*/
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  ///var/www/html/magento
  ///var/www/html/magento/../../../../../../../../index_bundle.js
  plugins: [

]
};
