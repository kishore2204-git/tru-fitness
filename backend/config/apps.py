from pathlib import Path
from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'
    path = str(Path(__file__).resolve().parent.parent)
