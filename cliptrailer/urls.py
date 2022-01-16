from django.urls import path
from cliptrailer import views

app_name = "cliptrailer"
 
urlpatterns = [
    path('', views.list, name='list'),
]

