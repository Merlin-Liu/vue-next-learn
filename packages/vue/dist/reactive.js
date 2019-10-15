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

function hasOwn(target, key) {}

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

      return Reflect.get(target, key, receiver)
    },

    set(target, key, val, receiver) {
      console.log('设置！')

      const result = Reflect.set(target, key, val, receiver)
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

let proxy = reactive({ name: 'lgf' }) // 多层代理get时候递归 、需要记录一下，如果这个对象代理过了，就不要再代理了
console.log(proxy.name)
proxy.name = 'gfl'
console.log(proxy.name)
