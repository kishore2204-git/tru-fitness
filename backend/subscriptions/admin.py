from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['member', 'plan', 'start_date', 'end_date', 'amount_paid']
    list_filter = ['plan', 'start_date']
    search_fields = ['member__full_name', 'member__phone']
