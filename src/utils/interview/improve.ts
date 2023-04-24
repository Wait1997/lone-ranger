// 1. 快速排序
function quickSort(array: number[]) {
  return quick(array, 0, array.length - 1);
}

function quick(array: number[], left: number, right: number) {
  let index;

  if (array.length > 1) {
    index = partition(array, left, right);
    if (left < index - 1) {
      quick(array, left, index - 1);
    }
    if (right > index) {
      quick(array, index, right);
    }
  }

  return array;
}

function partition(array: number[], left: number, right: number) {
  const pivot = array[Math.floor((left + right) / 2)];
  let i = left;
  let j = right;
  while (i <= j) {
    while (array[i] < pivot) {
      i++;
    }
    while (array[j] > pivot) {
      j--;
    }

    if (i <= j) {
      const temp = array[j];
      array[j] = array[i];
      array[i] = temp;
      i++;
      j--;
    }
  }
  return i;
}

// 归并排序
function merge(left: number[], right: number[]): number[] {
  const result = [];
  while (left.length > 0 && right.length > 0) {
    left[0] < right[0] ? result.push(left.shift()) : result.push(right.shift());
  }
  return [...result, ...left, ...right] as number[];
}

function mergeSort(arr: number[]): number[] {
  if (arr.length > 1) {
    const { length } = arr;
    const middle = Math.floor(length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle, length));
    return merge(left, right);
  }
  return arr;
}

// 选择排序
// 首先找到最小的值所对应的下标 在进行值的交换
function selectSort(array: number[]): number[] {
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let k = i + 1; k < array.length; k++) {
      if (array[min] > array[k]) {
        min = k;
      }
    }
    // 如果当前i就是最小值则不需要交换
    if (min !== i) {
      const temp = array[min];
      array[min] = array[i];
      array[i] = temp;
    }
  }
  return array;
}

const arr = [8, 3, 1, 4, 2, 6, 5, 7];

console.log(quickSort(arr));
console.log(mergeSort(arr));
console.log(selectSort(arr));

// 2. 字符串出现的不重复最长长度
function longestSubstringLength(str: string): number {
  let maxLen = 0;
  let start = 0;
  const results = [];
  const charMap = new Map<string, number>();

  for (let i = 0; i < str.length; i++) {
    const ch = str.charAt(i);
    if (charMap.has(ch) && charMap.get(ch)! >= start) {
      start = charMap.get(ch)! + 1;
    }
    charMap.set(ch, i);
    maxLen = Math.max(maxLen, i - start + 1);
    if (maxLen >= results.length) {
      results.splice(0, results.length);
      for (const item of charMap.keys()) {
        results.push(item);
      }
    }
  }
  console.log(results);
  return maxLen;
}
// 这段代码使用了滑动窗口的思想，在遍历字符串时，用一个Map来记录每个字符最后一次出现的位置，当遇到重复字符时，将窗口起始位置移动到重复字符的下一个位置，同时更新Map中对应字符的位置。最后返回最长子串的长度

const str = 'abcabcdbb';
const len = longestSubstringLength(str);
console.log(len); // 输出3，因为最长的不重复子串是'abc'

// 3. fibonacci数列
{
  function fibonacci(n: number): number {
    if (n === 1 || n === 2) {
      return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  console.log(fibonacci(10)); // 55
}

{
  function fibonacci(n: number): number {
    const fib = (n: number, v1: number, v2: number): number => {
      if (n === 1) {
        return v1;
      }
      if (n === 2) {
        return v2;
      }
      return fib(n - 1, v2, v1 + v2);
    };

    return fib(n, 1, 1);
  }
  console.log(fibonacci(10)); // 55
}

{
  function fibonacci() {
    const memo: Record<number, number> = { 1: 1, 2: 1 };

    return function fib(n: number) {
      if (n === 1) {
        return memo[1];
      }
      if (n === 2) {
        return memo[2];
      }
      if (memo[n] === undefined) {
        memo[n] = fib(n - 1) + fib(n - 2);
      }
      return memo[n];
    };
  }
  console.log(fibonacci()(10)); // 55
}

{
  function fibonacci(n: number): number {
    let n1 = 1;
    let n2 = 1;

    if (n <= 2) {
      return 1;
    }

    for (let i = 2; i < n; i++) {
      [n1, n2] = [n2, n1 + n2];
    }

    return n2;
  }
  console.log(fibonacci(10)); // 55
}
