from rest_framework import serializers
from members.models import Member

class MemberRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'full_name', 'phone', 'email', 'date_of_birth']

    def validate_phone(self, value):
        if Member.objects.filter(phone=value).exists():
            raise serializers.ValidationError('A member with this phone number already exists.')
        return value

class MemberLoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    full_name = serializers.CharField()

class MemberProfileSerializer(serializers.ModelSerializer):
    has_active_subscription = serializers.BooleanField(read_only=True)
    active_subscription = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ['id', 'full_name', 'phone', 'email', 'date_of_birth',
                  'joined_date', 'is_active', 'has_active_subscription', 'active_subscription']

    def get_active_subscription(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        sub = obj.subscriptions.filter(end_date__gte=today).select_related('plan').first()
        if sub:
            return {
                'plan': sub.plan.name,
                'start_date': sub.start_date,
                'end_date': sub.end_date,
                'days_left': (sub.end_date - today).days,
                'amount_paid': str(sub.amount_paid),
            }
        return None
