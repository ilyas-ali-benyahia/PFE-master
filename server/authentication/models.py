# services/supabase_service.py
import os
from supabase import create_client
from django.core.exceptions import ValidationError

class SupabaseService:
    def __init__(self):
        self.client = create_client(
            os.getenv('SUPABASE_URL'),
            os.getenv('SUPABASE_KEY')
        )

    def create_user(self, email, password, username):
        try:
            # Create user in Supabase Auth
            auth_response = self.client.auth.sign_up({
                'email': email,
                'password': password,
                'options': {
                    'data': {
                        'username': username,
                    }
                }
            })
            
            # Insert user into public.users table
            db_response = self.client.table('users').insert({
                'id': auth_response.user.id,
                'email': email,
                'username': username
            }).execute()
            
            return auth_response.user
        
        except Exception as e:
            raise ValueError(f"Supabase error: {str(e)}")

    def login_user(self, email, password):
        try:
            response = self.client.auth.sign_in_with_password({
                'email': email,
                'password': password
            })
            return response
        except Exception as e:
            raise ValueError(f"Login failed: {str(e)}")