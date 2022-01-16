from django.shortcuts import render

def main(request):

    ctx = {}
    return render(request, 'main/index.html', ctx)

def category(request, category1, category2):

    ctx = { }
    html = '%s/%s.html' % (category1, category2)
    return render(request, html, ctx) 
