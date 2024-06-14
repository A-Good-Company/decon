const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
     configureWebpack: {
       // ...
       plugins: [
         // ...
         new CopyPlugin({
           patterns: [
             // ...
             {
               from: './node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
               to: './js/[name][ext]',
             },
             {
               from: './node_modules/@ricky0123/vad-web/dist/*.onnx',
               to: './js/[name][ext]',
             },
             { 
               from: './node_modules/onnxruntime-web/dist/*.wasm', 
               to: './js/[name][ext]' 
             },
           ],
         }),
       ],
     },
     // ...
   };