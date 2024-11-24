from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Blog
from .serializers import BlogSerializer, BlogCreateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import AuthenticationFailed
class BlogCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BlogCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            blog = serializer.save()
            return Response(BlogSerializer(blog).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserBlogsView(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]  # Ensures only authenticated users can access

    def get_queryset(self):
        # Fetch blogs belonging to the requesting user
        if not self.request.user.is_authenticated:
            raise AuthenticationFailed(detail="Authentication failed.Please login again.")
        return Blog.objects.filter(user=self.request.user).order_by('-created_at')
