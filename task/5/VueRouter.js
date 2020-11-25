
let _Vue = null
class VueRouter {
  // 1
  static install (Vue) {
    // 1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2 把Vue的构造函数记录在全局
    _Vue = Vue
    // 3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router // 不能直接这样写是因为 this 指向不对，这里的静态方法调用者一般是这个类，所以 this 一般指向 VueRouter
    _Vue.mixin({
      beforeCreate () {
        if (this.$options.router) { // 有 Vue.$options，Vue 的实例上是没有 $options 属性的
          _Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  // 2 构造需要的属性和 init 操作
  constructor (options) {
    this.options = options
    this.routeMap = {} // 解析之后 options 中会传入的 routes，key 就是路由地址，value 就是路由组件，这样就能找到路由对应的组件渲染到视图中了
    // observable
    this.data = _Vue.observable({ // 响应式
      current: '/'
    })
    this.init()
  }

  init () {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  // 3 也是 init
  createRouteMap () {
    // 遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponent (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },

      // 这里如果不是 render 函数而是 template 属性的话，需要 vue 去编译 template 成 render 函数，运行时版本 Vue 不包含编译器，不支持 template 模板，需要打包的时候提前编译，官方也推荐提前编译
      // 完整版：包含运行时和编译器，体积比运行时版本大 10k 左右，程序运行的时候把模板转换成 render 函数
      // 如果要使用完整版的话，在项目根目录下的 vue.config.js 中导出的对象中要有 runtimeCompiler 属性为 true，这样 vue-cli 就知道使用完整版的 vue 了，请参考 https://cli.vuejs.org/config/#runtimecompiler
      // 那还有一个问题就是，为什么使用运行时版本的时候，*.vue 文件也是用的模板却可以编译呢，那是因为开发工程中这个 cli 在打包的时候也是提前编译（预编译）了
      render (h) {
        return h('a', { // 这里也只是 h 函数的一种用法
          attrs: {
            href: window.location.href + '#' + this.to
          },
          on: {
            click: this.clickhander
          }
        }, [this.$slots.default])
      },
      methods: {
        clickhander (e) {
          history.pushState({}, '', '#' + this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template:"<a :href='to'><slot></slot><>"
    })
    const self = this
    Vue.component('router-view', { // router-view 就是一个占位符
      render (h) {
        // self.data.current
        const cm = self.routeMap[self.data.current]
        return h(cm)
      }
    })
  }

  initEvent () {
    // 处理点击前进后退按钮后，地址栏变化了但页面没有变化的问题，this.data 是响应式的
    window.addEventListener('hashchange', () => {
      this.data.current = window.location.hash.substr(1)
    })
  }
}

export default VueRouter
