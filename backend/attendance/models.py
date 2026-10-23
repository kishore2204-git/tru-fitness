from django.db import models

class Attendance(models.Model):
    member = models.ForeignKey('members.Member', on_delete=models.CASCADE, related_name='attendances')
    check_in_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-check_in_time']

    def __str__(self):
        return f"{self.member.full_name} - {self.check_in_time.strftime('%Y-%m-%d %H:%M')}"
