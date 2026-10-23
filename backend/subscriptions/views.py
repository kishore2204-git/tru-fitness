from rest_framework import viewsets
from .models import Subscription
from .serializers import SubscriptionSerializer
from users.permissions import IsAdminOrStaff

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.select_related('member', 'plan').all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ['member']
    search_fields = ['member__full_name']
    ordering_fields = ['start_date', 'end_date', 'created_at']
