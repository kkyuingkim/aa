from django.db import models

# Create your models here.
from django.db import models
 
class Search(models.Model):
    user_id = models.CharField(max_length=32)
    keyword = models.CharField(max_length=255)
    createDate = models.DateTimeField(auto_now_add=True)