import webpack, { type Configuration } from 'webpack';
import { resolve } from 'path';
import contant from './config/contant';
import dotenv from 'dotenv';
import WebpackBar from 'webpackbar';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { transformJsLoader, transformCssLoader, transformLessLoader, isProd } from './config/env';

const { PROJECT_PATH, imageInlineSizeLimit, mediaInlineSizeLimit } = contant;

// 加载配置文件
const envConfig = dotenv.config({
  path: resolve(PROJECT_PATH, `./env/.env.${process.env.BASE_ENV}`)
});

const webpackCommonConfig: Configuration = {
  entry: { main: resolve(PROJECT_PATH, './src/index') },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': resolve(PROJECT_PATH, './src')
    },
    modules: [resolve(PROJECT_PATH, './node_modules')] // 查找第三方模块只在本项目的node_modules中查找
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: transformJsLoader({ openThreadLoader: false, devCache: true }),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: transformCssLoader()
      },
      {
        test: /\.less$/,
        use: transformLessLoader()
      },
      /**
       * asset module type
       * asset/resource: 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现 默认：[hash][ext][query]
       * asset/inline: 导出一个资源的 data URI。之前通过使用 url-loader 实现
       * asset/source: 导出资源的源代码。之前通过使用 raw-loader 实现
       * asset: 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现
       */
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        // 设置资源的大小
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit
          }
        },
        generator: isProd
          ? {
              filename: 'static/images/[name].[contenthash:5][ext]'
            }
          : undefined
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
        generator: isProd
          ? {
              filename: 'static/fonts/[name].[contenthash:5][ext]' // 加上[contenthash:8]
            }
          : undefined
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: mediaInlineSizeLimit
          }
        },
        generator: isProd
          ? {
              filename: 'static/media/[name].[contenthash:5][ext]' // 文件输出目录和命名
            }
          : undefined
      },
      {
        test: /\.json$/,
        type: 'asset/resource',
        generator: isProd
          ? {
              // 这里专门针对json文件的处理
              filename: 'static/json/[name].[contenthash:5][ext]'
            }
          : undefined
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(PROJECT_PATH, './public/index.html'),
      minify: {
        removeAttributeQuotes: true, // 尽可能删除属性周围的引号
        collapseWhitespace: true, // 去空格
        removeComments: true // 去注释
        // minifyJS: true, // 缩小脚本元素和事件属性中的 JavaScript
        // minifyCSS: true // 缩小样式元素和样式属性中的 CSS
      },
      cache: false
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envConfig.parsed),
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new WebpackBar({
      color: '#85d', // 默认green，进度条颜色支持HEX
      basic: false, // 默认true，启用一个简单的日志报告器
      profile: false // 默认false，启用探查器
    })
  ]
};

export default webpackCommonConfig;
