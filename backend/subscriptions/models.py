from django.db import models

class Subscription(models.Model):
    member = models.ForeignKey('members.Member', on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey('plans.MembershipPlan', on_delete=models.PROTECT, related_name='subscriptions')
    start_date = models.DateField()
    end_date = models.DateField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.member.full_name} - {self.plan.name} ({self.start_date} to {self.end_date})"
