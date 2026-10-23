from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'member', 'member_name', 'check_in_time']
        read_only_fields = ['check_in_time']

class CheckInSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False)
    member_id = serializers.IntegerField(required=False)

    def validate(self, attrs):
        if not attrs.get('phone') and not attrs.get('member_id'):
            raise serializers.ValidationError('Provide either phone or member_id.')
        return attrs
