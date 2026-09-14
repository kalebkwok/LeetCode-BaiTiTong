"""One focused integration check for topic expansion; does not rerun algorithm tests."""
import ast
import json
import re
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE.parent.parent


class LibraryContentTest(unittest.TestCase):
    def test_every_source_has_one_complete_reachable_card(self):
        payload = (BASE / 'dist/cards.js').read_text()
        library = json.loads(payload.removeprefix('window.REVIEW_LIBRARY = ').rstrip().removesuffix(';'))
        source_ids = {int(p.name.split('-')[0]) for p in (ROOT / '02-Wiki/题目详解').glob('*.md')}
        cards = [c for t in library['topics'] for c in t['cards']]
        self.assertEqual(len(cards), len(source_ids))
        self.assertEqual({c['id'] for c in cards}, source_ids)
        self.assertEqual(len({c['uid'] for c in cards}), len(cards))
        self.assertEqual(len({t['id'] for t in library['topics']}), len(library['topics']))
        for topic in library['topics']:
            concepts = {c['id'] for c in topic['concepts']}
            groups = {g['id'] for g in topic['groups']}
            self.assertTrue(topic['connectionRule'])
            self.assertEqual({c['group'] for c in topic['cards']}, groups)
            self.assertTrue(set(topic['firstProblems']) <= {c['id'] for c in topic['cards']})
            for card in topic['cards']:
                with self.subTest(problem=card['id']):
                    self.assertEqual(card['uid'], f"lc-{card['id']}")
                    for field in ('prompt','example','mnemonic','invariant','trace','trap','complexity'):
                        self.assertTrue(card[field].strip(), field)
                    self.assertGreaterEqual(len(card['steps']), 2)
                    self.assertTrue(card['prerequisites'])
                    self.assertTrue(set(card['prerequisites']) <= concepts)
                    self.assertTrue(card['related'])
                    self.assertEqual(len({r['id'] for r in card['related']}), len(card['related']))
                    for related in card['related']:
                        self.assertIn(related['id'], source_ids)
                        self.assertNotEqual(related['id'], card['id'])
                        self.assertTrue(related['why'].strip())
                    self.assertTrue(card['followup']['prompt'].strip())
                    self.assertTrue(card['followup']['answer'].strip())
                    source = (ROOT / card['source']).read_text()
                    blocks = re.findall(r'```python\n(.*?)```', source, re.S)
                    expected = card.get('codeOverride', blocks[card.get('codeBlock', 0)].strip())
                    self.assertEqual(card['code'], expected)
                    self.assertTrue(any(isinstance(n, (ast.FunctionDef, ast.ClassDef)) for n in ast.parse(card['code']).body))
                    self.assertTrue((BASE / f"dist/notes/{card['uid']}.html").is_file())


if __name__ == '__main__':
    unittest.main()
