const hasOwnProperty = Object.prototype.hasOwnProperty;
const is = (a: any, b: any) => Object.is(a, b);

export function isPlainObject(obj: any) {
  if (typeof obj !== 'object' || obj === null) return false;

  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

export function shallowEqual(a: any, b: any): boolean {
  if (is(a, b)) {
    return true;
  }

  // 基本类型的判断以及function类型
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    // 这里判断做两件事情 1. 判断b的对象属性中是否存在a对象属性，来判断a、b对象的属性是否一致 2. 判断a、b属性的值是否相等
    if (!hasOwnProperty.call(b, currentKey) || !is(a[currentKey], b[currentKey])) {
      return false;
    }
  }

  return true;
}
