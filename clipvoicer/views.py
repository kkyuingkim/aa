from django.shortcuts import render
from .models import *

 
def list(request):
    context = { "message":"클립보이서"}
    return render(request, 'clipvoicer/clipvoicer_main.html.html' , context)