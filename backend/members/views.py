from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminOrStaff
from .models import Member
from .serializers import MemberSerializer


class MemberViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing gym members.
    Search by full_name, phone, email.
    Filter by is_active, assigned_trainer.
    """
    queryset = Member.objects.all().select_related('assigned_trainer').prefetch_related('subscriptions')
    serializer_class = MemberSerializer
    permission_classes = [IsAdminOrStaff]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'assigned_trainer']
    search_fields = ['full_name', 'phone', 'email']
    ordering_fields = ['joined_date', 'full_name', 'created_at']
    ordering = ['-joined_date']
