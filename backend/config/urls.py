"""URL configuration for GymPulse project."""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Authentication endpoints
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App endpoints
    path('api/members/', include('members.urls')),
    path('api/plans/', include('plans.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/portal/', include('portal.urls')),
]
