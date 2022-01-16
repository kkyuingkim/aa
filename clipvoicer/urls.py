from django.urls import path
from clipvoicer import views

app_name = "clipvoicer"
 
urlpatterns = [
    path('', views.list, name='list'),
]

