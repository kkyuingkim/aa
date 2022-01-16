from django.urls import path
from feedback import views

app_name = "feedback"
 
urlpatterns = [
    path('list/', views.list, name='list'),
    path('create', views.create, name='create'),
    path('edit/(?P<id>\d+)/$', views.edit, name='edit')
]

