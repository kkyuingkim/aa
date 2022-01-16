from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Inquiry

class InquiryAdmin(admin.ModelAdmin):

    def _created_at(self, obj):
        return '%s ' % (obj.created_at.strftime("%Y.%m.%d"))
 
    summernote_fields = ('comment',) # 썸머노트 필드
    list_display = ('id', 'solution', 'category', 'name', 'company', 'position', 'phone', 'email', '_created_at', '_actions',)
    list_display_links = ('id', 'solution', 'category', 'name', 'company', 'position', 'phone', 'email',)
    search_fields = ['name', 'company', 'position', 'phone',]
    readonly_fields = ['comment',]
    fields = (
        'solution',
        'category',
        'name',
        'company',
        'position',
        'phone',
        'email',
        'comment',
        'file0',
        'answer',
        'created_at',
    )
    list_filter = ('solution', 'category',)
    ordering = ('-created_at',)

    def _actions(self, obj):
        return mark_safe('<a href="/admin/inquiry/inquiry/{0}/change/">[수정]</a>'.format(obj.id))

    _actions.short_description = '수정'
    _created_at.short_description = '작성일'

admin.site.register(Inquiry, InquiryAdmin)

