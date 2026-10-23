from rest_framework import serializers
from .models import Member


class MemberSerializer(serializers.ModelSerializer):
    assigned_trainer_name = serializers.CharField(
        source='assigned_trainer.get_full_name',
        read_only=True
    )
    has_active_subscription = serializers.BooleanField(read_only=True)

    class Meta:
        model = Member
        fields = [
            'id',
            'full_name',
            'phone',
            'email',
            'date_of_birth',
            'joined_date',
            'assigned_trainer',
            'assigned_trainer_name',
            'is_active',
            'has_active_subscription',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'joined_date',
            'has_active_subscription',
            'created_at',
            'updated_at',
        ]
