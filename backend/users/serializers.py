from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer that embeds role and username into the token claims and response."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = getattr(user, 'role', 'staff')
        token['username'] = user.username
        token['email'] = user.email or ''
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': getattr(self.user, 'role', 'staff'),
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        data['role'] = getattr(self.user, 'role', 'staff')
        data['username'] = self.user.username
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_active',
            'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']
