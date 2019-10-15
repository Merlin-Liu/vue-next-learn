// vue3响应式原理

// vue2响应式缺陷
// 1、默认递归defineReactive
// 2、数组改变length无效
// 3、对象不存在的属性不能被观察

// proxy缺点：兼容性差 IE11

// 判断是不是对象
function isObject(val) {
  return typeof val === 'object' && val !== null
}

const toProxy = new WeakMap() // key：原对象 val：代理的对象
const toRaw = new WeakMap() // key：代理的对象 val：原对象

function hasOwn(target, key) {
  return target.hasOwnProperty(key)
}

// vue3响应式的核心方法
function reactive(target) {
  // 创建响应式对象
  return createReactiveObject(target)
}
// 创建响应式对象
function createReactiveObject(target) {
  if (!isObject(target)) return target

  // 防止 一个target被多个代理，如果该target已经被代理过了，返回代理的对象
  let proxy = toProxy.get(target)
  if (proxy) return proxy

  // 防止代理过的对象再次被代理
  if (toRaw.has(target)) {
    return target // 此时的target已经是代理过的对象了
  }

  const baseHandler = {
    get(target, key, receiver) {
      console.log('取值！')
      const res = Reflect.get(target, key, receiver)

      // 依赖收集，把key和依赖这个key的effect关联起来
      track(target, key);

      return isObject(res) ? reactive(res) : res
    },

    set(target, key, val, receiver) {
      const hadKey = hasOwn(target, key)
      const oldVal = target[key]

      const result = Reflect.set(target, key, val, receiver)

      if (!hadKey) { // 判断属性是否存在
        console.log('新增属性！')
      }
      else if (oldVal !== val) { // 判断前后修改的值是否相等，为了屏蔽无意义的修改
        console.log('修改属性！')
      }

      return result
    },

    deleteProperty(target, key) {
      console.log('删除！')

      const res = Reflect.defineProperty(target, key)
      return res
    }
  }

  return (proxy = new Proxy(target, baseHandler))
  toProxy.set(target, observed)
  toRaw.set(observed, target)

}

// 栈 先进后出
const activeReactiveEffectStack = [] // 存储
function effect(fn) {
  // 需要把fn包装成响应式的
  const effect = createReactiveEffect(fn)
  effect() // 默认先执行一次
}
function createReactiveEffect(fn) {
  const effect = function () {
    // run中做了两件事情
    // 1、执行fn
    // 2、把这个effect压入栈中
    return run(effect, fn);
  }

  return effect
}
function run (effect, fn) {
  fn()

  activeReactiveEffectStack.push(effect)
}

// 代理对象
// let proxy = reactive({ name: 'lgf' }) // 多层代理get时候递归 、需要记录一下，如果这个对象代理过了，就不要再代理了
// console.log(proxy.name)
// proxy.name = 'gfl'
// console.log(proxy.name)

// 代理数组
// let array = reactive([1, 2, 3])
// array.push(12)
// array.length = 1212

// 依赖收集 或者叫 发布订阅
const obj = {name: 'liuguangfu'}
effect(() => { // effect 会执行两次，默认先执行一次，之后依赖的数据变化了，再进行响应
  console.log(obj.name) // 会走到obj的get方法，在get中收集依赖
})
obj.name = 'lgf'
