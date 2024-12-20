from django.urls import path
from .views import SignupView,CustomTokenObtainPairView,LogoutView,FetchUserDetailView

urlpatterns = [
 path('signup/', SignupView.as_view(), name='signup'),
 path('api/token/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
 path('logout/', LogoutView.as_view(), name='logout'),
 path('my_detail/',FetchUserDetailView.as_view(),name="user_detail")
]