1、Vue 3.0 性能提升主要是通过哪几方面体现的？

- 源码体积
  - 移除了冷门的 feature
  - 打包引入 tree-shaking
- 数据劫持优化
  - 改用 Proxy 可以劫持整个对象
- 编译优化
  - Vue3中标记和提升所有的静态根节点，diff的时候只需要对比动态节点内容
  - Patch flag 虚拟 DOM，不同的 flag 代表patch更新时只需要检查特定的内容
  - 缓存事件处理函数

2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

- 优化逻辑组织
  - 将某个逻辑关注点相关的代码全都放在一个函数里，这样当需要修改一个功能时，就不再需要在文件中跳来跳去。
- 优化逻辑复用
  - 在 Vue.js 2.x 中，我们通常会用 mixins 去复用逻辑，但有命名冲突和数据来源不清晰的问题
  - Composition 中可以将特定的逻辑抽出然后复用，复用的时候变量来源很清晰，也不会有命名冲突


3、Proxy 相对于 Object.defineProperty 有哪些优点？

- Proxy 可以监听到删除或者增加对象属性，Object.defineProperty 无法监听到
- Proxy 可以监听数组的变化，Object.defineProperty 无法监听到
- Object.defineProperty 拦截的是对象的属性，会改变原对象。proxy 是拦截整个对象，通过 new 生成一个新对象，不会改变原对象。
- Proxy 的拦截方式比 Object.defineProperty 多好多

4、Vue 3.0 在编译方面有哪些优化？

- 生成block tree
  - Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级的，单个组件内部需要遍历该组件的整个 vnode 树。
  - Vue.js 3.0 做到了通过编译阶段对静态模板的分析，编译生成了 Block tree。Block tree 是一个将模版基于动态节点指令切割的嵌套区块，每个区块内部的节点结构是固定的。每个区块只需要追踪自身包含的动态节点。
- slot编译优化
  - Vue.js 2.x 中，如果有一个组件传入了slot，那么每次父组件更新的时候，会强制使子组件update，造成性能的浪费。
  - Vue.js 3.0 优化了slot的生成，使得非动态slot中属性的更新只会触发子组件的更新。动态slot指的是在slot上面使用v-if，v-for，动态slot名字等会导致slot产生运行时动态变化但是又无法被子组件track的操作。
- diff算法优化
  - Patch flag，标记动态节点（记录节点内容、节点属性），diff时跳过静态根节点 只需关心动态节点内容
  - 缓存事件处理函数，减少了不必要的更新操作

5、Vue.js 3.0 响应式系统的实现原理？

### reactive

- 接受一个参数，判断参数不是对象直接返回，是对象就转换成代理对象
- 创建拦截器对象 handler，设置 get/set/deleteProperty
  - get 中收集依赖
  - set 和 deleteProperty 中去触发更新
- 返回 Proxy 对象

### 收集依赖

创建一个 weakMap 叫 targetMap，key 是目标对象，value 是 depsMap ，是正常的 Map

depsMap 中 key 是目标对象的属性名称，value 是 dep，是 set 类型，里面是 effect 的函数

收集依赖就是在创建 weakMap -> Map -> Set 的一个关系，

其中第一个 targetMap 用来记录目标对象和一个字典 depsMap

### ref

- 可以把基本类型数据转成响应式对象
- ref 返回的对象，重新赋值成对象也是响应式的
- reactive 返回的对象，重新赋值丢失响应式
- reactive 返回的对象不能解构赋值

### toRefs

接受一个 proxy 对象，我们这里一般就是和 reactive 函数一起使用

将属性都变成一个可以拿到原来 proxy 对象对应 key 的值的新对象

### computed

接受一个函数 getter 作为参数

在 effect 中调用参数函数，并把结果给到 ref 创建的对象的 value 上

最后把刚创建的 ref 对象返回

这个过程中，effect 传入了我们需要收集的函数，其中执行了 getter 函数并把结果赋值返回的操作，会被 getter 中的 reactive 过的对象访问过程中收集，这样下次 reactive 对象变化就会触发这个刚刚收集起来的函数，这就完成了以前的计算属性
