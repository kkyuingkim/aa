from django.urls import path
from page import views 

app_name = "download"
 
urlpatterns = [
    path('', views.list, name='list'),
]

