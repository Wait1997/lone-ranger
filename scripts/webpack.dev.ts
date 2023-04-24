import { resolve } from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common';
import constant from './config/contant';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { type Configuration as WebpackConfiguration } from 'webpack';
import { type Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const { SERVER_HOST, SERVER_PORT, PROJECT_PATH } = constant;

const webpackDevConfig: Configuration = merge(common, {
  mode: 'development',
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: resolve(PROJECT_PATH, './build')
  },
  devtool: 'source-map',
  target: 'web',
  cache: { type: 'memory' }, // 设置开发环境使用内存缓存
  devServer: {
    host: SERVER_HOST, // 指定 host，不设置的话默认是 localhost
    port: SERVER_PORT,
    open: false,
    compress: true, // gzip压缩,开发环境不开启，提升热更新速度
    hot: true,
    historyApiFallback: true // 开发模式404 history404问题解决
  },
  plugins: [
    // 启用react热更新
    new ReactRefreshWebpackPlugin()
  ]
});

export default webpackDevConfig;
