from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"클립라이너"}
    return render(request, 'clipliner/clipliner_main.html.html' , context)