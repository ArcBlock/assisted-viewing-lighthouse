// const fs = require("fs");
const { writeFile, mkdir } = require("fs/promises");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const desktopOpts = require("lighthouse/lighthouse-core/config/desktop-config");
const configs = require("./config.json");

// 给出地址和类型，获取相应的分数
const getReport = async (url, isDesktop) => {
  //chromeLauncher 工具包提供了 launch 方法，接收一个启动所需的参数对象，这个参数用于配置 chrome 的启动环境、启动方式等。该方法返回一个Chrome实例
  const chrome = await chromeLauncher.launch({
    // https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
    // chromeFlags: ["--headless", "--disable-extensions"],
    // headless 模式下，tti和tbt会受到影响
    chromeFlags: ["--disable-extensions"],
  });

  //lighthouse运行的一些配置信息
  const options = {
    logLevel: "info",
    output: "html",
    port: chrome.port,
    locale: "zh-cn",
    device: "desktop",
  };

  const config = isDesktop ? desktopOpts : undefined;

  //执行lighthouse得到执行结果，执行结果是一个JS对象
  const runnerResult = await lighthouse(url, options, config);

  //通过lighthouse的运行结果的report属性值拿到运行报告，运行报告是用于 HTML/JSON/CSV 输出结果的一个字符串
  const reportHtml = runnerResult.report;

  //关闭Chrome浏览器进程
  await chrome.kill();

  return reportHtml;
};

(async () => {
  const { data } = configs;

  // const reports = [];
  let task = Promise.resolve();

  const dirName = new Date().toLocaleString().replace(/[\/ :]/g, "-");
  await mkdir(dirName);

  data.forEach((e, index) => {
    task = task.then(async () => {
      console.log(
        `---- start mobile test => ${e.name} ---- ${index + 0.5}/${data.length}`
      );
      const mobile = await getReport(e.url);
      console.log(
        `----end mobile test => ${e.name} ---- ${index + 0.5}/${data.length}`
      );

      await writeFile(`${dirName}/${e.name}-mobile.html`, mobile);

      console.log(
        `---- start pc test => ${e.name} ---- ${index + 1}/${data.length}`
      );
      const desktop = await getReport(e.url, true);
      console.log(
        `----end pc test => ${e.name} ---- ${index + 1}/${data.length}`
      );

      await writeFile(`${dirName}/${e.name}-desktop.html`, desktop);

      // const obj = {
      //   name: e.name,
      //   mobile,
      //   desktop,
      // };

      // reports.push(obj);
    });
  });

  // await task;

  // 写入文件
  // reports.forEach((e) => {
  //   fs.writeFileSync(`${dirName}/${e.name}-desktop.html`, e.desktop);
  //   fs.writeFileSync(`${dirName}/${e.name}-mobile.html`, e.mobile);
  // });
})();
