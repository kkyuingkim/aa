import datetime
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Member(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    name = models.CharField(max_length=50, blank=True, verbose_name='성함')
    phone = models.CharField(max_length=13, blank=True, verbose_name='연락처')
    debug_level = models.CharField(default='20', max_length=50, blank=True)
    login_ip = models.CharField(max_length=50, blank=True, verbose_name='로그인IPMAC')
    expire_date = models.DateField(null=True, blank=True, verbose_name='만기일')
    visited_at = models.DateTimeField(null=True, blank=True, verbose_name='방문일')

    @receiver(post_save, sender=User)
    def create_member(sender, instance, created, **kwargs):
        if created:
            Member.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def update_member(sender, instance, **kwargs):
        instance.member.save()
