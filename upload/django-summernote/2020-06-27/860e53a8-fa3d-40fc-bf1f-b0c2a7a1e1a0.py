"""chagaun URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.urls import path
from django.urls import include, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.views.generic import TemplateView
#import debug_toolbar

from page import views as pages

urlpatterns = [
    path('', pages.main),
    path('summernote/', include('django_summernote.urls')), # 썸머노트 업로드
    path('admin/', admin.site.urls),
    path('api/v1/signup/code', pages.api_v1_signup_code),
    path('api/v1/signup', pages.api_v1_signup),
    path('api/v1/login', pages.api_v1_login),
    path('api/v1/charge', pages.api_v1_charge),
    path('api/v1/pw/change', pages.api_v1_pw_change),
    path('api/v1/pw/reset', pages.api_v1_pw_reset),
    path('api/v1/inquiry', pages.api_v1_inquiry),
    path('Member/Logout', pages.api_v1_logout),
    path('<name1>/', pages.category1),
    path('<name1>/<name2>', pages.category2),
    path('<name1>/<name2>/<name3>', pages.category3),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

#if settings.DEBUG:
#    urlpatterns.append(url(r'^__debug__/', include(debug_toolbar.urls)))
