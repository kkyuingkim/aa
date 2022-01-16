from django.urls import path
from . import views

app_name = "klicker"

urlpatterns = [
    path('timesync/', views.auto_time_sync_klicker, name="auto_time_sync_klicker"),
    path('logincheck/', views.auto_login_check_klicker, name="auto_login_check_klicker")
]