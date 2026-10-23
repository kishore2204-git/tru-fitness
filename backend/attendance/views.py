from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from members.models import Member
from .models import Attendance
from .serializers import AttendanceSerializer, CheckInSerializer
from users.permissions import IsAdminOrStaff

class AttendanceCheckInView(APIView):
    permission_classes = [IsAdminOrStaff]

    def post(self, request):
        serializer = CheckInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data.get('phone')
        member_id = serializer.validated_data.get('member_id')

        try:
            if member_id:
                member = Member.objects.get(id=member_id)
            else:
                member = Member.objects.get(phone=phone)
        except Member.DoesNotExist:
            return Response({'error': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)

        attendance = Attendance.objects.create(member=member)

        warning = None
        if not member.has_active_subscription:
            warning = 'Membership expired! Member checked in anyway.'

        return Response({
            'status': 'checked_in',
            'member': member.full_name,
            'check_in_time': attendance.check_in_time,
            'warning': warning,
        }, status=status.HTTP_201_CREATED)


class AttendanceListView(generics.ListAPIView):
    queryset = Attendance.objects.select_related('member').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrStaff]
    filterset_fields = ['member']
    search_fields = ['member__full_name']
    ordering_fields = ['check_in_time']

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(check_in_time__date=date)
        return qs
