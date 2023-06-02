import {mutableHandlers} from './baseHandlers'

export const reactiveMap = new WeakMap<object, any>()

/**
 * 入口
 * @param target 
 * @returns 
 */
export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

/**
 * 创建响应式对象
 * @param target 被代理的对象
 * @param baseHandlers 处理方法
 * @param proxyMap 存储已被代理的对象
 */
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  // 首先从proxyMap中获取被代理的对象是否存在
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 不存在则创建代理对象然后保存在proxyMap中
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}