from django.urls import path
from login import views

app_name = "login"
 
urlpatterns = [
    path('', views.list, name='list'),
]

