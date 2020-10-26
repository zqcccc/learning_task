// 实现这个项目的构建任务
const sass = require("sass");
const loadGruntTasks = require("load-grunt-tasks");

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

module.exports = (grunt) => {
  grunt.initConfig({
    clean: ["dist/**"],
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      dist: {
        files: [
          {
            // Set to true for recursive search
            expand: true,
            cwd: "src",
            src: ["**/*.scss"],
            dest: "dist",
            ext: ".css",
          },
        ],
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "src",
            src: ["**/*.js"],
            dest: "dist",
          },
        ],
      },
    },
    web_swig: {
      options: {
        swigOptions: {
          cache: false,
        },
        getData: function () {
          return data;
        },
      },
      dest: {
        files: [
          {
            // Set to true for recursive search
            expand: true,
            cwd: "src",
            src: ["**/*.html", "!layouts/**", "!partials/**"],
            dest: "dist",
          },
        ],
      },
    },
    imagemin: {
      image: {
        expand: true,
        cwd: 'src',
        src: ['assets/images/**/*'],
        dest: 'dist',
      },
      font: {
        expand: true,
        cwd: 'src',
        src: ['assets/fonts/**/*'],
        dest: 'dist',
      },
    },
    copy: {
      main: {
        expand: true,
        cwd: 'public',
        src: ['**'],
        dest: 'dist',
      },
    },
    watch: {
      // 默认启动这个任务是不会编译的，是启动后检测到文件改动才会执行编译
      js: {
        files: ["src/**/*.js"],
        tasks: ["babel"],
      },
      css: {
        files: ["src/**/*.scss"],
        tasks: ["sass"],
      },
      html: {
        files: ["src/**/*.html"],
        tasks: ["web_swig"],
      },
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ["dist"],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: 'dist',
            routes: {
              "/node_modules": "node_modules",
            },
          },
        },
      },
    },
  });
  loadGruntTasks(grunt); // 自动加载所有的 grunt 插件中的任务

  grunt.registerTask("build", ["clean", "sass", "babel", "web_swig", 'imagemin', 'copy']);
  grunt.registerTask("default", ["build", "browserSync:dev", "watch"]); // 保证执行默认任务的时候会先编译一次后在 watch
};
