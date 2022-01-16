from django.contrib import admin
from .models import Member

class MemberAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'phone', 'visited_at']
    def email(self, obj):
        return obj.user.username
    email.short_description = '아이디(이메일)'

admin.site.register(Member, MemberAdmin)
