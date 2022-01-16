from functools import wraps
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator # < Import the Paginator class
from django.db.models import F
from category.models import Category
from board.models import Board
from recipe.models import Recipe
from library.models import Library
from inquiry.models import Inquiry
from django.contrib.auth.models import User
from member.models import Member
from payment.models import Payment

HTML_404 = 'layout/404.html'
MAIN = "main/index.html"
n = 2
categorys = Category.objects

def deco_category(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        if request.method == 'POST':
            return function(request, *args, **kwargs)

        name1 = kwargs['name1'] if 'name1' in kwargs else None
        name2 = kwargs['name2'] if 'name2' in kwargs else None
        name3 = kwargs['name3'] if 'name3' in kwargs else None

        if 'ctx' not in request.session or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        path = '/' + '/'.join([ p for p in [name1, name2, name3] if p is not None])
        main_categorys = None
        my_main_categorys = None
        my_main_category = None
        sub_categorys = None
        my_sub_categorys = None
        my_sub_category = None
        end_categorys = None
        my_end_categorys = None
        my_end_category = None
        prev_category = None
        next_category = None

        #categorys = Category.objects

        main_categorys = categorys.filter(depth=1).order_by('full_code')
        sub_categorys = categorys.filter(depth=2).order_by('full_code')
        end_categorys = categorys.filter(depth=3).order_by('full_code')

        for main_category in main_categorys:
            main_category.full_codes = [main_category.code[i:i+n] for i in range(0, len(main_category.code), n)]
        for sub_category in sub_categorys:
            sub_category.full_codes = [sub_category.code[i:i+n] for i in range(0, len(sub_category.code), n)]
        for end_category in end_categorys:
            end_category.full_codes = [end_category.code[i:i+n] for i in range(0, len(end_category.code), n)]

        my_category = categorys.filter(path=path).first()
        
        if my_category:

            full_code = my_category.full_code
            if my_category.full_code != '000000': # /Main (홈) 제외
                full_code = full_code.replace('00', '01')

            my_main_categorys = categorys.filter(code__startswith=full_code[0:2], depth=1).order_by('full_code')
            my_main_category = categorys.filter(code=full_code[0:2], depth=1).first()

            my_sub_categorys = categorys.filter(code__startswith=full_code[0:2], depth=2).order_by('full_code')
            my_sub_category = categorys.filter(code=full_code[0:4], depth=2).first()

            my_end_categorys = categorys.filter(code__startswith=full_code[0:4], depth=3).order_by('full_code')
            my_end_category = categorys.filter(code=full_code[0:6], depth=3).first()
            
            ctx['html'] = my_category.file.replace('/', '', 1) # /path1 -> path1
	
        else:
            ctx['html'] = HTML_404

        if my_main_category:
            prev_category = categorys.filter(depth=1, full_code__lt=my_main_category.full_code).order_by('-full_code').first()
            if prev_category is None:
                prev_category = categorys.filter(depth=1).order_by('-full_code').first()
            next_category = categorys.filter(depth=1, full_code__gt=my_main_category.full_code).order_by('full_code').first()
            if next_category is None:
                next_category = categorys.filter(depth=1).order_by('full_code').first()

        ctx['main_categorys'] = main_categorys
        ctx['my_main_categorys'] = my_main_categorys
        ctx['my_main_category'] = my_main_category
        ctx['sub_categorys'] = sub_categorys
        ctx['my_sub_categorys'] = my_sub_categorys
        ctx['my_sub_category'] = my_sub_category
        ctx['end_categorys'] = end_categorys
        ctx['my_end_categorys'] = my_end_categorys
        ctx['my_end_category'] = my_end_category
        ctx['prev_category'] = prev_category
        ctx['next_category'] = next_category
        ctx['path'] = path

        return function(request, *args, **kwargs)
    return wrap

def deco_board(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        name1 = kwargs['name1'] if 'name1' in kwargs else None
        name2 = kwargs['name2'] if 'name2' in kwargs else None
        name3 = kwargs['name3'] if 'name3' in kwargs else None

        BoardModel = None
        if name1 == "Contact" and name2 == None: name2 = "Board"
        if name2 == "Board": 
            idx = 0
            BoardModel = Board
        elif name2 == "Market":
            idx = 1
            BoardModel = Library

        if 'ctx' not in request.session  or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        fargs  = {}

        if BoardModel != None:
            path = '/' + '/'.join([ p for p in [name1, name2, name3] if p is not None])
            c = Category.objects.filter(depth=2, path=path).first()
            cs = [ x[idx] for x in BoardModel._meta.get_field('category').choices ]
            if c and c.name in cs:
                board_category = c.name
            else:
                return function(request, *args, **kwargs)
        else:
            return function(request, *args, **kwargs)
            
        page_size = 9
        total = 0
        top_posts = None
        id = request.GET.get('id')
        m = 'l' if request.GET.get('m') is None else request.GET.get('m')
        page = '1' if request.GET.get('page') is None else request.GET.get('page')
        field = '' if request.GET.get('field') is None else request.GET.get('field')
        keyword = '' if request.GET.get('keyword') is None else request.GET.get('keyword')
        type = '' if request.GET.get('type') is None else request.GET.get('type')

        if m is 'l':
           fargs['category'] = board_category

           if field == "subject":
               fargs["subject__icontains"] = keyword
           elif field == "content":
               fargs["content__icontains"] = keyword
           elif field == "subject_content":
               fargs["subject__icontains"] = keyword
               fargs["content__icontains"] = keyword
           else:
               pass

           total = BoardModel.objects.filter(**fargs).count()
           posts = BoardModel.objects.filter(**fargs).order_by('-created_at').all()

           paginator = Paginator(posts, page_size) # < 3 is the number of items on each page
           posts = paginator.get_page(page) # < New in 2.0!

           if len(posts) > 0:
                for i, post in enumerate(posts):
                    page_num = int(page)-1
                    post.no = total -  (page_num * page_size) - i
        elif m is 'v':
           BoardModel.objects.filter(id=id).update(view=F('view')+1)
           posts = BoardModel.objects.get(id=id)

           prev_data = None
           next_data = None

           prev_data = BoardModel.objects.filter(display=True, category=board_category, id__lt=id).order_by('-id').first()
           if prev_data is None:
               prev_data = BoardModel.objects.filter(display=True, category=board_category).order_by('-id').first()

           next_data = BoardModel.objects.filter(display=True, category=board_category, id__gt=id).order_by('id').first()
           if next_data is None:
               next_data = BoardModel.objects.filter(display=True, category=board_category).order_by('id').first()

           ctx['prev_data'] = prev_data
           ctx['next_data'] = next_data

        ctx['total'] = total
        ctx['page'] = page
        ctx['data'] = posts
        ctx['top_posts'] = top_posts
        ctx['id'] = id
        ctx['m'] = m
        ctx['field'] = field
        ctx['keyword'] = keyword

        return function(request, *args, **kwargs)
    return wrap

# def deco_library(function):
#     @wraps(function)
#     def wrap(request, *args, **kwargs):
#         name1 = kwargs['name1'] if 'name1' in kwargs else None
#         name2 = kwargs['name2'] if 'name2' in kwargs else None
#         name3 = kwargs['name3'] if 'name3' in kwargs else None

#         if 'ctx' not in request.session  or request.session['ctx'] is None:
#             request.session['ctx'] = {}
#         ctx = request.session['ctx']

#         fargs  = {}

#         path = '/' + '/'.join([ p for p in [name1, name2, name3] if p is not None])
#         c = Category.objects.filter(depth=2, path=path).first()
#         cs = [ x[0] for x in Library._meta.get_field('category').choices ]
#         if c and c.name in cs:
#             library_category = c.name
#         else:
#             return function(request, *args, **kwargs)

#         page_size = 9
#         total = 0
#         top_posts = None
#         id = request.GET.get('id')
#         m = 'l' if request.GET.get('m') is None else request.GET.get('m')
#         page = '1' if request.GET.get('page') is None else request.GET.get('page')
#         field = '' if request.GET.get('field') is None else request.GET.get('field')
#         keyword = '' if request.GET.get('keyword') is None else request.GET.get('keyword')
#         type = '' if request.GET.get('type') is None else request.GET.get('type')

#         if m is 'l':
#            fargs['category'] = library_category

#            if field == "subject":
#                fargs["subject__icontains"] = keyword
#            elif field == "content":
#                fargs["content__icontains"] = keyword
#            elif field == "subject_content":
#                fargs["subject__icontains"] = keyword
#                fargs["content__icontains"] = keyword
#            else:
#                pass

#            total = Library.objects.filter(**fargs).count()
#            posts = Library.objects.filter(**fargs).order_by('-created_at').all()

#            paginator = Paginator(posts, page_size) # < 3 is the number of items on each page
#            posts = paginator.get_page(page) # < New in 2.0!

#            if len(posts) > 0:
#                 for i, post in enumerate(posts):
#                     page_num = int(page)-1
#                     post.no = total -  (page_num * page_size) - i
#         elif m is 'v':
#            Library.objects.filter(id=id).update(view=F('view')+1)
#            posts = Library.objects.get(id=id)

#            prev_data = None
#            next_data = None

#            prev_data = Library.objects.filter(display=True, category=library_category, id__lt=id).order_by('-id').first()
#            if prev_data is None:
#                prev_data = Library.objects.filter(display=True, category=library_category).order_by('-id').first()

#            next_data = Library.objects.filter(display=True, category=library_category, id__gt=id).order_by('id').first()
#            if next_data is None:
#                next_data = Library.objects.filter(display=True, category=library_category).order_by('id').first()

#            ctx['prev_data'] = prev_data
#            ctx['next_data'] = next_data

#         ctx['total'] = total
#         ctx['page'] = page
#         ctx['data'] = posts
#         ctx['top_posts'] = top_posts
#         ctx['id'] = id
#         ctx['m'] = m
#         ctx['field'] = field
#         ctx['keyword'] = keyword

#         return function(request, *args, **kwargs)
#     return wrap

def deco_recipe(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        name1 = kwargs['name1'] if 'name1' in kwargs else None
        name2 = kwargs['name2'] if 'name2' in kwargs else None
        name3 = kwargs['name3'] if 'name3' in kwargs else None

        RecipeModel = None
        if name1 == "Contact" and name2 == None: name2 = "Recipe"
        if name2 == "Recipe": 
            idx = 0
            RecipeModel = Recipe
        elif name2 == "Market":
            idx = 1
            RecipeModel = Library

        if 'ctx' not in request.session  or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        fargs  = {}

        if RecipeModel != None:
            path = '/' + '/'.join([ p for p in [name1, name2, name3] if p is not None])
            c = Category.objects.filter(depth=2, path=path).first()
            cs = [ x[idx] for x in RecipeModel._meta.get_field('category').choices ]
            if c and c.name in cs:
                recipe_category = c.name
            else:
                return function(request, *args, **kwargs)
        else:
            return function(request, *args, **kwargs)
            
        page_size = 9
        total = 0
        top_posts = None
        id = request.GET.get('id')
        m = 'l' if request.GET.get('m') is None else request.GET.get('m')
        page = '1' if request.GET.get('page') is None else request.GET.get('page')
        field = '' if request.GET.get('field') is None else request.GET.get('field')
        keyword = '' if request.GET.get('keyword') is None else request.GET.get('keyword')
        type = '' if request.GET.get('type') is None else request.GET.get('type')

        if m is 'l':
           fargs['category'] = recipe_category

           if field == "subject":
               fargs["subject__icontains"] = keyword
           elif field == "content":
               fargs["content__icontains"] = keyword
           elif field == "subject_content":
               fargs["subject__icontains"] = keyword
               fargs["content__icontains"] = keyword
           else:
               pass

           total = RecipeModel.objects.filter(**fargs).count()
           posts = RecipeModel.objects.filter(**fargs).order_by('-created_at').all()

           paginator = Paginator(posts, page_size) # < 3 is the number of items on each page
           posts = paginator.get_page(page) # < New in 2.0!

           if len(posts) > 0:
                for i, post in enumerate(posts):
                    page_num = int(page)-1
                    post.no = total -  (page_num * page_size) - i
        elif m is 'v':
           RecipeModel.objects.filter(id=id).update(view=F('view')+1)
           posts = RecipeModel.objects.get(id=id)

           prev_data = None
           next_data = None

           prev_data = RecipeModel.objects.filter(display=True, category=recipe_category, id__lt=id).order_by('-id').first()
           if prev_data is None:
               prev_data = RecipeModel.objects.filter(display=True, category=recipe_category).order_by('-id').first()

           next_data = RecipeModel.objects.filter(display=True, category=recipe_category, id__gt=id).order_by('id').first()
           if next_data is None:
               next_data = RecipeModel.objects.filter(display=True, category=recipe_category).order_by('id').first()

           ctx['prev_data'] = prev_data
           ctx['next_data'] = next_data

        ctx['total'] = total
        ctx['page'] = page
        ctx['data'] = posts
        ctx['top_posts'] = top_posts
        ctx['id'] = id
        ctx['m'] = m
        ctx['field'] = field
        ctx['keyword'] = keyword

        return function(request, *args, **kwargs)
    return wrap

def deco_inquiry(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        name1 = kwargs['name1'] if 'name1' in kwargs else None
        name2 = kwargs['name2'] if 'name2' in kwargs else None
        name3 = kwargs['name3'] if 'name3' in kwargs else None

        if 'ctx' not in request.session  or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        fargs  = {}

        if 'Mypage' == name1 and ('QnA' == name2 or 'QnAQuestion' == name2) and request.user.is_authenticated:
            pass
        else:
            return function(request, *args, **kwargs)

        page_size = 9
        total = 0
        top_posts = None
        id = request.GET.get('id')
        m = 'l' if request.GET.get('m') is None else request.GET.get('m')
        page = '1' if request.GET.get('page') is None else request.GET.get('page')

        fargs['user'] = request.user

        if m is 'l':
           total = Inquiry.objects.filter(**fargs).count()
           posts = Inquiry.objects.filter(**fargs).order_by('-created_at').all()

           paginator = Paginator(posts, page_size) # < 3 is the number of items on each page
           posts = paginator.get_page(page) # < New in 2.0!

           if len(posts) > 0:
                for i, post in enumerate(posts):
                    page_num = int(page)-1
                    post.no = total -  (page_num * page_size) - i
        elif m is 'v':
           posts = Inquiry.objects.filter(**fargs).get(id=id)

        ctx['total'] = total
        ctx['page'] = page
        ctx['data'] = posts
        ctx['id'] = id
        ctx['m'] = m

        return function(request, *args, **kwargs)
    return wrap

def deco_payment(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        name1 = kwargs['name1'] if 'name1' in kwargs else None
        name2 = kwargs['name2'] if 'name2' in kwargs else None
        name3 = kwargs['name3'] if 'name3' in kwargs else None

        if 'ctx' not in request.session  or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        fargs  = {}

        if 'Mypage' == name1 and 'Charge' == name2 and request.user.is_authenticated:
            pass
        else:
            return function(request, *args, **kwargs)

        page_size = 9
        total = 0
        top_posts = None
        id = request.GET.get('id')
        m = 'l' if request.GET.get('m') is None else request.GET.get('m')
        page = '1' if request.GET.get('page') is None else request.GET.get('page')


        fargs['user'] = request.user

        if m is 'l':

           total = Payment.objects.filter(**fargs).count()
           posts = Payment.objects.filter(**fargs).order_by('-created_at').all()

           paginator = Paginator(posts, page_size) # < 3 is the number of items on each page
           posts = paginator.get_page(page) # < New in 2.0!

           if len(posts) > 0:
                for i, post in enumerate(posts):
                    page_num = int(page)-1
                    post.no = total -  (page_num * page_size) - i
        elif m is 'v':
           posts = Payment.objects.filter(**fargs).get(id=id)

        ctx['total'] = total
        ctx['page'] = page
        ctx['data'] = posts
        ctx['id'] = id
        ctx['m'] = m

        return function(request, *args, **kwargs)
    return wrap

def deco_userinfo(function):
    @wraps(function)
    def wrap(request, *args, **kwargs):
        if request.method == 'POST':
            return function(request, *args, **kwargs)

        if 'ctx' not in request.session or request.session['ctx'] is None:
            request.session['ctx'] = {}
        ctx = request.session['ctx']

        if request.user.is_authenticated:
            user = User.objects.filter(username=request.user.username).first()
            try:
                member = Member.objects.get(user=user)
            except Member.DoesNotExist:
                member = None

            ctx['user'] = user
            ctx['member'] = member

        return function(request, *args, **kwargs)
    return wrap
