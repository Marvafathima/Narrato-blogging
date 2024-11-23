from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id','email', 'username', 'password', 'password2', 
                  'profile_pic')
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
           
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra responses here
        data['id'] = self.user.id
        data['email'] = self.user.email
        data['username'] = self.user.username
        return data
class UserDetialSerializer(serializers.ModelSerializer):
    joined_at = serializers.DateTimeField( format="%Y-%m-%d", read_only=True)
    profile_pic = serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=['id', 'username', 'email', 'profile_pic', 'joined_at']
    def get_profile_pic(self, obj):
        if obj.profile_pic:
            try:
                # Return the complete URL
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.profile_pic.url)
                return obj.profile_pic.url
            except Exception as e:
                print(f"Error getting profile pic URL: {e}")
                return None
        return None