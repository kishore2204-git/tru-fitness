from django.db import models

class Payment(models.Model):
    METHOD_CHOICES = [('cash', 'Cash'), ('upi', 'UPI'), ('card', 'Card')]

    member = models.ForeignKey('members.Member', on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES, default='cash')

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.member.full_name} - ₹{self.amount} ({self.get_method_display()})"
