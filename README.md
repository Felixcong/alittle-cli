# ths-cli

## 简介

> 用来初始化自定义模板的工具,主要针对 gitlab 和 github 项目

## 安装

### 外网

```javascript
$ npm install ths-clis -g
```

## 使用

```javascript
$ ths init <template-name> [project-name]
```

## 案例

使用过 nrm 切换 npm 源的同学应该会比较熟悉这个模式,下载这个脚手架后可以先修改默认的仓库地址，命令见下方

```javascript
//demo1 : 在当前目录下初始化一个vue项目
$ ths init vue

//demo2 : 在当前目录下新建一个名称为demo2的文件夹，并价vue模板初始化到该目录下
$ ths init vue demo2

//demo3 : 新增/修改仓库地址,都是用add，新的地址会覆盖默认地址
//ps:地址是gitlab的地址栏上面的地址
//例如地址是http://192.168.1.1/group/project
$ ths add react http://192.168.1.1/group/project
$ ths add php   http://192.168.1.1/group/project

//demo4 : 查看当前所有仓库地址
$ ths ls
```

## License

MIT
