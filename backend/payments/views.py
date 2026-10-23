from rest_framework import viewsets
from django.db.models import Sum
from .models import Payment
from .serializers import PaymentSerializer
from users.permissions import IsAdminOrStaff

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related('member', 'subscription__plan').all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ['member', 'method']
    search_fields = ['member__full_name', 'member__phone']
    ordering_fields = ['date', 'amount']

    def get_queryset(self):
        qs = super().get_queryset()
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        if date_from:
            qs = qs.filter(date__date__gte=date_from)
        if date_to:
            qs = qs.filter(date__date__lte=date_to)
        return qs
