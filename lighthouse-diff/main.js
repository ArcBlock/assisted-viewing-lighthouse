(() => {
  document.body.addEventListener("dragover", (e) => e.preventDefault(), false);
  document.body.addEventListener(
    "drop",
    async (e) => {
      e.preventDefault();
      Array.from(e.dataTransfer.items).forEach((item) => {
        const target = item.webkitGetAsEntry();
        //   console.log("target => ", target);
        if (target.isDirectory) {
          let directoryReader = target.createReader();
          const datas = [];
          let timer;
          directoryReader.readEntries((entries) => {
            entries.forEach(function (entry) {
              clearTimeout(timer);
              datas.push(
                new Promise((res) => {
                  entry.file((file) => {
                    res({
                      name: entry.name,
                      file,
                      entry,
                    });
                  });
                })
              );
              timer = setTimeout(async () => {
                appendList(await Promise.all(datas), target.name);
              }, 200);
            });
          });
        } else {
          alert("请拖拽目录文件");
        }
      });
    },
    false
  );

  // 获取分数
  const getScore = (url) => {
    return new Promise((res) => {
      const frameEle = document.createElement("iframe");
      frameEle.src = url;
      frameEle.classList.add("fake-view");
      frameEle.addEventListener("load", () => {
        const allScore = Array.from(
          frameEle.contentDocument.querySelectorAll(".lh-gauge__percentage")
        ).slice(0, 4);
        const performance = allScore[0].innerHTML;
        const accessibility = allScore[1].innerHTML;
        const bestPractices = allScore[2].innerHTML;
        const seo = allScore[3].innerHTML;

        res({
          performance,
          accessibility,
          bestPractices,
          seo,
        });

        frameEle.parentElement.removeChild(frameEle);
      });
      document.body.appendChild(frameEle);
    });
  };

  const scoreEle = (score) => {
    return `<span style="color:${
      score >= 90 ? "green" : score >= 60 ? "orange" : "red"
    }">${score}</span>`;
  };

  // 添加到列表
  const appendList = async (datas, dirName) => {
    const table = document.createElement("table");
    table.classList.add("main-table");
    // console.log("datas => ", datas, dirName);
    let tbody = "";

    await Promise.all(
      datas.map(async (e) => {
        const url = URL.createObjectURL(e.file);

        const scoreData = await getScore(url);

        // console.log("score => ", scoreData);

        tbody += `
        <tr>
            <td>${e.name}</td>
            <td>${scoreEle(scoreData.performance)}</td>
            <td>${scoreEle(scoreData.accessibility)}</td>
            <td>${scoreEle(scoreData.bestPractices)}</td>
            <td>${scoreEle(scoreData.seo)}</td>
            <td><a href="${url}" target="_blank">点击查看</a></td>
        </tr>
      `;
      })
    );

    table.innerHTML = `
    <thead>
        <tr>
            <td>文件名</td>
            <td>性能分</td>
            <td>无障碍</td>
            <td>建议</td>
            <td>SEO</td>
            <td>访问地址</td>
        </tr>
    </thead>
    <tbody>${tbody}</tbody>
    `;

    const container = document.createElement("div");
    container.innerHTML = `<h3>${dirName}</h3>`;
    container.appendChild(table);

    document.body.appendChild(container);
  };
})();
