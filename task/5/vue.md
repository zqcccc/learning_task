1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

不是响应式数据，我们可以使用 `Vue.set()` 方法去让数据变成响应式，内部原理也是使用 `Object.defineProperty` 来让劫持属性的 getter 和 setter

2、请简述 Diff 算法的执行过程

updateChildren 中会去定义四个下标，两对前后下标分别指向新旧的 VNode 数组的第一和最后下标，
先比较新旧的第一个下标的元素，如果相同就会复用节点 patchVNode，如果有需要修改的值就修改，新旧的前下标都往后移一位

不相同就比较最后下标的元素，相同就是移动旧元素，然后 patchVNode，然后改变前或者后的下标，接着重新循环

如果是还不相同就比较第一下标的旧元素和最后下标的新元素，还不相同就比较最后的旧元素和第一个新元素，如果还是不相同就直接在旧元素中找新元素，如果找到了就将找到的旧元素移到旧的第一个下标前面，然后 patchVNode 复用旧元素，内部的值有需要修改的就修改，如果这找不到就让旧的第一个下标++，重复上面的步骤

后面直到新数组或者旧数组对应的前下标走到了后下标的后面，就停止循环，如果是旧数组没有被遍历完，就删除没有被遍历的节点，如果是新数组没有遍历完，那就将没有遍历的节点插入旧前下标之前
