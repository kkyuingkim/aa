from django.urls import path

from . import views

app_name = "learnus"


urlpatterns = [
    path('', views.learnus_main, name="learnus"),
    path('list/', views.learnus_list, name="learnus_list"),
    path('detail/<int:id>/', views.learnus_detail, name="learnus_detail"),
]
