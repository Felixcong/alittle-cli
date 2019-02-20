#! /usr/bin/env node

var gitDownload = require('download-git-repo');
var program = require('commander');
var path = require('path');
var fs = require('fs');
var ini = require('ini');
var echo = require('node-echo');
var extend = require('extend');
var colors = require('colors');
var defaultRegistries = require('./registry.json');

var thsPath = path.join(process.env.HOME, '.ths');
var shell = require('shelljs');

program.version(require('./package').version).usage('<command> [options]');

program
  .command('init <name> [project-name]')
  .description('初始化模板类型，[vue]，[react]，[react-native],[nodejs]')
  .action(init);

program
  .command('add <name> <url>')
  .description('新增/修改模板地址，add <name> <url>, 例如 ths add reactjs http://10.0.4.73:B2C-template/vue')
  .action(addRegistry);

program
  .command('ls')
  .description('查看所有仓库配置')
  .action(list);

program.parse(process.argv);

// fs.writeFileSync(
//   thsPath,
//   ini.stringify({
//     first: { registry: "asdasdasd" },
//     second: { registry: "asdasdasd" }
//   })
// );

// program.option("vue", "初始化vue模板").parse(process.argv);

//初始化项目模板
function init(name, projectName) {
  name = name.replace(/[\s]/g, '');
  var allRegistry = getAllRegistry();
  download(allRegistry[name]['registry'], name, projectName);
}

//下载模板
function download(template, name, projectName) {
  // if (template.indexOf("gitlab:") > -1 || template.indexOf("github:") > -1) {
  // } else {
  //   template = "gitlab:" + template.replace(/\.git$/g, "");
  // }
  let registryAddress = '';
  if (template.indexOf('http://') > -1) {
    template = template.replace('http://', '').replace('.git', '');
    let templateArr = template.split('/');
    registryAddress = 'gitlab:http://' + templateArr[0] + ':' + templateArr[1] + '/' + templateArr[2];
  } else if (template.indexOf('git@') > -1) {
    template = template.replace('git@', '').replace('.git', '');
    registryAddress = 'gitlab:http://' + template;
  } else {
    console.log('仓库地址有误');
  }
  console.log('正在初始化【' + name + '】模板...');
  var url = process.cwd();
  if (projectName) {
    url = url + '/' + projectName;
  }
  // return;
  //gitlab:gitlab.10jqka.com.cn:b2c-FE/vue
  //http://gitlab.10jqka.com.cn/b2c-FE/vue.git
  //'gitlab:http://gitlab.10jqka.com.cn:b2c-FE/vue'
  gitDownload(registryAddress, url, function(err) {
    if (err) {
      console.log(err);
      console.log('初始化【' + name + '】失败');
    } else {
      console.log('===================Success=========================');
      console.log(colors.green('初始化【' + name + '】模板成功'));
      console.log('===================================================');
      console.log(colors.green('自动执行npm install...'));
      if (projectName) {
        process.chdir('./' + projectName);
      }
      shell.exec('npm install');
      console.log(colors.green('自动执行npm link @vue/devtools'));
      shell.exec('npm link @vue/devtools');
    }
  });
}

//新增仓库地址
function addRegistry(name, url) {
  name = name.replace(/[\s]/g, '');
  var allRegistry = getAllRegistry();
  allRegistry[name] = { registry: url };
  setCustomRegistry(allRegistry, function() {
    console.log('===================Success=========================');
    console.log('设置仓库地址成功,可以使用如下语句初始化项目');
    console.log('ths init ' + name);
    console.log('===================================================');
  });
}

//查看所有仓库
function list() {
  var allRegistry = getAllRegistry();
  console.log('\r');
  for (var i in allRegistry) {
    console.log('    ' + i + '---' + allRegistry[i]['registry']);
  }
  console.log('\r');
}

//获取用户自定义的仓库地址
function getCustomRegistry() {
  return fs.existsSync(thsPath) ? ini.parse(fs.readFileSync(thsPath, 'utf-8')) : {};
}

//写入用户自定义的仓库地址
function setCustomRegistry(config, callback) {
  echo(ini.stringify(config), '>', thsPath, callback);
}

//获取所有仓库地址
function getAllRegistry() {
  return extend({}, defaultRegistries, getCustomRegistry());
}
