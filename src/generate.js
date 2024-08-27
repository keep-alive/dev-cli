const fs = require("fs");
const ora = require("ora");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer").default;
const download = require("download-git-repo");
const choices = require("./config");
const { clearDir } = require("./file");
const [{ name: defaultTemplate }] = choices;

async function downLoadTemplate(projectName, clone) {
  const repository = await inquirer.prompt([
    {
      name: "select-template",
      type: "select",
      message: "选择模版",
      default: defaultTemplate,
      choices,
    },
  ]);
  const spinner = ora("🗃 开始下载模版...").start();
  download(
    repository['select-template'],
    projectName,
    {
      clone,
    },
    (err) => {
      if (err) {
        console.log(chalk.red(err));
      } else {
        spinner.succeed("🎉 模版下载完成");
      }
    }
  );
}

exports.generate = async function (name) {
  const targetDir = path.join(process.cwd(), name);
  if (fs.existsSync(targetDir)) {
    inquirer
      .prompt([
        {
          name: "project-overwrite",
          type: "confirm",
          message: `工程 ${name} 已经存在, 是否确认覆盖?`,
          validate: function (input) {
            if (input.lowerCase !== "y" && input.lowerCase !== "n") {
              return "Please input y/n !";
            } else {
              return true;
            }
          },
        },
      ])
      .then((answers) => {
        if (answers["project-overwrite"]) {
          // 删除文件夹
          clearDir(targetDir);
          console.log(chalk.yellow(`删除已存在工程!`));

          //创建新模块文件夹
          fs.mkdirSync(targetDir);
          console.log(chalk.green(`创建工程 "${name}" 完成!`));

          downLoadTemplate(targetDir, true);
        }
      })
      .catch((err) => {
        console.log(chalk.red(err));
      });
  } else {
    //创建新模块文件夹
    fs.mkdirSync(targetDir);
    console.log(chalk.green(`创建工程 "${name}" 完成!`));

    downLoadTemplate(targetDir, true);
  }
};
