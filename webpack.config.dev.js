const merge = require("webpack-merge");
const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.config.dev.js"); //Can also be webpack.config.prod.js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ArcGISPlugin = require("@arcgis/webpack-plugin")


const customConfig = {
    plugins: [
        new ArcGISPlugin({
            features: {
                "3d": false
              },
            }),
        new CopyWebpackPlugin({
            patterns: [
                {from: './src/assets', to:'./widgets/mendix/arcgis/assets'},
                {from: './src/assets/esri/themes/base/fonts', to: './widgets'},
                {from: './src/assets/esri/themes/base/icons', to: './widgets'},
            ]
        })
    ],
    module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'file-loader',
              },
            ],
          }
        ],
      },
    
};
const previewConfig = {

};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];