from django.contrib import admin
from django.utils.safestring import mark_safe
from django_summernote.admin import SummernoteModelAdmin
from .models import Library

#class LibraryAdmin(admin.ModelAdmin):
class LibraryAdmin(SummernoteModelAdmin):
    def _created_at(self, obj):
        return '%s ' % (obj.created_at.strftime("%Y.%m.%d"))

    summernote_fields = ('content',) # 썸머노트 필드
    list_display = ('id', 'category', 'subject', '_created_at', 'author', 'view', 'display', '_actions',)
    list_display_links = ('id', 'category', 'subject',)
    search_fields = ['subject', 'content']
    fields = (
        'category',
        'subject',
        'memo',
        'content',
        'image0',
        'file0',
        'created_at',
        'view',
        'display',
    )
    list_filter = ('category',)
    ordering = ('-created_at',)

    def save_model(self, request, obj, form, change):
        if change is False:
            obj.author = request.user.username
        obj.save()

    def _actions(self, obj):
        return mark_safe('<a href="/admin/library/library/{0}/change/">[수정]</a>'.format(obj.id))

    _actions.short_description = '수정'
    _created_at.short_description = '작성일'

admin.site.register(Library, LibraryAdmin)
