import math
from django import template

register = template.Library()

@register.filter
def price_format(value):
    try:
        return str(math.trunc(value / 10000))
    except Exception as e:
        return '0'

@register.filter
def price_format_int(value):
    try:
        return int(str(math.trunc(value / 10000)))
    except Exception as e:
        return 0

@register.filter
def comma_format(value):
    return format(value, ',')

@register.filter
def apm_format(value):
    if value < 12:
        return '오전'
    elif value >= 12:
        return '오후'

@register.simple_tag
def query_transform(request, **kwargs):
    updated = request.GET.copy()
    for k, v in kwargs.items():
        if v is not None:
            if True is v:
                v = 'on'
            elif False is v:
                v = ''

            updated[k] = v
        else:
            updated.pop(k, 0)  # Remove or return 0 - aka, delete safely this key

    return updated.urlencode()
