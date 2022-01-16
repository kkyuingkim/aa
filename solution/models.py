import datetime
from django.db import models
from django.contrib.auth.models import User
from django import template
from django.utils.timezone import now

register = template.Library()

class Solution(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    allowed_ip = models.CharField(max_length=32, blank=True, verbose_name='허용 아이피')
    expired_at = models.DateTimeField(default=now, blank=True, verbose_name='만기일')
    created_at = models.DateTimeField(default=now, blank=True, verbose_name='구매일')
    updated_at = models.DateTimeField(default=now, blank=True, verbose_name='갱신일')
    idfunnel_at = models.DateTimeField(default=now, verbose_name='아이디퍼널 만기일')
    shopfinder_at = models.DateTimeField(default=now, verbose_name='쇼핑몰파인더 만기일')
    snsfinder_at = models.DateTimeField(default=now, verbose_name='SNS파인더 만기일')
    debug_level = models.IntegerField(default=20, verbose_name='디버그 레벨')

    #@register.filter(is_safe=True)
    #@register.simple_tag
    @register.tag
    def get_diff_days(self, name):
        now = datetime.datetime.now()
        if name == 'IdFunnel':
            expired_at = self.idfunnel_at
        elif name == 'ShopFinder':
            expired_at = self.shopfinder_at
        elif name == 'SnsFinder':
            expired_at = self.snsfinder_at
        else:
            expired_at = self.expired_at
        diff = expired_at - now
        diff = int(diff.total_seconds() / (3600 * 24))
        return diff

    def is_expired(self, name):
        now = datetime.datetime.now()
        if name == 'IdFunnel':
            expired_at = self.idfunnel_at if self.idfunnel_at is not None else now 
        elif name == 'ShopFinder':
            expired_at = self.shopfinder_at if self.shopfinder_at is not None else now 
        elif name == 'SnsFinder':
            expired_at = self.snsfinder_at if self.snsfinder_at is not None else now 
        else:
            expired_at = self.expired_at if self.expired_at is not None else now 
        diff = now - expired_at
        diff = int(diff.total_seconds())
        if diff > 0:
            return True
        else:
            return False