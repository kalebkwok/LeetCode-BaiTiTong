#!/bin/zsh -l
cd -- "$(dirname -- "$0")" || exit 1
if [[ ! -x .venv/bin/python ]]; then
  print "请先按 README 创建 .venv、安装锁定依赖并构建前端。"
  print "准备完成后，双击只启动服务，不会联网安装或打包。"
  read -r "?按回车关闭这个窗口。"
  exit 1
fi
.venv/bin/python start.py "$@"
review_exit=$?
if [ "$review_exit" -ne 0 ]; then
  print "启动未完成，请查看上面的提示。按回车关闭这个窗口。"
  read -r
fi
exit "$review_exit"
