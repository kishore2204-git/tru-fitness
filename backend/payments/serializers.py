from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    subscription_plan = serializers.CharField(source='subscription.plan.name', read_only=True, default=None)

    class Meta:
        model = Payment
        fields = ['id', 'member', 'member_name', 'subscription', 'subscription_plan', 'amount', 'date', 'method']
        read_only_fields = ['date']
