一、简答题

1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

- 准备阶段，解析 config 和 shell 中的配置项，覆盖默认配置处理得到 options，根据 options 生成 compiler
- 逐层识别模块依赖（包括 Commonjs、AMD、或 ES6 的 import 等，都会被识别和分析）
- 分析代码，转换代码，编译代码，最后输出代码

（1）初始化参数

解析 Webpack 配置参数，合并 Shell 传入和 webpack.config.js 文件配置的参数，形成最后的配置结果。

（2）开始编译

上一步得到的参数初始化 compiler 对象，注册所有配置的插件，插件监听 Webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译。

（3）确定入口

从配置文件（ webpack.config.js ）中指定的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。

（4）编译模块

递归中根据文件类型和 loader 配置，调用所有配置的 loader 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。

（5）完成模块编译并输出

递归完后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 entry 配置生成代码块 chunk 。

2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

plugin 可以在任何一个流程节点出现，loader 有特定的活动范围，plugin 可以做和源码无关的事，比如监控，loader 能解析源码变成标准模块。

loader 也是一个 node 模块，它导出一个函数，该函数的参数是 require 的源模块，处理 source 后把返回值交给下一个 loader

写 plugin 的时候先看一下 tapable 这个库，实现了类似事件管理的机制，然后再看看 webpack 源码，往 webpack 各个钩子上挂想做的事