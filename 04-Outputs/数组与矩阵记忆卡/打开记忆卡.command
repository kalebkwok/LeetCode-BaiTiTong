#!/bin/zsh -l
cd -- "$(dirname -- "$0")" || exit 1
python3 start.py
review_exit=$?
if [ "$review_exit" -ne 0 ]; then
  print "启动未完成，请查看上面的提示。按回车关闭这个窗口。"
  read -r
fi
exit "$review_exit"
