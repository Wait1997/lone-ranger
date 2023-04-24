import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export interface JsLoaderParams {
  openThreadLoader?: boolean;
  devCache?: boolean;
}

export function transformJsLoader({ openThreadLoader, devCache }: JsLoaderParams) {
  if (openThreadLoader && isDev) {
    return ['thread-loader', { loader: 'babel-loader', options: { cacheDirectory: devCache } }];
  }
  if (openThreadLoader && isProd) {
    return ['thread-loader', { loader: 'babel-loader' }];
  }
  if (isDev) {
    return [{ loader: 'babel-loader', options: { cacheDirectory: devCache } }];
  }
  return ['babel-loader'];
}

export function transformCssLoader(loaders?: number) {
  const importLoaders = loaders ?? 1;

  return [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[path][name]__[local]--[hash:5]'
        },
        sourceMap: true,
        importLoaders
      }
    },
    'postcss-loader'
  ];
}

export function transformLessLoader() {
  return [
    ...transformCssLoader(2),
    {
      loader: 'less-loader',
      options: {
        lessOptions: {
          modules: true, // 这样就不需要在less文件名加module了
          javascriptEnabled: true // 如果要在less中写类型js的语法，需要加这一个配置
        },
        sourceMap: true
      }
    }
  ];
}

export { isDev, isProd };
