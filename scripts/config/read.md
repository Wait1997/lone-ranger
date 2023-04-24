#### 开发环境：
- 开发环境中，我们需要：强大的 source map 
- 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server

#### 生产环境：
- 关注点在于压缩 bundle、更轻量的 source map、资源优化
  - hash: 只要项目中有任何一个的文件内容发生变动，打包后所有文件的hash值都会发生改变。
  - chunkhash: 根据不同的入口文件(entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。当某个文件内容发生变动时，再次执行打包，只有该文件以及依赖该文件的文件的打包结果`hash`值会发生改变
  - contenthash: 是只有当文件自己的内容发生改变时，其打包的 hash 值才会发生变动

1. 安装`typescript` `@babel/preset-typescript`会将`ts`转换为`js` 再借助预设`@babel/preset-react`来识别`jsx`语法
   ```shell
   yarn add typescript @babel/preset-typescript -D
   ```
2. `npx tsc --init`生成`tsconfig.json`
3. `yarn add dotenv`通过创建env环境变量

#### husky使用
> 安装：`npx husky install`
```shell
# package.json
"scripts": {
  "prepare": "husky install" // pull代码 npm install 之后自动执行启动husky命令的，这样就不用手动启动了
}
```