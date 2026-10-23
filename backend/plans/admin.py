from django.contrib import admin
from .models import MembershipPlan


@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_months', 'price', 'is_active', 'created_at')
    list_filter = ('is_active', 'duration_months')
    search_fields = ('name',)
