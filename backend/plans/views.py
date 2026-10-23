from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminOrStaff
from .models import MembershipPlan
from .serializers import MembershipPlanSerializer


class PlanViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing membership plans.
    """
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [IsAdminOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name']
    ordering_fields = ['price', 'duration_months', 'created_at']
    ordering = ['price']
