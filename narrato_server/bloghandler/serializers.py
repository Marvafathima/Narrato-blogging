from rest_framework import serializers
from .models import Blog, PostImage, Hashtag
import json
from userauthentication.serializers import UserDetialSerializer

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'post_image']  # Include only relevant fields


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ['id', 'name']  # Include only relevant fields


class BlogSerializer(serializers.ModelSerializer):
    post_images = PostImageSerializer(many=True, read_only=True)  # Nested images
    hashtags = HashtagSerializer(many=True, read_only=True)  # Nested hashtags
    user=UserDetialSerializer()
    # user = serializers.StringRelatedField()  # Assuming you want the username displayed

    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'created_at', 'updated_at', 'likes', 'user', 'post_images', 'hashtags']


class BlogCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(  # To accept images as a list of files
        child=serializers.ImageField(),
        write_only=True
    )
    hashtags = serializers.ListField(  # To accept hashtags as a list of strings
        child=serializers.CharField(),
        write_only=True
    )

    class Meta:
        model = Blog
        fields = ['title', 'description', 'images', 'hashtags']
    def create(self, validated_data):
        images = validated_data.pop('images', [])
        raw_hashtags = validated_data.pop('hashtags', [])
        user = self.context['request'].user  # Get the user from the request

        # Create the blog post
        blog = Blog.objects.create(user=user, **validated_data)

        # Create associated images
        for image in images:
            PostImage.objects.create(post=blog, post_image=image)

        # Handle hashtags
        if raw_hashtags and isinstance(raw_hashtags, list):
            raw_hashtags = json.loads(raw_hashtags[0])  # Unpack nested stringified list

        hashtag_objects = []
        for hashtag_name in raw_hashtags:
            hashtag_name = hashtag_name.strip('#').lower()  # Clean up hashtag name
            hashtag, created = Hashtag.objects.get_or_create(name=hashtag_name)
            hashtag_objects.append(hashtag)

        # Use set() to assign hashtags to the blog
        blog.hashtags.set(hashtag_objects)

        return blog

    # def create(self, validated_data):
    #     images = validated_data.pop('images', [])
    #     # hashtags = validated_data.pop('hashtags', [])
    #     user = self.context['request'].user  # Get the user from the request

    #     # Create the blog post
    #     blog = Blog.objects.create(user=user, **validated_data)

    #     # Create associated images
    #     for image in images:
    #         PostImage.objects.create(post=blog, post_image=image)

    #     raw_hashtags = validated_data.get('hashtags', [])
                
    #     # Convert stringified list into a proper Python list
    #     if raw_hashtags and isinstance(raw_hashtags, list):
    #         raw_hashtags = json.loads(raw_hashtags[0])  # Unpack nested stringified list

    #     for hashtag_name in raw_hashtags:
    #         hashtag_name = hashtag_name.strip('#').lower()  # Clean up hashtag name
    #         hashtag, created = Hashtag.objects.get_or_create(name=hashtag_name)
    #         hashtag.posts.add(blog)  # Add the blog to the hashtag's many-to-many relationship


    #     # Create or get hashtags and associate them with the blog
    #     # for tag in hashtags:
    #     #     hashtag, created = Hashtag.objects.get_or_create(name=tag.strip('#').lower())
    #     #     blog.hashtags.add(hashtag)

    #     return blog
        
