from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['member', 'check_in_time']
    list_filter = ['check_in_time']
    search_fields = ['member__full_name']
