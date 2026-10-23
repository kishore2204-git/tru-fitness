from django.urls import path
from .views import (
    MemberPortalRegisterView,
    MemberPortalLoginView,
    MemberPortalMeView,
    MemberPortalCheckInView,
    MemberPortalAttendanceView,
)

urlpatterns = [
    path('register/', MemberPortalRegisterView.as_view(), name='portal-register'),
    path('login/', MemberPortalLoginView.as_view(), name='portal-login'),
    path('me/', MemberPortalMeView.as_view(), name='portal-me'),
    path('checkin/', MemberPortalCheckInView.as_view(), name='portal-checkin'),
    path('attendance/', MemberPortalAttendanceView.as_view(), name='portal-attendance'),
]
