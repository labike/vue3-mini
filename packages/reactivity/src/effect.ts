import { Dep, createDep } from "./dep"


type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    // 标记当前被执行的 effect
    activeEffect = this;
    return this.fn()
  }
}

/**
 * 依赖收集
 * @param target 
 * @param key 
 */
export function track(target: object, key: unknown) {
  // 用WeakMap存储响应式数据
  // weakMap的 key是响应式对象, 比如 key是obj = {name: 'ohayo}, value是Map对象,
  // Map的key是响应式对象的指定属性, 比如 name属性, value是指定对象的指定属性的执行函数, 比如effect()
  console.log('收集依赖')
  if (!activeEffect) return
  // depsMap是个Map对象
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 如果depsMap不存在则target为它的key, Map对象为它的value
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)

  // depsMap.set(key, activeEffect)
  // console.log('targetMap is', targetMap)
}

/**
 * 依赖触发
 * @param target 
 * @param key 
 * @param newValue 
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log('触发依赖')
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep: Dep | undefined = depsMap.get(key) as Dep
  if (!dep) return
  triggerEffects(dep)
}

/**
 * 利用dep依次跟踪指定key的所有effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/**
 * 依次触发dep中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]

  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/**
 * 触发指定依赖
 * @param effect 
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.fn()
}
