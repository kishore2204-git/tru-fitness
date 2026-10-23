from django.db import models


class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    duration_months = models.PositiveIntegerField(help_text='Duration of the plan in months')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - {self.duration_months} mo (₹{self.price})"
