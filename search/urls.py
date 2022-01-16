from django.urls import path

from . import views

app_name = "search"


urlpatterns = [
    path('', views.search, name="search"),
    path('list/', views.search_list, name="search_list"),
    path('detail/', views.search_detail, name="search_detail"),
]