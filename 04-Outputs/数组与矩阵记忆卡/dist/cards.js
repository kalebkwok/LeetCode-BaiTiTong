window.REVIEW_LIBRARY = {
  "version": 1,
  "topics": [
    {
      "id": "hash-01",
      "number": "01",
      "title": "哈希表",
      "content": "decks/01-cards.json",
      "concepts": [
        {
          "id": "01-lookup",
          "title": "把历史变成可查询的记录",
          "explanation": "先确定键和值各自保存什么；查询放在写入之前还是之后，决定会不会用到自己。",
          "example": "两数之和保存 值→下标；子数组计数保存 前缀和→次数。"
        },
        {
          "id": "01-signature",
          "title": "用同一种表示识别同类",
          "explanation": "两个对象按同一规则归一化后相同，就能比较或分组。",
          "example": "eat 与 tea 排序后都是 aet；次数统计则是另一种规范表示。"
        },
        {
          "id": "01-boundary",
          "title": "只从边界出发，或明确数据边界",
          "explanation": "避免重复工作与歧义，都需要先把边界定义清楚。",
          "example": "连续序列只从没有前驱的数开始；字符串编码先写长度再写正文。"
        }
      ],
      "source": "02-Wiki/专题总结/01-哈希表.md",
      "connectionRule": "按“键代表什么”连接：出现过的值、归一化特征、前缀状态，最后再看怎样编码结构。",
      "groups": [
        {
          "id": "lookup",
          "title": "把历史变成可查询的记录",
          "description": "先确定键和值各自保存什么；查询放在写入之前还是之后，决定会不会用到自己。",
          "example": "两数之和保存 值→下标；子数组计数保存 前缀和→次数。"
        },
        {
          "id": "signature",
          "title": "用同一种表示识别同类",
          "description": "两个对象按同一规则归一化后相同，就能比较或分组。",
          "example": "eat 与 tea 排序后都是 aet；次数统计则是另一种规范表示。"
        },
        {
          "id": "boundary",
          "title": "只从边界出发，或明确数据边界",
          "description": "避免重复工作与歧义，都需要先把边界定义清楚。",
          "example": "连续序列只从没有前驱的数开始；字符串编码先写长度再写正文。"
        }
      ],
      "firstProblems": [
        217,
        1,
        242
      ],
      "cards": [
        {
          "uid": "lc-217",
          "id": 217,
          "group": "lookup",
          "title": "存在重复元素",
          "level": "Easy",
          "prompt": "给定整数数组 nums，判断其中是否存在任意一个元素至少出现两次。",
          "example": "输入：nums=[1,2,3,1]\n输出：True",
          "hint": "先问自己：先确定键和值各自保存什么；查询放在写入之前还是之后，决定会不会用到自己。",
          "recognition": "判断重复只需要知道以前是否出现",
          "mnemonic": "见过就停，没见就记。",
          "why": "判断重复只需要知道以前是否出现。seen 恰好包含当前位置之前的不同数字。",
          "invariant": "seen 恰好包含当前位置之前的不同数字。",
          "steps": [
            "初始化空集合",
            "先检查当前值是否在集合",
            "不存在才加入，全部扫描完返回 False"
          ],
          "trace": "nums = [1, 2, 3, 1]\n\nseen = {1, 2, 3}\n再次读到 1，1 已在 seen 中\n\n答案：True\n\n手推时记录：seen 恰好包含当前位置之前的不同数字。\n\n边界检查：为什么不能先 add 再检查当前数字？\n加入后当前数必然在集合里，会把第一个数字就误判为重复。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能先 add 再检查当前数字？\n加入后当前数必然在集合里，会把第一个数字就误判为重复。",
          "complexity": "时间 O(n)，额外空间 O(n)。",
          "prerequisites": [
            "01-lookup"
          ],
          "related": [
            {
              "id": 1,
              "kind": "递进",
              "why": "217 只保存“出现过”；1 还要保存下标，并查询 target−x 这一互补关系。"
            },
            {
              "id": 128,
              "kind": "前置",
              "why": "先用 217 的集合去重，再利用 x−1 是否存在识别连续段的唯一入口。"
            },
            {
              "id": 287,
              "kind": "空间限制变化",
              "why": "217 可用集合直接判重复；287 在特殊值域与常数空间约束下，借函数图找环入口定位重复值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能先 add 再检查当前数字？",
            "answer": "加入后当前数必然在集合里，会把第一个数字就误判为重复。"
          },
          "source": "02-Wiki/题目详解/217-存在重复元素.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        seen = set()\n\n        for num in nums:\n            if num in seen:\n                return True\n            seen.add(num)\n\n        return False",
          "url": "https://leetcode.cn/problems/contains-duplicate/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/217-%E5%AD%98%E5%9C%A8%E9%87%8D%E5%A4%8D%E5%85%83%E7%B4%A0.md",
          "sourceHash": "9ae9b0ea6dfbc0a9a9486ee9efe9a1252b24ee9c0a6f4e371a669764536e93d1"
        },
        {
          "uid": "lc-1",
          "id": 1,
          "group": "lookup",
          "title": "两数之和",
          "level": "Easy",
          "prompt": "给定一个整数数组 nums 和一个整数目标值 target，请在该数组中找出和为目标值的两个整数，并返回它们的数组下标。\n\n你可以假设每种输入只会对应一个答案（即一定有解，且解唯一）。但是，数组中同一个元素不能使用两遍。",
          "example": "输入：nums = [2, 7, 11, 15], target = 9\n输出：[0, 1]",
          "hint": "先问自己：先确定键和值各自保存什么；查询放在写入之前还是之后，决定会不会用到自己。",
          "recognition": "找互补的一对下标且不能复用自己",
          "mnemonic": "先查补数，再记自己。",
          "why": "找互补的一对下标且不能复用自己。seen 只存已经经过的下标，当前元素尚未入表。",
          "invariant": "seen 只存已经经过的下标，当前元素尚未入表。",
          "steps": [
            "计算 target−num",
            "查到补数就返回两下标",
            "否则保存当前值及下标"
          ],
          "trace": "输入：nums = [2, 7, 11, 15], target = 9\n输出：[0, 1]\n解释：因为 nums[0] + nums[1] == 9\n\n手推时记录：seen 只存已经经过的下标，当前元素尚未入表。\n\n边界检查：nums=[3,3]、target=6 为什么可以找到两个不同位置？\n第一个 3 查不到补数，保存下标 0；第二个 3 查到先前下标 0，返回 [0,1]，没有复用当前元素。",
          "traceLabel": "例子与边界推演",
          "trap": "nums=[3,3]、target=6 为什么可以找到两个不同位置？\n第一个 3 查不到补数，保存下标 0；第二个 3 查到先前下标 0，返回 [0,1]，没有复用当前元素。",
          "complexity": "平均时间 O(n)，空间 O(n)。",
          "prerequisites": [
            "01-lookup"
          ],
          "related": [
            {
              "id": 217,
              "kind": "递进",
              "why": "217 只保存“出现过”；1 还要保存下标，并查询 target−x 这一互补关系。"
            },
            {
              "id": 560,
              "kind": "迁移",
              "why": "两题都先查历史再写当前；1 查互补值，560 查相差 k 的前缀和，并累加出现次数。"
            },
            {
              "id": 167,
              "kind": "条件变化",
              "why": "同样找两数之和：1 无序用哈希记录历史；167 已有序，可以用大小关系移动两端并省去哈希空间。"
            },
            {
              "id": 146,
              "kind": "组合",
              "why": "1 用哈希快速查下标；146 用哈希快速查双链节点，再借链表完成 O(1) 次序更新。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "nums=[3,3]、target=6 为什么可以找到两个不同位置？",
            "answer": "第一个 3 查不到补数，保存下标 0；第二个 3 查到先前下标 0，返回 [0,1]，没有复用当前元素。"
          },
          "source": "02-Wiki/题目详解/1-两数之和.md",
          "codeBlock": 2,
          "code": "def twoSum(nums, target):\n    \"\"\"\n    一遍哈希表解法\n    - seen: 记录已遍历过的 {值: 下标}\n    - 对每个元素 num, 检查 target - num 是否已在 seen 中\n    \"\"\"\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
          "url": "https://leetcode.cn/problems/two-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1-%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C.md",
          "sourceHash": "60dcf7e6bc884a39eb5da20155b7720e7900e24bb92785b28393c833c3ec715b"
        },
        {
          "uid": "lc-242",
          "id": 242,
          "group": "signature",
          "title": "有效的字母异位词",
          "level": "Easy",
          "prompt": "给定字符串 s 和 t，判断 t 是否是 s 的字母异位词。\n\n字母异位词要求两串包含的每种字符及其出现次数完全相同，字符顺序可以不同。",
          "example": "输入：s=\"anagram\", t=\"nagaram\"\n输出：True",
          "hint": "先问自己：两个对象按同一规则归一化后相同，就能比较或分组。",
          "recognition": "两个字符串是否由相同字符组成且次数一致",
          "mnemonic": "比频次，不比顺序。",
          "why": "两个字符串是否由相同字符组成且次数一致。两个 Counter 分别完整记录两个字符串的字符出现次数。",
          "invariant": "两个 Counter 分别完整记录两个字符串的字符出现次数。",
          "steps": [
            "长度不等直接失败",
            "分别统计字符次数",
            "比较两个计数器"
          ],
          "trace": "s = \"anagram\", t = \"nagaram\"\n\nCounter(s) = {a: 3, n: 1, g: 1, r: 1, m: 1}\nCounter(t) = {n: 1, a: 3, g: 1, r: 1, m: 1}\n\n频次相同，答案：True\n\n手推时记录：两个 Counter 分别完整记录两个字符串的字符出现次数。\n\n边界检查：ab 与 aab 的字符集合相同，为什么不是异位词？\n异位词要求每个字符的次数也相同，集合会丢掉重复次数；a 的次数分别为 1 和 2。",
          "traceLabel": "例子与边界推演",
          "trap": "ab 与 aab 的字符集合相同，为什么不是异位词？\n异位词要求每个字符的次数也相同，集合会丢掉重复次数；a 的次数分别为 1 和 2。",
          "complexity": "时间 O(n+m)，空间 O(Σ)，Σ 为字符种类数。",
          "prerequisites": [
            "01-signature"
          ],
          "related": [
            {
              "id": 49,
              "kind": "递进",
              "why": "242 比较两个频次表示；49 把多个单词按统一表示归入同一组。"
            },
            {
              "id": 438,
              "kind": "迁移",
              "why": "242 比较整串频次；438 把其中一个频次表改为随窗口一入一出动态维护。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "ab 与 aab 的字符集合相同，为什么不是异位词？",
            "answer": "异位词要求每个字符的次数也相同，集合会丢掉重复次数；a 的次数分别为 1 和 2。"
          },
          "source": "02-Wiki/题目详解/242-有效的字母异位词.md",
          "codeBlock": 0,
          "code": "from collections import Counter\n\n\nclass Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t):\n            return False\n\n        return Counter(s) == Counter(t)",
          "url": "https://leetcode.cn/problems/valid-anagram/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/242-%E6%9C%89%E6%95%88%E7%9A%84%E5%AD%97%E6%AF%8D%E5%BC%82%E4%BD%8D%E8%AF%8D.md",
          "sourceHash": "44fa89a62a6111cae3031203f18d4889748c6fce698cc45f60029eddb79161b4"
        },
        {
          "uid": "lc-560",
          "id": 560,
          "group": "lookup",
          "title": "和为 K 的子数组",
          "level": "Medium",
          "prompt": "整数数组 nums 可含负数和零。统计和恰好为 k 的非空连续子数组个数。",
          "example": "输入：nums = [1,1,1], k = 2\n输出：2",
          "hint": "先问自己：先确定键和值各自保存什么；查询放在写入之前还是之后，决定会不会用到自己。",
          "recognition": "有负数且要数连续段的和",
          "mnemonic": "前缀做减法，次数用哈希加。",
          "why": "有负数且要数连续段的和。prefix 只记录当前前缀之前各前缀和出现的次数，初始 0 出现一次。",
          "invariant": "prefix 只记录当前前缀之前各前缀和出现的次数，初始 0 出现一次。",
          "steps": [
            "prefix={0:1}",
            "累加 cur 并把 prefix[cur−k] 加入答案",
            "最后把当前 cur 的出现次数加一"
          ],
          "trace": "输入：nums = [1,1,1], k = 2\n输出：2\n解释：[1,1] 出现两次（索引 0~1 和 1~2）\n\n手推时记录：prefix 只记录当前前缀之前各前缀和出现的次数，初始 0 出现一次。\n\n边界检查：为什么初始化 {0:1}，且必须先查再记？\n空前缀让从下标 0 开始、和为 k 的段也被统计。先记再查会在 k=0 时把长度为零的段误计进去。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么初始化 {0:1}，且必须先查再记？\n空前缀让从下标 0 开始、和为 k 的段也被统计。先记再查会在 k=0 时把长度为零的段误计进去。",
          "complexity": "时间 O(n)，空间 O(n)。",
          "prerequisites": [
            "01-lookup"
          ],
          "related": [
            {
              "id": 1,
              "kind": "迁移",
              "why": "两题都先查历史再写当前；1 查互补值，560 查相差 k 的前缀和，并累加出现次数。"
            },
            {
              "id": 76,
              "kind": "适用边界",
              "why": "76 的计数覆盖可随窗口收缩判断；560 数组可含负数，和没有单调性，应查前缀和频次。"
            },
            {
              "id": 437,
              "kind": "迁移",
              "why": "437 把数组的前缀和计数搬到树上；由于树有分支，新增了回溯时撤销前缀的要求。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么初始化 {0:1}，且必须先查再记？",
            "answer": "空前缀让从下标 0 开始、和为 k 的段也被统计。先记再查会在 k=0 时把长度为零的段误计进去。"
          },
          "source": "02-Wiki/题目详解/560-和为K的子数组.md",
          "codeBlock": 0,
          "code": "def subarraySum(nums, k):\n    # 哈希表记录：前缀和 -> 出现次数\n    prefix = {0: 1}\n    cur_sum = 0  # 当前前缀和\n    count = 0     # 满足条件的子数组个数\n    \n    for num in nums:\n        cur_sum += num                 # 更新前缀和\n        # 如果存在 cur_sum - k，说明有子数组的和为 k\n        if cur_sum - k in prefix:\n            count += prefix[cur_sum - k]\n        # 将当前前缀和存入哈希表\n        prefix[cur_sum] = prefix.get(cur_sum, 0) + 1\n    \n    return count",
          "url": "https://leetcode.cn/problems/subarray-sum-equals-k/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/560-%E5%92%8C%E4%B8%BAK%E7%9A%84%E5%AD%90%E6%95%B0%E7%BB%84.md",
          "sourceHash": "ebb6c17d7204ce7691120272dbc016d5114810121e2d016b00300dd2e5fb54f2"
        },
        {
          "uid": "lc-49",
          "id": 49,
          "group": "signature",
          "title": "字母异位词分组",
          "level": "Medium",
          "prompt": "给你一个字符串数组，请你将字母异位词组合在一起。字母异位词指字母相同但排列不同的字符串。",
          "example": "输入: strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]\n输出: [[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]",
          "hint": "先问自己：两个对象按同一规则归一化后相同，就能比较或分组。",
          "recognition": "把多个异位词分组",
          "mnemonic": "排序后的串就是同一把钥匙。",
          "why": "把多个异位词分组。同一个排序键对应的列表内，所有单词都含有完全相同的字符多重集。",
          "invariant": "同一个排序键对应的列表内，所有单词都含有完全相同的字符多重集。",
          "steps": [
            "对每个词排序生成键",
            "把原单词放入该键的列表",
            "返回全部分组"
          ],
          "trace": "输入: strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]\n输出: [[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]\n\n手推时记录：同一个排序键对应的列表内，所有单词都含有完全相同的字符多重集。\n\n边界检查：为什么键不能只用字符集合？例如 ab 与 aab。\n集合丢失重复次数，会把不相同的多重集合并。排序键分别为 ab 和 aab，可以区分。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么键不能只用字符集合？例如 ab 与 aab。\n集合丢失重复次数，会把不相同的多重集合并。排序键分别为 ab 和 aab，可以区分。",
          "complexity": "n 个单词、最长 k：时间 O(nk log k)，含存储键和分组的空间 O(nk)。",
          "prerequisites": [
            "01-signature"
          ],
          "related": [
            {
              "id": 242,
              "kind": "递进",
              "why": "242 比较两个频次表示；49 把多个单词按统一表示归入同一组。"
            },
            {
              "id": 271,
              "kind": "易混淆",
              "why": "49 的键允许丢掉字符顺序，因为只需识别同类；271 编码必须无损恢复原串及其边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么键不能只用字符集合？例如 ab 与 aab。",
            "answer": "集合丢失重复次数，会把不相同的多重集合并。排序键分别为 ab 和 aab，可以区分。"
          },
          "source": "02-Wiki/题目详解/49-字母异位词分组.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\n\ndef groupAnagrams(strs):\n    \"\"\"\n    排序法：key = 排序后的字符串\n    \"\"\"\n    groups = defaultdict(list)\n    for s in strs:\n        # 排序后的字符串作为分组标识\n        key = ''.join(sorted(s))\n        groups[key].append(s)\n    return list(groups.values())",
          "url": "https://leetcode.cn/problems/group-anagrams/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/49-%E5%AD%97%E6%AF%8D%E5%BC%82%E4%BD%8D%E8%AF%8D%E5%88%86%E7%BB%84.md",
          "sourceHash": "f85719da14b800e40716d9ed89ffdb3d6a44a46c4bb39eb0f4be692b05b2e4ba"
        },
        {
          "uid": "lc-128",
          "id": 128,
          "group": "boundary",
          "title": "最长连续序列",
          "level": "Medium",
          "prompt": "给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。\n\n请你设计并实现时间复杂度为 O(n) 的算法解决此问题。",
          "example": "输入：nums = [100, 4, 200, 1, 3, 2]\n输出：4",
          "hint": "先问自己：避免重复工作与歧义，都需要先把边界定义清楚。",
          "recognition": "无序数组找数值连续的最长段",
          "mnemonic": "没有前驱，才开始向后数。",
          "why": "无序数组找数值连续的最长段。仅当 x−1 不在集合时才扩展，因此每条连续序列只从最小值扫描一次。",
          "invariant": "仅当 x−1 不在集合时才扩展，因此每条连续序列只从最小值扫描一次。",
          "steps": [
            "先用集合去重",
            "跳过存在前驱的数",
            "从真正起点扩展并更新最长长度"
          ],
          "trace": "输入：nums = [100, 4, 200, 1, 3, 2]\n输出：4\n解释：最长数字连续序列是 [1, 2, 3, 4]，长度为 4\n\n手推时记录：仅当 x−1 不在集合时才扩展，因此每条连续序列只从最小值扫描一次。\n\n边界检查：若从每个数都向后找，连续数组 1…n 会发生什么？\n会反复扫描同一后缀，总工作变为 n+(n−1)+…+1。只从 1 扩展时，每个数只被这条扫描访问一次。",
          "traceLabel": "例子与边界推演",
          "trap": "若从每个数都向后找，连续数组 1…n 会发生什么？\n会反复扫描同一后缀，总工作变为 n+(n−1)+…+1。只从 1 扩展时，每个数只被这条扫描访问一次。",
          "complexity": "平均时间 O(n)，空间 O(n)。",
          "prerequisites": [
            "01-boundary"
          ],
          "related": [
            {
              "id": 217,
              "kind": "前置",
              "why": "先用 217 的集合去重，再利用 x−1 是否存在识别连续段的唯一入口。"
            },
            {
              "id": 846,
              "kind": "连续性与次数",
              "why": "128 集合去重后找最长连续段；846 必须保留牌的次数，并让所有牌按固定组长耗尽。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "若从每个数都向后找，连续数组 1…n 会发生什么？",
            "answer": "会反复扫描同一后缀，总工作变为 n+(n−1)+…+1。只从 1 扩展时，每个数只被这条扫描访问一次。"
          },
          "source": "02-Wiki/题目详解/128-最长连续序列.md",
          "codeBlock": 0,
          "code": "def longestConsecutive(nums):\n    \"\"\"\n    哈希集合 + 起点查找\n    只从序列的起点开始向后延伸\n    \n    步骤：\n    1. 将所有元素放入集合（去重）\n    2. 遍历集合，只对 num-1 不在集合中的元素（即起点）进行延伸\n    3. while 循环检查 current+1 是否在集合中\n    4. 更新全局最大长度\n    \"\"\"\n    num_set = set(nums)\n    longest = 0\n    \n    for num in num_set:\n        # 只从序列起点开始查找\n        if num - 1 not in num_set:\n            current = num\n            length = 1\n            \n            # 向后延伸，查找连续数字\n            while current + 1 in num_set:\n                current += 1\n                length += 1\n            \n            longest = max(longest, length)\n    \n    return longest",
          "url": "https://leetcode.cn/problems/longest-consecutive-sequence/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/128-%E6%9C%80%E9%95%BF%E8%BF%9E%E7%BB%AD%E5%BA%8F%E5%88%97.md",
          "sourceHash": "8dff281d61f56bc2b412933a9e66a0788ba3e38af27d80dd311b3b47ce74fb34"
        },
        {
          "uid": "lc-271",
          "id": 271,
          "group": "boundary",
          "title": "字符串的编码与解码",
          "level": "Medium",
          "prompt": "设计 encode 与 decode，把字符串列表变成单一字符串，再精确恢复原列表。字符串可为空，也可包含分隔符等任意字符；不同字符串的边界必须保留。",
          "example": "输入：strings=[\"lint\",\"code\",\"#\",\"\"]\n输出：decode(encode(strings)) 精确返回原列表",
          "hint": "先问自己：避免重复工作与歧义，都需要先把边界定义清楚。",
          "recognition": "字符串可以包含任意分隔符",
          "mnemonic": "先写长度，再按长度读正文。",
          "why": "字符串可以包含任意分隔符。解码指针总位于下一条长度字段的开头，长度确定后不再把正文里的 # 当分隔符。",
          "invariant": "解码指针总位于下一条长度字段的开头，长度确定后不再把正文里的 # 当分隔符。",
          "steps": [
            "编码为 长度#正文 并连接",
            "解码先找到长度后的 #",
            "读取指定个字符并推进到下一条"
          ],
          "trace": "[\"lint\",\"code\",\"#\"] 编码为 \"4#lint4#code1##\"。\n\n手推时记录：解码指针总位于下一条长度字段的开头，长度确定后不再把正文里的 # 当分隔符。\n\n边界检查：正文含 # 或空串时为什么仍能解码？\n# 只用于结束长度字段；之后按长度精确读取，正文里的 # 没有特殊意义。空串编码为 0#，读取零个字符也会推进长度字段。",
          "traceLabel": "例子与边界推演",
          "trap": "正文含 # 或空串时为什么仍能解码？\n# 只用于结束长度字段；之后按长度精确读取，正文里的 # 没有特殊意义。空串编码为 0#，读取零个字符也会推进长度字段。",
          "complexity": "总字符量 L、字符串数 k：时间和输出空间 O(L+k)，长度字段也计入编码规模。",
          "prerequisites": [
            "01-boundary"
          ],
          "related": [
            {
              "id": 49,
              "kind": "易混淆",
              "why": "49 的键允许丢掉字符顺序，因为只需识别同类；271 编码必须无损恢复原串及其边界。"
            },
            {
              "id": 297,
              "kind": "同目标",
              "why": "两题都要无损还原结构：271 保存字符串长度边界，297 保存空孩子边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "正文含 # 或空串时为什么仍能解码？",
            "answer": "# 只用于结束长度字段；之后按长度精确读取，正文里的 # 没有特殊意义。空串编码为 0#，读取零个字符也会推进长度字段。"
          },
          "source": "02-Wiki/题目详解/271-字符串的编码与解码.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Codec:\n    def encode(self, strs: List[str]) -> str:\n        return \"\".join(f\"{len(s)}#{s}\" for s in strs)\n\n    def decode(self, s: str) -> List[str]:\n        result, i = [], 0\n        while i < len(s):\n            j = s.index(\"#\", i)\n            size = int(s[i:j])\n            i = j + 1\n            result.append(s[i:i + size])\n            i += size\n        return result",
          "url": "https://leetcode.ca/all/271.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/271-%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E7%BC%96%E7%A0%81%E4%B8%8E%E8%A7%A3%E7%A0%81.md",
          "sourceHash": "7f65629a7b782fb668132136df1097e937551af5581db585a96b75242e343d56"
        }
      ]
    },
    {
      "id": "pointers-windows-02",
      "number": "02",
      "title": "双指针与滑动窗口",
      "content": "decks/02-cards.json",
      "concepts": [
        {
          "id": "02-opposite",
          "title": "两端向中间：每一步排除什么",
          "explanation": "移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "example": "167 和太小就移动左端；11 移动短板，因为固定短板而缩窄不会变好。"
        },
        {
          "id": "02-window",
          "title": "可变窗口：什么时候缩，什么时候记答案",
          "explanation": "最长合法窗口通常先修复再计分；最短覆盖窗口在仍满足时计分再缩。",
          "example": "3 重复就缩；76 覆盖就缩；424 用替换预算控制窗口长度。"
        },
        {
          "id": "02-fixed",
          "title": "固定窗口：维护离开与进入的信息",
          "explanation": "窗口长度由问题给定，滑动时一入一出。频次比较与最大值候选不是同一种状态。",
          "example": "438 和 567 比较字符频次；239 用单调队列保存可能成为最大值的下标。"
        },
        {
          "id": "02-compact",
          "title": "同向指针：读过的内容如何压紧",
          "explanation": "读指针寻找有效元素，写指针指向下一个有效位置，保持原始相对顺序。",
          "example": "283 中 [0,1,0,3] 的有效前缀逐步变成 [1,3]。"
        }
      ],
      "source": "02-Wiki/专题总结/02-双指针与滑动窗口.md",
      "connectionRule": "按“移动指针的理由”连接：排除不可能的端点、保持窗口合法、满足覆盖后缩小、淘汰无用候选。",
      "groups": [
        {
          "id": "opposite",
          "title": "两端向中间：每一步排除什么",
          "description": "移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "example": "167 和太小就移动左端；11 移动短板，因为固定短板而缩窄不会变好。"
        },
        {
          "id": "window",
          "title": "可变窗口：什么时候缩，什么时候记答案",
          "description": "最长合法窗口通常先修复再计分；最短覆盖窗口在仍满足时计分再缩。",
          "example": "3 重复就缩；76 覆盖就缩；424 用替换预算控制窗口长度。"
        },
        {
          "id": "fixed",
          "title": "固定窗口：维护离开与进入的信息",
          "description": "窗口长度由问题给定，滑动时一入一出。频次比较与最大值候选不是同一种状态。",
          "example": "438 和 567 比较字符频次；239 用单调队列保存可能成为最大值的下标。"
        },
        {
          "id": "compact",
          "title": "同向指针：读过的内容如何压紧",
          "description": "读指针寻找有效元素，写指针指向下一个有效位置，保持原始相对顺序。",
          "example": "283 中 [0,1,0,3] 的有效前缀逐步变成 [1,3]。"
        }
      ],
      "firstProblems": [
        125,
        167,
        3
      ],
      "cards": [
        {
          "uid": "lc-125",
          "id": 125,
          "group": "opposite",
          "title": "验证回文串",
          "level": "Easy",
          "prompt": "给定字符串 s，忽略非字母数字字符并忽略大小写后，判断它是否是回文串。",
          "example": "输入：s=\"A man, a plan, a canal: Panama\"\n输出：True",
          "hint": "先问自己：移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "recognition": "忽略符号和大小写判断对称",
          "mnemonic": "跳过无效字符，两端相向比。",
          "why": "忽略符号和大小写判断对称。两端之外的有效字符已经成对相等，待验证的部分仍在 left…right 内。",
          "invariant": "两端之外的有效字符已经成对相等，待验证的部分仍在 left…right 内。",
          "steps": [
            "跳过两边非字母数字",
            "转小写后比较",
            "相同就两端收缩直到相遇"
          ],
          "trace": "s = \"A man, a plan, a canal: Panama\"\n\n跳过空格、逗号和冒号后，比较序列为：\na m a n a p l a n a c a n a l p a n a m a\n\n左右始终相等，答案：True\n\n手推时记录：两端之外的有效字符已经成对相等，待验证的部分仍在 left…right 内。\n\n边界检查：只有标点或空字符串时结果是什么？\n有效字符序列为空，按回文定义返回 True；跳过字符时仍要检查 left<right 防止越界。",
          "traceLabel": "例子与边界推演",
          "trap": "只有标点或空字符串时结果是什么？\n有效字符序列为空，按回文定义返回 True；跳过字符时仍要检查 left<right 防止越界。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "02-opposite"
          ],
          "related": [
            {
              "id": 234,
              "kind": "结构变化",
              "why": "都比较首尾对称；字符串可直接双向索引，单链表必须先找中点并反转后半段。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "只有标点或空字符串时结果是什么？",
            "answer": "有效字符序列为空，按回文定义返回 True；跳过字符时仍要检查 left<right 防止越界。"
          },
          "source": "02-Wiki/题目详解/125-验证回文串.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        left, right = 0, len(s) - 1\n\n        while left < right:\n            while left < right and not s[left].isalnum():\n                left += 1\n            while left < right and not s[right].isalnum():\n                right -= 1\n\n            if s[left].lower() != s[right].lower():\n                return False\n\n            left += 1\n            right -= 1\n\n        return True",
          "url": "https://leetcode.cn/problems/valid-palindrome/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/125-%E9%AA%8C%E8%AF%81%E5%9B%9E%E6%96%87%E4%B8%B2.md",
          "sourceHash": "2b61fc4e3486cbf8446a87771863cc64fd92a3b31b7465480cdcbbd088f791ed"
        },
        {
          "uid": "lc-167",
          "id": 167,
          "group": "opposite",
          "title": "两数之和 II - 输入有序数组",
          "level": "Medium",
          "prompt": "非递减数组 numbers 中保证恰有一组解。返回和为 target 的两个不同位置，使用从 1 开始的下标，要求额外空间 O(1)。",
          "example": "输入：numbers=[2,7,11,15], target=9\n输出：[1,2]",
          "hint": "先问自己：移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "recognition": "已排序的两数之和",
          "mnemonic": "和小左进，和大右退。",
          "why": "已排序的两数之和。若解存在，仍在左右指针圈定的区间内；每次排除一个不可能的端点。",
          "invariant": "若解存在，仍在左右指针圈定的区间内；每次排除一个不可能的端点。",
          "steps": [
            "两端相加",
            "小于目标移动 left，大于目标移动 right",
            "相等返回一开始计数的下标"
          ],
          "trace": "numbers = [2, 7, 11, 15], target = 9\n\nleft = 0, right = 3: 2 + 15 = 17，太大，right 左移\nleft = 0, right = 2: 2 + 11 = 13，太大，right 左移\nleft = 0, right = 1: 2 + 7 = 9\n\n返回 [1, 2]\n\n手推时记录：若解存在，仍在左右指针圈定的区间内；每次排除一个不可能的端点。\n\n边界检查：为什么和太小时可以排除当前左端点？\n当前右端已经是剩余最大值，它与左端相加仍太小，左端与任何更小的右侧数也不可能达到目标。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么和太小时可以排除当前左端点？\n当前右端已经是剩余最大值，它与左端相加仍太小，左端与任何更小的右侧数也不可能达到目标。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "02-opposite"
          ],
          "related": [
            {
              "id": 1,
              "kind": "条件变化",
              "why": "同样找两数之和：1 无序用哈希记录历史；167 已有序，可以用大小关系移动两端并省去哈希空间。"
            },
            {
              "id": 15,
              "kind": "递进",
              "why": "15 先固定一个数，把剩余问题降成 167 的有序两数之和；新增重点是三元组去重。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么和太小时可以排除当前左端点？",
            "answer": "当前右端已经是剩余最大值，它与左端相加仍太小，左端与任何更小的右侧数也不可能达到目标。"
          },
          "source": "02-Wiki/题目详解/167-两数之和II-输入有序数组.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        left, right = 0, len(numbers) - 1\n\n        while left < right:\n            total = numbers[left] + numbers[right]\n\n            if total == target:\n                return [left + 1, right + 1]\n            if total < target:\n                left += 1\n            else:\n                right -= 1\n\n        return []",
          "url": "https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/167-%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8CII-%E8%BE%93%E5%85%A5%E6%9C%89%E5%BA%8F%E6%95%B0%E7%BB%84.md",
          "sourceHash": "3ecb3c4fab08ffc576d688329c6bf1a99dc48dcf633c367017e548e5d036510c"
        },
        {
          "uid": "lc-3",
          "id": 3,
          "group": "window",
          "title": "无重复字符的最长子串",
          "level": "Medium",
          "prompt": "给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。",
          "example": "输入: s = \"abcabcbb\"\n输出: 3",
          "hint": "先问自己：最长合法窗口通常先修复再计分；最短覆盖窗口在仍满足时计分再缩。",
          "recognition": "最长连续无重复子串",
          "mnemonic": "有重复就缩到没有。",
          "why": "最长连续无重复子串。加入当前字符前先移除重复，随后集合恰好表示一个无重复的当前窗口。",
          "invariant": "加入当前字符前先移除重复，随后集合恰好表示一个无重复的当前窗口。",
          "steps": [
            "右端扫描字符",
            "重复时循环删左端字符",
            "加入后更新最大长度"
          ],
          "trace": "输入: s = \"abcabcbb\"\n输出: 3\n解释: 因为无重复字符的最长子串是 \"abc\"，所以其长度为 3\n\n手推时记录：加入当前字符前先移除重复，随后集合恰好表示一个无重复的当前窗口。\n\n边界检查：abba 中出现第二个 b 时，为什么一次 if 收缩不够？\n若只删 a，窗口还保留两个 b；必须继续删到原来的 b 离开，所以用 while 修复到完全无重复。",
          "traceLabel": "例子与边界推演",
          "trap": "abba 中出现第二个 b 时，为什么一次 if 收缩不够？\n若只删 a，窗口还保留两个 b；必须继续删到原来的 b 离开，所以用 while 修复到完全无重复。",
          "complexity": "时间 O(n)，空间 O(min(n,Σ))。",
          "prerequisites": [
            "02-window"
          ],
          "related": [
            {
              "id": 76,
              "kind": "易混淆",
              "why": "3 在重复时收缩，合法后更新最长；76 在满足覆盖时更新最短，再收缩到不满足。"
            },
            {
              "id": 424,
              "kind": "条件变化",
              "why": "3 要严格无重复；424 允许 k 次替换，维护的是长度减最高频次的预算。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "abba 中出现第二个 b 时，为什么一次 if 收缩不够？",
            "answer": "若只删 a，窗口还保留两个 b；必须继续删到原来的 b 离开，所以用 while 修复到完全无重复。"
          },
          "source": "02-Wiki/题目详解/3-无重复字符的最长子串.md",
          "codeBlock": 0,
          "code": "def lengthOfLongestSubstring(s):\n    \"\"\"\n    滑动窗口 + 哈希集合\n    char_set 记录窗口内的字符，用于检测重复\n    \"\"\"\n    char_set = set()\n    left = 0\n    max_len = 0\n    \n    for right, ch in enumerate(s):\n        # 如果 ch 重复，收缩左边界直到窗口内无重复\n        while ch in char_set:\n            char_set.remove(s[left])\n            left += 1\n        \n        # 加入当前字符\n        char_set.add(ch)\n        \n        # 更新最大长度\n        max_len = max(max_len, right - left + 1)\n    \n    return max_len",
          "url": "https://leetcode.cn/problems/longest-substring-without-repeating-characters/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/3-%E6%97%A0%E9%87%8D%E5%A4%8D%E5%AD%97%E7%AC%A6%E7%9A%84%E6%9C%80%E9%95%BF%E5%AD%90%E4%B8%B2.md",
          "sourceHash": "870eee2fbc3c7cd869719a4a135d7831e8ed79224b47eb1ac6fd02c3dc970f07"
        },
        {
          "uid": "lc-15",
          "id": 15,
          "group": "opposite",
          "title": "三数之和",
          "level": "Medium",
          "prompt": "给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]] 满足 i != j、i != k 且 j != k，同时还满足 nums[i] + nums[j] + nums[k] == 0。\n\n请你返回所有和为 0 且不重复的三元组。\n\n注意： 答案中不可以包含重复的三元组。",
          "example": "输入：nums = [-1, 0, 1, 2, -1, -4]\n输出：[[-1, -1, 2], [-1, 0, 1]]",
          "hint": "先问自己：移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "recognition": "无序数组求不重复三元组",
          "mnemonic": "固定一个，另外两个对撞。",
          "why": "无序数组求不重复三元组。固定 i 后只在右侧寻找另两个位置；跳过相同固定值和解的重复端点以避免重复三元组。",
          "invariant": "固定 i 后只在右侧寻找另两个位置；跳过相同固定值和解的重复端点以避免重复三元组。",
          "steps": [
            "排序并枚举固定元素",
            "在其右侧做目标为负固定值的双指针",
            "命中后两端移动并去重"
          ],
          "trace": "输入：nums = [-1, 0, 1, 2, -1, -4]\n输出：[[-1, -1, 2], [-1, 0, 1]]\n解释：注意 [-1, 0, 1] 和 [0, 1, -1] 被视为重复\n\n手推时记录：固定 i 后只在右侧寻找另两个位置；跳过相同固定值和解的重复端点以避免重复三元组。\n\n边界检查：为什么固定元素去重是 i>0，而双指针必须从 i+1 开始？\n固定值与上一固定值相同会重复同一组答案，故 i>0 时跳过；从 i+1 开始保证三个位置不同且每组三元组只按递增下标选一次。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么固定元素去重是 i>0，而双指针必须从 i+1 开始？\n固定值与上一固定值相同会重复同一组答案，故 i>0 时跳过；从 i+1 开始保证三个位置不同且每组三元组只按递增下标选一次。",
          "complexity": "时间 O(n²)；Python 排序额外 O(n)，另计结果空间。",
          "prerequisites": [
            "02-opposite"
          ],
          "related": [
            {
              "id": 167,
              "kind": "递进",
              "why": "15 先固定一个数，把剩余问题降成 167 的有序两数之和；新增重点是三元组去重。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么固定元素去重是 i>0，而双指针必须从 i+1 开始？",
            "answer": "固定值与上一固定值相同会重复同一组答案，故 i>0 时跳过；从 i+1 开始保证三个位置不同且每组三元组只按递增下标选一次。"
          },
          "source": "02-Wiki/题目详解/15-三数之和.md",
          "codeBlock": 0,
          "code": "def threeSum(nums):\n    \"\"\"\n    排序 + 对撞指针\n    \n    步骤：\n    1. 排序\n    2. 固定 i，在 [i+1, n-1] 内用双指针找两数之和为 -nums[i]\n    3. 三层去重：i 去重、left 去重、right 去重\n    \"\"\"\n    nums.sort()\n    n = len(nums)\n    res = []\n    \n    for i in range(n - 2):\n        # 剪枝：最小的数 > 0，和不可能为 0\n        if nums[i] > 0:\n            break\n        \n        # 外层去重：跳过重复的固定元素\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        \n        left, right = i + 1, n - 1\n        target = -nums[i]\n        \n        while left < right:\n            s = nums[left] + nums[right]\n            if s < target:\n                left += 1\n            elif s > target:\n                right -= 1\n            else:\n                # 找到一组解\n                res.append([nums[i], nums[left], nums[right]])\n                left += 1\n                right -= 1\n                \n                # 内层去重：跳过重复元素\n                while left < right and nums[left] == nums[left - 1]:\n                    left += 1\n                while left < right and nums[right] == nums[right + 1]:\n                    right -= 1\n    \n    return res",
          "url": "https://leetcode.cn/problems/3sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/15-%E4%B8%89%E6%95%B0%E4%B9%8B%E5%92%8C.md",
          "sourceHash": "c3fd903d69d39dbb3a41c283cc41479fdf883ffd33303e82b5857c9009eeaf20"
        },
        {
          "uid": "lc-11",
          "id": 11,
          "group": "opposite",
          "title": "盛最多水的容器",
          "level": "Medium",
          "prompt": "给定一个长度为 n 的整数数组 height。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。\n\n找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。\n\n返回容器可以储存的最大水量。\n\n说明： 你不能倾斜容器。",
          "example": "输入：height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n输出：49",
          "hint": "先问自己：移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "recognition": "两根柱子组成最大容器",
          "mnemonic": "宽度要缩，只能换短板。",
          "why": "两根柱子组成最大容器。当前面积受较短柱限制；固定短板再缩宽度不可能超过当前面积。",
          "invariant": "当前面积受较短柱限制；固定短板再缩宽度不可能超过当前面积。",
          "steps": [
            "计算两端宽乘短板",
            "更新最大面积",
            "移动较短的一端"
          ],
          "trace": "输入：height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n输出：49\n解释：图中垂直线高度为 8 和 7（索引 1 和 8），\n      容器宽度为 7，高度为 min(8, 7) = 7，\n      面积 = 7 × 7 = 49\n\n手推时记录：当前面积受较短柱限制；固定短板再缩宽度不可能超过当前面积。\n\n边界检查：为什么不能优先移动较高的柱子？\n短板不变或变得更短，同时宽度减少，面积不可能提升；移动短板才有机会换到更高的限制高度。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能优先移动较高的柱子？\n短板不变或变得更短，同时宽度减少，面积不可能提升；移动短板才有机会换到更高的限制高度。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "02-opposite"
          ],
          "related": [
            {
              "id": 42,
              "kind": "易混淆",
              "why": "11 移动当前短板，优化一整个容器面积；42 比较已知左右最高墙，逐格累加水量。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能优先移动较高的柱子？",
            "answer": "短板不变或变得更短，同时宽度减少，面积不可能提升；移动短板才有机会换到更高的限制高度。"
          },
          "source": "02-Wiki/题目详解/11-盛最多水的容器.md",
          "codeBlock": 0,
          "code": "def maxArea(height):\n    \"\"\"\n    对撞指针法\n    每次移动高度较小的指针，因为移动高的面积不可能变大\n    \"\"\"\n    left, right = 0, len(height) - 1\n    max_water = 0\n    \n    while left < right:\n        # 计算当前面积\n        area = (right - left) * min(height[left], height[right])\n        max_water = max(max_water, area)\n        \n        # 移动较矮的柱子\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    \n    return max_water",
          "url": "https://leetcode.cn/problems/container-with-most-water/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/11-%E7%9B%9B%E6%9C%80%E5%A4%9A%E6%B0%B4%E7%9A%84%E5%AE%B9%E5%99%A8.md",
          "sourceHash": "4ccb578e59d3d2c3e765a0147ab79604f982344ac42b2fa33ce5e1b3d07fec9f"
        },
        {
          "uid": "lc-42",
          "id": 42,
          "group": "opposite",
          "title": "接雨水",
          "level": "Hard",
          "prompt": "给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。",
          "example": "输入：height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]\n输出：6",
          "hint": "先问自己：移动一端必须有证明；和的大小、高度瓶颈与字符对称给出的理由各不相同。",
          "recognition": "每个位置接水由左右最高墙中较低者决定",
          "mnemonic": "较低的已知边界先结算。",
          "why": "每个位置接水由左右最高墙中较低者决定。left_max 与 right_max 是已扫描两侧的最高墙，较小的一侧已能确定当前格子的水位上限。",
          "invariant": "left_max 与 right_max 是已扫描两侧的最高墙，较小的一侧已能确定当前格子的水位上限。",
          "steps": [
            "两侧更新已知最高墙",
            "比较左右最高值",
            "结算较低侧水量并移动对应指针"
          ],
          "trace": "输入：height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]\n输出：6\n解释：数组表示柱子的高度图，下雨后能接 6 个单位的雨水\n\n手推时记录：left_max 与 right_max 是已扫描两侧的最高墙，较小的一侧已能确定当前格子的水位上限。\n\n边界检查：接雨水与盛水容器为什么不能共用面积公式？\n11 只选两根柱计算一个矩形容器；42 要对每个位置累加 min(左最高,右最高)−自身高度，柱子本身占掉的空间不能当作水。",
          "traceLabel": "例子与边界推演",
          "trap": "接雨水与盛水容器为什么不能共用面积公式？\n11 只选两根柱计算一个矩形容器；42 要对每个位置累加 min(左最高,右最高)−自身高度，柱子本身占掉的空间不能当作水。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "02-opposite"
          ],
          "related": [
            {
              "id": 11,
              "kind": "易混淆",
              "why": "11 移动当前短板，优化一整个容器面积；42 比较已知左右最高墙，逐格累加水量。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "接雨水与盛水容器为什么不能共用面积公式？",
            "answer": "11 只选两根柱计算一个矩形容器；42 要对每个位置累加 min(左最高,右最高)−自身高度，柱子本身占掉的空间不能当作水。"
          },
          "source": "02-Wiki/题目详解/42-接雨水.md",
          "codeBlock": 0,
          "code": "def trap(height):\n    \"\"\"\n    双指针法\n    维护 left_max 和 right_max，每次处理较矮一侧\n    \n    步骤：\n    1. left 和 right 从两端向中间移动\n    2. 维护左右两侧已遇到的最大高度\n    3. 哪一侧的最大高度更小，就先处理哪一侧的当前位置\n    \"\"\"\n    left, right = 0, len(height) - 1\n    left_max = right_max = 0\n    res = 0\n    \n    while left < right:\n        # 更新左右两侧的最大高度\n        left_max = max(left_max, height[left])\n        right_max = max(right_max, height[right])\n        \n        if left_max < right_max:\n            # 左边最高 < 右边最高，左指针处的水量由 left_max 决定\n            res += left_max - height[left]\n            left += 1\n        else:\n            # 右边最高 <= 左边最高，右指针处的水量由 right_max 决定\n            res += right_max - height[right]\n            right -= 1\n    \n    return res",
          "url": "https://leetcode.cn/problems/trapping-rain-water/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/42-%E6%8E%A5%E9%9B%A8%E6%B0%B4.md",
          "sourceHash": "83ac7f806980080e6d4641ab370207c9ad97cfeeddca7871b81c6eb95bea2bd6"
        },
        {
          "uid": "lc-76",
          "id": 76,
          "group": "window",
          "title": "最小覆盖子串",
          "level": "Hard",
          "prompt": "给你一个字符串 s 和一个字符串 t。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 \"\"。\n\n注意：\n对于 t 中重复字符，子串中该字符数量必须不少于 t 中该字符数量。\n如果 s 中存在这样的子串，我们保证它是唯一的答案。",
          "example": "输入：s = \"ADOBECODEBANC\", t = \"ABC\"\n输出：\"BANC\"",
          "hint": "先问自己：最长合法窗口通常先修复再计分；最短覆盖窗口在仍满足时计分再缩。",
          "recognition": "求最短覆盖全部需求的连续段",
          "mnemonic": "覆盖了再缩，失效前记最好。",
          "why": "求最短覆盖全部需求的连续段。valid 统计达到所需次数的字符种类数，不是匹配字符总个数。",
          "invariant": "valid 统计达到所需次数的字符种类数，不是匹配字符总个数。",
          "steps": [
            "统计需求并扩张右端",
            "覆盖全部种类时先更新最短答案",
            "逐步删左端直到缺少必需字符"
          ],
          "trace": "输入：s = \"ADOBECODEBANC\", t = \"ABC\"\n输出：\"BANC\"\n解释：涵盖 \"A\"、\"B\"、\"C\" 的最小子串是 \"BANC\"\n\n手推时记录：valid 统计达到所需次数的字符种类数，不是匹配字符总个数。\n\n边界检查：t=AABC 时，为什么只检查窗口含 A、B、C 不够？\nA 必须出现两次。valid 只在某字符计数达到需求阈值时加一，删掉临界数量时减一，才能保留重复字符的需求。",
          "traceLabel": "例子与边界推演",
          "trap": "t=AABC 时，为什么只检查窗口含 A、B、C 不够？\nA 必须出现两次。valid 只在某字符计数达到需求阈值时加一，删掉临界数量时减一，才能保留重复字符的需求。",
          "complexity": "时间 O(n+m)，额外空间 O(Σ)，另计结果字符串。",
          "prerequisites": [
            "02-window"
          ],
          "related": [
            {
              "id": 3,
              "kind": "易混淆",
              "why": "3 在重复时收缩，合法后更新最长；76 在满足覆盖时更新最短，再收缩到不满足。"
            },
            {
              "id": 560,
              "kind": "适用边界",
              "why": "76 的计数覆盖可随窗口收缩判断；560 数组可含负数，和没有单调性，应查前缀和频次。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "t=AABC 时，为什么只检查窗口含 A、B、C 不够？",
            "answer": "A 必须出现两次。valid 只在某字符计数达到需求阈值时加一，删掉临界数量时减一，才能保留重复字符的需求。"
          },
          "source": "02-Wiki/题目详解/76-最小覆盖子串.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\n\ndef minWindow(s, t):\n    \"\"\"\n    滑动窗口 + 哈希表 + valid 变量\n    \n    步骤：\n    1. 统计 t 中每个字符的需求量\n    2. 右指针扩展窗口直到覆盖所有字符\n    3. 左指针收缩窗口寻找最小覆盖子串\n    4. 记录每次收缩前的最优解\n    \n    valid: 记录已满足需求数量的字符种类数\n    当 valid == len(need) 时，窗口已覆盖 t\n    \"\"\"\n    need = defaultdict(int)\n    for ch in t:\n        need[ch] += 1\n    \n    window = defaultdict(int)\n    valid = 0          # 已满足的字符种类数\n    left = 0\n    \n    # 记录最小覆盖子串的起始位置和长度\n    start = 0\n    length = float('inf')\n    \n    for right, ch in enumerate(s):\n        # ========== 扩大窗口 ==========\n        if ch in need:\n            window[ch] += 1\n            if window[ch] == need[ch]:\n                # 该字符的数量已经满足了需求\n                valid += 1\n        \n        # ========== 缩小窗口 ==========\n        while valid == len(need):\n            # 更新最优解（缩小前，当前窗口是候选）\n            if right - left + 1 < length:\n                start = left\n                length = right - left + 1\n            \n            # 左指针右移，缩小窗口\n            d = s[left]\n            left += 1\n            \n            if d in need:\n                if window[d] == need[d]:\n                    # 移除了一个必需的字符，valid 减少\n                    valid -= 1\n                window[d] -= 1\n    \n    return s[start:start + length] if length != float('inf') else \"\"",
          "url": "https://leetcode.cn/problems/minimum-window-substring/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/76-%E6%9C%80%E5%B0%8F%E8%A6%86%E7%9B%96%E5%AD%90%E4%B8%B2.md",
          "sourceHash": "3659d3063e6bf3eb69a8db6a9401b8b46a052723d067881b7863406652d6aead"
        },
        {
          "uid": "lc-424",
          "id": 424,
          "group": "window",
          "title": "替换后的最长重复字符",
          "level": "Medium",
          "prompt": "字符串 s 只含大写英文字母。你最多把 k 个位置改成任意大写字母，求修改后由同一字符组成的最长连续子串长度。",
          "example": "输入：s=\"AABABBA\", k=1\n输出：4",
          "hint": "先问自己：最长合法窗口通常先修复再计分；最短覆盖窗口在仍满足时计分再缩。",
          "recognition": "至多替换 k 次求最长同字符段",
          "mnemonic": "长度减最多同字符数，就是预算。",
          "why": "至多替换 k 次求最长同字符段。max_count 保存历史见过的最高频次，非递减；窗口长度不下降，记录已达到的可行最优长度。",
          "invariant": "max_count 保存历史见过的最高频次，非递减；窗口长度不下降，记录已达到的可行最优长度。",
          "steps": [
            "右端入窗并更新历史最大频次",
            "预算不足时移动左端",
            "返回保留的最大窗口长度"
          ],
          "trace": "s=\"AABABBA\", k=1，最长可统一为 \"A\" 的窗口长度是 4。\n\n手推时记录：max_count 保存历史见过的最高频次，非递减；窗口长度不下降，记录已达到的可行最优长度。\n\n边界检查：max_count 为何可以不随左端缩小？当前窗口一定真实吗？\n过时的 max_count 可能使当前窗口本身不可行，但不会让最优长度虚增：更长的窗口只有频次真正提高时才能扩张。此写法只保证最优长度，不能直接把当前窗口当合法答案串。",
          "traceLabel": "例子与边界推演",
          "trap": "max_count 为何可以不随左端缩小？当前窗口一定真实吗？\n过时的 max_count 可能使当前窗口本身不可行，但不会让最优长度虚增：更长的窗口只有频次真正提高时才能扩张。此写法只保证最优长度，不能直接把当前窗口当合法答案串。",
          "complexity": "时间 O(n)，空间 O(Σ)，题目字母表固定时为 O(1)。",
          "prerequisites": [
            "02-window"
          ],
          "related": [
            {
              "id": 3,
              "kind": "条件变化",
              "why": "3 要严格无重复；424 允许 k 次替换，维护的是长度减最高频次的预算。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "max_count 为何可以不随左端缩小？当前窗口一定真实吗？",
            "answer": "过时的 max_count 可能使当前窗口本身不可行，但不会让最优长度虚增：更长的窗口只有频次真正提高时才能扩张。此写法只保证最优长度，不能直接把当前窗口当合法答案串。"
          },
          "source": "02-Wiki/题目详解/424-替换后的最长重复字符.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\n\n\nclass Solution:\n    def characterReplacement(self, s: str, k: int) -> int:\n        count = defaultdict(int)\n        left = max_count = 0\n        for right, char in enumerate(s):\n            count[char] += 1\n            max_count = max(max_count, count[char])\n            while right - left + 1 - max_count > k:\n                count[s[left]] -= 1\n                left += 1\n        return len(s) - left",
          "url": "https://leetcode.cn/problems/longest-repeating-character-replacement/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/424-%E6%9B%BF%E6%8D%A2%E5%90%8E%E7%9A%84%E6%9C%80%E9%95%BF%E9%87%8D%E5%A4%8D%E5%AD%97%E7%AC%A6.md",
          "sourceHash": "c4650a9425e54ba701e86b5e8e00d5e0acd783dc708442dffb9feeb0b7070431"
        },
        {
          "uid": "lc-438",
          "id": 438,
          "group": "fixed",
          "title": "找到字符串中所有字母异位词",
          "level": "Medium",
          "prompt": "给定两个字符串 s 和 p，找到 s 中所有 p 的异位词的子串，返回这些子串的起始索引。不考虑答案输出的顺序。\n\n异位词指由相同字母重排列形成的字符串（包括相同的字符串）。",
          "example": "输入: s = \"cbaebabacd\", p = \"abc\"\n输出: [0, 6]",
          "hint": "先问自己：窗口长度由问题给定，滑动时一入一出。频次比较与最大值候选不是同一种状态。",
          "recognition": "找出所有异位词子串起点",
          "mnemonic": "定长滑动，入一个出一个，比频次。",
          "why": "找出所有异位词子串起点。窗口计数始终对应最近至多 len(p) 个字符，长度足够且频次相同才是答案。",
          "invariant": "窗口计数始终对应最近至多 len(p) 个字符，长度足够且频次相同才是答案。",
          "steps": [
            "统计目标频次",
            "右端加入并移除超长的左端字符",
            "相等就记录起点"
          ],
          "trace": "输入: s = \"cbaebabacd\", p = \"abc\"\n输出: [0, 6]\n解释:\n起始索引等于 0 的子串是 \"cba\"，它是 \"abc\" 的异位词\n起始索引等于 6 的子串是 \"bac\"，它是 \"abc\" 的异位词\n\n手推时记录：窗口计数始终对应最近至多 len(p) 个字符，长度足够且频次相同才是答案。\n\n边界检查：找到一个匹配后能直接跳过整个窗口吗？\n不能，匹配可以重叠。s=abab、p=ab 的答案是 [0,1,2]，窗口每次只右移一格。",
          "traceLabel": "例子与边界推演",
          "trap": "找到一个匹配后能直接跳过整个窗口吗？\n不能，匹配可以重叠。s=abab、p=ab 的答案是 [0,1,2]，窗口每次只右移一格。",
          "complexity": "固定 26 字母：时间 O(n+m)，额外空间 O(1)，另计输出。",
          "prerequisites": [
            "02-fixed"
          ],
          "related": [
            {
              "id": 567,
              "kind": "输出变化",
              "why": "同一个固定长度频次窗口：438 收集全部起点，567 找到一次即可结束。"
            },
            {
              "id": 242,
              "kind": "迁移",
              "why": "242 比较整串频次；438 把其中一个频次表改为随窗口一入一出动态维护。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "找到一个匹配后能直接跳过整个窗口吗？",
            "answer": "不能，匹配可以重叠。s=abab、p=ab 的答案是 [0,1,2]，窗口每次只右移一格。"
          },
          "source": "02-Wiki/题目详解/438-找到字符串中所有字母异位词.md",
          "codeBlock": 0,
          "code": "def findAnagrams(s, p):\n    \"\"\"\n    固定长度滑动窗口 + 计数数组\n    比较窗口内的字符计数与 p 的字符计数是否一致\n    \n    步骤：\n    1. 统计 p 的字符计数\n    2. 遍历 s，维护同样长度的窗口计数\n    3. 每次滑动后比较两个计数数组\n    \"\"\"\n    if len(p) > len(s):\n        return []\n    \n    cnt_p = [0] * 26\n    cnt_s = [0] * 26\n    \n    # 统计 p 中每个字符的出现次数\n    for ch in p:\n        cnt_p[ord(ch) - 97] += 1\n    \n    res = []\n    for i, ch in enumerate(s):\n        # 加入当前字符\n        cnt_s[ord(ch) - 97] += 1\n        \n        # 移除离开窗口的字符\n        if i >= len(p):\n            cnt_s[ord(s[i - len(p)]) - 97] -= 1\n        \n        # 比较两个计数数组\n        if cnt_s == cnt_p:\n            res.append(i - len(p) + 1)\n    \n    return res",
          "url": "https://leetcode.cn/problems/find-all-anagrams-in-a-string/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/438-%E6%89%BE%E5%88%B0%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E6%89%80%E6%9C%89%E5%AD%97%E6%AF%8D%E5%BC%82%E4%BD%8D%E8%AF%8D.md",
          "sourceHash": "72363ec1e708296be649348eadc53220e34948accb0c401c41ae526c2a429b86"
        },
        {
          "uid": "lc-567",
          "id": 567,
          "group": "fixed",
          "title": "字符串的排列",
          "level": "Medium",
          "prompt": "s1 与 s2 只含小写英文字母。判断 s2 中是否存在一个连续子串，恰好由 s1 的全部字符重新排列而成。",
          "example": "输入：s1=\"ab\", s2=\"eidbaooo\"\n输出：True",
          "hint": "先问自己：窗口长度由问题给定，滑动时一入一出。频次比较与最大值候选不是同一种状态。",
          "recognition": "只问是否包含某串的排列",
          "mnemonic": "固定长度的频次一相同就返回。",
          "why": "只问是否包含某串的排列。当前计数表示最近 len(s1) 个字符，和需求一致时就存在一个排列。",
          "invariant": "当前计数表示最近 len(s1) 个字符，和需求一致时就存在一个排列。",
          "steps": [
            "若模式更长直接失败",
            "一入一出维护固定窗口",
            "频次数组相同立刻返回 True"
          ],
          "trace": "s1=\"ab\", s2=\"eidbaooo\"，窗口 \"ba\" 频次匹配，返回 True。\n\n手推时记录：当前计数表示最近 len(s1) 个字符，和需求一致时就存在一个排列。\n\n边界检查：与 438 相同的窗口，输出要求怎样改变终止时机？\n567 只需要存在性，第一次匹配即可返回 True；438 必须继续滑动，把每一个可能重叠的起点都记录下来。",
          "traceLabel": "例子与边界推演",
          "trap": "与 438 相同的窗口，输出要求怎样改变终止时机？\n567 只需要存在性，第一次匹配即可返回 True；438 必须继续滑动，把每一个可能重叠的起点都记录下来。",
          "complexity": "固定字母表：时间 O(n+m)，额外空间 O(1)。",
          "prerequisites": [
            "02-fixed"
          ],
          "related": [
            {
              "id": 438,
              "kind": "输出变化",
              "why": "同一个固定长度频次窗口：438 收集全部起点，567 找到一次即可结束。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "与 438 相同的窗口，输出要求怎样改变终止时机？",
            "answer": "567 只需要存在性，第一次匹配即可返回 True；438 必须继续滑动，把每一个可能重叠的起点都记录下来。"
          },
          "source": "02-Wiki/题目详解/567-字符串的排列.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def checkInclusion(self, s1: str, s2: str) -> bool:\n        if len(s1) > len(s2):\n            return False\n        need = [0] * 26\n        window = [0] * 26\n        for char in s1:\n            need[ord(char) - ord(\"a\")] += 1\n        for i, char in enumerate(s2):\n            window[ord(char) - ord(\"a\")] += 1\n            if i >= len(s1):\n                window[ord(s2[i - len(s1)]) - ord(\"a\")] -= 1\n            if window == need:\n                return True\n        return False",
          "url": "https://leetcode.cn/problems/permutation-in-string/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/567-%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%8E%92%E5%88%97.md",
          "sourceHash": "9d3b5ddaaaf80e0f7f089e95f60967887a3a3cc347129f9826aa93611ef7fe85"
        },
        {
          "uid": "lc-239",
          "id": 239,
          "group": "fixed",
          "title": "滑动窗口最大值",
          "level": "Hard",
          "prompt": "给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。\n\n返回每个滑动窗口中的最大值。",
          "example": "输入：nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3\n输出：[3, 3, 5, 5, 6, 7]",
          "hint": "先问自己：窗口长度由问题给定，滑动时一入一出。频次比较与最大值候选不是同一种状态。",
          "recognition": "固定窗口求最大值",
          "mnemonic": "小的从尾淘汰，过期的从头淘汰。",
          "why": "固定窗口求最大值。队列下标递增、对应值非递增，队首既未过期又是窗口最大候选。",
          "invariant": "队列下标递增、对应值非递增，队首既未过期又是窗口最大候选。",
          "steps": [
            "弹出队尾小于当前值的下标",
            "当前下标入队并去掉过期队首",
            "形成窗口后读取队首"
          ],
          "trace": "输入：nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3\n输出：[3, 3, 5, 5, 6, 7]\n解释：\n窗口位置                   最大值\n------------------------- -----\n[1  3  -1] -3  5  3  6  7   3\n 1 [3  -1  -3] 5  3  6  7   3\n 1  3 [-1  -3  5] 3  6  7   5\n 1  3  -1 [-3  5  3] 6  7   5\n 1  3  -1  -3 [5  3  6] 7   6\n 1  3  -1  -3  5 [3  6  7]  7\n\n手推时记录：队列下标递增、对应值非递增，队首既未过期又是窗口最大候选。\n\n边界检查：为什么队尾更小的旧元素永远不用留？\n新元素比它大且更晚过期；只要旧元素还在窗口里，新元素也在，旧元素不可能成为最大值。队列必须存下标才能判断过期。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么队尾更小的旧元素永远不用留？\n新元素比它大且更晚过期；只要旧元素还在窗口里，新元素也在，旧元素不可能成为最大值。队列必须存下标才能判断过期。",
          "complexity": "时间 O(n)，队列空间 O(k)，另计输出。",
          "prerequisites": [
            "02-fixed"
          ],
          "related": [
            {
              "id": 739,
              "kind": "同模板",
              "why": "都淘汰不可能再有用的候选；739 单调栈等未来更大值，239 单调队列还要处理窗口过期。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么队尾更小的旧元素永远不用留？",
            "answer": "新元素比它大且更晚过期；只要旧元素还在窗口里，新元素也在，旧元素不可能成为最大值。队列必须存下标才能判断过期。"
          },
          "source": "02-Wiki/题目详解/239-滑动窗口最大值.md",
          "codeBlock": 0,
          "code": "from collections import deque\n\ndef maxSlidingWindow(nums, k):\n    \"\"\"\n    单调递减队列\n    队列中存储元素索引，对应的值从大到小排列\n    \n    步骤：\n    1. 弹出队尾比当前小的元素（它们再也没机会成最大值了）\n    2. 将当前元素索引加入队尾\n    3. 弹出队首过期元素（索引超出窗口）\n    4. 窗口形成后，队首即最大值\n    \"\"\"\n    q = deque()  # 存储元素索引，单调递减\n    res = []\n    \n    for i, num in enumerate(nums):\n        # 1. 维护单调性：弹出队尾所有比当前元素小的索引\n        while q and nums[q[-1]] < num:\n            q.pop()\n        \n        # 2. 当前元素索引入队\n        q.append(i)\n        \n        # 3. 移除过期元素：队首索引超出窗口左边界\n        if q[0] <= i - k:\n            q.popleft()\n        \n        # 4. 窗口形成后记录结果（前 k-1 个元素不够一个窗口）\n        if i >= k - 1:\n            res.append(nums[q[0]])\n    \n    return res",
          "url": "https://leetcode.cn/problems/sliding-window-maximum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/239-%E6%BB%91%E5%8A%A8%E7%AA%97%E5%8F%A3%E6%9C%80%E5%A4%A7%E5%80%BC.md",
          "sourceHash": "ab389223dc1b80863e98e25fe7a81a7938d336f4c02fe99d98fd3ae18b8f51fd"
        },
        {
          "uid": "lc-283",
          "id": 283,
          "group": "compact",
          "title": "移动零",
          "level": "Easy",
          "prompt": "给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。\n\n要求：\n必须原地操作，不能拷贝额外的数组\n尽量减少操作次数",
          "example": "输入: nums = [0, 1, 0, 3, 12]\n输出: [1, 3, 12, 0, 0]",
          "hint": "先问自己：读指针寻找有效元素，写指针指向下一个有效位置，保持原始相对顺序。",
          "recognition": "原地移走零且保留非零相对顺序",
          "mnemonic": "读指针找，写指针收。",
          "why": "原地移走零且保留非零相对顺序。slow 之前恰好是已扫描部分的非零元素，且顺序与输入一致。",
          "invariant": "slow 之前恰好是已扫描部分的非零元素，且顺序与输入一致。",
          "steps": [
            "fast 扫描所有元素",
            "遇非零就与 slow 位置交换",
            "slow 前进一步"
          ],
          "trace": "输入: nums = [0, 1, 0, 3, 12]\n输出: [1, 3, 12, 0, 0]\n\n手推时记录：slow 之前恰好是已扫描部分的非零元素，且顺序与输入一致。\n\n边界检查：为什么交换法不会打乱非零元素之间的顺序？\n每个非零元素按 fast 的扫描顺序进入下一个写入位置，因此有效前缀的次序始终与原数组一致。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么交换法不会打乱非零元素之间的顺序？\n每个非零元素按 fast 的扫描顺序进入下一个写入位置，因此有效前缀的次序始终与原数组一致。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "02-compact"
          ],
          "related": [
            {
              "id": 75,
              "kind": "递进",
              "why": "283 只区分零与非零并保持非零顺序；75 同时维护 0、1、2 三个区域，不要求稳定。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么交换法不会打乱非零元素之间的顺序？",
            "answer": "每个非零元素按 fast 的扫描顺序进入下一个写入位置，因此有效前缀的次序始终与原数组一致。"
          },
          "source": "02-Wiki/题目详解/283-移动零.md",
          "codeBlock": 0,
          "code": "def moveZeroes(nums):\n    \"\"\"\n    快慢指针交换法\n    slow: 下一个非零元素的位置\n    fast: 遍历数组，寻找非零元素\n    \"\"\"\n    slow = 0\n    for fast in range(len(nums)):\n        if nums[fast] != 0:\n            # 将非零元素交换到前面\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1",
          "url": "https://leetcode.cn/problems/move-zeroes/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/283-%E7%A7%BB%E5%8A%A8%E9%9B%B6.md",
          "sourceHash": "ad1fe661f4d6d06ddd92095b28f977ec9e56242c57bdceed75dc8a0d446a52a0"
        }
      ]
    },
    {
      "id": "arrays-matrices-03",
      "number": "03",
      "title": "数组与矩阵",
      "content": "content.json",
      "concepts": [
        {
          "id": "prefix",
          "title": "前缀 / 后缀信息",
          "explanation": "前缀是当前位置之前的累计信息，后缀是之后的累计信息。把当前元素排除在累计量之外，就能组合出“除自己以外”的答案。",
          "example": "[2,3,4] 的左侧积是 [1,2,6]，右侧积是 [12,4,1]。空的一侧乘积定义为 1。"
        },
        {
          "id": "invariant",
          "title": "循环不变量",
          "explanation": "不变量就是每轮循环开始或结束时始终成立的一句话。先说清变量代表什么，再推导它该怎样更新。",
          "example": "Kadane 中，cur 是“以当前元素结尾的最大和”；best 是“目前见过的最大和”。二者不能混用。"
        },
        {
          "id": "inplace",
          "title": "原地修改与信息保护",
          "explanation": "原地修改利用输入本身存数据。每次覆盖前，先确认旧值以后是否还会用到；需要的话，先用临时变量保存。",
          "example": "交换两个位置时先确定目标索引。Python 的切片 nums[:k] 会创建新列表，双指针交换则只需常数额外空间。"
        },
        {
          "id": "intervals",
          "title": "区间端点与排序",
          "explanation": "先明确端点相接算不算冲突，再确定排序依据。合并覆盖范围通常按起点排；保留最多互不重叠的区间通常按终点排。",
          "example": "56 中 [1,2] 与 [2,3] 合并成 [1,3]；会议安排中 2 点结束后可以立即开始下一场，所以不冲突。"
        },
        {
          "id": "heap",
          "title": "小顶堆保存最优候选",
          "explanation": "堆顶随时给出最小值。入堆、弹出通常 O(log n)，查看堆顶 O(1)。你必须先定义堆里每项的含义和排序依据。",
          "example": "会议室 II 按结束时间取最早结束的会议；最小覆盖区间按长度取最短候选。Python heapq 的元组按第一个元素优先比较。"
        },
        {
          "id": "greedy",
          "title": "贪心选择为什么安全",
          "explanation": "不能只说“这样看起来最好”。要解释：换成当前选择之后，剩下问题的可选空间不会更差。",
          "example": "保留结束最早的区间，给后面留下的时间最多。如果最优方案先选了更晚结束的区间，可以换成更早结束的那个。"
        },
        {
          "id": "coordinates",
          "title": "二维坐标与映射",
          "explanation": "matrix[r][c] 的 r 表示行，c 表示列。先跟踪一个格子变到哪里，再对所有格子套用同样的规则。",
          "example": "n×n 方阵顺时针旋转：(r,c) → (c,n−1−r)。可拆成转置 (r,c)→(c,r)，再每行翻转。"
        },
        {
          "id": "bounds",
          "title": "剩余区域与边界",
          "explanation": "上下左右边界描述尚未访问的区域。走完一边后缩小对应边界；再次走之前检查区域还存在。",
          "example": "剩余只有一行时，走完上边后 top > bottom，不能再遍历下边，否则会重复。"
        },
        {
          "id": "carry",
          "title": "位值与进位",
          "explanation": "数字的位置决定它的位值。某位总和 total 的个位是 total % 10，向左进位是 total // 10。",
          "example": "某一位累计成 18：该位写 8，左边加 1。12×34 中，2×4 的个位对齐到结果最右侧。"
        },
        {
          "id": "counting",
          "title": "集合与频次计数",
          "explanation": "集合回答“有没有”，计数器回答“有几个”。如果重复元素代表不同选择，不能用集合丢掉次数。",
          "example": "正方形的三个存储顶点分别出现 2、3、1 次，同一个几何形状对应 2×3×1=6 种选择。"
        }
      ],
      "source": "02-Wiki/专题总结/03-数组与矩阵.md",
      "firstProblems": [
        238,
        56,
        73
      ],
      "groups": [
        {
          "id": "split",
          "title": "保存前面的信息",
          "description": "问清楚：走到这里时，哪些信息值得留下？"
        },
        {
          "id": "move",
          "title": "按规则搬动与归位",
          "description": "先确定数字的位置，再保护还没用到的数据。"
        },
        {
          "id": "interval",
          "title": "把区间放到时间轴上",
          "description": "合并、保留、判冲突、求峰值，目标决定维护什么。"
        },
        {
          "id": "matrix",
          "title": "坐标、边界与约束",
          "description": "先写坐标的含义，再决定怎么走、怎么改。"
        }
      ],
      "connectionRule": "同样是数组，先区分输出目标：保存历史、原地归位、区间取舍，或二维坐标约束。跨题比较时特别留意端点和原地修改规则。",
      "cards": [
        {
          "id": 238,
          "group": "split",
          "title": "除自身以外数组的乘积",
          "level": "Medium",
          "prompt": "给你整数数组 nums，返回每个位置以外所有元素的乘积。不能用除法，要求 O(n) 时间。",
          "example": "输入：[1, 2, 3, 4]\n输出：[24, 12, 8, 6]",
          "hint": "每个位置的答案，能不能拆成左右两部分？",
          "mnemonic": "左边乘一遍，右边补一遍。",
          "why": "除掉自己后，只剩左边和右边。两遍扫描分别提供这两部分的信息，遇到零也照样成立。",
          "steps": [
            "从左向右，把左侧乘积写进 res[i]，然后才把 nums[i] 乘入 left_prod。",
            "从右向左，让 res[i] 乘上右侧乘积，然后才更新 right_prod。",
            "不变量：写入当前位置时，累计乘积始终不包含当前位置本身。"
          ],
          "trace": "nums   = [1,  2, 3, 4]\n左侧积  = [1,  1, 2, 6]\n右侧积  = [24,12, 4, 1]\n逐位相乘 = [24,12, 8, 6]",
          "trap": "先写答案，再更新累计量；顺序反了就会把自己乘进去。自测 [0,2,3] → [6,0,0]；[0,0,3] → [0,0,0]。",
          "complexity": "时间 O(n)；额外空间 O(1)，不计 O(n) 输出数组。",
          "recognition": "输出依赖当前位置两侧的累计信息；不能用除法，允许把输出数组当暂存。",
          "invariant": "写 res[i] 时，left_prod 只含 i 左侧元素；乘右侧时，right_prod 只含 i 右侧元素。",
          "prerequisites": [
            "prefix",
            "invariant"
          ],
          "related": [
            {
              "id": 53,
              "why": "同样保存累计信息，但 53 必须决定丢弃还是延续；238 的左右两部分都要保留。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么必须先写入左侧乘积，再把当前元素乘进去？如果数组含两个零会怎样？",
            "answer": "先更新累计量就会把自己算入答案。两个零时，任意位置之外都还包含零，因此所有输出都是 0。"
          },
          "uid": "lc-238",
          "source": "02-Wiki/题目详解/238-除自身以外数组的乘积.md",
          "code": "def productExceptSelf(nums):\n    n = len(nums)\n    res = [1] * n\n    \n    # 第一次遍历：左边乘积\n    # res[i] = nums[0] * nums[1] * ... * nums[i-1]\n    left_prod = 1\n    for i in range(n):\n        res[i] = left_prod\n        left_prod *= nums[i]\n    \n    # 第二次遍历：右边乘积\n    # 将右边乘积乘到 res[i] 上\n    right_prod = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= right_prod\n        right_prod *= nums[i]\n    \n    return res",
          "url": "https://leetcode.cn/problems/product-of-array-except-self/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/238-%E9%99%A4%E8%87%AA%E8%BA%AB%E4%BB%A5%E5%A4%96%E6%95%B0%E7%BB%84%E7%9A%84%E4%B9%98%E7%A7%AF.md",
          "sourceHash": "7885b3063b1867419f1ac15c4d4673192f31332c848531b886856a1fb008e29c"
        },
        {
          "id": 56,
          "group": "interval",
          "title": "合并区间",
          "level": "Medium",
          "prompt": "合并所有重叠的闭区间，返回覆盖范围相同的互不重叠区间。相接端点也要合并。",
          "example": "输入：[[1,3],[2,6],[8,10]]\n输出：[[1,6],[8,10]]",
          "hint": "如果按起点排序，一个新区间只需要和已合并结果的哪一段比较？",
          "mnemonic": "起点排队，重叠就延长右边。",
          "why": "按起点排序后，新区间只可能接到结果的最后一段；更早的段已经与最后一段分开了。",
          "steps": [
            "按左端点升序排序，准备结果数组。",
            "结果为空或 start > 最后右端点：新增一段。",
            "否则重叠：最后右端点更新为 max(旧右端点, end)。"
          ],
          "trace": "[1,3] 加入结果\n[2,6]：2 ≤ 3，扩成 [1,6]\n[8,10]：8 > 6，另开一段\n结果：[[1,6],[8,10]]",
          "trap": "[1,4] 和 [4,5] 在本题中要合并。包含关系也要用 max，不能直接覆盖右端点：[[1,10],[2,3]] → [[1,10]]。",
          "complexity": "时间 O(n log n)；Python 排序最坏额外空间 O(n)，输出 O(n)。",
          "recognition": "要合并覆盖范围，区间未排序，而且相接端点也算重叠。",
          "invariant": "merged 中各段有序且互不重叠；只有最后一段可能继续被扩张。",
          "prerequisites": [
            "intervals"
          ],
          "related": [
            {
              "id": 57,
              "why": "57 已经排序且互不重叠，只需围绕新段扫描三部分。"
            },
            {
              "id": 435,
              "why": "435 要保留最多段，因此按终点排序；56 要合并覆盖范围，按起点排序。"
            },
            {
              "id": 252,
              "why": "56 相接也合并；会议室中相接时间允许共存。"
            },
            {
              "id": 763,
              "kind": "区间联系",
              "why": "把每个字符的首次到最后出现看作区间，763 的扩展边界等价于把相互牵连的字符范围合并成片段。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "对 [[1,2],[2,3]]，56 合并区间与 252 会议室分别如何处理？为什么比较符号不同？",
            "answer": "56 返回 [[1,3]]，相接的闭区间要合并，用 start ≤ end 判断重叠；252 返回 True，2 点结束后可立即开下一场，只在 start < previous_end 时冲突。"
          },
          "uid": "lc-56",
          "source": "02-Wiki/题目详解/56-合并区间.md",
          "code": "def merge(intervals):\n    if not intervals:\n        return []\n    \n    # 按区间起点升序排序（这是关键前提）\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    \n    for interval in intervals:\n        # 如果 merged 为空，或者当前区间与 merged[-1] 不重叠\n        if not merged or interval[0] > merged[-1][1]:\n            merged.append(interval)\n        else:\n            # 重叠：合并区间——更新终点为较大值\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    \n    return merged",
          "url": "https://leetcode.cn/problems/merge-intervals/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/56-%E5%90%88%E5%B9%B6%E5%8C%BA%E9%97%B4.md",
          "sourceHash": "c1cbca9b5a45d8771f4f0922e1d1af7ec6ea7cf5cdf6b737cd4a7ed23d381253"
        },
        {
          "id": 73,
          "group": "matrix",
          "title": "矩阵置零",
          "level": "Medium",
          "prompt": "矩阵中某个原始元素为 0，就把它所在的整行、整列置零。要求原地修改，额外空间 O(1)。",
          "example": "输入：[[1,1,1],[1,0,1],[1,1,1]]\n结果：[[1,0,1],[0,0,0],[1,0,1]]",
          "hint": "需要记住哪些行、列有零；矩阵里能不能借一行、一列当记事本？",
          "mnemonic": "首行首列做标记，自己的命运先记起。",
          "why": "每行、每列只需要一个“要不要清零”的标志。首行首列能存这些标志，但它们原本是否含零必须另外保护。",
          "steps": [
            "用两个布尔变量保存：第一行原本有零吗？第一列原本有零吗？",
            "扫描内部区域，遇零就在对应行首和列首做标记；扫描结束后，按标记清零内部。",
            "最后才根据两个布尔变量处理第一行与第一列。"
          ],
          "trace": "原始       标记首行列    清零内部    最终\n1 1 1      1 0 1        1 0 1      1 0 1\n1 0 1      0 0 1        0 0 0      0 0 0\n1 1 1      1 1 1        1 0 1      1 0 1",
          "trap": "不能发现零就立即清整行，否则新造出的零会继续传播。自测 [[0,1],[1,1]] → [[0,0],[0,1]]。",
          "complexity": "时间 O(mn)；额外空间 O(1)。",
          "recognition": "要原地批量修改，后续修改依赖原始数据中的零；需要每行每列一个标志。",
          "invariant": "清零内部之前，首行首列完整保存标志，两个布尔变量保存首行首列原本是否有零。",
          "prerequisites": [
            "inplace",
            "coordinates"
          ],
          "related": [
            {
              "id": 48,
              "why": "同样原地修改，48 保护的是交换数据；73 还必须保护标记，直到使用完。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "手推 [[0,1],[1,1]]：两个布尔标记分别是什么？最终结果是什么？为何不能先清零首行？",
            "answer": "首行和首列原本都有零，两个布尔标记都为 True。最终 [[0,0],[0,1]]。提前清零首行会把所有列误标成应清零，错误地把右下角也清零。"
          },
          "uid": "lc-73",
          "source": "02-Wiki/题目详解/73-矩阵置零.md",
          "code": "def setZeroes(matrix):\n    m, n = len(matrix), len(matrix[0])\n    \n    # Step 1: 检查第一行和第一列是否包含 0\n    first_row_has_zero = any(matrix[0][j] == 0 for j in range(n))\n    first_col_has_zero = any(matrix[i][0] == 0 for i in range(m))\n    \n    # Step 2: 用第一行和第一列标记需要置零的行和列\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][j] == 0:\n                matrix[i][0] = 0  # 标记第 i 行需要置零\n                matrix[0][j] = 0  # 标记第 j 列需要置零\n    \n    # Step 3: 根据标记置零（除第一行第一列外）\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][0] == 0 or matrix[0][j] == 0:\n                matrix[i][j] = 0\n    \n    # Step 4: 处理第一行和第一列本身\n    if first_row_has_zero:\n        for j in range(n):\n            matrix[0][j] = 0\n    if first_col_has_zero:\n        for i in range(m):\n            matrix[i][0] = 0",
          "url": "https://leetcode.cn/problems/set-matrix-zeroes/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/73-%E7%9F%A9%E9%98%B5%E7%BD%AE%E9%9B%B6.md",
          "sourceHash": "a2eb0dba14d395f9b24d7d268fe5e7ab3e130ebe1ed6203e7fe4ea77d7997662"
        },
        {
          "id": 189,
          "group": "move",
          "title": "轮转数组",
          "level": "Medium",
          "prompt": "把数组向右轮转 k 个位置。要求原地修改，额外空间 O(1)。",
          "example": "输入：[1,2,3,4,5,6,7]，k = 3\n结果：[5,6,7,1,2,3,4]",
          "hint": "把数组分成前 n−k 个和后 k 个：要交换两段的位置，但保留各段内部顺序。",
          "mnemonic": "全翻，前 k 翻，剩下再翻。",
          "why": "整体翻转把两段换了位置，但每段内部顺序也反了；各翻一次就能恢复内部顺序。",
          "steps": [
            "先做 k %= n，避免转满一圈的重复工作。",
            "双指针翻转 [0,n−1]，再翻转 [0,k−1]。",
            "最后翻转 [k,n−1]。辅助函数只交换左右端点并向中间移动。"
          ],
          "trace": "原数组：1 2 3 4 | 5 6 7\n全翻后：7 6 5 | 4 3 2 1\n前 k 翻：5 6 7 | 4 3 2 1\n后段翻：5 6 7 | 1 2 3 4",
          "trap": "k 可能大于 n，也可能为 0。Python 的 nums[:k] 会复制数组；要满足 O(1) 额外空间，用双指针交换。",
          "complexity": "时间 O(n)；额外空间 O(1)。题目保证数组非空。",
          "recognition": "右移 k 位且要求常数额外空间：目标是交换两段的位置并保留段内顺序。",
          "invariant": "整体反转交换两段位置；分别反转两段恢复它们内部的顺序。",
          "prerequisites": [
            "inplace"
          ],
          "related": [
            {
              "id": 48,
              "why": "189 是一维数组三次翻转；48 是二维坐标映射，需要转置加每行翻转。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "[1,2,3,4,5] 右移 7 位：实际移动几位？三次翻转各得到什么？",
            "answer": "7 % 5 = 2。整体反转得到 [5,4,3,2,1]；前 2 个反转得到 [4,5,3,2,1]；后段反转得到 [4,5,1,2,3]。"
          },
          "uid": "lc-189",
          "source": "02-Wiki/题目详解/189-轮转数组.md",
          "code": "def rotate(nums, k):\n    n = len(nums)\n    k %= n  # 处理 k > n 的情况\n    if k == 0:\n        return\n    \n    # 辅助函数：翻转数组中 [l, r] 范围内的元素\n    def reverse(l, r):\n        while l < r:\n            nums[l], nums[r] = nums[r], nums[l]\n            l += 1\n            r -= 1\n    \n    # 三次翻转\n    reverse(0, n - 1)       # 1. 整体翻转\n    reverse(0, k - 1)       # 2. 翻转前 k 个\n    reverse(k, n - 1)       # 3. 翻转后 n-k 个",
          "url": "https://leetcode.cn/problems/rotate-array/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/189-%E8%BD%AE%E8%BD%AC%E6%95%B0%E7%BB%84.md",
          "sourceHash": "fb99765dcaabb09363b6c7199d07c9698da0d6ca9bcafe5f3902fd6385e96859"
        },
        {
          "id": 48,
          "group": "matrix",
          "title": "旋转图像",
          "level": "Medium",
          "prompt": "把 n × n 方阵顺时针旋转 90°，要求直接修改原矩阵，不能另建矩阵。",
          "example": "输入：[[1,2],[3,4]]\n结果：[[3,1],[4,2]]",
          "hint": "先写出旧坐标 (i,j) 旋转后的新坐标，再拆成两步。",
          "mnemonic": "先转置，再把每行倒过来。",
          "why": "转置使 (i,j) → (j,i)，每行翻转再使 (j,i) → (j,n−1−i)，正好是顺时针 90°。",
          "steps": [
            "只遍历上三角：j 从 i+1 开始。",
            "交换 matrix[i][j] 与 matrix[j][i]，完成转置。",
            "逐行 reverse()，完成左右翻转。"
          ],
          "trace": "原图       转置       每行翻转\n1 2        1 3        3 1\n3 4        2 4        4 2\n\n跟踪数字 1：(0,0) → (0,0) → (0,1)",
          "trap": "转置时遍历整个矩阵，会交换两次又回到原位。转置后反转的是每一行，不是行的排列顺序。",
          "complexity": "时间 O(n²)；额外空间 O(1)。仅适用于题目要求的方阵。",
          "recognition": "方阵、顺时针 90°、原地修改：先确定坐标变换。",
          "invariant": "转置后的 (j,i) 经每行翻转到 (j,n−1−i)，每对对称位置只交换一次。",
          "prerequisites": [
            "coordinates",
            "inplace"
          ],
          "related": [
            {
              "id": 189,
              "why": "两题都用翻转，但 189 交换两段；48 改变行列坐标。"
            },
            {
              "id": 54,
              "why": "48 修改位置，54 只按指定顺序读取。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "3×3 方阵里的位置 (0,1) 顺时针旋转后在哪里？如果转置时遍历整个方阵会怎样？",
            "answer": "(0,1) → (1,2)。遍历整个方阵会把每对非对角线位置交换两次，抵消转置；所以只遍历上三角。"
          },
          "uid": "lc-48",
          "source": "02-Wiki/题目详解/48-旋转图像.md",
          "code": "def rotate(matrix):\n    n = len(matrix)\n    \n    # Step 1: 转置（沿主对角线翻转）\n    # 注意 j 从 i+1 开始，只遍历上三角，避免重复交换\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    \n    # Step 2: 每行逆序（左右翻转）\n    for i in range(n):\n        matrix[i].reverse()",
          "url": "https://leetcode.cn/problems/rotate-image/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/48-%E6%97%8B%E8%BD%AC%E5%9B%BE%E5%83%8F.md",
          "sourceHash": "b5f980c1b3bf28061cc059d42b7223505fadf286fde2027ce6762ef0e13854d9"
        },
        {
          "id": 53,
          "group": "split",
          "title": "最大子数组和",
          "level": "Medium",
          "prompt": "给定整数数组，找一个非空、连续的子数组，使其元素和最大。返回这个最大和。",
          "example": "输入：[-2,1,-3,4,-1,2,1,-5,4]\n输出：6（来自 [4,-1,2,1]）",
          "hint": "如果前面那一段总和是负数，接上它有什么好处？",
          "mnemonic": "前面拖后腿，就从这里重来。",
          "why": "以当前元素结尾的最优段只有两种来源：接上前面的最优段，或只取当前元素。",
          "steps": [
            "cur 和 best 都初始化为 nums[0]，确保选择的是非空子数组。",
            "对每个新元素 x：cur = max(x, cur+x)。cur 表示以当前位置结尾的最大和。",
            "best = max(best, cur)，记录所有结尾中的最好答案。"
          ],
          "trace": "输入：     -2  1 -3  4 -1  2  1 -5  4\ncur：      -2  1 -2  4  3  5  6  1  5\nbest：     -2  1  1  4  4  5  6  6  6",
          "trap": "best 不能初始化为 0：[-5,-2,-8] 的答案是 −2。cur 是“以这里结尾”，不等于全局最优。",
          "complexity": "时间 O(n)；额外空间 O(1)。代码使用索引遍历，避免 nums[1:] 的复制。",
          "recognition": "连续、非空、求最大和，元素可能为负：每一步决定接上旧段还是重开。",
          "invariant": "cur 表示以当前下标结尾的最大非空子段和；best 保存迄今为止的全局最大。",
          "prerequisites": [
            "invariant"
          ],
          "related": [
            {
              "id": 238,
              "why": "238 需要固定的左右累计信息；53 中负累计和会拖累后面，应该丢弃。"
            },
            {
              "id": 152,
              "kind": "运算变化",
              "why": "53 的连续和只需留最佳结尾和；152 乘负数会翻转大小，必须同时留最大与最小结尾乘积。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "对 [-5,-2,-8]，逐步写 cur 与 best。为什么不能把 best 初始化为 0？",
            "answer": "cur 依次为 -5、-2、-8；best 依次为 -5、-2、-2。题目要求非空子数组，0 代表没有选择元素，会错误地超过所有合法答案。"
          },
          "uid": "lc-53",
          "source": "02-Wiki/题目详解/53-最大子数组和.md",
          "codeOverride": "def maxSubArray(nums):\n    # cur_sum: 以当前位置结尾的最大子数组和\n    # max_sum: 全局最大子数组和\n    cur_sum = max_sum = nums[0]\n    \n    for i in range(1, len(nums)):\n        num = nums[i]\n        # 要么接上前面的，要么重新开始\n        cur_sum = max(num, cur_sum + num)\n        # 更新全局最大值\n        max_sum = max(max_sum, cur_sum)\n    \n    return max_sum",
          "codeNote": "教学版：使用索引遍历避免 Python 切片占用额外空间。",
          "code": "def maxSubArray(nums):\n    # cur_sum: 以当前位置结尾的最大子数组和\n    # max_sum: 全局最大子数组和\n    cur_sum = max_sum = nums[0]\n    \n    for i in range(1, len(nums)):\n        num = nums[i]\n        # 要么接上前面的，要么重新开始\n        cur_sum = max(num, cur_sum + num)\n        # 更新全局最大值\n        max_sum = max(max_sum, cur_sum)\n    \n    return max_sum",
          "url": "https://leetcode.cn/problems/maximum-subarray/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/53-%E6%9C%80%E5%A4%A7%E5%AD%90%E6%95%B0%E7%BB%84%E5%92%8C.md",
          "sourceHash": "d7cc30d0f14710daf6eb4b58a24a0e2c05ee55964e2df62987beb0dece88ae46"
        },
        {
          "id": 54,
          "group": "matrix",
          "title": "螺旋矩阵",
          "level": "Medium",
          "prompt": "给定 m × n 矩阵，按顺时针螺旋顺序返回全部元素。矩阵可能不是方阵。",
          "example": "输入：[[1,2,3],[4,5,6],[7,8,9]]\n输出：[1,2,3,6,9,8,7,4,5]",
          "hint": "每走完一条边，剩余未访问区域的边界怎么变？",
          "mnemonic": "右下左上，走完一边缩一边。",
          "why": "未访问部分始终是由 top、bottom、left、right 围成的矩形；剥掉一层后，继续处理内部。",
          "steps": [
            "初始化上下左右四条边界。只要 top ≤ bottom 且 left ≤ right 就继续。",
            "走上边向右，top++；走右边向下，right--。",
            "检查仍有行再走下边并 bottom--；检查仍有列再走左边并 left++。"
          ],
          "trace": "1 → 2 → 3\n↑       ↓\n4   5   6\n↑       ↓\n7 ← 8 ← 9\n外圈结束后，四条边界都缩到中心 5。",
          "trap": "走下边前判断 top ≤ bottom；走左边前判断 left ≤ right。只有一行或一列时，不检查就会重复访问。",
          "complexity": "时间 O(mn)；额外空间 O(1)，不计 O(mn) 输出。",
          "recognition": "要按螺旋顺序读取全部元素；矩阵形状不限，剩余区域可以用四条边界表达。",
          "invariant": "四条边界内恰好是尚未访问的元素，每走完一边只收缩那条边界。",
          "prerequisites": [
            "bounds",
            "coordinates"
          ],
          "related": [
            {
              "id": 48,
              "why": "54 不修改元素，只改变读取顺序；48 要改变元素所在坐标。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "只有一行 [[1,2,3]] 时，走完上边后会发生什么？哪次判断阻止重复读取？",
            "answer": "走完上边后 top=1、bottom=0。top ≤ bottom 不成立，跳过下边；向下、向上的循环范围也为空，结果只有 [1,2,3]。"
          },
          "uid": "lc-54",
          "source": "02-Wiki/题目详解/54-螺旋矩阵.md",
          "code": "def spiralOrder(matrix):\n    res = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    \n    while top <= bottom and left <= right:\n        # 1. 从左到右遍历上边\n        for j in range(left, right + 1):\n            res.append(matrix[top][j])\n        top += 1\n        \n        # 2. 从上到下遍历右边\n        for i in range(top, bottom + 1):\n            res.append(matrix[i][right])\n        right -= 1\n        \n        # 3. 从右到左遍历下边（需检查 top <= bottom）\n        if top <= bottom:\n            for j in range(right, left - 1, -1):\n                res.append(matrix[bottom][j])\n            bottom -= 1\n        \n        # 4. 从下到上遍历左边（需检查 left <= right）\n        if left <= right:\n            for i in range(bottom, top - 1, -1):\n                res.append(matrix[i][left])\n            left += 1\n    \n    return res",
          "url": "https://leetcode.cn/problems/spiral-matrix/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/54-%E8%9E%BA%E6%97%8B%E7%9F%A9%E9%98%B5.md",
          "sourceHash": "66cb348e430915a25c0e7862d317f0b6240fd740723cb791a20060ba01060d25"
        },
        {
          "id": 240,
          "group": "matrix",
          "title": "搜索二维矩阵 II",
          "level": "Medium",
          "prompt": "矩阵每行从左到右升序、每列从上到下升序。判断目标值是否存在。相邻两行不保证首尾相接有序。",
          "example": "输入：[[1,4,7],[2,5,8],[3,6,9]]，target = 5\n输出：True",
          "hint": "从哪个角出发，一边比当前值小，另一边比当前值大？",
          "mnemonic": "右上出发，大了往左，小了往下。",
          "why": "右上角是当前行最大、当前列最小的元素。比目标大，可排除整列；比目标小，可排除整行。",
          "steps": [
            "row = 0，col = n−1，从右上角出发。",
            "等于目标则成功；大于目标 col--，小于目标 row++。",
            "走出矩阵仍未找到，就返回 False。"
          ],
          "trace": "找 5：\n右上 7 > 5 → 去掉右列，左移到 4\n4 < 5 → 去掉首行，下移到 5\n5 = 5 → 找到",
          "trap": "不要从左上角出发：右边和下边都更大，无法决定排除哪边。此题不能直接把矩阵摊平成整体有序数组做二分。",
          "complexity": "时间 O(m+n)；额外空间 O(1)。",
          "recognition": "行和列分别有序，但不能保证按行展开后整体有序。",
          "invariant": "从右上角检查时，目标若存在，就仍在当前行及其下方、当前列及其左方围成的区域。",
          "prerequisites": [
            "coordinates",
            "bounds"
          ],
          "related": [
            {
              "id": 54,
              "why": "都在缩小未处理区域；240 依据大小关系排除一行或一列，54 依据访问顺序收缩四边。"
            },
            {
              "id": 74,
              "kind": "条件边界",
              "why": "74 各行之间也衔接有序，可展开二分；240 只保证行列各自有序，使用角落排除一行或一列。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为何从右上角可以每步排除一行或一列，而从左上角通常不行？",
            "answer": "右上角是当前行最大、当前列最小。它大于目标时整列都更大，小于目标时整行都更小。左上角的右边和下边都更大，无法据此选择只排除一边。"
          },
          "uid": "lc-240",
          "source": "02-Wiki/题目详解/240-搜索二维矩阵II.md",
          "code": "def searchMatrix(matrix, target):\n    if not matrix or not matrix[0]:\n        return False\n    \n    m, n = len(matrix), len(matrix[0])\n    row, col = 0, n - 1  # 从右上角出发\n    \n    while row < m and col >= 0:\n        if matrix[row][col] == target:\n            return True\n        elif matrix[row][col] > target:\n            col -= 1  # 排除当前列\n        else:\n            row += 1  # 排除当前行\n    \n    return False",
          "url": "https://leetcode.cn/problems/search-a-2d-matrix-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/240-%E6%90%9C%E7%B4%A2%E4%BA%8C%E7%BB%B4%E7%9F%A9%E9%98%B5II.md",
          "sourceHash": "a7e6a64de17023f1f5a4549695b8bec6ab310f140d3cb7d9168b70c8f6f98b7f"
        },
        {
          "id": 41,
          "group": "move",
          "title": "缺失的第一个正数",
          "level": "Hard",
          "prompt": "找出未排序整数数组中缺失的最小正整数。要求 O(n) 时间、O(1) 额外空间。",
          "example": "输入：[3,4,-1,1]\n输出：2",
          "hint": "长度为 n 的数组，答案最多是多少？如果每个合法数字有自己的座位呢？",
          "mnemonic": "数字 x 坐 x−1，第一空位就是答案。",
          "why": "答案必在 1…n+1 内。把 1…n 放到对应索引后，数组本身就能记录它们是否存在。每次有效交换至少让一个值归位。",
          "steps": [
            "遍历 i；只要 nums[i] 在 1…n 内，且目标位置还不是这个数，就继续交换。",
            "先算 j = nums[i]−1，再交换 nums[i]、nums[j]；用 while 处理换回来的新数字。",
            "再扫描一遍，第一个 nums[i] != i+1 的位置返回 i+1；全对则返回 n+1。"
          ],
          "trace": "[3,4,-1,1]\n把 3 归位 → [-1,4,3,1]\n把 4 归位 → [-1,1,3,4]\n把 1 归位 → [1,-1,3,4]\n索引 1 应该坐 2，所以答案是 2。",
          "trap": "必须检查 nums[j] != nums[i]，否则重复值会造成死循环。先存目标索引 j，避免交换过程中又用已变动的 nums[i] 计算目标。",
          "complexity": "时间 O(n)，总有效交换次数受 n 限制；额外空间 O(1)。",
          "recognition": "答案是最小缺失正数，时间 O(n)、空间 O(1)：只能利用数组自身记录 1…n。",
          "invariant": "每次有效交换至少让一个合法值归位；归位值不会再被无意义地换走。",
          "prerequisites": [
            "inplace",
            "invariant"
          ],
          "related": [
            {
              "id": 36,
              "why": "36 用集合直接查重；41 的空间限制要求用输入位置代替集合。"
            },
            {
              "id": 75,
              "kind": "原地分区",
              "why": "41 按值把元素放回应有下标；75 按类别划分区域，两题交换后都要判断换回的元素是否仍未知。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "输入 [1,1] 时，为什么必须检查目标位置的值不等于当前值？答案又是多少？",
            "answer": "两个相同值互换不会改变数组，不加检查会无限循环。正确算法跳过这次交换，发现下标 1 不是 2，返回 2。"
          },
          "uid": "lc-41",
          "source": "02-Wiki/题目详解/41-缺失的第一个正数.md",
          "code": "def firstMissingPositive(nums):\n    n = len(nums)\n    \n    # Step 1: 原地归位\n    for i in range(n):\n        # while 循环：不断交换直到当前位置的值归位或无法归位\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            # 将 nums[i] 放到它应该在的位置\n            correct_pos = nums[i] - 1\n            nums[i], nums[correct_pos] = nums[correct_pos], nums[i]\n    \n    # Step 2: 扫描找缺失值\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    \n    # Step 3: 全部归位，说明 1~n 都存在\n    return n + 1",
          "url": "https://leetcode.cn/problems/first-missing-positive/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/41-%E7%BC%BA%E5%A4%B1%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%AD%A3%E6%95%B0.md",
          "sourceHash": "e7ee77e9ee64b9bcd9fa215e27b3169e9603ac891e304be36464cec130b6d12e"
        },
        {
          "id": 66,
          "group": "move",
          "title": "加一",
          "level": "Easy",
          "prompt": "数组从高位到低位表示一个非负整数，返回这个整数加一后的数字数组。",
          "example": "输入：[1,2,9] → 输出：[1,3,0]\n输入：[9,9] → 输出：[1,0,0]",
          "hint": "加一从哪一位开始？进位什么时候可以停？",
          "mnemonic": "逢九变零，非九加一就停。",
          "why": "只有原来等于 9 的数位才会继续向左进位。遇到非 9 后，左侧数位都不用变。",
          "steps": [
            "从末尾向前扫描数字。",
            "若当前数字 < 9，加一并立刻返回；否则置零，继续向左。",
            "如果整趟扫描都没返回，说明全是 9，在开头补 1。"
          ],
          "trace": "[1,2,9] → [1,2,0] → [1,3,0]，停止\n[9,9] → [9,0] → [0,0] → [1,0,0]",
          "trap": "只改最后一位不够。全为 9 时，结果长度会增加 1；[0] 加一是 [1]。",
          "complexity": "时间 O(n)；常规原地 O(1)，全为 9 时返回的新数组占 O(n) 空间。",
          "recognition": "数字按位给出，只加一；从最低位开始传播进位。",
          "invariant": "已经扫过的末尾各位原本都是 9，现已变成 0；进位还在向左传。",
          "prerequisites": [
            "carry"
          ],
          "related": [
            {
              "id": 43,
              "why": "66 只传播一次加一进位；43 把所有按位乘积累加后逐位处理进位。"
            },
            {
              "id": 2,
              "kind": "迁移",
              "why": "都按位传播进位；2 的低位在头部，从前往后扫描，66 的低位在数组末尾，从后往前扫描。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "为什么 [9,9] 处理后要加新首位，而 [1,9] 不需要？",
            "answer": "[9,9] 两位都置零后仍有进位，必须返回 [1,0,0]。[1,9] 末位置零，前位 1 加一变 2 即可停止，得到 [2,0]。"
          },
          "uid": "lc-66",
          "source": "02-Wiki/题目详解/66-加一.md",
          "code": "from typing import List\n\n\nclass Solution:\n    def plusOne(self, digits: List[int]) -> List[int]:\n        for i in range(len(digits) - 1, -1, -1):\n            if digits[i] < 9:\n                digits[i] += 1\n                return digits\n            digits[i] = 0\n        return [1] + digits",
          "url": "https://leetcode.cn/problems/plus-one/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/66-%E5%8A%A0%E4%B8%80.md",
          "sourceHash": "43d2614912729faca64643246962ce6b2fc53df76c655b2a0ad26bc8b5590c83"
        },
        {
          "id": 36,
          "group": "matrix",
          "title": "有效的数独",
          "level": "Medium",
          "prompt": "判断 9 × 9 数独中已填的数字是否在每行、每列、每个 3 × 3 宫内都不重复。空格是 '.'，无需求解数独。",
          "example": "若 (0,0) 和 (1,1) 都填 '5'，即使行列不同，\n它们仍在同一宫，结果为 False。",
          "hint": "同一个数字需要同时通过哪三种检查？",
          "mnemonic": "行、列、宫，三本账都查重。",
          "why": "每个已填数字同时属于一行、一列、一宫；分别记录这三种范围，就能立即检测冲突。",
          "steps": [
            "准备行集合、列集合、宫集合，扫描每个格子，跳过 '.'。",
            "用 (r//3,c//3) 标识宫；检查该数字是否出现在对应三个集合之一。",
            "出现过就返回 False；否则记入三个集合，全部通过后返回 True。"
          ],
          "trace": "(0,0) 的 '5'：行 0、列 0、宫 (0,0) 都记入 5\n(1,1) 的 '5'：行 1、列 1 没冲突\n但宫 (0,0) 已有 5 → False",
          "trap": "这里检查当前是否合法，不判断最终是否可解。宫编号用整除 //，不是取模 %；空格不参与查重。",
          "complexity": "固定 9 × 9 棋盘：时间和空间均 O(1)。推广到 N × N 时均 O(N²)。",
          "recognition": "固定数独，仅验证已填数据的行、列、宫三种去重约束。",
          "invariant": "三个集合分别保存已经扫描过的、属于该行 / 列 / 宫的非空数字。",
          "prerequisites": [
            "counting",
            "coordinates"
          ],
          "related": [
            {
              "id": 2013,
              "why": "36 只在意是否出现过，用集合；2013 重复点有不同组合，必须保存次数。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "(0,0) 与 (1,1) 都填 5，行列均不重复，为何仍然非法？这和判断数独可解是同一件事吗？",
            "answer": "它们的宫编号都为 (0//3,0//3)=(1//3,1//3)=(0,0)，同宫重复，所以非法。验证当前约束与判断最终是否可解不同，本题只做前者。"
          },
          "uid": "lc-36",
          "source": "02-Wiki/题目详解/36-有效的数独.md",
          "code": "from collections import defaultdict\nfrom typing import List\n\n\nclass Solution:\n    def isValidSudoku(self, board: List[List[str]]) -> bool:\n        rows, cols, boxes = defaultdict(set), defaultdict(set), defaultdict(set)\n        for r in range(9):\n            for c in range(9):\n                value = board[r][c]\n                if value == \".\":\n                    continue\n                box = (r // 3, c // 3)\n                if value in rows[r] or value in cols[c] or value in boxes[box]:\n                    return False\n                rows[r].add(value)\n                cols[c].add(value)\n                boxes[box].add(value)\n        return True",
          "url": "https://leetcode.cn/problems/valid-sudoku/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/36-%E6%9C%89%E6%95%88%E7%9A%84%E6%95%B0%E7%8B%AC.md",
          "sourceHash": "353124066b7e7a7d16cb2af7c47d126d169486f936f5d85d6633e5f121ecd63b"
        },
        {
          "id": 57,
          "group": "interval",
          "title": "插入区间",
          "level": "Medium",
          "prompt": "已有按起点排序且互不重叠的闭区间。插入新区间，合并重叠部分，保持结果有序。",
          "example": "原区间：[[1,3],[6,9]]，新段：[2,5]\n输出：[[1,5],[6,9]]",
          "hint": "相对于新段，原区间可以分成哪三个区域？",
          "mnemonic": "左边照抄，中间合并，右边接上。",
          "why": "原区间已经有序且互不重叠，不用重新排序；一次扫描即可走完新段左侧、重叠段和右侧。",
          "steps": [
            "旧段的 end < 新段 start：直接放进结果。",
            "旧段的 start ≤ 新段 end：合并，更新 min(start) 和 max(end)。",
            "放入合并后的新段，再接上剩余旧段。"
          ],
          "trace": "新段 [2,5] 遇到 [1,3] → 合并成 [1,5]\n遇到 [6,9]：6 > 5 → 合并结束\n输出新段 [1,5]，接上 [6,9]",
          "trap": "本题相接端点也合并。空列表要返回 [newInterval]；不能忘记把合并后的新段加入结果。",
          "complexity": "时间 O(n)；此 Python 实现包含输出与切片，空间 O(n)。",
          "recognition": "原区间已经有序且互不重叠，只新增一个闭区间。",
          "invariant": "已经输出的左侧区间不会再变化；正在扩张的新段覆盖全部已遇到的重叠部分。",
          "prerequisites": [
            "intervals"
          ],
          "related": [
            {
              "id": 56,
              "why": "56 要先排序再统一合并；57 已有序，可以直接左抄、中合、右接。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "向 [[1,2],[5,6]] 插入 [2,5]，最终结果是什么？为什么左右旧段都被合并？",
            "answer": "结果 [[1,6]]。本题闭区间端点相接也算重叠；[1,2] 接到新区间后得到 [1,5]，再接上 [5,6] 得到 [1,6]。"
          },
          "uid": "lc-57",
          "source": "02-Wiki/题目详解/57-插入区间.md",
          "code": "from typing import List\n\n\nclass Solution:\n    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n        res = []\n        for i, interval in enumerate(intervals):\n            if newInterval[1] < interval[0]:\n                res.append(newInterval)\n                return res + intervals[i:]\n            elif newInterval[0] > interval[1]:\n                res.append(interval)\n            else:\n                newInterval = [\n                    min(newInterval[0], interval[0]),\n                    max(newInterval[1], interval[1])\n                ]\n        res.append(newInterval)\n        return res",
          "url": "https://leetcode.cn/problems/insert-interval/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/57-%E6%8F%92%E5%85%A5%E5%8C%BA%E9%97%B4.md",
          "sourceHash": "e1702465df456bef6249d6e991bfa3b46d9ed09c0049b3cd920130361a153348"
        },
        {
          "id": 435,
          "group": "interval",
          "title": "无重叠区间",
          "level": "Medium",
          "prompt": "移除最少的区间，使其余区间互不重叠。只在端点相接不算重叠。返回删除数量。",
          "example": "输入：[[1,2],[2,3],[3,4],[1,3]]\n输出：1（删除 [1,3]）",
          "hint": "要给后面的区间尽量留出空间，先保留哪一种区间？",
          "mnemonic": "结束越早越先留，撞上就删后来者。",
          "why": "在可选区间中保留结束最早的那个，不会减少后面可选择的空间；保留最多等价于删除最少。",
          "steps": [
            "按右端点升序排序，previous_end 初始化为负无穷。",
            "若 start < previous_end，冲突，删除计数加一。",
            "否则保留该段，previous_end = end。"
          ],
          "trace": "按终点排序：[1,2] [2,3] [1,3] [3,4]\n留 [1,2] → 留 [2,3] → 删 [1,3] → 留 [3,4]\n删除数 = 1（同终点的顺序不影响最优数量）",
          "trap": "这题要保留更多段，按结束时间排；56 合并区间按开始时间排。start == previous_end 时可以保留。",
          "complexity": "时间 O(n log n)；Python 排序最坏额外空间 O(n)，扫描本身 O(1)。",
          "recognition": "删除最少等价于保留最多，端点相接允许共存。",
          "invariant": "previous_end 始终是最后保留区间的结束时间；按结束时间排序保障当前可选段最早结束。",
          "prerequisites": [
            "intervals",
            "greedy"
          ],
          "related": [
            {
              "id": 56,
              "why": "合并与删重叠目标不同，排序依据也不同。"
            },
            {
              "id": 252,
              "why": "两题相接均不冲突；252 不能通过删会议使结果变 True。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "面对 [[1,10],[2,3],[3,4]]，若优先保留开始最早的区间会怎样？按结束时间选又怎样？",
            "answer": "先保留 [1,10] 只能保留 1 段，要删 2 段。按结束时间选 [2,3] 与 [3,4] 可以保留 2 段，只删 [1,10]。"
          },
          "uid": "lc-435",
          "source": "02-Wiki/题目详解/435-无重叠区间.md",
          "code": "from typing import List\n\n\nclass Solution:\n    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:\n        intervals.sort(key=lambda interval: interval[1])\n        removed, previous_end = 0, float(\"-inf\")\n        for start, end in intervals:\n            if start < previous_end:\n                removed += 1\n            else:\n                previous_end = end\n        return removed",
          "url": "https://leetcode.cn/problems/non-overlapping-intervals/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/435-%E6%97%A0%E9%87%8D%E5%8F%A0%E5%8C%BA%E9%97%B4.md",
          "sourceHash": "5e3e0c40ad6ca69c452ce3f4a018cfca6e60a93a897db4c28167c4b7452c054a"
        },
        {
          "id": 252,
          "group": "interval",
          "title": "会议室",
          "level": "Easy",
          "prompt": "给定若干会议的开始和结束时间，判断一个人能否参加全部会议。上一场结束的时刻可以开始下一场。",
          "example": "[[0,10],[10,20]] → True\n[[0,30],[5,10],[15,20]] → False",
          "hint": "把会议排到时间轴上后，只需要比较哪些会议？",
          "mnemonic": "起点排队，后开不能早于前结束。",
          "why": "按开始时间排序后，只要每场都在上一场结束之后开始，就不可能和更早的会议冲突。",
          "steps": [
            "按开始时间升序排序。",
            "从第二场起，若当前 start < 上一场 end，则返回 False。",
            "相邻会议全部通过就返回 True。"
          ],
          "trace": "[0,10] → [10,20]：10 < 10 不成立，可以参加\n[0,30] → [5,10]：5 < 30 成立，冲突",
          "trap": "严格小于才冲突，相等可以参加。此题只问能否参加全部，不能删掉冲突会议后回答 True。",
          "complexity": "时间 O(n log n)；Python 排序最坏额外空间 O(n)。",
          "recognition": "问同一个人能否参加全部会议，只需判冲突，不允许删会议。",
          "invariant": "扫描通过的会议按开始时间排列，且相邻会议均无时间冲突。",
          "prerequisites": [
            "intervals"
          ],
          "related": [
            {
              "id": 253,
              "why": "252 只需一个布尔答案；253 需要统计同时进行的最大会议数。"
            },
            {
              "id": 56,
              "why": "56 端点相接要合并，252 相接可连续参加。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "[[0,30],[5,10],[15,20]]：252 的答案是什么？253 又是什么？",
            "answer": "252 是 False，一个人无法同时参加 [0,30] 与其他会议；253 是 2，因为短会议彼此不重叠，可以共用第二个房间。"
          },
          "uid": "lc-252",
          "source": "02-Wiki/题目详解/252-会议室.md",
          "code": "from typing import List\n\n\nclass Solution:\n    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:\n        intervals.sort(key=lambda interval: interval[0])\n        for i in range(1, len(intervals)):\n            if intervals[i][0] < intervals[i - 1][1]:\n                return False\n        return True",
          "url": "https://leetcode.ca/all/252.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/252-%E4%BC%9A%E8%AE%AE%E5%AE%A4.md",
          "sourceHash": "e0721f3df53375d6ef9591c5deee17138ab71531dcc9afc7e6373c185480274a"
        },
        {
          "id": 253,
          "group": "interval",
          "title": "会议室 II",
          "level": "Medium",
          "prompt": "为全部会议安排房间，同一时间重叠的会议不能共用。返回最少需要多少间会议室。",
          "example": "输入：[[0,30],[5,10],[15,20]]\n输出：2",
          "hint": "扫描开始时间时，需要知道哪些会议还没结束。怎样最快拿到最早结束的会议？",
          "mnemonic": "结束时间放小堆，同时在开的最多要几间。",
          "why": "至少需要“同时进行的会议数”那么多房间；已结束的会议释放房间后，这个数量也足够安排当前会议。",
          "steps": [
            "按开始时间排序。小顶堆保存仍在进行的会议结束时间。",
            "新会议开始前，用 while 弹出所有 end ≤ start 的会议，再压入新会议的 end。",
            "每次更新 peak = max(peak, len(heap))，最后返回峰值。"
          ],
          "trace": "[0,30] 开始：活跃结束时间 [30]，峰值 1\n[5,10] 开始：[10,30]，峰值 2\n[15,20] 开始：先移除 10，再加入 20\n活跃结束时间 [20,30]，峰值仍为 2",
          "trap": "本卡的堆表示活跃会议，因此要弹出所有已结束会议，返回历史峰值。别和“只复用一个房间，返回最终堆长”的另一种写法混用。",
          "complexity": "时间 O(n log n)；额外空间 O(n)。",
          "recognition": "需要最少房间数：等价于求同时进行的会议数量峰值。",
          "invariant": "弹出所有已结束会议并加入新会议后，堆恰好保存正在进行的会议结束时间。",
          "prerequisites": [
            "heap",
            "intervals"
          ],
          "related": [
            {
              "id": 252,
              "why": "判是否冲突只需比较相邻会议；求并发峰值需要额外维护活跃会议。"
            },
            {
              "id": 1851,
              "why": "253 堆按结束时间排；1851 堆按区间长度排，过期候选采用堆顶清理。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "[[0,10],[1,2],[3,4],[11,12]]：如果用 while 弹出所有结束会议，为什么不能返回最后堆长？",
            "answer": "峰值出现在时刻 1，同时开两场，答案 2。到最后只剩 [11,12]，堆长为 1。活跃堆可能缩小，必须另外记录历史最大值。"
          },
          "uid": "lc-253",
          "source": "02-Wiki/题目详解/253-会议室II.md",
          "codeOverride": "import heapq\n\ndef minMeetingRooms(intervals):\n    intervals.sort(key=lambda interval: interval[0])\n    active, peak = [], 0\n    for start, end in intervals:\n        while active and active[0] <= start:\n            heapq.heappop(active)\n        heapq.heappush(active, end)\n        peak = max(peak, len(active))\n    return peak",
          "codeNote": "教学版：堆保存活跃会议，弹出所有已结束会议，返回历史峰值。",
          "code": "import heapq\n\ndef minMeetingRooms(intervals):\n    intervals.sort(key=lambda interval: interval[0])\n    active, peak = [], 0\n    for start, end in intervals:\n        while active and active[0] <= start:\n            heapq.heappop(active)\n        heapq.heappush(active, end)\n        peak = max(peak, len(active))\n    return peak",
          "url": "https://leetcode.ca/all/253.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/253-%E4%BC%9A%E8%AE%AE%E5%AE%A4II.md",
          "sourceHash": "e700fe675ba3630d43e38b0dd1fe268410303bb4bbfa2c379a3003fd945ec01a"
        },
        {
          "id": 1851,
          "group": "interval",
          "title": "包含每个查询的最小区间",
          "level": "Hard",
          "prompt": "对每个查询 q，找包含 q 的最短闭区间，返回长度。没有区间包含时返回 −1，答案保持查询的原始顺序。",
          "example": "区间：[[1,4],[2,4],[3,6],[4,4]]\n查询：[2,3,4,5] → [3,3,1,4]",
          "hint": "如果查询从小到大处理，哪些区间只需加入一次？最短候选怎样快速取出？",
          "mnemonic": "查询从小扫，能进就入堆，过期顶上清。",
          "why": "查询递增时，区间一旦开始就可以入堆，一旦过期就永远无用了；按长度排序的小顶堆让最短候选优先出现。",
          "steps": [
            "区间按左端点排序，查询也排序；依次将 left ≤ q 的区间作为 (长度,right) 入堆。",
            "只要堆顶 right < q，就弹出过期堆顶。堆内部的过期元素可以等到浮上来再删。",
            "清理后，堆顶长度就是答案；空堆记 −1。用查询值映射答案，再按原查询顺序返回。"
          ],
          "trace": "q = 2：候选 [1,4] 长 4、[2,4] 长 3 → 3\nq = 3：加入 [3,6] 长 4 → 仍为 3\nq = 4：加入 [4,4] 长 1 → 1\nq = 5：清掉过期堆顶 → [3,6] 长 4",
          "trap": "闭区间长度是 right−left+1。过期条件是 right < q。堆按长度排，并不保证所有过期区间都在顶部；只需保证最终堆顶有效。",
          "complexity": "n 个区间、q 个查询：O(n log n + q log q + (n+q) log(n+1)) 时间；O(n+q) 空间。",
          "recognition": "大量点查询最短覆盖闭区间；可以改变查询处理顺序，再还原答案顺序。",
          "invariant": "堆内元素均已开始；清理结束后堆顶有效且是当前最短覆盖区间，堆内部允许暂存过期候选。",
          "prerequisites": [
            "heap",
            "intervals"
          ],
          "related": [
            {
              "id": 253,
              "why": "两题都排序后入堆，但排序键和失效清理含义不同。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "堆按长度排序，过期区间可能藏在内部。为什么只清理过期堆顶就足够？",
            "answer": "内部过期区间当前没有影响答案；一旦它浮到顶上，会先被清理。清理后堆顶有效，且长度不大于其他有效候选，所以答案正确。"
          },
          "uid": "lc-1851",
          "source": "02-Wiki/题目详解/1851-包含每个查询的最小区间.md",
          "code": "import heapq\nfrom typing import List\n\n\nclass Solution:\n    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:\n        intervals.sort()\n        answer, heap, i = {}, [], 0\n        for query in sorted(queries):\n            while i < len(intervals) and intervals[i][0] <= query:\n                left, right = intervals[i]\n                heapq.heappush(heap, (right - left + 1, right))\n                i += 1\n            while heap and heap[0][1] < query:\n                heapq.heappop(heap)\n            answer[query] = heap[0][0] if heap else -1\n        return [answer[query] for query in queries]",
          "url": "https://leetcode.cn/problems/minimum-interval-to-include-each-query/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1851-%E5%8C%85%E5%90%AB%E6%AF%8F%E4%B8%AA%E6%9F%A5%E8%AF%A2%E7%9A%84%E6%9C%80%E5%B0%8F%E5%8C%BA%E9%97%B4.md",
          "sourceHash": "b3b75c0e852a3dd5533da2c68e0effbda106ade66f693a5165202c050cb15310"
        },
        {
          "id": 43,
          "group": "move",
          "title": "字符串相乘",
          "level": "Medium",
          "prompt": "两个字符串表示非负整数，计算并返回乘积字符串。不能把整串转换成整数，也不能调用大整数乘法。",
          "example": "输入：\"12\" × \"34\"\n输出：\"408\"",
          "hint": "从小学竖式乘法想起：第 i 位和第 j 位相乘，个位应该落在哪个结果位置？",
          "mnemonic": "个位 i+j+1，进位往左存。",
          "why": "m 位与 n 位相乘最多 m+n 位。两位乘积按位值对齐后，个位在 i+j+1，十位进到 i+j。",
          "steps": [
            "若有一个数为 '0'，直接返回 '0'；否则建 m+n 位的全零数组。",
            "从右往左枚举 i、j：total = result[i+j+1] + 当前两位乘积。",
            "该位存 total % 10，左侧累加 total // 10；最后连接各位并去掉前导零。"
          ],
          "trace": "12 × 34，结果数组初始 [0,0,0,0]\n2×4：落索引 3 → [0,0,0,8]\n2×3：落索引 2 → [0,0,6,8]\n1×4：索引 2 的 6+4=10 → [0,1,0,8]\n1×3：索引 1 的 1+3=4 → [0,4,0,8]\n去掉前导零 → 408",
          "trap": "先加上结果位已有的值，进位用 +=。必须处理 '0'，否则去前导零后可能得到空串。",
          "complexity": "时间 O(mn)；空间 O(m+n)。",
          "recognition": "字符串大数乘法，禁止整串转整数；按位模拟竖式。",
          "invariant": "result 中累计着已处理数位乘积的位值；每次把当前结果位归一到 0…9，进位加到左侧。",
          "prerequisites": [
            "carry"
          ],
          "related": [
            {
              "id": 66,
              "why": "66 帮助理解进位；43 还要正确对齐每对数位的乘积。"
            },
            {
              "id": 371,
              "kind": "进位联系",
              "why": "43 按十进制位累计乘积并传进位；371 在二进制把无进位结果与进位分开，直到进位清空。"
            }
          ],
          "followup": {
            "type": "trace",
            "prompt": "12 × 34 中，1×4 写到哪个下标？为什么那一位要先加已有的 6？",
            "answer": "结果长度 4，1 的 i=0，4 的 j=1，落在 i+j+1=2。此前 2×3 已经贡献了 6 个十，因此该位累计 6+4=10，要存 0 并向左进 1。"
          },
          "uid": "lc-43",
          "source": "02-Wiki/题目详解/43-字符串相乘.md",
          "code": "class Solution:\n    def multiply(self, num1: str, num2: str) -> str:\n        if num1 == \"0\" or num2 == \"0\":\n            return \"0\"\n        result = [0] * (len(num1) + len(num2))\n        for i in range(len(num1) - 1, -1, -1):\n            for j in range(len(num2) - 1, -1, -1):\n                product = (ord(num1[i]) - ord(\"0\")) * (ord(num2[j]) - ord(\"0\"))\n                pos = i + j + 1\n                total = result[pos] + product\n                result[pos] = total % 10\n                result[pos - 1] += total // 10\n        return \"\".join(map(str, result)).lstrip(\"0\")",
          "url": "https://leetcode.cn/problems/multiply-strings/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/43-%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9B%B8%E4%B9%98.md",
          "sourceHash": "c32cafcff90e104fa038e76e00a5b8c3dc596732472a1168ead67900f64d0e6c"
        },
        {
          "id": 2013,
          "group": "matrix",
          "title": "检测正方形",
          "level": "Medium",
          "prompt": "支持添加二维点，并统计以查询点为一个顶点、边平行于坐标轴的非零面积正方形数量。重复添加的点要按不同选择计数。",
          "example": "已加点：(3,10)、(11,2)、(3,2)\n查询 (11,10) → 1\n再加一次 (11,2)，同一查询 → 2",
          "hint": "先找与查询点同一列的另一个点，一条竖边确定后，剩余两个点只能在哪里？",
          "mnemonic": "同列找边，两侧补点，次数相乘。",
          "why": "同列的另一个点确定竖边长度；正方形只可能在左侧或右侧。三个存储顶点的选择数相乘，得到该形状的组合数。",
          "steps": [
            "用 Counter 保存每个坐标出现的次数。add 时计数加一。",
            "count(x,y) 时，枚举同列且 py != y 的点 (x,py)，令 side = py−y。",
            "分别检查 x+side 与 x−side 处的另外两个角；把三个存储点的出现次数相乘再累加。"
          ],
          "trace": "(3,10) ────── (11,10) 查询点\n   │             │\n   │             │\n (3,2) ─────── (11,2)\n\n若三个存储点次数为 1、1、2 → 1×1×2 = 2",
          "trap": "同列找的是邻点，不是对角点。side 不能为 0；左右两侧都要查；查询点自身无需已被添加，也不乘它的出现次数。",
          "complexity": "add 平均 O(1)；count 为 O(u)，u 是不同存储坐标数；空间 O(u)。",
          "recognition": "动态点集、有重复点、统计轴对齐正方形组合数；一条边确定左右两个候选。",
          "invariant": "Counter 保留每个点的出现次数；固定查询点和一条非零竖边后，另外两个顶点的坐标被唯一确定。",
          "prerequisites": [
            "counting",
            "coordinates"
          ],
          "related": [
            {
              "id": 36,
              "why": "数独用集合判断有没有重复；正方形用计数器保留重复选择数。"
            }
          ],
          "followup": {
            "type": "transfer",
            "prompt": "三个存储顶点的出现次数分别为 2、3、1，查询点从未被添加。这个几何正方形贡献多少？",
            "answer": "贡献 2×3×1=6。查询点由本次查询提供，不需要存过，也不乘它的出现次数；只要求选取的另外三个顶点存在。"
          },
          "uid": "lc-2013",
          "source": "02-Wiki/题目详解/2013-检测正方形.md",
          "code": "from collections import Counter\nfrom typing import List\n\n\nclass DetectSquares:\n    def __init__(self):\n        self.points = Counter()\n\n    def add(self, point: List[int]) -> None:\n        self.points[tuple(point)] += 1\n\n    def count(self, point: List[int]) -> int:\n        x, y = point\n        total = 0\n        for (px, py), count in self.points.items():\n            if px != x or py == y:\n                continue\n            side = py - y\n            total += count * self.points[(x + side, y)] * self.points[(x + side, py)]\n            total += count * self.points[(x - side, y)] * self.points[(x - side, py)]\n        return total",
          "url": "https://leetcode.cn/problems/detect-squares/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/2013-%E6%A3%80%E6%B5%8B%E6%AD%A3%E6%96%B9%E5%BD%A2.md",
          "sourceHash": "e09b1a7b9007e7ff5102d8c61c8476dfd316b28f902e4e4305392612d182c4bc"
        }
      ]
    },
    {
      "id": "linked-lists-04",
      "number": "04",
      "title": "链表",
      "content": "decks/04-cards.json",
      "concepts": [
        {
          "id": "04-rewire",
          "title": "局部接线：先保存，再改变方向",
          "explanation": "画出前驱、当前、后继，再决定断开与重连顺序。",
          "example": "206 反转一个指针；24 把两个节点交换；25 先确认一整组再反转。"
        },
        {
          "id": "04-runners",
          "title": "指针速度与路程差",
          "explanation": "同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "example": "19 的固定间距定位前驱；142 的第二次相遇定位环入口。"
        },
        {
          "id": "04-merge",
          "title": "有序链表的合并与分治",
          "explanation": "结果尾部只连接当前最小候选；把双路合并推广到多路或归并排序。",
          "example": "21 比较两个表头；23 用小顶堆比较 k 个表头。"
        },
        {
          "id": "04-structure",
          "title": "组合操作与节点映射",
          "explanation": "复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "example": "143 找中点→反转→交错；146 哈希定位节点，再用双链表更新使用顺序。"
        }
      ],
      "source": "02-Wiki/专题总结/04-链表.md",
      "connectionRule": "按“改哪条边、保护哪个指针”连接。先练局部接线，再组合找中点、反转和归并；节点身份与节点数值分开理解。",
      "groups": [
        {
          "id": "rewire",
          "title": "局部接线：先保存，再改变方向",
          "description": "画出前驱、当前、后继，再决定断开与重连顺序。",
          "example": "206 反转一个指针；24 把两个节点交换；25 先确认一整组再反转。"
        },
        {
          "id": "runners",
          "title": "指针速度与路程差",
          "description": "同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "example": "19 的固定间距定位前驱；142 的第二次相遇定位环入口。"
        },
        {
          "id": "merge",
          "title": "有序链表的合并与分治",
          "description": "结果尾部只连接当前最小候选；把双路合并推广到多路或归并排序。",
          "example": "21 比较两个表头；23 用小顶堆比较 k 个表头。"
        },
        {
          "id": "structure",
          "title": "组合操作与节点映射",
          "description": "复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "example": "143 找中点→反转→交错；146 哈希定位节点，再用双链表更新使用顺序。"
        }
      ],
      "firstProblems": [
        206,
        21,
        141
      ],
      "cards": [
        {
          "uid": "lc-206",
          "id": 206,
          "group": "rewire",
          "title": "反转链表",
          "level": "Easy",
          "prompt": "给你单链表的头节点 head，请你反转链表，并返回反转后的链表。",
          "example": "输入：head = [1,2,3,4,5]\n输出：[5,4,3,2,1]",
          "hint": "先问自己：画出前驱、当前、后继，再决定断开与重连顺序。",
          "recognition": "单链表反转指向",
          "mnemonic": "先存后继，再回头连。",
          "why": "单链表反转指向。pre 是已反转部分的头，cur 是未处理部分的第一个节点。",
          "invariant": "pre 是已反转部分的头，cur 是未处理部分的第一个节点。",
          "steps": [
            "保存 cur.next",
            "把 cur.next 指向 pre",
            "同时前移 pre 与 cur，最后返回 pre"
          ],
          "trace": "输入：head = [1,2,3,4,5]\n输出：[5,4,3,2,1]\n\n手推时记录：pre 是已反转部分的头，cur 是未处理部分的第一个节点。\n\n边界检查：若先改 cur.next 再寻找下一个节点会怎样？\n原后继指针被覆盖，可能回到已经反转的部分并丢失后续链条。必须先保存 nxt。",
          "traceLabel": "例子与边界推演",
          "trap": "若先改 cur.next 再寻找下一个节点会怎样？\n原后继指针被覆盖，可能回到已经反转的部分并丢失后续链条。必须先保存 nxt。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "04-rewire"
          ],
          "related": [
            {
              "id": 24,
              "kind": "递进",
              "why": "206 保护一个后继后反转方向；24 需要保护一对节点外的连接，再同时重接三条边。"
            },
            {
              "id": 143,
              "kind": "组合",
              "why": "143 先找中点，再复用 206 反转后半段，最后交替拼接，三个步骤缺一不可。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "若先改 cur.next 再寻找下一个节点会怎样？",
            "answer": "原后继指针被覆盖，可能回到已经反转的部分并丢失后续链条。必须先保存 nxt。"
          },
          "source": "02-Wiki/题目详解/206-反转链表.md",
          "codeBlock": 0,
          "code": "def reverseList(head):\n    \"\"\"迭代法：三指针翻转\"\"\"\n    pre = None   # 已反转部分的头\n    cur = head   # 当前待反转节点\n    while cur:\n        nxt = cur.next   # 先保存下一个节点，防断链\n        cur.next = pre   # 翻转：当前节点指向前一个\n        pre = cur        # pre 前移\n        cur = nxt        # cur 前移\n    return pre  # pre 就是新链表的头节点",
          "url": "https://leetcode.cn/problems/reverse-linked-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/206-%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "98894c1f85fd739e6082d003c5450ebc0ffa092170ebb0b33b8b619314bf5763"
        },
        {
          "uid": "lc-21",
          "id": 21,
          "group": "merge",
          "title": "合并两个有序链表",
          "level": "Easy",
          "prompt": "将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。",
          "example": "输入：l1 = [1,2,4], l2 = [1,3,4]\n输出：[1,1,2,3,4,4]",
          "hint": "先问自己：结果尾部只连接当前最小候选；把双路合并推广到多路或归并排序。",
          "recognition": "合并两个有序链表",
          "mnemonic": "谁小接谁，剩下整段接上。",
          "why": "合并两个有序链表。cur 是结果尾部，结果已排序且其元素不大于剩余两个表头。",
          "invariant": "cur 是结果尾部，结果已排序且其元素不大于剩余两个表头。",
          "steps": [
            "dummy 后维护尾指针",
            "取较小表头并推进那一条链",
            "一条耗尽后连接另一条剩余部分"
          ],
          "trace": "输入：l1 = [1,2,4], l2 = [1,3,4]\n输出：[1,1,2,3,4,4]\n\n手推时记录：cur 是结果尾部，结果已排序且其元素不大于剩余两个表头。\n\n边界检查：为什么一条链表耗尽后，另一条可以整段连接？\n另一条自身已有序，且之前取走的元素都不大于它当前表头，因此整段连接仍满足全局有序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么一条链表耗尽后，另一条可以整段连接？\n另一条自身已有序，且之前取走的元素都不大于它当前表头，因此整段连接仍满足全局有序。",
          "complexity": "时间 O(m+n)，辅助空间 O(1)，复用输入节点。",
          "prerequisites": [
            "04-merge"
          ],
          "related": [
            {
              "id": 23,
              "kind": "递进",
              "why": "21 手动比较两个候选；23 用堆把同样的选择推广到 k 个候选表头。"
            },
            {
              "id": 148,
              "kind": "组合",
              "why": "148 先断链并递归排好两半，然后使用 21 的有序归并作为合并步骤。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么一条链表耗尽后，另一条可以整段连接？",
            "answer": "另一条自身已有序，且之前取走的元素都不大于它当前表头，因此整段连接仍满足全局有序。"
          },
          "source": "02-Wiki/题目详解/21-合并两个有序链表.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def mergeTwoLists(l1, l2):\n    \"\"\"迭代法：虚拟头节点 + 双指针\"\"\"\n    dummy = ListNode(0)  # 虚拟头节点\n    cur = dummy\n    \n    while l1 and l2:\n        if l1.val <= l2.val:\n            cur.next = l1\n            l1 = l1.next\n        else:\n            cur.next = l2\n            l2 = l2.next\n        cur = cur.next\n    \n    # 将剩余部分直接拼接\n    cur.next = l1 if l1 else l2\n    return dummy.next",
          "url": "https://leetcode.cn/problems/merge-two-sorted-lists/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/21-%E5%90%88%E5%B9%B6%E4%B8%A4%E4%B8%AA%E6%9C%89%E5%BA%8F%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "6539c87e8642bba2944279ae7c3ea5f47cf3eede12f47ca0975d12e657cd8c3b"
        },
        {
          "uid": "lc-141",
          "id": 141,
          "group": "runners",
          "title": "环形链表",
          "level": "Easy",
          "prompt": "给你一个链表的头节点 head，判断链表中是否有环。\n\n如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递。\n\n如果链表中存在环，返回 true；否则返回 false。",
          "example": "输入：head = [3,2,0,-4], pos = 1\n输出：true（尾节点连接到索引为 1 的节点）",
          "hint": "先问自己：同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "recognition": "判断 next 链是否有环",
          "mnemonic": "快二慢一，有环终相遇。",
          "why": "判断 next 链是否有环。只在 fast 和 fast.next 都存在时推进，环内两指针的相对距离每次改变一步。",
          "invariant": "只在 fast 和 fast.next 都存在时推进，环内两指针的相对距离每次改变一步。",
          "steps": [
            "slow 与 fast 从头开始",
            "每轮分别走一和两步",
            "相遇返回 True，快指针到空返回 False"
          ],
          "trace": "输入：head = [3,2,0,-4], pos = 1\n输出：true（尾节点连接到索引为 1 的节点）\n\n手推时记录：只在 fast 和 fast.next 都存在时推进，环内两指针的相对距离每次改变一步。\n\n边界检查：为什么不能在移动之前就用 slow==fast 判断有环？\n初始两指针本来就同在头节点；必须至少移动一轮，避免把任何非空无环链表都判为有环。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能在移动之前就用 slow==fast 判断有环？\n初始两指针本来就同在头节点；必须至少移动一轮，避免把任何非空无环链表都判为有环。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "04-runners"
          ],
          "related": [
            {
              "id": 19,
              "kind": "易混淆",
              "why": "都用两个指针，19 制造固定间距找前驱；141 使用不同速度寻找环内相遇。"
            },
            {
              "id": 142,
              "kind": "递进",
              "why": "141 只需首次相遇判环；142 还用距离关系安排第二次同速相遇找入口。"
            },
            {
              "id": 202,
              "kind": "状态成环",
              "why": "141 沿节点next走；202 沿数位平方和变换走，两者都是一个状态唯一决定下一状态，重复即进入环。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能在移动之前就用 slow==fast 判断有环？",
            "answer": "初始两指针本来就同在头节点；必须至少移动一轮，避免把任何非空无环链表都判为有环。"
          },
          "source": "02-Wiki/题目详解/141-环形链表.md",
          "codeBlock": 0,
          "code": "def hasCycle(head):\n    \"\"\"快慢指针判环\"\"\"\n    if not head or not head.next:\n        return False\n    \n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next       # 慢指针走一步\n        fast = fast.next.next  # 快指针走两步\n        if slow == fast:       # 相遇则有环\n            return True\n    return False  # fast 走到空，无环",
          "url": "https://leetcode.cn/problems/linked-list-cycle/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/141-%E7%8E%AF%E5%BD%A2%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "da71c144cfab911372a74b3ec85af8098904ede1c3331a3b69cd475e8caa8458"
        },
        {
          "uid": "lc-24",
          "id": 24,
          "group": "rewire",
          "title": "两两交换链表中的节点",
          "level": "Medium",
          "prompt": "给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部值的情况下完成本题（即只能进行节点交换）。",
          "example": "输入：head = [1,2,3,4]\n输出：[2,1,4,3]",
          "hint": "先问自己：画出前驱、当前、后继，再决定断开与重连顺序。",
          "recognition": "按节点两两交换",
          "mnemonic": "前驱接第二，第一接后继，第二接第一。",
          "why": "按节点两两交换。pre 始终是下一对待交换节点的前驱，之前的节点已经交换完成。",
          "invariant": "pre 始终是下一对待交换节点的前驱，之前的节点已经交换完成。",
          "steps": [
            "用 dummy 统一头部",
            "确定 p1、p2 并重接三条边",
            "把 pre 移到交换后的尾 p1"
          ],
          "trace": "输入：head = [1,2,3,4]\n输出：[2,1,4,3]\n\n手推时记录：pre 始终是下一对待交换节点的前驱，之前的节点已经交换完成。\n\n边界检查：为什么交换后 pre 要移到原来的 p1？\np1 现在位于这对节点的尾部，正好是下一对的前驱；移到 p2 会再次碰到刚交换过的节点。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么交换后 pre 要移到原来的 p1？\np1 现在位于这对节点的尾部，正好是下一对的前驱；移到 p2 会再次碰到刚交换过的节点。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "04-rewire"
          ],
          "related": [
            {
              "id": 206,
              "kind": "递进",
              "why": "206 保护一个后继后反转方向；24 需要保护一对节点外的连接，再同时重接三条边。"
            },
            {
              "id": 25,
              "kind": "递进",
              "why": "24 是固定两节点交换；25 把操作推广到 k 个，并新增“不足一组不改”的检查。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么交换后 pre 要移到原来的 p1？",
            "answer": "p1 现在位于这对节点的尾部，正好是下一对的前驱；移到 p2 会再次碰到刚交换过的节点。"
          },
          "source": "02-Wiki/题目详解/24-两两交换链表中的节点.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def swapPairs(head):\n    \"\"\"迭代法：虚拟头节点 + 三步交换\"\"\"\n    dummy = ListNode(0, head)\n    pre = dummy\n    \n    # 每次检查是否有两个节点可以交换\n    while pre.next and pre.next.next:\n        p1 = pre.next       # 第一个节点\n        p2 = p1.next        # 第二个节点\n        \n        # 三步交换\n        pre.next = p2       # ① 前驱指向 p2\n        p1.next = p2.next   # ② p1 指向 p2 的后继\n        p2.next = p1        # ③ p2 指向 p1（完成交换）\n        \n        pre = p1            # pre 移到下一对的前驱（即 p1）\n    \n    return dummy.next",
          "url": "https://leetcode.cn/problems/swap-nodes-in-pairs/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/24-%E4%B8%A4%E4%B8%A4%E4%BA%A4%E6%8D%A2%E9%93%BE%E8%A1%A8%E4%B8%AD%E7%9A%84%E8%8A%82%E7%82%B9.md",
          "sourceHash": "a210cad0aac6d92816a838a5343c97cab65fb1e0eb700f9e826e53ba5eb0a406"
        },
        {
          "uid": "lc-25",
          "id": 25,
          "group": "rewire",
          "title": "K 个一组翻转链表",
          "level": "Hard",
          "prompt": "给你链表的头节点 head，每 k 个节点一组进行翻转，返回修改后的链表。\n\nk 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。",
          "example": "输入：head = [1,2,3,4,5], k = 2\n输出：[2,1,4,3,5]\n输入：head = [1,2,3,4,5], k = 3\n输出：[3,2,1,4,5]",
          "hint": "先问自己：画出前驱、当前、后继，再决定断开与重连顺序。",
          "recognition": "每 k 个节点反转，不足 k 个保持原样",
          "mnemonic": "先数够，再整组翻。",
          "why": "每 k 个节点反转，不足 k 个保持原样。pre 指向上一组末尾；每轮先保存下一组入口，翻完后重连两侧。",
          "invariant": "pre 指向上一组末尾；每轮先保存下一组入口，翻完后重连两侧。",
          "steps": [
            "从 pre 向后确认 k 个节点",
            "保存组头与下一组头并反转 k 次",
            "前驱接新头、旧头接下一组"
          ],
          "trace": "输入：head = [1,2,3,4,5], k = 2\n输出：[2,1,4,3,5]\n输入：head = [1,2,3,4,5], k = 3\n输出：[3,2,1,4,5]\n\n手推时记录：pre 指向上一组末尾；每轮先保存下一组入口，翻完后重连两侧。\n\n边界检查：为什么不能一边数一边反转，发现不足 k 个就退出？\n不足 k 个的尾段应该保持原样；边数边改会先破坏它，需要再恢复。先探测长度可以避免这次错误修改。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能一边数一边反转，发现不足 k 个就退出？\n不足 k 个的尾段应该保持原样；边数边改会先破坏它，需要再恢复。先探测长度可以避免这次错误修改。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "04-rewire"
          ],
          "related": [
            {
              "id": 24,
              "kind": "递进",
              "why": "24 是固定两节点交换；25 把操作推广到 k 个，并新增“不足一组不改”的检查。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能一边数一边反转，发现不足 k 个就退出？",
            "answer": "不足 k 个的尾段应该保持原样；边数边改会先破坏它，需要再恢复。先探测长度可以避免这次错误修改。"
          },
          "source": "02-Wiki/题目详解/25-K个一组翻转链表.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def reverseKGroup(head, k):\n    \"\"\"迭代法：虚拟头节点 + 分组翻转 + 组间重连\"\"\"\n    if not head or k == 1:\n        return head\n    \n    dummy = ListNode(0, head)\n    pre = dummy  # 上一组的末尾（也是当前组的前驱）\n    \n    while True:\n        # 1. 检查是否有 K 个节点\n        cur = pre\n        for _ in range(k):\n            cur = cur.next\n            if not cur:\n                return dummy.next  # 不足 K 个，结束\n        \n        # 2. 翻转 K 个节点\n        group_head = pre.next   # 当前组的第一个节点（将成为最后一个）\n        next_group = cur.next   # 下一组的头节点\n        \n        # 翻转 [group_head, cur] 这一段\n        prev, curr = None, group_head\n        for _ in range(k):\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        # 翻转后 prev 是新头，group_head 是尾\n        \n        # 3. 组间重连\n        pre.next = prev          # 前驱指向新头\n        group_head.next = next_group  # 当前组尾指向下一组\n        \n        pre = group_head  # pre 移到当前组尾（即下一组的前驱）\n\n\ndef reverse(head, k):\n    \"\"\"辅助函数：翻转长度为 K 的子链表，返回新头\"\"\"\n    pre, cur = None, head\n    for _ in range(k):\n        nxt = cur.next\n        cur.next = pre\n        pre = cur\n        cur = nxt\n    return pre",
          "url": "https://leetcode.cn/problems/reverse-nodes-in-k-group/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/25-K%E4%B8%AA%E4%B8%80%E7%BB%84%E7%BF%BB%E8%BD%AC%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "42c83d3a132ad848b1f1f4664b79bad896ccc7a24d1e7273e76c596ace7adff5"
        },
        {
          "uid": "lc-19",
          "id": 19,
          "group": "runners",
          "title": "删除链表的倒数第 N 个节点",
          "level": "Medium",
          "prompt": "删除单链表倒数第 n 个节点并返回新头节点。n 从 1 开始且保证有效；尝试一次遍历完成。",
          "example": "输入：head = [1,2,3,4,5], n = 2\n输出：[1,2,3,5]",
          "hint": "先问自己：同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "recognition": "删除倒数第 n 个，真正需要它的前驱",
          "mnemonic": "快指针先领先 n+1。",
          "why": "删除倒数第 n 个，真正需要它的前驱。两指针从 dummy 出发保持 n+1 条边的间距，fast 到空时 slow 在待删前驱。",
          "invariant": "两指针从 dummy 出发保持 n+1 条边的间距，fast 到空时 slow 在待删前驱。",
          "steps": [
            "建立 dummy",
            "fast 先走 n+1 步后同步前进",
            "跳过 slow.next 并返回 dummy.next"
          ],
          "trace": "输入：head = [1,2,3,4,5], n = 2\n输出：[1,2,3,5]\n解释：删除倒数第 2 个节点（值为 4）\n\n手推时记录：两指针从 dummy 出发保持 n+1 条边的间距，fast 到空时 slow 在待删前驱。\n\n边界检查：长度等于 n、需要删除头节点时，为何不用单独分支？\nslow 会停在 dummy，slow.next 就是原头；统一执行 slow.next=slow.next.next 即可删除头。",
          "traceLabel": "例子与边界推演",
          "trap": "长度等于 n、需要删除头节点时，为何不用单独分支？\nslow 会停在 dummy，slow.next 就是原头；统一执行 slow.next=slow.next.next 即可删除头。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "04-runners"
          ],
          "related": [
            {
              "id": 141,
              "kind": "易混淆",
              "why": "都用两个指针，19 制造固定间距找前驱；141 使用不同速度寻找环内相遇。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "长度等于 n、需要删除头节点时，为何不用单独分支？",
            "answer": "slow 会停在 dummy，slow.next 就是原头；统一执行 slow.next=slow.next.next 即可删除头。"
          },
          "source": "02-Wiki/题目详解/19-删除链表的倒数第N个节点.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def removeNthFromEnd(head, n):\n    \"\"\"快慢指针 + 虚拟头节点\"\"\"\n    dummy = ListNode(0, head)  # 虚拟头节点，防止删除头节点时出问题\n    fast = slow = dummy\n    \n    # 快指针先走 n+1 步\n    for _ in range(n + 1):\n        fast = fast.next\n    \n    # 快慢指针同步前进\n    while fast:\n        fast = fast.next\n        slow = slow.next\n    \n    # 此时 slow 指向待删节点的前驱\n    slow.next = slow.next.next\n    return dummy.next",
          "url": "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/19-%E5%88%A0%E9%99%A4%E9%93%BE%E8%A1%A8%E7%9A%84%E5%80%92%E6%95%B0%E7%AC%ACN%E4%B8%AA%E8%8A%82%E7%82%B9.md",
          "sourceHash": "1b86d3e1f33168bef2005fbbf161ab8f41b63409e2c456d1a982b083b965ebc3"
        },
        {
          "uid": "lc-142",
          "id": 142,
          "group": "runners",
          "title": "环形链表 II",
          "level": "Medium",
          "prompt": "给定一个链表的头节点 head，返回链表开始入环的第一个节点。如果链表无环，则返回 null。\n\n为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。注意：pos 不作为参数进行传递。",
          "example": "输入：head = [3,2,0,-4], pos = 1\n输出：返回索引为 1 的节点",
          "hint": "先问自己：同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "recognition": "不只判环，还要入口",
          "mnemonic": "先相遇，再一回头同速走。",
          "why": "不只判环，还要入口。首次相遇后一个指针回头，两者每次走一步会在环入口相遇。",
          "invariant": "首次相遇后一个指针回头，两者每次走一步会在环入口相遇。",
          "steps": [
            "用 Floyd 找首次相遇",
            "一个指针移回 head",
            "同速前进直到再次相遇"
          ],
          "trace": "输入：head = [3,2,0,-4], pos = 1\n输出：返回索引为 1 的节点\n\n手推时记录：首次相遇后一个指针回头，两者每次走一步会在环入口相遇。\n\n边界检查：首次相遇点一定是环入口吗？第二阶段为什么有效？\n不一定。设入环前长 a、相遇点距入口 b、环长 L，则 a+b 是 L 的倍数；头指针走 a 步到入口，另一指针从相遇点同走 a 步也绕回入口。",
          "traceLabel": "例子与边界推演",
          "trap": "首次相遇点一定是环入口吗？第二阶段为什么有效？\n不一定。设入环前长 a、相遇点距入口 b、环长 L，则 a+b 是 L 的倍数；头指针走 a 步到入口，另一指针从相遇点同走 a 步也绕回入口。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "04-runners"
          ],
          "related": [
            {
              "id": 141,
              "kind": "递进",
              "why": "141 只需首次相遇判环；142 还用距离关系安排第二次同速相遇找入口。"
            },
            {
              "id": 160,
              "kind": "易混淆",
              "why": "两题都靠路程关系找共同节点；142 利用环长整倍数，160 通过交换起点抵消链长差。"
            },
            {
              "id": 287,
              "kind": "同模板",
              "why": "287 把数组值解释为下个下标，将142的快慢指针环入口算法迁移到数组；值域约束保证这种映射成立。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "首次相遇点一定是环入口吗？第二阶段为什么有效？",
            "answer": "不一定。设入环前长 a、相遇点距入口 b、环长 L，则 a+b 是 L 的倍数；头指针走 a 步到入口，另一指针从相遇点同走 a 步也绕回入口。"
          },
          "source": "02-Wiki/题目详解/142-环形链表II.md",
          "codeBlock": 0,
          "code": "def detectCycle(head):\n    \"\"\"Floyd 判圈法：快慢指针 + 数学推导\"\"\"\n    if not head or not head.next:\n        return None\n    \n    # 第一阶段：快慢指针相遇\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            # 第二阶段：找环入口\n            slow = head  # 一个指针回到头节点\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow  # 再次相遇点即环入口\n    return None  # 无环",
          "url": "https://leetcode.cn/problems/linked-list-cycle-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/142-%E7%8E%AF%E5%BD%A2%E9%93%BE%E8%A1%A8II.md",
          "sourceHash": "cd9bd130088b24e1b696eecf12fb18402556cf6a7975d55da8cdf7d463a70e97"
        },
        {
          "uid": "lc-160",
          "id": 160,
          "group": "runners",
          "title": "相交链表",
          "level": "Easy",
          "prompt": "给你两个单链表的头节点 headA 和 headB，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null。\n\n题目数据保证整个链式结构中不存在环。\n\n注意： 函数返回结果后，链表必须保持其原始结构。",
          "example": "输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3\n输出：Intersected at '8'",
          "hint": "先问自己：同向指针可制造固定间距、寻找中点、相遇判环；换起点可抵消长度差。",
          "recognition": "找共享的同一节点而非相同数值",
          "mnemonic": "走完自己的路，再走对方的路。",
          "why": "找共享的同一节点而非相同数值。两指针分别走 A+B 与 B+A，切换后抵消原链表长度差。",
          "invariant": "两指针分别走 A+B 与 B+A，切换后抵消原链表长度差。",
          "steps": [
            "从两表头出发",
            "到空时切到另一表头",
            "两指针相同则返回该节点或 None"
          ],
          "trace": "输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3\n输出：Intersected at '8'\n解释：相交节点的值为 8（注意，相交是节点引用相同，不是值相同）\n\n手推时记录：两指针分别走 A+B 与 B+A，切换后抵消原链表长度差。\n\n边界检查：两个链表都含数值 8，是否说明相交？\n不说明。相交要求引用指向同一个节点对象，之后共享整段后缀；只有数值相同仍可能完全独立。",
          "traceLabel": "例子与边界推演",
          "trap": "两个链表都含数值 8，是否说明相交？\n不说明。相交要求引用指向同一个节点对象，之后共享整段后缀；只有数值相同仍可能完全独立。",
          "complexity": "时间 O(m+n)，空间 O(1)。",
          "prerequisites": [
            "04-runners"
          ],
          "related": [
            {
              "id": 142,
              "kind": "易混淆",
              "why": "两题都靠路程关系找共同节点；142 利用环长整倍数，160 通过交换起点抵消链长差。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "两个链表都含数值 8，是否说明相交？",
            "answer": "不说明。相交要求引用指向同一个节点对象，之后共享整段后缀；只有数值相同仍可能完全独立。"
          },
          "source": "02-Wiki/题目详解/160-相交链表.md",
          "codeBlock": 0,
          "code": "def getIntersectionNode(headA, headB):\n    \"\"\"双指针等路程法\"\"\"\n    if not headA or not headB:\n        return None\n    \n    pA, pB = headA, headB\n    while pA != pB:\n        # pA 走完了换到 headB，pB 走完了换到 headA\n        pA = pA.next if pA else headB\n        pB = pB.next if pB else headA\n    return pA  # 相遇点或 None",
          "url": "https://leetcode.cn/problems/intersection-of-two-linked-lists/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/160-%E7%9B%B8%E4%BA%A4%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "c6913aab24ea4373b54e4ecb6b6473fac69cd6a2d88a48da0be566930d31c2d7"
        },
        {
          "uid": "lc-23",
          "id": 23,
          "group": "merge",
          "title": "合并 K 个升序链表",
          "level": "Hard",
          "prompt": "给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。",
          "example": "输入：lists = [[1,4,5],[1,3,4],[2,6]]\n输出：[1,1,2,3,4,4,5,6]",
          "hint": "先问自己：结果尾部只连接当前最小候选；把双路合并推广到多路或归并排序。",
          "recognition": "k 条有序链表每次挑最小表头",
          "mnemonic": "每路一个候选放小堆。",
          "why": "k 条有序链表每次挑最小表头。堆里至多包含每条链的一个未合并表头，最小候选就是全局下一个节点。",
          "invariant": "堆里至多包含每条链的一个未合并表头，最小候选就是全局下一个节点。",
          "steps": [
            "所有非空表头入堆",
            "弹出最小节点接到尾部",
            "该节点的后继从同一路入堆"
          ],
          "trace": "输入：lists = [[1,4,5],[1,3,4],[2,6]]\n输出：[1,1,2,3,4,4,5,6]\n\n手推时记录：堆里至多包含每条链的一个未合并表头，最小候选就是全局下一个节点。\n\n边界检查：节点值相同时，堆元组为什么还要放链表编号？\nPython 可能继续比较元组后面的元素；链表编号打破不同链之间的平局，避免直接比较不可排序的 ListNode 对象。",
          "traceLabel": "例子与边界推演",
          "trap": "节点值相同时，堆元组为什么还要放链表编号？\nPython 可能继续比较元组后面的元素；链表编号打破不同链之间的平局，避免直接比较不可排序的 ListNode 对象。",
          "complexity": "N 个总节点、k 条链：时间 O(N log(k+1))，辅助空间 O(k)。",
          "prerequisites": [
            "04-merge"
          ],
          "related": [
            {
              "id": 21,
              "kind": "递进",
              "why": "21 手动比较两个候选；23 用堆把同样的选择推广到 k 个候选表头。"
            },
            {
              "id": 355,
              "kind": "同模板",
              "why": "两题都比较多路有序来源；23 每路只放当前表头并逐次补入，355 的此实现从每路取最近十条作有界候选，再选全局前十。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "节点值相同时，堆元组为什么还要放链表编号？",
            "answer": "Python 可能继续比较元组后面的元素；链表编号打破不同链之间的平局，避免直接比较不可排序的 ListNode 对象。"
          },
          "source": "02-Wiki/题目详解/23-合并K个升序链表.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "import heapq\n\ndef mergeKLists(lists):\n    \"\"\"最小堆法\"\"\"\n    dummy = ListNode(0)\n    cur = dummy\n    heap = []\n    \n    # 将所有链表的头节点加入堆\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))\n    \n    while heap:\n        val, i, node = heapq.heappop(heap)  # 取出最小节点\n        cur.next = node\n        cur = cur.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n    \n    return dummy.next",
          "url": "https://leetcode.cn/problems/merge-k-sorted-lists/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/23-%E5%90%88%E5%B9%B6K%E4%B8%AA%E5%8D%87%E5%BA%8F%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "0a5199616642b33a23388c405a0be4e88f8830fb8f17015f0d2ede4215833335"
        },
        {
          "uid": "lc-148",
          "id": 148,
          "group": "merge",
          "title": "排序链表",
          "level": "Medium",
          "prompt": "给你链表的头结点 head，将其按升序排列并返回排序后的链表。\n\n进阶： 你可以在 O(n log n) 时间复杂度和常数级空间复杂度下解决吗？",
          "example": "输入：head = [4,2,1,3]\n输出：[1,2,3,4]",
          "hint": "先问自己：结果尾部只连接当前最小候选；把双路合并推广到多路或归并排序。",
          "recognition": "链表排序不便随机访问",
          "mnemonic": "中间断开，各自排好再归并。",
          "why": "链表排序不便随机访问。每次递归返回当前子链表的有序头节点，左右两条递归输入必须已经断开。",
          "invariant": "每次递归返回当前子链表的有序头节点，左右两条递归输入必须已经断开。",
          "steps": [
            "快慢指针找中点并断链",
            "递归排序两半",
            "复用双路归并接出有序链"
          ],
          "trace": "输入：head = [4,2,1,3]\n输出：[1,2,3,4]\n\n手推时记录：每次递归返回当前子链表的有序头节点，左右两条递归输入必须已经断开。\n\n边界检查：为什么找到中点之后必须 slow.next=None？\n不断开时左半仍连着右半，递归输入可能不变长，既不能形成独立子问题也可能无限递归。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么找到中点之后必须 slow.next=None？\n不断开时左半仍连着右半，递归输入可能不变长，既不能形成独立子问题也可能无限递归。",
          "complexity": "时间 O(n log n)，本递归实现栈空间 O(log n)。",
          "prerequisites": [
            "04-merge"
          ],
          "related": [
            {
              "id": 21,
              "kind": "组合",
              "why": "148 先断链并递归排好两半，然后使用 21 的有序归并作为合并步骤。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么找到中点之后必须 slow.next=None？",
            "answer": "不断开时左半仍连着右半，递归输入可能不变长，既不能形成独立子问题也可能无限递归。"
          },
          "source": "02-Wiki/题目详解/148-排序链表.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。 当前递归归并使用 O(log n) 调用栈；若要求严格常数额外空间，需要改成自底向上的迭代归并。",
          "code": "def sortList(head):\n    \"\"\"自顶向下归并排序\"\"\"\n    if not head or not head.next:\n        return head\n    \n    # 1. 快慢指针找中点\n    slow, fast = head, head.next\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    \n    mid = slow.next   # 右半段起点\n    slow.next = None  # 断开为左右两段\n    \n    # 2. 递归排序左右两半\n    left = sortList(head)\n    right = sortList(mid)\n    \n    # 3. 合并两个有序链表\n    dummy = ListNode(0)\n    cur = dummy\n    while left and right:\n        if left.val <= right.val:\n            cur.next = left\n            left = left.next\n        else:\n            cur.next = right\n            right = right.next\n        cur = cur.next\n    cur.next = left if left else right\n    return dummy.next",
          "url": "https://leetcode.cn/problems/sort-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/148-%E6%8E%92%E5%BA%8F%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "8c9a5e0d2826aaaee26ac04816d6af7441761dead98adc38611ad4c7a3fb7fc3"
        },
        {
          "uid": "lc-2",
          "id": 2,
          "group": "structure",
          "title": "两数相加",
          "level": "Medium",
          "prompt": "给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序方式存储的，并且每个节点只能存储一位数字。\n\n请你将两个数相加，并以相同形式返回一个表示和的链表。",
          "example": "输入：l1 = [2,4,3], l2 = [5,6,4]\n输出：[7,0,8]",
          "hint": "先问自己：复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "recognition": "低位在链表头的加法",
          "mnemonic": "两表加进位，空位当零。",
          "why": "低位在链表头的加法。cur 前的结果保存已处理低位，carry 保存向下一位传递的进位。",
          "invariant": "cur 前的结果保存已处理低位，carry 保存向下一位传递的进位。",
          "steps": [
            "dummy 后建立结果",
            "循环到两表与进位全部耗尽",
            "当前总和取模成新节点、整除为进位"
          ],
          "trace": "输入：l1 = [2,4,3], l2 = [5,6,4]\n输出：[7,0,8]\n解释：342 + 465 = 807\n\n手推时记录：cur 前的结果保存已处理低位，carry 保存向下一位传递的进位。\n\n边界检查：两条链都走完时为何仍可能需要循环一次？\n例如 [9]+[1]，第一位输出 0 后仍有 carry=1，必须额外生成节点 1，得到 [0,1]。",
          "traceLabel": "例子与边界推演",
          "trap": "两条链都走完时为何仍可能需要循环一次？\n例如 [9]+[1]，第一位输出 0 后仍有 carry=1，必须额外生成节点 1，得到 [0,1]。",
          "complexity": "时间 O(max(m,n))，新结果占 O(max(m,n)) 空间。",
          "prerequisites": [
            "04-structure"
          ],
          "related": [
            {
              "id": 66,
              "kind": "迁移",
              "why": "都按位传播进位；2 的低位在头部，从前往后扫描，66 的低位在数组末尾，从后往前扫描。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "两条链都走完时为何仍可能需要循环一次？",
            "answer": "例如 [9]+[1]，第一位输出 0 后仍有 carry=1，必须额外生成节点 1，得到 [0,1]。"
          },
          "source": "02-Wiki/题目详解/2-两数相加.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def addTwoNumbers(l1, l2):\n    \"\"\"模拟竖式加法\"\"\"\n    dummy = ListNode(0)  # 虚拟头节点\n    cur = dummy\n    carry = 0  # 进位\n    \n    while l1 or l2 or carry:\n        # 取当前位的值，链表为空时取 0\n        val1 = l1.val if l1 else 0\n        val2 = l2.val if l2 else 0\n        \n        total = val1 + val2 + carry\n        carry = total // 10          # 新的进位\n        cur.next = ListNode(total % 10)  # 当前位的值\n        \n        cur = cur.next\n        if l1: l1 = l1.next\n        if l2: l2 = l2.next\n    \n    return dummy.next",
          "url": "https://leetcode.cn/problems/add-two-numbers/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/2-%E4%B8%A4%E6%95%B0%E7%9B%B8%E5%8A%A0.md",
          "sourceHash": "d7e7db84924ce25fae494426f50ddc75ddc22fb745e1a37270d6535e99fb2935"
        },
        {
          "uid": "lc-138",
          "id": 138,
          "group": "structure",
          "title": "随机链表的复制",
          "level": "Medium",
          "prompt": "给你一个长度为 n 的链表，每个节点包含一个额外的随机指针 random，该指针可以指向链表中的任意节点或 null。\n\n构造这个链表的深拷贝。深拷贝应该由 n 个全新节点组成，每个新节点的值都设为其对应的原节点的值，新节点的 next 和 random 指针都应指向对应新节点。",
          "example": "输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\n输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]",
          "hint": "先问自己：复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "recognition": "复制 next 和 random 且要独立新节点",
          "mnemonic": "把副本临时插在原节点后。",
          "why": "复制 next 和 random 且要独立新节点。交织阶段每个原节点的 next 恰好是其副本，可通过原 random 的 next 定位随机目标副本。",
          "invariant": "交织阶段每个原节点的 next 恰好是其副本，可通过原 random 的 next 定位随机目标副本。",
          "steps": [
            "在每个原节点后插副本",
            "设置 clone.random=original.random.next",
            "拆成两条链并恢复原链"
          ],
          "trace": "输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]\n输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]\n\n手推时记录：交织阶段每个原节点的 next 恰好是其副本，可通过原 random 的 next 定位随机目标副本。\n\n边界检查：为什么不能直接 clone.random=original.random？\n那会让副本指向原链节点，不是深拷贝。交织后 random.next 才是目标节点的副本；random 为空要单独处理。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能直接 clone.random=original.random？\n那会让副本指向原链节点，不是深拷贝。交织后 random.next 才是目标节点的副本；random 为空要单独处理。",
          "complexity": "时间 O(n)，额外辅助 O(1)，另计 O(n) 新节点。",
          "prerequisites": [
            "04-structure"
          ],
          "related": [
            {
              "id": 133,
              "kind": "结构变化",
              "why": "都需要原节点到副本的对应关系；138 可借 next 暂存映射，图克隆 133 通常用独立哈希表并先登记防环。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能直接 clone.random=original.random？",
            "answer": "那会让副本指向原链节点，不是深拷贝。交织后 random.next 才是目标节点的副本；random 为空要单独处理。"
          },
          "source": "02-Wiki/题目详解/138-随机链表的复制.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def copyRandomList(head):\n    \"\"\"三步法：插入克隆 → 设置 random → 拆分\"\"\"\n    if not head:\n        return None\n    \n    # 第一步：在每个原节点后插入克隆节点\n    cur = head\n    while cur:\n        clone = Node(cur.val)\n        clone.next = cur.next\n        cur.next = clone\n        cur = clone.next  # 跳到原链表的下一个节点\n    \n    # 第二步：设置克隆节点的 random 指针\n    cur = head\n    while cur:\n        if cur.random:\n            cur.next.random = cur.random.next  # 关键！原节点.random 的 next 就是对应的克隆节点\n        cur = cur.next.next  # 一次跳两步，跳过克隆节点\n    \n    # 第三步：拆分链表\n    cur = head\n    new_head = head.next  # 保存克隆链表的头\n    while cur:\n        clone = cur.next\n        cur.next = clone.next  # 恢复原链表的 next\n        if clone.next:\n            clone.next = clone.next.next  # 连接克隆链表的 next\n        cur = cur.next  # cur 已经是原链表的下一个节点\n    \n    return new_head",
          "url": "https://leetcode.cn/problems/copy-list-with-random-pointer/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/138-%E9%9A%8F%E6%9C%BA%E9%93%BE%E8%A1%A8%E7%9A%84%E5%A4%8D%E5%88%B6.md",
          "sourceHash": "816254566d32f1055aa5ef81e14f12d40f19e476cf3910bea8e532aff3893b1d"
        },
        {
          "uid": "lc-143",
          "id": 143,
          "group": "structure",
          "title": "重排链表",
          "level": "Medium",
          "prompt": "原地把单链表 L0 → L1 → … → Ln 改为 L0 → Ln → L1 → Ln−1 → …。只能重新连接节点，不能修改节点值。",
          "example": "输入：head=[1,2,3,4]\n输出：[1,4,2,3]",
          "hint": "先问自己：复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "recognition": "首尾交错重排且单链表不能倒着走",
          "mnemonic": "找中点、反后半、交替接。",
          "why": "首尾交错重排且单链表不能倒着走。两半先断开，交替合并时始终保存两条链各自的未使用后继。",
          "invariant": "两半先断开，交替合并时始终保存两条链各自的未使用后继。",
          "steps": [
            "快慢指针找中点并断开",
            "反转后半条链",
            "从两半轮流取一个节点连接"
          ],
          "trace": "1→2→3→4 找中点并反转后半后，交错合并为 1→4→2→3。\n\n手推时记录：两半先断开，交替合并时始终保存两条链各自的未使用后继。\n\n边界检查：为什么反转后半段前要先把两半断开？\n旧中点连接如果保留，交替拼接后可能构成环；断开才能让两条链作为独立输入正确合并。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么反转后半段前要先把两半断开？\n旧中点连接如果保留，交替拼接后可能构成环；断开才能让两条链作为独立输入正确合并。",
          "complexity": "时间 O(n)，辅助空间 O(1)。",
          "prerequisites": [
            "04-structure"
          ],
          "related": [
            {
              "id": 206,
              "kind": "组合",
              "why": "143 先找中点，再复用 206 反转后半段，最后交替拼接，三个步骤缺一不可。"
            },
            {
              "id": 234,
              "kind": "易混淆",
              "why": "两题都找中点并反转后半段；143 之后改接线，234 之后只逐个比较数值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么反转后半段前要先把两半断开？",
            "answer": "旧中点连接如果保留，交替拼接后可能构成环；断开才能让两条链作为独立输入正确合并。"
          },
          "source": "02-Wiki/题目详解/143-重排链表.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def reorderList(self, head: ListNode | None) -> None:\n        if not head or not head.next:\n            return\n        slow = fast = head\n        while fast.next and fast.next.next:\n            slow, fast = slow.next, fast.next.next\n        second, slow.next = slow.next, None\n        prev = None\n        while second:\n            second.next, prev, second = prev, second, second.next\n        first, second = head, prev\n        while second:\n            first.next, first = second, first.next\n            second.next, second = first, second.next",
          "url": "https://leetcode.cn/problems/reorder-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/143-%E9%87%8D%E6%8E%92%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "316cc6016e9c8f31e8dd4ba632acf23aa21a45d68cf2b34b1a22d146eb084c62"
        },
        {
          "uid": "lc-234",
          "id": 234,
          "group": "structure",
          "title": "回文链表",
          "level": "Easy",
          "prompt": "给你一个单链表的头节点 head，请你判断该链表是否为回文链表。如果是，返回 true；否则，返回 false。",
          "example": "输入：head = [1,2,2,1]\n输出：true\n输入：head = [1,2]\n输出：false\n\n进阶： 你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决？",
          "hint": "先问自己：复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "recognition": "链表判断回文需首尾比较",
          "mnemonic": "找到中点，把后半段翻过来。",
          "why": "链表判断回文需首尾比较。反转后的后半段按原链尾到中间排列，与前半段逐个比较。",
          "invariant": "反转后的后半段按原链尾到中间排列，与前半段逐个比较。",
          "steps": [
            "快慢指针到中点",
            "反转后半段",
            "从原头和新后半头逐个比较"
          ],
          "trace": "输入：head = [1,2,2,1]\n输出：true\n输入：head = [1,2]\n输出：false\n\n进阶： 你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决？\n\n手推时记录：反转后的后半段按原链尾到中间排列，与前半段逐个比较。\n\n边界检查：这份 O(1) 空间代码会不会改变输入？怎样避免留下改变？\n会改变后半段的 next。若调用者要求保留输入，应在比较后再次反转后半段并重接；即使提前发现不等，也要完成恢复。",
          "traceLabel": "例子与边界推演",
          "trap": "这份 O(1) 空间代码会不会改变输入？怎样避免留下改变？\n会改变后半段的 next。若调用者要求保留输入，应在比较后再次反转后半段并重接；即使提前发现不等，也要完成恢复。",
          "complexity": "时间 O(n)，额外空间 O(1)；展示版本会修改输入链。",
          "prerequisites": [
            "04-structure"
          ],
          "related": [
            {
              "id": 125,
              "kind": "结构变化",
              "why": "都比较首尾对称；字符串可直接双向索引，单链表必须先找中点并反转后半段。"
            },
            {
              "id": 143,
              "kind": "易混淆",
              "why": "两题都找中点并反转后半段；143 之后改接线，234 之后只逐个比较数值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "这份 O(1) 空间代码会不会改变输入？怎样避免留下改变？",
            "answer": "会改变后半段的 next。若调用者要求保留输入，应在比较后再次反转后半段并重接；即使提前发现不等，也要完成恢复。"
          },
          "source": "02-Wiki/题目详解/234-回文链表.md",
          "codeBlock": 0,
          "code": "def isPalindrome(head):\n    \"\"\"快慢指针找中点 + 反转后半部分\"\"\"\n    if not head or not head.next:\n        return True\n    \n    # 1. 快慢指针找中点（slow 最终指向后半段的起点）\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    \n    # 2. 反转后半部分链表\n    prev = None\n    cur = slow\n    while cur:\n        nxt = cur.next\n        cur.next = prev\n        prev = cur\n        cur = nxt\n    \n    # 3. 比较前半部分和反转后的后半部分\n    left, right = head, prev\n    while right:  # 后半段可能更短（奇数节点时）\n        if left.val != right.val:\n            return False\n        left = left.next\n        right = right.next\n    return True",
          "url": "https://leetcode.cn/problems/palindrome-linked-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/234-%E5%9B%9E%E6%96%87%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "ab9060d0f4020bf32506368d7bb7de39f1ed780f5f6e4f0a1af8bd1c7aa1099c"
        },
        {
          "uid": "lc-146",
          "id": 146,
          "group": "structure",
          "title": "LRU 缓存",
          "level": "Medium",
          "prompt": "请你设计并实现一个满足 LRU（最近最少使用）缓存约束的数据结构。\n\n实现 LRUCache 类：\nLRUCache(int capacity) —— 以正整数作为容量初始化 LRU 缓存\nint get(int key) —— 如果关键字 key 存在于缓存中，返回关键字的值，否则返回 -1\nvoid put(int key, int value) —— 如果 key 已经存在，修改其 value；如果不存在，插入该键值对。当缓存容量达到上限时，应淘汰最久未使用的键值对\n\n要求： get 和 put 的时间复杂度都是 O(1)。",
          "example": "容量 2：put(1,1)，put(2,2)，get(1) → 1\nput(3,3) 后，get(2) → −1，因为键 2 最久未使用。",
          "hint": "先问自己：复杂题把基础操作组合起来；复制和缓存还要求维护节点身份或定位表。",
          "recognition": "查询和更新最近使用顺序都要 O(1)",
          "mnemonic": "哈希找节点，双链挪位置。",
          "why": "查询和更新最近使用顺序都要 O(1)。哈希表和双链表包含同一批缓存节点；表头最近使用，表尾最久未使用。",
          "invariant": "哈希表和双链表包含同一批缓存节点；表头最近使用，表尾最久未使用。",
          "steps": [
            "哈希定位节点",
            "get 或更新后移到头部",
            "超容量时删尾节点并同步删除哈希键"
          ],
          "trace": "容量 2：put(1,1)，put(2,2)，get(1) → 1\nput(3,3) 后，get(2) → −1，因为键 2 最久未使用。\n\n手推时记录：哈希表和双链表包含同一批缓存节点；表头最近使用，表尾最久未使用。\n\n边界检查：为什么节点必须同时存 key 与 value？\n淘汰从链表尾找到节点后，还需要凭它的 key 删除哈希表记录；只存 value 就无法 O(1) 同步删除。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么节点必须同时存 key 与 value？\n淘汰从链表尾找到节点后，还需要凭它的 key 删除哈希表记录；只存 value 就无法 O(1) 同步删除。",
          "complexity": "get/put 平均 O(1)，容量 C 时空间 O(C)。",
          "prerequisites": [
            "04-structure"
          ],
          "related": [
            {
              "id": 1,
              "kind": "组合",
              "why": "1 用哈希快速查下标；146 用哈希快速查双链节点，再借链表完成 O(1) 次序更新。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么节点必须同时存 key 与 value？",
            "answer": "淘汰从链表尾找到节点后，还需要凭它的 key 删除哈希表记录；只存 value 就无法 O(1) 同步删除。"
          },
          "source": "02-Wiki/题目详解/146-LRU缓存.md",
          "codeBlock": 0,
          "code": "class DLinkedNode:\n    \"\"\"双向链表节点\"\"\"\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\n\nclass LRUCache:\n    \"\"\"哈希表 + 双向链表实现 LRU 缓存\"\"\"\n    \n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}  # key → node\n        # 虚拟头尾节点\n        self.head = DLinkedNode()\n        self.tail = DLinkedNode()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n    \n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        node = self.cache[key]\n        self._move_to_head(node)  # 移到头部表示最近使用\n        return node.val\n    \n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            # 更新值并移到头部\n            node = self.cache[key]\n            node.val = value\n            self._move_to_head(node)\n        else:\n            # 创建新节点\n            node = DLinkedNode(key, value)\n            self.cache[key] = node\n            self._add_to_head(node)\n            # 超出容量则淘汰尾部\n            if len(self.cache) > self.capacity:\n                removed = self._remove_tail()\n                del self.cache[removed.key]\n    \n    def _add_to_head(self, node):\n        \"\"\"将节点插入到头部（head 之后）\"\"\"\n        node.prev = self.head\n        node.next = self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n    \n    def _remove_node(self, node):\n        \"\"\"删除节点\"\"\"\n        node.prev.next = node.next\n        node.next.prev = node.prev\n    \n    def _move_to_head(self, node):\n        \"\"\"将节点移到头部\"\"\"\n        self._remove_node(node)\n        self._add_to_head(node)\n    \n    def _remove_tail(self):\n        \"\"\"删除尾部节点，返回被删除的节点\"\"\"\n        node = self.tail.prev\n        self._remove_node(node)\n        return node",
          "url": "https://leetcode.cn/problems/lru-cache/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/146-LRU%E7%BC%93%E5%AD%98.md",
          "sourceHash": "d2052ae0e930ae941f0849869e3c1cfa949a67182b9599f9d4b87247f36cb4ba"
        }
      ]
    },
    {
      "id": "trees-05",
      "number": "05",
      "title": "二叉树",
      "content": "decks/05-cards.json",
      "concepts": [
        {
          "id": "05-return",
          "title": "后序汇总：返回给父节点什么",
          "explanation": "局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "example": "104 返回高度；543 用左右高度更新直径；124 返回单边贡献却更新双边路径。"
        },
        {
          "id": "05-compare",
          "title": "成对比较与结构判断",
          "explanation": "两节点同时递归时，先定义配对方向，再判断空节点和值。",
          "example": "100 左对左、右对右；101 左对右、右对左；572 在每个候选根重复 100。"
        },
        {
          "id": "05-order",
          "title": "遍历顺序与 BST 的有序性",
          "explanation": "中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "example": "94 收集中序，98 检验严格递增，230 取第 k 个；102 按层取，199 只取每层最后一个。"
        },
        {
          "id": "05-build",
          "title": "构造与修改：子问题的边界",
          "explanation": "明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "example": "105 用前序定位根、中序切分；297 必须保存空节点，才能还原形状。"
        },
        {
          "id": "05-path",
          "title": "从根向下：路径状态何时撤销",
          "explanation": "同一路径内有效的状态，返回到兄弟分支前必须恢复或作为参数独立传递。",
          "example": "1448 向下传路径最大值；437 前缀和进路径加一、离路径减一。"
        }
      ],
      "source": "02-Wiki/专题总结/05-二叉树.md",
      "connectionRule": "按递归契约连接：向下传什么、向上返回什么、在哪里更新全局答案。另把层序、BST 的顺序性和构造问题分开。",
      "groups": [
        {
          "id": "return",
          "title": "后序汇总：返回给父节点什么",
          "description": "局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "example": "104 返回高度；543 用左右高度更新直径；124 返回单边贡献却更新双边路径。"
        },
        {
          "id": "compare",
          "title": "成对比较与结构判断",
          "description": "两节点同时递归时，先定义配对方向，再判断空节点和值。",
          "example": "100 左对左、右对右；101 左对右、右对左；572 在每个候选根重复 100。"
        },
        {
          "id": "order",
          "title": "遍历顺序与 BST 的有序性",
          "description": "中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "example": "94 收集中序，98 检验严格递增，230 取第 k 个；102 按层取，199 只取每层最后一个。"
        },
        {
          "id": "build",
          "title": "构造与修改：子问题的边界",
          "description": "明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "example": "105 用前序定位根、中序切分；297 必须保存空节点，才能还原形状。"
        },
        {
          "id": "path",
          "title": "从根向下：路径状态何时撤销",
          "description": "同一路径内有效的状态，返回到兄弟分支前必须恢复或作为参数独立传递。",
          "example": "1448 向下传路径最大值；437 前缀和进路径加一、离路径减一。"
        }
      ],
      "firstProblems": [
        104,
        100,
        94
      ],
      "cards": [
        {
          "uid": "lc-104",
          "id": 104,
          "group": "return",
          "title": "二叉树的最大深度",
          "level": "Easy",
          "prompt": "给定一个二叉树 root，返回其最大深度。\n\n二叉树的最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。",
          "example": "输入：root = [3,9,20,null,null,15,7]\n输出：3",
          "hint": "先问自己：局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "recognition": "树高取较深孩子再加自己",
          "mnemonic": "先问孩子多高，再加一。",
          "why": "树高取较深孩子再加自己。maxDepth(node) 返回以 node 为根子树的节点层数，空子树为 0。",
          "invariant": "maxDepth(node) 返回以 node 为根子树的节点层数，空子树为 0。",
          "steps": [
            "空节点返回 0",
            "递归取得左右高度",
            "返回 1+max(左右高度)"
          ],
          "trace": "输入：root = [3,9,20,null,null,15,7]\n输出：3\n\n手推时记录：maxDepth(node) 返回以 node 为根子树的节点层数，空子树为 0。\n\n边界检查：一条有 3 个节点的链，深度和按边计的直径各是多少？\n深度按节点层数为 3，直径按边数为 2。返回值单位必须先说清，不能在两题之间直接混用。",
          "traceLabel": "例子与边界推演",
          "trap": "一条有 3 个节点的链，深度和按边计的直径各是多少？\n深度按节点层数为 3，直径按边数为 2。返回值单位必须先说清，不能在两题之间直接混用。",
          "complexity": "时间 O(n)，递归空间 O(h)，最坏 O(n)。",
          "prerequisites": [
            "05-return"
          ],
          "related": [
            {
              "id": 543,
              "kind": "递进",
              "why": "104 的返回高度直接作为答案；543 仍返回高度，却用左右高度之和更新另一份全局直径。"
            },
            {
              "id": 110,
              "kind": "递进",
              "why": "110 在返回高度时同时检查平衡，利用 −1 哨兵传播失败，无需重复计算每个子树高度。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "一条有 3 个节点的链，深度和按边计的直径各是多少？",
            "answer": "深度按节点层数为 3，直径按边数为 2。返回值单位必须先说清，不能在两题之间直接混用。"
          },
          "source": "02-Wiki/题目详解/104-二叉树的最大深度.md",
          "codeBlock": 0,
          "code": "def maxDepth(root):\n    if not root:\n        return 0\n    # 后序位置：先得到左右子树的结果\n    left_depth = maxDepth(root.left)\n    right_depth = maxDepth(root.right)\n    # 再汇总：当前节点的深度 = 子树的更大深度 + 1\n    return 1 + max(left_depth, right_depth)",
          "url": "https://leetcode.cn/problems/maximum-depth-of-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/104-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E5%A4%A7%E6%B7%B1%E5%BA%A6.md",
          "sourceHash": "df38c7e918fbfb2cbbd02b1f0d7b9b1c9052393e94dd9073f079da683884b2c6"
        },
        {
          "uid": "lc-100",
          "id": 100,
          "group": "compare",
          "title": "相同的树",
          "level": "Easy",
          "prompt": "判断两棵二叉树是否结构相同且对应节点值相等。",
          "example": "[1,2,3] 与 [1,2,3] 逐位置相同，返回 True。",
          "hint": "先问自己：两节点同时递归时，先定义配对方向，再判断空节点和值。",
          "recognition": "比较两棵树结构和值完全相同",
          "mnemonic": "同方向，一对一。",
          "why": "比较两棵树结构和值完全相同。same(p,q) 表示这两棵子树是否形状和对应数值都相等。",
          "invariant": "same(p,q) 表示这两棵子树是否形状和对应数值都相等。",
          "steps": [
            "都为空返回 True",
            "仅一空或值不同返回 False",
            "分别比较左右对应子树"
          ],
          "trace": "[1,2,3] 与 [1,2,3] 逐位置相同，返回 True。\n\n手推时记录：same(p,q) 表示这两棵子树是否形状和对应数值都相等。\n\n边界检查：前序序列一样能证明两棵树相同吗？\n不能，若不记录空节点，只有左孩子与只有右孩子的树可能有相同前序值；必须同时比较结构。",
          "traceLabel": "例子与边界推演",
          "trap": "前序序列一样能证明两棵树相同吗？\n不能，若不记录空节点，只有左孩子与只有右孩子的树可能有相同前序值；必须同时比较结构。",
          "complexity": "时间 O(min(n,m)) 的访问上界，最坏 O(n+m)；递归空间 O(h)。",
          "prerequisites": [
            "05-compare"
          ],
          "related": [
            {
              "id": 101,
              "kind": "易混淆",
              "why": "同树比较左对左、右对右；镜像比较左对右、右对左，终止条件相似但配对方向不同。"
            },
            {
              "id": 572,
              "kind": "组合",
              "why": "572 在大树的每个节点尝试 100 的整树比较；不能把“寻找起点”和“严格匹配”混成一步。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "前序序列一样能证明两棵树相同吗？",
            "answer": "不能，若不记录空节点，只有左孩子与只有右孩子的树可能有相同前序值；必须同时比较结构。"
          },
          "source": "02-Wiki/题目详解/100-相同的树.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:\n        if not p and not q:\n            return True\n        if not p or not q or p.val != q.val:\n            return False\n        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)",
          "url": "https://leetcode.cn/problems/same-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/100-%E7%9B%B8%E5%90%8C%E7%9A%84%E6%A0%91.md",
          "sourceHash": "fb83783b17fb02886f829f1df775813e439a6280556f0233f814a26978452838"
        },
        {
          "uid": "lc-94",
          "id": 94,
          "group": "order",
          "title": "二叉树的中序遍历",
          "level": "Easy",
          "prompt": "给定一个二叉树的根节点 root，返回它的 中序 遍历。\n\n中序遍历 的定义：按照 左子树 → 根节点 → 右子树 的顺序访问二叉树中的所有节点。",
          "example": "输入：root = [1,null,2,3]\n输出：[1,3,2]",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "输出中序遍历",
          "mnemonic": "左边全处理，再看自己，最后右边。",
          "why": "输出中序遍历。dfs(node) 把该子树的全部中序值依次追加到同一结果列表。",
          "invariant": "dfs(node) 把该子树的全部中序值依次追加到同一结果列表。",
          "steps": [
            "空节点直接返回",
            "遍历左子树后追加根值",
            "遍历右子树"
          ],
          "trace": "输入：root = [1,null,2,3]\n输出：[1,3,2]\n\n手推时记录：dfs(node) 把该子树的全部中序值依次追加到同一结果列表。\n\n边界检查：任意二叉树的中序遍历一定有序吗？\n不一定。左根右只是访问顺序；只有满足 BST 全局大小约束的树，中序值才严格递增。",
          "traceLabel": "例子与边界推演",
          "trap": "任意二叉树的中序遍历一定有序吗？\n不一定。左根右只是访问顺序；只有满足 BST 全局大小约束的树，中序值才严格递增。",
          "complexity": "时间 O(n)，递归空间 O(h)，另计 O(n) 输出。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 98,
              "kind": "迁移",
              "why": "94 只定义中序访问顺序；98 在访问时比较相邻值，以严格递增检验 BST 的全局约束。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "任意二叉树的中序遍历一定有序吗？",
            "answer": "不一定。左根右只是访问顺序；只有满足 BST 全局大小约束的树，中序值才严格递增。"
          },
          "source": "02-Wiki/题目详解/94-二叉树的中序遍历.md",
          "codeBlock": 0,
          "code": "def inorderTraversal(root):\n    res = []\n\n    def dfs(node):\n        if not node:\n            return\n        dfs(node.left)       # 左：递归遍历左子树\n        res.append(node.val) # 根：访问当前节点（中序位置）\n        dfs(node.right)      # 右：递归遍历右子树\n\n    dfs(root)\n    return res",
          "url": "https://leetcode.cn/problems/binary-tree-inorder-traversal/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/94-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86.md",
          "sourceHash": "e7f08601cdb1aea56bcc93b6ed90975632685c5b6e6f8ba86dbce56537914f43"
        },
        {
          "uid": "lc-543",
          "id": 543,
          "group": "return",
          "title": "二叉树的直径",
          "level": "Easy",
          "prompt": "给你一棵二叉树的根节点，返回该树的 直径。\n\n直径 是指树中任意两个节点之间最长路径上的 边数。这条路径可能经过也可能不经过根节点。",
          "example": "输入：root = [1,2,3,4,5]\n输出：3",
          "hint": "先问自己：局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "recognition": "最长路径可经过任意根",
          "mnemonic": "左右合计更新答案，单边高度交给父亲。",
          "why": "最长路径可经过任意根。depth 返回子树高度，全局 max_d 保存所有已处理节点的左右高度之和。",
          "invariant": "depth 返回子树高度，全局 max_d 保存所有已处理节点的左右高度之和。",
          "steps": [
            "后序取左右高度",
            "以两侧之和更新直径",
            "返回较大高度加一"
          ],
          "trace": "输入：root = [1,2,3,4,5]\n输出：3\n解释：最长路径是 4-2-1-3 或者 5-2-1-3，长度为 3（边数）。\n\n手推时记录：depth 返回子树高度，全局 max_d 保存所有已处理节点的左右高度之和。\n\n边界检查：为什么返回给父节点的值不能是左右高度之和？\n父节点若再连接已分成左右两支的路径，就产生分叉而不是一条简单路径。向上只能贡献一侧，双侧只用于本地候选答案。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么返回给父节点的值不能是左右高度之和？\n父节点若再连接已分成左右两支的路径，就产生分叉而不是一条简单路径。向上只能贡献一侧，双侧只用于本地候选答案。",
          "complexity": "时间 O(n)，栈空间 O(h)。",
          "prerequisites": [
            "05-return"
          ],
          "related": [
            {
              "id": 104,
              "kind": "递进",
              "why": "104 的返回高度直接作为答案；543 仍返回高度，却用左右高度之和更新另一份全局直径。"
            },
            {
              "id": 124,
              "kind": "迁移",
              "why": "两题都向上返回单边、在当前节点合并双边；124 把长度换成权值，并额外丢弃负贡献。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么返回给父节点的值不能是左右高度之和？",
            "answer": "父节点若再连接已分成左右两支的路径，就产生分叉而不是一条简单路径。向上只能贡献一侧，双侧只用于本地候选答案。"
          },
          "source": "02-Wiki/题目详解/543-二叉树的直径.md",
          "codeBlock": 0,
          "code": "def diameterOfBinaryTree(root):\n    max_d = 0  # 全局变量，记录当前找到的最大直径\n\n    def depth(node):\n        nonlocal max_d\n        if not node:\n            return 0\n\n        # 后序：先计算左右子树的深度\n        left_depth = depth(node.left)\n        right_depth = depth(node.right)\n\n        # 经过当前节点的直径 = 左深度 + 右深度\n        max_d = max(max_d, left_depth + right_depth)\n\n        # 返回当前节点的深度（供父节点使用）\n        return 1 + max(left_depth, right_depth)\n\n    depth(root)\n    return max_d",
          "url": "https://leetcode.cn/problems/diameter-of-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/543-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%9B%B4%E5%BE%84.md",
          "sourceHash": "1c2c60caa78e94847b2a94a32b48a2acc6e00345137b005ceeb96bd431f30baf"
        },
        {
          "uid": "lc-124",
          "id": 124,
          "group": "return",
          "title": "二叉树中的最大路径和",
          "level": "Hard",
          "prompt": "路径 被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中 至多出现一次。该路径 至少包含一个 节点，且不一定经过根节点。\n\n路径和 是路径中各节点值的总和。\n\n给你一个二叉树的根节点 root，返回其 最大路径和。",
          "example": "输入：root = [1,2,3]\n输出：6",
          "hint": "先问自己：局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "recognition": "最大路径和允许任意起终点",
          "mnemonic": "负贡献舍弃，向上只走一边。",
          "why": "最大路径和允许任意起终点。dfs 返回从当前节点向下的一条最大单边贡献，全局答案允许在当前节点连接左右两边。",
          "invariant": "dfs 返回从当前节点向下的一条最大单边贡献，全局答案允许在当前节点连接左右两边。",
          "steps": [
            "后序取得左右贡献并与 0 取最大",
            "用 node+left+right 更新全局",
            "返回 node+max(left,right)"
          ],
          "trace": "输入：root = [1,2,3]\n输出：6\n解释：最优路径是 2 → 1 → 3，路径和为 2 + 1 + 3 = 6\n\n手推时记录：dfs 返回从当前节点向下的一条最大单边贡献，全局答案允许在当前节点连接左右两边。\n\n边界检查：全树都是负数，为什么答案不能初始化为 0？\n路径必须非空，0 相当于不选节点。初始化负无穷才能让最不负的单个节点成为答案；剪掉的是负子分支，不是当前节点。",
          "traceLabel": "例子与边界推演",
          "trap": "全树都是负数，为什么答案不能初始化为 0？\n路径必须非空，0 相当于不选节点。初始化负无穷才能让最不负的单个节点成为答案；剪掉的是负子分支，不是当前节点。",
          "complexity": "时间 O(n)，栈空间 O(h)。",
          "prerequisites": [
            "05-return"
          ],
          "related": [
            {
              "id": 543,
              "kind": "迁移",
              "why": "两题都向上返回单边、在当前节点合并双边；124 把长度换成权值，并额外丢弃负贡献。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "全树都是负数，为什么答案不能初始化为 0？",
            "answer": "路径必须非空，0 相当于不选节点。初始化负无穷才能让最不负的单个节点成为答案；剪掉的是负子分支，不是当前节点。"
          },
          "source": "02-Wiki/题目详解/124-二叉树中的最大路径和.md",
          "codeBlock": 0,
          "code": "def maxPathSum(root):\n    max_sum = float('-inf')  # 全局最大路径和\n\n    def dfs(node):\n        nonlocal max_sum\n        if not node:\n            return 0\n\n        # 后序：先计算左右子树的最大贡献\n        # max(贡献, 0)：如果子树贡献为负，就舍弃（不走这条路）\n        left_gain = max(dfs(node.left), 0)\n        right_gain = max(dfs(node.right), 0)\n\n        # 经过当前节点的最大路径和（可以拐弯）\n        current_path_sum = left_gain + node.val + right_gain\n        # 更新全局最大值\n        max_sum = max(max_sum, current_path_sum)\n\n        # 返回当前节点的单边最大贡献（不能拐弯，供父节点使用）\n        return node.val + max(left_gain, right_gain)\n\n    dfs(root)\n    return max_sum",
          "url": "https://leetcode.cn/problems/binary-tree-maximum-path-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/124-%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%AD%E7%9A%84%E6%9C%80%E5%A4%A7%E8%B7%AF%E5%BE%84%E5%92%8C.md",
          "sourceHash": "a7283f515b763ea84956c9f5062b0245d64012221b848f95bd1c2330060d59c7"
        },
        {
          "uid": "lc-110",
          "id": 110,
          "group": "return",
          "title": "平衡二叉树",
          "level": "Easy",
          "prompt": "判断二叉树任意节点的左右子树高度差是否都不超过 1。",
          "example": "[3,9,20,null,null,15,7] 的每个节点高度差都不超过 1，返回 True。",
          "hint": "先问自己：局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "recognition": "每个节点左右高度差至多 1",
          "mnemonic": "高度顺手查，失衡传 −1。",
          "why": "每个节点左右高度差至多 1。height 返回真实高度；任何后代失衡就返回哨兵 −1，向上一直传播。",
          "invariant": "height 返回真实高度；任何后代失衡就返回哨兵 −1，向上一直传播。",
          "steps": [
            "空树高度 0",
            "后序检查孩子是否失衡或高度差超限",
            "否则返回较高高度加一"
          ],
          "trace": "[3,9,20,null,null,15,7] 的每个节点高度差都不超过 1，返回 True。\n\n手推时记录：height 返回真实高度；任何后代失衡就返回哨兵 −1，向上一直传播。\n\n边界检查：为什么只比较根的左右高度不足以判断平衡？\n某个深层子树可能已失衡，而根两边总高度仍相近。每个节点都要检查，−1 把深层失败传回根。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么只比较根的左右高度不足以判断平衡？\n某个深层子树可能已失衡，而根两边总高度仍相近。每个节点都要检查，−1 把深层失败传回根。",
          "complexity": "时间 O(n)，栈空间 O(h)。",
          "prerequisites": [
            "05-return"
          ],
          "related": [
            {
              "id": 104,
              "kind": "递进",
              "why": "110 在返回高度时同时检查平衡，利用 −1 哨兵传播失败，无需重复计算每个子树高度。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么只比较根的左右高度不足以判断平衡？",
            "answer": "某个深层子树可能已失衡，而根两边总高度仍相近。每个节点都要检查，−1 把深层失败传回根。"
          },
          "source": "02-Wiki/题目详解/110-平衡二叉树.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def isBalanced(self, root: TreeNode | None) -> bool:\n        def height(node: TreeNode | None) -> int:\n            if not node:\n                return 0\n            left = height(node.left)\n            right = height(node.right)\n            if left == -1 or right == -1 or abs(left - right) > 1:\n                return -1\n            return max(left, right) + 1\n\n        return height(root) != -1",
          "url": "https://leetcode.cn/problems/balanced-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/110-%E5%B9%B3%E8%A1%A1%E4%BA%8C%E5%8F%89%E6%A0%91.md",
          "sourceHash": "18ccd89b2f5d93d1327b50a6ddc9826c4a0de79ae621c32e8ce9885c95dfc77a"
        },
        {
          "uid": "lc-236",
          "id": 236,
          "group": "return",
          "title": "二叉树的最近公共祖先",
          "level": "Medium",
          "prompt": "给定一个二叉树，找到该树中两个指定节点的最近公共祖先（LCA）。\n\n最近公共祖先 的定义为： 对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。",
          "example": "输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\n输出：3",
          "hint": "先问自己：局部返回值与全局答案可能不同；不要把可以左右拐弯的路径直接交给父节点。",
          "recognition": "普通二叉树找最近公共祖先",
          "mnemonic": "左右各找到一个，就在这里汇合。",
          "why": "普通二叉树找最近公共祖先。递归返回空、找到的目标节点，或已经确定的最近公共祖先；题目保证两目标存在。",
          "invariant": "递归返回空、找到的目标节点，或已经确定的最近公共祖先；题目保证两目标存在。",
          "steps": [
            "空节点或目标节点直接返回",
            "递归查左右",
            "左右都有返回当前根，否则返回非空一侧"
          ],
          "trace": "输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\n输出：3\n解释：节点 5 和节点 1 的最近公共祖先是节点 3。\n\n手推时记录：递归返回空、找到的目标节点，或已经确定的最近公共祖先；题目保证两目标存在。\n\n边界检查：若 p 本身是 q 的祖先，为何遇到 p 可以直接返回？\np 已经是包含自身和后代 q 的共同祖先；在两节点都存在的前提下，不必继续向下验证即可把 p 向上传递。",
          "traceLabel": "例子与边界推演",
          "trap": "若 p 本身是 q 的祖先，为何遇到 p 可以直接返回？\np 已经是包含自身和后代 q 的共同祖先；在两节点都存在的前提下，不必继续向下验证即可把 p 向上传递。",
          "complexity": "时间 O(n)，递归空间 O(h)。",
          "prerequisites": [
            "05-return"
          ],
          "related": [
            {
              "id": 235,
              "kind": "条件变化",
              "why": "236 普通树需要递归查两边；235 有 BST 顺序，可以依据两个目标值选择唯一方向。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "若 p 本身是 q 的祖先，为何遇到 p 可以直接返回？",
            "answer": "p 已经是包含自身和后代 q 的共同祖先；在两节点都存在的前提下，不必继续向下验证即可把 p 向上传递。"
          },
          "source": "02-Wiki/题目详解/236-二叉树的最近公共祖先.md",
          "codeBlock": 0,
          "code": "def lowestCommonAncestor(root, p, q):\n    # 如果当前节点为空，或当前节点就是 p 或 q，直接返回\n    if not root or root == p or root == q:\n        return root\n\n    # 后序：先在左右子树中查找\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n\n    # 后序位置：判断当前节点是不是 LCA\n    if left and right:\n        # p 和 q 分别在左右子树中 → 当前节点就是 LCA\n        return root\n    # 只在一边找到 → 返回找到的那边\n    return left or right",
          "url": "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/236-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88.md",
          "sourceHash": "ffcf352b058d74b179e23c4fba71846e7de478037a70b08b226ac07f5449261b"
        },
        {
          "uid": "lc-101",
          "id": 101,
          "group": "compare",
          "title": "对称二叉树",
          "level": "Easy",
          "prompt": "给你一个二叉树的根节点 root，检查它是否轴对称。",
          "example": "输入：root = [1,2,2,3,4,4,3]\n输出：true",
          "hint": "先问自己：两节点同时递归时，先定义配对方向，再判断空节点和值。",
          "recognition": "判断一棵树左右镜像",
          "mnemonic": "外侧配外侧，内侧配内侧。",
          "why": "判断一棵树左右镜像。check(p,q) 判断 p 与 q 是否互为镜像，而不是是否同形同向。",
          "invariant": "check(p,q) 判断 p 与 q 是否互为镜像，而不是是否同形同向。",
          "steps": [
            "比较空节点与当前值",
            "递归比较 p.left 与 q.right",
            "再比较 p.right 与 q.left"
          ],
          "trace": "输入：root = [1,2,2,3,4,4,3]\n输出：true\n\n手推时记录：check(p,q) 判断 p 与 q 是否互为镜像，而不是是否同形同向。\n\n边界检查：101 与 100 的递归配对差在哪一行？\n100 比较左对左、右对右；101 必须交叉比较左对右、右对左，相同的节点值不能代替镜像结构检查。",
          "traceLabel": "例子与边界推演",
          "trap": "101 与 100 的递归配对差在哪一行？\n100 比较左对左、右对右；101 必须交叉比较左对右、右对左，相同的节点值不能代替镜像结构检查。",
          "complexity": "时间 O(n)，递归空间 O(h)。",
          "prerequisites": [
            "05-compare"
          ],
          "related": [
            {
              "id": 100,
              "kind": "易混淆",
              "why": "同树比较左对左、右对右；镜像比较左对右、右对左，终止条件相似但配对方向不同。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "101 与 100 的递归配对差在哪一行？",
            "answer": "100 比较左对左、右对右；101 必须交叉比较左对右、右对左，相同的节点值不能代替镜像结构检查。"
          },
          "source": "02-Wiki/题目详解/101-对称二叉树.md",
          "codeBlock": 0,
          "code": "def isSymmetric(root):\n    def check(p, q):\n        # 两个都为空：对称\n        if not p and not q:\n            return True\n        # 一个为空一个不为空：不对称\n        if not p or not q:\n            return False\n        # 值不相等：不对称\n        if p.val != q.val:\n            return False\n        # 递归检查：p 的左 vs q 的右，p 的右 vs q 的左\n        return check(p.left, q.right) and check(p.right, q.left)\n\n    return check(root.left, root.right)",
          "url": "https://leetcode.cn/problems/symmetric-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/101-%E5%AF%B9%E7%A7%B0%E4%BA%8C%E5%8F%89%E6%A0%91.md",
          "sourceHash": "74e85048acbc644f128dd443e085bb7d522751506ea27da70d3ca6d08a35e33e"
        },
        {
          "uid": "lc-572",
          "id": 572,
          "group": "compare",
          "title": "另一棵树的子树",
          "level": "Easy",
          "prompt": "判断 subRoot 是否与 root 中某个节点为根的完整子树相同。",
          "example": "root = [3,4,5,1,2]，subRoot = [4,1,2]，返回 True。",
          "hint": "先问自己：两节点同时递归时，先定义配对方向，再判断空节点和值。",
          "recognition": "一棵树是否完整出现在另一棵树内",
          "mnemonic": "遍历找候选根，再做整树相等。",
          "why": "一棵树是否完整出现在另一棵树内。same 只负责两子树完全相等，外层 isSubtree 负责遍历所有可能的起点。",
          "invariant": "same 只负责两子树完全相等，外层 isSubtree 负责遍历所有可能的起点。",
          "steps": [
            "当前根先尝试同树比较",
            "失败则去左子树找",
            "再去右子树找"
          ],
          "trace": "root = [3,4,5,1,2]，subRoot = [4,1,2]，返回 True。\n\n手推时记录：same 只负责两子树完全相等，外层 isSubtree 负责遍历所有可能的起点。\n\n边界检查：只要 subRoot 的值都在大树中就足够吗？\n不够。必须存在一个节点，其整棵子树形状、数值都一致，额外多出来的孩子也会导致匹配失败。",
          "traceLabel": "例子与边界推演",
          "trap": "只要 subRoot 的值都在大树中就足够吗？\n不够。必须存在一个节点，其整棵子树形状、数值都一致，额外多出来的孩子也会导致匹配失败。",
          "complexity": "朴素实现时间 O(nm)，递归空间 O(h+h_sub)。",
          "prerequisites": [
            "05-compare"
          ],
          "related": [
            {
              "id": 100,
              "kind": "组合",
              "why": "572 在大树的每个节点尝试 100 的整树比较；不能把“寻找起点”和“严格匹配”混成一步。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "只要 subRoot 的值都在大树中就足够吗？",
            "answer": "不够。必须存在一个节点，其整棵子树形状、数值都一致，额外多出来的孩子也会导致匹配失败。"
          },
          "source": "02-Wiki/题目详解/572-另一棵树的子树.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def isSubtree(self, root: TreeNode | None, subRoot: TreeNode | None) -> bool:\n        def same(a: TreeNode | None, b: TreeNode | None) -> bool:\n            if not a and not b:\n                return True\n            if not a or not b or a.val != b.val:\n                return False\n            return same(a.left, b.left) and same(a.right, b.right)\n\n        if not root:\n            return False\n        return same(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)",
          "url": "https://leetcode.cn/problems/subtree-of-another-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/572-%E5%8F%A6%E4%B8%80%E6%A3%B5%E6%A0%91%E7%9A%84%E5%AD%90%E6%A0%91.md",
          "sourceHash": "c9e05ce88c79c42bc0f05b427935388b5f3dd64416be16bfdd70d3f6923768b4"
        },
        {
          "uid": "lc-98",
          "id": 98,
          "group": "order",
          "title": "验证二叉搜索树",
          "level": "Medium",
          "prompt": "给你一个二叉树的根节点 root，判断其是否是一个有效的二叉搜索树（BST）。\n\n有效 BST 定义如下：\n节点的左子树只包含 小于 当前节点的数。\n节点的右子树只包含 大于 当前节点的数。\n所有左子树和右子树自身必须也是二叉搜索树。",
          "example": "输入：root = [2,1,3]\n输出：true",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "验证 BST 的全局大小关系",
          "mnemonic": "中序一路必须严格变大。",
          "why": "验证 BST 的全局大小关系。prev 始终是整个中序序列中上一个已访问节点值，而非仅父节点。",
          "invariant": "prev 始终是整个中序序列中上一个已访问节点值，而非仅父节点。",
          "steps": [
            "中序先验证左子树",
            "当前值不大于 prev 就失败",
            "更新 prev 后验证右子树"
          ],
          "trace": "输入：root = [2,1,3]\n输出：true\n\n手推时记录：prev 始终是整个中序序列中上一个已访问节点值，而非仅父节点。\n\n边界检查：为什么只检查每个节点的直接左右孩子不够？\n某个左子树深层节点可能大于祖先根，却仍满足与自己父节点的局部关系。全局中序严格递增能发现这种跨层违规。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么只检查每个节点的直接左右孩子不够？\n某个左子树深层节点可能大于祖先根，却仍满足与自己父节点的局部关系。全局中序严格递增能发现这种跨层违规。",
          "complexity": "时间 O(n)，递归空间 O(h)。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 94,
              "kind": "迁移",
              "why": "94 只定义中序访问顺序；98 在访问时比较相邻值，以严格递增检验 BST 的全局约束。"
            },
            {
              "id": 230,
              "kind": "前置",
              "why": "只有 BST 才能把中序的第 k 个节点解释为第 k 小；普通树不能这样取排名。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么只检查每个节点的直接左右孩子不够？",
            "answer": "某个左子树深层节点可能大于祖先根，却仍满足与自己父节点的局部关系。全局中序严格递增能发现这种跨层违规。"
          },
          "source": "02-Wiki/题目详解/98-验证二叉搜索树.md",
          "codeBlock": 0,
          "code": "def isValidBST(root):\n    prev = float('-inf')  # 上一个节点的值（初始为负无穷）\n\n    def inorder(node):\n        nonlocal prev\n        if not node:\n            return True\n\n        # 左：递归检查左子树\n        if not inorder(node.left):\n            return False\n\n        # 根：检查当前节点值是否大于前一个值\n        if node.val <= prev:   # 注意是 <=，严格递增\n            return False\n        prev = node.val\n\n        # 右：递归检查右子树\n        return inorder(node.right)\n\n    return inorder(root)",
          "url": "https://leetcode.cn/problems/validate-binary-search-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/98-%E9%AA%8C%E8%AF%81%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.md",
          "sourceHash": "976f601a5761988cbc1730dbb498779e8a0ab9331408f0be3601d7538c412c29"
        },
        {
          "uid": "lc-230",
          "id": 230,
          "group": "order",
          "title": "二叉搜索树中第 K 小的元素",
          "level": "Medium",
          "prompt": "给定一个二叉搜索树的根节点 root，和一个整数 k，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。",
          "example": "输入：root = [3,1,4,null,2], k = 1\n输出：1",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "BST 第 k 小",
          "mnemonic": "按中序走，数到 k 就取值。",
          "why": "BST 第 k 小。count 统计全树中序已经访问的节点数，第 k 个对应第 k 小值。",
          "invariant": "count 统计全树中序已经访问的节点数，第 k 个对应第 k 小值。",
          "steps": [
            "中序递归左子树",
            "访问根时计数并保存第 k 个值",
            "继续右子树"
          ],
          "trace": "输入：root = [3,1,4,null,2], k = 1\n输出：1\n\n手推时记录：count 统计全树中序已经访问的节点数，第 k 个对应第 k 小值。\n\n边界检查：当前代码里找到答案后的 return 能终止整棵树遍历吗？\n不能，它只结束当前递归调用，祖先仍可能继续访问其他节点。答案不受影响，但最坏时间仍为 O(n)，不要误写为 O(k)。",
          "traceLabel": "例子与边界推演",
          "trap": "当前代码里找到答案后的 return 能终止整棵树遍历吗？\n不能，它只结束当前递归调用，祖先仍可能继续访问其他节点。答案不受影响，但最坏时间仍为 O(n)，不要误写为 O(k)。",
          "complexity": "展示实现最坏时间 O(n)，栈空间 O(h)。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 98,
              "kind": "前置",
              "why": "只有 BST 才能把中序的第 k 个节点解释为第 k 小；普通树不能这样取排名。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "当前代码里找到答案后的 return 能终止整棵树遍历吗？",
            "answer": "不能，它只结束当前递归调用，祖先仍可能继续访问其他节点。答案不受影响，但最坏时间仍为 O(n)，不要误写为 O(k)。"
          },
          "source": "02-Wiki/题目详解/230-BST第K小的元素.md",
          "codeBlock": 0,
          "code": "def kthSmallest(root, k):\n    count = 0\n    result = 0\n\n    def inorder(node):\n        nonlocal count, result\n        if not node:\n            return\n\n        inorder(node.left)          # 左：先遍历左子树（更小的元素）\n\n        count += 1                   # 根：访问当前节点，计数器 +1\n        if count == k:\n            result = node.val\n            return                   # 找到后提前返回\n\n        inorder(node.right)         # 右：遍历右子树\n\n    inorder(root)\n    return result",
          "url": "https://leetcode.cn/problems/kth-smallest-element-in-a-bst/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/230-BST%E7%AC%ACK%E5%B0%8F%E7%9A%84%E5%85%83%E7%B4%A0.md",
          "sourceHash": "95eb055fa28b4ff06eb1b735759d81da220d0aacdb7cbc6337250cdcf980ed10"
        },
        {
          "uid": "lc-235",
          "id": 235,
          "group": "order",
          "title": "二叉搜索树的最近公共祖先",
          "level": "Medium",
          "prompt": "给定二叉搜索树及其中两个不同节点 p、q，返回它们的最近公共祖先。节点可以是自己的祖先，树中值互不相同。",
          "example": "输入：root=[6,2,8,0,4,7,9], p=2, q=8\n输出：值为 6 的原节点",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "BST 最近公共祖先可借大小排除整边",
          "mnemonic": "同侧往下，分叉就是祖先。",
          "why": "BST 最近公共祖先可借大小排除整边。只要两个目标同在当前根的一侧，最近公共祖先就仍在那一侧。",
          "invariant": "只要两个目标同在当前根的一侧，最近公共祖先就仍在那一侧。",
          "steps": [
            "取两目标值的大小边界",
            "当前根太小往右、太大往左",
            "落在两值之间就返回"
          ],
          "trace": "在 [6,2,8,0,4,7,9] 中，2 和 8 分居 6 两侧，答案是 6。\n\n手推时记录：只要两个目标同在当前根的一侧，最近公共祖先就仍在那一侧。\n\n边界检查：如果 p 或 q 恰好等于当前根，为什么可以立即返回？\n当前根自身属于一条目标路径，也是另一目标的祖先；等号落在闭区间内，正好覆盖祖先等于目标的情况。",
          "traceLabel": "例子与边界推演",
          "trap": "如果 p 或 q 恰好等于当前根，为什么可以立即返回？\n当前根自身属于一条目标路径，也是另一目标的祖先；等号落在闭区间内，正好覆盖祖先等于目标的情况。",
          "complexity": "时间 O(h)，迭代额外空间 O(1)。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 236,
              "kind": "条件变化",
              "why": "236 普通树需要递归查两边；235 有 BST 顺序，可以依据两个目标值选择唯一方向。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "如果 p 或 q 恰好等于当前根，为什么可以立即返回？",
            "answer": "当前根自身属于一条目标路径，也是另一目标的祖先；等号落在闭区间内，正好覆盖祖先等于目标的情况。"
          },
          "source": "02-Wiki/题目详解/235-二叉搜索树的最近公共祖先.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:\n        low, high = sorted((p.val, q.val))\n        while root:\n            if root.val < low:\n                root = root.right\n            elif root.val > high:\n                root = root.left\n            else:\n                return root",
          "url": "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/235-%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E7%9A%84%E6%9C%80%E8%BF%91%E5%85%AC%E5%85%B1%E7%A5%96%E5%85%88.md",
          "sourceHash": "474f9d749aa75461c59b0fad51dcbbed7a9c94e11e81756168bf7e1fb4e96b56"
        },
        {
          "uid": "lc-102",
          "id": 102,
          "group": "order",
          "title": "二叉树的层序遍历",
          "level": "Medium",
          "prompt": "给你二叉树的根节点 root，返回其节点值的 层序遍历。（即逐层地，从左到右访问所有节点）。",
          "example": "输入：root = [3,9,20,null,null,15,7]\n输出：[[3],[9,20],[15,7]]",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "要按层分组",
          "mnemonic": "先记本层数量，再让孩子排到下一层。",
          "why": "要按层分组。每轮开始队列恰好保存当前层；固定 level_size 次弹出后才轮到新增下一层。",
          "invariant": "每轮开始队列恰好保存当前层；固定 level_size 次弹出后才轮到新增下一层。",
          "steps": [
            "根入队",
            "固定本层大小并逐个弹出",
            "收集当前值，孩子入队，最后保存本层"
          ],
          "trace": "输入：root = [3,9,20,null,null,15,7]\n输出：[[3],[9,20],[15,7]]\n\n手推时记录：每轮开始队列恰好保存当前层；固定 level_size 次弹出后才轮到新增下一层。\n\n边界检查：为什么不能在 for 循环里不断重新读取 len(q) 当本层大小？\n弹出父节点时会加入孩子，动态长度会把下一层混进当前层；必须在处理本层前固定数量。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能在 for 循环里不断重新读取 len(q) 当本层大小？\n弹出父节点时会加入孩子，动态长度会把下一层混进当前层；必须在处理本层前固定数量。",
          "complexity": "时间 O(n)，队列空间 O(w)，另计 O(n) 输出。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 199,
              "kind": "输出变化",
              "why": "同一套分层队列：102 收集整层，199 只收集按左到右顺序的最后一个。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能在 for 循环里不断重新读取 len(q) 当本层大小？",
            "answer": "弹出父节点时会加入孩子，动态长度会把下一层混进当前层；必须在处理本层前固定数量。"
          },
          "source": "02-Wiki/题目详解/102-二叉树的层序遍历.md",
          "codeBlock": 0,
          "code": "from collections import deque\n\ndef levelOrder(root):\n    if not root:\n        return []\n\n    res = []\n    q = deque([root])\n\n    while q:\n        level = []                    # 当前层的节点值列表\n        level_size = len(q)           # 当前层的节点数（关键！）\n        for _ in range(level_size):\n            node = q.popleft()\n            level.append(node.val)     # 访问当前节点\n            if node.left:\n                q.append(node.left)    # 左孩子入队\n            if node.right:\n                q.append(node.right)   # 右孩子入队\n        res.append(level)              # 将当前层加入结果\n\n    return res",
          "url": "https://leetcode.cn/problems/binary-tree-level-order-traversal/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/102-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%B1%82%E5%BA%8F%E9%81%8D%E5%8E%86.md",
          "sourceHash": "5d2ca2a8c884e35127c4916bde9b5681a0c83a6d3a5b2f139d3138ba04fe18cb"
        },
        {
          "uid": "lc-199",
          "id": 199,
          "group": "order",
          "title": "二叉树的右视图",
          "level": "Medium",
          "prompt": "给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。",
          "example": "输入：root = [1,2,3,null,5,null,4]\n输出：[1,3,4]",
          "hint": "先问自己：中序本身只是顺序；只有 BST 才保证中序值递增。层序通过固定每层大小分组。",
          "recognition": "从右侧看到每层最右节点",
          "mnemonic": "层序每层只取最后一个。",
          "why": "从右侧看到每层最右节点。队列按从左到右保存当前层，固定层长度中的最后一次弹出就是右侧可见节点。",
          "invariant": "队列按从左到右保存当前层，固定层长度中的最后一次弹出就是右侧可见节点。",
          "steps": [
            "按层 BFS",
            "先左后右加入孩子",
            "仅记录每层最后弹出的值"
          ],
          "trace": "输入：root = [1,2,3,null,5,null,4]\n输出：[1,3,4]\n\n手推时记录：队列按从左到右保存当前层，固定层长度中的最后一次弹出就是右侧可见节点。\n\n边界检查：某层最右的可见节点一定在根的右子树吗？\n不一定，右子树较浅时，更深处可能只剩左子树节点；按层取最后一个比一直沿右孩子走更完整。",
          "traceLabel": "例子与边界推演",
          "trap": "某层最右的可见节点一定在根的右子树吗？\n不一定，右子树较浅时，更深处可能只剩左子树节点；按层取最后一个比一直沿右孩子走更完整。",
          "complexity": "时间 O(n)，队列 O(w)，输出 O(h)。",
          "prerequisites": [
            "05-order"
          ],
          "related": [
            {
              "id": 102,
              "kind": "输出变化",
              "why": "同一套分层队列：102 收集整层，199 只收集按左到右顺序的最后一个。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "某层最右的可见节点一定在根的右子树吗？",
            "answer": "不一定，右子树较浅时，更深处可能只剩左子树节点；按层取最后一个比一直沿右孩子走更完整。"
          },
          "source": "02-Wiki/题目详解/199-二叉树的右视图.md",
          "codeBlock": 0,
          "code": "from collections import deque\n\ndef rightSideView(root):\n    if not root:\n        return []\n\n    res = []\n    q = deque([root])\n\n    while q:\n        level_size = len(q)\n        for i in range(level_size):\n            node = q.popleft()\n            # 如果是当前层的最后一个节点，加入结果\n            if i == level_size - 1:\n                res.append(node.val)\n            if node.left:\n                q.append(node.left)\n            if node.right:\n                q.append(node.right)\n\n    return res",
          "url": "https://leetcode.cn/problems/binary-tree-right-side-view/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/199-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%8F%B3%E8%A7%86%E5%9B%BE.md",
          "sourceHash": "cd76519d4c96238f55f2d38c598185e07f1accb6c1fcdeb5d980ab68733c52ca"
        },
        {
          "uid": "lc-105",
          "id": 105,
          "group": "build",
          "title": "从前序与中序遍历序列构造二叉树",
          "level": "Medium",
          "prompt": "preorder 与 inorder 分别是同一二叉树的前序和中序遍历，所有节点值互不相同。重建该树并返回根节点。",
          "example": "输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\n输出：[3,9,20,null,null,15,7]",
          "hint": "先问自己：明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "recognition": "前序告诉根，中序告诉左右范围",
          "mnemonic": "根定位置，左长分前序。",
          "why": "前序告诉根，中序告诉左右范围。build 的两组闭区间描述同一棵子树，左子树节点数由根在中序区间的位置确定。",
          "invariant": "build 的两组闭区间描述同一棵子树，左子树节点数由根在中序区间的位置确定。",
          "steps": [
            "建中序值到下标的表",
            "取前序首值建根并算左子树大小",
            "按对应区间递归连接左右"
          ],
          "trace": "输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\n输出：[3,9,20,null,null,15,7]\n\n手推时记录：build 的两组闭区间描述同一棵子树，左子树节点数由根在中序区间的位置确定。\n\n边界检查：为什么题目要求节点值互不相同？\n哈希表必须把根值定位到中序中的唯一位置；重复值会使位置与左右划分产生歧义，不能直接套此实现。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么题目要求节点值互不相同？\n哈希表必须把根值定位到中序中的唯一位置；重复值会使位置与左右划分产生歧义，不能直接套此实现。",
          "complexity": "时间 O(n)，哈希 O(n)，递归 O(h)。",
          "prerequisites": [
            "05-build"
          ],
          "related": [
            {
              "id": 108,
              "kind": "易混淆",
              "why": "105 从给定遍历恢复唯一形状，根由前序决定；108 自己选择中点作根，目标是平衡。"
            },
            {
              "id": 297,
              "kind": "信息变化",
              "why": "105 用前序加中序共同确定形状；297 用一份含空标记的前序编码保存足够结构信息。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么题目要求节点值互不相同？",
            "answer": "哈希表必须把根值定位到中序中的唯一位置；重复值会使位置与左右划分产生歧义，不能直接套此实现。"
          },
          "source": "02-Wiki/题目详解/105-从前序与中序遍历构造二叉树.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def buildTree(preorder, inorder):\n    # 哈希表：值 → 在中序数组中的索引\n    index_map = {val: i for i, val in enumerate(inorder)}\n\n    def build(pre_l, pre_r, in_l, in_r):\n        \"\"\"构建子树\n        Args:\n            pre_l, pre_r: 前序数组的左右边界（闭区间）\n            in_l, in_r: 中序数组的左右边界（闭区间）\n        \"\"\"\n        if pre_l > pre_r:\n            return None\n\n        # 前序的第一个元素是根节点\n        root_val = preorder[pre_l]\n        root = TreeNode(root_val)\n\n        # 在中序中找到根节点的位置\n        in_idx = index_map[root_val]\n        # 左子树的节点数\n        left_size = in_idx - in_l\n\n        # 递归构建左右子树\n        # 前序中：根后 left_size 个是左子树前序，剩下的是右子树前序\n        root.left = build(pre_l + 1, pre_l + left_size, in_l, in_idx - 1)\n        root.right = build(pre_l + left_size + 1, pre_r, in_idx + 1, in_r)\n\n        return root\n\n    return build(0, len(preorder) - 1, 0, len(inorder) - 1)",
          "url": "https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/105-%E4%BB%8E%E5%89%8D%E5%BA%8F%E4%B8%8E%E4%B8%AD%E5%BA%8F%E9%81%8D%E5%8E%86%E6%9E%84%E9%80%A0%E4%BA%8C%E5%8F%89%E6%A0%91.md",
          "sourceHash": "8d3955bfa8c32ab1cce9d558675d907908f4c29791243ea5e771a3968e4237c2"
        },
        {
          "uid": "lc-108",
          "id": 108,
          "group": "build",
          "title": "将有序数组转换为二叉搜索树",
          "level": "Easy",
          "prompt": "给你一个整数数组 nums，其中元素已经按 升序 排列，请你将其转换为一棵 高度平衡 的二叉搜索树。\n\n高度平衡 二叉树是指：一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1。",
          "example": "输入：nums = [-10,-3,0,5,9]\n输出：[0,-3,9,-10,null,5]",
          "hint": "先问自己：明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "recognition": "有序数组构造平衡 BST",
          "mnemonic": "取中点当根，两边各自建。",
          "why": "有序数组构造平衡 BST。build(left,right) 返回使用该区间全部数字的平衡 BST。",
          "invariant": "build(left,right) 返回使用该区间全部数字的平衡 BST。",
          "steps": [
            "区间空返回 None",
            "以中点构造根",
            "递归较小一半为左、较大一半为右"
          ],
          "trace": "输入：nums = [-10,-3,0,5,9]\n输出：[0,-3,9,-10,null,5]\n解释：[0,-10,5,null,-3,null,9] 也是正确答案。\n\n手推时记录：build(left,right) 返回使用该区间全部数字的平衡 BST。\n\n边界检查：为什么每次选最左元素作根虽然有序，却不满足目标？\n它会把剩余元素全放到右子树，得到长度 n 的退化链；选中点让两边节点数尽量接近，才能保持高度平衡。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么每次选最左元素作根虽然有序，却不满足目标？\n它会把剩余元素全放到右子树，得到长度 n 的退化链；选中点让两边节点数尽量接近，才能保持高度平衡。",
          "complexity": "时间 O(n)，递归 O(log n)，另计 O(n) 输出节点。",
          "prerequisites": [
            "05-build"
          ],
          "related": [
            {
              "id": 105,
              "kind": "易混淆",
              "why": "105 从给定遍历恢复唯一形状，根由前序决定；108 自己选择中点作根，目标是平衡。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么每次选最左元素作根虽然有序，却不满足目标？",
            "answer": "它会把剩余元素全放到右子树，得到长度 n 的退化链；选中点让两边节点数尽量接近，才能保持高度平衡。"
          },
          "source": "02-Wiki/题目详解/108-将有序数组转换为二叉搜索树.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "def sortedArrayToBST(nums):\n    def build(left, right):\n        # 终止条件：区间为空\n        if left > right:\n            return None\n\n        # 取中点作为根节点\n        mid = (left + right) // 2\n        root = TreeNode(nums[mid])\n\n        # 递归构建左右子树\n        root.left = build(left, mid - 1)\n        root.right = build(mid + 1, right)\n\n        return root\n\n    return build(0, len(nums) - 1)",
          "url": "https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/108-%E5%B0%86%E6%9C%89%E5%BA%8F%E6%95%B0%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.md",
          "sourceHash": "3767aded7c32a967c5fd36c5dfe73237653199269a11229f11b70dfc2dddcd75"
        },
        {
          "uid": "lc-226",
          "id": 226,
          "group": "build",
          "title": "翻转二叉树",
          "level": "Easy",
          "prompt": "给你一棵二叉树的根节点 root，翻转这棵二叉树，并返回其根节点。\n\n翻转 的含义是：交换每个节点的左右子树（即镜像对称）。",
          "example": "输入：root = [4,2,7,1,3,6,9]\n输出：[4,7,2,9,6,3,1]",
          "hint": "先问自己：明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "recognition": "每个节点交换左右孩子",
          "mnemonic": "当前换一次，两边继续换。",
          "why": "每个节点交换左右孩子。递归结束时当前子树的每个节点都完成左右交换。",
          "invariant": "递归结束时当前子树的每个节点都完成左右交换。",
          "steps": [
            "空树直接返回",
            "交换当前左右引用",
            "递归翻转两个孩子后返回原根"
          ],
          "trace": "输入：root = [4,2,7,1,3,6,9]\n输出：[4,7,2,9,6,3,1]\n\n手推时记录：递归结束时当前子树的每个节点都完成左右交换。\n\n边界检查：只交换根的左右子树能完成整棵树翻转吗？\n不能，子树内部每个节点的左右也要交换；否则只是移动两大块，内部结构仍未镜像。",
          "traceLabel": "例子与边界推演",
          "trap": "只交换根的左右子树能完成整棵树翻转吗？\n不能，子树内部每个节点的左右也要交换；否则只是移动两大块，内部结构仍未镜像。",
          "complexity": "时间 O(n)，递归空间 O(h)，原地修改。",
          "prerequisites": [
            "05-build"
          ],
          "related": [
            {
              "id": 114,
              "kind": "易混淆",
              "why": "两题都改指针；226 在每个节点交换两边，114 把整棵树改成前序单链并清空全部 left。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "只交换根的左右子树能完成整棵树翻转吗？",
            "answer": "不能，子树内部每个节点的左右也要交换；否则只是移动两大块，内部结构仍未镜像。"
          },
          "source": "02-Wiki/题目详解/226-翻转二叉树.md",
          "codeBlock": 0,
          "code": "def invertTree(root):\n    if not root:\n        return None\n    # 前序位置：先交换当前节点的左右子树\n    root.left, root.right = root.right, root.left\n    # 递归翻转左右子树\n    invertTree(root.left)\n    invertTree(root.right)\n    return root",
          "url": "https://leetcode.cn/problems/invert-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/226-%E7%BF%BB%E8%BD%AC%E4%BA%8C%E5%8F%89%E6%A0%91.md",
          "sourceHash": "30801f002f6e2c1ddfb81cbc514db0ae7038a15a36a555846a0fd92ad046f2d1"
        },
        {
          "uid": "lc-114",
          "id": 114,
          "group": "build",
          "title": "二叉树展开为链表",
          "level": "Medium",
          "prompt": "给你二叉树的根节点 root，请你将它展开为一个单链表：\n展开后的单链表应该与二叉树 前序遍历 顺序相同。\n使用节点的 right 指针作为链表的 next 指针，left 指针置为 null。",
          "example": "输入：root = [1,2,5,3,4,null,6]\n输出：[1,null,2,null,3,null,4,null,5,null,6]",
          "hint": "先问自己：明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "recognition": "原地展开为前序链且左指针清空",
          "mnemonic": "反着前序走，头插到已处理链。",
          "why": "原地展开为前序链且左指针清空。右→左→根的遍历中，prev 指向已展开的后续前序链表头。",
          "invariant": "右→左→根的遍历中，prev 指向已展开的后续前序链表头。",
          "steps": [
            "递归处理右子树再左子树",
            "令 node.right=prev、node.left=None",
            "把 prev 更新为 node"
          ],
          "trace": "输入：root = [1,2,5,3,4,null,6]\n输出：[1,null,2,null,3,null,4,null,5,null,6]\n\n手推时记录：右→左→根的遍历中，prev 指向已展开的后续前序链表头。\n\n边界检查：为什么遍历顺序是右、左、根，而输出是根、左、右？\n当前节点被接到已处理链的前面，属于从后往前构建；反序处理才能在最终 next 顺序中恢复正常前序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么遍历顺序是右、左、根，而输出是根、左、右？\n当前节点被接到已处理链的前面，属于从后往前构建；反序处理才能在最终 next 顺序中恢复正常前序。",
          "complexity": "时间 O(n)，递归空间 O(h)。",
          "prerequisites": [
            "05-build"
          ],
          "related": [
            {
              "id": 226,
              "kind": "易混淆",
              "why": "两题都改指针；226 在每个节点交换两边，114 把整棵树改成前序单链并清空全部 left。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么遍历顺序是右、左、根，而输出是根、左、右？",
            "answer": "当前节点被接到已处理链的前面，属于从后往前构建；反序处理才能在最终 next 顺序中恢复正常前序。"
          },
          "source": "02-Wiki/题目详解/114-二叉树展开为链表.md",
          "codeBlock": 0,
          "code": "def flatten(root):\n    prev = None  # 记录上一个处理完的节点\n\n    def dfs(node):\n        nonlocal prev\n        if not node:\n            return\n\n        # 后序遍历的变体：右→左→根\n        dfs(node.right)  # 先处理右子树\n        dfs(node.left)   # 再处理左子树\n\n        # 当前节点：right 指向 prev，left 置空\n        node.right = prev\n        node.left = None\n        prev = node      # 更新 prev 为当前节点\n\n    dfs(root)",
          "url": "https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/114-%E4%BA%8C%E5%8F%89%E6%A0%91%E5%B1%95%E5%BC%80%E4%B8%BA%E9%93%BE%E8%A1%A8.md",
          "sourceHash": "4e8ba3ff51abf64a47480d4f85c650f88de875995772698e3e8b5fe7642a4333"
        },
        {
          "uid": "lc-297",
          "id": 297,
          "group": "build",
          "title": "二叉树的序列化与反序列化",
          "level": "Hard",
          "prompt": "把二叉树编码成字符串，并能从该字符串还原出完全相同的树。",
          "example": "输入：root=[1,2,3,null,null,4,5]\n输出：deserialize(serialize(root)) 得到相同结构与节点值的树",
          "hint": "先问自己：明确子树由哪一段输入定义，或已处理节点怎样接回原树。",
          "recognition": "序列化后必须能还原形状",
          "mnemonic": "前序记节点，也记空位。",
          "why": "序列化后必须能还原形状。反序列化迭代器依次消费一棵子树的完整编码，# 表示该分支不存在。",
          "invariant": "反序列化迭代器依次消费一棵子树的完整编码，# 表示该分支不存在。",
          "steps": [
            "前序输出节点或 #",
            "解码读一个标记",
            "非空时递归构建左、右子树"
          ],
          "trace": "树 [1,2,3,null,null,4,5] 可编码为 1,2,#,#,3,4,#,#,5,#,#。\n\n手推时记录：反序列化迭代器依次消费一棵子树的完整编码，# 表示该分支不存在。\n\n边界检查：删除所有 # 后，为什么相同值序列可能对应不同树？\n[1,2] 的前序既可来自 1 的左孩子是 2，也可来自右孩子是 2；空标记保存了缺失分支的位置。",
          "traceLabel": "例子与边界推演",
          "trap": "删除所有 # 后，为什么相同值序列可能对应不同树？\n[1,2] 的前序既可来自 1 的左孩子是 2，也可来自右孩子是 2；空标记保存了缺失分支的位置。",
          "complexity": "时间 O(n)，编码及输出 O(n)，递归 O(h)。",
          "prerequisites": [
            "05-build"
          ],
          "related": [
            {
              "id": 105,
              "kind": "信息变化",
              "why": "105 用前序加中序共同确定形状；297 用一份含空标记的前序编码保存足够结构信息。"
            },
            {
              "id": 271,
              "kind": "同目标",
              "why": "两题都要无损还原结构：271 保存字符串长度边界，297 保存空孩子边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "删除所有 # 后，为什么相同值序列可能对应不同树？",
            "answer": "[1,2] 的前序既可来自 1 的左孩子是 2，也可来自右孩子是 2；空标记保存了缺失分支的位置。"
          },
          "source": "02-Wiki/题目详解/297-二叉树的序列化与反序列化.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Codec:\n    def serialize(self, root: TreeNode | None) -> str:\n        values = []\n\n        def dfs(node: TreeNode | None) -> None:\n            if not node:\n                values.append(\"#\")\n                return\n            values.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n\n        dfs(root)\n        return \",\".join(values)\n\n    def deserialize(self, data: str) -> TreeNode | None:\n        values = iter(data.split(\",\"))\n\n        def build() -> TreeNode | None:\n            value = next(values)\n            if value == \"#\":\n                return None\n            node = TreeNode(int(value))\n            node.left = build()\n            node.right = build()\n            return node\n\n        return build()",
          "url": "https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/297-%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E5%BA%8F%E5%88%97%E5%8C%96%E4%B8%8E%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96.md",
          "sourceHash": "79ab9ba6cd13316ceac8b592c73cdcda932d6061062980074cbafb3a3d1ff915"
        },
        {
          "uid": "lc-437",
          "id": 437,
          "group": "path",
          "title": "路径总和 III",
          "level": "Medium",
          "prompt": "给定一个二叉树的根节点 root，和一个整数 targetSum，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。\n\n路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。",
          "example": "输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8\n输出：3",
          "hint": "先问自己：同一路径内有效的状态，返回到兄弟分支前必须恢复或作为参数独立传递。",
          "recognition": "统计向下路径和但起点不限",
          "mnemonic": "沿当前根路径记前缀，回去就撤销。",
          "why": "统计向下路径和但起点不限。prefix 中只有当前祖先路径的有效前缀次数，兄弟分支不能共享已离开的路径状态。",
          "invariant": "prefix 中只有当前祖先路径的有效前缀次数，兄弟分支不能共享已离开的路径状态。",
          "steps": [
            "累加当前和并查 cur−target",
            "当前前缀计数加一后进入左右",
            "返回前把当前计数减一"
          ],
          "trace": "输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8\n输出：3\n解释：和等于 8 的路径有 3 条，如图所示。\n\n手推时记录：prefix 中只有当前祖先路径的有效前缀次数，兄弟分支不能共享已离开的路径状态。\n\n边界检查：如果不在返回前减掉当前前缀，会多算哪类不存在的路径？\n会把左分支前缀当成右分支祖先，从而拼出跨兄弟的路径；题目只允许一路向下，不能这样跨分支连接。",
          "traceLabel": "例子与边界推演",
          "trap": "如果不在返回前减掉当前前缀，会多算哪类不存在的路径？\n会把左分支前缀当成右分支祖先，从而拼出跨兄弟的路径；题目只允许一路向下，不能这样跨分支连接。",
          "complexity": "时间 O(n)，递归 O(h)；此 defaultdict 实现保留零计数键，字典最坏 O(n)。",
          "prerequisites": [
            "05-path"
          ],
          "related": [
            {
              "id": 1448,
              "kind": "易混淆",
              "why": "1448 的路径最大值可直接按值传参；437 的共享计数表必须在离开当前路径时撤销。"
            },
            {
              "id": 560,
              "kind": "迁移",
              "why": "437 把数组的前缀和计数搬到树上；由于树有分支，新增了回溯时撤销前缀的要求。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "如果不在返回前减掉当前前缀，会多算哪类不存在的路径？",
            "answer": "会把左分支前缀当成右分支祖先，从而拼出跨兄弟的路径；题目只允许一路向下，不能这样跨分支连接。"
          },
          "source": "02-Wiki/题目详解/437-路径总和III.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\n\ndef pathSum(root, targetSum):\n    # 前缀和字典：记录从根到当前节点的路径和出现的次数\n    prefix = defaultdict(int)\n    prefix[0] = 1  # 空路径的前缀和为 0\n\n    def dfs(node, cur_sum):\n        if not node:\n            return 0\n\n        # 更新当前路径和\n        cur_sum += node.val\n        # 以当前节点结尾的满足条件的路径数\n        count = prefix[cur_sum - targetSum]\n\n        # 记录当前前缀和\n        prefix[cur_sum] += 1\n        # 递归处理左右子树\n        count += dfs(node.left, cur_sum)\n        count += dfs(node.right, cur_sum)\n        # 回溯：移除当前前缀和（左右子树已经处理完毕）\n        prefix[cur_sum] -= 1\n\n        return count\n\n    return dfs(root, 0)",
          "url": "https://leetcode.cn/problems/path-sum-iii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/437-%E8%B7%AF%E5%BE%84%E6%80%BB%E5%92%8CIII.md",
          "sourceHash": "8fb6a20ca639b6e43150cc67f29d67b8144d5c2c50579d0031fa696dabb7c46b"
        },
        {
          "uid": "lc-1448",
          "id": 1448,
          "group": "path",
          "title": "统计二叉树中好节点的数目",
          "level": "Medium",
          "prompt": "统计从根到该节点的路径上，没有比它更大节点的“好节点”数量。",
          "example": "[3,1,4,3,null,1,5] 中好节点为 3、3、4、5，共 4 个。",
          "hint": "先问自己：同一路径内有效的状态，返回到兄弟分支前必须恢复或作为参数独立传递。",
          "recognition": "节点值不小于从根一路见过的值",
          "mnemonic": "路径最大值向下传。",
          "why": "节点值不小于从根一路见过的值。path_max 表示到当前节点之前的祖先最大值，子递归使用包含当前节点后的新最大值。",
          "invariant": "path_max 表示到当前节点之前的祖先最大值，子递归使用包含当前节点后的新最大值。",
          "steps": [
            "比较当前值与 path_max",
            "更新传给孩子的最大值",
            "累加当前是否合格与两子树计数"
          ],
          "trace": "[3,1,4,3,null,1,5] 中好节点为 3、3、4、5，共 4 个。\n\n手推时记录：path_max 表示到当前节点之前的祖先最大值，子递归使用包含当前节点后的新最大值。\n\n边界检查：兄弟子树里的大数会影响当前节点是否为好节点吗？\n不会，条件只看根到当前节点这一路。把最大值作为递归参数向下传，避免错误使用全树最大值。",
          "traceLabel": "例子与边界推演",
          "trap": "兄弟子树里的大数会影响当前节点是否为好节点吗？\n不会，条件只看根到当前节点这一路。把最大值作为递归参数向下传，避免错误使用全树最大值。",
          "complexity": "时间 O(n)，递归空间 O(h)。",
          "prerequisites": [
            "05-path"
          ],
          "related": [
            {
              "id": 437,
              "kind": "易混淆",
              "why": "1448 的路径最大值可直接按值传参；437 的共享计数表必须在离开当前路径时撤销。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "兄弟子树里的大数会影响当前节点是否为好节点吗？",
            "answer": "不会，条件只看根到当前节点这一路。把最大值作为递归参数向下传，避免错误使用全树最大值。"
          },
          "source": "02-Wiki/题目详解/1448-统计二叉树中好节点的数目.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def goodNodes(self, root: TreeNode) -> int:\n        def dfs(node: TreeNode | None, path_max: int) -> int:\n            if not node:\n                return 0\n            good = int(node.val >= path_max)\n            next_max = max(path_max, node.val)\n            return good + dfs(node.left, next_max) + dfs(node.right, next_max)\n\n        return dfs(root, root.val)",
          "url": "https://leetcode.cn/problems/count-good-nodes-in-binary-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1448-%E7%BB%9F%E8%AE%A1%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%AD%E5%A5%BD%E8%8A%82%E7%82%B9%E7%9A%84%E6%95%B0%E7%9B%AE.md",
          "sourceHash": "afaabdef5a77acc606e9d5a2d3dc0756a164bf7a643c8cbbf4752424f4ee10b1"
        }
      ]
    },
    {
      "id": "stacks-heaps-06",
      "number": "06",
      "title": "栈与堆",
      "content": "decks/06-cards.json",
      "concepts": [
        {
          "id": "06-context",
          "title": "栈：最后打开的事情先处理",
          "explanation": "栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "example": "20 匹配括号；150 弹出两操作数；394 返回上一层字符串上下文。"
        },
        {
          "id": "06-monotonic",
          "title": "单调候选：什么时候可以结算",
          "explanation": "弹栈既意味着旧候选失效，也可能意味着它的答案边界终于确定。",
          "example": "739 遇到更高温度结算等待；84 遇到更矮柱子结算可扩展宽度。"
        },
        {
          "id": "06-selection",
          "title": "有限堆：保留排名靠前的一小批",
          "explanation": "堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "example": "215 留最大的 k 个，堆顶是第 k 大；973 留最近 k 个，堆顶要是最远的。"
        },
        {
          "id": "06-dynamic",
          "title": "动态合并、平衡与安排",
          "explanation": "先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "example": "295 用双堆夹住中位数；355 从关注者的多条时间线中合并最新消息。"
        }
      ],
      "source": "02-Wiki/专题总结/06-栈与堆.md",
      "connectionRule": "按“容器里的元素代表什么”连接：栈保存未完成上下文，单调容器保存尚有机会的候选，堆保留某种排名或边界。",
      "groups": [
        {
          "id": "context",
          "title": "栈：最后打开的事情先处理",
          "description": "栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "example": "20 匹配括号；150 弹出两操作数；394 返回上一层字符串上下文。"
        },
        {
          "id": "monotonic",
          "title": "单调候选：什么时候可以结算",
          "description": "弹栈既意味着旧候选失效，也可能意味着它的答案边界终于确定。",
          "example": "739 遇到更高温度结算等待；84 遇到更矮柱子结算可扩展宽度。"
        },
        {
          "id": "selection",
          "title": "有限堆：保留排名靠前的一小批",
          "description": "堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "example": "215 留最大的 k 个，堆顶是第 k 大；973 留最近 k 个，堆顶要是最远的。"
        },
        {
          "id": "dynamic",
          "title": "动态合并、平衡与安排",
          "description": "先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "example": "295 用双堆夹住中位数；355 从关注者的多条时间线中合并最新消息。"
        }
      ],
      "firstProblems": [
        20,
        150,
        215
      ],
      "cards": [
        {
          "uid": "lc-20",
          "id": 20,
          "group": "context",
          "title": "有效的括号",
          "level": "Easy",
          "prompt": "给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s，判断字符串是否有效。\n\n有效字符串需满足：\n\n1. 左括号必须用相同类型的右括号闭合。\n2. 左括号必须以正确的顺序闭合。\n3. 每个右括号都有一个对应的相同类型的左括号。",
          "example": "输入：s = \"()\"\n输出：true",
          "hint": "先问自己：栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "recognition": "嵌套括号要最近打开的先闭合",
          "mnemonic": "左入栈，右找栈顶。",
          "why": "嵌套括号要最近打开的先闭合。栈从底到顶保存所有尚未匹配的左括号，最后一个最先被闭合。",
          "invariant": "栈从底到顶保存所有尚未匹配的左括号，最后一个最先被闭合。",
          "steps": [
            "左括号入栈",
            "右括号检查栈非空且类型匹配再弹出",
            "结束时栈必须为空"
          ],
          "trace": "输入：s = \"()\"\n输出：true\n\n手推时记录：栈从底到顶保存所有尚未匹配的左括号，最后一个最先被闭合。\n\n边界检查：([)] 为什么不能用三种括号各自的数量是否相等判断？\n数量相等不能保证嵌套顺序。读到 ) 时最近打开的是 [，类型不匹配，应立即判失败。",
          "traceLabel": "例子与边界推演",
          "trap": "([)] 为什么不能用三种括号各自的数量是否相等判断？\n数量相等不能保证嵌套顺序。读到 ) 时最近打开的是 [，类型不匹配，应立即判失败。",
          "complexity": "时间 O(n)，栈空间 O(n)。",
          "prerequisites": [
            "06-context"
          ],
          "related": [
            {
              "id": 394,
              "kind": "迁移",
              "why": "20 的栈只记未闭合括号；394 进入括号还要记外层字符串和重复次数，退出时恢复计算现场。"
            },
            {
              "id": 150,
              "kind": "同容器不同语义",
              "why": "20 栈存未匹配符号，150 栈存已经求值的子表达式；弹栈条件和弹出的含义完全不同。"
            },
            {
              "id": 22,
              "kind": "验证到生成",
              "why": "20 检验已有括号串；22 把合法前缀条件直接放进生成过程，避免产生提前闭合的串。"
            },
            {
              "id": 32,
              "kind": "状态变化",
              "why": "20 判断整串是否合法；32 要找连续合法段最大长度，需要保存每个位置结尾的长度并连接相邻合法段。"
            },
            {
              "id": 678,
              "kind": "条件放宽",
              "why": "普通括号有确定匹配；678 的星号带来多种解释，用可行未闭合数量区间避免枚举所有分支。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "([)] 为什么不能用三种括号各自的数量是否相等判断？",
            "answer": "数量相等不能保证嵌套顺序。读到 ) 时最近打开的是 [，类型不匹配，应立即判失败。"
          },
          "source": "02-Wiki/题目详解/20-有效的括号.md",
          "codeBlock": 0,
          "code": "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n\n    for ch in s:\n        if ch in mapping:               # 右括号\n            if not stack:               # 栈已空但还有右括号 → 无效\n                return False\n            if stack[-1] != mapping[ch]: # 栈顶不匹配 → 无效\n                return False\n            stack.pop()                 # 匹配成功，弹出\n        else:                           # 左括号\n            stack.append(ch)\n\n    return not stack                     # 全部匹配完，栈应为空",
          "url": "https://leetcode.cn/problems/valid-parentheses/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/20-%E6%9C%89%E6%95%88%E7%9A%84%E6%8B%AC%E5%8F%B7.md",
          "sourceHash": "ec222ab1d59144a3d7299e1bf835553fcffad968b4a5df69f2903ce69d9c8589"
        },
        {
          "uid": "lc-150",
          "id": 150,
          "group": "context",
          "title": "逆波兰表达式求值",
          "level": "Medium",
          "prompt": "tokens 是一个有效逆波兰表达式：操作符写在两个操作数之后。支持 +、−、*、/；整数除法向零截断，保证除数非零。返回最终整数值。",
          "example": "输入：tokens=[\"2\",\"1\",\"+\",\"3\",\"*\"]\n输出：9",
          "hint": "先问自己：栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "recognition": "后缀表达式不需要优先级解析",
          "mnemonic": "数字入栈，符号弹两数。",
          "why": "后缀表达式不需要优先级解析。栈中保存已经求值但尚未被更外层运算消费的表达式结果。",
          "invariant": "栈中保存已经求值但尚未被更外层运算消费的表达式结果。",
          "steps": [
            "数字压栈",
            "运算符先弹右操作数再弹左操作数",
            "计算并压回，最终返回栈顶"
          ],
          "trace": "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]\n\n2 入栈        [2]\n1 入栈        [2, 1]\n+ 计算 2+1   [3]\n3 入栈        [3, 3]\n计算 3*3   [9]\n\n答案：9\n\n手推时记录：栈中保存已经求值但尚未被更外层运算消费的表达式结果。\n\n边界检查：先弹 a 再弹 b 时，减法与除法为何容易写反？\n后入栈的是右操作数。比如 2 3 - 必须算 2−3，不是 3−2；除法还需要向零截断，负数不能直接用 Python //。",
          "traceLabel": "例子与边界推演",
          "trap": "先弹 a 再弹 b 时，减法与除法为何容易写反？\n后入栈的是右操作数。比如 2 3 - 必须算 2−3，不是 3−2；除法还需要向零截断，负数不能直接用 Python //。",
          "complexity": "时间 O(n)，空间 O(n)。",
          "prerequisites": [
            "06-context"
          ],
          "related": [
            {
              "id": 20,
              "kind": "同容器不同语义",
              "why": "20 栈存未匹配符号，150 栈存已经求值的子表达式；弹栈条件和弹出的含义完全不同。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "先弹 a 再弹 b 时，减法与除法为何容易写反？",
            "answer": "后入栈的是右操作数。比如 2 3 - 必须算 2−3，不是 3−2；除法还需要向零截断，负数不能直接用 Python //。"
          },
          "source": "02-Wiki/题目详解/150-逆波兰表达式求值.md",
          "codeBlock": 1,
          "code": "from typing import List\n\n\nclass Solution:\n    def evalRPN(self, tokens: List[str]) -> int:\n        stack = []\n\n        for token in tokens:\n            if token not in {\"+\", \"-\", \"*\", \"/\"}:\n                stack.append(int(token))\n                continue\n\n            b = stack.pop()\n            a = stack.pop()\n\n            if token == \"+\":\n                stack.append(a + b)\n            elif token == \"-\":\n                stack.append(a - b)\n            elif token == \"*\":\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))  # 向 0 截断\n\n        return stack[-1]",
          "url": "https://leetcode.cn/problems/evaluate-reverse-polish-notation/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/150-%E9%80%86%E6%B3%A2%E5%85%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F%E6%B1%82%E5%80%BC.md",
          "sourceHash": "448b3cf590d73d37a88d83d9402618db3a198d88774501ffdf9e8f5da9d78ea6"
        },
        {
          "uid": "lc-215",
          "id": 215,
          "group": "selection",
          "title": "数组中的第 K 个最大元素",
          "level": "Medium",
          "prompt": "返回整数数组 nums 排序后的第 k 大元素，重复值按不同位置计数。基础复习先写可解释的解法；进阶要求平均 O(n) 时间。",
          "example": "输入：nums = [3,2,1,5,6,4], k = 2\n输出：5",
          "hint": "先问自己：堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "recognition": "第 k 大不需要全排序",
          "mnemonic": "小堆只留下最大的 k 个。",
          "why": "第 k 大不需要全排序。堆中始终是已看元素里最大的至多 k 个，堆顶是保留集合最小者。",
          "invariant": "堆中始终是已看元素里最大的至多 k 个，堆顶是保留集合最小者。",
          "steps": [
            "每个数压小堆",
            "超过 k 就弹最小值",
            "扫描完返回堆顶"
          ],
          "trace": "输入：nums = [3,2,1,5,6,4], k = 2\n输出：5\n\n手推时记录：堆中始终是已看元素里最大的至多 k 个，堆顶是保留集合最小者。\n\n边界检查：求第 k 大，为什么用的反而是小顶堆？\n要淘汰的是保留集合中最小的那个；保留最大 k 个后，其中最小者正是第 k 大。",
          "traceLabel": "例子与边界推演",
          "trap": "求第 k 大，为什么用的反而是小顶堆？\n要淘汰的是保留集合中最小的那个；保留最大 k 个后，其中最小者正是第 k 大。",
          "complexity": "时间 O(n log(k+1))，空间 O(k)。",
          "prerequisites": [
            "06-selection"
          ],
          "related": [
            {
              "id": 703,
              "kind": "静态到动态",
              "why": "同样保留最大的 k 个，215 扫完一次返回，703 必须在每次 add 后持续维持同一个堆不变量。"
            },
            {
              "id": 973,
              "kind": "易混淆",
              "why": "215 大中选 k，弹最小；973 小中选 k，弹最大。先问“该淘汰谁”，再决定堆方向。"
            },
            {
              "id": 347,
              "kind": "排序键变化",
              "why": "215 的键是数值，347 先统计频次，再以频次作为堆优先级。"
            },
            {
              "id": 295,
              "kind": "递进",
              "why": "固定 k 可只保存一侧的 k 个边界；中位数排名随数据长度变，295 要用双堆同时维护两半。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "求第 k 大，为什么用的反而是小顶堆？",
            "answer": "要淘汰的是保留集合中最小的那个；保留最大 k 个后，其中最小者正是第 k 大。"
          },
          "source": "02-Wiki/题目详解/215-数组中的第K个最大元素.md",
          "codeBlock": 0,
          "codeNote": "这张基础卡练习保留 k 个候选的堆，时间 O(n log k)，不满足进阶的平均线性时间要求；原题解的“思路二”介绍快速选择。比较这两种方案的适用条件。",
          "code": "import heapq\n\ndef findKthLargest(nums, k):\n    heap = []\n    for num in nums:\n        heapq.heappush(heap, num)   # 入堆\n        if len(heap) > k:\n            heapq.heappop(heap)     # 保持堆大小为 k\n    return heap[0]                  # 堆顶就是第 k 大",
          "url": "https://leetcode.cn/problems/kth-largest-element-in-an-array/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/215-%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E7%AC%ACK%E4%B8%AA%E6%9C%80%E5%A4%A7%E5%85%83%E7%B4%A0.md",
          "sourceHash": "9455f90695cc0a2e1d00256853061e132de87bdc75320718e42451c6ff3bdf50"
        },
        {
          "uid": "lc-394",
          "id": 394,
          "group": "context",
          "title": "字符串解码",
          "level": "Medium",
          "prompt": "给定一个经过编码的字符串，返回它解码后的字符串。\n\n编码规则为：k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。\n\n你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。\n\n此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k，例如不会出现像 3a 或 2[4] 的输入。",
          "example": "输入：s = \"3[a]2[bc]\"\n输出：\"aaabcbc\"",
          "hint": "先问自己：栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "recognition": "重复编码可嵌套且次数多位",
          "mnemonic": "进括号存现场，出括号乘回去。",
          "why": "重复编码可嵌套且次数多位。栈记录外层已有字符串和该层重复次数，cur_str 只构造当前最内层内容。",
          "invariant": "栈记录外层已有字符串和该层重复次数，cur_str 只构造当前最内层内容。",
          "steps": [
            "数字按十进制累积",
            "遇 [ 保存外层并清空当前状态",
            "遇 ] 弹出并拼接 外层+内层×次数"
          ],
          "trace": "输入：s = \"3[a]2[bc]\"\n输出：\"aaabcbc\"\n\n手推时记录：栈记录外层已有字符串和该层重复次数，cur_str 只构造当前最内层内容。\n\n边界检查：12[a] 为什么不能逐字符把重复次数覆盖为当前数字？\n1 后面的 2 应得到 12，需要 cur_num=cur_num*10+2；直接覆盖会误算为重复两次。",
          "traceLabel": "例子与边界推演",
          "trap": "12[a] 为什么不能逐字符把重复次数覆盖为当前数字？\n1 后面的 2 应得到 12，需要 cur_num=cur_num*10+2；直接覆盖会误算为重复两次。",
          "complexity": "输入 n、输出 L；字符串构造保守上界 O(nL)，存储 O(n+L)，不能忽略展开输出。",
          "prerequisites": [
            "06-context"
          ],
          "related": [
            {
              "id": 20,
              "kind": "迁移",
              "why": "20 的栈只记未闭合括号；394 进入括号还要记外层字符串和重复次数，退出时恢复计算现场。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "12[a] 为什么不能逐字符把重复次数覆盖为当前数字？",
            "answer": "1 后面的 2 应得到 12，需要 cur_num=cur_num*10+2；直接覆盖会误算为重复两次。"
          },
          "source": "02-Wiki/题目详解/394-字符串解码.md",
          "codeBlock": 0,
          "code": "def decodeString(s):\n    stack = []          # 存储 (之前的字符串, 重复次数)\n    cur_str = ''        # 当前正在构建的字符串\n    cur_num = 0         # 当前累积的数字\n\n    for ch in s:\n        if ch.isdigit():\n            cur_num = cur_num * 10 + int(ch)   # 处理多位数\n        elif ch == '[':\n            stack.append((cur_str, cur_num))   # 保存当前状态\n            cur_str = ''    # 重置，开始处理内层\n            cur_num = 0     # 重置数字\n        elif ch == ']':\n            prev_str, num = stack.pop()        # 取出外层状态\n            cur_str = prev_str + cur_str * num # 拼接：外层 + 内层×次数\n        else:  # 字母\n            cur_str += ch\n\n    return cur_str",
          "url": "https://leetcode.cn/problems/decode-string/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/394-%E5%AD%97%E7%AC%A6%E4%B8%B2%E8%A7%A3%E7%A0%81.md",
          "sourceHash": "81c624ae203d3fcac2e06eec28cd91a2b62bf30404743b7494eafce3a3933545"
        },
        {
          "uid": "lc-155",
          "id": 155,
          "group": "context",
          "title": "最小栈",
          "level": "Medium",
          "prompt": "设计一个支持 push、pop、top 操作，并能在 常数时间 内检索到最小元素的栈。\n\n实现 MinStack 类：\nMinStack() 初始化堆栈对象。\nvoid push(int val) 将元素 val 推入堆栈。\nvoid pop() 删除堆栈顶部的元素。\nint top() 获取堆栈顶部的元素。\nint getMin() 获取堆栈中的最小元素。",
          "example": "输入：\n[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]\n\n输出：\n[null,null,null,null,-3,null,0,-2]",
          "hint": "先问自己：栈顶代表最近尚未结束的括号、运算或嵌套状态。",
          "recognition": "栈要随时 O(1) 返回最小值",
          "mnemonic": "每层一起存当时最小值。",
          "why": "栈要随时 O(1) 返回最小值。min_stack 的每一层记录普通栈对应深度下的最小值，两栈同步入栈出栈。",
          "invariant": "min_stack 的每一层记录普通栈对应深度下的最小值，两栈同步入栈出栈。",
          "steps": [
            "push 时保存当前值与前最小值中的较小者",
            "pop 两栈同步",
            "getMin 读取辅助栈顶"
          ],
          "trace": "输入：\n[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]\n\n输出：\n[null,null,null,null,-3,null,0,-2]\n\n解释：\nMinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin();   --> 返回 -3.\nminStack.pop();\nminStack.top();      --> 返回 0.\nminStack.getMin();   --> 返回 -2.\n\n手推时记录：min_stack 的每一层记录普通栈对应深度下的最小值，两栈同步入栈出栈。\n\n边界检查：连续压入 2、1、1，再弹出一次，最小值为什么仍是 1？\n最小值可能重复，按深度保存最小值会留下另一层 1；只记录一个最小数字而不保存历史会无法恢复。",
          "traceLabel": "例子与边界推演",
          "trap": "连续压入 2、1、1，再弹出一次，最小值为什么仍是 1？\n最小值可能重复，按深度保存最小值会留下另一层 1；只记录一个最小数字而不保存历史会无法恢复。",
          "complexity": "各操作 O(1)，空间 O(n)。",
          "prerequisites": [
            "06-context"
          ],
          "related": [
            {
              "id": 295,
              "kind": "对比",
              "why": "155 随栈深度恢复历史最小值；295 数据只增加，用两个排名边界维护中位数，不能靠一个历史最小栈解决。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "连续压入 2、1、1，再弹出一次，最小值为什么仍是 1？",
            "answer": "最小值可能重复，按深度保存最小值会留下另一层 1；只记录一个最小数字而不保存历史会无法恢复。"
          },
          "source": "02-Wiki/题目详解/155-最小栈.md",
          "codeBlock": 0,
          "code": "class MinStack:\n    def __init__(self):\n        self.stack = []           # 普通数据栈\n        self.min_stack = [float('inf')]  # 辅助栈，初始为无穷大\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        # 辅助栈记录当前最小值：新值与当前最小值的较小者\n        self.min_stack.append(min(val, self.min_stack[-1]))\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()      # 同步弹出\n\n    def top(self) -> int:\n        return self.stack[-1]\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]",
          "url": "https://leetcode.cn/problems/min-stack/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/155-%E6%9C%80%E5%B0%8F%E6%A0%88.md",
          "sourceHash": "b820a88c04c66e8a0181f7223acca8848be559ecd8da9a389cc1233410fdcdd2"
        },
        {
          "uid": "lc-739",
          "id": 739,
          "group": "monotonic",
          "title": "每日温度",
          "level": "Medium",
          "prompt": "给定一个整数数组 temperatures，表示每天的温度，返回一个数组 answer，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。",
          "example": "输入：temperatures = [73,74,75,71,69,72,76,73]\n输出：[1,1,4,2,1,1,0,0]",
          "hint": "先问自己：弹栈既意味着旧候选失效，也可能意味着它的答案边界终于确定。",
          "recognition": "每天等第一个更暖天",
          "mnemonic": "温度不升先等，升了结算旧天。",
          "why": "每天等第一个更暖天。栈存未找到更高温度的下标，对应温度非递增。",
          "invariant": "栈存未找到更高温度的下标，对应温度非递增。",
          "steps": [
            "扫描新温度",
            "连续弹出比它低的旧下标并记录距离",
            "当前下标入栈"
          ],
          "trace": "输入：temperatures = [73,74,75,71,69,72,76,73]\n输出：[1,1,4,2,1,1,0,0]\n\n手推时记录：栈存未找到更高温度的下标，对应温度非递增。\n\n边界检查：相等温度可以让栈顶出栈吗？\n不可以，题目要求严格更暖。相等时仍需继续等待；用 <= 弹栈会把相同温度当天当成答案。",
          "traceLabel": "例子与边界推演",
          "trap": "相等温度可以让栈顶出栈吗？\n不可以，题目要求严格更暖。相等时仍需继续等待；用 <= 弹栈会把相同温度当天当成答案。",
          "complexity": "时间 O(n)，辅助栈 O(n)，另计输出。",
          "prerequisites": [
            "06-monotonic"
          ],
          "related": [
            {
              "id": 239,
              "kind": "同模板",
              "why": "都淘汰不可能再有用的候选；739 单调栈等未来更大值，239 单调队列还要处理窗口过期。"
            },
            {
              "id": 84,
              "kind": "易混淆",
              "why": "739 遇到更大值时给旧元素结算距离；84 遇到更小值时给旧柱子结算面积，两者单调方向相反。"
            },
            {
              "id": 853,
              "kind": "思路联系",
              "why": "都扫描有序的候选并处理阻挡；739 等更高温度，853 按位置反向扫描判断是否追上前队，后者可压缩成一个到达时间边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "相等温度可以让栈顶出栈吗？",
            "answer": "不可以，题目要求严格更暖。相等时仍需继续等待；用 <= 弹栈会把相同温度当天当成答案。"
          },
          "source": "02-Wiki/题目详解/739-每日温度.md",
          "codeBlock": 0,
          "code": "def dailyTemperatures(temperatures):\n    n = len(temperatures)\n    res = [0] * n       # 初始化结果数组\n    stack = []          # 存储索引，栈底→栈顶：温度递减\n\n    for i in range(n):\n        # 当前温度比栈顶温度高 → 栈顶遇到了右边第一个更高温度\n        while stack and temperatures[stack[-1]] < temperatures[i]:\n            idx = stack.pop()\n            res[idx] = i - idx    # 天数差\n        stack.append(i)            # 当前索引入栈\n\n    return res",
          "url": "https://leetcode.cn/problems/daily-temperatures/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/739-%E6%AF%8F%E6%97%A5%E6%B8%A9%E5%BA%A6.md",
          "sourceHash": "25d9e03139745927e57df28c7be2fcdc8565cbf4dd8cd61ec60a145e35a3a48d"
        },
        {
          "uid": "lc-84",
          "id": 84,
          "group": "monotonic",
          "title": "柱状图中最大的矩形",
          "level": "Hard",
          "prompt": "给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。\n\n求在该柱状图中，能够勾勒出来的矩形的最大面积。",
          "example": "输入：heights = [2,1,5,6,2,3]\n输出：10",
          "hint": "先问自己：弹栈既意味着旧候选失效，也可能意味着它的答案边界终于确定。",
          "recognition": "每根柱子向两边扩到更矮处",
          "mnemonic": "遇到矮柱，结算弹出的高柱。",
          "why": "每根柱子向两边扩到更矮处。非递减栈保存尚未确定右边界的柱子，弹出后新栈顶给出左侧阻挡边界。",
          "invariant": "非递减栈保存尚未确定右边界的柱子，弹出后新栈顶给出左侧阻挡边界。",
          "steps": [
            "前后加零哨兵",
            "当前柱更矮时反复弹栈",
            "按 i−新栈顶−1 计算宽度并更新面积"
          ],
          "trace": "输入：heights = [2,1,5,6,2,3]\n输出：10\n\n手推时记录：非递减栈保存尚未确定右边界的柱子，弹出后新栈顶给出左侧阻挡边界。\n\n边界检查：宽度为什么要减 1？最后那个零哨兵起什么作用？\n两个边界都是不能包含的更矮位置，因此中间长度减一；末尾零强制结算到末尾仍没遇到更矮柱的候选。",
          "traceLabel": "例子与边界推演",
          "trap": "宽度为什么要减 1？最后那个零哨兵起什么作用？\n两个边界都是不能包含的更矮位置，因此中间长度减一；末尾零强制结算到末尾仍没遇到更矮柱的候选。",
          "complexity": "时间 O(n)，本实现哨兵数组和栈共 O(n) 空间。",
          "prerequisites": [
            "06-monotonic"
          ],
          "related": [
            {
              "id": 739,
              "kind": "易混淆",
              "why": "739 遇到更大值时给旧元素结算距离；84 遇到更小值时给旧柱子结算面积，两者单调方向相反。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "宽度为什么要减 1？最后那个零哨兵起什么作用？",
            "answer": "两个边界都是不能包含的更矮位置，因此中间长度减一；末尾零强制结算到末尾仍没遇到更矮柱的候选。"
          },
          "source": "02-Wiki/题目详解/84-柱状图中最大的矩形.md",
          "codeBlock": 0,
          "code": "def largestRectangleArea(heights):\n    # 前后加 0 作为哨兵，简化边界处理\n    heights = [0] + heights + [0]\n    stack = []          # 单调递增栈，存索引\n    max_area = 0\n\n    for i in range(len(heights)):\n        # 当前高度小于栈顶高度 → 可以计算以栈顶高度为高的矩形面积了\n        while stack and heights[stack[-1]] > heights[i]:\n            h = heights[stack.pop()]      # 以弹出柱子的高度为高\n            w = i - stack[-1] - 1         # 宽度 = 右边界 - 左边界 - 1\n            max_area = max(max_area, h * w)\n        stack.append(i)\n\n    return max_area",
          "url": "https://leetcode.cn/problems/largest-rectangle-in-histogram/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/84-%E6%9F%B1%E7%8A%B6%E5%9B%BE%E4%B8%AD%E6%9C%80%E5%A4%A7%E7%9A%84%E7%9F%A9%E5%BD%A2.md",
          "sourceHash": "0529e132c1d4ff90e9704d9628580c24a561718b851b6121995bab45e1d2675b"
        },
        {
          "uid": "lc-853",
          "id": 853,
          "group": "monotonic",
          "title": "车队",
          "level": "Medium",
          "prompt": "汽车在不同位置朝 target 行驶，不能超车。追上前车后合并并以较慢速度行驶，到终点恰好追上也算同一队。给定 position 和 speed，返回到达终点时的车队数。",
          "example": "输入：target=12, position=[10,8,0,5,3], speed=[2,4,1,1,3]\n输出：3",
          "hint": "先问自己：弹栈既意味着旧候选失效，也可能意味着它的答案边界终于确定。",
          "recognition": "不能超车，只能追上前车队",
          "mnemonic": "从终点最近的车往后看。",
          "why": "不能超车，只能追上前车队。slowest_time 是前方最近已形成车队的到达时间，后车不晚于它到达就会并入。",
          "invariant": "slowest_time 是前方最近已形成车队的到达时间，后车不晚于它到达就会并入。",
          "steps": [
            "按位置从近到远排序",
            "计算自由到达时间",
            "比前队更晚则新建车队，否则合并"
          ],
          "trace": "target = 12\nposition = [10, 8, 0, 5, 3]\nspeed    = [ 2, 4, 1, 1, 3]\n\n按位置从大到小：\n10 -> time = 1\n8  -> time = 1\n5  -> time = 7\n3  -> time = 3\n0  -> time = 12\n\n10 和 8 合并为 1 个车队\n5 自成 1 个车队\n3 追上 5 的车队\n0 自成 1 个车队\n\n答案：3\n\n手推时记录：slowest_time 是前方最近已形成车队的到达时间，后车不晚于它到达就会并入。\n\n边界检查：后车自由到达时间恰好等于前队，会多一个车队吗？\n不会，它们在终点相遇仍算同队；只有严格更晚到达才建立新车队。",
          "traceLabel": "例子与边界推演",
          "trap": "后车自由到达时间恰好等于前队，会多一个车队吗？\n不会，它们在终点相遇仍算同队；只有严格更晚到达才建立新车队。",
          "complexity": "时间 O(n log n)，排序及配对数组 O(n) 空间。",
          "prerequisites": [
            "06-monotonic"
          ],
          "related": [
            {
              "id": 739,
              "kind": "思路联系",
              "why": "都扫描有序的候选并处理阻挡；739 等更高温度，853 按位置反向扫描判断是否追上前队，后者可压缩成一个到达时间边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "后车自由到达时间恰好等于前队，会多一个车队吗？",
            "answer": "不会，它们在终点相遇仍算同队；只有严格更晚到达才建立新车队。"
          },
          "source": "02-Wiki/题目详解/853-车队.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:\n        cars = sorted(zip(position, speed), reverse=True)\n\n        fleets = 0\n        slowest_time = 0\n\n        for pos, spd in cars:\n            time = (target - pos) / spd\n            if time > slowest_time:\n                fleets += 1\n                slowest_time = time\n\n        return fleets",
          "url": "https://leetcode.cn/problems/car-fleet/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/853-%E8%BD%A6%E9%98%9F.md",
          "sourceHash": "b9daf4489da34637d05b90e6e1816f8e2f0fd717d549317f499593c6bdcdad26"
        },
        {
          "uid": "lc-703",
          "id": 703,
          "group": "selection",
          "title": "数据流中的第 K 大元素",
          "level": "Easy",
          "prompt": "设计一个类，持续接收新的数字，并在每次加入新数字后返回当前数据流中的第 k 大元素。",
          "example": "输入：k=3, 初始 nums=[4,5,8,2]；依次 add(3), add(5), add(10)\n输出：依次返回 4, 5, 5",
          "hint": "先问自己：堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "recognition": "数据流每次加入后问第 k 大",
          "mnemonic": "固定 k 的小堆持续更新。",
          "why": "数据流每次加入后问第 k 大。堆保留数据流中最大的至多 k 个值，达到 k 个后堆顶是当前第 k 大。",
          "invariant": "堆保留数据流中最大的至多 k 个值，达到 k 个后堆顶是当前第 k 大。",
          "steps": [
            "初始化堆并裁成 k 个",
            "每次 add 压入并超量弹出",
            "返回堆顶"
          ],
          "trace": "k = 3\nnums = [4, 5, 8, 2]\n\n保留最大的 3 个：[4, 5, 8]\n堆顶 4 是第 3 大\n\nadd(3) -> 最大三个仍是 [4,5,8]，返回 4\nadd(5) -> 最大三个是 [5,5,8]，返回 5\nadd(10) -> 最大三个是 [5,8,10]，返回 5\n\n手推时记录：堆保留数据流中最大的至多 k 个值，达到 k 个后堆顶是当前第 k 大。\n\n边界检查：为什么无需在每次 add 后重新对全部历史数据排序？\n第 k 大之外更小的旧数字已经被淘汰，之后只会继续添加新数，它们不会重新进入最大的 k 个，只保留边界集合即可。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么无需在每次 add 后重新对全部历史数据排序？\n第 k 大之外更小的旧数字已经被淘汰，之后只会继续添加新数，它们不会重新进入最大的 k 个，只保留边界集合即可。",
          "complexity": "add 时间 O(log(k+1))；稳定状态 O(k) 空间，初始化复制输入的峰值空间 O(n)。",
          "prerequisites": [
            "06-selection"
          ],
          "related": [
            {
              "id": 215,
              "kind": "静态到动态",
              "why": "同样保留最大的 k 个，215 扫完一次返回，703 必须在每次 add 后持续维持同一个堆不变量。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么无需在每次 add 后重新对全部历史数据排序？",
            "answer": "第 k 大之外更小的旧数字已经被淘汰，之后只会继续添加新数，它们不会重新进入最大的 k 个，只保留边界集合即可。"
          },
          "source": "02-Wiki/题目详解/703-数据流中的第K大元素.md",
          "codeBlock": 0,
          "code": "from typing import List\nimport heapq\n\n\nclass KthLargest:\n\n    def __init__(self, k: int, nums: List[int]):\n        self.k = k\n        self.heap = nums[:]\n        heapq.heapify(self.heap)\n\n        while len(self.heap) > k:\n            heapq.heappop(self.heap)\n\n    def add(self, val: int) -> int:\n        heapq.heappush(self.heap, val)\n\n        if len(self.heap) > self.k:\n            heapq.heappop(self.heap)\n\n        return self.heap[0]",
          "url": "https://leetcode.cn/problems/kth-largest-element-in-a-stream/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/703-%E6%95%B0%E6%8D%AE%E6%B5%81%E4%B8%AD%E7%9A%84%E7%AC%ACK%E5%A4%A7%E5%85%83%E7%B4%A0.md",
          "sourceHash": "53dae08f3c21df19925ebe57268e4f871bd21494eae29d5471ce7221d1a6d156"
        },
        {
          "uid": "lc-347",
          "id": 347,
          "group": "selection",
          "title": "前 K 个高频元素",
          "level": "Medium",
          "prompt": "给你一个整数数组 nums 和一个整数 k，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。",
          "example": "输入：nums = [1,1,1,2,2,3], k = 2\n输出：[1,2]",
          "hint": "先问自己：堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "recognition": "第 k 个高频看的是次数，不是数值",
          "mnemonic": "先数频率，再按频率留堆。",
          "why": "第 k 个高频看的是次数，不是数值。堆保留频次最高的至多 k 个不同数字，排序依据是 (频次,数字)。",
          "invariant": "堆保留频次最高的至多 k 个不同数字，排序依据是 (频次,数字)。",
          "steps": [
            "Counter 统计",
            "把每个不同数及频次加入小堆",
            "超过 k 弹最低频，再输出数字"
          ],
          "trace": "输入：nums = [1,1,1,2,2,3], k = 2\n输出：[1,2]\n\n手推时记录：堆保留频次最高的至多 k 个不同数字，排序依据是 (频次,数字)。\n\n边界检查：若 100 出现一次而 1 出现十次，谁更该被保留？\n1。此题的优先级是频次，不能沿用 215 按数值大小入堆的排序键。",
          "traceLabel": "例子与边界推演",
          "trap": "若 100 出现一次而 1 出现十次，谁更该被保留？\n1。此题的优先级是频次，不能沿用 215 按数值大小入堆的排序键。",
          "complexity": "n 个输入、u 种数字：O(n+u log(k+1)) 时间，O(u+k) 空间。",
          "prerequisites": [
            "06-selection"
          ],
          "related": [
            {
              "id": 215,
              "kind": "排序键变化",
              "why": "215 的键是数值，347 先统计频次，再以频次作为堆优先级。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "若 100 出现一次而 1 出现十次，谁更该被保留？",
            "answer": "1。此题的优先级是频次，不能沿用 215 按数值大小入堆的排序键。"
          },
          "source": "02-Wiki/题目详解/347-前K个高频元素.md",
          "codeBlock": 0,
          "code": "from collections import Counter\nimport heapq\n\ndef topKFrequent(nums, k):\n    # 1. 频率统计 O(n)\n    count = Counter(nums)\n\n    # 2. 最小堆维护 Top K\n    heap = []\n    for num, freq in count.items():\n        heapq.heappush(heap, (freq, num))   # 按频率排序\n        if len(heap) > k:\n            heapq.heappop(heap)              # 弹出频率最低的\n\n    # 3. 提取结果\n    return [num for _, num in heap]",
          "url": "https://leetcode.cn/problems/top-k-frequent-elements/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/347-%E5%89%8DK%E4%B8%AA%E9%AB%98%E9%A2%91%E5%85%83%E7%B4%A0.md",
          "sourceHash": "5cb224fbe25fd5b77ecf2ef7cef7e512fc86f1fd19d43d20d847d82de308de12"
        },
        {
          "uid": "lc-973",
          "id": 973,
          "group": "selection",
          "title": "最接近原点的 K 个点",
          "level": "Medium",
          "prompt": "给定二维点 points，按欧几里得距离返回离原点最近的 k 个点。输出顺序任意。",
          "example": "输入：points=[[1,3],[-2,2]], k=1\n输出：[[-2,2]]",
          "hint": "先问自己：堆顶是保留集合中最容易被淘汰的边界元素，因此大中选 k 用小堆，小中选 k 用大堆。",
          "recognition": "留离原点最近的 k 个",
          "mnemonic": "大堆淘汰最远，平方距离就够。",
          "why": "留离原点最近的 k 个。负距离小堆等价于距离大堆，堆顶是当前保留点中最远的一点。",
          "invariant": "负距离小堆等价于距离大堆，堆顶是当前保留点中最远的一点。",
          "steps": [
            "用 x²+y² 比较距离",
            "以负距离入堆",
            "超过 k 弹最远的候选"
          ],
          "trace": "points = [[1,3],[-2,2]], k = 1\n\n[1,3]  距离平方 = 10\n[-2,2] 距离平方 = 8\n\n最近的 1 个点是 [-2,2]\n\n手推时记录：负距离小堆等价于距离大堆，堆顶是当前保留点中最远的一点。\n\n边界检查：为什么不需要开平方，且堆顶要是最远点？\n平方根单调，不影响非负距离的大小顺序；为了保留最近 k 个，需要快速淘汰保留集合里最远的一点。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不需要开平方，且堆顶要是最远点？\n平方根单调，不影响非负距离的大小顺序；为了保留最近 k 个，需要快速淘汰保留集合里最远的一点。",
          "complexity": "时间 O(n log(k+1))，空间 O(k)。",
          "prerequisites": [
            "06-selection"
          ],
          "related": [
            {
              "id": 215,
              "kind": "易混淆",
              "why": "215 大中选 k，弹最小；973 小中选 k，弹最大。先问“该淘汰谁”，再决定堆方向。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不需要开平方，且堆顶要是最远点？",
            "answer": "平方根单调，不影响非负距离的大小顺序；为了保留最近 k 个，需要快速淘汰保留集合里最远的一点。"
          },
          "source": "02-Wiki/题目详解/973-最接近原点的K个点.md",
          "codeBlock": 0,
          "code": "from typing import List\nimport heapq\n\n\nclass Solution:\n    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:\n        heap = []\n\n        for x, y in points:\n            dist = x * x + y * y\n            heapq.heappush(heap, (-dist, x, y))\n\n            if len(heap) > k:\n                heapq.heappop(heap)\n\n        return [[x, y] for _, x, y in heap]",
          "url": "https://leetcode.cn/problems/k-closest-points-to-origin/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/973-%E6%9C%80%E6%8E%A5%E8%BF%91%E5%8E%9F%E7%82%B9%E7%9A%84K%E4%B8%AA%E7%82%B9.md",
          "sourceHash": "a263e981b45ab836a920aa3aad91dd00cd553061476fae1af0f8856c48f2ba92"
        },
        {
          "uid": "lc-1046",
          "id": 1046,
          "group": "dynamic",
          "title": "最后一块石头的重量",
          "level": "Easy",
          "prompt": "每次取出最重的两块石头碰撞：\n如果重量相等，两块都消失；\n如果重量不同，剩下一块重量为二者差值的新石头。\n\n返回最后剩下石头的重量；如果没有石头，返回 0。",
          "example": "输入：stones=[2,7,4,1,8,1]\n输出：1",
          "hint": "先问自己：先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "recognition": "每次需要最大的两块石头",
          "mnemonic": "大堆弹两块，差值再回堆。",
          "why": "每次需要最大的两块石头。堆中的负值恰好代表当前尚未消失的石头重量，最小负值对应最大重量。",
          "invariant": "堆中的负值恰好代表当前尚未消失的石头重量，最小负值对应最大重量。",
          "steps": [
            "负重量堆化",
            "每轮弹两块最大",
            "不同则把差值压回，最终取剩余值或 0"
          ],
          "trace": "stones = [2,7,4,1,8,1]\n\n8 和 7 碰撞 -> 剩 1\n4 和 2 碰撞 -> 剩 2\n2 和 1 碰撞 -> 剩 1\n1 和 1 碰撞 -> 都消失\n1 剩下\n\n答案：1\n\n手推时记录：堆中的负值恰好代表当前尚未消失的石头重量，最小负值对应最大重量。\n\n边界检查：为什么简单按初始大小排序后只顺序处理一次不够？\n碰撞得到的新重量需要与所有剩余石头重新比较大小；动态堆维护这个不断变化的全局顺序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么简单按初始大小排序后只顺序处理一次不够？\n碰撞得到的新重量需要与所有剩余石头重新比较大小；动态堆维护这个不断变化的全局顺序。",
          "complexity": "时间 O(n log n)，空间 O(n)。",
          "prerequisites": [
            "06-dynamic"
          ],
          "related": [
            {
              "id": 621,
              "kind": "易混淆",
              "why": "1046 下一次选择依赖碰撞后动态重量；621 只求最短总时长，可用最大频次推导空位下界而不必逐时刻模拟。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么简单按初始大小排序后只顺序处理一次不够？",
            "answer": "碰撞得到的新重量需要与所有剩余石头重新比较大小；动态堆维护这个不断变化的全局顺序。"
          },
          "source": "02-Wiki/题目详解/1046-最后一块石头的重量.md",
          "codeBlock": 0,
          "code": "from typing import List\nimport heapq\n\n\nclass Solution:\n    def lastStoneWeight(self, stones: List[int]) -> int:\n        heap = [-stone for stone in stones]\n        heapq.heapify(heap)\n\n        while len(heap) > 1:\n            y = -heapq.heappop(heap)  # 最大\n            x = -heapq.heappop(heap)  # 第二大\n\n            if y != x:\n                heapq.heappush(heap, -(y - x))\n\n        return -heap[0] if heap else 0",
          "url": "https://leetcode.cn/problems/last-stone-weight/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1046-%E6%9C%80%E5%90%8E%E4%B8%80%E5%9D%97%E7%9F%B3%E5%A4%B4%E7%9A%84%E9%87%8D%E9%87%8F.md",
          "sourceHash": "3f332fe78ec81b90205e25823e6de85d299ba952e3a3c1db0b10aad7826df3ab"
        },
        {
          "uid": "lc-295",
          "id": 295,
          "group": "dynamic",
          "title": "数据流的中位数",
          "level": "Hard",
          "prompt": "中位数 是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。\n例如 [2,3,4] 的中位数是 3\n例如 [2,3] 的中位数是 (2 + 3) / 2 = 2.5\n\n设计一个支持以下两种操作的数据结构：\nvoid addNum(int num) — 从数据流中添加一个整数到数据结构中。\ndouble findMedian() — 返回目前所有元素的中位数。",
          "example": "输入：\n[\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"]\n[[],[1],[2],[],[3],[]]\n输出：\n[null,null,null,1.5,null,2.0]",
          "hint": "先问自己：先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "recognition": "数据流中位数需要夹住中间",
          "mnemonic": "小的一半用大堆，大的一半用小堆。",
          "why": "数据流中位数需要夹住中间。small 中所有数不大于 large，且 small 大小等于 large 或多一个。",
          "invariant": "small 中所有数不大于 large，且 small 大小等于 large 或多一个。",
          "steps": [
            "先入 small",
            "将 small 最大值送入 large 保持顺序",
            "再平衡数量并从两堆顶读中位数"
          ],
          "trace": "输入：\n[\"MedianFinder\",\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"]\n[[],[1],[2],[],[3],[]]\n输出：\n[null,null,null,1.5,null,2.0]\n\n解释：\nMedianFinder mf = new MedianFinder();\nmf.addNum(1);\nmf.addNum(2);\nmf.findMedian();    // 返回 1.5\nmf.addNum(3);\nmf.findMedian();    // 返回 2.0\n\n手推时记录：small 中所有数不大于 large，且 small 大小等于 large 或多一个。\n\n边界检查：为什么只保持两堆大小相近还不够？\n若 small 中含大于 large 的值，两堆顶不代表排序后的中间边界；必须同时维持值的分区顺序与数量平衡。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么只保持两堆大小相近还不够？\n若 small 中含大于 large 的值，两堆顶不代表排序后的中间边界；必须同时维持值的分区顺序与数量平衡。",
          "complexity": "插入 O(log n)，取中位数 O(1)，存储 O(n)。",
          "prerequisites": [
            "06-dynamic"
          ],
          "related": [
            {
              "id": 155,
              "kind": "对比",
              "why": "155 随栈深度恢复历史最小值；295 数据只增加，用两个排名边界维护中位数，不能靠一个历史最小栈解决。"
            },
            {
              "id": 215,
              "kind": "递进",
              "why": "固定 k 可只保存一侧的 k 个边界；中位数排名随数据长度变，295 要用双堆同时维护两半。"
            },
            {
              "id": 4,
              "kind": "静态到动态",
              "why": "4 输入已排序，可直接二分两侧分割；295 数据持续进入，用两堆动态维护同样的左右分区条件。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么只保持两堆大小相近还不够？",
            "answer": "若 small 中含大于 large 的值，两堆顶不代表排序后的中间边界；必须同时维持值的分区顺序与数量平衡。"
          },
          "source": "02-Wiki/题目详解/295-数据流的中位数.md",
          "codeBlock": 0,
          "code": "from heapq import heappush, heappop\n\nclass MedianFinder:\n    def __init__(self):\n        self.small = []   # 大根堆（存负值），存较小的一半\n        self.large = []   # 小根堆，存较大的一半\n\n    def addNum(self, num: int) -> None:\n        # 第一步：先插入 small\n        heappush(self.small, -num)\n        # 第二步：将 small 的最大值移到 large（保证 small ≤ large）\n        heappush(self.large, -heappop(self.small))\n        # 第三步：平衡大小。如果 large 更多，移回 small\n        if len(self.large) > len(self.small):\n            heappush(self.small, -heappop(self.large))\n\n    def findMedian(self) -> float:\n        if len(self.small) > len(self.large):\n            return -self.small[0]                    # 奇数，small 堆顶\n        return (-self.small[0] + self.large[0]) / 2  # 偶数，两堆顶平均",
          "url": "https://leetcode.cn/problems/find-median-from-data-stream/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/295-%E6%95%B0%E6%8D%AE%E6%B5%81%E7%9A%84%E4%B8%AD%E4%BD%8D%E6%95%B0.md",
          "sourceHash": "6cca5a1f48afcd67b5dd7843afd4e588f03368201a3dae40ffd03c6c39039ef7"
        },
        {
          "uid": "lc-355",
          "id": 355,
          "group": "dynamic",
          "title": "设计推特",
          "level": "Medium",
          "prompt": "设计 Twitter：postTweet 发布消息，follow / unfollow 修改关注关系，getNewsFeed 返回自己与当前关注者的最新至多十条消息 ID，按新到旧排列。",
          "example": "Twitter twitter = new Twitter()\n\ntwitter.postTweet(1, 5)\ntwitter.getNewsFeed(1)    -> [5]\ntwitter.follow(1, 2)\ntwitter.postTweet(2, 6)\ntwitter.getNewsFeed(1)    -> [6, 5]\ntwitter.unfollow(1, 2)\ntwitter.getNewsFeed(1)    -> [5]",
          "hint": "先问自己：先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "recognition": "取自己与关注者的最新十条消息",
          "mnemonic": "每路只取最近十条，再用堆选全局最新。",
          "why": "取自己与关注者的最新十条消息。堆收集各相关用户最近至多十条消息的负时间戳，更旧消息不可能挤入全局前十。",
          "invariant": "堆收集各相关用户最近至多十条消息的负时间戳，更旧消息不可能挤入全局前十。",
          "steps": [
            "保存各用户时间线和关注集合",
            "收集自己与关注者每人最近十条消息入堆",
            "最多弹出十条，按新到旧返回"
          ],
          "trace": "Twitter twitter = new Twitter()\n\ntwitter.postTweet(1, 5)\ntwitter.getNewsFeed(1)    -> [5]\ntwitter.follow(1, 2)\ntwitter.postTweet(2, 6)\ntwitter.getNewsFeed(1)    -> [6, 5]\ntwitter.unfollow(1, 2)\ntwitter.getNewsFeed(1)    -> [5]\n\n手推时记录：堆收集各相关用户最近至多十条消息的负时间戳，更旧消息不可能挤入全局前十。\n\n边界检查：为什么每个用户只取最近十条就不会漏掉全局前十？\n某用户的第十一新消息前面，已经有同一用户的十条更新消息，因此不可能进入全局前十。候选有界，但每位相关用户仍要检查。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么每个用户只取最近十条就不会漏掉全局前十？\n某用户的第十一新消息前面，已经有同一用户的十条更新消息，因此不可能进入全局前十。候选有界，但每位相关用户仍要检查。",
          "complexity": "设 F 为相关用户、T 为总存储消息：取十条 O((F+1) log(F+1))，临时 O(F)，持久空间 O(T+关注关系数)。",
          "prerequisites": [
            "06-dynamic"
          ],
          "related": [
            {
              "id": 23,
              "kind": "同模板",
              "why": "两题都比较多路有序来源；23 每路只放当前表头并逐次补入，355 的此实现从每路取最近十条作有界候选，再选全局前十。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么每个用户只取最近十条就不会漏掉全局前十？",
            "answer": "某用户的第十一新消息前面，已经有同一用户的十条更新消息，因此不可能进入全局前十。候选有界，但每位相关用户仍要检查。"
          },
          "source": "02-Wiki/题目详解/355-设计推特.md",
          "codeBlock": 1,
          "code": "from collections import defaultdict\nimport heapq\n\n\nclass Twitter:\n\n    def __init__(self):\n        self.time = 0\n        self.tweets = defaultdict(list)\n        self.following = defaultdict(set)\n\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        self.time += 1\n        self.tweets[userId].append((self.time, tweetId))\n\n    def getNewsFeed(self, userId: int) -> list[int]:\n        heap = []\n        users = set(self.following[userId])\n        users.add(userId)\n\n        for user in users:\n            for time, tweet_id in self.tweets[user][-10:]:\n                heapq.heappush(heap, (-time, tweet_id))\n\n        feed = []\n        while heap and len(feed) < 10:\n            _, tweet_id = heapq.heappop(heap)\n            feed.append(tweet_id)\n\n        return feed\n\n    def follow(self, followerId: int, followeeId: int) -> None:\n        if followerId != followeeId:\n            self.following[followerId].add(followeeId)\n\n    def unfollow(self, followerId: int, followeeId: int) -> None:\n        self.following[followerId].discard(followeeId)",
          "url": "https://leetcode.cn/problems/design-twitter/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/355-%E8%AE%BE%E8%AE%A1%E6%8E%A8%E7%89%B9.md",
          "sourceHash": "ff7bada3be11871d3fa0b5575a24b761758a50dbc83371e9ac1f4758a94c0c7f"
        },
        {
          "uid": "lc-621",
          "id": 621,
          "group": "dynamic",
          "title": "任务调度器",
          "level": "Medium",
          "prompt": "每个任务执行花 1 个单位时间，可以任意重排或空闲。同一种任务的两次执行之间至少隔 n 个单位时间。求完成所有任务的最短总时间，任务名是大写英文字母。",
          "example": "输入：tasks=[\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n=2\n输出：8",
          "hint": "先问自己：先定义全局操作需要的边界：两半的中间、各路最新一条，或最高频任务的空隙。",
          "recognition": "相同任务之间有冷却间隔，任务顺序可重排，求最短总时长",
          "mnemonic": "最频任务搭骨架，其他任务填空。",
          "why": "最高频任务之间必须留出冷却间隔，形成时间下界；其他任务填入空位，若任务总量更大则无需额外空闲。",
          "invariant": "最频次 f 和具有该频次的任务种类 c 决定下界 (f−1)(n+1)+c。",
          "steps": [
            "统计最高频率及并列数量",
            "按最高频任务构造间隔下界",
            "答案取下界与任务总数的较大者"
          ],
          "trace": "tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2\n\nA 出现 3 次，B 出现 3 次\nmax_freq = 3\nmax_count = 2\n\nframe = (3 - 1) * (2 + 1) + 2 = 8\n\n一种安排：\nA B idle A B idle A B\n\n答案：8\n\n手推时记录：最频次 f 和具有该频次的任务种类 c 决定下界 (f−1)(n+1)+c。\n\n边界检查：为什么公式最后还必须与任务总数取 max？\n其他任务足够多时能填满所有冷却空位，甚至超出骨架长度，此时不需空闲时间，但执行所有任务仍至少花任务总数那么久。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么公式最后还必须与任务总数取 max？\n其他任务足够多时能填满所有冷却空位，甚至超出骨架长度，此时不需空闲时间，但执行所有任务仍至少花任务总数那么久。",
          "complexity": "固定 26 类任务：时间 O(N)，额外空间 O(1)。",
          "prerequisites": [
            "06-dynamic"
          ],
          "related": [
            {
              "id": 1046,
              "kind": "易混淆",
              "why": "1046 下一次选择依赖碰撞后动态重量；621 只求最短总时长，可用最大频次推导空位下界而不必逐时刻模拟。"
            },
            {
              "id": 309,
              "kind": "同词不同约束",
              "why": "都有冷却约束，但621可任意重排任务，只求最短总时长，由最大频次决定；309股价日期不能重排，买卖收益取决于当天状态，需要区分持有、刚卖出与休息。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么公式最后还必须与任务总数取 max？",
            "answer": "其他任务足够多时能填满所有冷却空位，甚至超出骨架长度，此时不需空闲时间，但执行所有任务仍至少花任务总数那么久。"
          },
          "source": "02-Wiki/题目详解/621-任务调度器.md",
          "codeBlock": 1,
          "code": "from typing import List\nfrom collections import Counter\n\n\nclass Solution:\n    def leastInterval(self, tasks: List[str], n: int) -> int:\n        count = Counter(tasks)\n\n        max_freq = max(count.values())\n        max_count = sum(1 for freq in count.values() if freq == max_freq)\n\n        frame = (max_freq - 1) * (n + 1) + max_count\n        return max(len(tasks), frame)",
          "url": "https://leetcode.cn/problems/task-scheduler/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/621-%E4%BB%BB%E5%8A%A1%E8%B0%83%E5%BA%A6%E5%99%A8.md",
          "sourceHash": "640235421935b854b797cbb5e5cb0b3873c3a53f0a4ec15846013f9dea07680f"
        }
      ]
    },
    {
      "id": "graphs-07",
      "number": "07",
      "title": "图论",
      "content": "decks/07-cards.json",
      "concepts": [
        {
          "id": "07-reach",
          "title": "连通性：一次访问圈出一个整体",
          "explanation": "访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "example": "200 数连通块，695 数块内格子；130 从边界找不能被围住的区域。"
        },
        {
          "id": "07-breadth",
          "title": "无权距离：同时从所有起点出发",
          "explanation": "边代价相同，队列按距离逐层推进；入队时标记可避免重复。",
          "example": "994 每层是一分钟；286 所有门同时出发；127 单词的一次修改是一条边。"
        },
        {
          "id": "07-dependency",
          "title": "有向依赖：消掉所有入度为零的点",
          "explanation": "只有前置条件全部满足才能进入结果；还剩未处理点就有环。",
          "example": "207 判断能否排完；210 输出顺序；269 先从词典推导字符依赖。"
        },
        {
          "id": "07-weighted",
          "title": "带权选择：路径代价如何合成",
          "explanation": "先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "example": "743 路径求和；778 路径取最高水位；787 限制边数；1584 连接整个图。"
        },
        {
          "id": "07-prefix",
          "title": "前缀共享：沿字符走一条路径",
          "explanation": "完整词结尾与前缀存在不同；通配符或棋盘相邻关系会让单一路径变成分支搜索。",
          "example": "208 沿字符查找；211 的点号遍历所有子节点；212 同时在棋盘与 Trie 上推进。"
        },
        {
          "id": "07-edges",
          "title": "使用每条边：何时把节点写入答案",
          "explanation": "遍历节点与消费边不是同一件事；欧拉路径要求每张票恰好用一次。",
          "example": "332 走到无票可用才加入结果，最后反转，避免过早固定一段行程。"
        }
      ],
      "source": "02-Wiki/专题总结/07-图论.md",
      "connectionRule": "先辨认图上的任务：找连通块、求传播距离、排依赖顺序、优化带权路径，还是消费所有边。Trie 则把字符串前缀变成共享路径。",
      "groups": [
        {
          "id": "reach",
          "title": "连通性：一次访问圈出一个整体",
          "description": "访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "example": "200 数连通块，695 数块内格子；130 从边界找不能被围住的区域。"
        },
        {
          "id": "breadth",
          "title": "无权距离：同时从所有起点出发",
          "description": "边代价相同，队列按距离逐层推进；入队时标记可避免重复。",
          "example": "994 每层是一分钟；286 所有门同时出发；127 单词的一次修改是一条边。"
        },
        {
          "id": "dependency",
          "title": "有向依赖：消掉所有入度为零的点",
          "description": "只有前置条件全部满足才能进入结果；还剩未处理点就有环。",
          "example": "207 判断能否排完；210 输出顺序；269 先从词典推导字符依赖。"
        },
        {
          "id": "weighted",
          "title": "带权选择：路径代价如何合成",
          "description": "先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "example": "743 路径求和；778 路径取最高水位；787 限制边数；1584 连接整个图。"
        },
        {
          "id": "prefix",
          "title": "前缀共享：沿字符走一条路径",
          "description": "完整词结尾与前缀存在不同；通配符或棋盘相邻关系会让单一路径变成分支搜索。",
          "example": "208 沿字符查找；211 的点号遍历所有子节点；212 同时在棋盘与 Trie 上推进。"
        },
        {
          "id": "edges",
          "title": "使用每条边：何时把节点写入答案",
          "description": "遍历节点与消费边不是同一件事；欧拉路径要求每张票恰好用一次。",
          "example": "332 走到无票可用才加入结果，最后反转，避免过早固定一段行程。"
        }
      ],
      "firstProblems": [
        200,
        323,
        207
      ],
      "cards": [
        {
          "uid": "lc-200",
          "id": 200,
          "group": "reach",
          "title": "岛屿数量",
          "level": "Medium",
          "prompt": "给你一个由 '1'（陆地）和 '0'（水）组成的二维网格，请你计算网格中岛屿的数量。\n\n岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。\n\n此外，你可以假设该网格的四条边均被水包围。",
          "example": "输入：grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]\n输出：1",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "网格求岛屿个数",
          "mnemonic": "遇到新陆地，计一次并淹掉整片。",
          "why": "网格求岛屿个数。已沉掉的格子不会再贡献新岛屿，每次外层计数恰好对应一个新连通块。",
          "invariant": "已沉掉的格子不会再贡献新岛屿，每次外层计数恰好对应一个新连通块。",
          "steps": [
            "扫描所有格子",
            "遇 1 增加岛数",
            "DFS 把相连陆地全部改为 0"
          ],
          "trace": "输入：grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]\n输出：1\n\n手推时记录：已沉掉的格子不会再贡献新岛屿，每次外层计数恰好对应一个新连通块。\n\n边界检查：为什么必须先标记再递归邻居？\n先标记能阻止相邻格子互相递归回来；否则两个相邻陆地也可能无限循环。此实现会修改输入。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么必须先标记再递归邻居？\n先标记能阻止相邻格子互相递归回来；否则两个相邻陆地也可能无限循环。此实现会修改输入。",
          "complexity": "时间 O(mn)，最坏递归栈 O(mn)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 695,
              "kind": "输出变化",
              "why": "同一次连通块遍历：200 每次启动搜索加一；695 还要把块内每个格子的贡献相加并求最大。"
            },
            {
              "id": 323,
              "kind": "表示变化",
              "why": "200 的邻居由上下左右坐标生成；323 从邻接表读取邻居，并且必须包括没有边的孤立点。"
            },
            {
              "id": 130,
              "kind": "起点变化",
              "why": "200 扫所有陆地找全部区域；130 只从边界出发，先识别不该被翻转的区域。"
            },
            {
              "id": 133,
              "kind": "访问状态用途",
              "why": "200 标记只为避免重复访问；133 还必须把每个原节点映射到可重复引用的副本，保存共享和环。"
            },
            {
              "id": 79,
              "kind": "易混淆",
              "why": "200 的访问属于整次连通性任务，无需恢复；79 的访问属于当前拼词路径，退出必须恢复。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么必须先标记再递归邻居？",
            "answer": "先标记能阻止相邻格子互相递归回来；否则两个相邻陆地也可能无限循环。此实现会修改输入。"
          },
          "source": "02-Wiki/题目详解/200-岛屿数量.md",
          "codeBlock": 0,
          "code": "def numIslands(grid):\n    if not grid:\n        return 0\n    m, n = len(grid), len(grid[0])\n\n    def dfs(i, j):\n        # 超出边界 或 当前是水/已访问\n        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':\n            return\n        grid[i][j] = '0'              # 沉岛：标记为已访问\n        dfs(i + 1, j)                 # 下\n        dfs(i - 1, j)                 # 上\n        dfs(i, j + 1)                 # 右\n        dfs(i, j - 1)                 # 左\n\n    count = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == '1':     # 发现新岛屿\n                count += 1\n                dfs(i, j)             # 沉掉整座岛\n    return count",
          "url": "https://leetcode.cn/problems/number-of-islands/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/200-%E5%B2%9B%E5%B1%BF%E6%95%B0%E9%87%8F.md",
          "sourceHash": "ece1e8d6f4e51a425f9652007fdc731ceb0185aeea0a998c54ee0ceafca2f201"
        },
        {
          "uid": "lc-323",
          "id": 323,
          "group": "reach",
          "title": "无向图中连通分量的数目",
          "level": "Medium",
          "prompt": "n 个节点编号 0…n−1，edges 给出无向边。返回连通分量个数；没有边的孤立点也算一个分量。",
          "example": "n=5，边 [[0,1],[1,2],[3,4]] 有两个分量。",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "无向图求连通分量",
          "mnemonic": "每个未访问起点开一次完整遍历。",
          "why": "无向图求连通分量。每次外层计数会把一个尚未访问的完整连通块加入 seen。",
          "invariant": "每次外层计数会把一个尚未访问的完整连通块加入 seen。",
          "steps": [
            "建双向邻接表",
            "枚举包括孤立点在内的全部节点",
            "每遇未访问点计数并遍历"
          ],
          "trace": "n=5，边 [[0,1],[1,2],[3,4]] 有两个分量。\n\n手推时记录：每次外层计数会把一个尚未访问的完整连通块加入 seen。\n\n边界检查：为什么不能只遍历邻接表里出现的键？\n没有边的孤立节点也各自是一个连通分量，必须枚举 0 到 n−1 的全部节点。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能只遍历邻接表里出现的键？\n没有边的孤立节点也各自是一个连通分量，必须枚举 0 到 n−1 的全部节点。",
          "complexity": "时间和空间 O(V+E)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 200,
              "kind": "表示变化",
              "why": "200 的邻居由上下左右坐标生成；323 从邻接表读取邻居，并且必须包括没有边的孤立点。"
            },
            {
              "id": 261,
              "kind": "增加约束",
              "why": "连通分量数为一只保证连通；261 还要求边数 n−1，才能排除环。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能只遍历邻接表里出现的键？",
            "answer": "没有边的孤立节点也各自是一个连通分量，必须枚举 0 到 n−1 的全部节点。"
          },
          "source": "02-Wiki/题目详解/323-无向图中连通分量的数目.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\nfrom typing import List\n\n\nclass Solution:\n    def countComponents(self, n: int, edges: List[List[int]]) -> int:\n        graph = defaultdict(list)\n        for a, b in edges:\n            graph[a].append(b); graph[b].append(a)\n        seen, components = set(), 0\n        for start in range(n):\n            if start in seen:\n                continue\n            components += 1\n            stack = [start]\n            seen.add(start)\n            while stack:\n                node = stack.pop()\n                for neighbor in graph[node]:\n                    if neighbor not in seen:\n                        seen.add(neighbor); stack.append(neighbor)\n        return components",
          "url": "https://leetcode.ca/all/323.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/323-%E6%97%A0%E5%90%91%E5%9B%BE%E4%B8%AD%E8%BF%9E%E9%80%9A%E5%88%86%E9%87%8F%E7%9A%84%E6%95%B0%E7%9B%AE.md",
          "sourceHash": "9e540eeb368ae1a2f8a668469f31a78802495973919b875aee57823db0dc6b33"
        },
        {
          "uid": "lc-207",
          "id": 207,
          "group": "dependency",
          "title": "课程表",
          "level": "Medium",
          "prompt": "你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1。\n\n在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [a_i, b_i]，表示如果要学习课程 a_i 则 必须 先学习课程 b_i。\n\n例如，先修课程对 [0, 1] 表示：想要学习课程 0，你需要先完成课程 1。\n\n请你判断是否可能完成所有课程的学习？如果可以，返回 true；否则返回 false。",
          "example": "输入：numCourses=2, prerequisites=[[1,0]]\n输出：True",
          "hint": "先问自己：只有前置条件全部满足才能进入结果；还剩未处理点就有环。",
          "recognition": "前置课程形成依赖，判断能否学完",
          "mnemonic": "入度归零才入队。",
          "why": "前置课程形成依赖，判断能否学完。indegree 表示尚未完成的前置边数，队列中课程没有剩余前置条件。",
          "invariant": "indegree 表示尚未完成的前置边数，队列中课程没有剩余前置条件。",
          "steps": [
            "按 前置→课程 建图并统计入度",
            "处理所有零入度节点",
            "处理数等于课程数才成功"
          ],
          "trace": "输入：numCourses = 2, prerequisites = 1,0\n输出：true\n解释：总共有 2 门课程。学习课程 1 之前需要先完成课程 0。这是可能的。\n\n手推时记录：indegree 表示尚未完成的前置边数，队列中课程没有剩余前置条件。\n\n边界检查：为什么有课程没被处理就说明有环？\n剩余节点每个都有剩余前驱，沿前驱不断回溯会重复节点，因此存在循环依赖。孤立课程入度为零也应入队。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么有课程没被处理就说明有环？\n剩余节点每个都有剩余前驱，沿前驱不断回溯会重复节点，因此存在循环依赖。孤立课程入度为零也应入队。",
          "complexity": "时间与空间 O(V+E)。",
          "prerequisites": [
            "07-dependency"
          ],
          "related": [
            {
              "id": 210,
              "kind": "输出变化",
              "why": "Kahn 队列过程相同：207 只比较处理数量，210 保存出队顺序作为结果。"
            },
            {
              "id": 332,
              "kind": "易混淆",
              "why": "207 要排节点的依赖顺序，有向环使任务失败；332 要用完每条票边，允许环，依靠后序拼接欧拉行程。"
            },
            {
              "id": 329,
              "kind": "隐含无环图",
              "why": "329 只从低值连到高值，天然构成 DAG，可缓存DFS；207 则必须先检查给定依赖能否形成无环顺序。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么有课程没被处理就说明有环？",
            "answer": "剩余节点每个都有剩余前驱，沿前驱不断回溯会重复节点，因此存在循环依赖。孤立课程入度为零也应入队。"
          },
          "source": "02-Wiki/题目详解/207-课程表.md",
          "codeBlock": 0,
          "code": "from collections import deque\n\ndef canFinish(numCourses, prerequisites):\n    # 1. 建图 + 统计入度\n    graph = [[] for _ in range(numCourses)]\n    indegree = [0] * numCourses\n    for course, pre in prerequisites:\n        graph[pre].append(course)\n        indegree[course] += 1\n\n    # 2. 入度为 0 的课程入队（可以学的课）\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    count = 0  # 已学课程数\n\n    # 3. BFS\n    while q:\n        node = q.popleft()\n        count += 1\n        for neighbor in graph[node]:\n            indegree[neighbor] -= 1\n            if indegree[neighbor] == 0:\n                q.append(neighbor)\n\n    # 4. 判断是否学完了所有课程\n    return count == numCourses",
          "url": "https://leetcode.cn/problems/course-schedule/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/207-%E8%AF%BE%E7%A8%8B%E8%A1%A8.md",
          "sourceHash": "21f56388d080637d3ada50a86d9ef5cd2ee598af431b9967303b4bf9a6e68e5a"
        },
        {
          "uid": "lc-695",
          "id": 695,
          "group": "reach",
          "title": "岛屿的最大面积",
          "level": "Medium",
          "prompt": "grid 为非空 0/1 矩阵；陆地只能通过上下左右相连。返回最大岛屿的格子数，没有陆地时返回 0。",
          "example": "输入：grid=[[1,1,0],[0,1,0],[1,0,1]]\n输出：3",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "求最大岛屿面积",
          "mnemonic": "一格贡献一，四邻面积相加。",
          "why": "求最大岛屿面积。dfs 返回当前未访问连通区域的面积，访问过的格子被改为 0，不会重复计数。",
          "invariant": "dfs 返回当前未访问连通区域的面积，访问过的格子被改为 0，不会重复计数。",
          "steps": [
            "扫描每个格子",
            "DFS 标记并返回 1 加四邻面积",
            "保留最大值"
          ],
          "trace": "一块相连的 1 有 6 格，答案为 6。\n\n手推时记录：dfs 返回当前未访问连通区域的面积，访问过的格子被改为 0，不会重复计数。\n\n边界检查：水格或已访问格为什么返回 0，而不是 1？\n面积只统计尚未访问的陆地，边界、水和重复访问都不能贡献面积。",
          "traceLabel": "例子与边界推演",
          "trap": "水格或已访问格为什么返回 0，而不是 1？\n面积只统计尚未访问的陆地，边界、水和重复访问都不能贡献面积。",
          "complexity": "时间 O(mn)，最坏递归栈 O(mn)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 200,
              "kind": "输出变化",
              "why": "同一次连通块遍历：200 每次启动搜索加一；695 还要把块内每个格子的贡献相加并求最大。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "水格或已访问格为什么返回 0，而不是 1？",
            "answer": "面积只统计尚未访问的陆地，边界、水和重复访问都不能贡献面积。"
          },
          "source": "02-Wiki/题目详解/695-岛屿的最大面积.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:\n        rows, cols = len(grid), len(grid[0])\n        def dfs(r: int, c: int) -> int:\n            if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] == 0:\n                return 0\n            grid[r][c] = 0\n            return 1 + sum(dfs(r + dr, c + dc) for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)))\n        return max((dfs(r, c) for r in range(rows) for c in range(cols)), default=0)",
          "url": "https://leetcode.cn/problems/max-area-of-island/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/695-%E5%B2%9B%E5%B1%BF%E7%9A%84%E6%9C%80%E5%A4%A7%E9%9D%A2%E7%A7%AF.md",
          "sourceHash": "361c2e9ee9094fa30db01c7f6d3a375401829c95833aed2eb3fa63a6c8d1828d"
        },
        {
          "uid": "lc-130",
          "id": 130,
          "group": "reach",
          "title": "被围绕的区域",
          "level": "Medium",
          "prompt": "board 由 X 和 O 组成。把完全被 X 围住的 O 区域原地翻成 X；通过上下左右的 O 路径连到任一边界的区域保留。",
          "example": "输入：board=[\"XXXX\",\"XOOX\",\"XXOX\",\"XOXX\"]（每行是字符列表）\n输出：[\"XXXX\",\"XXXX\",\"XXXX\",\"XOXX\"]",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "只保留连到边界的 O",
          "mnemonic": "先救边界，再翻内部。",
          "why": "只保留连到边界的 O。标记 S 的恰好是已找到的边界连通 O，最终必须保留。",
          "invariant": "标记 S 的恰好是已找到的边界连通 O，最终必须保留。",
          "steps": [
            "从四边所有 O 搜索并标 S",
            "未救到的 O 变 X",
            "把 S 恢复为 O"
          ],
          "trace": "边界相连的 O 保留；完全被 X 包围的 O 全部翻转。\n\n手推时记录：标记 S 的恰好是已找到的边界连通 O，最终必须保留。\n\n边界检查：为什么从边界反向找，比逐块判断包围更直接？\n能逃出棋盘当且仅当通过 O 连到边界；找出这个补集后，剩余 O 就都被包围。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么从边界反向找，比逐块判断包围更直接？\n能逃出棋盘当且仅当通过 O 连到边界；找出这个补集后，剩余 O 就都被包围。",
          "complexity": "时间 O(mn)，最坏递归栈 O(mn)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 200,
              "kind": "起点变化",
              "why": "200 扫所有陆地找全部区域；130 只从边界出发，先识别不该被翻转的区域。"
            },
            {
              "id": 417,
              "kind": "反向思考",
              "why": "都从目标边界往回找可达区域；130 沿 O 走，417 还要反转水流高度条件，并取两次搜索的交集。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么从边界反向找，比逐块判断包围更直接？",
            "answer": "能逃出棋盘当且仅当通过 O 连到边界；找出这个补集后，剩余 O 就都被包围。"
          },
          "source": "02-Wiki/题目详解/130-被围绕的区域.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def solve(self, board: List[List[str]]) -> None:\n        rows, cols = len(board), len(board[0])\n        def dfs(r, c):\n            if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != \"O\":\n                return\n            board[r][c] = \"S\"\n            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n                dfs(r + dr, c + dc)\n        for r in range(rows):\n            dfs(r, 0); dfs(r, cols - 1)\n        for c in range(cols):\n            dfs(0, c); dfs(rows - 1, c)\n        for r in range(rows):\n            for c in range(cols):\n                board[r][c] = \"O\" if board[r][c] == \"S\" else \"X\"",
          "url": "https://leetcode.cn/problems/surrounded-regions/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/130-%E8%A2%AB%E5%9B%B4%E7%BB%95%E7%9A%84%E5%8C%BA%E5%9F%9F.md",
          "sourceHash": "960fe6a15e4374fdf25ba676ab5288d405e9d6b831c1574f87b2cb9902d22a9f"
        },
        {
          "uid": "lc-417",
          "id": 417,
          "group": "reach",
          "title": "太平洋大西洋水流问题",
          "level": "Medium",
          "prompt": "heights 给出每格高度。水可向上下左右不高于自身的格子流动；上边和左边邻太平洋，下边和右边邻大西洋。返回水能流到两个海洋的所有格子坐标。",
          "example": "输入：heights=[[1,2],[4,3]]\n输出：[[0,1],[1,0],[1,1]]（顺序任意）",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "找同时流向两洋的位置",
          "mnemonic": "从海岸逆流爬高，最后取交集。",
          "why": "找同时流向两洋的位置。从某海岸逆向到达的格子，都能沿不增高度的正向路径流回该海洋。",
          "invariant": "从某海岸逆向到达的格子，都能沿不增高度的正向路径流回该海洋。",
          "steps": [
            "两个集合分别从两洋边界出发",
            "只走高度不低于当前位置的邻格",
            "取两集合交集"
          ],
          "trace": "同时能反向到达两侧边界的格子才输出。\n\n手推时记录：从某海岸逆向到达的格子，都能沿不增高度的正向路径流回该海洋。\n\n边界检查：逆向搜索为何允许走相等或更高的格子？\n正向水流只能走相等或更低处；反向沿同一条边走时，不等号必须反过来。相等高度也能通行。",
          "traceLabel": "例子与边界推演",
          "trap": "逆向搜索为何允许走相等或更高的格子？\n正向水流只能走相等或更低处；反向沿同一条边走时，不等号必须反过来。相等高度也能通行。",
          "complexity": "时间 O(mn)，访问集合及递归栈 O(mn)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 130,
              "kind": "反向思考",
              "why": "都从目标边界往回找可达区域；130 沿 O 走，417 还要反转水流高度条件，并取两次搜索的交集。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "逆向搜索为何允许走相等或更高的格子？",
            "answer": "正向水流只能走相等或更低处；反向沿同一条边走时，不等号必须反过来。相等高度也能通行。"
          },
          "source": "02-Wiki/题目详解/417-太平洋大西洋水流问题.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        rows, cols = len(heights), len(heights[0])\n        pacific, atlantic = set(), set()\n        def dfs(r, c, seen):\n            seen.add((r, c))\n            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in seen and heights[nr][nc] >= heights[r][c]:\n                    dfs(nr, nc, seen)\n        for r in range(rows):\n            dfs(r, 0, pacific); dfs(r, cols - 1, atlantic)\n        for c in range(cols):\n            dfs(0, c, pacific); dfs(rows - 1, c, atlantic)\n        return [[r, c] for r in range(rows) for c in range(cols) if (r, c) in pacific and (r, c) in atlantic]",
          "url": "https://leetcode.cn/problems/pacific-atlantic-water-flow/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/417-%E5%A4%AA%E5%B9%B3%E6%B4%8B%E5%A4%A7%E8%A5%BF%E6%B4%8B%E6%B0%B4%E6%B5%81%E9%97%AE%E9%A2%98.md",
          "sourceHash": "b10ece93bcb9e1f1e8176354e2b0e90e7216d08c5e430a30a506961378e50e5c"
        },
        {
          "uid": "lc-133",
          "id": 133,
          "group": "reach",
          "title": "克隆图",
          "level": "Medium",
          "prompt": "给定无向连通图中的一个节点，节点有 val 和 neighbors。深拷贝整个图，返回对应的新节点；新图关系相同，所有节点对象必须全新。输入也可能为空。",
          "example": "1 与 2 互相相连时，克隆后新 1、新 2 也互连，但都不是原对象。",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "复制带环图且保留节点关系",
          "mnemonic": "先建副本入表，再复制邻居。",
          "why": "复制带环图且保留节点关系。copies 将每个原节点身份映射到唯一副本，递归遇到旧节点直接复用副本。",
          "invariant": "copies 将每个原节点身份映射到唯一副本，递归遇到旧节点直接复用副本。",
          "steps": [
            "空节点返回空",
            "首次见到节点先创建并登记副本",
            "递归填入副本邻接表"
          ],
          "trace": "1 与 2 互相相连时，克隆后新 1、新 2 也互连，但都不是原对象。\n\n手推时记录：copies 将每个原节点身份映射到唯一副本，递归遇到旧节点直接复用副本。\n\n边界检查：为什么登记副本必须早于递归邻居？\n图可能有环。先登记可在递归回到原节点时直接返回已有副本，同时保留共享邻居的身份。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么登记副本必须早于递归邻居？\n图可能有环。先登记可在递归回到原节点时直接返回已有副本，同时保留共享邻居的身份。",
          "complexity": "时间与输出空间 O(V+E)，映射和递归栈 O(V)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 138,
              "kind": "结构变化",
              "why": "都需要原节点到副本的对应关系；138 可借 next 暂存映射，图克隆 133 通常用独立哈希表并先登记防环。"
            },
            {
              "id": 200,
              "kind": "访问状态用途",
              "why": "200 标记只为避免重复访问；133 还必须把每个原节点映射到可重复引用的副本，保存共享和环。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么登记副本必须早于递归邻居？",
            "answer": "图可能有环。先登记可在递归回到原节点时直接返回已有副本，同时保留共享邻居的身份。"
          },
          "source": "02-Wiki/题目详解/133-克隆图.md",
          "codeBlock": 0,
          "codeNote": "节点结构沿用 LeetCode 题目提供的定义；本地运行时需要准备相应的节点类和输入。",
          "code": "class Solution:\n    def cloneGraph(self, node: 'Node | None') -> 'Node | None':\n        if not node:\n            return None\n        copies = {}\n        def dfs(current):\n            if current in copies:\n                return copies[current]\n            copy = Node(current.val)\n            copies[current] = copy\n            copy.neighbors = [dfs(neighbor) for neighbor in current.neighbors]\n            return copy\n        return dfs(node)",
          "url": "https://leetcode.cn/problems/clone-graph/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/133-%E5%85%8B%E9%9A%86%E5%9B%BE.md",
          "sourceHash": "f5376b7e782831b66035e4bae61f4d0237393e03f19efb4f2174b546f6f65a8b"
        },
        {
          "uid": "lc-261",
          "id": 261,
          "group": "reach",
          "title": "以图判树",
          "level": "Medium",
          "prompt": "n≥1 个节点编号 0…n−1，edges 给出无向边。判断整图是否连通且无环，即是否为一棵树。",
          "example": "输入：n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\n输出：True",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "判断无向图是否为树",
          "mnemonic": "边数 n−1，再确认全连通。",
          "why": "判断无向图是否为树。在 n≥1 的无向图中，连通且恰有 n−1 条边等价于树。",
          "invariant": "在 n≥1 的无向图中，连通且恰有 n−1 条边等价于树。",
          "steps": [
            "边数不为 n−1 就失败",
            "从 0 遍历",
            "确认访问节点数等于 n"
          ],
          "trace": "n=5，4 条边且全部节点连通，返回 True。\n\n手推时记录：在 n≥1 的无向图中，连通且恰有 n−1 条边等价于树。\n\n边界检查：只检查边数 n−1 为什么不够？\n可能一部分节点形成环，另一部分节点孤立；边数符合但图不连通。连通性与边数必须同时成立。",
          "traceLabel": "例子与边界推演",
          "trap": "只检查边数 n−1 为什么不够？\n可能一部分节点形成环，另一部分节点孤立；边数符合但图不连通。连通性与边数必须同时成立。",
          "complexity": "时间与空间 O(V+E)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 323,
              "kind": "增加约束",
              "why": "连通分量数为一只保证连通；261 还要求边数 n−1，才能排除环。"
            },
            {
              "id": 684,
              "kind": "静态到增量",
              "why": "261 检查整图是否为树；684 按边到达顺序合并连通块，首次同根连边就是冗余边。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "只检查边数 n−1 为什么不够？",
            "answer": "可能一部分节点形成环，另一部分节点孤立；边数符合但图不连通。连通性与边数必须同时成立。"
          },
          "source": "02-Wiki/题目详解/261-以图判树.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\nfrom typing import List\n\n\nclass Solution:\n    def validTree(self, n: int, edges: List[List[int]]) -> bool:\n        if len(edges) != n - 1:\n            return False\n        graph = defaultdict(list)\n        for a, b in edges:\n            graph[a].append(b); graph[b].append(a)\n        seen, stack = {0}, [0]\n        while stack:\n            node = stack.pop()\n            for neighbor in graph[node]:\n                if neighbor not in seen:\n                    seen.add(neighbor); stack.append(neighbor)\n        return len(seen) == n",
          "url": "https://leetcode.ca/all/261.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/261-%E4%BB%A5%E5%9B%BE%E5%88%A4%E6%A0%91.md",
          "sourceHash": "1da32b8dc646b082b01dd687ed86ee08c3fd10f9799e31c5d7f66ed272855c35"
        },
        {
          "uid": "lc-684",
          "id": 684,
          "group": "reach",
          "title": "冗余连接",
          "level": "Medium",
          "prompt": "节点编号 1…n 的无向树多加入了一条边。返回一条可删去以恢复树的边；若有多个选择，返回输入中位置最后的那条。",
          "example": "输入：edges=[[1,2],[1,3],[2,3]]\n输出：[2,3]",
          "hint": "先问自己：访问标记属于整个搜索；网格只是邻居由坐标规则生成的图。",
          "recognition": "一条新边使树成环",
          "mnemonic": "两端已同根，这条边多余。",
          "why": "一条新边使树成环。并查集在处理当前边前，表示之前所有边形成的连通分量。",
          "invariant": "并查集在处理当前边前，表示之前所有边形成的连通分量。",
          "steps": [
            "初始化各节点为自己的根",
            "找每条边两端的根",
            "同根返回，否则合并"
          ],
          "trace": "[[1,2],[1,3],[2,3]] 中加入 [2,3] 时两端已连通，返回它。\n\n手推时记录：并查集在处理当前边前，表示之前所有边形成的连通分量。\n\n边界检查：为什么同根表示加这条边会成环？\n两端之间已有一条路径，再加一条连接它们的边就闭合成环。比较节点值本身不能判断连通。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么同根表示加这条边会成环？\n两端之间已有一条路径，再加一条连接它们的边就闭合成环。比较节点值本身不能判断连通。",
          "complexity": "此代码路径压缩但不按秩合并：保守时间 O(E log V)，空间 O(V)。",
          "prerequisites": [
            "07-reach"
          ],
          "related": [
            {
              "id": 261,
              "kind": "静态到增量",
              "why": "261 检查整图是否为树；684 按边到达顺序合并连通块，首次同根连边就是冗余边。"
            },
            {
              "id": 1584,
              "kind": "另一条路线",
              "why": "684 的并查集可判断加边是否成环；若把1584所有边排序，也能用这个判定构造 Kruskal 最小生成树。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么同根表示加这条边会成环？",
            "answer": "两端之间已有一条路径，再加一条连接它们的边就闭合成环。比较节点值本身不能判断连通。"
          },
          "source": "02-Wiki/题目详解/684-冗余连接.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:\n        parent = list(range(len(edges) + 1))\n        def find(x):\n            while x != parent[x]:\n                parent[x] = parent[parent[x]]\n                x = parent[x]\n            return x\n        for a, b in edges:\n            root_a, root_b = find(a), find(b)\n            if root_a == root_b:\n                return [a, b]\n            parent[root_a] = root_b\n        return []",
          "url": "https://leetcode.cn/problems/redundant-connection/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/684-%E5%86%97%E4%BD%99%E8%BF%9E%E6%8E%A5.md",
          "sourceHash": "fbf3e0a491f106aa66a71c51fb8af502827fa52bf8073374aebf566f17937e45"
        },
        {
          "uid": "lc-994",
          "id": 994,
          "group": "breadth",
          "title": "腐烂的橘子",
          "level": "Medium",
          "prompt": "给定一个 m x n 的网格，每个单元格可以有以下三个值之一：\n值 0 代表空单元格；\n值 1 代表新鲜橘子；\n值 2 代表腐烂的橘子。\n\n每分钟，腐烂的橘子会 上、下、左、右 四个方向传播腐烂，将相邻的新鲜橘子变成腐烂橘子。\n\n返回直到网格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能全部腐烂，返回 -1。",
          "example": "输入：grid = [[2,1,1],[1,1,0],[0,1,1]]\n输出：4",
          "hint": "先问自己：边代价相同，队列按距离逐层推进；入队时标记可避免重复。",
          "recognition": "多处同时腐烂，求全部传播时间",
          "mnemonic": "所有源一起入队，一层一分钟。",
          "why": "多处同时腐烂，求全部传播时间。每层队列保存同一分钟已腐烂的橘子，新腐烂的橘子只能在下一层传播。",
          "invariant": "每层队列保存同一分钟已腐烂的橘子，新腐烂的橘子只能在下一层传播。",
          "steps": [
            "统计 fresh 并把全部腐烂橘子入队",
            "按固定层大小扩散",
            "无鲜果返回分钟数，否则返回 −1"
          ],
          "trace": "输入：grid = [[2,1,1],[1,1,0],[0,1,1]]\n输出：4\n\n手推时记录：每层队列保存同一分钟已腐烂的橘子，新腐烂的橘子只能在下一层传播。\n\n边界检查：为什么本轮新入队的橘子不能马上继续传播？\n那会让多跳传播发生在同一分钟。固定本层大小，才能让每经过一条边恰好增加一分钟。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么本轮新入队的橘子不能马上继续传播？\n那会让多跳传播发生在同一分钟。固定本层大小，才能让每经过一条边恰好增加一分钟。",
          "complexity": "时间 O(mn)，队列空间 O(mn)。",
          "prerequisites": [
            "07-breadth"
          ],
          "related": [
            {
              "id": 286,
              "kind": "同模板",
              "why": "都将所有源同时入队；994 取最晚被感染的时间，286 为每个房间写下第一次到达的距离。"
            },
            {
              "id": 127,
              "kind": "图的建模",
              "why": "都求无权最短传播层数；994 邻居是相邻格，127 邻居是词表中只差一个字符的词，且答案统计单词数。"
            },
            {
              "id": 743,
              "kind": "权重变化",
              "why": "相同边成本可用 FIFO 队列分层；不同非负边权要用小堆按累计距离确认节点。"
            },
            {
              "id": 45,
              "kind": "层的压缩",
              "why": "都按最短步数逐层扩展；45 的可达位置形成连续范围，可把显式BFS队列压成两个边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么本轮新入队的橘子不能马上继续传播？",
            "answer": "那会让多跳传播发生在同一分钟。固定本层大小，才能让每经过一条边恰好增加一分钟。"
          },
          "source": "02-Wiki/题目详解/994-腐烂的橘子.md",
          "codeBlock": 0,
          "code": "from collections import deque\n\ndef orangesRotting(grid):\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n\n    # 1. 统计新鲜橘子，腐烂橘子入队\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == 2:\n                q.append((i, j))\n            elif grid[i][j] == 1:\n                fresh += 1\n\n    if fresh == 0:\n        return 0\n\n    minutes = 0\n    dirs = [(1,0), (-1,0), (0,1), (0,-1)]\n\n    # 2. BFS 层序遍历\n    while q and fresh > 0:\n        minutes += 1\n        for _ in range(len(q)):      # 关键：按层处理\n            i, j = q.popleft()\n            for di, dj in dirs:\n                ni, nj = i + di, j + dj\n                if 0 <= ni < m and 0 <= nj < n and grid[ni][nj] == 1:\n                    fresh -= 1\n                    grid[ni][nj] = 2   # 腐烂\n                    q.append((ni, nj))\n\n    return minutes if fresh == 0 else -1",
          "url": "https://leetcode.cn/problems/rotting-oranges/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/994-%E8%85%90%E7%83%82%E7%9A%84%E6%A9%98%E5%AD%90.md",
          "sourceHash": "9f830206094833768df811f2419ff267babc86d8d5c90a1aec1eeabea22db764"
        },
        {
          "uid": "lc-286",
          "id": 286,
          "group": "breadth",
          "title": "墙与门",
          "level": "Medium",
          "prompt": "非空 rooms 矩阵中 −1 是墙，0 是门，2147483647 是空房。只能上下左右移动。原地填写每个空房到最近门的最短步数；不可达的空房保持 INF。",
          "example": "输入：rooms=[[0,2147483647,-1],[2147483647,2147483647,2147483647]]\n输出：[[0,1,-1],[1,2,3]]",
          "hint": "先问自己：边代价相同，队列按距离逐层推进；入队时标记可避免重复。",
          "recognition": "每个空房间到最近门的距离",
          "mnemonic": "所有门一起出发，首次到达就定距。",
          "why": "每个空房间到最近门的距离。队列按距最近门的距离递增，未填充房间第一次入队时得到最短距离。",
          "invariant": "队列按距最近门的距离递增，未填充房间第一次入队时得到最短距离。",
          "steps": [
            "将所有门入队",
            "只访问 INF 空房间",
            "写入当前距离加一并入队"
          ],
          "trace": "多个门同时向外扩散，空房首先被哪个门访问就取哪个距离。\n\n手推时记录：队列按距最近门的距离递增，未填充房间第一次入队时得到最短距离。\n\n边界检查：为什么不用从每个房间分别找门？\n多源 BFS 把所有最近源问题合并为一次遍历，每个空房间仅首次发现时入队，无需重复搜索。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不用从每个房间分别找门？\n多源 BFS 把所有最近源问题合并为一次遍历，每个空房间仅首次发现时入队，无需重复搜索。",
          "complexity": "时间和队列空间 O(mn)。",
          "prerequisites": [
            "07-breadth"
          ],
          "related": [
            {
              "id": 994,
              "kind": "同模板",
              "why": "都将所有源同时入队；994 取最晚被感染的时间，286 为每个房间写下第一次到达的距离。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不用从每个房间分别找门？",
            "answer": "多源 BFS 把所有最近源问题合并为一次遍历，每个空房间仅首次发现时入队，无需重复搜索。"
          },
          "source": "02-Wiki/题目详解/286-墙与门.md",
          "codeBlock": 0,
          "code": "from collections import deque\nfrom typing import List\n\n\nclass Solution:\n    def wallsAndGates(self, rooms: List[List[int]]) -> None:\n        rows, cols, queue = len(rooms), len(rooms[0]), deque()\n        for r in range(rows):\n            for c in range(cols):\n                if rooms[r][c] == 0:\n                    queue.append((r, c))\n        while queue:\n            r, c = queue.popleft()\n            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == 2147483647:\n                    rooms[nr][nc] = rooms[r][c] + 1\n                    queue.append((nr, nc))",
          "url": "https://leetcode.ca/all/286.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/286-%E5%A2%99%E4%B8%8E%E9%97%A8.md",
          "sourceHash": "f1a602d4372d98fc15bd27d45fb8bc4e0c055c651e6229e28cca59ebbd16d57f"
        },
        {
          "uid": "lc-127",
          "id": 127,
          "group": "breadth",
          "title": "单词接龙",
          "level": "Hard",
          "prompt": "beginWord、endWord 和 wordList 中的词等长。每次只改一个字符，转换后的词必须在 wordList 中。返回从起点到终点最短链的单词数，包含两端；不存在返回 0。",
          "example": "输入：beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]\n输出：5",
          "hint": "先问自己：边代价相同，队列按距离逐层推进；入队时标记可避免重复。",
          "recognition": "单词每次改一位求最短转换",
          "mnemonic": "每个词是节点，一次改字是一条边。",
          "why": "单词每次改一位求最短转换。BFS 按转换链长度递增；从词集合删去已入队候选，避免反复探索。",
          "invariant": "BFS 按转换链长度递增；从词集合删去已入队候选，避免反复探索。",
          "steps": [
            "若终点不在词表则失败",
            "从起点长度 1 入队",
            "枚举每一位的 26 种改法并扩展"
          ],
          "trace": "hit → hot → dot → dog → cog，长度为 5。\n\n手推时记录：BFS 按转换链长度递增；从词集合删去已入队候选，避免反复探索。\n\n边界检查：为什么起点的距离是 1，起点到终点改一次返回 2？\n本题数链上的单词个数，包含两端；改动次数是边数，比返回的单词数少一。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么起点的距离是 1，起点到终点改一次返回 2？\n本题数链上的单词个数，包含两端；改动次数是边数，比返回的单词数少一。",
          "complexity": "N 个长度 L 的词：Python 构造候选时间 O(26NL²)，工作空间 O(NL)。",
          "prerequisites": [
            "07-breadth"
          ],
          "related": [
            {
              "id": 994,
              "kind": "图的建模",
              "why": "都求无权最短传播层数；994 邻居是相邻格，127 邻居是词表中只差一个字符的词，且答案统计单词数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么起点的距离是 1，起点到终点改一次返回 2？",
            "answer": "本题数链上的单词个数，包含两端；改动次数是边数，比返回的单词数少一。"
          },
          "source": "02-Wiki/题目详解/127-单词接龙.md",
          "codeBlock": 0,
          "code": "from collections import deque\nfrom typing import List\n\n\nclass Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:\n        words = set(wordList)\n        if endWord not in words:\n            return 0\n        queue = deque([(beginWord, 1)])\n        while queue:\n            word, steps = queue.popleft()\n            if word == endWord:\n                return steps\n            for i in range(len(word)):\n                for char in \"abcdefghijklmnopqrstuvwxyz\":\n                    candidate = word[:i] + char + word[i + 1:]\n                    if candidate in words:\n                        words.remove(candidate)\n                        queue.append((candidate, steps + 1))\n        return 0",
          "url": "https://leetcode.cn/problems/word-ladder/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/127-%E5%8D%95%E8%AF%8D%E6%8E%A5%E9%BE%99.md",
          "sourceHash": "4a254af4d874841c52db88f1ad5cc86060dd5c0fc50a0ff9d04fc89700a524f8"
        },
        {
          "uid": "lc-210",
          "id": 210,
          "group": "dependency",
          "title": "课程表 II",
          "level": "Medium",
          "prompt": "numCourses 门课程编号 0…numCourses−1；[a,b] 表示先完成 b 才能学 a。返回能完成全部课程的一种顺序，不可能时返回空列表。",
          "example": "输入：numCourses=2, prerequisites=[[1,0]]\n输出：[0,1]",
          "hint": "先问自己：只有前置条件全部满足才能进入结果；还剩未处理点就有环。",
          "recognition": "要输出可行课程顺序",
          "mnemonic": "零入度出队的先后就是答案。",
          "why": "要输出可行课程顺序。输出的每门课程，其所有前置课程都已输出。",
          "invariant": "输出的每门课程，其所有前置课程都已输出。",
          "steps": [
            "建图和入度",
            "零入度队列逐个输出并释放后继",
            "数量不足返回空列表"
          ],
          "trace": "2 门课且 [1,0] 表示先学 0，答案为 [0,1]。\n\n手推时记录：输出的每门课程，其所有前置课程都已输出。\n\n边界检查：拓扑顺序一定唯一吗？\n不一定，同时有多个零入度节点时可任选其一；只要每条依赖的前置在后继之前，就是有效顺序。",
          "traceLabel": "例子与边界推演",
          "trap": "拓扑顺序一定唯一吗？\n不一定，同时有多个零入度节点时可任选其一；只要每条依赖的前置在后继之前，就是有效顺序。",
          "complexity": "时间与空间 O(V+E)。",
          "prerequisites": [
            "07-dependency"
          ],
          "related": [
            {
              "id": 207,
              "kind": "输出变化",
              "why": "Kahn 队列过程相同：207 只比较处理数量，210 保存出队顺序作为结果。"
            },
            {
              "id": 269,
              "kind": "建图递进",
              "why": "210 直接给依赖边；269 先从相邻单词首个差异推导边，还要处理错误前缀与重复边。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "拓扑顺序一定唯一吗？",
            "answer": "不一定，同时有多个零入度节点时可任选其一；只要每条依赖的前置在后继之前，就是有效顺序。"
          },
          "source": "02-Wiki/题目详解/210-课程表II.md",
          "codeBlock": 0,
          "code": "from collections import deque\nfrom typing import List\n\n\nclass Solution:\n    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:\n        graph = [[] for _ in range(numCourses)]\n        degree = [0] * numCourses\n        for course, prerequisite in prerequisites:\n            graph[prerequisite].append(course)\n            degree[course] += 1\n        queue = deque(i for i in range(numCourses) if degree[i] == 0)\n        order = []\n        while queue:\n            course = queue.popleft()\n            order.append(course)\n            for next_course in graph[course]:\n                degree[next_course] -= 1\n                if degree[next_course] == 0:\n                    queue.append(next_course)\n        return order if len(order) == numCourses else []",
          "url": "https://leetcode.cn/problems/course-schedule-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/210-%E8%AF%BE%E7%A8%8B%E8%A1%A8II.md",
          "sourceHash": "2ff3e718537be9b86e9af3130f4eae58fa4e45bf31522f41d8d6a99d06761c61"
        },
        {
          "uid": "lc-269",
          "id": 269,
          "group": "dependency",
          "title": "火星词典",
          "level": "Hard",
          "prompt": "words 已按一种未知字符顺序排序。推导这些词中全部不同字符的一种合法顺序；存在矛盾或无法满足时返回空串，合法答案可以不唯一。",
          "example": "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"] 可推出 \"wertf\"。",
          "hint": "先问自己：只有前置条件全部满足才能进入结果；还剩未处理点就有环。",
          "recognition": "由已排序单词推断字母序",
          "mnemonic": "相邻词只看首个不同字符。",
          "why": "由已排序单词推断字母序。图边仅来自能确定的字符先后关系，重复边不重复累加入度。",
          "invariant": "图边仅来自能确定的字符先后关系，重复边不重复累加入度。",
          "steps": [
            "收集全部字符",
            "比较相邻词并处理错误前缀",
            "首次差异建边后拓扑排序"
          ],
          "trace": "[\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"] 可推出 \"wertf\"。\n\n手推时记录：图边仅来自能确定的字符先后关系，重复边不重复累加入度。\n\n边界检查：为什么 abc 排在 ab 前必须直接失败？\n长词以前面的短词为完整前缀时，任何字符字典序都要求短词先出现，无法靠调整字母顺序修复。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么 abc 排在 ab 前必须直接失败？\n长词以前面的短词为完整前缀时，任何字符字典序都要求短词先出现，无法靠调整字母顺序修复。",
          "complexity": "总输入字符量 C：时间 O(C+E)，空间 O(V+E)。",
          "prerequisites": [
            "07-dependency"
          ],
          "related": [
            {
              "id": 210,
              "kind": "建图递进",
              "why": "210 直接给依赖边；269 先从相邻单词首个差异推导边，还要处理错误前缀与重复边。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么 abc 排在 ab 前必须直接失败？",
            "answer": "长词以前面的短词为完整前缀时，任何字符字典序都要求短词先出现，无法靠调整字母顺序修复。"
          },
          "source": "02-Wiki/题目详解/269-火星词典.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict, deque\nfrom typing import List\n\n\nclass Solution:\n    def alienOrder(self, words: List[str]) -> str:\n        graph = {char: set() for word in words for char in word}\n        degree = {char: 0 for char in graph}\n        for first, second in zip(words, words[1:]):\n            if len(first) > len(second) and first.startswith(second):\n                return \"\"\n            for a, b in zip(first, second):\n                if a != b:\n                    if b not in graph[a]:\n                        graph[a].add(b); degree[b] += 1\n                    break\n        queue = deque(char for char in degree if degree[char] == 0)\n        order = []\n        while queue:\n            char = queue.popleft(); order.append(char)\n            for next_char in graph[char]:\n                degree[next_char] -= 1\n                if degree[next_char] == 0:\n                    queue.append(next_char)\n        return \"\".join(order) if len(order) == len(graph) else \"\"",
          "url": "https://leetcode.ca/all/269.html",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/269-%E7%81%AB%E6%98%9F%E8%AF%8D%E5%85%B8.md",
          "sourceHash": "fd1b56af5c1893cefd95ceaca14d34839c84b51e40fbc5fd890a8e1c52b811aa"
        },
        {
          "uid": "lc-743",
          "id": 743,
          "group": "weighted",
          "title": "网络延迟时间",
          "level": "Medium",
          "prompt": "n 个节点编号 1…n。times 中 [u,v,w] 是从 u 到 v 耗时 w 的有向边，w 非负。信号从 k 同时向外传播，求全部节点都收到所需时间；有不可达节点返回 −1。",
          "example": "输入：times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2\n输出：2",
          "hint": "先问自己：先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "recognition": "非负边权求单源传播到全部节点的最迟时间",
          "mnemonic": "小堆弹出才定最短路。",
          "why": "非负边权求单源传播到全部节点的最迟时间。每个节点第一次从堆弹出并确认时，其时间已是最短到达时间。",
          "invariant": "每个节点第一次从堆弹出并确认时，其时间已是最短到达时间。",
          "steps": [
            "建有向加权图",
            "堆从起点距离 0 开始",
            "跳过已确认节点并扩展，全部可达取最后时间"
          ],
          "trace": "[[2,1,1],[2,3,1],[3,4,1]] 从 2 发出，全部收到需 2。\n\n手推时记录：每个节点第一次从堆弹出并确认时，其时间已是最短到达时间。\n\n边界检查：为什么不能像普通 BFS 那样按边数决定最短？\n一条边可能比多条短边更慢，必须按累计权重排序候选。非负权保证首次确认的距离不会被后续更长路径改小。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能像普通 BFS 那样按边数决定最短？\n一条边可能比多条短边更慢，必须按累计权重排序候选。非负权保证首次确认的距离不会被后续更长路径改小。",
          "complexity": "时间 O((V+E) log(E+1))，图和堆空间 O(V+E)。",
          "prerequisites": [
            "07-weighted"
          ],
          "related": [
            {
              "id": 994,
              "kind": "权重变化",
              "why": "相同边成本可用 FIFO 队列分层；不同非负边权要用小堆按累计距离确认节点。"
            },
            {
              "id": 778,
              "kind": "代价变化",
              "why": "743 走边时累加耗时；778 更新为路径峰值 max，先定义代价再套堆扩展模板。"
            },
            {
              "id": 787,
              "kind": "增加约束",
              "why": "787 除价格还限制中转次数，单个城市的最低价格不能丢掉边数信息；分轮松弛显式保留该约束。"
            },
            {
              "id": 1584,
              "kind": "易混淆",
              "why": "两题都用小堆，743 堆键是从源点累加的路径距离；1584 堆键是接入新点的一条跨边成本。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能像普通 BFS 那样按边数决定最短？",
            "answer": "一条边可能比多条短边更慢，必须按累计权重排序候选。非负权保证首次确认的距离不会被后续更长路径改小。"
          },
          "source": "02-Wiki/题目详解/743-网络延迟时间.md",
          "codeBlock": 0,
          "code": "import heapq\nfrom collections import defaultdict\nfrom typing import List\n\n\nclass Solution:\n    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:\n        graph = defaultdict(list)\n        for a, b, time in times:\n            graph[a].append((b, time))\n        heap, seen, answer = [(0, k)], set(), 0\n        while heap:\n            time, node = heapq.heappop(heap)\n            if node in seen:\n                continue\n            seen.add(node)\n            answer = time\n            for neighbor, weight in graph[node]:\n                if neighbor not in seen:\n                    heapq.heappush(heap, (time + weight, neighbor))\n        return answer if len(seen) == n else -1",
          "url": "https://leetcode.cn/problems/network-delay-time/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/743-%E7%BD%91%E7%BB%9C%E5%BB%B6%E8%BF%9F%E6%97%B6%E9%97%B4.md",
          "sourceHash": "976695c51beb463bb4d7786894ed3d721a362ed925c7f8596247b5d3ff5db104"
        },
        {
          "uid": "lc-778",
          "id": 778,
          "group": "weighted",
          "title": "水位上升的泳池中游泳",
          "level": "Hard",
          "prompt": "n×n 网格 grid 表示高度，时刻 t 水位为 t。只要相邻两格高度都不超过 t，就可在上下左右瞬间移动。返回从左上到右下所需的最小 t。",
          "example": "输入：grid=[[0,2],[1,3]]\n输出：3",
          "hint": "先问自己：先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "recognition": "路径代价由最高格子决定",
          "mnemonic": "小堆扩展，沿路取 max。",
          "why": "路径代价由最高格子决定。候选时间代表该路径最高高度；最先弹出的终点具有最小可能的路径峰值。",
          "invariant": "候选时间代表该路径最高高度；最先弹出的终点具有最小可能的路径峰值。",
          "steps": [
            "起点高度入堆",
            "向邻格以 max(当前时间,邻格高度) 扩展",
            "弹出终点即返回"
          ],
          "trace": "[[0,2],[1,3]] 要等到水位 3 才能抵达右下角。\n\n手推时记录：候选时间代表该路径最高高度；最先弹出的终点具有最小可能的路径峰值。\n\n边界检查：为什么新代价用 max，而不是把高度相加？\n水位达到路径上的最高格子就可走完全程，低格子的高度不会额外累加等待时间。此网格模型可在入堆时标记，不能照搬到一般加权最短路。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么新代价用 max，而不是把高度相加？\n水位达到路径上的最高格子就可走完全程，低格子的高度不会额外累加等待时间。此网格模型可在入堆时标记，不能照搬到一般加权最短路。",
          "complexity": "n×n 网格：时间 O(n² log n)，空间 O(n²)。",
          "prerequisites": [
            "07-weighted"
          ],
          "related": [
            {
              "id": 743,
              "kind": "代价变化",
              "why": "743 走边时累加耗时；778 更新为路径峰值 max，先定义代价再套堆扩展模板。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么新代价用 max，而不是把高度相加？",
            "answer": "水位达到路径上的最高格子就可走完全程，低格子的高度不会额外累加等待时间。此网格模型可在入堆时标记，不能照搬到一般加权最短路。"
          },
          "source": "02-Wiki/题目详解/778-水位上升的泳池中游泳.md",
          "codeBlock": 0,
          "code": "import heapq\nfrom typing import List\n\n\nclass Solution:\n    def swimInWater(self, grid: List[List[int]]) -> int:\n        n = len(grid)\n        heap, seen = [(grid[0][0], 0, 0)], {(0, 0)}\n        while heap:\n            time, r, c = heapq.heappop(heap)\n            if (r, c) == (n - 1, n - 1):\n                return time\n            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen:\n                    seen.add((nr, nc))\n                    heapq.heappush(heap, (max(time, grid[nr][nc]), nr, nc))\n        return -1",
          "url": "https://leetcode.cn/problems/swim-in-rising-water/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/778-%E6%B0%B4%E4%BD%8D%E4%B8%8A%E5%8D%87%E7%9A%84%E6%B3%B3%E6%B1%A0%E4%B8%AD%E6%B8%B8%E6%B3%B3.md",
          "sourceHash": "73d9e6d33e6bef376f83ce936c303b3eb46b882d3186144b71caadd5e51fa354"
        },
        {
          "uid": "lc-787",
          "id": 787,
          "group": "weighted",
          "title": "K 站中转内最便宜的航班",
          "level": "Medium",
          "prompt": "flights 中 [u,v,price] 是有向航班，价格为正。求从 src 到 dst、最多经过 k 个中转站的最低价格；不存在路线则返回 −1。",
          "example": "输入：n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1\n输出：200",
          "hint": "先问自己：先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "recognition": "最多 k 次中转限制了边数",
          "mnemonic": "做 k+1 轮，只读上一轮。",
          "why": "最多 k 次中转限制了边数。第 i 轮后 prices 表示最多使用 i 条边的最低价格；本轮更新只读取上一轮数组。",
          "invariant": "第 i 轮后 prices 表示最多使用 i 条边的最低价格；本轮更新只读取上一轮数组。",
          "steps": [
            "起点价格设为 0",
            "每轮复制 prices",
            "按所有航班松弛到副本，做 k+1 轮"
          ],
          "trace": "0→1→2，k=1 时允许两条边，若价格 100+100，答案为 200。\n\n手推时记录：第 i 轮后 prices 表示最多使用 i 条边的最低价格；本轮更新只读取上一轮数组。\n\n边界检查：为什么不能在同一 prices 数组里原地松弛？\n原地更新会让本轮新价格继续沿下一条边传播，一轮可能走多条边，破坏最多 k+1 条边的约束。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能在同一 prices 数组里原地松弛？\n原地更新会让本轮新价格继续沿下一条边传播，一轮可能走多条边，破坏最多 k+1 条边的约束。",
          "complexity": "时间 O((k+1)(V+E))，额外空间 O(V)。",
          "prerequisites": [
            "07-weighted"
          ],
          "related": [
            {
              "id": 743,
              "kind": "增加约束",
              "why": "787 除价格还限制中转次数，单个城市的最低价格不能丢掉边数信息；分轮松弛显式保留该约束。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能在同一 prices 数组里原地松弛？",
            "answer": "原地更新会让本轮新价格继续沿下一条边传播，一轮可能走多条边，破坏最多 k+1 条边的约束。"
          },
          "source": "02-Wiki/题目详解/787-K站中转内最便宜的航班.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:\n        prices = [float(\"inf\")] * n\n        prices[src] = 0\n        for _ in range(k + 1):\n            next_prices = prices[:]\n            for source, destination, price in flights:\n                if prices[source] != float(\"inf\"):\n                    next_prices[destination] = min(next_prices[destination], prices[source] + price)\n            prices = next_prices\n        return -1 if prices[dst] == float(\"inf\") else prices[dst]",
          "url": "https://leetcode.cn/problems/cheapest-flights-within-k-stops/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/787-K%E7%AB%99%E4%B8%AD%E8%BD%AC%E5%86%85%E6%9C%80%E4%BE%BF%E5%AE%9C%E7%9A%84%E8%88%AA%E7%8F%AD.md",
          "sourceHash": "cc87df24f66b68e54dfa4d243e23838908dcf932d490f4d2bd1310e8e43c5d3c"
        },
        {
          "uid": "lc-1584",
          "id": 1584,
          "group": "weighted",
          "title": "连接所有点的最小费用",
          "level": "Medium",
          "prompt": "给定平面点 points，连接两点的费用为 |x1−x2|+|y1−y2|。选一些连接使所有点互相可达，求总费用最小值。",
          "example": "[[0,0],[2,2],[3,10],[5,2],[7,0]] 的最小连接成本为 20。",
          "hint": "先问自己：先定义代价：求和、取最大、限制边数，还是最小生成树的跨边成本。",
          "recognition": "连接所有点使总边权最小",
          "mnemonic": "每次接入跨边最便宜的新点。",
          "why": "连接所有点使总边权最小。seen 是已接入的连通集合，堆保存从集合内部指向未接入点的候选边。",
          "invariant": "seen 是已接入的连通集合，堆保存从集合内部指向未接入点的候选边。",
          "steps": [
            "任取起点以 0 成本入堆",
            "弹最便宜且未接入的点",
            "累加该边并加入它到未接入点的所有边"
          ],
          "trace": "[[0,0],[2,2],[3,10],[5,2],[7,0]] 的最小连接成本为 20。\n\n手推时记录：seen 是已接入的连通集合，堆保存从集合内部指向未接入点的候选边。\n\n边界检查：为什么这不是从起点到各点的最短路之和？\n最小生成树优化整张连通网络的边权总和，允许多点共享边；候选键是一条跨边成本，而非从起点累加的距离。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么这不是从起点到各点的最短路之和？\n最小生成树优化整张连通网络的边权总和，允许多点共享边；候选键是一条跨边成本，而非从起点累加的距离。",
          "complexity": "此完全图堆实现：时间 O(n² log n)，空间 O(n²)。",
          "prerequisites": [
            "07-weighted"
          ],
          "related": [
            {
              "id": 743,
              "kind": "易混淆",
              "why": "两题都用小堆，743 堆键是从源点累加的路径距离；1584 堆键是接入新点的一条跨边成本。"
            },
            {
              "id": 684,
              "kind": "另一条路线",
              "why": "684 的并查集可判断加边是否成环；若把1584所有边排序，也能用这个判定构造 Kruskal 最小生成树。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么这不是从起点到各点的最短路之和？",
            "answer": "最小生成树优化整张连通网络的边权总和，允许多点共享边；候选键是一条跨边成本，而非从起点累加的距离。"
          },
          "source": "02-Wiki/题目详解/1584-连接所有点的最小费用.md",
          "codeBlock": 0,
          "code": "import heapq\nfrom typing import List\n\n\nclass Solution:\n    def minCostConnectPoints(self, points: List[List[int]]) -> int:\n        heap, seen, total = [(0, 0)], set(), 0\n        while len(seen) < len(points):\n            cost, i = heapq.heappop(heap)\n            if i in seen:\n                continue\n            seen.add(i)\n            total += cost\n            x1, y1 = points[i]\n            for j, (x2, y2) in enumerate(points):\n                if j not in seen:\n                    heapq.heappush(heap, (abs(x1 - x2) + abs(y1 - y2), j))\n        return total",
          "url": "https://leetcode.cn/problems/min-cost-to-connect-all-points/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1584-%E8%BF%9E%E6%8E%A5%E6%89%80%E6%9C%89%E7%82%B9%E7%9A%84%E6%9C%80%E5%B0%8F%E8%B4%B9%E7%94%A8.md",
          "sourceHash": "ea26dea8ee1376338406ddb53925d2158d2f57c717fce7b7ce2051034456c80f"
        },
        {
          "uid": "lc-208",
          "id": 208,
          "group": "prefix",
          "title": "实现 Trie（前缀树）",
          "level": "Medium",
          "prompt": "Trie（发音类似 \"try\"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。\n\n请你实现 Trie 类：\nTrie() 初始化前缀树对象。\nvoid insert(String word) 向前缀树中插入字符串 word。\nboolean search(String word) 如果字符串 word 在前缀树中，返回 true（即检索之前已插入）；否则返回 false。\nboolean startsWith(String prefix) 如果之前已插入的字符串 word 的前缀之一为 prefix，返回 true；否则返回 false。",
          "example": "输入：\n[\"Trie\", \"insert\", \"search\", \"search\", \"startsWith\", \"insert\", \"search\"]\n[[], [\"apple\"], [\"apple\"], [\"app\"], [\"app\"], [\"app\"], [\"app\"]]\n输出：\n[null, null, true, false, true, null, true]",
          "hint": "先问自己：完整词结尾与前缀存在不同；通配符或棋盘相邻关系会让单一路径变成分支搜索。",
          "recognition": "重复查询字符串前缀",
          "mnemonic": "字符逐层走，完整词还看结尾标记。",
          "why": "重复查询字符串前缀。从根到某节点的路径对应一个前缀，is_end 单独记录该前缀是否也是完整单词。",
          "invariant": "从根到某节点的路径对应一个前缀，is_end 单独记录该前缀是否也是完整单词。",
          "steps": [
            "插入时缺孩子就建节点",
            "查找沿字符路径",
            "完整匹配检查 is_end，前缀只检查路径"
          ],
          "trace": "输入：\n[\"Trie\", \"insert\", \"search\", \"search\", \"startsWith\", \"insert\", \"search\"]\n[[], [\"apple\"], [\"apple\"], [\"app\"], [\"app\"], [\"app\"], [\"app\"]]\n输出：\n[null, null, true, false, true, null, true]\n\n解释：\nTrie trie = new Trie();\ntrie.insert(\"apple\");\ntrie.search(\"apple\");   // 返回 True\ntrie.search(\"app\");     // 返回 False\ntrie.startsWith(\"app\"); // 返回 True\ntrie.insert(\"app\");\ntrie.search(\"app\");     // 返回 True\n\n手推时记录：从根到某节点的路径对应一个前缀，is_end 单独记录该前缀是否也是完整单词。\n\n边界检查：插入 apple 后，search(app) 与 startsWith(app) 为什么不同？\napp 的路径存在，但没有完整词结尾标记，所以完整词查询为 False，前缀查询为 True。",
          "traceLabel": "例子与边界推演",
          "trap": "插入 apple 后，search(app) 与 startsWith(app) 为什么不同？\napp 的路径存在，但没有完整词结尾标记，所以完整词查询为 False，前缀查询为 True。",
          "complexity": "单次操作 O(L)，所有插入字符量 C 对应空间 O(C)。",
          "prerequisites": [
            "07-prefix"
          ],
          "related": [
            {
              "id": 211,
              "kind": "分支递进",
              "why": "208 每个字符只有一条候选边；211 的点号允许走任意孩子，需要递归尝试分支。"
            },
            {
              "id": 212,
              "kind": "组合",
              "why": "212 把208的前缀判断嵌入棋盘搜索，只有仍可能组成某个目标词的路径才继续。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "插入 apple 后，search(app) 与 startsWith(app) 为什么不同？",
            "answer": "app 的路径存在，但没有完整词结尾标记，所以完整词查询为 False，前缀查询为 True。"
          },
          "source": "02-Wiki/题目详解/208-实现Trie.md",
          "codeBlock": 0,
          "code": "class Trie:\n    def __init__(self):\n        self.children = {}    # 字符 → Trie节点\n        self.is_end = False   # 是否为完整单词的结尾\n\n    def insert(self, word: str) -> None:\n        node = self\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = Trie()\n            node = node.children[ch]\n        node.is_end = True     # 标记结尾\n\n    def search(self, word: str) -> bool:\n        node = self._find(word)\n        return node is not None and node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        return self._find(prefix) is not None\n\n    def _find(self, prefix: str):\n        \"\"\"返回前缀路径的最后一个节点，若不存在返回 None\"\"\"\n        node = self\n        for ch in prefix:\n            if ch not in node.children:\n                return None\n            node = node.children[ch]\n        return node",
          "url": "https://leetcode.cn/problems/implement-trie-prefix-tree/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/208-%E5%AE%9E%E7%8E%B0Trie.md",
          "sourceHash": "c72329e26fba022be940d0e0e1cc36dbbc9e12625bb81f200330f9f1a379ae50"
        },
        {
          "uid": "lc-211",
          "id": 211,
          "group": "prefix",
          "title": "添加与搜索单词 - 数据结构设计",
          "level": "Medium",
          "prompt": "实现 addWord 与 search。search 模式中的 . 匹配恰好一个任意字母，其他字符精确匹配；只有匹配某个完整已添加单词才返回 True。",
          "example": "加入 bad、dad 后，search(\".ad\") 返回 True。",
          "hint": "先问自己：完整词结尾与前缀存在不同；通配符或棋盘相邻关系会让单一路径变成分支搜索。",
          "recognition": "字典搜索允许点号匹配任意字符",
          "mnemonic": "普通字符走一支，点号试所有支。",
          "why": "字典搜索允许点号匹配任意字符。dfs(i,node) 表示已经匹配前 i 个字符，并从该 Trie 节点匹配剩余模式。",
          "invariant": "dfs(i,node) 表示已经匹配前 i 个字符，并从该 Trie 节点匹配剩余模式。",
          "steps": [
            "插入建立 Trie",
            "普通字符查对应孩子",
            "点号递归所有孩子，末尾检查完整词标记"
          ],
          "trace": "加入 bad、dad 后，search(\".ad\") 返回 True。\n\n手推时记录：dfs(i,node) 表示已经匹配前 i 个字符，并从该 Trie 节点匹配剩余模式。\n\n边界检查：为什么模式走完后不能无条件返回 True？\n路径存在可能只是某个更长单词的前缀；必须确认当前位置是已插入单词的结尾。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么模式走完后不能无条件返回 True？\n路径存在可能只是某个更长单词的前缀；必须确认当前位置是已插入单词的结尾。",
          "complexity": "插入 O(L)；搜索最坏访问所有可匹配前缀节点，宽松界 O(Σ^L)，递归栈 O(L)。",
          "prerequisites": [
            "07-prefix"
          ],
          "related": [
            {
              "id": 208,
              "kind": "分支递进",
              "why": "208 每个字符只有一条候选边；211 的点号允许走任意孩子，需要递归尝试分支。"
            },
            {
              "id": 10,
              "kind": "易混淆",
              "why": "211 的点号在Trie中匹配一个字符；10 还含重复前项的星号，需要考虑零次与多次，并要求完整匹配。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么模式走完后不能无条件返回 True？",
            "answer": "路径存在可能只是某个更长单词的前缀；必须确认当前位置是已插入单词的结尾。"
          },
          "source": "02-Wiki/题目详解/211-添加与搜索单词-数据结构设计.md",
          "codeBlock": 0,
          "code": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.word = False\n\n\nclass WordDictionary:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def addWord(self, word: str) -> None:\n        node = self.root\n        for char in word:\n            node = node.children.setdefault(char, TrieNode())\n        node.word = True\n\n    def search(self, word: str) -> bool:\n        def dfs(i: int, node: TrieNode) -> bool:\n            if i == len(word):\n                return node.word\n            if word[i] == \".\":\n                return any(dfs(i + 1, child) for child in node.children.values())\n            return word[i] in node.children and dfs(i + 1, node.children[word[i]])\n        return dfs(0, self.root)",
          "url": "https://leetcode.cn/problems/design-add-and-search-words-data-structure/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/211-%E6%B7%BB%E5%8A%A0%E4%B8%8E%E6%90%9C%E7%B4%A2%E5%8D%95%E8%AF%8D-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1.md",
          "sourceHash": "8c7bed5dd1fe495002fdc42b27ca95eca2fa7460eeb0913a478ec4dbb42a3a18"
        },
        {
          "uid": "lc-212",
          "id": 212,
          "group": "prefix",
          "title": "单词搜索 II",
          "level": "Hard",
          "prompt": "board 为字符网格，words 为目标词列表。单词必须沿上下左右相邻格拼出，同一个词的路径不能重复使用一个格子。返回能找到的全部目标词，每个词只输出一次。",
          "example": "输入：board=[\"oaan\",\"etae\",\"ihkr\",\"iflv\"]（每行是字符列表）, words=[\"oath\",\"pea\",\"eat\",\"rain\"]\n输出：[\"oath\",\"eat\"]（顺序任意）",
          "hint": "先问自己：完整词结尾与前缀存在不同；通配符或棋盘相邻关系会让单一路径变成分支搜索。",
          "recognition": "棋盘同时找多个词",
          "mnemonic": "Trie 剪掉无词前缀，路径用完恢复格子。",
          "why": "棋盘同时找多个词。当前棋盘路径与 Trie 路径表示同一前缀，当前路径上的格子不能再次使用。",
          "invariant": "当前棋盘路径与 Trie 路径表示同一前缀，当前路径上的格子不能再次使用。",
          "steps": [
            "全部词建 Trie",
            "每格起搜并沿相邻格与 Trie 同步前进",
            "命中后去结尾标记防重，退出恢复字符"
          ],
          "trace": "board=[[o,a,a,n],[e,t,a,e],[i,h,k,r],[i,f,l,v]]，words=[\"oath\",\"pea\",\"eat\",\"rain\"]，返回 oath、eat。\n\n手推时记录：当前棋盘路径与 Trie 路径表示同一前缀，当前路径上的格子不能再次使用。\n\n边界检查：为什么找到了一个词仍要继续向下搜索？\n它可能是更长目标词的前缀，如 a 与 ab；去掉结尾标记只防止重复输出，不能删掉仍有用的后续路径。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么找到了一个词仍要继续向下搜索？\n它可能是更长目标词的前缀，如 a 与 ab；去掉结尾标记只防止重复输出，不能删掉仍有用的后续路径。",
          "complexity": "总词字符量 C、最长词 L：宽松时间 O(C+mn·4^L)，空间 O(C+L+输出)。",
          "prerequisites": [
            "07-prefix"
          ],
          "related": [
            {
              "id": 208,
              "kind": "组合",
              "why": "212 把208的前缀判断嵌入棋盘搜索，只有仍可能组成某个目标词的路径才继续。"
            },
            {
              "id": 79,
              "kind": "单词到词典",
              "why": "79 对一个词逐字回溯；212 用 Trie 共享多个词的前缀，同时搜索并去重输出。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么找到了一个词仍要继续向下搜索？",
            "answer": "它可能是更长目标词的前缀，如 a 与 ab；去掉结尾标记只防止重复输出，不能删掉仍有用的后续路径。"
          },
          "source": "02-Wiki/题目详解/212-单词搜索II.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:\n        root = {}\n        for word in words:\n            node = root\n            for char in word:\n                node = node.setdefault(char, {})\n            node[\"$\"] = word\n        result, rows, cols = [], len(board), len(board[0])\n\n        def dfs(r: int, c: int, node: dict) -> None:\n            char = board[r][c]\n            if char not in node:\n                return\n            node = node[char]\n            found = node.pop(\"$\", None)\n            if found:\n                result.append(found)\n            board[r][c] = \"#\"\n            for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != \"#\":\n                    dfs(nr, nc, node)\n            board[r][c] = char\n\n        for r in range(rows):\n            for c in range(cols):\n                dfs(r, c, root)\n        return result",
          "url": "https://leetcode.cn/problems/word-search-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/212-%E5%8D%95%E8%AF%8D%E6%90%9C%E7%B4%A2II.md",
          "sourceHash": "dfe510bfb366c519985b016bc1cf6f70e0bb69cd10e1832b65747be03588798f"
        },
        {
          "uid": "lc-332",
          "id": 332,
          "group": "edges",
          "title": "重新安排行程",
          "level": "Hard",
          "prompt": "tickets 中每一项是一张有向机票。保证至少有一条从 JFK 出发、恰好用完每张票一次的行程，返回机场序列中字典序最小的那一条。",
          "example": "输入：tickets=[[\"MUC\",\"LHR\"],[\"JFK\",\"MUC\"],[\"SFO\",\"SJC\"],[\"LHR\",\"SFO\"]]\n输出：[\"JFK\",\"MUC\",\"LHR\",\"SFO\",\"SJC\"]",
          "hint": "先问自己：遍历节点与消费边不是同一件事；欧拉路径要求每张票恰好用一次。",
          "recognition": "每张机票恰用一次且字典序最小",
          "mnemonic": "先耗尽出边，回程写点再反转。",
          "why": "每张机票恰用一次且字典序最小。每条边从堆弹出一次，机场在无剩余出边后加入逆序路线。",
          "invariant": "每条边从堆弹出一次，机场在无剩余出边后加入逆序路线。",
          "steps": [
            "各机场出边建字典序小堆",
            "从 JFK 递归消费全部出边",
            "后序记录机场并反转"
          ],
          "trace": "JFK→MUC→LHR→SFO→SJC 是给定机票的一条完整行程。\n\n手推时记录：每条边从堆弹出一次，机场在无剩余出边后加入逆序路线。\n\n边界检查：为什么不能把每次走到的机场直接作为最终顺序？\n字典序最小的边可能先到死路；后序记录再反转会把死路拼到整体末尾，保留其他边的插入位置。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能把每次走到的机场直接作为最终顺序？\n字典序最小的边可能先到死路；后序记录再反转会把死路拼到整体末尾，保留其他边的插入位置。",
          "complexity": "E 张票：时间 O(E log E)，空间 O(E)。",
          "prerequisites": [
            "07-edges"
          ],
          "related": [
            {
              "id": 207,
              "kind": "易混淆",
              "why": "207 要排节点的依赖顺序，有向环使任务失败；332 要用完每条票边，允许环，依靠后序拼接欧拉行程。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能把每次走到的机场直接作为最终顺序？",
            "answer": "字典序最小的边可能先到死路；后序记录再反转会把死路拼到整体末尾，保留其他边的插入位置。"
          },
          "source": "02-Wiki/题目详解/332-重新安排行程.md",
          "codeBlock": 0,
          "code": "import heapq\nfrom collections import defaultdict\nfrom typing import List\n\n\nclass Solution:\n    def findItinerary(self, tickets: List[List[str]]) -> List[str]:\n        graph = defaultdict(list)\n        for source, destination in tickets:\n            heapq.heappush(graph[source], destination)\n        route = []\n        def visit(airport):\n            while graph[airport]:\n                visit(heapq.heappop(graph[airport]))\n            route.append(airport)\n        visit(\"JFK\")\n        return route[::-1]",
          "url": "https://leetcode.cn/problems/reconstruct-itinerary/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/332-%E9%87%8D%E6%96%B0%E5%AE%89%E6%8E%92%E8%A1%8C%E7%A8%8B.md",
          "sourceHash": "29cce8f226603d258571a558c2f86de9f613fbbab573be1dff878a415f5aa3ab"
        }
      ]
    },
    {
      "id": "backtracking-08",
      "number": "08",
      "title": "回溯",
      "content": "decks/08-cards.json",
      "concepts": [
        {
          "id": "08-choices",
          "title": "选择的含义：排列、子集与逐位组合",
          "explanation": "排列每层遍历未使用元素；子集只向后选；逐位组合每层对应一个输入位置。",
          "example": "46 用 used；78 用 start；17 用数字下标 idx。"
        },
        {
          "id": "08-duplicates",
          "title": "组合去重与元素复用",
          "explanation": "start 控制候选范围；i 与 i+1 决定是否复用；i>start 才表示同一层的重复选择。",
          "example": "39 能重复选同一元素；40 每个位置一次且同层去重；90 对子集做同层去重。"
        },
        {
          "id": "08-constraints",
          "title": "只沿仍有希望的路径继续",
          "explanation": "把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "example": "22 右括号数不超过左括号；51 列与两种对角线不冲突；79 格子在当前路径不可重用。"
        }
      ],
      "source": "02-Wiki/专题总结/08-回溯算法.md",
      "connectionRule": "按选择树连接：每层选择什么、哪些选择还能用、什么时候记录答案。再区分同层去重、路径占用和可行性剪枝。",
      "groups": [
        {
          "id": "choices",
          "title": "选择的含义：排列、子集与逐位组合",
          "description": "排列每层遍历未使用元素；子集只向后选；逐位组合每层对应一个输入位置。",
          "example": "46 用 used；78 用 start；17 用数字下标 idx。"
        },
        {
          "id": "duplicates",
          "title": "组合去重与元素复用",
          "description": "start 控制候选范围；i 与 i+1 决定是否复用；i>start 才表示同一层的重复选择。",
          "example": "39 能重复选同一元素；40 每个位置一次且同层去重；90 对子集做同层去重。"
        },
        {
          "id": "constraints",
          "title": "只沿仍有希望的路径继续",
          "description": "把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "example": "22 右括号数不超过左括号；51 列与两种对角线不冲突；79 格子在当前路径不可重用。"
        }
      ],
      "firstProblems": [
        78,
        17,
        46
      ],
      "cards": [
        {
          "uid": "lc-78",
          "id": 78,
          "group": "choices",
          "title": "子集",
          "level": "Medium",
          "prompt": "给你一个整数数组 nums，数组中的元素互不相同。返回该数组所有可能的子集（幂集）。\n\n解集不能包含重复的子集。你可以按任意顺序返回解集。",
          "example": "输入：nums = [1,2,3]\n输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
          "hint": "先问自己：排列每层遍历未使用元素；子集只向后选；逐位组合每层对应一个输入位置。",
          "recognition": "不重复元素求所有子集",
          "mnemonic": "每个节点都收，只往后选。",
          "why": "不重复元素求所有子集。path 的下标严格递增，因此同一组元素不会因选择顺序不同而重复。",
          "invariant": "path 的下标严格递增，因此同一组元素不会因选择顺序不同而重复。",
          "steps": [
            "进入递归就复制当前子集",
            "从 start 枚举下一元素",
            "下层从 i+1 开始并撤销选择"
          ],
          "trace": "输入：nums = [1,2,3]\n输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]\n\n手推时记录：path 的下标严格递增，因此同一组元素不会因选择顺序不同而重复。\n\n边界检查：为什么在每次进入递归就记录，而不是只到叶子记录？\n任意长度的子集都是答案，包括空集；只收叶子会漏掉尚可扩展的中间子集。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么在每次进入递归就记录，而不是只到叶子记录？\n任意长度的子集都是答案，包括空集；只收叶子会漏掉尚可扩展的中间子集。",
          "complexity": "时间及输出 O(n·2^n)，辅助空间 O(n)。",
          "prerequisites": [
            "08-choices"
          ],
          "related": [
            {
              "id": 46,
              "kind": "易混淆",
              "why": "46 顺序有意义，用 used 后每层从头枚举；78 顺序无意义，用 start 保证下标递增。"
            },
            {
              "id": 90,
              "kind": "增加重复",
              "why": "子集框架不变，90 因输入可能重复，新增排序与同层跳过相同值。"
            },
            {
              "id": 131,
              "kind": "选择对象变化",
              "why": "78 每步选择一个元素；131 每步选择一个连续片段的终点，还要检查片段回文并覆盖整个字符串。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么在每次进入递归就记录，而不是只到叶子记录？",
            "answer": "任意长度的子集都是答案，包括空集；只收叶子会漏掉尚可扩展的中间子集。"
          },
          "source": "02-Wiki/题目详解/78-子集.md",
          "codeBlock": 0,
          "code": "def subsets(nums):\n    res = []\n    n = len(nums)\n\n    def backtrack(start, path):\n        # 每个节点都加入结果（包括空集）\n        res.append(path[:])\n\n        # 从 start 开始，避免重复\n        for i in range(start, n):\n            path.append(nums[i])      # 做选择\n            backtrack(i + 1, path)    # 递归：只能选 i 之后的元素\n            path.pop()                # 撤销选择\n\n    backtrack(0, [])\n    return res",
          "url": "https://leetcode.cn/problems/subsets/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/78-%E5%AD%90%E9%9B%86.md",
          "sourceHash": "49eceb333c47171ca2658c9c79d0000fbd8dea0b0b83e248fb7b6059f0990ce4"
        },
        {
          "uid": "lc-17",
          "id": 17,
          "group": "choices",
          "title": "电话号码的字母组合",
          "level": "Medium",
          "prompt": "给定一个仅包含数字 2-9 的字符串 digits，返回所有它能表示的字母组合。答案可以按任意顺序返回。\n\n数字到字母的映射与电话按键相同：\n2 → abc，3 → def，4 → ghi，5 → jkl\n6 → mno，7 → pqrs，8 → tuv，9 → wxyz",
          "example": "输入：digits = \"23\"\n输出：[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
          "hint": "先问自己：排列每层遍历未使用元素；子集只向后选；逐位组合每层对应一个输入位置。",
          "recognition": "每个数字选一个字母，枚举所有拼接",
          "mnemonic": "一层一个数字，一支一个字母。",
          "why": "每个数字选一个字母，枚举所有拼接。path 长度等于 idx，已为前 idx 个数字各选了一个合法字母。",
          "invariant": "path 长度等于 idx，已为前 idx 个数字各选了一个合法字母。",
          "steps": [
            "空输入返回空列表",
            "枚举当前数字的字母并递归下一位",
            "到末尾拼接记录，返回时撤销"
          ],
          "trace": "输入：digits = \"23\"\n输出：[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]\n\n手推时记录：path 长度等于 idx，已为前 idx 个数字各选了一个合法字母。\n\n边界检查：为什么空输入不是包含一个空串的列表？\n题目约定没有数字时没有字母组合，应在开始就返回 []；普通递归终点则代表已经完成了一次有效选择。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么空输入不是包含一个空串的列表？\n题目约定没有数字时没有字母组合，应在开始就返回 []；普通递归终点则代表已经完成了一次有效选择。",
          "complexity": "n 位数字：最多 O(n·4^n) 时间及输出空间，辅助栈 O(n)。",
          "prerequisites": [
            "08-choices"
          ],
          "related": [
            {
              "id": 46,
              "kind": "层的含义",
              "why": "17 每层固定一个数字，只选它的字母；46 每层固定一个输出位置，需要在所有未用元素中选择。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么空输入不是包含一个空串的列表？",
            "answer": "题目约定没有数字时没有字母组合，应在开始就返回 []；普通递归终点则代表已经完成了一次有效选择。"
          },
          "source": "02-Wiki/题目详解/17-电话号码的字母组合.md",
          "codeBlock": 0,
          "code": "def letterCombinations(digits):\n    if not digits:\n        return []\n\n    # 数字到字母的映射表\n    mapping = {\n        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',\n        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'\n    }\n\n    res = []\n\n    def backtrack(idx, path):\n        # 终止条件：处理完所有数字\n        if idx == len(digits):\n            res.append(''.join(path))\n            return\n\n        # 获取当前数字对应的所有字母\n        letters = mapping[digits[idx]]\n        for ch in letters:\n            path.append(ch)           # 做选择\n            backtrack(idx + 1, path)  # 递归处理下一个数字\n            path.pop()                # 撤销选择\n\n    backtrack(0, [])\n    return res",
          "url": "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/17-%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81%E7%9A%84%E5%AD%97%E6%AF%8D%E7%BB%84%E5%90%88.md",
          "sourceHash": "1fa4e6c5956218266b2896d6515cab33d9463972e06682454cd6797e9afbbe7b"
        },
        {
          "uid": "lc-46",
          "id": 46,
          "group": "choices",
          "title": "全排列",
          "level": "Medium",
          "prompt": "给定一个不含重复数字的数组 nums，返回其所有可能的全排列。你可以按任意顺序返回答案。",
          "example": "输入：nums = [1,2,3]\n输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
          "hint": "先问自己：排列每层遍历未使用元素；子集只向后选；逐位组合每层对应一个输入位置。",
          "recognition": "无重复元素求所有顺序",
          "mnemonic": "每层重选所有没用过的位置。",
          "why": "无重复元素求所有顺序。used 恰好标记当前 path 中的元素位置，路径内每个元素最多一次。",
          "invariant": "used 恰好标记当前 path 中的元素位置，路径内每个元素最多一次。",
          "steps": [
            "遍历所有未用下标",
            "标记并加入路径",
            "长度到 n 复制答案，回退时同时撤销两种状态"
          ],
          "trace": "输入：nums = [1,2,3]\n输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\n手推时记录：used 恰好标记当前 path 中的元素位置，路径内每个元素最多一次。\n\n边界检查：为什么不能像子集那样把下一层限制为 i+1？\n排列需要把较小下标放到较大下标之后，如 [2,1]；只向后选会丢掉不同顺序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能像子集那样把下一层限制为 i+1？\n排列需要把较小下标放到较大下标之后，如 [2,1]；只向后选会丢掉不同顺序。",
          "complexity": "时间及输出 O(n·n!)，辅助空间 O(n)。",
          "prerequisites": [
            "08-choices"
          ],
          "related": [
            {
              "id": 17,
              "kind": "层的含义",
              "why": "17 每层固定一个数字，只选它的字母；46 每层固定一个输出位置，需要在所有未用元素中选择。"
            },
            {
              "id": 78,
              "kind": "易混淆",
              "why": "46 顺序有意义，用 used 后每层从头枚举；78 顺序无意义，用 start 保证下标递增。"
            },
            {
              "id": 31,
              "kind": "枚举到邻居",
              "why": "46 枚举全部排列；31 利用最长不升后缀，只构造字典序紧邻的下一排列。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能像子集那样把下一层限制为 i+1？",
            "answer": "排列需要把较小下标放到较大下标之后，如 [2,1]；只向后选会丢掉不同顺序。"
          },
          "source": "02-Wiki/题目详解/46-全排列.md",
          "codeBlock": 0,
          "code": "def permute(nums):\n    res = []\n    n = len(nums)\n    used = [False] * n\n\n    def backtrack(path):\n        # 终止条件：路径长度等于 nums 长度\n        if len(path) == n:\n            res.append(path[:])  # path[:] 创建副本，避免后续修改\n            return\n        # 遍历所有选择\n        for i in range(n):\n            if used[i]:\n                continue  # 跳过已使用的元素\n            # 做选择\n            used[i] = True\n            path.append(nums[i])\n            backtrack(path)\n            # 撤销选择\n            path.pop()\n            used[i] = False\n\n    backtrack([])\n    return res",
          "url": "https://leetcode.cn/problems/permutations/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/46-%E5%85%A8%E6%8E%92%E5%88%97.md",
          "sourceHash": "17ddcaca2b3ebd6bfc652386dbfa39d72e0ee16db0534cdcaa76d7aafc75f96c"
        },
        {
          "uid": "lc-39",
          "id": 39,
          "group": "duplicates",
          "title": "组合总和",
          "level": "Medium",
          "prompt": "给你一个无重复元素的整数数组 candidates 和一个目标整数 target，找出 candidates 中可以使数字和为目标数 target 的所有不同组合，并以列表形式返回。你可以按任意顺序返回这些组合。\n\ncandidates 中的同一个数字可以无限制重复被选取。如果至少一个数字的被选数量不同，则两种组合是不同的。",
          "example": "输入：candidates = [2,3,6,7], target = 7\n输出：[[2,2,3],[7]]",
          "hint": "先问自己：start 控制候选范围；i 与 i+1 决定是否复用；i>start 才表示同一层的重复选择。",
          "recognition": "正整数可重复使用，求目标和组合",
          "mnemonic": "下层还传 i，太大就停。",
          "why": "正整数可重复使用，求目标和组合。路径下标不下降，remaining 是目标减去当前路径和；正数保证重复选择也会减少剩余量。",
          "invariant": "路径下标不下降，remaining 是目标减去当前路径和；正数保证重复选择也会减少剩余量。",
          "steps": [
            "排序",
            "从 start 枚举不超过剩余量的数",
            "下层传 i 允许复用，剩余为零复制答案"
          ],
          "trace": "输入：candidates = [2,3,6,7], target = 7\n输出：[[2,2,3],[7]]\n\n手推时记录：路径下标不下降，remaining 是目标减去当前路径和；正数保证重复选择也会减少剩余量。\n\n边界检查：为什么递归传 i，而不是 i+1？\n同一个候选可选多次，例如 [2,3] 的目标 4 需要 [2,2]；传 i+1 会禁止复用。正数是递归最终停止的重要条件。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么递归传 i，而不是 i+1？\n同一个候选可选多次，例如 [2,3] 的目标 4 需要 [2,2]；传 i+1 会禁止复用。正数是递归最终停止的重要条件。",
          "complexity": "设 d=target/min(candidates)：宽松时间 O(n^d·d)，辅助 O(d+n)，另计输出。",
          "prerequisites": [
            "08-duplicates"
          ],
          "related": [
            {
              "id": 40,
              "kind": "复用规则",
              "why": "39 输入值不同且可重复使用，递归传 i；40 每个位置一次且值可重复，递归传 i+1 并同层去重。"
            },
            {
              "id": 518,
              "kind": "枚举到计数",
              "why": "39 列出所有无限复用组合；518 只需数量，把相同金额状态合并成DP计数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么递归传 i，而不是 i+1？",
            "answer": "同一个候选可选多次，例如 [2,3] 的目标 4 需要 [2,2]；传 i+1 会禁止复用。正数是递归最终停止的重要条件。"
          },
          "source": "02-Wiki/题目详解/39-组合总和.md",
          "codeBlock": 0,
          "code": "def combinationSum(candidates, target):\n    res = []\n    candidates.sort()  # 排序是剪枝的前提\n\n    def backtrack(start, path, remaining):\n        if remaining == 0:\n            res.append(path[:])  # 找到一个合法组合\n            return\n\n        for i in range(start, len(candidates)):\n            # 剪枝：因为已排序，当前元素过大则后续更大，直接跳出\n            if candidates[i] > remaining:\n                break\n\n            path.append(candidates[i])\n            # 传 i 而不是 i+1：允许重复选取当前元素\n            backtrack(i, path, remaining - candidates[i])\n            path.pop()\n\n    backtrack(0, [], target)\n    return res",
          "url": "https://leetcode.cn/problems/combination-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/39-%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8C.md",
          "sourceHash": "0f3bc412bce43b4beaf830275aa418b7ded4364725474b854971f351ff8f1e09"
        },
        {
          "uid": "lc-40",
          "id": 40,
          "group": "duplicates",
          "title": "组合总和 II",
          "level": "Medium",
          "prompt": "candidates 为可能重复的正整数数组。返回和为 target 的全部不重复组合；每个输入位置最多使用一次，输入里的多个相同值可以分别使用，组合内顺序不重要。",
          "example": "输入：candidates=[10,1,2,7,6,1,5], target=8\n输出：[[1,1,6],[1,2,5],[1,7],[2,6]]",
          "hint": "先问自己：start 控制候选范围；i 与 i+1 决定是否复用；i>start 才表示同一层的重复选择。",
          "recognition": "候选含重复且每个位置最多一次",
          "mnemonic": "下层 i+1，同层跳重复。",
          "why": "候选含重复且每个位置最多一次。同一层相同值只开启一个分支，但不同层可使用输入中的不同重复位置。",
          "invariant": "同一层相同值只开启一个分支，但不同层可使用输入中的不同重复位置。",
          "steps": [
            "排序",
            "i>start 且相邻值相同就跳过",
            "选中后递归 i+1，过大剪枝"
          ],
          "trace": "candidates = [10,1,2,7,6,1,5], target = 8\n\n排序后：\n[1,1,2,5,6,7,10]\n\n合法组合：\n[1,1,6]\n[1,2,5]\n[1,7]\n[2,6]\n\n手推时记录：同一层相同值只开启一个分支，但不同层可使用输入中的不同重复位置。\n\n边界检查：为什么去重条件是 i>start，而不是 i>0？\n只跳同层重复选择；若跨层也跳掉，就无法使用输入中两个不同的 1 组成 [1,1]。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么去重条件是 i>start，而不是 i>0？\n只跳同层重复选择；若跨层也跳掉，就无法使用输入中两个不同的 1 组成 [1,1]。",
          "complexity": "时间宽松 O(n·2^n)，辅助 O(n)，另计输出。",
          "prerequisites": [
            "08-duplicates"
          ],
          "related": [
            {
              "id": 39,
              "kind": "复用规则",
              "why": "39 输入值不同且可重复使用，递归传 i；40 每个位置一次且值可重复，递归传 i+1 并同层去重。"
            },
            {
              "id": 90,
              "kind": "终止变化",
              "why": "两题共享排序和同层去重；40 只收目标和为零的路径，90 收下选择树的每个节点。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么去重条件是 i>start，而不是 i>0？",
            "answer": "只跳同层重复选择；若跨层也跳掉，就无法使用输入中两个不同的 1 组成 [1,1]。"
          },
          "source": "02-Wiki/题目详解/40-组合总和II.md",
          "codeBlock": 2,
          "code": "from typing import List\n\n\nclass Solution:\n    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:\n        candidates.sort()\n        res = []\n        path = []\n\n        def backtrack(start: int, remaining: int) -> None:\n            if remaining == 0:\n                res.append(path[:])\n                return\n\n            for i in range(start, len(candidates)):\n                if i > start and candidates[i] == candidates[i - 1]:\n                    continue\n\n                if candidates[i] > remaining:\n                    break\n\n                path.append(candidates[i])\n                backtrack(i + 1, remaining - candidates[i])\n                path.pop()\n\n        backtrack(0, target)\n        return res",
          "url": "https://leetcode.cn/problems/combination-sum-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/40-%E7%BB%84%E5%90%88%E6%80%BB%E5%92%8CII.md",
          "sourceHash": "659e4f9d752a342b2b9cde25cf6e0a4b49dca03ec219cb93e88dc286fda6bd9c"
        },
        {
          "uid": "lc-90",
          "id": 90,
          "group": "duplicates",
          "title": "子集 II",
          "level": "Medium",
          "prompt": "给定一个可能包含重复元素的整数数组 nums，返回所有可能的子集。\n\n结果中不能包含重复子集。",
          "example": "输入：nums=[1,2,2]\n输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]",
          "hint": "先问自己：start 控制候选范围；i 与 i+1 决定是否复用；i>start 才表示同一层的重复选择。",
          "recognition": "含重复元素求不重复子集",
          "mnemonic": "每个节点收答案，同层相同值只开一次。",
          "why": "含重复元素求不重复子集。当前层同值分支被合并，但路径中可保留输入允许的多个相同值。",
          "invariant": "当前层同值分支被合并，但路径中可保留输入允许的多个相同值。",
          "steps": [
            "排序",
            "每层先复制子集",
            "从 start 遍历并跳同层重复，下层 i+1"
          ],
          "trace": "nums = [1,2,2]\n\n排序后仍是：\n[1,2,2]\n\n所有不重复子集：\n[]\n[1]\n[1,2]\n[1,2,2]\n[2]\n[2,2]\n\n手推时记录：当前层同值分支被合并，但路径中可保留输入允许的多个相同值。\n\n边界检查：输入 [1,2,2] 时，为什么 [2,2] 不能被去重删掉？\n它使用两个不同位置，是一个合法子集；要删的是同一层分别选第一个或第二个 2 产生的重复分支。",
          "traceLabel": "例子与边界推演",
          "trap": "输入 [1,2,2] 时，为什么 [2,2] 不能被去重删掉？\n它使用两个不同位置，是一个合法子集；要删的是同一层分别选第一个或第二个 2 产生的重复分支。",
          "complexity": "时间及输出上界 O(n·2^n)，辅助 O(n)。",
          "prerequisites": [
            "08-duplicates"
          ],
          "related": [
            {
              "id": 78,
              "kind": "增加重复",
              "why": "子集框架不变，90 因输入可能重复，新增排序与同层跳过相同值。"
            },
            {
              "id": 40,
              "kind": "终止变化",
              "why": "两题共享排序和同层去重；40 只收目标和为零的路径，90 收下选择树的每个节点。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "输入 [1,2,2] 时，为什么 [2,2] 不能被去重删掉？",
            "answer": "它使用两个不同位置，是一个合法子集；要删的是同一层分别选第一个或第二个 2 产生的重复分支。"
          },
          "source": "02-Wiki/题目详解/90-子集II.md",
          "codeBlock": 2,
          "code": "from typing import List\n\n\nclass Solution:\n    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:\n        nums.sort()\n        res = []\n        path = []\n\n        def backtrack(start: int) -> None:\n            res.append(path[:])\n\n            for i in range(start, len(nums)):\n                if i > start and nums[i] == nums[i - 1]:\n                    continue\n\n                path.append(nums[i])\n                backtrack(i + 1)\n                path.pop()\n\n        backtrack(0)\n        return res",
          "url": "https://leetcode.cn/problems/subsets-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/90-%E5%AD%90%E9%9B%86II.md",
          "sourceHash": "89c6a285fdde8a04bab406bbf77251179a62eb273b55c4417b83278aaf795c12"
        },
        {
          "uid": "lc-22",
          "id": 22,
          "group": "constraints",
          "title": "括号生成",
          "level": "Medium",
          "prompt": "数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。",
          "example": "输入：n = 3\n输出：[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
          "hint": "先问自己：把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "recognition": "构造 n 对合法括号",
          "mnemonic": "左不超额，右不超左。",
          "why": "构造 n 对合法括号。任意前缀始终满足 0≤right≤left≤n，所以已生成部分永远不会提前闭合。",
          "invariant": "任意前缀始终满足 0≤right≤left≤n，所以已生成部分永远不会提前闭合。",
          "steps": [
            "左括号未满则可加左",
            "右括号少于左则可加右",
            "两者都为 n 时记录"
          ],
          "trace": "输入：n = 3\n输出：[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]\n\n手推时记录：任意前缀始终满足 0≤right≤left≤n，所以已生成部分永远不会提前闭合。\n\n边界检查：为什么不先生成全部长度 2n 的括号串再检查？\n大量前缀在右括号过多时已不可能修复，提前剪枝可直接跳过整棵无效子树。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不先生成全部长度 2n 的括号串再检查？\n大量前缀在右括号过多时已不可能修复，提前剪枝可直接跳过整棵无效子树。",
          "complexity": "C_n 为卡特兰数：输出时间 O(nC_n)；此字符串拼接实现栈上字符串可占 O(n²)，另计输出。",
          "prerequisites": [
            "08-constraints"
          ],
          "related": [
            {
              "id": 20,
              "kind": "验证到生成",
              "why": "20 检验已有括号串；22 把合法前缀条件直接放进生成过程，避免产生提前闭合的串。"
            },
            {
              "id": 51,
              "kind": "剪枝",
              "why": "两题都维护部分答案合法性；22 用括号数量关系，51 用列与对角线占用集合。"
            },
            {
              "id": 678,
              "kind": "生成与范围压缩",
              "why": "22 选择下一括号时保留合法前缀；678 面对星号的多种选择，将所有合法前缀状态压成数量范围。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不先生成全部长度 2n 的括号串再检查？",
            "answer": "大量前缀在右括号过多时已不可能修复，提前剪枝可直接跳过整棵无效子树。"
          },
          "source": "02-Wiki/题目详解/22-括号生成.md",
          "codeBlock": 0,
          "code": "def generateParenthesis(n):\n    res = []\n\n    def backtrack(left, right, path):\n        # 左右括号都用完了，得到一个有效组合\n        if left == n and right == n:\n            res.append(path)\n            return\n\n        # 剪枝：左括号数不能超过 n\n        if left < n:\n            backtrack(left + 1, right, path + '(')\n\n        # 剪枝：右括号数不能超过左括号数\n        if right < left:\n            backtrack(left, right + 1, path + ')')\n\n    backtrack(0, 0, '')\n    return res",
          "url": "https://leetcode.cn/problems/generate-parentheses/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/22-%E6%8B%AC%E5%8F%B7%E7%94%9F%E6%88%90.md",
          "sourceHash": "f99bf41b89bdbfb7d57da1d654aed43fcb2d11f57f721458f8f93db1bd5de0eb"
        },
        {
          "uid": "lc-51",
          "id": 51,
          "group": "constraints",
          "title": "N 皇后",
          "level": "Hard",
          "prompt": "按照国际象棋的规则，皇后可以攻击与之处在同一行、同一列或同一斜线上的棋子。\n\nn 皇后问题研究的是如何将 n 个皇后放置在 n x n 的棋盘上，并且使皇后彼此之间不能互相攻击。\n\n给你一个整数 n，返回所有不同的 n 皇后问题 的解决方案。\n\n每一种解法包含一个不同的 n 皇后问题的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。",
          "example": "输入：n = 4\n输出：[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],\n      [\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
          "hint": "先问自己：把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "recognition": "每行放一个皇后且互不攻击",
          "mnemonic": "查列、行减列、行加列。",
          "why": "每行放一个皇后且互不攻击。每个递归深度对应一行，三个集合精确记录已放皇后占用的列和两类对角线。",
          "invariant": "每个递归深度对应一行，三个集合精确记录已放皇后占用的列和两类对角线。",
          "steps": [
            "当前行枚举列并检查冲突",
            "加入三个集合后进入下一行",
            "返回时撤销，放完全部行记录棋盘"
          ],
          "trace": "输入：n = 4\n输出：[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],\n      [\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]\n\n手推时记录：每个递归深度对应一行，三个集合精确记录已放皇后占用的列和两类对角线。\n\n边界检查：为什么对角线能分别用 row−col 和 row+col 表示？\n沿主对角线行列同步增减，差不变；沿副对角线一增一减，和不变。只检查列会漏掉斜向攻击。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么对角线能分别用 row−col 和 row+col 表示？\n沿主对角线行列同步增减，差不变；沿副对角线一增一减，和不变。只检查列会漏掉斜向攻击。",
          "complexity": "宽松时间 O(n²·n!)，此棋盘路径辅助 O(n²)，另计全部解。",
          "prerequisites": [
            "08-constraints"
          ],
          "related": [
            {
              "id": 22,
              "kind": "剪枝",
              "why": "两题都维护部分答案合法性；22 用括号数量关系，51 用列与对角线占用集合。"
            },
            {
              "id": 79,
              "kind": "路径占用",
              "why": "占用状态只在当前分支生效；51 回退释放列和斜线，79 回退恢复棋盘字符。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么对角线能分别用 row−col 和 row+col 表示？",
            "answer": "沿主对角线行列同步增减，差不变；沿副对角线一增一减，和不变。只检查列会漏掉斜向攻击。"
          },
          "source": "02-Wiki/题目详解/51-N皇后.md",
          "codeBlock": 0,
          "code": "def solveNQueens(n):\n    res = []\n    cols = set()       # 已被占用的列\n    diag1 = set()      # 已被占用的主对角线 (row - col)\n    diag2 = set()      # 已被占用的副对角线 (row + col)\n\n    def backtrack(row, path):\n        # 所有行都放置完毕，记录结果\n        if row == n:\n            res.append([''.join(r) for r in path])\n            return\n\n        for col in range(n):\n            # 检查是否有冲突\n            if col in cols or (row - col) in diag1 or (row + col) in diag2:\n                continue\n\n            # 做选择\n            cols.add(col)\n            diag1.add(row - col)\n            diag2.add(row + col)\n\n            # 构建当前行的棋盘字符串\n            row_str = ['Q' if c == col else '.' for c in range(n)]\n            path.append(row_str)\n\n            backtrack(row + 1, path)  # 递归下一行\n\n            # 撤销选择\n            path.pop()\n            cols.remove(col)\n            diag1.remove(row - col)\n            diag2.remove(row + col)\n\n    backtrack(0, [])\n    return res",
          "url": "https://leetcode.cn/problems/n-queens/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/51-N%E7%9A%87%E5%90%8E.md",
          "sourceHash": "ad0cb711b61c3ced8acf36d956b4d8ca77a94b837c3f86396031bd9432de8451"
        },
        {
          "uid": "lc-79",
          "id": 79,
          "group": "constraints",
          "title": "单词搜索",
          "level": "Medium",
          "prompt": "给定一个 m x n 二维字符网格 board 和一个字符串单词 word。如果 word 存在于网格中，返回 true；否则，返回 false。\n\n单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中\"相邻\"单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许重复使用。",
          "example": "输入：board = [[\"A\",\"B\",\"C\",\"E\"],\n              [\"S\",\"F\",\"C\",\"S\"],\n              [\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\n输出：true",
          "hint": "先问自己：把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "recognition": "棋盘找一个词且格子不能复用",
          "mnemonic": "匹配一字占一格，退出恢复。",
          "why": "棋盘找一个词且格子不能复用。当前递归路径占用的格子被临时标记，其他路径仍可在恢复后使用它们。",
          "invariant": "当前递归路径占用的格子被临时标记，其他路径仍可在恢复后使用它们。",
          "steps": [
            "每格尝试起点",
            "字符匹配就暂时占用",
            "四邻匹配下一字，返回前恢复原字符"
          ],
          "trace": "输入：board = [[\"A\",\"B\",\"C\",\"E\"],\n              [\"S\",\"F\",\"C\",\"S\"],\n              [\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"\n输出：true\n\n手推时记录：当前递归路径占用的格子被临时标记，其他路径仍可在恢复后使用它们。\n\n边界检查：为什么访问标记不能像数岛屿一样永久保留？\n此题的占用只属于当前尝试路径，某格在失败路径用过，不代表别的起点或路径不能用。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么访问标记不能像数岛屿一样永久保留？\n此题的占用只属于当前尝试路径，某格在失败路径用过，不代表别的起点或路径不能用。",
          "complexity": "词长 L：宽松时间 O(mn·4^L)，辅助递归栈 O(L)。",
          "prerequisites": [
            "08-constraints"
          ],
          "related": [
            {
              "id": 212,
              "kind": "单词到词典",
              "why": "79 对一个词逐字回溯；212 用 Trie 共享多个词的前缀，同时搜索并去重输出。"
            },
            {
              "id": 51,
              "kind": "路径占用",
              "why": "占用状态只在当前分支生效；51 回退释放列和斜线，79 回退恢复棋盘字符。"
            },
            {
              "id": 200,
              "kind": "易混淆",
              "why": "200 的访问属于整次连通性任务，无需恢复；79 的访问属于当前拼词路径，退出必须恢复。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么访问标记不能像数岛屿一样永久保留？",
            "answer": "此题的占用只属于当前尝试路径，某格在失败路径用过，不代表别的起点或路径不能用。"
          },
          "source": "02-Wiki/题目详解/79-单词搜索.md",
          "codeBlock": 0,
          "code": "def exist(board, word):\n    m, n = len(board), len(board[0])\n\n    # 早期剪枝：总字母数不够直接返回 False\n    if len(word) > m * n:\n        return False\n\n    def dfs(i, j, k):\n        # 已经匹配完所有字符\n        if k == len(word):\n            return True\n        # 越界或不匹配\n        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:\n            return False\n\n        # 标记已访问（用特殊字符覆盖）\n        temp, board[i][j] = board[i][j], '#'\n\n        # 四个方向搜索\n        found = (dfs(i + 1, j, k + 1) or\n                 dfs(i - 1, j, k + 1) or\n                 dfs(i, j + 1, k + 1) or\n                 dfs(i, j - 1, k + 1))\n\n        # 回溯：恢复原字符\n        board[i][j] = temp\n        return found\n\n    # 从每个格子开始尝试\n    for i in range(m):\n        for j in range(n):\n            if dfs(i, j, 0):\n                return True\n    return False",
          "url": "https://leetcode.cn/problems/word-search/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/79-%E5%8D%95%E8%AF%8D%E6%90%9C%E7%B4%A2.md",
          "sourceHash": "57d3b932a8c2e91792af29000191bcae9b6e45981241da40d2e9823b52a4d717"
        },
        {
          "uid": "lc-131",
          "id": 131,
          "group": "constraints",
          "title": "分割回文串",
          "level": "Medium",
          "prompt": "给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。返回 s 所有可能的分割方案。",
          "example": "输入：s = \"aab\"\n输出：[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
          "hint": "先问自己：把部分答案的合法性写成状态，发现不可能完成就立即剪枝。",
          "recognition": "把整串切成全回文段",
          "mnemonic": "枚举切口，合法才递归后缀。",
          "why": "把整串切成全回文段。path 恰好覆盖 s 的已处理前缀，且每段都是回文；start 指向尚未切分的后缀。",
          "invariant": "path 恰好覆盖 s 的已处理前缀，且每段都是回文；start 指向尚未切分的后缀。",
          "steps": [
            "预处理子串回文表",
            "枚举当前段终点",
            "回文才递归 end+1，覆盖全串时复制答案"
          ],
          "trace": "输入：s = \"aab\"\n输出：[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]\n\n手推时记录：path 恰好覆盖 s 的已处理前缀，且每段都是回文；start 指向尚未切分的后缀。\n\n边界检查：为什么回文表按起点从右向左计算？\n判断 s[i:j+1] 依赖内部 s[i+1:j]，必须让更靠右起点的状态先准备好；回溯查询时才能 O(1) 判断。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么回文表按起点从右向左计算？\n判断 s[i:j+1] 依赖内部 s[i+1:j]，必须让更靠右起点的状态先准备好；回溯查询时才能 O(1) 判断。",
          "complexity": "时间 O(n²+n·2^n)，辅助 O(n²)，另计分割输出。",
          "prerequisites": [
            "08-constraints"
          ],
          "related": [
            {
              "id": 78,
              "kind": "选择对象变化",
              "why": "78 每步选择一个元素；131 每步选择一个连续片段的终点，还要检查片段回文并覆盖整个字符串。"
            },
            {
              "id": 647,
              "kind": "共用判断",
              "why": "都利用回文的内部结构；647 统计所有回文子串，131 再把这些可用子串组合成覆盖全串的分割。"
            },
            {
              "id": 139,
              "kind": "输出变化",
              "why": "139 只问能否把前缀拆开，成功一个切点就够；131 要列出所有回文分割，需继续探索并保存路径。"
            },
            {
              "id": 312,
              "kind": "区间思考",
              "why": "131 选下一段切口以枚举方案；312 反过来选区间内最后一步，固定外边界后让左右子问题独立。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么回文表按起点从右向左计算？",
            "answer": "判断 s[i:j+1] 依赖内部 s[i+1:j]，必须让更靠右起点的状态先准备好；回溯查询时才能 O(1) 判断。"
          },
          "source": "02-Wiki/题目详解/131-分割回文串.md",
          "codeBlock": 0,
          "code": "def partition(s):\n    res = []\n    n = len(s)\n\n    # 预处理所有子串的回文状态\n    dp = [[False] * n for _ in range(n)]\n    for i in range(n - 1, -1, -1):\n        for j in range(i, n):\n            if s[i] == s[j] and (j - i <= 2 or dp[i + 1][j - 1]):\n                dp[i][j] = True\n\n    def backtrack(start, path):\n        # 已经切割到末尾，记录结果\n        if start == n:\n            res.append(path[:])\n            return\n\n        # 枚举当前切割的结束位置\n        for end in range(start, n):\n            if dp[start][end]:  # O(1) 判断是否为回文\n                path.append(s[start:end + 1])\n                backtrack(end + 1, path)\n                path.pop()\n\n    backtrack(0, [])\n    return res",
          "url": "https://leetcode.cn/problems/palindrome-partitioning/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/131-%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.md",
          "sourceHash": "98178c8ebb889df303b49f0b0d8fd2d0044ec5c026598d8c2a442fe7e503f402"
        }
      ]
    },
    {
      "id": "binary-search-09",
      "number": "09",
      "title": "二分查找",
      "content": "decks/09-cards.json",
      "concepts": [
        {
          "id": "09-boundary",
          "title": "查值与找边界",
          "explanation": "找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "example": "704 命中即可停；34 命中后仍需收缩；981 找最后一个不晚于查询的时间。"
        },
        {
          "id": "09-ordered",
          "title": "有序性藏在哪里",
          "explanation": "二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "example": "74 行与行也严格衔接；33 每次至少一半有序；4 检查分割两边交叉大小。"
        },
        {
          "id": "09-answer",
          "title": "在答案范围上二分",
          "explanation": "不必在输入下标中找；若可行性随答案单调变化，就能找最小可行值。",
          "example": "875 速度越大所需时间越短，满足 h 小时的速度形成一个后缀。"
        }
      ],
      "source": "02-Wiki/专题总结/09-二分查找.md",
      "connectionRule": "按“保留哪一半、答案能否等于 mid”连接。先练查值与边界，再处理旋转、答案空间和双数组分割。",
      "groups": [
        {
          "id": "boundary",
          "title": "查值与找边界",
          "description": "找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "example": "704 命中即可停；34 命中后仍需收缩；981 找最后一个不晚于查询的时间。"
        },
        {
          "id": "ordered",
          "title": "有序性藏在哪里",
          "description": "二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "example": "74 行与行也严格衔接；33 每次至少一半有序；4 检查分割两边交叉大小。"
        },
        {
          "id": "answer",
          "title": "在答案范围上二分",
          "description": "不必在输入下标中找；若可行性随答案单调变化，就能找最小可行值。",
          "example": "875 速度越大所需时间越短，满足 h 小时的速度形成一个后缀。"
        }
      ],
      "firstProblems": [
        704,
        35,
        34
      ],
      "cards": [
        {
          "uid": "lc-704",
          "id": 704,
          "group": "boundary",
          "title": "二分查找",
          "level": "Easy",
          "prompt": "nums 是严格升序整数数组。以 O(log n) 时间返回 target 的下标，不存在返回 −1。",
          "example": "输入：nums=[-1,0,3,5,9,12], target=9\n输出：4",
          "hint": "先问自己：找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "recognition": "有序无重复数组查目标",
          "mnemonic": "中间比大小，排除一半。",
          "why": "有序无重复数组查目标。若目标存在，始终在闭区间 [left,right] 内。",
          "invariant": "若目标存在，始终在闭区间 [left,right] 内。",
          "steps": [
            "left=0、right=n−1",
            "相等返回下标",
            "小于目标排左半，否则排右半"
          ],
          "trace": "[-1,0,3,5,9,12] 中找 9：中点 3 后继续右半，得到下标 4。\n\n手推时记录：若目标存在，始终在闭区间 [left,right] 内。\n\n边界检查：为什么循环是 left≤right 而不是 left<right？\n这是闭区间模板，left==right 时仍有一个候选，必须检查它；排除 mid 时边界要越过 mid。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么循环是 left≤right 而不是 left<right？\n这是闭区间模板，left==right 时仍有一个候选，必须检查它；排除 mid 时边界要越过 mid。",
          "complexity": "时间 O(log n)，空间 O(1)。",
          "prerequisites": [
            "09-boundary"
          ],
          "related": [
            {
              "id": 35,
              "kind": "返回语义",
              "why": "搜索过程相同；704 未命中返回 −1，35 利用结束后的 left 返回正确插入位置。"
            },
            {
              "id": 74,
              "kind": "下标映射",
              "why": "74 在虚拟一维数组上套704的查值逻辑，通过除法与取余把 mid 转回二维坐标。"
            },
            {
              "id": 33,
              "kind": "弱化有序",
              "why": "704 整段有序；33 整体被旋转，但仍可先识别一半的有序性，再作安全排除。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么循环是 left≤right 而不是 left<right？",
            "answer": "这是闭区间模板，left==right 时仍有一个候选，必须检查它；排除 mid 时边界要越过 mid。"
          },
          "source": "02-Wiki/题目详解/704-二分查找.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = left + (right - left) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return -1",
          "url": "https://leetcode.cn/problems/binary-search/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/704-%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE.md",
          "sourceHash": "b4f0f58bde6cc4202047610b1a81f917d0fde400df0f318aa0fdb70a4c461db8"
        },
        {
          "uid": "lc-35",
          "id": 35,
          "group": "boundary",
          "title": "搜索插入位置",
          "level": "Easy",
          "prompt": "nums 是严格升序数组。以 O(log n) 时间返回 target 的下标；若不存在，返回插入后仍有序的位置，允许返回末尾位置 n。",
          "example": "输入：nums = [1,3,5,6], target = 5\n输出：2",
          "hint": "先问自己：找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "recognition": "有序无重复数组找值或插入点",
          "mnemonic": "查不到时 left 就是位置。",
          "why": "有序无重复数组找值或插入点。left 左侧都小于 target，right 右侧都大于 target；命中时可直接返回。",
          "invariant": "left 左侧都小于 target，right 右侧都大于 target；命中时可直接返回。",
          "steps": [
            "按闭区间二分",
            "相等返回",
            "区间为空时返回 left"
          ],
          "trace": "输入：nums = [1,3,5,6], target = 5\n输出：2\n\n手推时记录：left 左侧都小于 target，right 右侧都大于 target；命中时可直接返回。\n\n边界检查：目标比所有元素大时为什么返回 n 合法？\n插入位置允许位于数组末尾之后；排完所有元素时 left=n，正好代表追加位置。",
          "traceLabel": "例子与边界推演",
          "trap": "目标比所有元素大时为什么返回 n 合法？\n插入位置允许位于数组末尾之后；排完所有元素时 left=n，正好代表追加位置。",
          "complexity": "时间 O(log n)，空间 O(1)。",
          "prerequisites": [
            "09-boundary"
          ],
          "related": [
            {
              "id": 704,
              "kind": "返回语义",
              "why": "搜索过程相同；704 未命中返回 −1，35 利用结束后的 left 返回正确插入位置。"
            },
            {
              "id": 34,
              "kind": "增加重复",
              "why": "35 输入无重复且相等可停；34 需要重复区间的两端，命中后继续向相应方向收缩。"
            },
            {
              "id": 875,
              "kind": "搜索空间变化",
              "why": "35 找有序值里的插入边界；875 在候选速度上判断可行性，找第一个满足时限的速度。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "目标比所有元素大时为什么返回 n 合法？",
            "answer": "插入位置允许位于数组末尾之后；排完所有元素时 left=n，正好代表追加位置。"
          },
          "source": "02-Wiki/题目详解/35-搜索插入位置.md",
          "codeBlock": 0,
          "code": "def searchInsert(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid  # 找到目标，直接返回\n        elif nums[mid] < target:\n            left = mid + 1  # 目标在右半\n        else:\n            right = mid - 1  # 目标在左半\n\n    # 循环结束时 left > right，left 即插入位置\n    return left",
          "url": "https://leetcode.cn/problems/search-insert-position/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/35-%E6%90%9C%E7%B4%A2%E6%8F%92%E5%85%A5%E4%BD%8D%E7%BD%AE.md",
          "sourceHash": "a9dc29aa143f4a831065a012c18c40307f866a90a0dfc1800fc39c50e29399e8"
        },
        {
          "uid": "lc-34",
          "id": 34,
          "group": "boundary",
          "title": "在排序数组中查找元素的第一个和最后一个位置",
          "level": "Medium",
          "prompt": "给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。\n\n如果数组中不存在目标值 target，返回 [-1, -1]。\n\n你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。",
          "example": "输入：nums = [5,7,7,8,8,10], target = 8\n输出：[3,4]",
          "hint": "先问自己：找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "recognition": "有重复值找首末位置",
          "mnemonic": "一次找首个≥，一次找末个≤。",
          "why": "有重复值找首末位置。左边界搜索不断排除小于目标的部分，右边界搜索不断排除大于目标的部分。",
          "invariant": "左边界搜索不断排除小于目标的部分，右边界搜索不断排除大于目标的部分。",
          "steps": [
            "二分首个不小于 target 的位置",
            "验证目标确实存在",
            "二分最后一个不大于 target 的位置"
          ],
          "trace": "输入：nums = [5,7,7,8,8,10], target = 8\n输出：[3,4]\n\n手推时记录：左边界搜索不断排除小于目标的部分，右边界搜索不断排除大于目标的部分。\n\n边界检查：为什么找到一个等于 target 的 mid 后不能直接结束？\n相同值可能还在它两侧，要继续朝所需边界收缩；首个≥target 也可能指向更大值或越界，因此必须验证。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么找到一个等于 target 的 mid 后不能直接结束？\n相同值可能还在它两侧，要继续朝所需边界收缩；首个≥target 也可能指向更大值或越界，因此必须验证。",
          "complexity": "时间 O(log n)，空间 O(1)。",
          "prerequisites": [
            "09-boundary"
          ],
          "related": [
            {
              "id": 35,
              "kind": "增加重复",
              "why": "35 输入无重复且相等可停；34 需要重复区间的两端，命中后继续向相应方向收缩。"
            },
            {
              "id": 981,
              "kind": "同边界",
              "why": "34 的右边界与981都找最后一个≤目标的位置；981 的目标是时间，并返回该位置保存的值。"
            },
            {
              "id": 4,
              "kind": "边界递进",
              "why": "34 找目标值边界；4 找让两侧数量与大小同时成立的分割边界，移动方向由交叉边界冲突决定。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么找到一个等于 target 的 mid 后不能直接结束？",
            "answer": "相同值可能还在它两侧，要继续朝所需边界收缩；首个≥target 也可能指向更大值或越界，因此必须验证。"
          },
          "source": "02-Wiki/题目详解/34-在排序数组中查找元素首末位置.md",
          "codeBlock": 0,
          "code": "def searchRange(nums, target):\n    def lower_bound():\n        \"\"\"找第一个 >= target 的位置\"\"\"\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = l + (r - l) // 2\n            if nums[mid] < target:\n                l = mid + 1  # mid 太小，排除左半\n            else:\n                r = mid - 1  # mid >= target，收缩右边界\n        return l  # l 即第一个 >= target 的位置\n\n    def upper_bound():\n        \"\"\"找最后一个 <= target 的位置\"\"\"\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = l + (r - l) // 2\n            if nums[mid] <= target:\n                l = mid + 1  # mid <= target，收缩左边界\n            else:\n                r = mid - 1  # mid 太大，排除右半\n        return r  # r 即最后一个 <= target 的位置\n\n    left = lower_bound()\n    # 验证左边界是否有效\n    if left >= len(nums) or nums[left] != target:\n        return [-1, -1]\n\n    right = upper_bound()\n    return [left, right]",
          "url": "https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/34-%E5%9C%A8%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E6%9F%A5%E6%89%BE%E5%85%83%E7%B4%A0%E9%A6%96%E6%9C%AB%E4%BD%8D%E7%BD%AE.md",
          "sourceHash": "cfc0e302a92801b134d568330f12de9ef70daac6d2f1fc5f370e5496161a3fea"
        },
        {
          "uid": "lc-981",
          "id": 981,
          "group": "boundary",
          "title": "基于时间的键值存储",
          "level": "Medium",
          "prompt": "实现 TimeMap.set(key,value,timestamp) 和 get(key,timestamp)。写入时间戳严格递增；查询返回该键不晚于查询时刻的最近值，没有记录返回空串。",
          "example": "set(\"foo\",\"bar\",1)，get(\"foo\",3) 返回 \"bar\"。",
          "hint": "先问自己：找到相等是否结束，取决于要任意命中还是最左/最右边界。",
          "recognition": "时间戳递增写入，查询不晚于某时刻的最新值",
          "mnemonic": "合格先记，再往右找。",
          "why": "时间戳递增写入，查询不晚于某时刻的最新值。answer 是已确认时间≤查询时间的最右候选，未搜索区间还可能存在更新的合格值。",
          "invariant": "answer 是已确认时间≤查询时间的最右候选，未搜索区间还可能存在更新的合格值。",
          "steps": [
            "每个键保存按时间追加的列表",
            "二分最后一个时间≤timestamp",
            "没有合格项返回空串"
          ],
          "trace": "set(\"foo\",\"bar\",1)，get(\"foo\",3) 返回 \"bar\"。\n\n手推时记录：answer 是已确认时间≤查询时间的最右候选，未搜索区间还可能存在更新的合格值。\n\n边界检查：查询时间不与任何记录相等时，为什么仍可能有结果？\n查询语义是最近的过去值，不是精确命中；遇到≤查询的记录要保存答案并继续向右找。",
          "traceLabel": "例子与边界推演",
          "trap": "查询时间不与任何记录相等时，为什么仍可能有结果？\n查询语义是最近的过去值，不是精确命中；遇到≤查询的记录要保存答案并继续向右找。",
          "complexity": "set 摊还 O(1)，get O(log k)，总存储 O(N)；依赖写入时间递增。",
          "prerequisites": [
            "09-boundary"
          ],
          "related": [
            {
              "id": 34,
              "kind": "同边界",
              "why": "34 的右边界与981都找最后一个≤目标的位置；981 的目标是时间，并返回该位置保存的值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "查询时间不与任何记录相等时，为什么仍可能有结果？",
            "answer": "查询语义是最近的过去值，不是精确命中；遇到≤查询的记录要保存答案并继续向右找。"
          },
          "source": "02-Wiki/题目详解/981-基于时间的键值存储.md",
          "codeBlock": 0,
          "code": "from collections import defaultdict\n\n\nclass TimeMap:\n    def __init__(self):\n        self.data = defaultdict(list)\n\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        self.data[key].append((timestamp, value))\n\n    def get(self, key: str, timestamp: int) -> str:\n        pairs = self.data[key]\n        left, right, answer = 0, len(pairs) - 1, \"\"\n        while left <= right:\n            mid = (left + right) // 2\n            if pairs[mid][0] <= timestamp:\n                answer = pairs[mid][1]\n                left = mid + 1\n            else:\n                right = mid - 1\n        return answer",
          "url": "https://leetcode.cn/problems/time-based-key-value-store/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/981-%E5%9F%BA%E4%BA%8E%E6%97%B6%E9%97%B4%E7%9A%84%E9%94%AE%E5%80%BC%E5%AD%98%E5%82%A8.md",
          "sourceHash": "fa0f95437cf8f182d2ef39c443d3388d4670573dcab2984d2317eff40ceb2906"
        },
        {
          "uid": "lc-74",
          "id": 74,
          "group": "ordered",
          "title": "搜索二维矩阵",
          "level": "Medium",
          "prompt": "编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。该矩阵具有如下特性：\n每行中的整数从左到右按升序排列。\n每行的第一个整数大于前一行的最后一个整数。",
          "example": "输入：matrix = [[1,3,5,7],\n               [10,11,16,20],\n               [23,30,34,60]], target = 3\n输出：true",
          "hint": "先问自己：二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "recognition": "矩阵按行整体有序",
          "mnemonic": "下标除列数得行，取余得列。",
          "why": "矩阵按行整体有序。按行展开后的虚拟数组单调递增，可按普通一维二分排除一半。",
          "invariant": "按行展开后的虚拟数组单调递增，可按普通一维二分排除一半。",
          "steps": [
            "在 0…mn−1 上二分",
            "mid//n 与 mid%n 转为坐标",
            "按矩阵值比较收缩"
          ],
          "trace": "输入：matrix = [[1,3,5,7],\n               [10,11,16,20],\n               [23,30,34,60]], target = 3\n输出：true\n\n手推时记录：按行展开后的虚拟数组单调递增，可按普通一维二分排除一半。\n\n边界检查：为什么仅“每行每列有序”还不够直接展开？\n还必须保证下一行首元素大于上一行末元素；否则行间连接处可能下降，虚拟一维数组就不再有序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么仅“每行每列有序”还不够直接展开？\n还必须保证下一行首元素大于上一行末元素；否则行间连接处可能下降，虚拟一维数组就不再有序。",
          "complexity": "时间 O(log(mn))，空间 O(1)。",
          "prerequisites": [
            "09-ordered"
          ],
          "related": [
            {
              "id": 704,
              "kind": "下标映射",
              "why": "74 在虚拟一维数组上套704的查值逻辑，通过除法与取余把 mid 转回二维坐标。"
            },
            {
              "id": 240,
              "kind": "条件边界",
              "why": "74 各行之间也衔接有序，可展开二分；240 只保证行列各自有序，使用角落排除一行或一列。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么仅“每行每列有序”还不够直接展开？",
            "answer": "还必须保证下一行首元素大于上一行末元素；否则行间连接处可能下降，虚拟一维数组就不再有序。"
          },
          "source": "02-Wiki/题目详解/74-搜索二维矩阵.md",
          "codeBlock": 0,
          "code": "def searchMatrix(matrix, target):\n    if not matrix or not matrix[0]:\n        return False\n\n    m, n = len(matrix), len(matrix[0])\n    left, right = 0, m * n - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n        # 一维索引 → 二维坐标\n        row = mid // n\n        col = mid % n\n        val = matrix[row][col]\n\n        if val == target:\n            return True\n        elif val < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return False",
          "url": "https://leetcode.cn/problems/search-a-2d-matrix/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/74-%E6%90%9C%E7%B4%A2%E4%BA%8C%E7%BB%B4%E7%9F%A9%E9%98%B5.md",
          "sourceHash": "777c3a91c5deff97a5f9e50c4d713f54603637955b2bd35f5dabc580ab2726f4"
        },
        {
          "uid": "lc-33",
          "id": 33,
          "group": "ordered",
          "title": "搜索旋转排序数组",
          "level": "Medium",
          "prompt": "整数数组 nums 按升序排列，数组中的值互不相同。\n\n在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < len(nums)）上进行了旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标从 0 开始计数）。例如，[0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2]。\n\n给你旋转后的数组 nums 和一个整数 target，如果 nums 中存在这个目标值 target，则返回它的下标，否则返回 -1。\n\n你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。",
          "example": "输入：nums = [4,5,6,7,0,1,2], target = 0\n输出：4",
          "hint": "先问自己：二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "recognition": "无重复旋转数组找目标",
          "mnemonic": "先找有序半边，再判断目标在不在。",
          "why": "无重复旋转数组找目标。每轮至少一半有序，借该半边的端点范围排除不包含目标的部分。",
          "invariant": "每轮至少一半有序，借该半边的端点范围排除不包含目标的部分。",
          "steps": [
            "命中 mid 返回",
            "判断左半是否有序",
            "用目标是否落在有序范围决定保留哪半"
          ],
          "trace": "输入：nums = [4,5,6,7,0,1,2], target = 0\n输出：4\n\n手推时记录：每轮至少一半有序，借该半边的端点范围排除不包含目标的部分。\n\n边界检查：nums[left]≤nums[mid] 中为什么需要等号？\nleft==mid 时左半只有一个元素，也算有序；漏掉等号会破坏两元素区间的判断。此方法依赖无重复值。",
          "traceLabel": "例子与边界推演",
          "trap": "nums[left]≤nums[mid] 中为什么需要等号？\nleft==mid 时左半只有一个元素，也算有序；漏掉等号会破坏两元素区间的判断。此方法依赖无重复值。",
          "complexity": "时间 O(log n)，空间 O(1)。",
          "prerequisites": [
            "09-ordered"
          ],
          "related": [
            {
              "id": 153,
              "kind": "易混淆",
              "why": "33 按有序半边与目标范围定位某个值；153 对右端比较定位最小值，且 mid 可能为答案必须保留。"
            },
            {
              "id": 704,
              "kind": "弱化有序",
              "why": "704 整段有序；33 整体被旋转，但仍可先识别一半的有序性，再作安全排除。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "nums[left]≤nums[mid] 中为什么需要等号？",
            "answer": "left==mid 时左半只有一个元素，也算有序；漏掉等号会破坏两元素区间的判断。此方法依赖无重复值。"
          },
          "source": "02-Wiki/题目详解/33-搜索旋转排序数组.md",
          "codeBlock": 0,
          "code": "def search(nums, target):\n    left, right = 0, len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] == target:\n            return mid\n\n        # 判断左半段是否有序\n        if nums[left] <= nums[mid]:\n            # 左半段有序\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1  # target 在左半\n            else:\n                left = mid + 1   # target 在右半\n        else:\n            # 右半段有序\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1   # target 在右半\n            else:\n                right = mid - 1  # target 在左半\n\n    return -1",
          "url": "https://leetcode.cn/problems/search-in-rotated-sorted-array/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/33-%E6%90%9C%E7%B4%A2%E6%97%8B%E8%BD%AC%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84.md",
          "sourceHash": "f505fe2488f52d833fadd2ba31d83f911b2b558d1723f69b210a5bcc2b450da0"
        },
        {
          "uid": "lc-153",
          "id": 153,
          "group": "ordered",
          "title": "寻找旋转排序数组中的最小值",
          "level": "Medium",
          "prompt": "已知一个长度为 n 的数组，预先按照升序排列，经由 1 到 n 次旋转后，得到输入数组。例如，原数组 nums = [0,1,2,4,5,6,7] 在变化后可能得到：\n若旋转 4 次，则可以得到 [4,5,6,7,0,1,2]\n若旋转 7 次，则可以得到 [0,1,2,4,5,6,7]\n\n注意，数组 [a[0], a[1], a[2], ..., a[n-1]] 旋转一次的结果为数组 [a[n-1], a[0], a[1], a[2], ..., a[n-2]]。\n\n给你一个元素值互不相同的数组 nums，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的最小元素。\n\n你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。",
          "example": "输入：nums = [3,4,5,1,2]\n输出：1",
          "hint": "先问自己：二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "recognition": "无重复旋转数组找最小值",
          "mnemonic": "比右端，大就去右，小就留 mid。",
          "why": "无重复旋转数组找最小值。最小值始终位于 [left,right]；nums[mid]≤nums[right] 时 mid 本身仍可能是最小值。",
          "invariant": "最小值始终位于 [left,right]；nums[mid]≤nums[right] 时 mid 本身仍可能是最小值。",
          "steps": [
            "left<right 时取 mid",
            "mid 比右端大则 left=mid+1",
            "否则 right=mid，最终返回 nums[left]"
          ],
          "trace": "输入：nums = [3,4,5,1,2]\n输出：1\n\n手推时记录：最小值始终位于 [left,right]；nums[mid]≤nums[right] 时 mid 本身仍可能是最小值。\n\n边界检查：为什么右边界写 mid，而不是 mid−1？\n当 mid 位于较小有序段时，它可能正是旋转断点和最小值，不能排除。区间收敛后唯一元素就是答案。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么右边界写 mid，而不是 mid−1？\n当 mid 位于较小有序段时，它可能正是旋转断点和最小值，不能排除。区间收敛后唯一元素就是答案。",
          "complexity": "时间 O(log n)，空间 O(1)。",
          "prerequisites": [
            "09-ordered"
          ],
          "related": [
            {
              "id": 33,
              "kind": "易混淆",
              "why": "33 按有序半边与目标范围定位某个值；153 对右端比较定位最小值，且 mid 可能为答案必须保留。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么右边界写 mid，而不是 mid−1？",
            "answer": "当 mid 位于较小有序段时，它可能正是旋转断点和最小值，不能排除。区间收敛后唯一元素就是答案。"
          },
          "source": "02-Wiki/题目详解/153-寻找旋转排序数组中的最小值.md",
          "codeBlock": 0,
          "code": "def findMin(nums):\n    left, right = 0, len(nums) - 1\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] > nums[right]:\n            # mid 在大段，最小值在右半\n            left = mid + 1\n        else:\n            # mid 在小段，最小值在左半（含 mid）\n            right = mid\n\n    # left == right == 最小值位置\n    return nums[left]",
          "url": "https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/153-%E5%AF%BB%E6%89%BE%E6%97%8B%E8%BD%AC%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E6%9C%80%E5%B0%8F%E5%80%BC.md",
          "sourceHash": "fd21c75e34033c43043a4f3adaa7fa83083064d0f69995071415c9aca67c6e40"
        },
        {
          "uid": "lc-875",
          "id": 875,
          "group": "answer",
          "title": "爱吃香蕉的珂珂",
          "level": "Medium",
          "prompt": "piles[i] 是第 i 堆香蕉数量。每小时只能选一堆，吃掉最多 k 根；不足 k 根也耗一小时，剩余时间不能换另一堆。给定 h≥堆数，求 h 小时内吃完的最小正整数 k。",
          "example": "输入：piles=[3,6,7,11], h=8\n输出：4",
          "hint": "先问自己：不必在输入下标中找；若可行性随答案单调变化，就能找最小可行值。",
          "recognition": "在 h 小时内吃完求最小速度",
          "mnemonic": "能吃完往小找，吃不完加速。",
          "why": "在 h 小时内吃完求最小速度。满足时限的速度构成单调后缀，[left,right] 始终包含最小可行速度。",
          "invariant": "满足时限的速度构成单调后缀，[left,right] 始终包含最小可行速度。",
          "steps": [
            "速度范围设为 1…最大堆",
            "逐堆向上取整计算小时",
            "可行保留 mid，否则排除 mid 及更慢速度"
          ],
          "trace": "piles=[3,6,7,11], h=8；速度 4 可在 8 小时吃完，且更小速度不可行。\n\n手推时记录：满足时限的速度构成单调后缀，[left,right] 始终包含最小可行速度。\n\n边界检查：为什么总小时不能写成所有香蕉总数除以速度再向上取整？\n每小时只能吃一堆，某堆的剩余小时不能共享给下一堆；必须每一堆分别向上取整后再相加。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么总小时不能写成所有香蕉总数除以速度再向上取整？\n每小时只能吃一堆，某堆的剩余小时不能共享给下一堆；必须每一堆分别向上取整后再相加。",
          "complexity": "n 堆、最大堆 M：时间 O(n log M)，空间 O(1)。",
          "prerequisites": [
            "09-answer"
          ],
          "related": [
            {
              "id": 35,
              "kind": "搜索空间变化",
              "why": "35 找有序值里的插入边界；875 在候选速度上判断可行性，找第一个满足时限的速度。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么总小时不能写成所有香蕉总数除以速度再向上取整？",
            "answer": "每小时只能吃一堆，某堆的剩余小时不能共享给下一堆；必须每一堆分别向上取整后再相加。"
          },
          "source": "02-Wiki/题目详解/875-爱吃香蕉的珂珂.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        left, right = 1, max(piles)\n        while left < right:\n            speed = (left + right) // 2\n            hours = sum((pile + speed - 1) // speed for pile in piles)\n            if hours <= h:\n                right = speed\n            else:\n                left = speed + 1\n        return left",
          "url": "https://leetcode.cn/problems/koko-eating-bananas/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/875-%E7%88%B1%E5%90%83%E9%A6%99%E8%95%89%E7%9A%84%E7%8F%82%E7%8F%82.md",
          "sourceHash": "53f486ac18e3f270771b53ee81e8678a12bddb207403e4346237c8a5c3e06c5c"
        },
        {
          "uid": "lc-4",
          "id": 4,
          "group": "ordered",
          "title": "寻找两个正序数组的中位数",
          "level": "Hard",
          "prompt": "给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的中位数。\n\n算法的时间复杂度应该为 O(log(m + n))。",
          "example": "输入：nums1 = [1,3], nums2 = [2]\n输出：2.00000",
          "hint": "先问自己：二维展开、旋转数组和两数组分割各自提供不同的可排除条件。",
          "recognition": "两个有序数组找中位数",
          "mnemonic": "短数组二分切口，左右交叉都不越界。",
          "why": "两个有序数组找中位数。左侧总数固定为 (m+n+1)//2，合法切口需两数组的左最大值均不大于对方右最小值。",
          "invariant": "左侧总数固定为 (m+n+1)//2，合法切口需两数组的左最大值均不大于对方右最小值。",
          "steps": [
            "在短数组上二分切口 i，并由总左数算 j",
            "比较四个边界决定移动 i",
            "合法后按总长度奇偶取中间值"
          ],
          "trace": "输入：nums1 = [1,3], nums2 = [2]\n输出：2.00000\n解释：合并数组 = [1,2,3]，中位数 2\n\n手推时记录：左侧总数固定为 (m+n+1)//2，合法切口需两数组的左最大值均不大于对方右最小值。\n\n边界检查：为什么必须在较短数组上二分，并用无穷值表示空侧？\n较短数组的切口范围能保证另一数组切口合法；无穷边界统一处理某侧没有元素的情况，无需单独枚举空数组或端点。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么必须在较短数组上二分，并用无穷值表示空侧？\n较短数组的切口范围能保证另一数组切口合法；无穷边界统一处理某侧没有元素的情况，无需单独枚举空数组或端点。",
          "complexity": "时间 O(log(min(m,n)+1))，空间 O(1)，总长度须大于零。",
          "prerequisites": [
            "09-ordered"
          ],
          "related": [
            {
              "id": 34,
              "kind": "边界递进",
              "why": "34 找目标值边界；4 找让两侧数量与大小同时成立的分割边界，移动方向由交叉边界冲突决定。"
            },
            {
              "id": 295,
              "kind": "静态到动态",
              "why": "4 输入已排序，可直接二分两侧分割；295 数据持续进入，用两堆动态维护同样的左右分区条件。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么必须在较短数组上二分，并用无穷值表示空侧？",
            "answer": "较短数组的切口范围能保证另一数组切口合法；无穷边界统一处理某侧没有元素的情况，无需单独枚举空数组或端点。"
          },
          "source": "02-Wiki/题目详解/4-寻找两个正序数组的中位数.md",
          "codeBlock": 0,
          "code": "def findMedianSortedArrays(nums1, nums2):\n    # 保证 nums1 是较短的数组\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n\n    m, n = len(nums1), len(nums2)\n    left, right = 0, m\n    total_left = (m + n + 1) // 2  # 左半部分需要的元素总数\n\n    while left <= right:\n        # i 是 nums1 的分割线位置（左侧有 i 个元素）\n        i = (left + right) // 2\n        # j 是 nums2 的分割线位置（左侧有 j 个元素）\n        j = total_left - i\n\n        # 处理边界值（用无穷大/小表示空侧）\n        nums1_left_max = nums1[i - 1] if i > 0 else float('-inf')\n        nums1_right_min = nums1[i] if i < m else float('inf')\n        nums2_left_max = nums2[j - 1] if j > 0 else float('-inf')\n        nums2_right_min = nums2[j] if j < n else float('inf')\n\n        # 检查分割线是否合法\n        if nums1_left_max <= nums2_right_min and nums2_left_max <= nums1_right_min:\n            # 找到正确分割线\n            if (m + n) % 2 == 0:\n                # 偶数：取左半最大值和有半最小值的平均值\n                return (max(nums1_left_max, nums2_left_max) +\n                        min(nums1_right_min, nums2_right_min)) / 2\n            else:\n                # 奇数：中位数就是左半部分的最大值\n                return max(nums1_left_max, nums2_left_max)\n        elif nums1_left_max > nums2_right_min:\n            # nums1 左半太大，需要缩小 i\n            right = i - 1\n        else:\n            # nums2 左半太大，需要增大 i\n            left = i + 1\n\n    return 0.0  # 理论上不会执行到这里",
          "url": "https://leetcode.cn/problems/median-of-two-sorted-arrays/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/4-%E5%AF%BB%E6%89%BE%E4%B8%A4%E4%B8%AA%E6%AD%A3%E5%BA%8F%E6%95%B0%E7%BB%84%E7%9A%84%E4%B8%AD%E4%BD%8D%E6%95%B0.md",
          "sourceHash": "a9a9de6a1c0e739546b8ab1f56bf2d5377944db01dc707da51d00ea19082faae"
        }
      ]
    },
    {
      "id": "dynamic-programming-10",
      "number": "10",
      "title": "动态规划",
      "content": "decks/10-cards.json",
      "concepts": [
        {
          "id": "10-prefix",
          "title": "前缀与状态机：前面留下什么",
          "explanation": "明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "example": "198 留偷与不偷的最优；309 还要区分刚卖出与可买入的休息状态。"
        },
        {
          "id": "10-ending",
          "title": "以这里结尾，与全局最优分开",
          "explanation": "当前位置状态负责能否延续，最终答案通常要在所有位置上取最大。",
          "example": "300 枚举可接上的前驱；152 同时留最大最小乘积；32 跨过已匹配段找左括号。"
        },
        {
          "id": "10-grid",
          "title": "网格与依赖方向",
          "explanation": "转移从哪些邻居来，决定遍历或缓存的顺序。",
          "example": "62 把上与左的方案数相加；64 在两条前驱路径中取最小；329 严格递增形成无环依赖。"
        },
        {
          "id": "10-capacity",
          "title": "容量：能否、最少还是多少种",
          "explanation": "先选状态的含义，再确定物品能否复用与循环方向。",
          "example": "416 是0/1可达性；494 是0/1计数；322 是无限硬币最少数；518 是无限硬币组合数。"
        },
        {
          "id": "10-strings",
          "title": "双序列前缀：末字符怎样参与",
          "explanation": "dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "example": "1143 求最长公共子序列；72 求最少编辑；115 数子序列；97 判断交错。"
        },
        {
          "id": "10-interval",
          "title": "中心与区间：内部结构怎样复用",
          "explanation": "回文从中心向外扩展；区间最优可反过来枚举最后一步，使两边独立。",
          "example": "5 与647共享中心扩展；312 最后戳哪个气球，才会留下固定的区间边界。"
        }
      ],
      "source": "02-Wiki/专题总结/10-动态规划.md",
      "connectionRule": "按状态含义连接，而不是看到 DP 就背公式：前缀最优、以当前位置结尾、双序列前缀、容量可达或计数、区间内最后一步。",
      "groups": [
        {
          "id": "prefix",
          "title": "前缀与状态机：前面留下什么",
          "description": "明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "example": "198 留偷与不偷的最优；309 还要区分刚卖出与可买入的休息状态。"
        },
        {
          "id": "ending",
          "title": "以这里结尾，与全局最优分开",
          "description": "当前位置状态负责能否延续，最终答案通常要在所有位置上取最大。",
          "example": "300 枚举可接上的前驱；152 同时留最大最小乘积；32 跨过已匹配段找左括号。"
        },
        {
          "id": "grid",
          "title": "网格与依赖方向",
          "description": "转移从哪些邻居来，决定遍历或缓存的顺序。",
          "example": "62 把上与左的方案数相加；64 在两条前驱路径中取最小；329 严格递增形成无环依赖。"
        },
        {
          "id": "capacity",
          "title": "容量：能否、最少还是多少种",
          "description": "先选状态的含义，再确定物品能否复用与循环方向。",
          "example": "416 是0/1可达性；494 是0/1计数；322 是无限硬币最少数；518 是无限硬币组合数。"
        },
        {
          "id": "strings",
          "title": "双序列前缀：末字符怎样参与",
          "description": "dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "example": "1143 求最长公共子序列；72 求最少编辑；115 数子序列；97 判断交错。"
        },
        {
          "id": "interval",
          "title": "中心与区间：内部结构怎样复用",
          "description": "回文从中心向外扩展；区间最优可反过来枚举最后一步，使两边独立。",
          "example": "5 与647共享中心扩展；312 最后戳哪个气球，才会留下固定的区间边界。"
        }
      ],
      "firstProblems": [
        70,
        198,
        62
      ],
      "cards": [
        {
          "uid": "lc-70",
          "id": 70,
          "group": "prefix",
          "title": "爬楼梯",
          "level": "Easy",
          "prompt": "假设你正在爬楼梯。需要 n 阶你才能到达楼顶。\n\n每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？",
          "example": "输入：n = 2\n输出：2",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "每次爬一或两阶求方案数",
          "mnemonic": "最后一步来自前一阶或前两阶。",
          "why": "每次爬一或两阶求方案数。dp[i] 是恰好到第 i 阶的不同走法数。",
          "invariant": "dp[i] 是恰好到第 i 阶的不同走法数。",
          "steps": [
            "初始化一阶 1、二阶 2",
            "逐阶相加前两个状态",
            "返回第 n 阶"
          ],
          "trace": "输入：n = 2\n输出：2\n解释：有两种方法可以爬到楼顶。\n1. 1 阶 + 1 阶\n2. 2 阶\n\n手推时记录：dp[i] 是恰好到第 i 阶的不同走法数。\n\n边界检查：为什么两项相加不会重复计数？\n最后一步走一阶与走两阶互斥，所有合法走法必属于其中一类，因此可把两类数量相加。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么两项相加不会重复计数？\n最后一步走一阶与走两阶互斥，所有合法走法必属于其中一类，因此可把两类数量相加。",
          "complexity": "时间 O(n)，此数组实现空间 O(n)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 746,
              "kind": "目标变化",
              "why": "相同的前一阶和前两阶依赖，70 相加统计走法，746 取较小费用并加入当前成本。"
            },
            {
              "id": 91,
              "kind": "条件变化",
              "why": "都可能从前一或前二位置转移；91 每条转移还要通过单字非零或两字在10…26的合法性检查。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么两项相加不会重复计数？",
            "answer": "最后一步走一阶与走两阶互斥，所有合法走法必属于其中一类，因此可把两类数量相加。"
          },
          "source": "02-Wiki/题目详解/70-爬楼梯.md",
          "codeBlock": 0,
          "code": "def climbStairs(n):\n    if n <= 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    dp[2] = 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i - 1] + dp[i - 2]\n    return dp[n]",
          "url": "https://leetcode.cn/problems/climbing-stairs/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/70-%E7%88%AC%E6%A5%BC%E6%A2%AF.md",
          "sourceHash": "114e9e5dfdd82740ef58c1186f9a685683156b3992ee1a612041fdeb8228d664"
        },
        {
          "uid": "lc-198",
          "id": 198,
          "group": "prefix",
          "title": "打家劫舍",
          "level": "Medium",
          "prompt": "你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。\n\n给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。",
          "example": "输入：[1,2,3,1]\n输出：4",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "相邻房屋不能同时偷",
          "mnemonic": "不偷承前，偷就隔一家。",
          "why": "相邻房屋不能同时偷。dp[i] 是前 i 家允许范围内的最大收益，不要求一定偷第 i 家。",
          "invariant": "dp[i] 是前 i 家允许范围内的最大收益，不要求一定偷第 i 家。",
          "steps": [
            "初始化空前缀为 0",
            "比较 dp[i−1] 与 dp[i−2]+当前金额",
            "依次填表"
          ],
          "trace": "输入：[1,2,3,1]\n输出：4\n解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。\n     偷窃到的最高金额 = 1 + 3 = 4 。\n\n手推时记录：dp[i] 是前 i 家允许范围内的最大收益，不要求一定偷第 i 家。\n\n边界检查：为什么不能把“当前金额比前一家多就偷”当规则？\n选择当前房屋会影响相邻可选范围，需要比较两种完整前缀方案的收益，而非只比较两个房屋金额。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能把“当前金额比前一家多就偷”当规则？\n选择当前房屋会影响相邻可选范围，需要比较两种完整前缀方案的收益，而非只比较两个房屋金额。",
          "complexity": "时间 O(n)，此数组实现空间 O(n)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 213,
              "kind": "首尾约束",
              "why": "213 首尾相邻，不能直接套直线状态；排除首或尾后分别复用198。"
            },
            {
              "id": 309,
              "kind": "状态细化",
              "why": "都要记录历史对当前选择的限制；309 除持有与否，还需区分刚卖出与可买入休息，表达冷却一天。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能把“当前金额比前一家多就偷”当规则？",
            "answer": "选择当前房屋会影响相邻可选范围，需要比较两种完整前缀方案的收益，而非只比较两个房屋金额。"
          },
          "source": "02-Wiki/题目详解/198-打家劫舍.md",
          "codeBlock": 0,
          "code": "def rob(nums):\n    if not nums:\n        return 0\n    n = len(nums)\n    if n == 1:\n        return nums[0]\n    dp = [0] * (n + 1)\n    dp[1] = nums[0]\n    for i in range(2, n + 1):\n        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])\n    return dp[n]",
          "url": "https://leetcode.cn/problems/house-robber/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/198-%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8D.md",
          "sourceHash": "9b55c9522c0b9f966a56f7d4d372e262aed3d563244f725c0252d4396117224c"
        },
        {
          "uid": "lc-62",
          "id": 62,
          "group": "grid",
          "title": "不同路径",
          "level": "Medium",
          "prompt": "一个机器人位于一个 m x n 网格的左上角（起始点在下图中标记为 \"Start\"）。\n\n机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。\n\n问总共有多少条不同的路径？",
          "example": "输入：m = 3, n = 7\n输出：28",
          "hint": "先问自己：转移从哪些邻居来，决定遍历或缓存的顺序。",
          "recognition": "只能向右或向下求路径数",
          "mnemonic": "上方加左方，边界只有一种。",
          "why": "只能向右或向下求路径数。dp[i][j] 为走到该格的路径数，每条路径最后来自上或左且两类互斥。",
          "invariant": "dp[i][j] 为走到该格的路径数，每条路径最后来自上或左且两类互斥。",
          "steps": [
            "第一行和第一列设为 1",
            "内部把上方与左方相加",
            "返回右下角"
          ],
          "trace": "输入：m = 3, n = 7\n输出：28\n\n手推时记录：dp[i][j] 为走到该格的路径数，每条路径最后来自上或左且两类互斥。\n\n边界检查：为什么第一行所有格子都是 1？\n不能从上方进入第一行，也不能回头，因此只能一路向右；第一列同理。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么第一行所有格子都是 1？\n不能从上方进入第一行，也不能回头，因此只能一路向右；第一列同理。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-grid"
          ],
          "related": [
            {
              "id": 64,
              "kind": "聚合方式",
              "why": "网格依赖都来自上方与左方；62 将互斥走法相加，64 取最小路径成本再加当前权重。"
            },
            {
              "id": 118,
              "kind": "同递推不同形状",
              "why": "都从两个前驱相加生成当前状态；62 在矩形网格，118 在逐行增长的三角结构中处理边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么第一行所有格子都是 1？",
            "answer": "不能从上方进入第一行，也不能回头，因此只能一路向右；第一列同理。"
          },
          "source": "02-Wiki/题目详解/62-不同路径.md",
          "codeBlock": 0,
          "code": "def uniquePaths(m, n):\n    # 创建全 1 的 m x n 网格，第一行和第一列已正确初始化\n    dp = [[1] * n for _ in range(m)]\n\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]\n\n    return dp[m - 1][n - 1]",
          "url": "https://leetcode.cn/problems/unique-paths/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/62-%E4%B8%8D%E5%90%8C%E8%B7%AF%E5%BE%84.md",
          "sourceHash": "c0da4fdaba0b7d42e67887ce3e4caa66618cf11abe1c2c1757903ce734954e67"
        },
        {
          "uid": "lc-746",
          "id": 746,
          "group": "prefix",
          "title": "使用最小花费爬楼梯",
          "level": "Easy",
          "prompt": "cost[i] 是踩第 i 级的费用，每步可上 1 或 2 级，允许从下标 0 或 1 开始。楼顶在数组末尾之外且不收费，求到达楼顶的最小总费用。",
          "example": "cost=[10,15,20]，可从第 1 级跨到顶端，最小成本为 15。",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "楼梯有费用且可从 0 或 1 开始",
          "mnemonic": "当前付费，加上两前驱较小值。",
          "why": "楼梯有费用且可从 0 或 1 开始。两个滚动变量表示最近两级台阶已付费到达的最小成本。",
          "invariant": "两个滚动变量表示最近两级台阶已付费到达的最小成本。",
          "steps": [
            "初始两个虚拟前驱成本为 0",
            "每级取两前驱最小再加本级费用",
            "跨到楼顶取末两级最小值"
          ],
          "trace": "cost=[10,15,20]，可从第 1 级跨到顶端，最小成本为 15。\n\n手推时记录：两个滚动变量表示最近两级台阶已付费到达的最小成本。\n\n边界检查：为什么最后返回两个状态的 min，而不是只取最后一级？\n楼顶在数组末尾之外，可以从最后一级走一阶或倒数第二级走两阶抵达，不必踩最后一级。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么最后返回两个状态的 min，而不是只取最后一级？\n楼顶在数组末尾之外，可以从最后一级走一阶或倒数第二级走两阶抵达，不必踩最后一级。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 70,
              "kind": "目标变化",
              "why": "相同的前一阶和前两阶依赖，70 相加统计走法，746 取较小费用并加入当前成本。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么最后返回两个状态的 min，而不是只取最后一级？",
            "answer": "楼顶在数组末尾之外，可以从最后一级走一阶或倒数第二级走两阶抵达，不必踩最后一级。"
          },
          "source": "02-Wiki/题目详解/746-使用最小花费爬楼梯.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def minCostClimbingStairs(self, cost: List[int]) -> int:\n        first = second = 0\n        for value in cost:\n            first, second = second, min(first, second) + value\n        return min(first, second)",
          "url": "https://leetcode.cn/problems/min-cost-climbing-stairs/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/746-%E4%BD%BF%E7%94%A8%E6%9C%80%E5%B0%8F%E8%8A%B1%E8%B4%B9%E7%88%AC%E6%A5%BC%E6%A2%AF.md",
          "sourceHash": "7bdf48c99df0f6fd6e5fcefc0e23e04bed7f5c48902300bcb6af2235a243128e"
        },
        {
          "uid": "lc-213",
          "id": 213,
          "group": "prefix",
          "title": "打家劫舍 II",
          "level": "Medium",
          "prompt": "nums 为环形一排房屋的金额，第一家与最后一家也相邻。不能同时偷相邻两家；只有一家时可以偷它。求最大可偷金额。",
          "example": "[2,3,2] 不能同时拿两端 2，最优是 3。",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "房屋首尾也相邻",
          "mnemonic": "去掉首或去掉尾，各做一次直线。",
          "why": "房屋首尾也相邻。任何合法方案不能同时包含首尾，因此至少落在两条线性子问题之一。",
          "invariant": "任何合法方案不能同时包含首尾，因此至少落在两条线性子问题之一。",
          "steps": [
            "一家单独返回",
            "求 nums[1:] 的打家劫舍",
            "求 nums[:-1] 并取较大"
          ],
          "trace": "[2,3,2] 不能同时拿两端 2，最优是 3。\n\n手推时记录：任何合法方案不能同时包含首尾，因此至少落在两条线性子问题之一。\n\n边界检查：两个子问题的答案有重叠，为什么不用去重？\n这里只求最大收益，不是统计方案数量；同一合法方案出现在两边不会影响取最大值。",
          "traceLabel": "例子与边界推演",
          "trap": "两个子问题的答案有重叠，为什么不用去重？\n这里只求最大收益，不是统计方案数量；同一合法方案出现在两边不会影响取最大值。",
          "complexity": "时间 O(n)，此切片实现额外空间 O(n)，滚动状态本身 O(1)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 198,
              "kind": "首尾约束",
              "why": "213 首尾相邻，不能直接套直线状态；排除首或尾后分别复用198。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "两个子问题的答案有重叠，为什么不用去重？",
            "answer": "这里只求最大收益，不是统计方案数量；同一合法方案出现在两边不会影响取最大值。"
          },
          "source": "02-Wiki/题目详解/213-打家劫舍II.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def rob(self, nums: List[int]) -> int:\n        if len(nums) == 1:\n            return nums[0]\n\n        def rob_line(values: List[int]) -> int:\n            previous = current = 0\n            for value in values:\n                previous, current = current, max(current, previous + value)\n            return current\n\n        return max(rob_line(nums[1:]), rob_line(nums[:-1]))",
          "url": "https://leetcode.cn/problems/house-robber-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/213-%E6%89%93%E5%AE%B6%E5%8A%AB%E8%88%8DII.md",
          "sourceHash": "f5a4b33bc7ef9c98574b8237bf983335882fafe3751f875c98419649b21d63f6"
        },
        {
          "uid": "lc-309",
          "id": 309,
          "group": "prefix",
          "title": "最佳买卖股票时机含冷冻期",
          "level": "Medium",
          "prompt": "prices[i] 为当天股价，可完成多次先买后卖的交易，但同时最多持有一股。卖出后的下一天不能买入，求最大总利润。",
          "example": "[1,2,3,0,2]：买 1 卖 2，冷冻，买 0 卖 2，利润 3。",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "股票可多次交易但卖后冷却一天",
          "mnemonic": "持有、刚卖、休息三态分开。",
          "why": "股票可多次交易但卖后冷却一天。hold、sold、rest 分别表示当天结束的三类最佳收益，买入只能从前一天 rest 转移。",
          "invariant": "hold、sold、rest 分别表示当天结束的三类最佳收益，买入只能从前一天 rest 转移。",
          "steps": [
            "保存前一天三态",
            "更新继续持有或休息后买入、今天卖出、继续休息或冷却结束",
            "返回两个不持股状态的最大值"
          ],
          "trace": "[1,2,3,0,2]：买 1 卖 2，冷冻，买 0 卖 2，利润 3。\n\n手推时记录：hold、sold、rest 分别表示当天结束的三类最佳收益，买入只能从前一天 rest 转移。\n\n边界检查：为什么不能用前一天 sold 直接减今天价格作为买入？\n前一天刚卖，今天必须冷却，不能立即买入；只有前一天已经处于 rest 才可转入 hold。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能用前一天 sold 直接减今天价格作为买入？\n前一天刚卖，今天必须冷却，不能立即买入；只有前一天已经处于 rest 才可转入 hold。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 198,
              "kind": "状态细化",
              "why": "都要记录历史对当前选择的限制；309 除持有与否，还需区分刚卖出与可买入休息，表达冷却一天。"
            },
            {
              "id": 121,
              "kind": "交易规则变化",
              "why": "121 只做一次交易，保存历史最低价即可；309 可多次交易且有冷却，需要用三态保存交易阶段。"
            },
            {
              "id": 621,
              "kind": "同词不同约束",
              "why": "都有冷却约束，但621可任意重排任务，只求最短总时长，由最大频次决定；309股价日期不能重排，买卖收益取决于当天状态，需要区分持有、刚卖出与休息。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能用前一天 sold 直接减今天价格作为买入？",
            "answer": "前一天刚卖，今天必须冷却，不能立即买入；只有前一天已经处于 rest 才可转入 hold。"
          },
          "source": "02-Wiki/题目详解/309-最佳买卖股票时机含冷冻期.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        hold, sold, rest = float(\"-inf\"), 0, 0\n        for price in prices:\n            previous_hold, previous_sold, previous_rest = hold, sold, rest\n            hold = max(previous_hold, previous_rest - price)\n            sold = previous_hold + price\n            rest = max(previous_rest, previous_sold)\n        return max(sold, rest)",
          "url": "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/309-%E6%9C%80%E4%BD%B3%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E6%97%B6%E6%9C%BA%E5%90%AB%E5%86%B7%E5%86%BB%E6%9C%9F.md",
          "sourceHash": "7f478bfaa4a69d0ad26ce44b85d5527d859ae4dd168aa2e5dff7ccac3f08df95"
        },
        {
          "uid": "lc-91",
          "id": 91,
          "group": "prefix",
          "title": "解码方法",
          "level": "Medium",
          "prompt": "数字字符串按 1→A 到 26→Z 解码，求不同解码数量。",
          "example": "\"226\" 可解为 BZ、VF、BBF，共 3 种。",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "数字串按 1…26 解码",
          "mnemonic": "合法单字接前一，合法双字接前二。",
          "why": "数字串按 1…26 解码。one_back 是已处理前缀的解码数，two_back 是少一个字符的前缀解码数。",
          "invariant": "one_back 是已处理前缀的解码数，two_back 是少一个字符的前缀解码数。",
          "steps": [
            "前导零返回 0",
            "非零当前字符可接前一状态",
            "两位在 10…26 时再加前二状态"
          ],
          "trace": "\"226\" 可解为 BZ、VF、BBF，共 3 种。\n\n手推时记录：one_back 是已处理前缀的解码数，two_back 是少一个字符的前缀解码数。\n\n边界检查：10 与 06 为什么结果不同？\n0 不能独立解码，10 是合法两位编码而 06 不在 10…26 内，因此 10 有一种、06 没有。",
          "traceLabel": "例子与边界推演",
          "trap": "10 与 06 为什么结果不同？\n0 不能独立解码，10 是合法两位编码而 06 不在 10…26 内，因此 10 有一种、06 没有。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 70,
              "kind": "条件变化",
              "why": "都可能从前一或前二位置转移；91 每条转移还要通过单字非零或两字在10…26的合法性检查。"
            },
            {
              "id": 139,
              "kind": "前缀分割",
              "why": "91 最后一段只可能长1或2且有数字范围限制；139 最后一段长度不固定，合法性由词典决定。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "10 与 06 为什么结果不同？",
            "answer": "0 不能独立解码，10 是合法两位编码而 06 不在 10…26 内，因此 10 有一种、06 没有。"
          },
          "source": "02-Wiki/题目详解/91-解码方法.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def numDecodings(self, s: str) -> int:\n        if not s or s[0] == \"0\":\n            return 0\n        two_back, one_back = 1, 1\n        for i in range(1, len(s)):\n            current = 0\n            if s[i] != \"0\":\n                current += one_back\n            if 10 <= int(s[i - 1:i + 1]) <= 26:\n                current += two_back\n            two_back, one_back = one_back, current\n        return one_back",
          "url": "https://leetcode.cn/problems/decode-ways/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/91-%E8%A7%A3%E7%A0%81%E6%96%B9%E6%B3%95.md",
          "sourceHash": "0101600f753f3c027a0a6abbdbef1f2893077632b3dd7262fa531736c39bb266"
        },
        {
          "uid": "lc-139",
          "id": 139,
          "group": "prefix",
          "title": "单词拆分",
          "level": "Medium",
          "prompt": "给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s。\n\n注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。",
          "example": "输入: s = \"leetcode\", wordDict = [\"leet\", \"code\"]\n输出: true",
          "hint": "先问自己：明确答案覆盖的范围，以及哪些历史状态会影响今天的选择。",
          "recognition": "字典词可复用，判断整串能否切开",
          "mnemonic": "前缀可达且最后一段在词典。",
          "why": "字典词可复用，判断整串能否切开。dp[i] 表示前 i 个字符可完全拆成词典中的单词。",
          "invariant": "dp[i] 表示前 i 个字符可完全拆成词典中的单词。",
          "steps": [
            "词典转集合且 dp[0]=True",
            "枚举终点及之前切点",
            "若 dp[j] 且 s[j:i] 是词则标 True"
          ],
          "trace": "输入: s = \"leetcode\", wordDict = [\"leet\", \"code\"]\n输出: true\n解释: 返回 true 因为 \"leetcode\" 可以由 \"leet\" 和 \"code\" 拼接成。\n\n手推时记录：dp[i] 表示前 i 个字符可完全拆成词典中的单词。\n\n边界检查：为什么找到一个可行切点后可以 break？\n状态只问是否可行，一种成功拆法已经足够；若改成统计拆法或输出全部方案，就不能提前停止。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么找到一个可行切点后可以 break？\n状态只问是否可行，一种成功拆法已经足够；若改成统计拆法或输出全部方案，就不能提前停止。",
          "complexity": "此 Python 切片与哈希实现最坏 O(n³+C) 时间，空间 O(n+C)，C 为词典字符量。",
          "prerequisites": [
            "10-prefix"
          ],
          "related": [
            {
              "id": 91,
              "kind": "前缀分割",
              "why": "91 最后一段只可能长1或2且有数字范围限制；139 最后一段长度不固定，合法性由词典决定。"
            },
            {
              "id": 131,
              "kind": "输出变化",
              "why": "139 只问能否把前缀拆开，成功一个切点就够；131 要列出所有回文分割，需继续探索并保存路径。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么找到一个可行切点后可以 break？",
            "answer": "状态只问是否可行，一种成功拆法已经足够；若改成统计拆法或输出全部方案，就不能提前停止。"
          },
          "source": "02-Wiki/题目详解/139-单词拆分.md",
          "codeBlock": 0,
          "code": "def wordBreak(s, wordDict):\n    word_set = set(wordDict)               # 哈希集，O(1) 查找\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True                           # 空字符串可以拼出\n\n    for i in range(1, n + 1):\n        for j in range(i):                 # 枚举切割点\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break                      # 找到即可退出\n\n    return dp[n]",
          "url": "https://leetcode.cn/problems/word-break/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/139-%E5%8D%95%E8%AF%8D%E6%8B%86%E5%88%86.md",
          "sourceHash": "83d0e47f3cb1580b9bc6b31451afb03e203cfef17f00ad39d64f6b06b16ff909"
        },
        {
          "uid": "lc-300",
          "id": 300,
          "group": "ending",
          "title": "最长递增子序列",
          "level": "Medium",
          "prompt": "给你一个整数数组 nums，找到其中最长严格递增子序列的长度。\n\n子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。",
          "example": "输入：nums = [10,9,2,5,3,7,101,18]\n输出：4",
          "hint": "先问自己：当前位置状态负责能否延续，最终答案通常要在所有位置上取最大。",
          "recognition": "最长严格递增子序列可跳元素",
          "mnemonic": "接上所有更小前驱中的最佳。",
          "why": "最长严格递增子序列可跳元素。dp[i] 是必须以 nums[i] 结尾的最长递增子序列长度。",
          "invariant": "dp[i] 是必须以 nums[i] 结尾的最长递增子序列长度。",
          "steps": [
            "各位置至少长度 1",
            "枚举 j<i 且 nums[j]<nums[i]",
            "取 dp[j]+1 更新，最终返回所有 dp 的最大值"
          ],
          "trace": "输入：nums = [10,9,2,5,3,7,101,18]\n输出：4\n解释：最长递增子序列是 [2,3,7,101]，因此长度为 4。\n\n手推时记录：dp[i] 是必须以 nums[i] 结尾的最长递增子序列长度。\n\n边界检查：为什么不能直接返回 dp[n−1]？\n最佳序列不一定使用最后元素，例如 [1,2,3,0] 的最佳长度 3 在前面结束，末位状态只有 1。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能直接返回 dp[n−1]？\n最佳序列不一定使用最后元素，例如 [1,2,3,0] 的最佳长度 3 在前面结束，末位状态只有 1。",
          "complexity": "此推荐基础 DP：时间 O(n²)，空间 O(n)。",
          "prerequisites": [
            "10-ending"
          ],
          "related": [
            {
              "id": 1143,
              "kind": "序列约束",
              "why": "都允许跳过元素；300 在单序列中要求数值递增，1143 在两个序列中要求选出相同字符顺序。"
            },
            {
              "id": 329,
              "kind": "前驱形状",
              "why": "都求严格递增长度；300 可接任意较早下标，329 只能走相邻格，值的严格增加提供无环依赖。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能直接返回 dp[n−1]？",
            "answer": "最佳序列不一定使用最后元素，例如 [1,2,3,0] 的最佳长度 3 在前面结束，末位状态只有 1。"
          },
          "source": "02-Wiki/题目详解/300-最长递增子序列.md",
          "codeBlock": 0,
          "code": "def lengthOfLIS(nums):\n    if not nums:\n        return 0\n    n = len(nums)\n    dp = [1] * n                        # 至少包含自身\n    for i in range(n):\n        for j in range(i):              # 枚举 i 前面的元素\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)                      # 取所有位置结尾的最大值",
          "url": "https://leetcode.cn/problems/longest-increasing-subsequence/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/300-%E6%9C%80%E9%95%BF%E9%80%92%E5%A2%9E%E5%AD%90%E5%BA%8F%E5%88%97.md",
          "sourceHash": "0be9a32bff4cd3e620ead354625a7f7b9d9847cd0e707c942ad21b5bcf13108d"
        },
        {
          "uid": "lc-152",
          "id": 152,
          "group": "ending",
          "title": "乘积最大子数组",
          "level": "Medium",
          "prompt": "给你一个整数数组 nums，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。",
          "example": "输入: [2,3,-2,4]\n输出: 6",
          "hint": "先问自己：当前位置状态负责能否延续，最终答案通常要在所有位置上取最大。",
          "recognition": "连续乘积可能因负数翻转",
          "mnemonic": "最大最小都留，负数先交换。",
          "why": "连续乘积可能因负数翻转。max_prod 与 min_prod 是必须以当前位置结尾的最大和最小乘积，result 是全局最大。",
          "invariant": "max_prod 与 min_prod 是必须以当前位置结尾的最大和最小乘积，result 是全局最大。",
          "steps": [
            "负数到来先交换两极值",
            "分别比较重启于当前值或延续",
            "更新全局最大"
          ],
          "trace": "输入: [2,3,-2,4]\n输出: 6\n解释: 子数组 [2,3] 有最大乘积 6。\n\n手推时记录：max_prod 与 min_prod 是必须以当前位置结尾的最大和最小乘积，result 是全局最大。\n\n边界检查：为什么只保存最大乘积不够？\n一个很小的负乘积再乘负数可能变成最大值，如 [-2,3,-4]；最小乘积保存了这条未来可能翻转的路径。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么只保存最大乘积不够？\n一个很小的负乘积再乘负数可能变成最大值，如 [-2,3,-4]；最小乘积保存了这条未来可能翻转的路径。",
          "complexity": "时间 O(n)；当前代码 nums[1:] 切片使额外空间 O(n)，状态变量 O(1)。",
          "prerequisites": [
            "10-ending"
          ],
          "related": [
            {
              "id": 53,
              "kind": "运算变化",
              "why": "53 的连续和只需留最佳结尾和；152 乘负数会翻转大小，必须同时留最大与最小结尾乘积。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么只保存最大乘积不够？",
            "answer": "一个很小的负乘积再乘负数可能变成最大值，如 [-2,3,-4]；最小乘积保存了这条未来可能翻转的路径。"
          },
          "source": "02-Wiki/题目详解/152-乘积最大子数组.md",
          "codeBlock": 0,
          "code": "def maxProduct(nums):\n    max_prod = min_prod = result = nums[0]\n\n    for num in nums[1:]:\n        # 如果遇到负数，最大和最小互换（因为乘以负数后大小关系翻转）\n        if num < 0:\n            max_prod, min_prod = min_prod, max_prod\n\n        # 更新当前最大/最小乘积\n        max_prod = max(num, max_prod * num)\n        min_prod = min(num, min_prod * num)\n\n        # 更新全局最大\n        result = max(result, max_prod)\n\n    return result",
          "url": "https://leetcode.cn/problems/maximum-product-subarray/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/152-%E4%B9%98%E7%A7%AF%E6%9C%80%E5%A4%A7%E5%AD%90%E6%95%B0%E7%BB%84.md",
          "sourceHash": "85e277772f79d2141aec50da3b1fc751e4ece68611f83d200d62907c40b26dfe"
        },
        {
          "uid": "lc-32",
          "id": 32,
          "group": "ending",
          "title": "最长有效括号",
          "level": "Hard",
          "prompt": "给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。",
          "example": "输入：s = \"(()\"\n输出：2",
          "hint": "先问自己：当前位置状态负责能否延续，最终答案通常要在所有位置上取最大。",
          "recognition": "最长连续合法括号",
          "mnemonic": "遇右括号，跨过上一合法段找配对。",
          "why": "最长连续合法括号。dp[i] 表示必须以 i 结尾的最长合法括号子串长度。",
          "invariant": "dp[i] 表示必须以 i 结尾的最长合法括号子串长度。",
          "steps": [
            "当前为左括号保持零",
            "前一位为左则接成一对",
            "否则跳过 dp[i−1] 长度找左括号，再接它之前的合法段"
          ],
          "trace": "输入：s = \"(()\"\n输出：2\n解释：最长有效括号子串是 \"()\"\n\n手推时记录：dp[i] 表示必须以 i 结尾的最长合法括号子串长度。\n\n边界检查：找到跨段左括号后，为什么还要加 dp[j−1]？\n新配对可能把前面相邻的合法段连接起来，如 ()(())；只计算内部与新一对会漏掉前面的 ()。",
          "traceLabel": "例子与边界推演",
          "trap": "找到跨段左括号后，为什么还要加 dp[j−1]？\n新配对可能把前面相邻的合法段连接起来，如 ()(())；只计算内部与新一对会漏掉前面的 ()。",
          "complexity": "时间 O(n)，空间 O(n)。",
          "prerequisites": [
            "10-ending"
          ],
          "related": [
            {
              "id": 20,
              "kind": "状态变化",
              "why": "20 判断整串是否合法；32 要找连续合法段最大长度，需要保存每个位置结尾的长度并连接相邻合法段。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "找到跨段左括号后，为什么还要加 dp[j−1]？",
            "answer": "新配对可能把前面相邻的合法段连接起来，如 ()(())；只计算内部与新一对会漏掉前面的 ()。"
          },
          "source": "02-Wiki/题目详解/32-最长有效括号.md",
          "codeBlock": 0,
          "code": "def longestValidParentheses(s):\n    n = len(s)\n    if n < 2:\n        return 0\n    dp = [0] * n\n    ans = 0\n\n    for i in range(1, n):\n        if s[i] == ')':                           # 只有 ) 可能配对\n            if s[i - 1] == '(':                   # 情况 1: ...()\n                dp[i] = (dp[i - 2] if i >= 2 else 0) + 2\n            else:                                 # 情况 2: ...))\n                j = i - dp[i - 1] - 1             # 与当前 ) 配对的位置\n                if j >= 0 and s[j] == '(':\n                    dp[i] = dp[i - 1] + 2 + (dp[j - 1] if j >= 1 else 0)\n            ans = max(ans, dp[i])\n\n    return ans",
          "url": "https://leetcode.cn/problems/longest-valid-parentheses/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/32-%E6%9C%80%E9%95%BF%E6%9C%89%E6%95%88%E6%8B%AC%E5%8F%B7.md",
          "sourceHash": "94b4dcb2e4521f05cded72884093e0f9ec15d39a385d0c80240cff131f5556ee"
        },
        {
          "uid": "lc-64",
          "id": 64,
          "group": "grid",
          "title": "最小路径和",
          "level": "Medium",
          "prompt": "给定一个包含非负整数的 m x n 网格 grid，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。\n\n说明： 每次只能向下或者向右移动一步。",
          "example": "输入：grid = [[1,3,1],[1,5,1],[4,2,1]]\n输出：7",
          "hint": "先问自己：转移从哪些邻居来，决定遍历或缓存的顺序。",
          "recognition": "只能向右或向下求最小路径和",
          "mnemonic": "当前权重加较小前驱。",
          "why": "只能向右或向下求最小路径和。dp[i][j] 为从左上到该格且包含当前格权重的最小总和。",
          "invariant": "dp[i][j] 为从左上到该格且包含当前格权重的最小总和。",
          "steps": [
            "起点等于自身权重",
            "第一行列累加",
            "内部取上、左较小值再加当前"
          ],
          "trace": "输入：grid = [[1,3,1],[1,5,1],[4,2,1]]\n输出：7\n解释：因为路径 1→3→1→1→1 的总和最小。\n\n手推时记录：dp[i][j] 为从左上到该格且包含当前格权重的最小总和。\n\n边界检查：为什么第一行列不能全部初始化为当前格权重？\n到达边界格仍要经过前面所有边界格，它们的成本也要累加；不能凭空从任意边界进入。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么第一行列不能全部初始化为当前格权重？\n到达边界格仍要经过前面所有边界格，它们的成本也要累加；不能凭空从任意边界进入。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-grid"
          ],
          "related": [
            {
              "id": 62,
              "kind": "聚合方式",
              "why": "网格依赖都来自上方与左方；62 将互斥走法相加，64 取最小路径成本再加当前权重。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么第一行列不能全部初始化为当前格权重？",
            "answer": "到达边界格仍要经过前面所有边界格，它们的成本也要累加；不能凭空从任意边界进入。"
          },
          "source": "02-Wiki/题目详解/64-最小路径和.md",
          "codeBlock": 0,
          "code": "def minPathSum(grid):\n    m, n = len(grid), len(grid[0])\n    dp = [[0] * n for _ in range(m)]\n\n    dp[0][0] = grid[0][0]\n    # 初始化第一行\n    for j in range(1, n):\n        dp[0][j] = dp[0][j - 1] + grid[0][j]\n    # 初始化第一列\n    for i in range(1, m):\n        dp[i][0] = dp[i - 1][0] + grid[i][0]\n\n    # DP 递推\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = grid[i][j] + min(dp[i - 1][j], dp[i][j - 1])\n\n    return dp[m - 1][n - 1]",
          "url": "https://leetcode.cn/problems/minimum-path-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/64-%E6%9C%80%E5%B0%8F%E8%B7%AF%E5%BE%84%E5%92%8C.md",
          "sourceHash": "4dfd790c1ddd3a1e1d6d9fc79b707bfb12cb5d1631dab3187f7be35e292b1960"
        },
        {
          "uid": "lc-118",
          "id": 118,
          "group": "grid",
          "title": "杨辉三角",
          "level": "Easy",
          "prompt": "给定一个非负整数 numRows，生成杨辉三角的前 numRows 行。\n\n在杨辉三角中，每个数是它左上方和正上方的数之和。",
          "example": "输入: numRows = 5\n输出:\n[\n     [1],\n    [1,1],\n   [1,2,1],\n  [1,3,3,1],\n [1,4,6,4,1]\n]",
          "hint": "先问自己：转移从哪些邻居来，决定遍历或缓存的顺序。",
          "recognition": "杨辉三角每行由上行生成",
          "mnemonic": "两边一，中间加左上与右上。",
          "why": "杨辉三角每行由上行生成。已保存的第 i−1 行完整且不会再改变，可作为当前行所有中间位置的依赖。",
          "invariant": "已保存的第 i−1 行完整且不会再改变，可作为当前行所有中间位置的依赖。",
          "steps": [
            "当前行初始化为 1",
            "内部位置累加上行相邻两项",
            "追加完整行"
          ],
          "trace": "输入: numRows = 5\n输出:\n[\n     [1],\n    [1,1],\n   [1,2,1],\n  [1,3,3,1],\n [1,4,6,4,1]\n]\n\n手推时记录：已保存的第 i−1 行完整且不会再改变，可作为当前行所有中间位置的依赖。\n\n边界检查：为什么新行长度必须是 i+1？\n第零行只有一个 1，每向下一行左右边界各扩展出结构，行长度增加一；内部 j=1…i−1 才有两个父项。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么新行长度必须是 i+1？\n第零行只有一个 1，每向下一行左右边界各扩展出结构，行长度增加一；内部 j=1…i−1 才有两个父项。",
          "complexity": "n 行：时间与输出空间 O(n²)，单行临时空间 O(n)。",
          "prerequisites": [
            "10-grid"
          ],
          "related": [
            {
              "id": 62,
              "kind": "同递推不同形状",
              "why": "都从两个前驱相加生成当前状态；62 在矩形网格，118 在逐行增长的三角结构中处理边界。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么新行长度必须是 i+1？",
            "answer": "第零行只有一个 1，每向下一行左右边界各扩展出结构，行长度增加一；内部 j=1…i−1 才有两个父项。"
          },
          "source": "02-Wiki/题目详解/118-杨辉三角.md",
          "codeBlock": 0,
          "code": "def generate(numRows):\n    res = []                              # 存储所有行\n    for i in range(numRows):\n        row = [1] * (i + 1)               # 当前行，首尾默认为 1\n        for j in range(1, i):             # 从第 2 个到倒数第 2 个\n            row[j] = res[i - 1][j - 1] + res[i - 1][j]\n        res.append(row)\n    return res",
          "url": "https://leetcode.cn/problems/pascals-triangle/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/118-%E6%9D%A8%E8%BE%89%E4%B8%89%E8%A7%92.md",
          "sourceHash": "c1dfd116f57bc4738e8aa62e706443ae176e3655fb132a7934c836e7103c8e63"
        },
        {
          "uid": "lc-329",
          "id": 329,
          "group": "grid",
          "title": "矩阵中的最长递增路径",
          "level": "Hard",
          "prompt": "在矩阵中上下左右移动，求严格递增路径最大长度。",
          "example": "[[9,9,4],[6,6,8],[2,1,1]] 的最长路径为 1→2→6→9，长度 4。",
          "hint": "先问自己：转移从哪些邻居来，决定遍历或缓存的顺序。",
          "recognition": "网格找严格递增最长路径",
          "mnemonic": "每格答案缓存一次，沿更大邻居延续。",
          "why": "网格找严格递增最长路径。dfs(r,c) 是从该格开始的最长递增路径；严格增大保证递归依赖无环。",
          "invariant": "dfs(r,c) 是从该格开始的最长递增路径；严格增大保证递归依赖无环。",
          "steps": [
            "为 DFS 加缓存",
            "仅递归更大相邻格",
            "状态取 1 加最佳后继，所有起点中取最大"
          ],
          "trace": "[[9,9,4],[6,6,8],[2,1,1]] 的最长路径为 1→2→6→9，长度 4。\n\n手推时记录：dfs(r,c) 是从该格开始的最长递增路径；严格增大保证递归依赖无环。\n\n边界检查：为什么不需要路径 visited 集合？\n严格递增使路径不可能回到以前较小或相同的格子，天然无环；同一格的最优后缀还可被多个起点复用。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不需要路径 visited 集合？\n严格递增使路径不可能回到以前较小或相同的格子，天然无环；同一格的最优后缀还可被多个起点复用。",
          "complexity": "时间 O(mn)，缓存及最坏递归栈 O(mn)。",
          "prerequisites": [
            "10-grid"
          ],
          "related": [
            {
              "id": 300,
              "kind": "前驱形状",
              "why": "都求严格递增长度；300 可接任意较早下标，329 只能走相邻格，值的严格增加提供无环依赖。"
            },
            {
              "id": 207,
              "kind": "隐含无环图",
              "why": "329 只从低值连到高值，天然构成 DAG，可缓存DFS；207 则必须先检查给定依赖能否形成无环顺序。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不需要路径 visited 集合？",
            "answer": "严格递增使路径不可能回到以前较小或相同的格子，天然无环；同一格的最优后缀还可被多个起点复用。"
          },
          "source": "02-Wiki/题目详解/329-矩阵中的最长递增路径.md",
          "codeBlock": 0,
          "code": "from functools import cache\nfrom typing import List\n\n\nclass Solution:\n    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:\n        rows, cols = len(matrix), len(matrix[0])\n\n        @cache\n        def dfs(r: int, c: int) -> int:\n            best = 1\n            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:\n                    best = max(best, 1 + dfs(nr, nc))\n            return best\n\n        return max(dfs(r, c) for r in range(rows) for c in range(cols))",
          "url": "https://leetcode.cn/problems/longest-increasing-path-in-a-matrix/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/329-%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E9%95%BF%E9%80%92%E5%A2%9E%E8%B7%AF%E5%BE%84.md",
          "sourceHash": "6861151c122a01c98585f3ce856c080369dda77a93f44ad313576a38b556cc93"
        },
        {
          "uid": "lc-416",
          "id": 416,
          "group": "capacity",
          "title": "分割等和子集",
          "level": "Medium",
          "prompt": "给你一个只包含正整数的非空数组 nums。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。",
          "example": "输入：nums = [1,5,11,5]\n输出：true",
          "hint": "先问自己：先选状态的含义，再确定物品能否复用与循环方向。",
          "recognition": "正整数能否平分",
          "mnemonic": "找半和，容量倒序防复用。",
          "why": "正整数能否平分。处理一个数时，dp[j−num] 仍代表未使用当前数的上一轮可达性。",
          "invariant": "处理一个数时，dp[j−num] 仍代表未使用当前数的上一轮可达性。",
          "steps": [
            "总和奇数直接失败",
            "dp[0]=True",
            "每个数按容量从大到小更新可达性"
          ],
          "trace": "输入：nums = [1,5,11,5]\n输出：true\n解释：数组可以分割成 [1, 5, 5] 和 [11]。\n\n手推时记录：处理一个数时，dp[j−num] 仍代表未使用当前数的上一轮可达性。\n\n边界检查：为什么容量必须倒序？\n正序可能读取本轮刚更新的状态，把同一个位置的数用多次；倒序确保每个输入位置最多贡献一次。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么容量必须倒序？\n正序可能读取本轮刚更新的状态，把同一个位置的数用多次；倒序确保每个输入位置最多贡献一次。",
          "complexity": "总和 S：时间 O(nS)，空间 O(S)。",
          "prerequisites": [
            "10-capacity"
          ],
          "related": [
            {
              "id": 494,
              "kind": "状态含义变化",
              "why": "都把输入位置看作0/1物品并倒序容量；416 用 OR 表示可达，494 用加法统计符号对应的子集方案。"
            },
            {
              "id": 322,
              "kind": "易混淆",
              "why": "416 每个输入位置一次，容量倒序；322 同种硬币无限使用，容量正序且状态保存最少枚数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么容量必须倒序？",
            "answer": "正序可能读取本轮刚更新的状态，把同一个位置的数用多次；倒序确保每个输入位置最多贡献一次。"
          },
          "source": "02-Wiki/题目详解/416-分割等和子集.md",
          "codeBlock": 0,
          "code": "def canPartition(nums):\n    total = sum(nums)\n    if total % 2 != 0:                    # 总和为奇数，不可能平分\n        return False\n\n    target = total // 2\n    dp = [False] * (target + 1)\n    dp[0] = True                          # 和为 0 总是可以的\n\n    for num in nums:\n        for j in range(target, num - 1, -1):  # 倒序遍历，0-1 背包\n            dp[j] = dp[j] or dp[j - num]      # 不选 or 选\n\n    return dp[target]",
          "url": "https://leetcode.cn/problems/partition-equal-subset-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/416-%E5%88%86%E5%89%B2%E7%AD%89%E5%92%8C%E5%AD%90%E9%9B%86.md",
          "sourceHash": "be98d77758c3c5362d66b5cc8a906ede12a3762d8517df517751b8f0dad59946"
        },
        {
          "uid": "lc-494",
          "id": 494,
          "group": "capacity",
          "title": "目标和",
          "level": "Medium",
          "prompt": "nums 是非负整数数组。给每个位置分别添加 + 或 −，使表达式结果等于 target。返回不同符号选择的数量，零也有两种符号选择。",
          "example": "输入：nums=[1,1,1,1,1], target=3\n输出：5",
          "hint": "先问自己：先选状态的含义，再确定物品能否复用与循环方向。",
          "recognition": "每个数选正负号求方案数",
          "mnemonic": "正集合和是 (总和+目标)/2。",
          "why": "每个数选正负号求方案数。dp[j] 为使用已处理位置选出和 j 的子集方案数，每个位置最多一次。",
          "invariant": "dp[j] 为使用已处理位置选出和 j 的子集方案数，每个位置最多一次。",
          "steps": [
            "检查目标范围和奇偶",
            "dp[0]=1",
            "每个数倒序把 dp[j−num] 加入 dp[j]"
          ],
          "trace": "[1,1,1,1,1] 组成 3 有 5 种符号方案。\n\n手推时记录：dp[j] 为使用已处理位置选出和 j 的子集方案数，每个位置最多一次。\n\n边界检查：输入含 0 时，为什么更新会使已有方案数翻倍？\n+0 与 −0 是两种不同符号选择，但数值和相同；num=0 时 dp[j]+=dp[j] 正好记录这两种选择。",
          "traceLabel": "例子与边界推演",
          "trap": "输入含 0 时，为什么更新会使已有方案数翻倍？\n+0 与 −0 是两种不同符号选择，但数值和相同；num=0 时 dp[j]+=dp[j] 正好记录这两种选择。",
          "complexity": "目标容量 G=(S+target)/2：时间 O(nG)，空间 O(G)。",
          "prerequisites": [
            "10-capacity"
          ],
          "related": [
            {
              "id": 416,
              "kind": "状态含义变化",
              "why": "都把输入位置看作0/1物品并倒序容量；416 用 OR 表示可达，494 用加法统计符号对应的子集方案。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "输入含 0 时，为什么更新会使已有方案数翻倍？",
            "answer": "+0 与 −0 是两种不同符号选择，但数值和相同；num=0 时 dp[j]+=dp[j] 正好记录这两种选择。"
          },
          "source": "02-Wiki/题目详解/494-目标和.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def findTargetSumWays(self, nums: List[int], target: int) -> int:\n        total = sum(nums)\n        if abs(target) > total or (total + target) % 2:\n            return 0\n        goal = (total + target) // 2\n        dp = [0] * (goal + 1)\n        dp[0] = 1\n        for num in nums:\n            for value in range(goal, num - 1, -1):\n                dp[value] += dp[value - num]\n        return dp[goal]",
          "url": "https://leetcode.cn/problems/target-sum/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/494-%E7%9B%AE%E6%A0%87%E5%92%8C.md",
          "sourceHash": "6f4041420979dbcbd134f996660a1535e3f28b51624d0240620ed6ab6c188850"
        },
        {
          "uid": "lc-322",
          "id": 322,
          "group": "capacity",
          "title": "零钱兑换",
          "level": "Medium",
          "prompt": "给你一个整数数组 coins，表示不同面额的硬币；以及一个整数 amount，表示总金额。\n\n计算并返回可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，返回 -1。\n\n你可以认为每种硬币的数量是无限的。",
          "example": "输入：coins = [1, 2, 5], amount = 11\n输出：3",
          "hint": "先问自己：先选状态的含义，再确定物品能否复用与循环方向。",
          "recognition": "硬币无限使用求最少枚数",
          "mnemonic": "容量正序，可重复接当前币。",
          "why": "硬币无限使用求最少枚数。dp[j] 是当前可用币种凑成金额 j 的最少硬币数，不可达用大于可能答案的哨兵表示。",
          "invariant": "dp[j] 是当前可用币种凑成金额 j 的最少硬币数，不可达用大于可能答案的哨兵表示。",
          "steps": [
            "dp[0]=0，其他设 amount+1",
            "每种硬币正序更新 min(dp[j],dp[j−coin]+1)",
            "不可达返回 −1"
          ],
          "trace": "输入：coins = [1, 2, 5], amount = 11\n输出：3\n解释：11 = 5 + 5 + 1\n\n手推时记录：dp[j] 是当前可用币种凑成金额 j 的最少硬币数，不可达用大于可能答案的哨兵表示。\n\n边界检查：为什么这里容量正序，而416需要倒序？\n当前币种可以重复使用，读取本轮较小容量正是允许继续拿同一种币；416 每个位置只准一次。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么这里容量正序，而416需要倒序？\n当前币种可以重复使用，读取本轮较小容量正是允许继续拿同一种币；416 每个位置只准一次。",
          "complexity": "k 种币、金额 A：时间 O(kA)，空间 O(A)。",
          "prerequisites": [
            "10-capacity"
          ],
          "related": [
            {
              "id": 416,
              "kind": "易混淆",
              "why": "416 每个输入位置一次，容量倒序；322 同种硬币无限使用，容量正序且状态保存最少枚数。"
            },
            {
              "id": 518,
              "kind": "目标变化",
              "why": "都可无限用硬币且正序容量；322 用 min 求枚数，518 用加法计组合，并依靠币种外层防排列重复。"
            },
            {
              "id": 279,
              "kind": "候选变化",
              "why": "279 的可用硬币就是不超过 n 的完全平方数，同样用较小金额最优加一求最少个数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么这里容量正序，而416需要倒序？",
            "answer": "当前币种可以重复使用，读取本轮较小容量正是允许继续拿同一种币；416 每个位置只准一次。"
          },
          "source": "02-Wiki/题目详解/322-零钱兑换.md",
          "codeBlock": 0,
          "code": "def coinChange(coins, amount):\n    # dp[j] 表示凑成金额 j 的最少硬币数\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n\n    for coin in coins:                     # 遍历物品（硬币）\n        for j in range(coin, amount + 1):  # 正序遍历背包容量\n            dp[j] = min(dp[j], dp[j - coin] + 1)\n\n    return dp[amount] if dp[amount] != amount + 1 else -1",
          "url": "https://leetcode.cn/problems/coin-change/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/322-%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2.md",
          "sourceHash": "15e021de3df9b82f1db2c32e19deaf1ecb438179ddc61108585450b672be678b"
        },
        {
          "uid": "lc-518",
          "id": 518,
          "group": "capacity",
          "title": "零钱兑换 II",
          "level": "Medium",
          "prompt": "给定硬币面额，求凑出 amount 的组合数；硬币可无限使用，顺序不同不重复计数。",
          "example": "amount=5, coins=[1,2,5]，组合为 5、2+2+1、2+1+1+1、1×5，共 4 种。",
          "hint": "先问自己：先选状态的含义，再确定物品能否复用与循环方向。",
          "recognition": "无限硬币求组合数且不区分顺序",
          "mnemonic": "币在外，金额正序累加。",
          "why": "无限硬币求组合数且不区分顺序。处理前若干币种后，dp[j] 只统计由这些币种组成的无序组合。",
          "invariant": "处理前若干币种后，dp[j] 只统计由这些币种组成的无序组合。",
          "steps": [
            "dp[0]=1",
            "逐个币种",
            "金额正序累加 dp[j−coin]"
          ],
          "trace": "amount=5, coins=[1,2,5]，组合为 5、2+2+1、2+1+1+1、1×5，共 4 种。\n\n手推时记录：处理前若干币种后，dp[j] 只统计由这些币种组成的无序组合。\n\n边界检查：为什么把金额放外层、硬币放内层会改变计数？\n那会按最后一枚硬币区分构造顺序，把 1+2 与 2+1 分开统计为排列；币种外层给组合固定构造次序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么把金额放外层、硬币放内层会改变计数？\n那会按最后一枚硬币区分构造顺序，把 1+2 与 2+1 分开统计为排列；币种外层给组合固定构造次序。",
          "complexity": "k 种币、金额 A：时间 O(kA)，空间 O(A)。",
          "prerequisites": [
            "10-capacity"
          ],
          "related": [
            {
              "id": 322,
              "kind": "目标变化",
              "why": "都可无限用硬币且正序容量；322 用 min 求枚数，518 用加法计组合，并依靠币种外层防排列重复。"
            },
            {
              "id": 39,
              "kind": "枚举到计数",
              "why": "39 列出所有无限复用组合；518 只需数量，把相同金额状态合并成DP计数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么把金额放外层、硬币放内层会改变计数？",
            "answer": "那会按最后一枚硬币区分构造顺序，把 1+2 与 2+1 分开统计为排列；币种外层给组合固定构造次序。"
          },
          "source": "02-Wiki/题目详解/518-零钱兑换II.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def change(self, amount: int, coins: List[int]) -> int:\n        dp = [0] * (amount + 1)\n        dp[0] = 1\n        for coin in coins:\n            for value in range(coin, amount + 1):\n                dp[value] += dp[value - coin]\n        return dp[amount]",
          "url": "https://leetcode.cn/problems/coin-change-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/518-%E9%9B%B6%E9%92%B1%E5%85%91%E6%8D%A2II.md",
          "sourceHash": "25e77a37fd2a112eb8498a942d4fa36da8c3fafe904fa7e638b5d16886f322a4"
        },
        {
          "uid": "lc-279",
          "id": 279,
          "group": "capacity",
          "title": "完全平方数",
          "level": "Medium",
          "prompt": "给你一个整数 n，返回和为 n 的完全平方数的最少数量。\n\n完全平方数是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。",
          "example": "输入：n = 12\n输出：3",
          "hint": "先问自己：先选状态的含义，再确定物品能否复用与循环方向。",
          "recognition": "把 n 写成最少平方数之和",
          "mnemonic": "枚举最后一个平方，接较小金额最优。",
          "why": "把 n 写成最少平方数之和。dp[i] 是组成 i 的最少平方数个数，所有 dp[i−j²] 在当前金额前已经算好。",
          "invariant": "dp[i] 是组成 i 的最少平方数个数，所有 dp[i−j²] 在当前金额前已经算好。",
          "steps": [
            "dp[0]=0",
            "对金额 i 枚举 j²≤i",
            "取 dp[i−j²]+1 的最小值"
          ],
          "trace": "输入：n = 12\n输出：3\n解释：12 = 4 + 4 + 4\n\n手推时记录：dp[i] 是组成 i 的最少平方数个数，所有 dp[i−j²] 在当前金额前已经算好。\n\n边界检查：为什么平方数可以反复使用，不需要 used？\n问题允许多个相同平方数；例如 12=4+4+4，每个较小金额最优状态也可以已经使用同一个平方数。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么平方数可以反复使用，不需要 used？\n问题允许多个相同平方数；例如 12=4+4+4，每个较小金额最优状态也可以已经使用同一个平方数。",
          "complexity": "时间 O(n√n)，空间 O(n)。",
          "prerequisites": [
            "10-capacity"
          ],
          "related": [
            {
              "id": 322,
              "kind": "候选变化",
              "why": "279 的可用硬币就是不超过 n 的完全平方数，同样用较小金额最优加一求最少个数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么平方数可以反复使用，不需要 used？",
            "answer": "问题允许多个相同平方数；例如 12=4+4+4，每个较小金额最优状态也可以已经使用同一个平方数。"
          },
          "source": "02-Wiki/题目详解/279-完全平方数.md",
          "codeBlock": 0,
          "code": "def numSquares(n):\n    dp = [float('inf')] * (n + 1)\n    dp[0] = 0\n    for i in range(1, n + 1):\n        j = 1\n        while j * j <= i:                             # 枚举完全平方数\n            dp[i] = min(dp[i], dp[i - j * j] + 1)     # 取最小值\n            j += 1\n    return dp[n]",
          "url": "https://leetcode.cn/problems/perfect-squares/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/279-%E5%AE%8C%E5%85%A8%E5%B9%B3%E6%96%B9%E6%95%B0.md",
          "sourceHash": "46b51ad12fa32bacbee44af3e40c9b4dba43fc7e0aba593ace4da9e041cc2b73"
        },
        {
          "uid": "lc-1143",
          "id": 1143,
          "group": "strings",
          "title": "最长公共子序列",
          "level": "Medium",
          "prompt": "给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。如果不存在公共子序列，返回 0。\n\n一个字符串的子序列是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。\n\n例如，\"ace\" 是 \"abcde\" 的子序列，但 \"aec\" 不是。\n\n两个字符串的公共子序列是这两个字符串所共同拥有的子序列。",
          "example": "输入：text1 = \"abcde\", text2 = \"ace\"\n输出：3",
          "hint": "先问自己：dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "recognition": "两串求可跳字符的最长共同顺序",
          "mnemonic": "相等接斜上，不等舍一边。",
          "why": "两串求可跳字符的最长共同顺序。dp[i][j] 为两个前缀 text1[:i] 与 text2[:j] 的最长公共子序列长度。",
          "invariant": "dp[i][j] 为两个前缀 text1[:i] 与 text2[:j] 的最长公共子序列长度。",
          "steps": [
            "空前缀长度设零",
            "末字符相等则斜上加一",
            "否则取上方和左方最大"
          ],
          "trace": "输入：text1 = \"abcde\", text2 = \"ace\"\n输出：3\n解释：最长公共子序列是 \"ace\"，长度为 3。\n\n手推时记录：dp[i][j] 为两个前缀 text1[:i] 与 text2[:j] 的最长公共子序列长度。\n\n边界检查：为什么不等时可以取上方或左方，而不是直接置零？\n子序列允许跳过不匹配字符；置零更接近连续匹配的规则，会把前面有效的非连续公共序列丢掉。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不等时可以取上方或左方，而不是直接置零？\n子序列允许跳过不匹配字符；置零更接近连续匹配的规则，会把前面有效的非连续公共序列丢掉。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-strings"
          ],
          "related": [
            {
              "id": 300,
              "kind": "序列约束",
              "why": "都允许跳过元素；300 在单序列中要求数值递增，1143 在两个序列中要求选出相同字符顺序。"
            },
            {
              "id": 72,
              "kind": "目标变化",
              "why": "都比较两个前缀末字符；1143 优化保留的公共长度，72 优化插入删除替换的成本，空串边界也不同。"
            },
            {
              "id": 115,
              "kind": "最优到计数",
              "why": "1143 用 max 选择最长公共序列；115 固定目标 t，对使用或跳过 s 当前位置的方案求和。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不等时可以取上方或左方，而不是直接置零？",
            "answer": "子序列允许跳过不匹配字符；置零更接近连续匹配的规则，会把前面有效的非连续公共序列丢掉。"
          },
          "source": "02-Wiki/题目详解/1143-最长公共子序列.md",
          "codeBlock": 0,
          "code": "def longestCommonSubsequence(text1, text2):\n    m, n = len(text1), len(text2)\n    # dp[i][j] 表示 text1[:i] 和 text2[:j] 的 LCS\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i - 1] == text2[j - 1]:\n                # 字符相等，LCS 长度 +1\n                dp[i][j] = dp[i - 1][j - 1] + 1\n            else:\n                # 字符不等，取两个子问题的较大值\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n\n    return dp[m][n]",
          "url": "https://leetcode.cn/problems/longest-common-subsequence/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1143-%E6%9C%80%E9%95%BF%E5%85%AC%E5%85%B1%E5%AD%90%E5%BA%8F%E5%88%97.md",
          "sourceHash": "aa829931e0e738b5054cccd9e262b0268814e3d634538c5391b793acc4a1f546"
        },
        {
          "uid": "lc-72",
          "id": 72,
          "group": "strings",
          "title": "编辑距离",
          "level": "Hard",
          "prompt": "给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。\n\n你可以对一个单词进行如下三种操作：\n插入一个字符\n删除一个字符\n替换一个字符",
          "example": "输入：word1 = \"horse\", word2 = \"ros\"\n输出：3",
          "hint": "先问自己：dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "recognition": "两串求最少增删改",
          "mnemonic": "末字符不同，三种操作取最小加一。",
          "why": "两串求最少增删改。dp[i][j] 为把 word1 前 i 字符变成 word2 前 j 字符的最少操作数。",
          "invariant": "dp[i][j] 为把 word1 前 i 字符变成 word2 前 j 字符的最少操作数。",
          "steps": [
            "空串边界按长度初始化",
            "末字符相同接斜上",
            "不同比较删除、插入、替换"
          ],
          "trace": "输入：word1 = \"horse\", word2 = \"ros\"\n输出：3\n解释：\nhorse -> rorse (将 'h' 替换为 'r')\nrorse -> rose (删除 'r')\nrose -> ros (删除 'e')\n\n手推时记录：dp[i][j] 为把 word1 前 i 字符变成 word2 前 j 字符的最少操作数。\n\n边界检查：为什么空串边界是长度，而不是全部零？\n从 i 个字符变空串必须删除 i 次；从空串变 j 个字符必须插入 j 次，这些成本会传到内部状态。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么空串边界是长度，而不是全部零？\n从 i 个字符变空串必须删除 i 次；从空串变 j 个字符必须插入 j 次，这些成本会传到内部状态。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-strings"
          ],
          "related": [
            {
              "id": 1143,
              "kind": "目标变化",
              "why": "都比较两个前缀末字符；1143 优化保留的公共长度，72 优化插入删除替换的成本，空串边界也不同。"
            },
            {
              "id": 10,
              "kind": "模式规则",
              "why": "都用前缀表处理字符串关系；10 的星号有零次跳两列和多次只消耗输入的特殊转移，不能按普通字符处理。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么空串边界是长度，而不是全部零？",
            "answer": "从 i 个字符变空串必须删除 i 次；从空串变 j 个字符必须插入 j 次，这些成本会传到内部状态。"
          },
          "source": "02-Wiki/题目详解/72-编辑距离.md",
          "codeBlock": 0,
          "code": "def minDistance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    # 初始化边界\n    for i in range(m + 1):\n        dp[i][0] = i                      # word1 删除所有字符\n    for j in range(n + 1):\n        dp[0][j] = j                      # word1 插入所有字符\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]         # 字符相同，无需操作\n            else:\n                dp[i][j] = min(\n                    dp[i - 1][j] + 1,               # 删除 word1[i-1]\n                    dp[i][j - 1] + 1,               # 插入 word2[j-1]\n                    dp[i - 1][j - 1] + 1            # 替换 word1[i-1] → word2[j-1]\n                )\n\n    return dp[m][n]",
          "url": "https://leetcode.cn/problems/edit-distance/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/72-%E7%BC%96%E8%BE%91%E8%B7%9D%E7%A6%BB.md",
          "sourceHash": "c9f5859869e42946032d903734a79b128ae9db0701f1046d69ebc10e58276dc9"
        },
        {
          "uid": "lc-115",
          "id": 115,
          "group": "strings",
          "title": "不同的子序列",
          "level": "Hard",
          "prompt": "从 s 中删除任意位置且保持剩余字符顺序，求得到 t 的不同选择数量。不同位置的选择分别计数，即使字符相同。",
          "example": "s=\"rabbbit\", t=\"rabbit\"，可删不同一个 b，共 3 种。",
          "hint": "先问自己：dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "recognition": "从 s 中删字符得到 t，统计不同选法",
          "mnemonic": "不选当前，加上能选当前。",
          "why": "从 s 中删字符得到 t，统计不同选法。dp[i][j] 是从 s 的前 i 个位置中选出 t 前 j 字符的方案数。",
          "invariant": "dp[i][j] 是从 s 的前 i 个位置中选出 t 前 j 字符的方案数。",
          "steps": [
            "任意 s 前缀组成空 t 都有一种",
            "先继承不选 s[i−1]",
            "字符相等再加选它的斜上状态"
          ],
          "trace": "s=\"rabbbit\", t=\"rabbit\"，可删不同一个 b，共 3 种。\n\n手推时记录：dp[i][j] 是从 s 的前 i 个位置中选出 t 前 j 字符的方案数。\n\n边界检查：为什么字符相等时不能只取斜上状态？\n相等字符也可以不选，例如 s=aaa、t=a，有三种不同位置的选择；只取斜上会丢掉跳过当前的方案。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么字符相等时不能只取斜上状态？\n相等字符也可以不选，例如 s=aaa、t=a，有三种不同位置的选择；只取斜上会丢掉跳过当前的方案。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-strings"
          ],
          "related": [
            {
              "id": 1143,
              "kind": "最优到计数",
              "why": "1143 用 max 选择最长公共序列；115 固定目标 t，对使用或跳过 s 当前位置的方案求和。"
            },
            {
              "id": 97,
              "kind": "状态语义",
              "why": "115 从一个来源选择目标序列并计数；97 从两个来源交错出目标，只需用 OR 判断能否完成。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么字符相等时不能只取斜上状态？",
            "answer": "相等字符也可以不选，例如 s=aaa、t=a，有三种不同位置的选择；只取斜上会丢掉跳过当前的方案。"
          },
          "source": "02-Wiki/题目详解/115-不同的子序列.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def numDistinct(self, s: str, t: str) -> int:\n        dp = [[0] * (len(t) + 1) for _ in range(len(s) + 1)]\n        for i in range(len(s) + 1):\n            dp[i][0] = 1\n        for i in range(1, len(s) + 1):\n            for j in range(1, len(t) + 1):\n                dp[i][j] = dp[i - 1][j]\n                if s[i - 1] == t[j - 1]:\n                    dp[i][j] += dp[i - 1][j - 1]\n        return dp[-1][-1]",
          "url": "https://leetcode.cn/problems/distinct-subsequences/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/115-%E4%B8%8D%E5%90%8C%E7%9A%84%E5%AD%90%E5%BA%8F%E5%88%97.md",
          "sourceHash": "6d739d30a420df1c4a74e4ea4bb68e010a410815886ebabde9713d452747aa43"
        },
        {
          "uid": "lc-97",
          "id": 97,
          "group": "strings",
          "title": "交错字符串",
          "level": "Medium",
          "prompt": "判断 s3 是否能由 s1、s2 保持各自相对顺序地交错组成。",
          "example": "s1=\"aab\", s2=\"axy\", s3=\"aaxaby\"，返回 True。",
          "hint": "先问自己：dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "recognition": "两串保持各自顺序交错成第三串",
          "mnemonic": "下一字来自谁，就接谁的前态。",
          "why": "两串保持各自顺序交错成第三串。dp[i][j] 表示 s1[:i] 与 s2[:j] 能否交错组成 s3[:i+j]。",
          "invariant": "dp[i][j] 表示 s1[:i] 与 s2[:j] 能否交错组成 s3[:i+j]。",
          "steps": [
            "总长度不同失败",
            "dp[0][0]=True",
            "匹配 s1 末字可从上方来，匹配 s2 末字可从左方来"
          ],
          "trace": "s1=\"aab\", s2=\"axy\", s3=\"aaxaby\"，返回 True。\n\n手推时记录：dp[i][j] 表示 s1[:i] 与 s2[:j] 能否交错组成 s3[:i+j]。\n\n边界检查：两个来源的字符都匹配时为什么要用 OR？\n可能两种来源都值得尝试，只有后续能区分哪条可行；提前贪心固定一种来源会误拒绝合法交错。",
          "traceLabel": "例子与边界推演",
          "trap": "两个来源的字符都匹配时为什么要用 OR？\n可能两种来源都值得尝试，只有后续能区分哪条可行；提前贪心固定一种来源会误拒绝合法交错。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-strings"
          ],
          "related": [
            {
              "id": 115,
              "kind": "状态语义",
              "why": "115 从一个来源选择目标序列并计数；97 从两个来源交错出目标，只需用 OR 判断能否完成。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "两个来源的字符都匹配时为什么要用 OR？",
            "answer": "可能两种来源都值得尝试，只有后续能区分哪条可行；提前贪心固定一种来源会误拒绝合法交错。"
          },
          "source": "02-Wiki/题目详解/97-交错字符串.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:\n        if len(s1) + len(s2) != len(s3):\n            return False\n        dp = [[False] * (len(s2) + 1) for _ in range(len(s1) + 1)]\n        dp[0][0] = True\n        for i in range(len(s1) + 1):\n            for j in range(len(s2) + 1):\n                if i and s1[i - 1] == s3[i + j - 1]:\n                    dp[i][j] |= dp[i - 1][j]\n                if j and s2[j - 1] == s3[i + j - 1]:\n                    dp[i][j] |= dp[i][j - 1]\n        return dp[-1][-1]",
          "url": "https://leetcode.cn/problems/interleaving-string/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/97-%E4%BA%A4%E9%94%99%E5%AD%97%E7%AC%A6%E4%B8%B2.md",
          "sourceHash": "021df56b773e44c89eb86b2fe9dc3c8d6446b894c3a7dd3878a51a016d6d1a32"
        },
        {
          "uid": "lc-10",
          "id": 10,
          "group": "strings",
          "title": "正则表达式匹配",
          "level": "Hard",
          "prompt": "字符串 s 由小写字母组成，模式 p 含小写字母、. 和 *；. 匹配任意一个字符，* 表示它前面的元素重复零次或多次。模式保证合法，要求匹配整个 s。",
          "example": "输入：s=\"aab\", p=\"c*a*b\"\n输出：True",
          "hint": "先问自己：dp[i][j] 通常表示两个前缀之间的某种关系；空串边界必须从语义推出。",
          "recognition": "点号匹配任意一字，星号重复前一项",
          "mnemonic": "零次跳两格，多次吃字符不丢星。",
          "why": "点号匹配任意一字，星号重复前一项。dp[i][j] 表示 s 前 i 字符与模式前 j 字符完整匹配。",
          "invariant": "dp[i][j] 表示 s 前 i 字符与模式前 j 字符完整匹配。",
          "steps": [
            "初始化空串与可消去的 x*",
            "普通字符或点号接斜上",
            "星号取零次 dp[i][j−2] 或匹配后 dp[i−1][j]"
          ],
          "trace": "s=\"aab\", p=\"c*a*b\"：c* 取 0 次、a* 取 2 次，返回 True。\n\n手推时记录：dp[i][j] 表示 s 前 i 字符与模式前 j 字符完整匹配。\n\n边界检查：星号重复一次后为什么仍保留模式 j 不动？\n星号允许继续重复同一个前项；消耗一个输入字符但保留模式，之后才决定继续吃还是按零次跳过。题目保证模式合法。",
          "traceLabel": "例子与边界推演",
          "trap": "星号重复一次后为什么仍保留模式 j 不动？\n星号允许继续重复同一个前项；消耗一个输入字符但保留模式，之后才决定继续吃还是按零次跳过。题目保证模式合法。",
          "complexity": "时间与空间 O(mn)。",
          "prerequisites": [
            "10-strings"
          ],
          "related": [
            {
              "id": 72,
              "kind": "模式规则",
              "why": "都用前缀表处理字符串关系；10 的星号有零次跳两列和多次只消耗输入的特殊转移，不能按普通字符处理。"
            },
            {
              "id": 211,
              "kind": "易混淆",
              "why": "211 的点号在Trie中匹配一个字符；10 还含重复前项的星号，需要考虑零次与多次，并要求完整匹配。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "星号重复一次后为什么仍保留模式 j 不动？",
            "answer": "星号允许继续重复同一个前项；消耗一个输入字符但保留模式，之后才决定继续吃还是按零次跳过。题目保证模式合法。"
          },
          "source": "02-Wiki/题目详解/10-正则表达式匹配.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]\n        dp[0][0] = True\n        for j in range(2, len(p) + 1):\n            if p[j - 1] == \"*\":\n                dp[0][j] = dp[0][j - 2]\n        for i in range(1, len(s) + 1):\n            for j in range(1, len(p) + 1):\n                if p[j - 1] != \"*\":\n                    dp[i][j] = dp[i - 1][j - 1] and p[j - 1] in {s[i - 1], \".\"}\n                else:\n                    dp[i][j] = dp[i][j - 2]\n                    if p[j - 2] in {s[i - 1], \".\"}:\n                        dp[i][j] |= dp[i - 1][j]\n        return dp[-1][-1]",
          "url": "https://leetcode.cn/problems/regular-expression-matching/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/10-%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%8C%B9%E9%85%8D.md",
          "sourceHash": "e0d5a264c9f624f304c65f2f3bd7303306fcf44ed61d08b32535f684d28a4e02"
        },
        {
          "uid": "lc-5",
          "id": 5,
          "group": "interval",
          "title": "最长回文子串",
          "level": "Medium",
          "prompt": "给你一个字符串 s，找到 s 中最长的回文子串。\n\n回文串是指正着读和反着读都一样的字符串。",
          "example": "输入：s = \"babad\"\n输出：\"bab\"",
          "hint": "先问自己：回文从中心向外扩展；区间最优可反过来枚举最后一步，使两边独立。",
          "recognition": "最长回文连续子串",
          "mnemonic": "每个字符和缝隙都当中心。",
          "why": "最长回文连续子串。扩展过程中 [l,r] 两端相等，内部已经是回文；停止后有效边界退回一格。",
          "invariant": "扩展过程中 [l,r] 两端相等，内部已经是回文；停止后有效边界退回一格。",
          "steps": [
            "枚举奇数中心和偶数中心",
            "向两侧相等扩张",
            "更新最长起止位置并切片"
          ],
          "trace": "输入：s = \"babad\"\n输出：\"bab\"\n解释：\"aba\" 同样是符合题意的答案。\n\n手推时记录：扩展过程中 [l,r] 两端相等，内部已经是回文；停止后有效边界退回一格。\n\n边界检查：为什么只枚举字符中心会漏答案？\n偶数长度回文中心位于两个字符之间，例如 abba 的中心是两个 b 的缝隙。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么只枚举字符中心会漏答案？\n偶数长度回文中心位于两个字符之间，例如 abba 的中心是两个 b 的缝隙。",
          "complexity": "时间 O(n²)，辅助 O(1)，另计结果切片 O(n)。",
          "prerequisites": [
            "10-interval"
          ],
          "related": [
            {
              "id": 647,
              "kind": "输出变化",
              "why": "中心扩展完全共享；5 只保留最长边界，647 每次成功扩展都计数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么只枚举字符中心会漏答案？",
            "answer": "偶数长度回文中心位于两个字符之间，例如 abba 的中心是两个 b 的缝隙。"
          },
          "source": "02-Wiki/题目详解/5-最长回文子串.md",
          "codeBlock": 0,
          "code": "def longestPalindrome(s):\n    def expand(l, r):\n        \"\"\"从中心向两端扩展，返回最长回文的起止下标\"\"\"\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1\n            r += 1\n        return l + 1, r - 1\n\n    start = end = 0\n    for i in range(len(s)):\n        # 奇数长度回文中心（一个字符）\n        l1, r1 = expand(i, i)\n        # 偶数长度回文中心（两个字符之间）\n        l2, r2 = expand(i, i + 1)\n\n        if r1 - l1 > end - start:\n            start, end = l1, r1\n        if r2 - l2 > end - start:\n            start, end = l2, r2\n\n    return s[start:end + 1]",
          "url": "https://leetcode.cn/problems/longest-palindromic-substring/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/5-%E6%9C%80%E9%95%BF%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2.md",
          "sourceHash": "5e6255b9332298dc35ff0363c02cac45227baaae4463dc5a747620600c94153e"
        },
        {
          "uid": "lc-647",
          "id": 647,
          "group": "interval",
          "title": "回文子串",
          "level": "Medium",
          "prompt": "统计字符串中回文子串的数量。",
          "example": "\"aaa\" 的回文子串为 a、a、a、aa、aa、aaa，共 6 个。",
          "hint": "先问自己：回文从中心向外扩展；区间最优可反过来枚举最后一步，使两边独立。",
          "recognition": "统计全部回文子串",
          "mnemonic": "每次成功向外扩展，就多一个答案。",
          "why": "统计全部回文子串。每个回文子串有唯一中心与半径，因此每次成功扩展计数一次恰好不重不漏。",
          "invariant": "每个回文子串有唯一中心与半径，因此每次成功扩展计数一次恰好不重不漏。",
          "steps": [
            "枚举 2n−1 个奇偶中心",
            "端点相等则计数",
            "继续两端外扩"
          ],
          "trace": "\"aaa\" 的回文子串为 a、a、a、aa、aa、aaa，共 6 个。\n\n手推时记录：每个回文子串有唯一中心与半径，因此每次成功扩展计数一次恰好不重不漏。\n\n边界检查：aaa 有多少个回文子串，重复内容算几次？\n有 6 个：三个单字符、两个 aa、一个 aaa；按位置区分子串，相同文字出现在不同位置仍分别计数。",
          "traceLabel": "例子与边界推演",
          "trap": "aaa 有多少个回文子串，重复内容算几次？\n有 6 个：三个单字符、两个 aa、一个 aaa；按位置区分子串，相同文字出现在不同位置仍分别计数。",
          "complexity": "时间 O(n²)，额外空间 O(1)。",
          "prerequisites": [
            "10-interval"
          ],
          "related": [
            {
              "id": 131,
              "kind": "共用判断",
              "why": "都利用回文的内部结构；647 统计所有回文子串，131 再把这些可用子串组合成覆盖全串的分割。"
            },
            {
              "id": 5,
              "kind": "输出变化",
              "why": "中心扩展完全共享；5 只保留最长边界，647 每次成功扩展都计数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "aaa 有多少个回文子串，重复内容算几次？",
            "answer": "有 6 个：三个单字符、两个 aa、一个 aaa；按位置区分子串，相同文字出现在不同位置仍分别计数。"
          },
          "source": "02-Wiki/题目详解/647-回文子串.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def countSubstrings(self, s: str) -> int:\n        total = 0\n        for center in range(2 * len(s) - 1):\n            left, right = center // 2, center // 2 + center % 2\n            while left >= 0 and right < len(s) and s[left] == s[right]:\n                total += 1\n                left -= 1\n                right += 1\n        return total",
          "url": "https://leetcode.cn/problems/palindromic-substrings/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/647-%E5%9B%9E%E6%96%87%E5%AD%90%E4%B8%B2.md",
          "sourceHash": "cd7ce09cdd6a2490036f2c97b0519cbb6617d6ff135430ed403be3c5123d6998"
        },
        {
          "uid": "lc-312",
          "id": 312,
          "group": "interval",
          "title": "戳气球",
          "level": "Hard",
          "prompt": "nums[i] 是气球数值。戳破一个气球得到“当前左邻 × 自己 × 当前右邻”枚硬币，气球消失后两侧成为邻居；不存在的邻居按 1 计算。求戳完全部气球的最大硬币数。",
          "example": "[3,1,5,8] 的最大硬币数为 167。",
          "hint": "先问自己：回文从中心向外扩展；区间最优可反过来枚举最后一步，使两边独立。",
          "recognition": "戳气球邻居会变",
          "mnemonic": "枚举最后戳谁，让两侧边界固定。",
          "why": "戳气球邻居会变。dp[left][right] 是只戳开区间内部气球的最大奖励，左右边界暂时保留。",
          "invariant": "dp[left][right] 是只戳开区间内部气球的最大奖励，左右边界暂时保留。",
          "steps": [
            "两端补 1",
            "按区间长度递增",
            "枚举最后气球并加左右子区间最优与边界乘积"
          ],
          "trace": "[3,1,5,8] 的最大硬币数为 167。\n\n手推时记录：dp[left][right] 是只戳开区间内部气球的最大奖励，左右边界暂时保留。\n\n边界检查：为什么枚举第一个戳的气球难以独立划分子问题？\n先戳后两侧气球会成为新邻居，后续选择仍互相影响；最后戳时左右边界已确定，内部两段才可独立求最优。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么枚举第一个戳的气球难以独立划分子问题？\n先戳后两侧气球会成为新邻居，后续选择仍互相影响；最后戳时左右边界已确定，内部两段才可独立求最优。",
          "complexity": "时间 O(n³)，空间 O(n²)。",
          "prerequisites": [
            "10-interval"
          ],
          "related": [
            {
              "id": 131,
              "kind": "区间思考",
              "why": "131 选下一段切口以枚举方案；312 反过来选区间内最后一步，固定外边界后让左右子问题独立。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么枚举第一个戳的气球难以独立划分子问题？",
            "answer": "先戳后两侧气球会成为新邻居，后续选择仍互相影响；最后戳时左右边界已确定，内部两段才可独立求最优。"
          },
          "source": "02-Wiki/题目详解/312-戳气球.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def maxCoins(self, nums: List[int]) -> int:\n        values = [1] + nums + [1]\n        n = len(values)\n        dp = [[0] * n for _ in range(n)]\n        for length in range(2, n):\n            for left in range(n - length):\n                right = left + length\n                for last in range(left + 1, right):\n                    dp[left][right] = max(dp[left][right], values[left] * values[last] * values[right] + dp[left][last] + dp[last][right])\n        return dp[0][n - 1]",
          "url": "https://leetcode.cn/problems/burst-balloons/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/312-%E6%88%B3%E6%B0%94%E7%90%83.md",
          "sourceHash": "d62e49a0f54f14abfd3e8ae57744981b97cc7db43f4abacc732d33bea1ccc1fb"
        }
      ]
    },
    {
      "id": "greedy-11",
      "number": "11",
      "title": "贪心",
      "content": "decks/11-cards.json",
      "concepts": [
        {
          "id": "11-frontier",
          "title": "可达范围：最远边界与最少层数",
          "explanation": "区分已经能走到哪里，与再走一步最多能到哪里。",
          "example": "55 只需知道能否到终点；45 扫完当前跳数覆盖区间才增加一步。"
        },
        {
          "id": "11-discard",
          "title": "排除候选：哪些信息再也不需要",
          "explanation": "贪心要有排除证明；最佳历史买价和失败起点区间分别压缩不同信息。",
          "example": "121 未来卖出只关心最低历史买价；134 失败一段内的起点都可排除。"
        },
        {
          "id": "11-forced",
          "title": "被约束强迫的下一步",
          "explanation": "当前最早安全边界或最小剩余元素，让选择不再任意。",
          "example": "763 所有已见字符最后位置到齐才切；846 最小剩余牌只能作新组起点。"
        },
        {
          "id": "11-range",
          "title": "保留可行状态的范围或覆盖",
          "explanation": "有些问题不能立即固定唯一选择，但可以用区间或逐坐标标记概括所有可行选择。",
          "example": "678 用最少/最多未闭合左括号；1899 只合并不超标的三元组并检查三维覆盖。"
        }
      ],
      "source": "02-Wiki/专题总结/11-贪心算法.md",
      "connectionRule": "每个连接都问“为什么现在这样选，不会毁掉未来”：维护可达边界、排除整段失败起点、最早安全切割，或保存所有可能状态的范围。",
      "groups": [
        {
          "id": "frontier",
          "title": "可达范围：最远边界与最少层数",
          "description": "区分已经能走到哪里，与再走一步最多能到哪里。",
          "example": "55 只需知道能否到终点；45 扫完当前跳数覆盖区间才增加一步。"
        },
        {
          "id": "discard",
          "title": "排除候选：哪些信息再也不需要",
          "description": "贪心要有排除证明；最佳历史买价和失败起点区间分别压缩不同信息。",
          "example": "121 未来卖出只关心最低历史买价；134 失败一段内的起点都可排除。"
        },
        {
          "id": "forced",
          "title": "被约束强迫的下一步",
          "description": "当前最早安全边界或最小剩余元素，让选择不再任意。",
          "example": "763 所有已见字符最后位置到齐才切；846 最小剩余牌只能作新组起点。"
        },
        {
          "id": "range",
          "title": "保留可行状态的范围或覆盖",
          "description": "有些问题不能立即固定唯一选择，但可以用区间或逐坐标标记概括所有可行选择。",
          "example": "678 用最少/最多未闭合左括号；1899 只合并不超标的三元组并检查三维覆盖。"
        }
      ],
      "firstProblems": [
        55,
        121,
        763
      ],
      "cards": [
        {
          "uid": "lc-55",
          "id": 55,
          "group": "frontier",
          "title": "跳跃游戏",
          "level": "Medium",
          "prompt": "给你一个非负整数数组 nums，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度（即你可以跳 1 步到 nums[i] 步之间的任意长度）。\n\n判断你是否能够到达最后一个下标，如果可以，返回 true；否则返回 false。",
          "example": "输入：nums = [2,3,1,1,4]\n输出：true",
          "hint": "先问自己：区分已经能走到哪里，与再走一步最多能到哪里。",
          "recognition": "每个数是最大跳长，问能否到终点",
          "mnemonic": "可达才更新最远。",
          "why": "每个数是最大跳长，问能否到终点。max_reach 表示从已扫描可达位置出发能覆盖的最远下标。",
          "invariant": "max_reach 表示从已扫描可达位置出发能覆盖的最远下标。",
          "steps": [
            "若 i 超过最远覆盖则失败",
            "更新 i+nums[i] 的最大值",
            "覆盖终点即成功"
          ],
          "trace": "输入：nums = [2,3,1,1,4]\n输出：true\n解释：可以先跳 1 步，从下标 0 到 1，然后从下标 1 跳 3 步到达最后一个下标。\n\n手推时记录：max_reach 表示从已扫描可达位置出发能覆盖的最远下标。\n\n边界检查：为什么不能让不可达位置也更新 max_reach？\n它的跳跃能力根本无法使用，例如 [0,100] 不能借第二格跳走；必须先判断当前位置可达。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能让不可达位置也更新 max_reach？\n它的跳跃能力根本无法使用，例如 [0,100] 不能借第二格跳走；必须先判断当前位置可达。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "11-frontier"
          ],
          "related": [
            {
              "id": 45,
              "kind": "从可达到最少步",
              "why": "55 只维护一个最远覆盖；45 额外保留当前层边界，把范围扩展按跳数分层计数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能让不可达位置也更新 max_reach？",
            "answer": "它的跳跃能力根本无法使用，例如 [0,100] 不能借第二格跳走；必须先判断当前位置可达。"
          },
          "source": "02-Wiki/题目详解/55-跳跃游戏.md",
          "codeBlock": 0,
          "code": "def canJump(nums):\n    max_reach = 0\n    n = len(nums)\n    for i in range(n):\n        if i > max_reach:\n            return False          # 当前位置不可达\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= n - 1:\n            return True           # 已覆盖终点\n    return True",
          "url": "https://leetcode.cn/problems/jump-game/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/55-%E8%B7%B3%E8%B7%83%E6%B8%B8%E6%88%8F.md",
          "sourceHash": "f37e5531ca34c5c16461df33d9a16cab87bd60e2c183095f7aee9370339775cd"
        },
        {
          "uid": "lc-121",
          "id": 121,
          "group": "discard",
          "title": "买卖股票的最佳时机",
          "level": "Easy",
          "prompt": "给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。你只能选择某一天买入这只股票，并选择在未来的某一个不同的日子卖出该股票，设计一个算法来计算你所能获取的最大利润。\n\n返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0。",
          "example": "输入：prices = [7,1,5,3,6,4]\n输出：5",
          "hint": "先问自己：贪心要有排除证明；最佳历史买价和失败起点区间分别压缩不同信息。",
          "recognition": "只允许买卖一次求利润",
          "mnemonic": "今天卖，配以前最低买价。",
          "why": "只允许买卖一次求利润。min_price 是扫描到当前为止的最低价格，max_profit 是已经完成的一次交易最大收益。",
          "invariant": "min_price 是扫描到当前为止的最低价格，max_profit 是已经完成的一次交易最大收益。",
          "steps": [
            "更新历史最低价",
            "非新低时计算今天卖出的收益",
            "保留最大，默认不交易收益 0"
          ],
          "trace": "输入：prices = [7,1,5,3,6,4]\n输出：5\n解释：在第 2 天（价格 = 1）的时候买入，在第 5 天（价格 = 6）的时候卖出，最大利润 = 6 - 1 = 5。\n\n手推时记录：min_price 是扫描到当前为止的最低价格，max_profit 是已经完成的一次交易最大收益。\n\n边界检查：为什么不能用全数组最高价减全数组最低价？\n最低价可能发生在最高价之后，违背先买后卖；扫描历史最低价天然保留正确时间顺序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能用全数组最高价减全数组最低价？\n最低价可能发生在最高价之后，违背先买后卖；扫描历史最低价天然保留正确时间顺序。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "11-discard"
          ],
          "related": [
            {
              "id": 309,
              "kind": "交易规则变化",
              "why": "121 只做一次交易，保存历史最低价即可；309 可多次交易且有冷却，需要用三态保存交易阶段。"
            },
            {
              "id": 134,
              "kind": "排除证明",
              "why": "121 对未来卖出可丢掉更高历史买价；134 在首次失败点可整段淘汰候选起点，理由都来自被舍弃候选不可能更好。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能用全数组最高价减全数组最低价？",
            "answer": "最低价可能发生在最高价之后，违背先买后卖；扫描历史最低价天然保留正确时间顺序。"
          },
          "source": "02-Wiki/题目详解/121-买卖股票的最佳时机.md",
          "codeBlock": 0,
          "code": "def maxProfit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        # 更新历史最低买入价\n        if price < min_price:\n            min_price = price\n        # 计算今天卖出能赚多少，更新最大利润\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit",
          "url": "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/121-%E4%B9%B0%E5%8D%96%E8%82%A1%E7%A5%A8%E7%9A%84%E6%9C%80%E4%BD%B3%E6%97%B6%E6%9C%BA.md",
          "sourceHash": "6a7070bacc61963104b2830183a036eff00cd608a2a0db04fb0443df8c7e0267"
        },
        {
          "uid": "lc-763",
          "id": 763,
          "group": "forced",
          "title": "划分字母区间",
          "level": "Medium",
          "prompt": "给你一个字符串 s，你要把这个字符串分割成尽可能多的片段，使得同一个字母最多出现在一个片段中。\n\n返回一个表示每个字符串片段的长度的列表。",
          "example": "输入：s = \"ababcbacadefegdehijhklij\"\n输出：[9,7,8]",
          "hint": "先问自己：当前最早安全边界或最小剩余元素，让选择不再任意。",
          "recognition": "每个字符只能属于一个片段且段数最多",
          "mnemonic": "看齐最后出现处，到边界就切。",
          "why": "每个字符只能属于一个片段且段数最多。end 是当前片段已出现字符的最晚结束位置，未走到它前都不能切割。",
          "invariant": "end 是当前片段已出现字符的最晚结束位置，未走到它前都不能切割。",
          "steps": [
            "记录每个字符最后下标",
            "扫描时扩大 end",
            "i==end 就记录片段长度并开启下一段"
          ],
          "trace": "输入：s = \"ababcbacadefegdehijhklij\"\n输出：[9,7,8]\n解释：\n划分结果为 \"ababcbaca\"、\"defegde\"、\"hijhklij\"。\n每个字母最多出现在一个片段中。\n像 \"ababcbacadefegde\", \"hijhklij\" 这样的划分是错误的，因为划分的片段数较少。\n\n手推时记录：end 是当前片段已出现字符的最晚结束位置，未走到它前都不能切割。\n\n边界检查：为什么到 end 时立刻切割能得到最多片段？\n此时当前所有字符都不会再出现，切割安全；继续延长只会合并本可独立的片段，不会增加段数。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么到 end 时立刻切割能得到最多片段？\n此时当前所有字符都不会再出现，切割安全；继续延长只会合并本可独立的片段，不会增加段数。",
          "complexity": "时间 O(n)，空间 O(Σ)，另计片段输出。",
          "prerequisites": [
            "11-forced"
          ],
          "related": [
            {
              "id": 45,
              "kind": "边界含义",
              "why": "都扫描到当前 end 后做一次结算；45 是完成一个可达层并增加跳数，763 是满足所有字符范围后切一段。"
            },
            {
              "id": 56,
              "kind": "区间联系",
              "why": "把每个字符的首次到最后出现看作区间，763 的扩展边界等价于把相互牵连的字符范围合并成片段。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么到 end 时立刻切割能得到最多片段？",
            "answer": "此时当前所有字符都不会再出现，切割安全；继续延长只会合并本可独立的片段，不会增加段数。"
          },
          "source": "02-Wiki/题目详解/763-划分字母区间.md",
          "codeBlock": 0,
          "code": "def partitionLabels(s):\n    # 第一步：记录每个字符最后出现的位置\n    last = {c: i for i, c in enumerate(s)}\n    \n    ans = []\n    start = end = 0\n    \n    # 第二步：遍历字符串，贪心切割\n    for i, c in enumerate(s):\n        end = max(end, last[c])  # 不断扩展当前片段的右边界\n        \n        if i == end:             # 到达当前片段的右边界，切分\n            ans.append(end - start + 1)\n            start = i + 1        # 下一片段起点\n    \n    return ans",
          "url": "https://leetcode.cn/problems/partition-labels/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/763-%E5%88%92%E5%88%86%E5%AD%97%E6%AF%8D%E5%8C%BA%E9%97%B4.md",
          "sourceHash": "bf059e267f7f7aaf434fcee09b3bcb38510354cad302ddfa5db3f49874ddd1bc"
        },
        {
          "uid": "lc-45",
          "id": 45,
          "group": "frontier",
          "title": "跳跃游戏 II",
          "level": "Medium",
          "prompt": "给定一个长度为 n 的非负整数数组 nums，你最初位于数组的第一个下标。数组中的每个元素代表你在该位置可以跳跃的最大长度。\n\n你的目标是使用最少的跳跃次数到达数组的最后一个下标。假设你总是可以到达数组的最后一个位置。\n\n返回最少的跳跃次数。",
          "example": "输入：nums = [2,3,1,1,4]\n输出：2",
          "hint": "先问自己：区分已经能走到哪里，与再走一步最多能到哪里。",
          "recognition": "保证可达时求最少跳数",
          "mnemonic": "当前层走完，才把下一层记一步。",
          "why": "保证可达时求最少跳数。end 是当前跳数覆盖边界，max_reach 是从这层所有位置再跳一步的最远边界。",
          "invariant": "end 是当前跳数覆盖边界，max_reach 是从这层所有位置再跳一步的最远边界。",
          "steps": [
            "扫描至倒数第二格",
            "持续更新下一层最远",
            "到 end 时步数加一并推进边界"
          ],
          "trace": "输入：nums = [2,3,1,1,4]\n输出：2\n解释：跳到最后一个下标的最小跳跃次数是 2。\n     从下标 0 跳到下标 1（跳 1 步），然后从下标 1 跳 3 步到达最后一个下标。\n\n手推时记录：end 是当前跳数覆盖边界，max_reach 是从这层所有位置再跳一步的最远边界。\n\n边界检查：为什么循环不处理最后一个位置？\n到终点已经完成，不需要再从终点跳出去；把终点也作为层边界计步可能多算一步。代码依赖题目保证可达。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么循环不处理最后一个位置？\n到终点已经完成，不需要再从终点跳出去；把终点也作为层边界计步可能多算一步。代码依赖题目保证可达。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "11-frontier"
          ],
          "related": [
            {
              "id": 55,
              "kind": "从可达到最少步",
              "why": "55 只维护一个最远覆盖；45 额外保留当前层边界，把范围扩展按跳数分层计数。"
            },
            {
              "id": 994,
              "kind": "层的压缩",
              "why": "都按最短步数逐层扩展；45 的可达位置形成连续范围，可把显式BFS队列压成两个边界。"
            },
            {
              "id": 763,
              "kind": "边界含义",
              "why": "都扫描到当前 end 后做一次结算；45 是完成一个可达层并增加跳数，763 是满足所有字符范围后切一段。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么循环不处理最后一个位置？",
            "answer": "到终点已经完成，不需要再从终点跳出去；把终点也作为层边界计步可能多算一步。代码依赖题目保证可达。"
          },
          "source": "02-Wiki/题目详解/45-跳跃游戏II.md",
          "codeBlock": 0,
          "code": "def jump(nums):\n    n = len(nums)\n    if n == 1:\n        return 0\n    \n    end = 0        # 当前步数能到达的最远边界\n    max_reach = 0  # 遍历过程中能到达的最远位置\n    steps = 0\n    \n    # 不需要遍历最后一个元素（n-1），因为到达 n-1 时已经完成\n    for i in range(n - 1):\n        max_reach = max(max_reach, i + nums[i])\n        \n        # 到达当前步数的边界，步数 +1，更新边界\n        if i == end:\n            steps += 1\n            end = max_reach\n    \n    return steps",
          "url": "https://leetcode.cn/problems/jump-game-ii/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/45-%E8%B7%B3%E8%B7%83%E6%B8%B8%E6%88%8FII.md",
          "sourceHash": "8d4fe327aa26344d2786cb709546b75d47844236d48c5a63c434080f00800b9d"
        },
        {
          "uid": "lc-134",
          "id": 134,
          "group": "discard",
          "title": "加油站",
          "level": "Medium",
          "prompt": "环形排列 n 个加油站，gas[i] 是可加油量，cost[i] 是前往下一站的耗油量。油箱无限大，出发时为空；返回能绕行一周的起点下标，不存在返回 −1，有解时保证唯一。",
          "example": "gas=[1,2,3,4,5], cost=[3,4,5,1,2]，从 3 出发可绕行一周。",
          "hint": "先问自己：贪心要有排除证明；最佳历史买价和失败起点区间分别压缩不同信息。",
          "recognition": "环形加油站求可行起点",
          "mnemonic": "一段油量跌负，这段起点全淘汰。",
          "why": "环形加油站求可行起点。tank 是当前候选起点到当前位置的累计净油量，失败后下一站成为新候选。",
          "invariant": "tank 是当前候选起点到当前位置的累计净油量，失败后下一站成为新候选。",
          "steps": [
            "总油不足总成本直接失败",
            "累计 gas−cost",
            "跌负时起点移到下一站并清零"
          ],
          "trace": "gas=[1,2,3,4,5], cost=[3,4,5,1,2]，从 3 出发可绕行一周。\n\n手推时记录：tank 是当前候选起点到当前位置的累计净油量，失败后下一站成为新候选。\n\n边界检查：为什么失败后不用逐个重试这一段中间的起点？\n在首次跌负前，候选起点到任一中间点的累计油量非负；从中间起步只会少掉这段非负贡献，也无法越过失败点。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么失败后不用逐个重试这一段中间的起点？\n在首次跌负前，候选起点到任一中间点的累计油量非负；从中间起步只会少掉这段非负贡献，也无法越过失败点。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "11-discard"
          ],
          "related": [
            {
              "id": 121,
              "kind": "排除证明",
              "why": "121 对未来卖出可丢掉更高历史买价；134 在首次失败点可整段淘汰候选起点，理由都来自被舍弃候选不可能更好。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么失败后不用逐个重试这一段中间的起点？",
            "answer": "在首次跌负前，候选起点到任一中间点的累计油量非负；从中间起步只会少掉这段非负贡献，也无法越过失败点。"
          },
          "source": "02-Wiki/题目详解/134-加油站.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:\n        if sum(gas) < sum(cost):\n            return -1\n        start = tank = 0\n        for i in range(len(gas)):\n            tank += gas[i] - cost[i]\n            if tank < 0:\n                start = i + 1\n                tank = 0\n        return start",
          "url": "https://leetcode.cn/problems/gas-station/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/134-%E5%8A%A0%E6%B2%B9%E7%AB%99.md",
          "sourceHash": "f7e4dc44a489043838bf4302a8ec61c50f6b31842e502979ca12899324c80977"
        },
        {
          "uid": "lc-846",
          "id": 846,
          "group": "forced",
          "title": "一手顺子",
          "level": "Medium",
          "prompt": "hand 中每张牌有一个整数值。能否使用全部牌分成若干组，每组恰有 groupSize 张且数值连续？重复牌按不同张数使用。",
          "example": "[1,2,3,6,2,3,4,7,8], groupSize=3 可分为 [1,2,3]、[2,3,4]、[6,7,8]。",
          "hint": "先问自己：当前最早安全边界或最小剩余元素，让选择不再任意。",
          "recognition": "所有牌分成等长连续组",
          "mnemonic": "最小剩余牌，必须当组头。",
          "why": "所有牌分成等长连续组。处理某起点时，所有更小牌已耗尽，因此该牌无法被放到由更小数开头的新组中。",
          "invariant": "处理某起点时，所有更小牌已耗尽，因此该牌无法被放到由更小数开头的新组中。",
          "steps": [
            "数量不能整除组长则失败",
            "按牌值升序看剩余次数",
            "对后续连续 groupSize 个值统一扣同样次数"
          ],
          "trace": "[1,2,3,6,2,3,4,7,8], groupSize=3 可分为 [1,2,3]、[2,3,4]、[6,7,8]。\n\n手推时记录：处理某起点时，所有更小牌已耗尽，因此该牌无法被放到由更小数开头的新组中。\n\n边界检查：最小牌出现 copies 次时，为什么必须同时开 copies 组？\n没有更小剩余牌可作它的前驱，所以每张最小牌都只能作一组的第一张；任一后续数不足就不可能完成。",
          "traceLabel": "例子与边界推演",
          "trap": "最小牌出现 copies 次时，为什么必须同时开 copies 组？\n没有更小剩余牌可作它的前驱，所以每张最小牌都只能作一组的第一张；任一后续数不足就不可能完成。",
          "complexity": "n 张、u 个不同值：时间 O(n+u log u)，空间 O(u)。",
          "prerequisites": [
            "11-forced"
          ],
          "related": [
            {
              "id": 128,
              "kind": "连续性与次数",
              "why": "128 集合去重后找最长连续段；846 必须保留牌的次数，并让所有牌按固定组长耗尽。"
            },
            {
              "id": 1899,
              "kind": "易混淆",
              "why": "846 使用一张牌会耗掉资源，次数必须扣减；1899 按坐标max合并不会损坏已有覆盖，只需过滤超标并记录各维是否到齐。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "最小牌出现 copies 次时，为什么必须同时开 copies 组？",
            "answer": "没有更小剩余牌可作它的前驱，所以每张最小牌都只能作一组的第一张；任一后续数不足就不可能完成。"
          },
          "source": "02-Wiki/题目详解/846-一手顺子.md",
          "codeBlock": 0,
          "code": "from collections import Counter\nfrom typing import List\n\n\nclass Solution:\n    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:\n        if len(hand) % groupSize:\n            return False\n        count = Counter(hand)\n        for start in sorted(count):\n            copies = count[start]\n            if copies:\n                for value in range(start, start + groupSize):\n                    if count[value] < copies:\n                        return False\n                    count[value] -= copies\n        return True",
          "url": "https://leetcode.cn/problems/hand-of-straights/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/846-%E4%B8%80%E6%89%8B%E9%A1%BA%E5%AD%90.md",
          "sourceHash": "eea9d732358bc068434d3b1f9a09d9c15b5fd4e7eacc78ef3e7963c20ab74ce1"
        },
        {
          "uid": "lc-678",
          "id": 678,
          "group": "range",
          "title": "有效的括号字符串",
          "level": "Medium",
          "prompt": "字符串只含 (、)、*；* 可代表左括号、右括号或空串，判断能否组成有效括号串。",
          "example": "输入：s=\"(*)\"\n输出：True",
          "hint": "先问自己：有些问题不能立即固定唯一选择，但可以用区间或逐坐标标记概括所有可行选择。",
          "recognition": "星号可作左右括号或空",
          "mnemonic": "保留未闭合左括号的最少与最多。",
          "why": "星号可作左右括号或空。[low,high] 是当前前缀所有合法解释可达到的未闭合左括号数量区间。",
          "invariant": "[low,high] 是当前前缀所有合法解释可达到的未闭合左括号数量区间。",
          "steps": [
            "左括号两端加一、右括号减一、星号向两侧扩张",
            "high<0 则失败并把 low 截到 0",
            "最终 low==0 才可全闭合"
          ],
          "trace": "\"(*)\" 可令 * 为空，得到 \"()\"，返回 True。\n\n手推时记录：[low,high] 是当前前缀所有合法解释可达到的未闭合左括号数量区间。\n\n边界检查：为什么 high<0 立即失败，而 low<0 只截成 0？\nhigh<0 表示所有解释都出现过多右括号；low<0 只表示部分解释无效，仍可保留区间内非负的其他解释。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么 high<0 立即失败，而 low<0 只截成 0？\nhigh<0 表示所有解释都出现过多右括号；low<0 只表示部分解释无效，仍可保留区间内非负的其他解释。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "11-range"
          ],
          "related": [
            {
              "id": 20,
              "kind": "条件放宽",
              "why": "普通括号有确定匹配；678 的星号带来多种解释，用可行未闭合数量区间避免枚举所有分支。"
            },
            {
              "id": 22,
              "kind": "生成与范围压缩",
              "why": "22 选择下一括号时保留合法前缀；678 面对星号的多种选择，将所有合法前缀状态压成数量范围。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么 high<0 立即失败，而 low<0 只截成 0？",
            "answer": "high<0 表示所有解释都出现过多右括号；low<0 只表示部分解释无效，仍可保留区间内非负的其他解释。"
          },
          "source": "02-Wiki/题目详解/678-有效的括号字符串.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def checkValidString(self, s: str) -> bool:\n        low = high = 0\n        for char in s:\n            if char == \"(\":\n                low += 1\n                high += 1\n            elif char == \")\":\n                low -= 1\n                high -= 1\n            else:\n                low -= 1\n                high += 1\n            if high < 0:\n                return False\n            low = max(low, 0)\n        return low == 0",
          "url": "https://leetcode.cn/problems/valid-parenthesis-string/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/678-%E6%9C%89%E6%95%88%E7%9A%84%E6%8B%AC%E5%8F%B7%E5%AD%97%E7%AC%A6%E4%B8%B2.md",
          "sourceHash": "9508b59029adaac33ac5623e9b938b45b51dba6317459f1ad97dc0883ad4d212"
        },
        {
          "uid": "lc-1899",
          "id": 1899,
          "group": "range",
          "title": "合并若干三元组以形成目标三元组",
          "level": "Medium",
          "prompt": "triplets 是三元组列表。每次选择两个不同位置，把其中一个更新为两者逐坐标最大值。允许重复操作，判断最终能否出现等于 target 的三元组。",
          "example": "输入：triplets=[[2,5,3],[1,8,4],[1,7,5]], target=[2,7,5]\n输出：True",
          "hint": "先问自己：有些问题不能立即固定唯一选择，但可以用区间或逐坐标标记概括所有可行选择。",
          "recognition": "按各坐标最大值合并到目标",
          "mnemonic": "先丢超标，再收齐三维。",
          "why": "按各坐标最大值合并到目标。只合并每个坐标都不超过目标的候选，任何组合都不会超标；matched 记录各维目标值是否已有来源。",
          "invariant": "只合并每个坐标都不超过目标的候选，任何组合都不会超标；matched 记录各维目标值是否已有来源。",
          "steps": [
            "超过目标任一维的三元组跳过",
            "合格候选逐维标记等于目标的位置",
            "三维都覆盖则成功"
          ],
          "trace": "[[2,5,3],[1,8,4],[1,7,5]] 可形成 target=[2,7,5]。\n\n手推时记录：只合并每个坐标都不超过目标的候选，任何组合都不会超标；matched 记录各维目标值是否已有来源。\n\n边界检查：三个目标坐标来自不同三元组，为什么仍能合并成功？\n合并是逐维取 max，且所有候选都不超标；把各维来源合并不会破坏已达到的坐标，最终同时达到三维目标。",
          "traceLabel": "例子与边界推演",
          "trap": "三个目标坐标来自不同三元组，为什么仍能合并成功？\n合并是逐维取 max，且所有候选都不超标；把各维来源合并不会破坏已达到的坐标，最终同时达到三维目标。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "11-range"
          ],
          "related": [
            {
              "id": 846,
              "kind": "易混淆",
              "why": "846 使用一张牌会耗掉资源，次数必须扣减；1899 按坐标max合并不会损坏已有覆盖，只需过滤超标并记录各维是否到齐。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "三个目标坐标来自不同三元组，为什么仍能合并成功？",
            "answer": "合并是逐维取 max，且所有候选都不超标；把各维来源合并不会破坏已达到的坐标，最终同时达到三维目标。"
          },
          "source": "02-Wiki/题目详解/1899-合并若干三元组以形成目标三元组.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:\n        matched = [False, False, False]\n        for triplet in triplets:\n            if any(triplet[i] > target[i] for i in range(3)):\n                continue\n            for i in range(3):\n                if triplet[i] == target[i]:\n                    matched[i] = True\n        return all(matched)",
          "url": "https://leetcode.cn/problems/merge-triplets-to-form-target-triplet/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/1899-%E5%90%88%E5%B9%B6%E8%8B%A5%E5%B9%B2%E4%B8%89%E5%85%83%E7%BB%84%E4%BB%A5%E5%BD%A2%E6%88%90%E7%9B%AE%E6%A0%87%E4%B8%89%E5%85%83%E7%BB%84.md",
          "sourceHash": "c2e66a2f7322c33665bdb5f005473d2bdfe0a76f620aca4fae57b303ae436750"
        }
      ]
    },
    {
      "id": "math-bits-12",
      "number": "12",
      "title": "数学与位运算",
      "content": "decks/12-cards.json",
      "concepts": [
        {
          "id": "12-cancel",
          "title": "抵消：到底消掉了什么",
          "explanation": "成对相等值异或消失；多数投票消掉的是不同值的一对，成立条件不同。",
          "example": "136 找单个剩余值；268 让完整范围与实际值抵消；169 要保证多数超过一半。"
        },
        {
          "id": "12-bits",
          "title": "位结构：取位、删位、传进位",
          "explanation": "固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "example": "191 删除最低1；338 复用删位后的答案；371 异或算无进位和，AND左移算进位。"
        },
        {
          "id": "12-cycles",
          "title": "把迭代看成沿指针走图",
          "explanation": "每个状态唯一决定下一状态，重复状态形成环；映射含义决定环入口的意义。",
          "example": "202 反复做数位平方和；287 用 nums[i] 作为下一个下标。"
        },
        {
          "id": "12-transform",
          "title": "数值与排列的局部变换",
          "explanation": "先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "example": "50 按二进制位拆指数；31 最小幅度增大前缀；75 维护三个已知区和一个未知区。"
        }
      ],
      "source": "02-Wiki/专题总结/12-技巧专题.md",
      "connectionRule": "围绕可复用的性质连接：异或抵消、最低有效位、进位分离、循环入口、最小字典序增量，以及原地分区不变量。",
      "groups": [
        {
          "id": "cancel",
          "title": "抵消：到底消掉了什么",
          "description": "成对相等值异或消失；多数投票消掉的是不同值的一对，成立条件不同。",
          "example": "136 找单个剩余值；268 让完整范围与实际值抵消；169 要保证多数超过一半。"
        },
        {
          "id": "bits",
          "title": "位结构：取位、删位、传进位",
          "description": "固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "example": "191 删除最低1；338 复用删位后的答案；371 异或算无进位和，AND左移算进位。"
        },
        {
          "id": "cycles",
          "title": "把迭代看成沿指针走图",
          "description": "每个状态唯一决定下一状态，重复状态形成环；映射含义决定环入口的意义。",
          "example": "202 反复做数位平方和；287 用 nums[i] 作为下一个下标。"
        },
        {
          "id": "transform",
          "title": "数值与排列的局部变换",
          "description": "先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "example": "50 按二进制位拆指数；31 最小幅度增大前缀；75 维护三个已知区和一个未知区。"
        }
      ],
      "firstProblems": [
        136,
        191,
        75
      ],
      "cards": [
        {
          "uid": "lc-136",
          "id": 136,
          "group": "cancel",
          "title": "只出现一次的数字",
          "level": "Easy",
          "prompt": "给你一个非空整数数组 nums，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现一次的元素。\n\n你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。",
          "example": "输入：nums = [2,2,1]\n输出：1",
          "hint": "先问自己：成对相等值异或消失；多数投票消掉的是不同值的一对，成立条件不同。",
          "recognition": "其他数都出现两次，只有一个出现一次",
          "mnemonic": "异或成对消，只留单数。",
          "why": "其他数都出现两次，只有一个出现一次。累积异或等于已扫描数字中出现奇数次的值的异或。",
          "invariant": "累积异或等于已扫描数字中出现奇数次的值的异或。",
          "steps": [
            "从 0 开始",
            "依次异或所有数",
            "返回最终值"
          ],
          "trace": "输入：nums = [2,2,1]\n输出：1\n\n手推时记录：累积异或等于已扫描数字中出现奇数次的值的异或。\n\n边界检查：如果其他数字出现三次，这个方法还能直接用吗？\n不能，三个相同数异或仍留下该数，无法消掉；成对或偶数次出现是此简单方案的关键条件。",
          "traceLabel": "例子与边界推演",
          "trap": "如果其他数字出现三次，这个方法还能直接用吗？\n不能，三个相同数异或仍留下该数，无法消掉；成对或偶数次出现是此简单方案的关键条件。",
          "complexity": "时间 O(n)，额外空间 O(1)。",
          "prerequisites": [
            "12-cancel"
          ],
          "related": [
            {
              "id": 268,
              "kind": "抵消对象变化",
              "why": "136 由输入自身的成对重复抵消；268 人工加入完整0…n范围，让存在的数各出现两次，只剩缺失值。"
            },
            {
              "id": 169,
              "kind": "易混淆",
              "why": "136 用异或消相同数的偶数次出现；169 用投票消不同值的一对，正确性依赖多数超过一半。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "如果其他数字出现三次，这个方法还能直接用吗？",
            "answer": "不能，三个相同数异或仍留下该数，无法消掉；成对或偶数次出现是此简单方案的关键条件。"
          },
          "source": "02-Wiki/题目详解/136-只出现一次的数字.md",
          "codeBlock": 0,
          "code": "def singleNumber(nums):\n    ans = 0\n    for num in nums:\n        ans ^= num  # 所有数异或，成对的消为 0，剩下的就是答案\n    return ans",
          "url": "https://leetcode.cn/problems/single-number/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/136-%E5%8F%AA%E5%87%BA%E7%8E%B0%E4%B8%80%E6%AC%A1%E7%9A%84%E6%95%B0%E5%AD%97.md",
          "sourceHash": "d53391278d34e99108d68bf12cbfaed6e0847eaa09e207e412c612106d5b1d65"
        },
        {
          "uid": "lc-191",
          "id": 191,
          "group": "bits",
          "title": "位 1 的个数",
          "level": "Easy",
          "prompt": "返回无符号整数 n 的二进制表示中 1 的个数。",
          "example": "输入：n=11（二进制 1011）\n输出：3",
          "hint": "先问自己：固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "recognition": "统计二进制 1 的个数",
          "mnemonic": "n 与 n−1 相与，每次清掉最低 1。",
          "why": "统计二进制 1 的个数。每轮恰好删除一个置位位，count 记录已删除的 1 的个数。",
          "invariant": "每轮恰好删除一个置位位，count 记录已删除的 1 的个数。",
          "steps": [
            "n 非零时循环",
            "执行 n&=n−1",
            "次数加一"
          ],
          "trace": "11 = 1011 -> 1010 -> 1000 -> 0，共消去 3 个 1。\n\n手推时记录：每轮恰好删除一个置位位，count 记录已删除的 1 的个数。\n\n边界检查：1000 与 0111 相与为什么能清掉最低 1？\n减一会把最低1变0，并把它右侧的0变1；相与保留高位且让该最低1及右侧都归零。",
          "traceLabel": "例子与边界推演",
          "trap": "1000 与 0111 相与为什么能清掉最低 1？\n减一会把最低1变0，并把它右侧的0变1；相与保留高位且让该最低1及右侧都归零。",
          "complexity": "时间 O(popcount(n))，32位输入至多32轮，空间 O(1)。",
          "prerequisites": [
            "12-bits"
          ],
          "related": [
            {
              "id": 338,
              "kind": "单次到批量",
              "why": "191 循环清最低1来计一个数；338 只清一次并复用更小数的结果，为整个范围做DP。"
            },
            {
              "id": 190,
              "kind": "位的保留",
              "why": "191 只关心1有几个，可跳过零；190 关心每位位置，固定32轮连零位也必须移动。"
            },
            {
              "id": 371,
              "kind": "位运算用途",
              "why": "191 的 AND 用来消最低1；371 的 AND 找同时为1的位置以产生进位，不能只背运算符而忽略状态含义。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "1000 与 0111 相与为什么能清掉最低 1？",
            "answer": "减一会把最低1变0，并把它右侧的0变1；相与保留高位且让该最低1及右侧都归零。"
          },
          "source": "02-Wiki/题目详解/191-位1的个数.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        count = 0\n        while n:\n            n &= n - 1\n            count += 1\n        return count",
          "url": "https://leetcode.cn/problems/number-of-1-bits/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/191-%E4%BD%8D1%E7%9A%84%E4%B8%AA%E6%95%B0.md",
          "sourceHash": "a210b020e9eeb32f177dbd62c24e9f62a334116be7b116d200ceda5f54ef40eb"
        },
        {
          "uid": "lc-75",
          "id": 75,
          "group": "transform",
          "title": "颜色分类",
          "level": "Medium",
          "prompt": "给定一个包含红色、白色和蓝色、共 n 个元素的数组 nums，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。\n\n我们使用整数 0、1 和 2 分别表示红色、白色和蓝色。\n\n必须在不使用库的 sort 函数的情况下解决这个问题，且只使用常数级额外空间。",
          "example": "输入：nums = [2,0,2,1,1,0]\n输出：[0,0,1,1,2,2]",
          "hint": "先问自己：先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "recognition": "原地排列只有0、1、2的数组",
          "mnemonic": "零去左，二去右，换回未知先别走。",
          "why": "原地排列只有0、1、2的数组。[0,zero) 全0，[zero,i) 全1，(two,n) 全2，[i,two] 尚未分类。",
          "invariant": "[0,zero) 全0，[zero,i) 全1，(two,n) 全2，[i,two] 尚未分类。",
          "steps": [
            "见0交换到zero并推进两指针",
            "见1只推进i",
            "见2交换到two并只缩two"
          ],
          "trace": "输入：nums = [2,0,2,1,1,0]\n输出：[0,0,1,1,2,2]\n\n手推时记录：[0,zero) 全0，[zero,i) 全1，(two,n) 全2，[i,two] 尚未分类。\n\n边界检查：为什么与右侧换入元素后 i 不能立刻加一？\n右侧属于未知区，换回来的可能是0或2，仍需检查；左侧换回的元素来自已知1区，可直接推进。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么与右侧换入元素后 i 不能立刻加一？\n右侧属于未知区，换回来的可能是0或2，仍需检查；左侧换回的元素来自已知1区，可直接推进。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "12-transform"
          ],
          "related": [
            {
              "id": 283,
              "kind": "递进",
              "why": "283 只区分零与非零并保持非零顺序；75 同时维护 0、1、2 三个区域，不要求稳定。"
            },
            {
              "id": 41,
              "kind": "原地分区",
              "why": "41 按值把元素放回应有下标；75 按类别划分区域，两题交换后都要判断换回的元素是否仍未知。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么与右侧换入元素后 i 不能立刻加一？",
            "answer": "右侧属于未知区，换回来的可能是0或2，仍需检查；左侧换回的元素来自已知1区，可直接推进。"
          },
          "source": "02-Wiki/题目详解/75-颜色分类.md",
          "codeBlock": 0,
          "code": "def sortColors(nums):\n    zero = 0          # 0 区域的右边界（下一个 0 应该放的位置）\n    i = 0             # 当前遍历指针\n    two = len(nums) - 1  # 2 区域的左边界（下一个 2 应该放的位置）\n    \n    while i <= two:\n        if nums[i] == 0:\n            # 遇到 0：交换到左边 zero 位置\n            nums[i], nums[zero] = nums[zero], nums[i]\n            zero += 1\n            i += 1\n        elif nums[i] == 2:\n            # 遇到 2：交换到右边 two 位置\n            nums[i], nums[two] = nums[two], nums[i]\n            two -= 1\n            # 注意：i 不动！因为换回来的可能是 0，需要下一轮继续判断\n        else:\n            # 遇到 1：留在中间，直接跳过\n            i += 1",
          "url": "https://leetcode.cn/problems/sort-colors/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/75-%E9%A2%9C%E8%89%B2%E5%88%86%E7%B1%BB.md",
          "sourceHash": "de7cf98fa1be667119fb1c491ca2daa32955edf51d4326cd466acecf2f8dcd2e"
        },
        {
          "uid": "lc-268",
          "id": 268,
          "group": "cancel",
          "title": "丢失的数字",
          "level": "Easy",
          "prompt": "数组 nums 包含 [0, n] 中的 n 个不同数字，找出缺失的那个数。",
          "example": "输入：nums=[3,0,1]\n输出：2",
          "hint": "先问自己：成对相等值异或消失；多数投票消掉的是不同值的一对，成立条件不同。",
          "recognition": "0…n 缺一个数且无重复",
          "mnemonic": "完整范围与实有元素一起抵消。",
          "why": "0…n 缺一个数且无重复。累积异或同时纳入完整范围和实际值，重复出现的对应值最终成对消除。",
          "invariant": "累积异或同时纳入完整范围和实际值，重复出现的对应值最终成对消除。",
          "steps": [
            "初始放入 n",
            "遍历时异或下标 i 和 nums[i]",
            "返回未被抵消的缺失数"
          ],
          "trace": "nums = [3, 0, 1]\n3 ^ 0 ^ 3 ^ 1 ^ 0 ^ 2 ^ 1 = 2，答案为 2。\n\n手推时记录：累积异或同时纳入完整范围和实际值，重复出现的对应值最终成对消除。\n\n边界检查：为什么初始 missing=n，而不是 0？\n循环下标只覆盖 0…n−1，但理论完整范围还包括 n，必须额外加入才能正确处理缺失 n 或其他值。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么初始 missing=n，而不是 0？\n循环下标只覆盖 0…n−1，但理论完整范围还包括 n，必须额外加入才能正确处理缺失 n 或其他值。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "12-cancel"
          ],
          "related": [
            {
              "id": 136,
              "kind": "抵消对象变化",
              "why": "136 由输入自身的成对重复抵消；268 人工加入完整0…n范围，让存在的数各出现两次，只剩缺失值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么初始 missing=n，而不是 0？",
            "answer": "循环下标只覆盖 0…n−1，但理论完整范围还包括 n，必须额外加入才能正确处理缺失 n 或其他值。"
          },
          "source": "02-Wiki/题目详解/268-丢失的数字.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        missing = len(nums)\n        for i, num in enumerate(nums):\n            missing ^= i ^ num\n        return missing",
          "url": "https://leetcode.cn/problems/missing-number/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/268-%E4%B8%A2%E5%A4%B1%E7%9A%84%E6%95%B0%E5%AD%97.md",
          "sourceHash": "7609ff9145cf0c276fd05492da735c240dd59e6d1d4378185398e442dc1f21cf"
        },
        {
          "uid": "lc-169",
          "id": 169,
          "group": "cancel",
          "title": "多数元素",
          "level": "Easy",
          "prompt": "给定一个大小为 n 的数组 nums，返回其中的多数元素。多数元素是指在数组中出现次数大于 ⌊n/2⌋ 的元素。\n\n你可以假设数组是非空的，并且给定的数组总是存在多数元素。",
          "example": "输入：nums = [3,2,3]\n输出：3",
          "hint": "先问自己：成对相等值异或消失；多数投票消掉的是不同值的一对，成立条件不同。",
          "recognition": "保证多数超过一半",
          "mnemonic": "异值配对消，剩下候选不变。",
          "why": "保证多数超过一半。count 是当前候选与其他值抵消后的剩余票数，不是它在整个前缀中的真实总频次。",
          "invariant": "count 是当前候选与其他值抵消后的剩余票数，不是它在整个前缀中的真实总频次。",
          "steps": [
            "票数为零换候选",
            "同值加一，异值减一",
            "最后返回候选"
          ],
          "trace": "输入：nums = [3,2,3]\n输出：3\n\n手推时记录：count 是当前候选与其他值抵消后的剩余票数，不是它在整个前缀中的真实总频次。\n\n边界检查：如果不保证存在多数元素，还能直接返回候选吗？\n不能，抵消只产生一个候选，需要再计数验证它是否超过 n/2；本题保证存在，所以省去验证。",
          "traceLabel": "例子与边界推演",
          "trap": "如果不保证存在多数元素，还能直接返回候选吗？\n不能，抵消只产生一个候选，需要再计数验证它是否超过 n/2；本题保证存在，所以省去验证。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "12-cancel"
          ],
          "related": [
            {
              "id": 136,
              "kind": "易混淆",
              "why": "136 用异或消相同数的偶数次出现；169 用投票消不同值的一对，正确性依赖多数超过一半。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "如果不保证存在多数元素，还能直接返回候选吗？",
            "answer": "不能，抵消只产生一个候选，需要再计数验证它是否超过 n/2；本题保证存在，所以省去验证。"
          },
          "source": "02-Wiki/题目详解/169-多数元素.md",
          "codeBlock": 0,
          "code": "def majorityElement(nums):\n    candidate = 0\n    count = 0\n    \n    for num in nums:\n        if count == 0:       # 当前候选被\"抵消\"完，更换候选\n            candidate = num\n        # 投票：相同 +1，不同 -1\n        count += 1 if num == candidate else -1\n    \n    return candidate",
          "url": "https://leetcode.cn/problems/majority-element/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/169-%E5%A4%9A%E6%95%B0%E5%85%83%E7%B4%A0.md",
          "sourceHash": "bdf69b34d98593bbe89504e9db775a86ac4847e22563bb4df62ee60e98963940"
        },
        {
          "uid": "lc-338",
          "id": 338,
          "group": "bits",
          "title": "比特位计数",
          "level": "Easy",
          "prompt": "返回数组 ans，其中 ans[i] 表示 0 <= i <= n 中 i 的二进制 1 的个数。",
          "example": "n = 5，结果 [0, 1, 1, 2, 1, 2]。",
          "hint": "先问自己：固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "recognition": "需要 0…n 所有数的置位数量",
          "mnemonic": "删一个 1，复用更小数答案。",
          "why": "需要 0…n 所有数的置位数量。i&(i−1) 小于 i，且比 i 少一个 1，其答案在顺序扫描中已经算好。",
          "invariant": "i&(i−1) 小于 i，且比 i 少一个 1，其答案在顺序扫描中已经算好。",
          "steps": [
            "ans[0]=0",
            "对每个 i 找删去最低1的值",
            "答案加一"
          ],
          "trace": "n = 5，结果 [0, 1, 1, 2, 1, 2]。\n\n手推时记录：i&(i−1) 小于 i，且比 i 少一个 1，其答案在顺序扫描中已经算好。\n\n边界检查：为什么这个递推可以按 i 从小到大一次计算？\n对正 i 删除最低1必定减小数值，依赖项总在前面，不会读取尚未计算的状态。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么这个递推可以按 i 从小到大一次计算？\n对正 i 删除最低1必定减小数值，依赖项总在前面，不会读取尚未计算的状态。",
          "complexity": "时间 O(n)，输出空间 O(n)，额外工作空间 O(1)。",
          "prerequisites": [
            "12-bits"
          ],
          "related": [
            {
              "id": 191,
              "kind": "单次到批量",
              "why": "191 循环清最低1来计一个数；338 只清一次并复用更小数的结果，为整个范围做DP。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么这个递推可以按 i 从小到大一次计算？",
            "answer": "对正 i 删除最低1必定减小数值，依赖项总在前面，不会读取尚未计算的状态。"
          },
          "source": "02-Wiki/题目详解/338-比特位计数.md",
          "codeBlock": 0,
          "code": "from typing import List\n\n\nclass Solution:\n    def countBits(self, n: int) -> List[int]:\n        ans = [0] * (n + 1)\n        for i in range(1, n + 1):\n            ans[i] = ans[i & (i - 1)] + 1\n        return ans",
          "url": "https://leetcode.cn/problems/counting-bits/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/338-%E6%AF%94%E7%89%B9%E4%BD%8D%E8%AE%A1%E6%95%B0.md",
          "sourceHash": "05ce6aa15cb625e0c16ec0d84cc34636fe48d681e3c7238b7894272e4385c7db"
        },
        {
          "uid": "lc-190",
          "id": 190,
          "group": "bits",
          "title": "颠倒二进制位",
          "level": "Easy",
          "prompt": "把一个 32 位无符号整数的二进制位顺序完全颠倒。",
          "example": "输入：n=5（二进制低三位是 101，其余位是 0）\n输出：2684354560（二进制最高三位是 101，其余位是 0）",
          "hint": "先问自己：固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "recognition": "翻转固定 32 位二进制",
          "mnemonic": "从右边取一位，往结果左移后接上。",
          "why": "翻转固定 32 位二进制。做完 k 轮后，结果保存原数最低 k 位的逆序排列，仍需补足其余位。",
          "invariant": "做完 k 轮后，结果保存原数最低 k 位的逆序排列，仍需补足其余位。",
          "steps": [
            "固定循环32次",
            "结果左移并接 n&1",
            "原数右移"
          ],
          "trace": "二进制 000...00101 颠倒后，原末尾的 101 会出现在结果最高位。\n\n手推时记录：做完 k 轮后，结果保存原数最低 k 位的逆序排列，仍需补足其余位。\n\n边界检查：为什么不能写 while n 就结束？\n固定字宽里的前导零翻转后会影响高低位置；例如 n=1 应变成最高位的1，必须完成全部32次移位。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么不能写 while n 就结束？\n固定字宽里的前导零翻转后会影响高低位置；例如 n=1 应变成最高位的1，必须完成全部32次移位。",
          "complexity": "固定32位：时间和额外空间 O(1)。",
          "prerequisites": [
            "12-bits"
          ],
          "related": [
            {
              "id": 191,
              "kind": "位的保留",
              "why": "191 只关心1有几个，可跳过零；190 关心每位位置，固定32轮连零位也必须移动。"
            },
            {
              "id": 7,
              "kind": "进制变化",
              "why": "两题都从低位取出再接到结果后面；190 固定32位，7 按十进制有效数位处理并检查有符号溢出。"
            },
            {
              "id": 50,
              "kind": "按位消费",
              "why": "都从最低位开始并右移输入；190 把位搬到结果，50 用指数位决定是否乘入当前平方底数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么不能写 while n 就结束？",
            "answer": "固定字宽里的前导零翻转后会影响高低位置；例如 n=1 应变成最高位的1，必须完成全部32次移位。"
          },
          "source": "02-Wiki/题目详解/190-颠倒二进制位.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def reverseBits(self, n: int) -> int:\n        result = 0\n        for _ in range(32):\n            result = (result << 1) | (n & 1)\n            n >>= 1\n        return result",
          "url": "https://leetcode.cn/problems/reverse-bits/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/190-%E9%A2%A0%E5%80%92%E4%BA%8C%E8%BF%9B%E5%88%B6%E4%BD%8D.md",
          "sourceHash": "149a68f0271386a887ecfc78dd81911e01f3298f25b2b2b4a6564bcb7ad864b7"
        },
        {
          "uid": "lc-371",
          "id": 371,
          "group": "bits",
          "title": "两整数之和",
          "level": "Medium",
          "prompt": "不使用 + 或 − 运算符，返回整数 a 与 b 的和；按32位有符号整数的位表示练习，题目输入保证结果在有效范围内。",
          "example": "输入：a=5, b=3\n输出：8",
          "hint": "先问自己：固定字宽与语言整数表示会影响移位、补码和负数处理。",
          "recognition": "不用加减做整数加法",
          "mnemonic": "异或算本位，AND左移传进位。",
          "why": "不用加减做整数加法。a 与 b 分别保存无进位部分及待加入进位，二者的32位和与原目标相同。",
          "invariant": "a 与 b 分别保存无进位部分及待加入进位，二者的32位和与原目标相同。",
          "steps": [
            "用32位掩码约束结果",
            "同时更新 XOR 与左移进位",
            "进位消失后把符号位还原为 Python 负数"
          ],
          "trace": "5 + 3：0101 ^ 0011 = 0110，进位为 0010；0110 + 0010 = 1000。\n\n手推时记录：a 与 b 分别保存无进位部分及待加入进位，二者的32位和与原目标相同。\n\n边界检查：Python 为什么需要掩码和最后的符号转换？\nPython 整数没有固定32位截断，负数位操作不能直接套有限字宽循环；掩码限制传播，最后按补码符号解释结果。",
          "traceLabel": "例子与边界推演",
          "trap": "Python 为什么需要掩码和最后的符号转换？\nPython 整数没有固定32位截断，负数位操作不能直接套有限字宽循环；掩码限制传播，最后按补码符号解释结果。",
          "complexity": "固定32位：最多约32轮，时间和空间 O(1)。",
          "prerequisites": [
            "12-bits"
          ],
          "related": [
            {
              "id": 43,
              "kind": "进位联系",
              "why": "43 按十进制位累计乘积并传进位；371 在二进制把无进位结果与进位分开，直到进位清空。"
            },
            {
              "id": 191,
              "kind": "位运算用途",
              "why": "191 的 AND 用来消最低1；371 的 AND 找同时为1的位置以产生进位，不能只背运算符而忽略状态含义。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "Python 为什么需要掩码和最后的符号转换？",
            "answer": "Python 整数没有固定32位截断，负数位操作不能直接套有限字宽循环；掩码限制传播，最后按补码符号解释结果。"
          },
          "source": "02-Wiki/题目详解/371-两整数之和.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def getSum(self, a: int, b: int) -> int:\n        mask = 0xFFFFFFFF\n        max_int = 0x7FFFFFFF\n\n        while b:\n            a, b = (a ^ b) & mask, ((a & b) << 1) & mask\n\n        return a if a <= max_int else ~(a ^ mask)",
          "url": "https://leetcode.cn/problems/sum-of-two-integers/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/371-%E4%B8%A4%E6%95%B4%E6%95%B0%E4%B9%8B%E5%92%8C.md",
          "sourceHash": "64c653dd2a106b84cde33a1e02e45e702880dd21da90016edcfe28744f58beb6"
        },
        {
          "uid": "lc-202",
          "id": 202,
          "group": "cycles",
          "title": "快乐数",
          "level": "Easy",
          "prompt": "反复把正整数替换为各位平方和；判断它能否最终到达 1。",
          "example": "19 -> 82 -> 68 -> 100 -> 1，因此返回 True。",
          "hint": "先问自己：每个状态唯一决定下一状态，重复状态形成环；映射含义决定环入口的意义。",
          "recognition": "反复数位平方和，判断能否到1",
          "mnemonic": "到1成功，遇旧状态失败。",
          "why": "反复数位平方和，判断能否到1。seen 保存此前出现的完整数值状态，重复状态后未来轨迹也会完全重复。",
          "invariant": "seen 保存此前出现的完整数值状态，重复状态后未来轨迹也会完全重复。",
          "steps": [
            "记录当前数",
            "逐位提取平方相加",
            "继续直到1或重复状态"
          ],
          "trace": "19 -> 82 -> 68 -> 100 -> 1，因此返回 True。\n\n手推时记录：seen 保存此前出现的完整数值状态，重复状态后未来轨迹也会完全重复。\n\n边界检查：为什么重复状态就能断定永远到不了1？\n变换是确定的，同一状态之后会重复同一路径；如果此前这圈没有1，再转多少圈也不会出现1。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么重复状态就能断定永远到不了1？\n变换是确定的，同一状态之后会重复同一路径；如果此前这圈没有1，再转多少圈也不会出现1。",
          "complexity": "设访问 t 个状态、最大位数 d：时间 O(td)，空间 O(t)；题目32位范围下状态有限。",
          "prerequisites": [
            "12-cycles"
          ],
          "related": [
            {
              "id": 141,
              "kind": "状态成环",
              "why": "141 沿节点next走；202 沿数位平方和变换走，两者都是一个状态唯一决定下一状态，重复即进入环。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么重复状态就能断定永远到不了1？",
            "answer": "变换是确定的，同一状态之后会重复同一路径；如果此前这圈没有1，再转多少圈也不会出现1。"
          },
          "source": "02-Wiki/题目详解/202-快乐数.md",
          "codeBlock": 0,
          "code": "class Solution:\n    def isHappy(self, n: int) -> bool:\n        seen = set()\n\n        while n != 1 and n not in seen:\n            seen.add(n)\n            total = 0\n            while n:\n                n, digit = divmod(n, 10)\n                total += digit * digit\n            n = total\n\n        return n == 1",
          "url": "https://leetcode.cn/problems/happy-number/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/202-%E5%BF%AB%E4%B9%90%E6%95%B0.md",
          "sourceHash": "057c8015ebf56b0e3c385087e62b08a4c44d6777731ef978010e43d8e5334bc7"
        },
        {
          "uid": "lc-287",
          "id": 287,
          "group": "cycles",
          "title": "寻找重复数",
          "level": "Medium",
          "prompt": "给定一个包含 n + 1 个整数的数组 nums，其数字都在 [1, n] 范围内（包括 1 和 n）。可知至少存在一个重复的整数。假设只有一个重复的整数，返回这个重复的数。\n\n你设计的解决方案必须不修改数组 nums 且只用常量级 O(1) 的额外空间。",
          "example": "输入：nums = [1,3,4,2,2]\n输出：2",
          "hint": "先问自己：每个状态唯一决定下一状态，重复状态形成环；映射含义决定环入口的意义。",
          "recognition": "n+1 个数都在 1…n 且不能修改",
          "mnemonic": "值当 next，重复数是环入口。",
          "why": "n+1 个数都在 1…n 且不能修改。从固定起点沿 nums 跳转形成函数图，汇入环的入口对应重复的数值。",
          "invariant": "从固定起点沿 nums 跳转形成函数图，汇入环的入口对应重复的数值。",
          "steps": [
            "快慢指针走到相遇",
            "慢指针重置为原起点 nums[0]",
            "两者同速前进到再次相遇"
          ],
          "trace": "输入：nums = [1,3,4,2,2]\n输出：2\n\n手推时记录：从固定起点沿 nums 跳转形成函数图，汇入环的入口对应重复的数值。\n\n边界检查：为什么找到第一次相遇点还不能直接返回？\n第一次相遇可能发生在环内任意位置；重置一方并同速走，才利用路程关系定位环入口。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么找到第一次相遇点还不能直接返回？\n第一次相遇可能发生在环内任意位置；重置一方并同速走，才利用路程关系定位环入口。",
          "complexity": "时间 O(n)，空间 O(1)，依赖数值范围与唯一重复数条件。",
          "prerequisites": [
            "12-cycles"
          ],
          "related": [
            {
              "id": 142,
              "kind": "同模板",
              "why": "287 把数组值解释为下个下标，将142的快慢指针环入口算法迁移到数组；值域约束保证这种映射成立。"
            },
            {
              "id": 217,
              "kind": "空间限制变化",
              "why": "217 可用集合直接判重复；287 在特殊值域与常数空间约束下，借函数图找环入口定位重复值。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么找到第一次相遇点还不能直接返回？",
            "answer": "第一次相遇可能发生在环内任意位置；重置一方并同速走，才利用路程关系定位环入口。"
          },
          "source": "02-Wiki/题目详解/287-寻找重复数.md",
          "codeBlock": 0,
          "code": "def findDuplicate(nums):\n    # 第一阶段：找相遇点\n    slow = nums[0]\n    fast = nums[0]\n    while True:\n        slow = nums[slow]          # 走一步\n        fast = nums[nums[fast]]    # 走两步\n        if slow == fast:\n            break\n    \n    # 第二阶段：找环入口\n    slow = nums[0]\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n    \n    return slow  # 环的入口就是重复数",
          "url": "https://leetcode.cn/problems/find-the-duplicate-number/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/287-%E5%AF%BB%E6%89%BE%E9%87%8D%E5%A4%8D%E6%95%B0.md",
          "sourceHash": "df1eb96c9e858f2dcb35be459104ffe2c0d4ddc7952b95a4c37431c0459adc39"
        },
        {
          "uid": "lc-50",
          "id": 50,
          "group": "transform",
          "title": "Pow(x, n)",
          "level": "Medium",
          "prompt": "计算 x 的整数次幂 x^n，其中 n 可以为负数。",
          "example": "输入：x=2.0, n=10\n输出：1024.0",
          "hint": "先问自己：先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "recognition": "求整数次幂",
          "mnemonic": "指数拆二进制，底数每步平方。",
          "why": "求整数次幂。result × x^n 始终等于已处理负指数后的目标幂。",
          "invariant": "result × x^n 始终等于已处理负指数后的目标幂。",
          "steps": [
            "负指数先倒底数并变正",
            "低位为1就把当前底数乘进结果",
            "底数平方、指数右移直到零"
          ],
          "trace": "2^10：二进制 1010，只累乘 2^2 和 2^8，答案为 1024。\n\n手推时记录：result × x^n 始终等于已处理负指数后的目标幂。\n\n边界检查：为什么指数每次右移一位，底数要同时平方？\nn=2q+b 时 x^n=(x²)^q·x^b，先处理低位 b，再把剩余问题变为平方后的底数和一半指数。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么指数每次右移一位，底数要同时平方？\nn=2q+b 时 x^n=(x²)^q·x^b，先处理低位 b，再把剩余问题变为平方后的底数和一半指数。",
          "complexity": "时间 O(log(|n|+1))，空间 O(1)，遵循题目合法底数约束。",
          "prerequisites": [
            "12-transform"
          ],
          "related": [
            {
              "id": 190,
              "kind": "按位消费",
              "why": "都从最低位开始并右移输入；190 把位搬到结果，50 用指数位决定是否乘入当前平方底数。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么指数每次右移一位，底数要同时平方？",
            "answer": "n=2q+b 时 x^n=(x²)^q·x^b，先处理低位 b，再把剩余问题变为平方后的底数和一半指数。"
          },
          "source": "02-Wiki/题目详解/50-Pow(x,n).md",
          "codeBlock": 0,
          "code": "class Solution:\n    def myPow(self, x: float, n: int) -> float:\n        if n < 0:\n            x = 1 / x\n            n = -n\n\n        result = 1.0\n        while n:\n            if n & 1:\n                result *= x\n            x *= x\n            n >>= 1\n\n        return result",
          "url": "https://leetcode.cn/problems/powx-n/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/50-Pow%28x%2Cn%29.md",
          "sourceHash": "d4624ce32a1c0104f00380eccadfe633e352dcbe9bf679f669316bc9aba9e012"
        },
        {
          "uid": "lc-7",
          "id": 7,
          "group": "transform",
          "title": "整数反转",
          "level": "Medium",
          "prompt": "反转 32 位有符号整数 x 的十进制数字；若结果越界，返回 0。",
          "example": "输入：x=−120\n输出：−21",
          "hint": "先问自己：先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "recognition": "十进制整数反转且结果须在32位内",
          "mnemonic": "末位弹出，新数乘十再接上。",
          "why": "十进制整数反转且结果须在32位内。result 保存已取出数位的逆序值，每次追加前检查是否会超过对应符号的32位上限。",
          "invariant": "result 保存已取出数位的逆序值，每次追加前检查是否会超过对应符号的32位上限。",
          "steps": [
            "保存符号并取绝对值",
            "divmod 弹出末位",
            "先检查溢出再乘十追加，最终恢复符号"
          ],
          "trace": "x = -120 -> abs(x) 反转为 21 -> 乘回符号，答案 -21。\n\n手推时记录：result 保存已取出数位的逆序值，每次追加前检查是否会超过对应符号的32位上限。\n\n边界检查：为什么负数允许的绝对值上限比正数多1？\n32位有符号范围为 −2³¹ 到 2³¹−1，负侧可到 2147483648 的绝对值，正侧只能到 2147483647。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么负数允许的绝对值上限比正数多1？\n32位有符号范围为 −2³¹ 到 2³¹−1，负侧可到 2147483648 的绝对值，正侧只能到 2147483647。",
          "complexity": "时间 O(d)，空间 O(1)，d 为十进制位数。",
          "prerequisites": [
            "12-transform"
          ],
          "related": [
            {
              "id": 190,
              "kind": "进制变化",
              "why": "两题都从低位取出再接到结果后面；190 固定32位，7 按十进制有效数位处理并检查有符号溢出。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么负数允许的绝对值上限比正数多1？",
            "answer": "32位有符号范围为 −2³¹ 到 2³¹−1，负侧可到 2147483648 的绝对值，正侧只能到 2147483647。"
          },
          "source": "02-Wiki/题目详解/7-整数反转.md",
          "codeBlock": 0,
          "codeOverride": "class Solution:\n    def reverse(self, x: int) -> int:\n        sign = -1 if x < 0 else 1\n        remaining = abs(x)\n        limit = 2 ** 31 if sign < 0 else 2 ** 31 - 1\n        result = 0\n        while remaining:\n            remaining, digit = divmod(remaining, 10)\n            if result > (limit - digit) // 10:\n                return 0\n            result = result * 10 + digit\n        return sign * result",
          "codeNote": "教学调整：原笔记用 Python 任意精度整数反转后再检查；这里在追加数位前检查上限，避免先生成超出32位范围的结果。",
          "code": "class Solution:\n    def reverse(self, x: int) -> int:\n        sign = -1 if x < 0 else 1\n        remaining = abs(x)\n        limit = 2 ** 31 if sign < 0 else 2 ** 31 - 1\n        result = 0\n        while remaining:\n            remaining, digit = divmod(remaining, 10)\n            if result > (limit - digit) // 10:\n                return 0\n            result = result * 10 + digit\n        return sign * result",
          "url": "https://leetcode.cn/problems/reverse-integer/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/7-%E6%95%B4%E6%95%B0%E5%8F%8D%E8%BD%AC.md",
          "sourceHash": "70b4bc6c43d9c60651d8d395f3923f23336d65d96ce4c5c43189ec73b48caef8"
        },
        {
          "uid": "lc-31",
          "id": 31,
          "group": "transform",
          "title": "下一个排列",
          "level": "Medium",
          "prompt": "整数数组的一个排列就是将其所有成员以序列或线性顺序排列。\n\n整数数组的下一个排列是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的下一个排列就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即其元素按升序排列）。\n\n你必须原地修改，只使用常量额外空间。",
          "example": "输入：nums = [1,2,3]\n输出：[1,3,2]",
          "hint": "先问自己：先写清每步保留的代数关系或区域范围，再更新少量变量。",
          "recognition": "原地变成刚好更大的排列",
          "mnemonic": "找升点、换稍大、反转尾。",
          "why": "原地变成刚好更大的排列。从右侧找到的最长不升后缀已是该前缀下最大排列，必须增大它前面的枢轴才能前进。",
          "invariant": "从右侧找到的最长不升后缀已是该前缀下最大排列，必须增大它前面的枢轴才能前进。",
          "steps": [
            "从右找 nums[i]<nums[i+1]",
            "与右侧最靠右的大于它的数交换",
            "反转后缀变最小，若无升点反转全数组"
          ],
          "trace": "输入：nums = [1,2,3]\n输出：[1,3,2]\n\n手推时记录：从右侧找到的最长不升后缀已是该前缀下最大排列，必须增大它前面的枢轴才能前进。\n\n边界检查：为什么换后要反转后缀，而不是保持原顺序？\n枢轴已最小幅度增大，后缀必须取最小排列才是紧邻的下一项；交换后的后缀仍不升，反转即可升序。",
          "traceLabel": "例子与边界推演",
          "trap": "为什么换后要反转后缀，而不是保持原顺序？\n枢轴已最小幅度增大，后缀必须取最小排列才是紧邻的下一项；交换后的后缀仍不升，反转即可升序。",
          "complexity": "时间 O(n)，空间 O(1)。",
          "prerequisites": [
            "12-transform"
          ],
          "related": [
            {
              "id": 46,
              "kind": "枚举到邻居",
              "why": "46 枚举全部排列；31 利用最长不升后缀，只构造字典序紧邻的下一排列。"
            }
          ],
          "followup": {
            "type": "explain",
            "prompt": "为什么换后要反转后缀，而不是保持原顺序？",
            "answer": "枢轴已最小幅度增大，后缀必须取最小排列才是紧邻的下一项；交换后的后缀仍不升，反转即可升序。"
          },
          "source": "02-Wiki/题目详解/31-下一个排列.md",
          "codeBlock": 0,
          "code": "def nextPermutation(nums):\n    n = len(nums)\n    \n    # Step 1: 从右向左找第一个升序对 (i, i+1) 满足 nums[i] < nums[i+1]\n    i = n - 2\n    while i >= 0 and nums[i] >= nums[i + 1]:\n        i -= 1\n    \n    # Step 2: 如果找到了这样的 i，从右向左找第一个大于 nums[i] 的数\n    if i >= 0:\n        j = n - 1\n        while j >= 0 and nums[j] <= nums[i]:\n            j -= 1\n        # Step 3: 交换\n        nums[i], nums[j] = nums[j], nums[i]\n    \n    # Step 4: 反转 i+1 到末尾（使这部分变成升序/最小排列）\n    l, r = i + 1, n - 1\n    while l < r:\n        nums[l], nums[r] = nums[r], nums[l]\n        l += 1\n        r -= 1",
          "url": "https://leetcode.cn/problems/next-permutation/",
          "noteUrl": "obsidian://open?vault=LeetCode-BaiTiTong&file=02-Wiki/%E9%A2%98%E7%9B%AE%E8%AF%A6%E8%A7%A3/31-%E4%B8%8B%E4%B8%80%E4%B8%AA%E6%8E%92%E5%88%97.md",
          "sourceHash": "c22864d1fef5cf6889f6ac1d2bc7b47de4c3104993ce1a8b4e47de6ca846c799"
        }
      ]
    }
  ]
};
