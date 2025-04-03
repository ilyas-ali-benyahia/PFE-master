# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .utils import UserRegistrationSerializer, UserLoginSerializer
from .supbase import SupabaseService
import jwt
from django.conf import settings
from datetime import datetime, timedelta

User = get_user_model()
supabase_service = SupabaseService()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Create user in Supabase first
            supabase_user = supabase_service.create_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                username=serializer.validated_data['username']
            )

            # Create user in Django
            user = serializer.save()
            user.supabase_id = supabase_user.id
            user.save()

            # Generate JWT token
            token = generate_jwt_token(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'supabase_id': user.supabase_id,
                    'username': user.username,
                    'email': user.email
                },
                'token': token
            }, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Delete Django user if Supabase creation failed
            if 'id' in locals():
                User.objects.filter(id=user.id).delete()
            return Response({'message': f'Registration failed: {str(e)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Authenticate with Supabase
            supabase_response = supabase_service.login_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )

            # Get Django user
            user = User.objects.get(supabase_id=supabase_response.user.id)

            # Generate JWT token
            token = generate_jwt_token(user)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'supabase_id': user.supabase_id,
                    'username': user.username,
                    'email': user.email
                },
                'token': token,
                'supabase_access_token': supabase_response.session.access_token
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'message': str(e)}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def generate_jwt_token(user):
    token_payload = {
        'user_id': user.id,
        'supabase_id': user.supabase_id,
        'username': user.username,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')