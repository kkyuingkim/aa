from django.urls import path
from clipper import views

app_name = "clipper"
 
urlpatterns = [
    path('', views.list, name='list'),
]

