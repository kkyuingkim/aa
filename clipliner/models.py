from django.db import models
 
class Clipliner(models.Model):
     name = models.CharField(max_length=100)
     email = models.EmailField()
     comment = models.TextField(null=True)
     createDate = models.DateTimeField(auto_now_add=True)