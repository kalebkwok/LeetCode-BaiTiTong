"""Compile topic records and original Markdown solutions into an offline library."""
import ast
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
REQUIRED = ('uid','id','group','title','level','prompt','example','hint','mnemonic','why',
            'steps','trace','trap','complexity','recognition','invariant','prerequisites','related','followup','source')

def build():
    topics = json.loads((HERE / 'topics.json').read_text())
    all_ids = set()
    for topic in topics:
        topic['cards'] = json.loads((HERE / topic['content']).read_text())
        topic['concepts'] = json.loads((HERE / topic['concepts']).read_text())
        concepts = {c['id'] for c in topic['concepts']}
        groups = {g['id'] for g in topic['groups']}
        order = {value:i for i,value in enumerate(topic.get('firstProblems',[]))}
        topic['cards'].sort(key=lambda c:order.get(c['id'],len(order)))
        for card in topic['cards']:
            missing = [key for key in REQUIRED if key not in card]
            assert not missing, f"{card.get('id')}: missing {missing}"
            assert card['uid'] == f"lc-{card['id']}" and card['uid'] not in all_ids
            assert card['group'] in groups and set(card['prerequisites']) <= concepts
            assert card['followup']['type'] in ('explain','trace','transfer')
            assert card['followup']['prompt'] and card['followup']['answer']
            all_ids.add(card['uid'])
            path = (ROOT / card['source']).resolve()
            assert path.is_relative_to(ROOT) and path.is_file()
            source = path.read_text()
            blocks = re.findall(r'```python\n(.*?)```',source,re.S)
            assert blocks, f'No Python solution: {path}'
            block_index = card.get('codeBlock', 0)
            assert isinstance(block_index, int) and 0 <= block_index < len(blocks), f'Invalid codeBlock: {path}'
            card['code'] = card.get('codeOverride',blocks[block_index].strip())
            parsed = ast.parse(card['code'],str(path))
            assert any(isinstance(node, (ast.FunctionDef, ast.ClassDef)) for node in parsed.body), f'Incomplete solution: {path}'
            card['url'] = re.search(r'https://\S+',source).group(0)
            card['noteUrl'] = 'obsidian://open?vault=LeetCode-BaiTiTong&file='+quote(card['source'])
            card['sourceHash'] = hashlib.sha256(source.encode()).hexdigest()
            (HERE/'dist/notes').mkdir(exist_ok=True)
            escaped = html.escape(source)
            (HERE/f"dist/notes/{card['uid']}.html").write_text(
                '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
                f'<title>{html.escape(card["title"])} · 原题解</title>'
                '<style>body{max-width:900px;margin:40px auto;padding:0 22px;color:#172136;background:#f7f9fd;font:16px/1.9 system-ui}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}a{color:#244bd6}</style>'
                '<a href="../index.html">返回记忆卡</a><p>本地 Markdown 题解快照；最新版本请在 Obsidian 中查看。</p>'
                f'<pre>{escaped}</pre></html>')
    for topic in topics:
        for card in topic['cards']:
            assert all(f"lc-{r['id']}" in all_ids for r in card['related'])
    library = {'version':1,'topics':topics}
    (HERE/'dist/cards.js').write_text('window.REVIEW_LIBRARY = '+json.dumps(library,ensure_ascii=False,indent=2)+';\n')
    sheet = ['# 数组与矩阵 · 记忆速查表','','每天最多 3 道新题。先遮住答案复述，再核对；每天选 1 道合上答案写代码。',
             '','| 题目 | 一句话思路 | 容易错的地方 |','|---|---|---|']
    arrays_topic = next(t for t in topics if t['id'] == 'arrays-matrices-03')
    for card in arrays_topic['cards']:
        sheet.append(f"| {card['id']} · {card['title']} | {card['mnemonic']} | {card['trap']} |")
    sheet += ['','## 每次问自己','','1. 什么条件让我想到这种办法？','2. 关键变量一直代表什么？','3. 什么输入会让错误写法露馅？',
              '','认出、讲清、写出分开评价。隔 1、3、7、14、30 天回忆是可调整的起点；忘了先缩短间隔。',
              '','方法依据：[The Learning Scientists](https://www.learningscientists.org/faq)。内容来自本仓库的专题总结和对应题解。']
    (HERE/'数组与矩阵-一页记忆表.md').write_text('\n'.join(sheet)+'\n')
    print(f"Built {len(all_ids)} problems across {len(topics)} topic(s), including local source snapshots.")

if __name__ == '__main__':
    build()
