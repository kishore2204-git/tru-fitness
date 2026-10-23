import jwt
from datetime import datetime, timedelta, timezone as dt_timezone
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from members.models import Member
from attendance.models import Attendance
from attendance.serializers import AttendanceSerializer
from .serializers import MemberRegisterSerializer, MemberLoginSerializer, MemberProfileSerializer


def make_member_token(member_id):
    """Issue a simple JWT for a member (not a staff user)."""
    payload = {
        'member_id': member_id,
        'type': 'member',
        'exp': datetime.now(dt_timezone.utc) + timedelta(days=7),
        'iat': datetime.now(dt_timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decode_member_token(token):
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    if payload.get('type') != 'member':
        raise jwt.InvalidTokenError('Not a member token')
    return payload


class MemberPortalRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MemberRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        token = make_member_token(member.id)
        return Response({
            'token': token,
            'member': MemberProfileSerializer(member).data,
        }, status=status.HTTP_201_CREATED)


class MemberPortalLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = MemberLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        full_name = serializer.validated_data['full_name'].strip()
        try:
            member = Member.objects.get(phone=phone, full_name__iexact=full_name)
        except Member.DoesNotExist:
            return Response({'error': 'No member found with that name and phone number.'}, status=status.HTTP_401_UNAUTHORIZED)
        token = make_member_token(member.id)
        return Response({
            'token': token,
            'member': MemberProfileSerializer(member).data,
        })


class MemberPortalMeView(APIView):
    permission_classes = [AllowAny]

    def _get_member(self, request):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('MemberBearer '):
            return None, Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth.split(' ', 1)[1]
        try:
            payload = decode_member_token(token)
            return Member.objects.get(id=payload['member_id']), None
        except Exception:
            return None, Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        member, err = self._get_member(request)
        if err:
            return err
        return Response(MemberProfileSerializer(member).data)


class MemberPortalCheckInView(APIView):
    permission_classes = [AllowAny]

    def _get_member(self, request):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('MemberBearer '):
            return None, Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth.split(' ', 1)[1]
        try:
            payload = decode_member_token(token)
            return Member.objects.get(id=payload['member_id']), None
        except Exception:
            return None, Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        member, err = self._get_member(request)
        if err:
            return err

        attendance = Attendance.objects.create(member=member)
        warning = None
        if not member.has_active_subscription:
            warning = 'Your membership has expired. Please renew to continue.'

        return Response({
            'status': 'checked_in',
            'member': member.full_name,
            'check_in_time': attendance.check_in_time,
            'warning': warning,
        }, status=status.HTTP_201_CREATED)


class MemberPortalAttendanceView(APIView):
    permission_classes = [AllowAny]

    def _get_member(self, request):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('MemberBearer '):
            return None, Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        token = auth.split(' ', 1)[1]
        try:
            payload = decode_member_token(token)
            return Member.objects.get(id=payload['member_id']), None
        except Exception:
            return None, Response({'error': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        member, err = self._get_member(request)
        if err:
            return err
        logs = Attendance.objects.filter(member=member).order_by('-check_in_time')[:30]
        return Response(AttendanceSerializer(logs, many=True).data)
