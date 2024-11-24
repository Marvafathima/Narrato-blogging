from django.urls import path
from .views import BlogCreateView,UserBlogsView

urlpatterns = [
    path('blog/create/', BlogCreateView.as_view(), name='blog-create'),
    path('my_blogs/',UserBlogsView.as_view(),name='my_blogs')
]
