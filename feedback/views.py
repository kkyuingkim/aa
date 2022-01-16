from django.shortcuts import render, redirect
from .models import *
from .forms import FeedbackForm
 
def list(request):
    feedbacks = Feedback.objects.all()
    return render(request, 'feedback/feedback_list.html.html', {'feedbacks': feedbacks})

def create(request):
    if request.method=='POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('/feedback/list/')
    else:
        form = FeedbackForm()
 
    return render(request, 'feedback/feedback_detail.html.html', {'form': form})
 
def edit(request, id):
    fb = Feedback.objects.get(pk=id)
    if request.method=='POST':
        form = FeedbackForm(request.POST, instance=fb)
        if form.is_valid():
            form.save()
        return redirect('/feedback/list/')
    else:
        form = FeedbackForm(instance=fb)
 
    return render(request, 'feedback/feedback_detail.html.html', {'form': form})