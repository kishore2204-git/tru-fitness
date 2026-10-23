import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from users.models import User
from members.models import Member
from plans.models import MembershipPlan
from subscriptions.models import Subscription
from payments.models import Payment
from attendance.models import Attendance

class Command(BaseCommand):
    help = 'Seed database with demo data for GymPulse'

    def handle(self, *args, **options):
        if User.objects.filter(username='admin').exists():
            self.stdout.write(self.style.WARNING('Demo data already exists. Skipping.'))
            return

        # Create users
        admin_user = User.objects.create_superuser(
            username='admin', password='admin123', email='admin@gympulse.com',
            first_name='Admin', last_name='User', role='admin'
        )
        staff_user = User.objects.create_user(
            username='staff', password='staff123', email='staff@gympulse.com',
            first_name='Staff', last_name='User', role='staff'
        )
        trainer = User.objects.create_user(
            username='trainer', password='trainer123', email='trainer@gympulse.com',
            first_name='Raj', last_name='Kumar', role='trainer'
        )
        self.stdout.write('Created users: admin, staff, trainer')

        # Create plans
        monthly = MembershipPlan.objects.create(name='Monthly', duration_months=1, price=1000)
        quarterly = MembershipPlan.objects.create(name='Quarterly', duration_months=3, price=2500)
        yearly = MembershipPlan.objects.create(name='Yearly', duration_months=12, price=8000)
        plans = [monthly, quarterly, yearly]
        self.stdout.write('Created 3 membership plans')

        # Create members
        member_data = [
            ('Rahul Sharma', '9876543210', 'rahul.sharma@email.com'),
            ('Priya Patel', '9876543211', 'priya.patel@email.com'),
            ('Amit Kumar', '9876543212', 'amit.kumar@email.com'),
            ('Neha Singh', '9876543213', 'neha.singh@email.com'),
            ('Vikram Reddy', '9876543214', 'vikram.reddy@email.com'),
            ('Anjali Gupta', '9876543215', 'anjali.gupta@email.com'),
            ('Arjun Nair', '9876543216', 'arjun.nair@email.com'),
            ('Kavita Joshi', '9876543217', 'kavita.joshi@email.com'),
            ('Suresh Menon', '9876543218', 'suresh.menon@email.com'),
            ('Divya Chauhan', '9876543219', 'divya.chauhan@email.com'),
        ]

        members = []
        today = timezone.now().date()
        for name, phone, email in member_data:
            member = Member.objects.create(
                full_name=name,
                phone=phone,
                email=email,
                date_of_birth=today - timedelta(days=random.randint(7300, 14600)),
                assigned_trainer=trainer if random.random() > 0.3 else None,
                is_active=True,
            )
            members.append(member)
        self.stdout.write('Created 10 members')

        # Create subscriptions and payments
        methods = ['cash', 'upi', 'card']
        for i, member in enumerate(members):
            plan = plans[i % 3]
            # Some active, some expiring soon, some expired
            if i < 4:
                start = today - timedelta(days=random.randint(1, 15))
            elif i < 7:
                start = today - relativedelta(months=plan.duration_months) + timedelta(days=random.randint(1, 7))
            else:
                start = today - relativedelta(months=plan.duration_months) - timedelta(days=random.randint(10, 30))

            end = start + relativedelta(months=plan.duration_months)
            sub = Subscription.objects.create(
                member=member, plan=plan, start_date=start,
                end_date=end, amount_paid=plan.price
            )
            Payment.objects.create(
                member=member, subscription=sub,
                amount=plan.price, method=random.choice(methods)
            )
        self.stdout.write('Created subscriptions and payments')

        # Create attendance records
        for member in members[:7]:
            for day_offset in random.sample(range(30), random.randint(5, 15)):
                Attendance.objects.create(member=member)
                # Override the auto_now_add by using update
                att = Attendance.objects.filter(member=member).latest('id')
                check_time = timezone.now() - timedelta(
                    days=day_offset,
                    hours=random.randint(0, 4),
                    minutes=random.randint(0, 59)
                )
                Attendance.objects.filter(id=att.id).update(check_in_time=check_time)
        self.stdout.write('Created attendance records')

        self.stdout.write(self.style.SUCCESS('\nDemo data seeded successfully!'))
        self.stdout.write(f'  Admin login: admin / admin123')
        self.stdout.write(f'  Staff login: staff / staff123')
        self.stdout.write(f'  Trainer login: trainer / trainer123')
