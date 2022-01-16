from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now


solutions = (
    ('아이디검증', '아이디검증'),
    ('쇼핑솔루션', '쇼핑솔루션'),
    ('SNS솔루션', 'SNS솔루션'),
    ('기타', '기타'),
)

categorys = (
    ('일반문의', '일반문의'),
    ('제안요청', '제안요청'),
    ('버그신고', '버그신고'),
    ('탈퇴신청', '탈퇴신청'),
    ('기타', '기타'),
)

class Inquiry(models.Model):
    solution = models.CharField(max_length=10,  default='아이디검증', choices=solutions, verbose_name='솔루션')
    category = models.CharField(max_length=10,  default='일반문의', choices=categorys, verbose_name='카테고리')
    name = models.CharField(max_length=255, default='', blank=True, verbose_name='작성자명')
    company = models.CharField(max_length=255, default='', blank=True, verbose_name='회사명')
    position  = models.CharField(max_length=255, default='', blank=True, verbose_name='직책')
    phone = models.CharField(max_length=50, default='', verbose_name='연락처')
    email = models.CharField(max_length=250, default='', verbose_name='이메일')
    comment = models.TextField(default='', blank=True, verbose_name='문의내용')
    file0 = models.FileField(upload_to='inquiry_file/%Y/%m/%d/', blank=True, verbose_name='첨부파일')

    answer = models.TextField(default='', blank=True, verbose_name='문의답변')

    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE) 

    created_at = models.DateTimeField(default=now)

    class Meta:
        verbose_name  = 'inquiry'
        verbose_name_plural  = 'inquiry'

    def __str__(self):
        return '[{0}] {1}'.format(self.solution, self.category)

