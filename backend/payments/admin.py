from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['member', 'amount', 'method', 'date']
    list_filter = ['method', 'date']
    search_fields = ['member__full_name', 'member__phone']
