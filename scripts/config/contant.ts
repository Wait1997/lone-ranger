import { resolve, parse } from 'path';

const PROJECT_PATH = resolve(__dirname, '../../');
const PROJECT_NAME = parse(PROJECT_PATH).name;
// dev server 路径与端口
const SERVER_HOST: string = 'localhost';
const SERVER_PORT: number = 3000;
// 图片资源 小于10kb使用base64
const imageInlineSizeLimit: number = 10 * 1024;
// 音视频资源 小于10kb使用base64
const mediaInlineSizeLimit: number = 10 * 1024;

const contant = {
  PROJECT_PATH,
  PROJECT_NAME,
  SERVER_HOST,
  SERVER_PORT,
  imageInlineSizeLimit,
  mediaInlineSizeLimit
};

export default contant;
