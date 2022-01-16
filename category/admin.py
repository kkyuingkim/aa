from django.contrib import admin
from django.http import HttpResponse
from django.utils.safestring import mark_safe
from .models import Category

def swap_category(modeladmin, request, queryset):
    books = queryset.values_list('id', 'full_code', 'code', 'depth', 'name', 'path', 'file')
    books_len = len(books)
    if books_len == 2:
        category_id_1 = books[0][0]
        category_id_2 = books[1][0]

        category_name_1 = books[0][4]
        category_name_2 = books[1][4]

        category_path_1 = books[0][5]
        category_path_2 = books[1][5]

        category_file_1 = books[0][6]
        category_file_2 = books[1][6]
        print(category_path_1, category_file_1)
        print(category_path_2, category_file_2)
        category1 = Category.objects.all().filter(id=category_id_1)
        category2 = Category.objects.all().filter(id=category_id_2)

        category1.update(name=category_name_2, path=category_path_2, file=category_file_2)
        category2.update(name=category_name_1, path=category_path_1, file=category_file_1)

        print(category_name_1, category_name_2)

swap_category.short_description = 'Swap two category'

def add_new_category(modeladmin, request, queryset):
    books = queryset.values_list('id', 'full_code', 'code', 'depth', 'name')
    books_len = len(books)
    if books_len == 1:
        category_id_1 = books[0][0]
        category_full_code_1 = books[0][1]
        category_code_1 = books[0][2]
        category_name_1 = books[0][4]
        code_max_len = 6
        code_1_len = len(category_code_1)
        code_1_depth = int(code_1_len/2)
        print('code_1_len', code_1_len)
        code_regex = '%s%s' % (category_code_1, '[0-9]' * (code_max_len - code_1_len))

        print('code_regex',code_regex, category_code_1)
        category1 = Category.objects.all().filter(full_code__iregex=code_regex).order_by('full_code').last()
        n = 2
        full_code_arr = [category1.code[i:i+n] for i in range(0, len(category1.code), n)]
        
        print(code_1_depth , len(full_code_arr))

        if code_1_depth == 3 and len(full_code_arr) == 3:
            print('Max category depth!!')
            return

        if code_1_depth == len(full_code_arr):
            new_code = 1
            full_code_arr.append('{:02d}'.format(new_code))
        else:
            new_code = int(full_code_arr[-1]) + 1
            full_code_arr[-1] = '{:02d}'.format(new_code)

        new_full_code = ''.join(full_code_arr)
        
        Category.objects.create(code=new_full_code, name='새로운 카테고리')

        print('ct', category1.full_code, full_code_arr)

add_new_category.short_description = 'Add new category'

class Category_Admin(admin.ModelAdmin):
    list_display = ['_name', 'depth', 'path', 'file', 'link', 'full_code', 'code', ]
    list_display_links = ['_name']
    fields = (
        'code',
        'name',
        'path',
        'file',
        'link',
    )
    ordering = ('full_code',)
    actions = [swap_category, add_new_category]

    def _name(self, obj):
        n = 2
        no = [str(int(obj.code[i:i+n])) for i in range(0, len(obj.code), n)]
        no = '.'.join(no)
        depth_ident = ''
        if obj.depth > 1:
            depth_ident = (obj.depth * '　　') 
        return   depth_ident + ' ' + no + '. ' + obj.name
    
admin.site.register(Category, Category_Admin)


