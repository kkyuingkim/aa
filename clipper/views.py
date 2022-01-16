from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"클리퍼"}
    return render(request, 'clipper/index.html.html' , context)