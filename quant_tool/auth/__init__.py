"""Authentication module — JWT-based user management."""

from .models import User, UserRepository
from .deps import (
    SECRET_KEY,
    create_access_token,
    verify_token,
    get_current_user,
    get_optional_user,
    get_user_repo,
)

__all__ = [
    "User",
    "UserRepository",
    "SECRET_KEY",
    "create_access_token",
    "verify_token",
    "get_current_user",
    "get_optional_user",
    "get_user_repo",
]
