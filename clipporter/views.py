from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"클립포터"}
    return render(request, 'clipporter/clipporter_main.html.html' , context)