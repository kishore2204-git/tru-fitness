from django.conf import settings
from django.db import models
from django.utils import timezone


class Member(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15, unique=True)
    email = models.EmailField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    joined_date = models.DateField(auto_now_add=True)
    assigned_trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'trainer'},
        related_name='assigned_members'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-joined_date', '-id']

    @property
    def has_active_subscription(self) -> bool:
        today = timezone.now().date()
        return self.subscriptions.filter(end_date__gte=today).exists()

    def __str__(self):
        return f"{self.full_name} ({self.phone})"
