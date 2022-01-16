from django.shortcuts import render, redirect
from .models import *
 
def learnus_main(request):
    if request.method=='POST':
        context = {"message": "LearnusList"}
        return render(request, 'learnus/learnus.html.html', context)
    else:
        context = {"message": "LearnusList"}
        return render(request, 'learnus/learnus.html.html', context)

def learnus_list(request):
    context = {"message": "LearnusList"}
    return render(request, 'learnus/learnus_list.html.html', context)
 
def learnus_detail(request, id):
    context = {"message": "LearnusList"}
    return render(request, 'learnus/learnus_detail.html.html', context)
