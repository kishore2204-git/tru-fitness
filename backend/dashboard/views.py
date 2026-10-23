from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
from members.models import Member
from subscriptions.models import Subscription
from payments.models import Payment
from attendance.models import Attendance
from users.permissions import IsAdminOrStaff

class DashboardView(APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        today = timezone.now().date()
        seven_days = today + timedelta(days=7)
        month_start = today.replace(day=1)

        active_members = Member.objects.filter(
            subscriptions__end_date__gte=today
        ).distinct().count()

        expiring_subs = Subscription.objects.filter(
            end_date__gte=today,
            end_date__lte=seven_days
        ).select_related('member', 'plan')

        expiring_in_7_days = expiring_subs.count()

        todays_checkins = Attendance.objects.filter(
            check_in_time__date=today
        ).count()

        data = {
            'active_members': active_members,
            'expiring_in_7_days': expiring_in_7_days,
            'todays_checkins': todays_checkins,
            'expiring_members': [
                {
                    'id': sub.member.id,
                    'name': sub.member.full_name,
                    'plan': sub.plan.name,
                    'end_date': sub.end_date.isoformat(),
                    'days_left': (sub.end_date - today).days,
                }
                for sub in expiring_subs
            ],
        }

        # Only show income to admin users
        if request.user.role == 'admin' or request.user.is_superuser:
            this_month_income = Payment.objects.filter(
                date__date__gte=month_start,
                date__date__lte=today
            ).aggregate(total=Sum('amount'))['total'] or 0
            data['this_month_income'] = float(this_month_income)

        return Response(data)
