const Generator = require("yeoman-generator");
const path = require("path");
const fs = require("fs");

const templatePathName = path.join(__dirname, "./templates");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
      },
    ]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    const fileList = relativePathFromDir(templatePathName);
    fileList.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      );
    });
  }
};

/**
 * 遍历文件夹下所有文件的相对路径方法
 * @param dir 需要遍历的文件路径
 */
function relativePathFromDir(dir) {
  const results = [];
  (function recurseRead(pathName) {
    const list = fs.readdirSync(pathName);
    list.forEach(function (file) {
      file = path.join(pathName, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        recurseRead(file);
      } else {
        /* Is a file */
        results.push(path.relative(dir, file));
      }
    });
  })(dir);
  return results;
}
