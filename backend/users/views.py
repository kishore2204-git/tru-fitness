from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """API view to obtain JWT access and refresh tokens with custom claims."""
    serializer_class = CustomTokenObtainPairSerializer
