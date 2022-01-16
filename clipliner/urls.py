from django.urls import path
from clipliner import views

app_name = "clipliner"
 
urlpatterns = [
    path('', views.list, name='list'),
]

