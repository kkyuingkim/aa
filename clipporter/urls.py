from django.urls import path
from clipporter import views

app_name = "clipporter"
 
urlpatterns = [
    path('', views.list, name='list'),
]

