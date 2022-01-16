from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"클립트레일러"}
    return render(request, 'cliptrailer/cliptrailer_main.html.html' , context)