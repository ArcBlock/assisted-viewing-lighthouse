# assisted-viewing-lighthouse

Table showing lighthouse scores

## How to use this repo

1. download the code for this repository
2. run `npm i` to install the dependencies
3. configure the domain name of the site you want to test in config.json
4. run `npm run main` and wait for the run to finish; the lighthouse reports folder (named after the run time) will be created in this directory.
5. open https://arcblock.github.io/assisted-viewing-lighthouse/view/ and drag and drop the generated directory onto this page to view it.

## Generate file description

`*-mobile.html` for mobile device reports and `*-desktop` for desktop device reports.

<!-- ## 如何使用这个脚本

1. 下载这个仓库的代码
2. 执行 `npm i` 安装依赖
3. 在 config.json 内配置要测试的网站的域名
4. 执行 `npm run main`，等待运行结束；会在这个目录内生成lighthouse报告文件夹（已运行时间命名）；
5. 打开 https://arcblock.github.io/assisted-viewing-lighthouse/view/ ，将生成的目录拖拽到这个网页上查看；

## 生成文件说明

`*-mobile.html` 为移动设备报告，`*-desktop` 为桌面设备报告； -->