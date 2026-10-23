from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
from subscriptions.models import Subscription

class Command(BaseCommand):
    help = 'Send email reminders for memberships expiring in 7 days'

    def handle(self, *args, **options):
        target_date = timezone.now().date() + timedelta(days=7)
        expiring = Subscription.objects.filter(
            end_date=target_date,
            member__email__isnull=False,
        ).exclude(member__email='').select_related('member', 'plan')

        count = 0
        for sub in expiring:
            try:
                send_mail(
                    subject='Your Tru Fitness Membership is Expiring Soon!',
                    message=(
                        f'Hi {sub.member.full_name},\n\n'
                        f'Your {sub.plan.name} membership at Tru Fitness expires on {sub.end_date.strftime("%B %d, %Y")}.\n'
                        f'Please visit the gym to renew your membership and continue your fitness journey!\n\n'
                        f'Best regards,\nTru Fitness Team'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[sub.member.email],
                    fail_silently=False,
                )
                count += 1
                self.stdout.write(f'  Sent to {sub.member.full_name} ({sub.member.email})')
            except Exception as e:
                self.stderr.write(f'  Failed for {sub.member.full_name}: {e}')

        self.stdout.write(self.style.SUCCESS(f'Sent {count} expiry reminder(s).'))
