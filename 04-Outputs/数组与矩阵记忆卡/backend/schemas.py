"""Strict HTTP envelope validation without coercing saved command payloads."""
import json
import re
from typing import Any, Literal, NotRequired, TypedDict

from fastapi import Request

from database import MAX_BYTES, StoreError


class Command(TypedDict):
    id: str
    type: Literal['review', 'undo', 'note', 'draft', 'settings', 'import', 'migrate', 'restore']
    payload: dict[str, Any]
    databaseId: NotRequired[str | None]


def validate_command(data) -> Command:
    if not isinstance(data, dict) or not isinstance(data.get('id'), str) or not re.fullmatch(r'[a-zA-Z0-9_-]{8,100}', data['id']):
        raise StoreError('保存请求缺少有效编号。')
    kind, payload = data.get('type'), data.get('payload')
    if not isinstance(kind, str) or kind not in ('review', 'undo', 'note', 'draft', 'settings', 'import', 'migrate', 'restore') or not isinstance(payload, dict):
        raise StoreError('不支持的保存请求。')
    if data.get('databaseId') is not None and not isinstance(data['databaseId'], str):
        raise StoreError('数据库标识无效。')
    # Business validation stays in Database; reject structural types that SQLite
    # cannot bind, and never turn a truthy string into an overwrite decision.
    for field in ('uid', 'kind', 'eventId', 'topicId', 'name'):
        if field in payload and not isinstance(payload[field], str):
            raise StoreError('保存请求字段格式无效。')
    if 'overwrite' in payload and type(payload['overwrite']) is not bool:
        raise StoreError('覆盖状态无效。')
    if 'expectedAt' in payload and payload['expectedAt'] is not None and type(payload['expectedAt']) not in (int, float):
        raise StoreError('内容版本无效。')
    return data


async def read_json(request: Request):
    if request.headers.get('content-type', '').split(';', 1)[0].strip().lower() != 'application/json':
        raise StoreError('只接受 JSON 数据。', 415)
    length = request.headers.get('content-length')
    if length is not None:
        try:
            size = int(length)
        except ValueError:
            raise StoreError('数据长度无效。') from None
        if size < 0:
            raise StoreError('数据长度无效。')
        if size == 0 or size > MAX_BYTES:
            raise StoreError('备份或保存请求超过 16 MB。', 413)
    body = bytearray()
    async for chunk in request.stream():
        if len(body) + len(chunk) > MAX_BYTES:
            raise StoreError('备份或保存请求超过 16 MB。', 413)
        body.extend(chunk)
    if not body:
        raise StoreError('备份或保存请求超过 16 MB。', 413)
    try:
        def invalid_constant(value):
            raise ValueError(value)
        return json.loads(body, parse_constant=invalid_constant)
    except (ValueError, UnicodeError, RecursionError):
        raise StoreError('不是有效的 JSON 数据。') from None
