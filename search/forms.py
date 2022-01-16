from django.forms import ModelForm
from .models import Search
 
class SearchForm(ModelForm):
    class Meta:
        model = Search
        fields = ['id', 'user_id', 'keyword']