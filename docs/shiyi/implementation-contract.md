# 拾忆实施与验收记录

以 [spec.md](spec.md) 为准。当前版本已完成 React 根入口和 FastAPI 迁移，并已在本机完成正式切换（见下）；仅剩真实手机/Tailscale 验收。交付提交见下；已按用户授权推送到 `origin` 并把 `main` 快进到该提交（未创建 PR，未推送 `upstream`）。

## 基线与范围

- 原始 HEAD：`12907ab7e29a69e7f545ac45c44826a6649328ef`。
- 可复现应用基线：`5a0fcb189b4609d49265df4fc5118f19d69547a6`。
- 原实施分支：`codex/shiyi-a-m0`；隔离目录 `.worktrees/shiyi-a-m0`。原 `codex/shiyi-a` 已存在，保持不动。
- 本轮交付分支：`codex/shiyi-a-m0-copy`；交付目录 `.worktrees/shiyi-a-m0-copy`（在原工作树基础上复制后继续实施与验收）。
- M0：原工作区全部未提交改动保留；仅复制清单内应用/测试/启动器/文档和 24 个公开题解变更。28 项 Python、15 项 JS 基线检查通过，177 题/12 专题、179 个生成文件一致。未访问或复制真实数据。
- 额外基线导出审计按用户要求中止；干净 checkout 复验改在最终交付提交上进行，结果见下。
- 应用提交：`a20700d`（`feat(shiyi): migrate application to FastAPI and React`），227 个文件；其后提交只更新本记录。已推送：`origin/main` 与 `origin/codex/shiyi-a-m0-copy` 均为 `13ae1cb`。

## 最终契约

Python 3.13.12、Node 24.19.0；requirements.lock 和 package-lock.json 固定依赖。日常 `.command` 仅运行 `.venv` 的 Python，不安装或构建。`launch.local.json` 为可选本机配置，已忽略入库。

`backend.api.create_app(data_dir=None, *, allowed_hosts=None, allowed_origins=None, time_zone=None)` 返回 FastAPI app。缺省数据仍是应用根 data；测试显式使用临时目录。单 worker，监听 127.0.0.1，禁用代理头信任；完整生命周期持有 DataLease。时区仅在初始化时配置一次，所有浏览器使用 session 的 timeZone/serverNow。

保持 API v2、SQLite schema 1、事务与备份/恢复/撤销语义。错误保留 `{error,detail}` 分类；JSON body 实际计数最多 16 MiB，无类型强转。根入口 `/` 为 React，题库与题解是 `/content/library.json`、`/content/notes/lc-N.html`；Vite 唯一输出 frontend/dist。旧 dist 仅从隔离交付版本删除。

唯一发送模块 frontend/src/api.ts 保留固定 ID、已发送 body、expectedAt、databaseId 及旧 localStorage key。恢复前或缺少 epoch 的队列先确认；冲突展示双方文本，放弃本页版本后输入框恢复数据库文本。读取中的卡片和输入焦点不因轮询替换。

## 紧凑验收清单

| ID | 实现位置 | 验证与状态 |
|---|---|---|
| A01 | database.py；frontend/src/model；所有 React features | database/learning/model 测试保留原排程、能力、额度、统计；浏览器评分/撤销通过 |
| A02 | api.ts 固定请求体；Database operations | storage 测试及真实 HTTP 提交后丢响应、刷新重试一次通过 |
| A03 | DraftInput、冲突弹窗、expectedAt | 两独立浏览器上下文分别保留本页/数据库草稿通过 |
| A04 | React 局部输入、稳定卡片 key、IME/快捷键保护 | 中文文本、composition 事件、焦点、提示、切题及 390px 布局通过；真实手机输入已验：iPhone 经 Tailscale 访问，用 IME 逐字输入中文备注并自动保存，`notes` 表最终存有原文 `检查测试`（4 个汉字，10:05:08） |
| A05 | Database、DataLease、recover.py | 重启、正常/过期撤销、备份/恢复、损坏归档、恢复后 epoch 测试通过 |
| A06 | backend/api.py、schemas.py | Host/Origin/token、JSON/严格类型、实际 16 MiB、503、无副作用检查通过 |
| A07 | API 优先路由、StaticFiles、启动路径校验 | 缺失 API/JSON/JS/题解、路径穿越、data/备份隔离返回真实状态码通过 |
| A08 | build_content.py、library/solutions 测试 | 177 唯一 UID、12 专题、来源 hash、完整代码、关联和返回根入口通过；保留算法断言 |
| A09 | 15 秒/focus 同步、共享 SQLite | 本机真实 HTTP 轮询与双上下文通过；真实手机已验：iPhone 经 `tailscale serve` 写入同一 SQLite（验收记录随后已回退），桌面 `127.0.0.1` 与 `*.ts.net` 两个来源同时读到 `revision 236`、`reviewCount 16`、`startedCount 9` 与同一 `databaseId`，桌面端在 15 秒内自行刷新 |
| A10 | session 时区；time.js；Python 本地日历 | 不同浏览器时区、午夜、DST 23/25 小时与缺失/重复墙上时间通过 |
| A11 | importQueue、migrateLegacy、导出按钮 | 原队列重试去重、已恢复/缺失 epoch 显式确认、旧原文保留通过 |
| A12 | 版本/锁文件、start.py、CI、README | 在交付提交 `a20700d` 的独立 clone 中从零复验：新建 `.venv` 并按 `requirements.lock` 安装、`npm ci`、构建（177 题/12 专题、177 个题解文件）、37 项 Python、21 项 JS、7 项 e2e 全部通过；无 node/npm 的最小 PATH 下 `start.py` 正常提供 `/` 与 `/api/session`，数据只写入临时目录；GitHub CI 已在 main 上运行并通过（run 34856369328，提交 0c811b0，全部步骤含浏览器验收）；复验之后仅有本记录的文档变更 |
| A13 | sparse worktree、忽略规则、精确暂存 | 提交 227 个文件，仅公开源码/题库/测试/配置/文档；树内无 SQLite/WAL/SHM、备份、`data/`、`node_modules`、`.venv`、`frontend/dist`、生成内容、密钥或个人配置；`.github/workflows/shiyi.yml` 原先被 sparse 规则挡在索引之外（`git add` 只给 hint 不报错），已加入 sparse 清单后入库 |

浏览器测试使用临时数据库和隔离 Chrome 上下文，包含实际 15 秒轮询；手机宽度截图仅有人工输入的测试内容。自动化测试全程没有接触真实 data、SQLite、备份、草稿或学习进度；真实数据只在用户授权后的 M4 切换阶段被读写（见下）。

## 本轮验证记录

在实施目录 `.worktrees/shiyi-a-m0-copy` 的交付提交上运行；本机 Python 3.13.14 / Node 24.18.0，CI 固定 3.13.12 / 24.19.0，补丁号有差异。

| 检查 | 命令 | 结果 |
|---|---|---|
| Python 回归 | `.venv/bin/python -m unittest discover -s tests -p '*_test.py'` | 37 项通过 |
| 前端单测 | `npm test --prefix frontend` | 21 项通过，0 失败 |
| 类型检查 | `npx tsc --noEmit` | 无输出 |
| 构建 | `npm run build --prefix frontend` | 生成 177 个题解、`library.json` 与打包资源 |
| 浏览器验收 | `npm run test:e2e`（含 15 秒轮询） | 7 项通过 |
| 干净 checkout | 独立 clone 中 `python -m venv` + `pip install -r requirements.lock` + `npm ci` + 构建 + 上述三套测试 | 全部通过 |
| 日常启动 | 无 node/npm 的最小 PATH 下 `start.py --no-open --port ... --data-dir <临时目录>` | `/` 与 `/api/session` 返回 200 |
| API 边界 | 无 token 401、恶意 Host/Origin 403、布尔评分 400、错误 Content-Type 415、17 MB 请求 413、带 token 的缺失 API 与题解 404 | 均符合 |

本机 `~/Library/Caches/pip`、`~/.npm` 与 `~/Library/Caches/ms-playwright` 在当前沙箱下不可写；复验时改用工作区内的缓存与 `PLAYWRIGHT_BROWSERS_PATH`，不属于产品缺陷。

## M4 正式切换记录（本机，用户授权后执行）

- 恢复点：`~/Desktop/shiyi-recovery-2026-09-14/`，位于 30 份轮转目录之外。用 SQLite 在线备份 API 生成快照，`PRAGMA integrity_check` 为 `ok`，sha256 `965bd37474b4db4e88f7de01a05c68ef211d994f918a78c4b8e3e3a9dd206124`；完整保留当时 30 份轮转备份（含 `-wal`/`-shm` 边车，边车可能承载数据）与原应用全部 230 个文件（含 186 个 `dist/` 文件）。
- 原入口队列处理：先在 127.0.0.1:8765 运行原应用（纯标准库，无需 `.venv`）。处理前后数据库计数完全一致：progress 8、drafts 3、review_events 14、skills 17、operations 200、audit 200、revision 200、databaseId `6d4af0e9-7988-4054-9c29-8786396d9382`，原 origin 无遗留待保存项。
- 正式切换：原应用目录整体移出（保留在 `.worktrees/.shiyi-old-app/`），`main` 由 `12907ab` 快进到 `13ae1cb`。原应用中 24 个题解的本地改动先用 sha256 证明与提交内容逐字节相同，再清除本地修改标记；合并后逐一复验 24/24 与新入口内容完全一致。其余未提交改动（00-配置、02-Wiki/专题总结、03-学习笔记 共 28 项）未被触碰。
- 数据保留：`data/` 未被 git 读写；切换后 `integrity_check` 仍为 `ok`，8/3/14/17/200 计数、`databaseId` 与 `revision 200` 均与切换前相同。
- 重建与启动：新建 `.venv`、按 `requirements.lock` 安装、`npm ci`、构建 177 题；新入口在与原入口相同的 origin（127.0.0.1:8765）下读到真实 8 条进度、3 条草稿（含草稿原文）与 settings `arrays-matrices-03`/20，`apiVersion 2`、`schemaVersion 1`。
- 时区：原应用没有服务端学习时区概念（`settings` 仅 topicId/dailyNewLimit）。新增本机 `launch.local.json`（`timeZone: America/Chicago`，已忽略入库），并验证双击 `.command`（不传参数）时 `session.timeZone` 为 `America/Chicago`，与显式 `--time-zone` 一致。
- 回退材料：上列恢复点目录与 `.worktrees/.shiyi-old-app/`；两者均在忽略目录或工作区缓存位置，不影响仓库与 CI。
- 跨设备入口：安装 Tailscale（1.102.4）并启用 MagicDNS 与 HTTPS 证书后，`tailscale serve --bg 8765` 把 `https://<host>.<tailnet>.ts.net/` 反代到 127.0.0.1:8765；本机 `launch.local.json` 增加该 `*.ts.net` 的 allowedHosts/allowedOrigins（真实主机名与地址不写入仓库）。验证该 Host/Origin 返回 200，伪造 Host/Origin 返回 403；`/`、`/assets/*`、`/content/library.json`、`/content/notes/lc-1.html` 均返回 200。
- 真实设备验收（A04/A09）：iPhone 在同一 tailnet 内用 Safari 打开该 HTTPS 地址，读到与桌面相同的进度，提交 `lc-54`、`lc-48` 两次真实复习自评（recognize 2 / explain 2），并用 IME 逐字输入中文备注。两次提交后 `revision 200→236`、`reviewCount 14→16`、`startedCount 8→9`、`operations`/`audit` `200→236`、`progress 8→9`、`notes 0→1`（原文 `检查测试`，含 CJK 字符）、库文件 184320→196608 字节且 sha256 由 `14d1982d…` 变为 `b33e3727…`；桌面端在同一共享 SQLite 上于 15 秒内自行显示该变化。
- 验收数据回退：上述两次自评与备注属于验收产生的真实写入，已用应用自身的撤销与清空入口回退（三个操作 id 前缀 `doc-clean-`）。回退后 `reviewCount` 与 `startedCount` 回到 14 与 8，`progress` 回到 8（`lc-54` 记录移除），`lc-48` 恢复为验收前的逾期状态，备注文本清空，`revision` 为 239。

## 交付限制

M4 已完成：原 origin 队列处理、轮转目录外的经验证恢复点、正式切换、真实手机经 Tailscale 的同库读写与跨设备同步均已有本机证据。未执行的只剩 M5 的公网部署与 PR（`upstream` 未推送），以及在本机之外环境的复验。

M5 发布：已按用户授权推送到 `origin`，并把 `main` 快进到 `13ae1cb`（应用提交 `a20700d` + 本记录及 M4 记录），未创建 PR；`upstream`（mo-lx）未推送，未部署公网。安装、私有入口、切换与分别回退代码/数据库的操作见应用 README。

## 上线后的可用性修订（本机，用户授权后执行）

真实使用一轮后按用户要求修的四处问题。改动只涉及前端、应用 README 与本记录；数据库、API v2、schema 1 与 `database.py` 均未改动。

- 键盘自评：此前全应用只有 `Space` 一个快捷键。现在核对答案后可用 `1/2/3` 给第一项未评分的技能打分，`Enter` 在全部评完后保存。沿用原有守卫：焦点在输入框、草稿框、按钮、链接、`summary`、`contenteditable` 或已打开的 `dialog` 中时一律不触发；用过提示时与鼠标一致地禁用最高档。
- 模式重复写入：`mode()` 原先无条件写入，实测 20 秒内产生 4 条 `settings` 操作，每条都抬升 `revision` 并让其他设备的 15 秒轮询重新取数。现在点击当前模式只提示、不写入。
- 常驻重连按钮：`重新连接 / 重试保存` 原先始终显示；现在只在 `offline`、`blocked`、`conflict` 状态下出现，其余失败路径已有独立的连接错误提示与重试入口。
- 专题兜底：`settings.topicId` 解析不到时原先静默显示第一个专题，侧栏还硬编码 `CHAPTER 03`。现在解析失败会明确提示一次，占位改为 `—`，不再显示错误章节号。

验证：`tsc --noEmit` 无输出；21 项前端单测通过；37 项 Python 通过；Playwright 由 7 项增至 10 项（新增 `frontend/e2e/shortcuts.spec.mjs`：键盘评分与 `Enter` 保存、输入框吞掉快捷键与提示封顶、重复点模式不写入），本机 10/10 通过。新增用例使用 `lc-217` 且文件名排在 `migration.spec.mjs` 之后，避免与既有验收共用同一个临时库时互相影响。

口径更正：`data.days` 的“最近 7 天”是柱状图（无提交的日期以低透明度显示 0），不是可点击的空列表；此前误读为噪音，未做改动。清除备注会在 `notes` 留下一条空文本记录，界面已用 `notes[uid]?.text &&` 过滤，因此未改动 `database.py` 的事务核心。

## 手机端打字漂移修复（用户报告后执行）

### 第一次尝试：字号（真实问题，但不是本次漂移的原因）

用户在手机上打字时画面漂移。第一次判断为 iOS Safari 在聚焦字号小于 16px 的表单控件时自动放大整页：当时所有可输入控件都是 13–14px（`.draft-label textarea`、`.scratch textarea`、`.rating-area textarea` 为 14px，`.record-filters input/select` 为 13px）。该问题本身真实存在并已修复——1024px 及以下把可输入控件提升到 16px，未改动 `viewport` meta（没有加 `maximum-scale` 或 `user-scalable=no`，保留双指缩放），`frontend/e2e/mobile-inputs.spec.mjs` 在 390px 与 844px 下断言计算字号 ≥16px，该用例在修复前的样式表上确实失败（实测 `review 390px portrait textarea = 14px`、`select#topic-select = 14px`）。

但用户复测后漂移依旧，说明字号不是本次的原因。这一步判断错了，保留这段记录以免后人重走。

### 真正的原因：每敲一个字侧栏高度抖动 35px

用户指出出问题的区域是侧栏（“已保存到共享数据库 / 处理待保存内容 / 保存与备份”附近）。用 rAF 逐帧采样实测：`.save-indicator` 高度在 22px 与 57px 之间反复跳变（Δ=35px），跳变周期与击键一一对应。原因是 `处理待保存内容（N）` 按钮按 `store.queue.length>0` 条件渲染，而 `.save-indicator button{display:block}` 让它独占一行：每次入队出现、保存完成消失。草稿是逐字自动保存，于是每敲一个字，侧栏就长高 35px 再缩回。

由于手机端 `.layout` 是单列、侧栏在正文之前，侧栏变高会把下面正在输入的文本框整体推下去。文档坐标实测位移 36px。

为什么之前没发现：Chrome 有滚动锚定（scroll anchoring），会在侧栏变高时自动补偿滚动位置，视口内位移只有 1px；**iOS Safari 不支持滚动锚定**，同样的 36px 位移直接可见。因此该缺陷只在手机上暴露，桌面浏览器和此前的全部 e2e 都无法发现。复现方法是关闭锚定：`html{overflow-anchor:none}`。

修复：该按钮始终渲染、只切换 `visibility`（`visibility:hidden` 仍占位，且天然移出标签页顺序与无障碍树），因此侧栏高度在所有状态下恒定。按需保留重新连接按钮的条件渲染：它只在 `offline`/`blocked`/`conflict` 出现，不属于逐字抖动。代价是手机侧栏常驻多出一行约 35px。

验证：新增 `frontend/e2e/layout-stability.spec.mjs`，在 390×844 下关闭滚动锚定模拟 Safari，打字期间逐帧断言 `.save-indicator` 高度与文本框视口位置位移 ≤1px；第二项用 `page.route` 掐断 `/api/command` 让保存真的卡住，断言被占位的按钮仍会变为可见并能打开对话框（避免“占位”变成功能丢失）。修复前实测 `sidebar save area changed height while typing: Received 35`（失败），修复后 `save-indicator height 57..57 Δ=0`、`textarea viewport top 680..680 Δ=0`、`document top 1139..1139 Δ=0`。Playwright 由 11 项增至 13 项，本机 13/13 通过。

过程教训：第一次负向对照无效——在应用根目录执行 `npm run build` 其实没有重新构建（该目录没有 `package.json`，构建脚本在 `frontend/`），于是“修复前”跑的还是已修复的产物，两次都通过。改用 `cd frontend && npm run build` 后才真正复现失败。断言必须用会失败的对照来证明，而不是用通过的次数。
