const { src, dest, parallel, series, watch } = require("gulp");

const del = require("del");
const browserSync = require("browser-sync");

const loadPlugins = require("gulp-load-plugins");

// 自动加载插件
const plugins = loadPlugins();
const bs = browserSync.create();

const standard = plugins.standard;

const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

const lint = () => {
  return src(["src/**/*.js"])
    .pipe(standard())
    .pipe(
      standard.reporter("default", {
        showRuleNames: true,
      })
    );
};

// 删除临时目录
const clean = () => {
  return del(["dist", "temp"]);
};

// 样式编译
const style = () => {
  return src("src/assets/styles/*.scss", {
    base:
      "src" /** 以 src 基准目录路径，输出到目标路径时会保留文件在 src 下文件目录结构  */,
  })
    .pipe(plugins.sass({ outputStyle: "expanded" /** 右括号单独一行 */ }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true })); // 重新以流的方式刷新浏览器
};

// 脚本文件编译
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(
      plugins.babel({
        presets: [
          "@babel/preset-env",
        ] /** 一定要传 presets 配置 babel 插件，不然 babel 看起来就不会生效 */,
      })
    )
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// 页面模板编译
const page = () => {
  // 如果是 src 下所有子目录匹配 html 为 src/**/*.html
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } })) // catch 设为 false 防止模板缓存导致页面不能及时更新
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// 图片转换
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

// 字体转换
const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

// public 下所有文件直接拷贝
const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  // watch 监视通配符的文件，文件一修改后执行第二个参数的的任务
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);

  // 下面的三个任务其实只是压缩，且任务中的压缩是无损压缩，所以在开发阶段没有必要每回修改都去重新执行构建
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  bs.init({
    notify: false, // 网页打开会有个连接 browserSync 的提示，这里关掉了
    port: 2080, // 服务器端口
    // open: false, // 自动打开浏览器
    // files: 'dist/**', // 指定哪些文件更新后，自动刷新浏览器
    server: {
      baseDir: ["temp", "src", "public"], // 网站根目录，以数组顺序去查找文件
      routes: {
        // 优先级比 baseDir 更高
        "/node_modules": "node_modules", // 将文件中请求的 /node_modules 路径开头的请求直接对应到项目根目录下的 node_modules，因为上面的 baseDir 里都是没有 node_modules 目录的
      },
    },
  });
};

// 上线的时候还是引用了 node_modules 里的文件，但是路径并没有做相应的处理，上线了就还是会找不到文件的
// useref 文件引用处理
const useref = () => {
  return (
    src("temp/*.html", { base: "temp" })
      .pipe(plugins.useref({ searchPath: ["temp", "."] }))
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest("dist"))
  );
};

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const develop = series(compile, serve);

module.exports = {
  lint,
  clean,
  build,
  develop,
  serve: develop,
  start: develop,
};
