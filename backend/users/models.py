from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_ADMIN = 'admin'
    ROLE_STAFF = 'staff'
    ROLE_TRAINER = 'trainer'

    ROLE_CHOICES = [
        (ROLE_ADMIN, 'Admin'),
        (ROLE_STAFF, 'Staff'),
        (ROLE_TRAINER, 'Trainer'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_STAFF,
        help_text='Designates the role of the user within GymPulse.',
    )

    def is_admin_user(self):
        return self.role == self.ROLE_ADMIN or self.is_superuser

    def is_staff_user(self):
        return self.role in (self.ROLE_ADMIN, self.ROLE_STAFF) or self.is_superuser

    def is_trainer_user(self):
        return self.role == self.ROLE_TRAINER

    def __str__(self):
        full_name = self.get_full_name().strip()
        display_name = full_name if full_name else self.username
        return f"{display_name} ({self.get_role_display()})"
