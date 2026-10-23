from rest_framework import serializers
from .models import MembershipPlan


class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = [
            'id',
            'name',
            'duration_months',
            'price',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
