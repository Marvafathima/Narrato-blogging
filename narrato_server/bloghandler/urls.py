from django.urls import path
from .views import BlogCreateView,UserBlogsView,BlogManageView

urlpatterns = [
    path('blog/create/', BlogCreateView.as_view(), name='blog-create'),
    path('my_blogs/',UserBlogsView.as_view(),name='my_blogs'),
     path('blog/manage/', BlogManageView.as_view(), name='blog-manage-create'),  # For creating
    path('blog/manage/<int:blog_id>/', BlogManageView.as_view(), name='blog-manage-update-delete'),  # For updating and deleting

]
