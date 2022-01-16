from django.shortcuts import render, redirect
from .models import *
from .forms import SearchForm

from django.http import HttpResponse

# Create your views here.
def search(request):
    if request.method=='POST':
        context = {"message": "SearchList"}
        form = SearchForm(request.POST)
        if form.is_valid():
            form.save()
        return render(request, "search/search_list.html.html", context)
        # return redirect('search/search_list.html.html')
    else:
        form = SearchForm()
    return render(request, 'search/search.html.html', {'form': form})
    
def search_list(request):
    context = {"message": "SearchList"}
    return render(request, "search/search_list.html.html", context)


def search_detail(request):
    context = {"message": "SearchDetail"}
    return render(request, "search/search_detail.html.html", context)


 
