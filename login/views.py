from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"로그인 페이지"}
    return render(request, 'login/login.html.html' , context)