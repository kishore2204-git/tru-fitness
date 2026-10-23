from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'email', 'joined_date', 'assigned_trainer', 'is_active', 'has_active_sub')
    list_filter = ('is_active', 'assigned_trainer', 'joined_date')
    search_fields = ('full_name', 'phone', 'email')

    @admin.display(boolean=True, description='Active Subscription')
    def has_active_sub(self, obj):
        return obj.has_active_subscription
