"""Check the actual displayed Python solutions against edge-case oracles."""
import copy
import json
import random
import unittest
import sys
import tempfile
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(BASE))
from build_content import build
with tempfile.TemporaryDirectory() as output:
    build(output)
    LIB=json.loads((Path(output)/'library.json').read_text())
CARDS={c['id']:c for t in LIB['topics'] for c in t['cards']}
METHODS={53:'maxSubArray',56:'merge',189:'rotate',238:'productExceptSelf',41:'firstMissingPositive',73:'setZeroes',54:'spiralOrder',48:'rotate',240:'searchMatrix',66:'plusOne',36:'isValidSudoku',57:'insert',435:'eraseOverlapIntervals',252:'canAttendMeetings',253:'minMeetingRooms',1851:'minInterval',43:'multiply'}

def call(number,*args):
    ns={}
    exec(CARDS[number]['code'],ns)
    target=getattr(ns['Solution'](),METHODS[number]) if 'Solution' in ns else ns[METHODS[number]]
    values=copy.deepcopy(args)
    answer=target(*values)
    return values[0] if number in [189,73,48] else answer

class Solutions(unittest.TestCase):
    def test_examples_cover_every_problem(self):
        cases=[(53,([-5,-2,-8],),-2),(56,([[1,10],[2,3],[10,12]],),[[1,12]]),
          (189,([1,2,3,4,5],7),[4,5,1,2,3]),(238,([0,2,3],),[6,0,0]),
          (41,([1,1],),2),(73,([[0,1],[1,1]],),[[0,0],[0,1]]),
          (54,([[1,2,3]],),[1,2,3]),(54,([[1],[2],[3]],),[1,2,3]),
          (48,([[1,2],[3,4]],),[[3,1],[4,2]]),
          (240,([[1,4,7],[2,5,8],[3,6,9]],5),True),
          (66,([9,9],),[1,0,0]),(57,([[1,2],[5,6]],[2,5]),[[1,6]]),
          (435,([[1,10],[2,3],[3,4]],),1),(252,([[0,10],[10,20]],),True),
          (253,([[0,10],[1,2],[3,4],[11,12]],),2),
          (1851,([[1,4],[2,4],[3,6],[4,4]],[5,2,4,3,4,9]),[4,3,1,3,1,-1]),
          (43,('12','34'),'408'),(43,('0','999'),'0')]
        for n,args,expected in cases:
            with self.subTest(problem=n):self.assertEqual(call(n,*args),expected)
        board=[['.']*9 for _ in range(9)]
        self.assertTrue(call(36,board));board[0][0]=board[1][1]='5';self.assertFalse(call(36,board))
        ns={};exec(CARDS[2013]['code'],ns);points=ns['DetectSquares']()
        for p in [[3,10],[11,2],[3,2]]:points.add(p)
        self.assertEqual(points.count([11,10]),1);points.add([11,2]);self.assertEqual(points.count([11,10]),2)

    def test_arrays_and_zero_marking_against_simple_oracles(self):
        rng=random.Random(238)
        for _ in range(80):
            nums=[rng.randint(-3,5) for _ in range(rng.randint(1,8))]
            expected=next(x for x in range(1,len(nums)+2) if x not in nums)
            self.assertEqual(call(41,nums),expected)
            self.assertEqual(call(53,nums),max(sum(nums[i:j]) for i in range(len(nums)) for j in range(i+1,len(nums)+1)))
            if len(nums)>1:
                products=[]
                for i in range(len(nums)):
                    total=1
                    for j,v in enumerate(nums):
                        if i!=j:total*=v
                    products.append(total)
                self.assertEqual(call(238,nums),products)
            matrix=[[rng.randrange(4) for _ in range(5)] for _ in range(3)]
            rows={i for i in range(3) if 0 in matrix[i]}
            cols={j for j in range(5) if any(matrix[i][j]==0 for i in range(3))}
            expected=[[0 if i in rows or j in cols else matrix[i][j] for j in range(5)] for i in range(3)]
            self.assertEqual(call(73,matrix),expected)

    def test_heaps_against_brute_force(self):
        rng=random.Random(1851)
        for _ in range(60):
            intervals=[]
            for _ in range(rng.randint(1,9)):
                start=rng.randint(0,12);intervals.append([start,start+rng.randint(1,7)])
            queries=[rng.randint(0,22) for _ in range(8)]
            expected=[min([b-a+1 for a,b in intervals if a<=q<=b],default=-1) for q in queries]
            self.assertEqual(call(1851,intervals,queries),expected)
            peak=max(sum(a<=t<b for a,b in intervals) for t in range(23))
            self.assertEqual(call(253,intervals),peak)

if __name__=='__main__':unittest.main()
