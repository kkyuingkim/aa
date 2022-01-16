from django.db import models
from django.utils.timezone import now
     

class Category(models.Model):
    code = models.CharField(max_length=6, default='', null=False)
    full_code = models.CharField(max_length=6, default='', null=False)
    depth = models.IntegerField(default=1, null=False)
    name = models.CharField(max_length=30, default='', null=False)
    path = models.CharField(max_length=30, default='', null=False)
    file = models.CharField(max_length=255, default='', blank=True)
    link = models.CharField(max_length=100, default='', blank=True)
    created_at = models.DateTimeField(default=now)

    def save(self, *args, **kwargs):
        self.full_code = '{:<06s}'.format(self.code)
        self.depth = int(len(self.code) / 2)

        super(Category, self).save(*args, **kwargs)

    class Meta:
        verbose_name  = '카테고리'
        verbose_name_plural  = '카테고리'

    def __str__(self):
        return '[{0}] {1}'.format('카테고리', self.name)
