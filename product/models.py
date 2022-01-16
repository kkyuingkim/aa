from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Product(models.Model):

    name = models.CharField(max_length=50, blank=True, verbose_name='이름')
    expired = models.IntegerField(default=0, validators=[MaxValueValidator(12), MinValueValidator(1)], verbose_name='기간(월)')
    price = models.IntegerField(default=0, validators=[MaxValueValidator(10000000), MinValueValidator(0)], verbose_name='가격') # 최대 1000만원
