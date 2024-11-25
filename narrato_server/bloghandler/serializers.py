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
    

class BlogUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False  # Optional for updates
    )
    hashtags = serializers.ListField(
        child=serializers.CharField(),
        required=False  # Optional for updates
    )
    existing_images = serializers.ListField(
        child=serializers.IntegerField(),  # Assuming these are image IDs
        required=False  # Optional for updates
    )
    removed_images = serializers.ListField(
        child=serializers.IntegerField(),  # Assuming these are image IDs
        required=False  # Optional for updates
    )
    class Meta:
        model = Blog
        fields = ['title', 'description', 'images', 'hashtags','removed_images','existing_images']

   
    def update(self, instance, validated_data):
        print("validate data",validated_data)
        images = validated_data.pop('images', [])
        raw_hashtags = validated_data.pop('hashtags', [])
        removed_image_ids = validated_data.pop('removed_images', []) 
        
         # Extract removed image IDs
        if removed_image_ids:
            instance.post_images.filter(id__in=removed_image_ids).delete()

        # Update fields on the instance
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Handle images
        if images:
            instance.post_images.all().delete()  # Remove old images
            for image in images:
                PostImage.objects.create(post=instance, post_image=image)

        
        hashtag_objects = []
        if raw_hashtags:
            print("\n\n\n\nrawhashtags",raw_hashtags)
            # Ensure raw_hashtags[0] is valid before decoding
            if isinstance(raw_hashtags[0], str):
                try:
                    parsed_hashtags = json.loads(raw_hashtags[0])
                except json.JSONDecodeError:
                    parsed_hashtags = []  # Default to an empty list if JSON decoding fails
            else:
                parsed_hashtags = raw_hashtags  # Already parsed
                print("parsed hastahgas",parsed_hashtags)
            # Process each hashtag
            for hashtag_name in raw_hashtags:
                print(hashtag_name)

                hashtag_name = hashtag_name.strip('#').lower()
                hashtag, created = Hashtag.objects.get_or_create(name=hashtag_name)
                hashtag_objects.append(hashtag)

        # Set hashtags to the instance
        instance.hashtags.set(hashtag_objects)
        return instance


        
