
from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health_check),
    path('agent/', include('flashcards_agent.urls')),
    path('agent/', include('quizes_agent.urls')),
    path('agent/', include('diagram_agent.urls')),
    path('agent/', include('summraiz_agent.urls')),
    path('agent/', include('file_processing.urls')),
    path('agent/', include('chatbot_app.urls')),
    


]
