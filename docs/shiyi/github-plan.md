# 拾忆：代码基线、GitHub 与运行交付计划

状态：上传前规划；本轮未创建分支、提交、push、PR或部署。主规格见 [spec](spec.md)，执行分工见 [agent-plan](agent-plan.md)。

## 1. 已核对的仓库状态

2026-09-13 的只读检查结果：

| 项目 | 当前值 |
|---|---|
| 本地分支 | `main`，跟踪 `origin/main` |
| 本地 HEAD 短 SHA | `12907ab`；实施开始时重新读取完整 SHA |
| origin | `https://github.com/kalebkwok/LeetCode-BaiTiTong.git` |
| upstream | `https://github.com/mo-lx/LeetCode-BaiTiTong.git` |
| 目标仓库 | 用户自己的公开 fork，默认分支 `main` |
| 应用跟踪状态 | `04-Outputs/数组与矩阵记忆卡/` 整个目录尚未被 Git 跟踪 |
| 其他改动 | 52 个已跟踪文件有改动，另有 `.openai/` 和其他未跟踪输出 |
| 题库依赖 | 177 个题解源文件都已存在于 HEAD；其中 24 个本地版本与 HEAD 不同 |

仓库是 [kalebkwok/LeetCode-BaiTiTong](https://github.com/kalebkwok/LeetCode-BaiTiTong)。这是建议的默认上传目标；不新建仓库、不向 `upstream` 推送、不改变仓库可见性。

## 2. 上传内容与私人数据

公开仓库只收源码、可公开的题库内容、测试、构建配置、依赖锁、说明和CI。GitHub保存代码版本；共享学习进度仍在本机SQLite，通过Tailscale访问。

| 可纳入审核后提交 | 不提交 |
|---|---|
| React、Python源码及CSS | `data/`、SQLite、WAL/SHM、备份、recovery |
| 题库JSON、构建脚本、必要公开题解变更 | 草稿、实际进度导出、请求队列导出、个人笔记 |
| 规格、执行计划、启动与维护说明 | `.env`、token、凭证、私人Tailscale域名/访问名单 |
| 人工构造测试及配置 | `.venv/`、node_modules、缓存、覆盖率、测试截图/日志 |
| 前后端依赖清单与锁文件 | `.openai/`、本机应用配置、无关学习日志改动 |
| 兼容阶段的旧手写dist源码 | React最终构建目录与自动生成的public/content |

旧 `dist/cards.js` / `dist/notes` 可能包含完整Markdown快照，因此也必须审核；“生成文件”不代表天然可公开。初始基线可保留旧应用所需产物，最终迁移后删去旧dist，改为可重复构建。

实施时更新应用 `.gitignore`，覆盖 data、`*.sqlite*`、`*.db`、`*-wal`、`*-shm`、`.env*`（允许无真实值的example）、`.venv/`、`__pycache__/`、node_modules、frontend/dist、frontend/public/content、浏览器测试产物。不要先忽略整个旧dist，否则尚未迁移的手写代码会漏入基线。

`.gitignore` 不会删除已经跟踪的敏感文件；每次发布仍核对暂存文件和差异。不能使用仓库根目录的 `git add .` 或 `git add -A`。

## 3. 基线建立：先解决未跟踪应用

主 agent 在正式实施时按以下顺序操作；现在只记录计划。

1. 刷新只读 Git 状态和 origin 默认分支，确认原工作区改动仍属于用户。不要 stash、reset、清理或覆盖它们。
2. 从核实的本地 HEAD 新建隔离工作区 `.worktrees/shiyi-a/` 和分支 `codex/shiyi-a`。根 `.gitignore` 已忽略 `.worktrees/`。这时新工作区没有未跟踪应用，是预期行为。
3. 只复制经过清单筛选的应用源码、题库、旧运行资源、测试、启动器及 `docs/shiyi/` 到新工作区。复制程序采用路径白名单，不使用包含data的整目录递归复制。
4. 对24个有本地差异的题解逐个查看差异。将构建必需、可公开的题库变更作为单独的content基线提交；不将学习记录、个人卡点或其他无关段落夹带上传。若不采用某些差异，则依据已提交的题解重新生成快照并报告差异；不能保留依赖未提交本地文件的“可复现”假象。
5. 在隔离工作区用临时数据跑旧版基线检查，核对177题/12专题、选用的代码块和题解来源。与当前使用版本有业务/题库差异时先处理，不进入框架迁移。
6. 建立 `chore(shiyi): capture reproducible local app baseline` 提交，记录完整 SHA；代码中的数据目录结构可保留，但不复制、创建或初始化真实学习记录。
7. 前后端sub-agent都从这个已提交基线开始。主agent负责将后续规范更新带入实施工作区，避免两份spec分叉。

复制和基线检查在隔离工作区进行，原应用继续可用。真实数据不放进worktree；最终切换时由稳定的原位置启动器或显式 `--data-dir` 指向原数据库，先处理浏览器队列和本地备份。

## 4. 提交、分支和PR

使用一条实施分支和小提交，避免给每个agent增加分支管理负担。建议提交顺序：

1. `docs(shiyi): define migration specification and delivery plan`
2. `chore(shiyi): capture reproducible local app baseline`（必要题库差异另提交）
3. `build(shiyi): add frontend build and isolated content output`
4. `refactor(shiyi): serve compatible API with FastAPI`
5. `refactor(shiyi): migrate learning center to React`
6. `refactor(shiyi): migrate review and remaining views`
7. `feat(shiyi): support private shared access and consistent study dates`
8. `test(shiyi): verify migration and clean-checkout build`

主agent统一暂存明确文件并查看diff；每个提交对应可解释的一项改动。不要把依赖升级、算法题内容重写和界面迁移混成一个提交。

### 上传前检查

- 基线和最终构建都能在干净checkout复现。
- 暂存清单只包含本次约定目录，以及单独核准的内容依赖。
- 日志、截图、JSON夹具中没有来自实际data的内容。
- 完整运行必要检查，列明未完成的真实设备验收。
- origin仍指向用户fork，PR的base是该fork的main；不会误投向上游项目。

### 上传示意

以下在隔离实施工作区执行，前置条件是已完成精确暂存与提交；不是本轮已执行命令：

```sh
git push -u origin codex/shiyi-a
gh pr create --repo kalebkwok/LeetCode-BaiTiTong --base main --head codex/shiyi-a --draft --title "拾忆：迁移至 React、FastAPI 与 SQLite" --body-file /tmp/shiyi-pr-body.md
```

先生成PR正文文件，内容说明最终行为、迁移步骤、验证结果和限制。遇到远端有新提交，先读取差异、在隔离工作区整合；不强推覆盖。参考 [GitHub推送说明](https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository)。

用户本轮要求规划上传方式，因此本轮不执行push。正式发布阶段由主agent完成可审阅的差异和PR正文后，再执行该阶段获得授权的上传动作；已得到的授权不重复询问。合并main及任何公网发布不视为本轮已授权动作。

## 5. CI与构建产物

新增一份 `.github/workflows/shiyi.yml`，限定触发路径：应用、`docs/shiyi`、被题库构建引用的题解与该workflow。PR运行安装、内容生成、类型检查、前端构建、必要数据库/API/model/题库检查及少量浏览器流程。

- Python/Node版本和依赖与本地锁定值一致。CI不使用浮动latest作为运行环境契约。
- SQLite测试使用runner临时目录；无需真实数据库、Tailscale登录或云密钥。
- 浏览器流程使用本地临时服务，检查结束关闭进程、清理临时资源；真实手机检查单独记录。
- 前端产物可作为CI artifact便于复核，但不长期提交编译文件。源码仓库不附带node_modules或.venv。
- 普通文档更新可只做文档检查；只有相关实现或失败变化才扩大测试，不为每条PR重复跑所有算法题。
- CI只验证代码，不自动操作主机SQLite、不自动开Tailscale、不自动部署公网、不自动合并。

## 6. 上传GitHub与让手机访问是两个流程

GitHub Pages只提供静态文件，不能运行这套FastAPI与SQLite服务，因此本版不使用Pages部署应用。参考 [GitHub Pages说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

运行交付流程：

1. 本机取得已核验版本，安装锁定依赖并构建React/题库。
2. 原浏览器处理未提交队列；通过应用在线备份或停服完整复制保留恢复点。
3. 在原应用位置更新已跟踪源码，避免复制data；或在独立发布目录启动并显式指定原data绝对路径。新旧服务不能同时占用同一目录。
4. 双击启动器运行单worker Python服务，核对实际数据库路径与进度。
5. 本机配置Tailscale Serve到回环端口，仅允许选定参与者访问；复制实际私有HTTPS链接到手机，不写进公开README。
6. 从手机确认读写同一进度、冲突提示、共享学习日和备份状态。电脑休眠/停服期间服务不可用，已有确认数据仍在SQLite。

后续更新由主agent在干净发布工作区构建并检查，再停旧服务、替换代码、重启；不在用户有未提交学习笔记的主工作区直接执行会改变内容的pull/checkout。保留旧版本引用，回退代码时先确认仍兼容schema1；只有明确需要恢复历史时才使用数据库恢复工具。

## 7. 交付记录

最终交付应包含：分支、提交SHA、PR链接、源码位置、锁定运行时、构建/启动说明、实际数据目录（仅本机记录）、备份恢复步骤、验收矩阵结果，以及仍未完成的设备或权限步骤。公开PR不附实际数据库路径中的个人信息、Tailscale名称或私人内容。
