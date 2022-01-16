from django.contrib import admin
from .models import Payment

class PaymentAdmin(admin.ModelAdmin):
    list_display = ('receipt_id', 'receipt_nm', 'email', 'price', 'created_at')
    list_display_links = ('receipt_id', 'receipt_nm', 'email',)

    def email(self, obj):
        if obj.user:
            return obj.user.username
        else:
            return ''

    email.short_description = '아이디(이메일)'

admin.site.register(Payment, PaymentAdmin)