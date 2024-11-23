from django.db import models
from userauthentication.models import CustomUser
from django.utils import timezone
# Create your models here.
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

class Blog(models.Model):
    title = models.CharField(max_length=250)  # Changed from TextField to CharField
    description = models.TextField(null=True, blank=True, max_length=1000)
    created_at = models.DateTimeField(default=timezone.now)  # Changed to DateTimeField for more precision
    updated_at = models.DateTimeField(auto_now=True)  # Added to track modifications
    likes = models.IntegerField(default=0)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,  # Added on_delete
        related_name="my_posts"
    )

    class Meta:
        ordering = ['-created_at']  # Most recent posts first
        
    def __str__(self):
        return f"{self.title} by {self.user.username}"

class PostImage(models.Model):
    post_image = models.ImageField(upload_to='post_images/')  # Snake case naming
    post = models.ForeignKey(  # Renamed from postid for clarity
        Blog,
        on_delete=models.CASCADE,  # Added on_delete
        related_name="post_images"
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Added timestamp

    def __str__(self):
        return f"Image for {self.post.title}"

class Hashtag(models.Model):  # Capitalized class name per Python conventions
    name = models.CharField(max_length=100)  # Changed from TextField and renamed from tag
    posts = models.ManyToManyField(  # Changed to ManyToManyField for better relationship handling
        Blog,
        related_name="hashtags"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['name'])]  # Add index for better query performance

    def __str__(self):
        return self.name

    def clean(self):
        if self.name:
            # Remove # if included and lowercase
            self.name = self.name.strip('#').lower()

# class Blog(models.Model):
#     title=models.TextField(max_length=250)
#     description=models.TextField(null=True,blank=True,max_length=1000),
#     created_at=models.DateField(default=timezone.now)
#     likes=models.IntegerField(default=0)
#     user=models.ForeignKey(CustomUser,related_name="my_posts")

# class PostImage(models.Model):
#     postimage=models.ImageField(upload_to='post_images/')
#     postid=models.ForeignKey(Blog,related_name="post_images")

# class hashtag(models.Model):
#     tag=models.TextField(null=True,blank=True)
#     postid=models.ForeignKey(Blog,related_name="hashtags")
    




