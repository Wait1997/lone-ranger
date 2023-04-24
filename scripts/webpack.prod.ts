import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { type Configuration } from 'webpack';
import common from './webpack.common';
import contant from './config/contant';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const { PROJECT_PATH } = contant;

const prodWebpackConfig: Configuration = merge(common, {
  mode: 'production',
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: resolve(PROJECT_PATH, './build'),
    clean: true
  },
  optimization: {
    /**
     * webpack v5 内置 terser-webpack-plugin 不需要安装
     * extractComments: true 是否将注释剥离到单独的文件中 .txt 文件中
     */
    minimizer: [
      // 使用 terser 来压缩 JavaScript
      new TerserPlugin({
        parallel: true, // 使用多进程并发运行以提高构建速度。 并发运行的默认数量： os.cpus().length - 1
        extractComments: false, // 默认值 true
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      }),
      // 压缩css
      new CssMinimizerPlugin()
    ],
    /**
     * 开箱即用的 SplitChunksPlugin 对于大部分用户来说非常友好
     * 默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签
     * webpack 将根据以下条件自动拆分 chunks：
     * 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
     * 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
     * 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
     * 当加载初始化页面时，并发请求的最大数量小于或等于 30
     * 当尝试满足最后两个条件时，最好使用较大的 chunks
     */
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          context: resolve(PROJECT_PATH, './public'),
          from: '*',
          to: resolve(PROJECT_PATH, './build'),
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    // 打包抽离css
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash:5].css'
    }),
    // 压缩css、js为gzip
    new CompressionPlugin({
      test: /\.(js|css)$/,
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 1024, // 默认 0 就开始压缩
      minRatio: 0.8 // 压缩率 默认0.8
    }),
    // 打包分析
    new WebpackBundleAnalyzer.BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false }
    })
  ]
});

export default prodWebpackConfig;
