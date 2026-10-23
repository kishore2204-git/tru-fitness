from rest_framework import serializers
from dateutil.relativedelta import relativedelta
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'member', 'member_name', 'plan', 'plan_name', 'start_date', 'end_date', 'amount_paid', 'created_at']
        read_only_fields = ['end_date', 'created_at']

    def create(self, validated_data):
        plan = validated_data['plan']
        start = validated_data['start_date']
        validated_data['end_date'] = start + relativedelta(months=plan.duration_months)
        return super().create(validated_data)
