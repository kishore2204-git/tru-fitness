from django.urls import path
from .views import AttendanceCheckInView, AttendanceListView

urlpatterns = [
    path('checkin/', AttendanceCheckInView.as_view(), name='attendance-checkin'),
    path('', AttendanceListView.as_view(), name='attendance-list'),
]
