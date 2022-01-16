from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User
from django.db import models
from product.models import Product

class Payment(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.CASCADE)
    receipt_nm = models.TextField(default='', blank=True, verbose_name='거래정보')
    price = models.IntegerField(default=0, validators=[MaxValueValidator(10000000), MinValueValidator(0)], verbose_name='가격') # 최대 1000만원
    receipt_id = models.TextField(default='', blank=True, verbose_name='거래번호')
    method = models.TextField(default='', blank=False, verbose_name='결제수단')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, verbose_name='구매일')