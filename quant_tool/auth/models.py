"""User model and SQLite-backed repository."""

from __future__ import annotations

import os
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from passlib.context import CryptContext

_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
_DB_PATH = os.path.join(_DB_DIR, "users.db")


@dataclass
class User:
    id: int
    username: str
    password_hash: str
    role: str = "user"  # "user" | "admin"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    @classmethod
    def create(cls, id: int, username: str, password: str, role: str = "user") -> "User":
        return cls(
            id=id,
            username=username,
            password_hash=_pwd_ctx.hash(password),
            role=role,
        )

    def verify_password(self, password: str) -> bool:
        return _pwd_ctx.verify(password, self.password_hash)


class UserRepository:
    """SQLite-backed user store — survives server restarts."""

    def __init__(self):
        os.makedirs(_DB_DIR, exist_ok=True)
        self._conn = sqlite3.connect(_DB_PATH, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA foreign_keys=ON")
        self._init_schema()

    def _init_schema(self):
        self._conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                username    TEXT    NOT NULL UNIQUE,
                password_hash TEXT  NOT NULL,
                role        TEXT    NOT NULL DEFAULT 'user',
                created_at  TEXT    NOT NULL
            )
        """)
        self._conn.commit()

    def _row_to_user(self, row: sqlite3.Row) -> User:
        return User(
            id=row["id"],
            username=row["username"],
            password_hash=row["password_hash"],
            role=row["role"],
            created_at=datetime.fromisoformat(row["created_at"]),
        )

    def add(self, username: str, password: str, role: str = "user") -> Optional[User]:
        user = User.create(0, username, password, role)  # id 0 = placeholder
        try:
            cur = self._conn.execute(
                "INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)",
                (username, user.password_hash, role, user.created_at.isoformat()),
            )
            self._conn.commit()
            return self.get_by_id(cur.lastrowid)
        except sqlite3.IntegrityError:
            return None  # username already exists

    def get_by_username(self, username: str) -> Optional[User]:
        cur = self._conn.execute(
            "SELECT id, username, password_hash, role, created_at FROM users WHERE username = ?",
            (username,),
        )
        row = cur.fetchone()
        return self._row_to_user(row) if row else None

    def get_by_id(self, uid: int) -> Optional[User]:
        cur = self._conn.execute(
            "SELECT id, username, password_hash, role, created_at FROM users WHERE id = ?",
            (uid,),
        )
        row = cur.fetchone()
        return self._row_to_user(row) if row else None

    def authenticate(self, username: str, password: str) -> Optional[User]:
        user = self.get_by_username(username)
        if user and user.verify_password(password):
            return user
        return None
