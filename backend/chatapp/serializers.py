from rest_framework import serializers
from .models import AppUser, Chat, Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MuyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AppUser
		fields = ('uuid', 'username', 'email', 'password', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_authenticated', 'date_joined')

class ChatSerializer(serializers.ModelSerializer):
    chatters = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Chat
        fields = ('id', 'topic', 'chatters')

    def get_user(self, obj):
        return obj.user.get_full_name()

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'chat', 'sender', 'timestamp', 'content')