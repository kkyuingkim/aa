from django.db import models
from django.utils.timezone import now
from imagekit.models import ProcessedImageField
from imagekit.processors import Thumbnail
from imagekit.processors import ResizeToFill

import threading
from django.core.mail import EmailMultiAlternatives

class EmailThread(threading.Thread):
    def __init__(self, subject, body, from_email, recipient_list, fail_silently, html):
        self.subject = subject
        self.body = body
        self.recipient_list = recipient_list
        self.from_email = from_email
        self.fail_silently = fail_silently
        self.html = html
        threading.Thread.__init__(self)

    def run (self):
        msg = EmailMultiAlternatives(self.subject, self.body, self.from_email, self.recipient_list)
        if self.html:
            msg.attach_alternative(self.html, "text/html")
        msg.send(self.fail_silently)

def send_mail(subject, body, from_email, recipient_list, fail_silently=False, html=None, *args, **kwargs):
    EmailThread(subject, body, from_email, recipient_list, fail_silently, html).start()

THUMB_WIDTH = 500
THUMB_HEIGHT = 500

categorys = (
    '레시피'
)

class Recipe(models.Model):

    category = models.CharField(max_length=10,  default='News', choices=[('레시피', '레시피')], verbose_name='카테고리')
    subject = models.CharField(max_length=50, default='', verbose_name='제목')
    memo = models.CharField(max_length=100, default='',  blank=True, verbose_name='설명')
    content = models.TextField(default='', verbose_name='내용')
    image0 = ProcessedImageField(null=True, blank=True, upload_to='data/%Y/%m/%d/', processors = [ResizeToFill(THUMB_WIDTH, THUMB_HEIGHT)], format = 'JPEG', options = {'quality': 90}, default="", verbose_name='커버 이미지')
    file0 = models.FileField(null=True, blank=True, upload_to='data/%Y/%m/%d/', verbose_name='파일')
    view = models.IntegerField(default=0, blank=True, verbose_name='조회수')
    author = models.CharField(max_length=20, default='', blank=True, verbose_name='작성자')
    display = models.BooleanField(default=True, verbose_name='게시 여부')
    permanent = models.BooleanField(default=False , verbose_name='공지 여부')
    created_at = models.DateTimeField(default=now)

    class Meta:
        verbose_name  = '레시피'
        verbose_name_plural  = '레시피'

    def __str__(self):
        return '[{0}] {1}'.format(self.category, self.subject)


