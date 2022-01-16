from django.contrib import admin
from .models import Solution

class SolutionAdmin(admin.ModelAdmin):
    list_display = ['email', 'user_id', 'expired_at', 'created_at', 'updated_at', 'idfunnel_at', 'shopfinder_at', 'snsfinder_at', 'debug_level']

    def email(self, obj):
        return obj.user.username

    email.short_description = '아이디(이메일)'

admin.site.register(Solution, SolutionAdmin)
