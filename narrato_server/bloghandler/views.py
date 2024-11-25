from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Blog
from .serializers import BlogSerializer, BlogCreateSerializer,BlogUpdateSerializer
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

class BlogManageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Create a new blog post."""
        serializer = BlogCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            blog = serializer.save()
            return Response(BlogSerializer(blog).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, blog_id, *args, **kwargs):
        """Update an existing blog post."""
        try:
            blog = Blog.objects.get(id=blog_id, user=request.user)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

        print("requested data is",request.data)
        serializer = BlogUpdateSerializer(blog, data=request.data, context={'request': request})
        if serializer.is_valid():
            updated_blog = serializer.save()
            return Response(BlogSerializer(updated_blog).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, blog_id, *args, **kwargs):
        """Delete a blog post."""
        try:
            blog = Blog.objects.get(id=blog_id, user=request.user)
            blog.delete()
            return Response({'message': 'Blog deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)

class UserBlogsView(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]  # Ensures only authenticated users can access

    def get_queryset(self):
        # Fetch blogs belonging to the requesting user
        if not self.request.user.is_authenticated:
            raise AuthenticationFailed(detail="Authentication failed.Please login again.")
        return Blog.objects.filter(user=self.request.user).order_by('-created_at')
