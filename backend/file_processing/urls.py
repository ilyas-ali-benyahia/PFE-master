from django.urls import path
from .views import upload_and_extract,health_check

urlpatterns = [
    path("upload/", upload_and_extract, name="upload"),
    path('health/', health_check, name='health_check'),

]
