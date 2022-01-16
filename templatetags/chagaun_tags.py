from django import template

from ..models import Post

register = template.Library()


@register.simple_tag
def recent_posts(count):
    posts = Post.objects.filter(status='published').order_by('-published')[:count]
    return posts