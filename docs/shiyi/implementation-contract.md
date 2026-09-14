# 拾忆实施与验收记录

以 [spec.md](spec.md) 为准。当前版本已完成 React 根入口和 FastAPI 迁移；真实设备与正式数据切换单独验收。交付提交见下；已按用户授权推送到 `origin` 并把 `main` 快进到该提交（未创建 PR，未推送 `upstream`）。

## 基线与范围

- 原始 HEAD：`12907ab7e29a69e7f545ac45c44826a6649328ef`。
- 可复现应用基线：`5a0fcb189b4609d49265df4fc5118f19d69547a6`。
- 原实施分支：`codex/shiyi-a-m0`；隔离目录 `.worktrees/shiyi-a-m0`。原 `codex/shiyi-a` 已存在，保持不动。
- 本轮交付分支：`codex/shiyi-a-m0-copy`；交付目录 `.worktrees/shiyi-a-m0-copy`（在原工作树基础上复制后继续实施与验收）。
- M0：原工作区全部未提交改动保留；仅复制清单内应用/测试/启动器/文档和 24 个公开题解变更。28 项 Python、15 项 JS 基线检查通过，177 题/12 专题、179 个生成文件一致。未访问或复制真实数据。
- 额外基线导出审计按用户要求中止；干净 checkout 复验改在最终交付提交上进行，结果见下。
- 应用提交：`a20700d`（`feat(shiyi): migrate application to FastAPI and React`），227 个文件；其后提交只更新本记录。已推送：`origin/main` 与 `origin/codex/shiyi-a-m0-copy` 均为 `0c811b0`。

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
| A04 | React 局部输入、稳定卡片 key、IME/快捷键保护 | 中文文本、composition 事件、焦点、提示、切题及 390px 布局通过；真实手机输入待验 |
| A05 | Database、DataLease、recover.py | 重启、正常/过期撤销、备份/恢复、损坏归档、恢复后 epoch 测试通过 |
| A06 | backend/api.py、schemas.py | Host/Origin/token、JSON/严格类型、实际 16 MiB、503、无副作用检查通过 |
| A07 | API 优先路由、StaticFiles、启动路径校验 | 缺失 API/JSON/JS/题解、路径穿越、data/备份隔离返回真实状态码通过 |
| A08 | build_content.py、library/solutions 测试 | 177 唯一 UID、12 专题、来源 hash、完整代码、关联和返回根入口通过；保留算法断言 |
| A09 | 15 秒/focus 同步、共享 SQLite | 本机真实 HTTP 轮询与双上下文通过；实际手机/Tailscale 未执行 |
| A10 | session 时区；time.js；Python 本地日历 | 不同浏览器时区、午夜、DST 23/25 小时与缺失/重复墙上时间通过 |
| A11 | importQueue、migrateLegacy、导出按钮 | 原队列重试去重、已恢复/缺失 epoch 显式确认、旧原文保留通过 |
| A12 | 版本/锁文件、start.py、CI、README | 在交付提交 `a20700d` 的独立 clone 中从零复验：新建 `.venv` 并按 `requirements.lock` 安装、`npm ci`、构建（177 题/12 专题、177 个题解文件）、37 项 Python、21 项 JS、7 项 e2e 全部通过；无 node/npm 的最小 PATH 下 `start.py` 正常提供 `/` 与 `/api/session`，数据只写入临时目录；GitHub CI 已在 main 上运行并通过（run 34856369328，提交 0c811b0，全部步骤含浏览器验收）；复验之后仅有本记录的文档变更 |
| A13 | sparse worktree、忽略规则、精确暂存 | 提交 227 个文件，仅公开源码/题库/测试/配置/文档；树内无 SQLite/WAL/SHM、备份、`data/`、`node_modules`、`.venv`、`frontend/dist`、生成内容、密钥或个人配置；`.github/workflows/shiyi.yml` 原先被 sparse 规则挡在索引之外（`git add` 只给 hint 不报错），已加入 sparse 清单后入库 |

浏览器测试使用临时数据库和隔离 Chrome 上下文，包含实际 15 秒轮询；手机宽度截图仅有人工输入的测试内容。没有接触真实 data、SQLite、备份、草稿或学习进度。

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

## 交付限制

M4 尚未执行：本轮保留禁止访问真实数据的约束；没有实际手机/Tailscale 同库读写、原 origin 队列处理、轮转目录外恢复点及正式切换证据。需在明确授权的本机切换阶段完成，不能用桌面测试替代。

M5 发布：已按用户授权推送到 `origin`，并把 `main` 快进到 `0c811b0`（应用提交 `a20700d` + 本记录），未创建 PR；`upstream`（mo-lx）未推送，未部署公网。安装、私有入口、切换与分别回退代码/数据库的操作见应用 README。
