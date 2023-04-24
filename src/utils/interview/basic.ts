// 1. 数组转树
const listData = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
  { id: 6, name: '部门6', pid: 0 },
  { id: 7, name: '部门7', pid: 2 }
];

interface ListItem {
  id: number;
  name: string;
  pid: number;
}

type TreeNode = ListItem & {
  children?: TreeNode[];
};

type RecursiveTreeNode = (list: ListItem[], id: number, tree?: TreeNode[]) => TreeNode[];

// 递归遍历数组
const recursiveArray2Tree: RecursiveTreeNode = (list, id, tree = []) => {
  for (const item of list) {
    if (item.pid === id) {
      const current: TreeNode = { ...item, children: [] };
      tree.push(current);
      recursiveArray2Tree(list, item.id, current.children);
    }
  }
  return tree;
};

console.log('递归产生:', recursiveArray2Tree(listData, 0));

type FunctionTreeNode = (list: ListItem[]) => TreeNode[];
type PickListItem = Pick<ListItem, 'id'>;
type CurrentMap = Record<PickListItem['id'], TreeNode>;

// 普通遍历数组
const array2Tree: FunctionTreeNode = (list) => {
  const currentMap: CurrentMap = {};
  const treeNodes: TreeNode[] = [];

  for (const item of list) {
    currentMap[item.id] = { ...item, children: [] };
  }

  for (const item of list) {
    const id = item.id;
    const pid = item.pid;
    const nodeItem = currentMap[id];

    if (item.pid === 0) {
      treeNodes.push(nodeItem);
    } else {
      currentMap[pid].children?.push(nodeItem);
    }
  }

  return treeNodes;
};

console.log('遍历产生:', array2Tree(listData));

// 2. 数组方法

const prev = [1, 2, 3, 4];
const next = [3, 4, 5, 6];
// 交集
function intersection(prev: number[], next: number[]) {
  const results = prev.filter((item) => next.includes(item));
  return results;
}

console.log('交集：', intersection(prev, next));

// 并集
function union(prev: number[], next: number[]) {
  const results = prev.concat(next.filter((item) => !prev.includes(item)));
  return results;
}

console.log('并集：', union(prev, next));

// 差集
function difference(prev: number[], next: number[]) {
  const results = prev.filter((item) => !next.includes(item)).concat(next.filter((item) => !prev.includes(item)));
  return results;
}

console.log('差集：', difference(prev, next));

// 普通去重
const array = [1, 2, 3, 4, 5, 6, 2, 4, 7, 8, 6];

function deduplication(arr: number[]) {
  const results = arr.reduce<number[]>((accumulate, current) => {
    if (!accumulate.includes(current)) {
      accumulate.push(current);
    }
    return accumulate;
  }, []);

  return results;
}

console.log('普通去重', deduplication(array));

// 3. 去重
const currentList = [
  { id: 0, value: '0' },
  { id: 1, value: '1' },
  { id: 2, value: '2' },
  { id: 3, value: '3' },
  { id: 4, value: '4' },
  { id: 5, value: '5' },
  { id: 6, value: '6' },
  { id: 0, value: '0' },
  { id: 2, value: '2' },
  { id: undefined, value: 'undefined' },
  { id: 4, value: '4' },
  { id: null, value: 'null' }
];

type IdKey = number | string | undefined | null;
interface CurrentItem {
  id: IdKey;
  value: string;
}

function deduplicate(arr: CurrentItem[]): CurrentItem[] {
  const results: CurrentItem[] = [];

  const complete = (results: CurrentItem[], id: IdKey) => {
    if (results.length === 0) {
      return false;
    }
    const result = results.find((item) => {
      if (item.id == null && id == null) {
        return true;
      }
      return item.id === id;
    });
    return result != null;
  };

  for (const item of arr) {
    if (!complete(results, item.id)) {
      results.push(item);
    }
  }

  return results;
}

console.log('去重：', deduplicate(currentList));

// 4. 柯里化
type FunctionType = (...args: any[]) => any;

function curry(func: FunctionType) {
  const len = func.length;

  return function circle(...args: any[]) {
    if (args.length < len) {
      return (...rest: any[]) => circle(...[...args, ...rest]);
    }

    return func(...args);
  };
}

function add(a: number, b: number, c: number) {
  return a + b + c;
}

const pure = curry(add);

console.log(pure(1, 2, 3));
console.log(pure(1, 2)(3));
console.log(pure(1)(2, 3));
console.log(pure(1)(2)(3));

// 5. 深拷贝
type DeepParams = Record<string, any> | Array<Record<string, any>>;

function deepClone<T = Record<string, any>>(o: T) {
  if (typeof o !== 'object' || o === null) {
    throw new Error('params must be a object');
  }

  const current: any = Array.isArray(o) ? [] : {};

  for (const [key, value] of Object.entries(o)) {
    if (typeof value === 'object' && value !== null) {
      current[key] = deepClone(value);
    } else {
      current[key] = value;
    }
  }

  return current;
}

const o = {
  a: 1,
  b: [2, [3, { b: 4 }, { c: 6 }]],
  d: { e: 7, f: { g: 8 }, h: null },
  i: null
};

console.log('深拷贝', deepClone<DeepParams>(o));

// 6. 数组扁平化
type FlattenParams = unknown[];

function flatten(array: FlattenParams) {
  const results: FlattenParams = array.reduce<FlattenParams>((accumulate, current) => {
    return accumulate.concat(Array.isArray(current) ? flatten(current) : current);
  }, []);

  return results;
}

function flat(arr: FlattenParams): FlattenParams {
  const results: FlattenParams = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      results.push(...flat(item));
    } else {
      results.push(item);
    }
  }
  return results;
}

const arrList = [1, 2, [3, 4, [5, 6]], 7, [8, 9]];
console.log('扁平化reduce：', flatten(arrList));
console.log('扁平化：', flat(arrList));

// 7. 数组乱序输入
function shuffle(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - i - 1)) + i;
    const temp = arr[randomIndex];
    arr[randomIndex] = arr[i];
    arr[i] = temp;
  }

  return arr;
}

const sortArr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log('乱序：', shuffle(sortArr));

// 8. 防抖、节流
export function debounce(func: (...args: any[]) => any, delay?: number) {
  let timer: any = null;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      func(...args);
    }, delay ?? 300);
  };
}

export function throttle(func: (...args: any[]) => any, delay?: number) {
  let prevDate = Date.now();
  return function (...args: any[]) {
    delay = delay ?? 300;
    const currentDate = Date.now();
    if (currentDate - prevDate >= delay) {
      prevDate = currentDate;
      func(...args);
    }
  };
}

// 9. 格式化日期
export type FormatDate = 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'YYYY年MM月DD日';
export type FormatTime = 'YYYY-MM-DD hh:mm:ss' | 'YYYY/MM/DD hh:mm:ss' | 'YYYY年MM月DD日 hh:mm:ss';
export type Format = FormatDate | FormatTime;
export interface DateOptions {
  timestamp?: number;
  dateTime?: string;
}

export class DateTime {
  private timestamp: number; // 时间戳
  private readonly dateTime: string; // 日期字符串

  constructor(options?: DateOptions) {
    const defaultOptions = { timestamp: Date.now(), dateTime: new Date().toLocaleString() };
    options = { ...defaultOptions, ...options };

    this.timestamp = options.timestamp!;
    this.dateTime = options.dateTime!;
  }

  // 时间戳转年月日
  private transformDate(format: FormatDate) {
    const date = new Date(this.timestamp);
    const Year = date.getFullYear();
    const Month = date.getMonth() + 1 >= 10 ? String(date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const Day = date.getDate() >= 10 ? String(date.getDate()) : `0${date.getDate()}`;

    const formatYear = format.replace('YYYY', `${Year}`);
    const formatMonth = formatYear.replace('MM', Month);
    const formatDay = formatMonth.replace('DD', Day);
    return formatDay;
  }

  // 时间戳转年月日 + 具体日期
  private transformTime(format: FormatTime) {
    const matchValue = format.match(/Y{4}[-/年]M{2}[-/月]D{2}[日]?/);
    const formatDate = this.transformDate(matchValue![0] as FormatDate);
    const formatTime = format.replace(matchValue![0], formatDate);

    const date = new Date(this.timestamp);
    const hours = date.getHours() >= 10 ? String(date.getHours()) : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? String(date.getMinutes()) : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? String(date.getSeconds()) : `0${date.getSeconds()}`;

    const formateHour = formatTime.replace('hh', hours);
    const formatMintutes = formateHour.replace('mm', minutes);
    const formatSeconds = formatMintutes.replace('ss', seconds);

    return formatSeconds;
  }

  // 获取时间戳
  private transformTimeStamp() {
    const currentTime = new Date(this.dateTime);
    return currentTime.valueOf();
  }

  // 通过 dateTime 字符串格式化日期
  private transformFormat(format: Format) {
    const timestamp = this.transformTimeStamp();
    this.timestamp = timestamp;

    if (format.match(/h{2}:m{2}:s{2}/)) {
      return this.transformTime(format as FormatTime);
    }
    return this.transformDate(format as FormatDate);
  }

  public static format(options?: DateOptions) {
    const dateTime = new DateTime(options);
    return {
      transformDate: dateTime.transformDate.bind(dateTime),
      transformTime: dateTime.transformTime.bind(dateTime),
      transformTimeStamp: dateTime.transformTimeStamp.bind(dateTime),
      transformFormat: dateTime.transformFormat.bind(dateTime)
    };
  }
}

console.log(DateTime.format().transformTime('YYYY-MM-DD hh:mm:ss'));
console.log(DateTime.format().transformTimeStamp());
console.log(DateTime.format({ dateTime: '2021/10/18' }).transformFormat('YYYY年MM月DD日 hh:mm:ss'));

// 10. 解析url
function parseParam(httpUrl?: string) {
  const received: Record<string, string> = {};

  const url = new URL(httpUrl ?? location.href);
  const params = new URLSearchParams(url.search);

  for (const [key, value] of params.entries()) {
    received[key] = value;
  }
  return received;
}

console.log(parseParam('https://example.com?foo=1&bar=2&name=&age=underfined'));
