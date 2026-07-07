# Day 9 · 单调栈与堆

> **日期：** 2026-07-06
> **学习目标：** 单调栈与堆（优先队列）的应用
> **相关知识页：** [[02-Wiki/专题总结/06-栈与堆]] · [[02-Wiki/专题总结/02-双指针与滑动窗口]]

---

## 一、今日模板回顾

### 单调栈模板
```python
stack = []
for i in range(len(nums)):
    while stack and nums[stack[-1]] < nums[i]:
        idx = stack.pop()
        res[idx] = nums[i]
    stack.append(i)
```

### 堆操作
```python
import heapq
heapq.heappush(heap, val)   # 入堆
val = heapq.heappop(heap)    # 出堆
# 大根堆：存负值
heapq.heappush(heap, -val)
```

### 双堆求中位数
```python
# small: 大根堆（存负值），存较小一半
# large: 小根堆，存较大一半
# 保持 len(small) >= len(large) 且 small 最大 <= large 最小
```

---

## 二、做题记录

### 1. 每日温度（Medium）
- **核心思路：** 单调递减栈保存“还没等到更高温度的下标”；当前温度更高时，弹出旧下标并用 `i - prev` 结算等待天数。
- **代码实现：** `while stack and temperatures[i] > temperatures[stack[-1]]: prev = stack.pop(); ans[prev] = i - prev`
- **复杂度：** O(n) / O(n)
- **掌握程度：** ✅
- **感悟/易错点：** 栈里存下标，不存温度；因为题目要的是隔几天，以及答案要写回哪个位置。

### 2. 柱状图中最大的矩形（Hard）
- **核心思路：** 单调递增栈保存还没找到右边第一个更矮柱子的下标；遇到更矮柱子时，弹出栈顶并结算该柱子作为高度的最大矩形。
- **代码实现：** 加左右哨兵 `0`；出栈时 `height = heights[mid]`，`width = i - stack[-1] - 1`，用 `height * width` 更新最大面积。
- **复杂度：** O(n) / O(n)
- **掌握程度：** 🔄
- **感悟/易错点：** 当前更矮柱子是右边界，弹出后的新栈顶是左边界；左右两个更矮柱子不能算进矩形。

### 3. 数组中的第 K 个最大元素（Medium）
- **核心思路：** 小根堆维护当前最大的 k 个元素；也可以用快速选择，把第 k 大转成升序下标 `len(nums) - k`。
- **代码实现：** 堆做法：`heappush` 后如果长度超过 k 就 `heappop`；快选做法：`partition` 返回 pivot 最终下标 `p`，根据 `p` 和 `target` 缩小区间。
- **复杂度：** 堆 O(n log k) / O(k)；快选平均 O(n) / O(1)，最坏 O(n^2)
- **掌握程度：** 🔄
- **感悟/易错点：** `store` 表示前面有多少个数小于 pivot，pivot 最终应该放在 `store`；`p < target` 去右边，`p > target` 去左边。

### 4. 前 K 个高频元素（Medium）
- **核心思路：** 先用 `Counter` 统计频率；堆做法维护大小为 k 的 `(freq, num)` 小根堆，桶排序做法把频率当桶下标。
- **代码实现：** 更推荐桶排序：`buckets[freq].append(num)`，再从高频桶向低频桶收集 k 个元素。
- **复杂度：** 桶排序 O(n) / O(n)；堆 O(n log k) / O(n)
- **掌握程度：** ✅
- **感悟/易错点：** 堆里要放 `(freq, num)`，因为比较的是出现频率；桶排序成立是因为频率最大不会超过 n。

### 5. 数据流的中位数（Hard）
- **核心思路：** 双堆维护数据流的左右两半：`small` 保存较小一半的大根堆，`large` 保存较大一半的小根堆。
- **代码实现：** Python 里 `small` 存负数；保持 `len(small) >= len(large)` 且最多多 1，并保证 `small` 最大值不超过 `large` 最小值。
- **复杂度：** `addNum` O(log n)，`findMedian` O(1)，空间 O(n)
- **掌握程度：** 🔄
- **感悟/易错点：** 奇数时中位数是 `-small[0]`；偶数时是 `(-small[0] + large[0]) / 2`。

---

## 三、今日总结

**学到的新模板/技巧：**
- 单调栈：保存还没找到边界的位置，出栈时结算答案。
- 柱状图：当前更矮柱子给右边界，弹出后的栈顶给左边界。
- Top K：小根堆维护 k 个最大/最高频元素。
- 快速选择：第 k 大转成升序下标 `len(nums) - k`，通过 pivot 下标缩小搜索范围。
- 桶排序：频率可以作为桶下标，从高频往低频收集答案。
- 双堆：较小一半用大根堆，较大一半用小根堆，中位数只看堆顶。

**遇到的困难：**
- 84 中 `width = i - stack[-1] - 1` 的左右边界含义需要继续复盘。
- 215 快速选择里的 `partition`、`store` 和 `target` 判断需要再做一遍手推。

**遗留问题（需复习）：**
- 复习 84：为什么“当前柱子是右边界，弹出后的栈顶是左边界”。
- 复习 215：`target = len(nums) - k`，以及 `p < target` / `p > target` 时搜索方向。

**整体感受：** 😊
