import os
import re
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view
from rest_framework.response import Response
from langchain.document_loaders import PyPDFLoader
from .utils import docx_to_text, pptx_to_text,image_to_text,txt_to_text
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import NoTranscriptFound, TranscriptsDisabled


@api_view(["POST"])
def upload_and_extract(request):
    """
    Handles either YouTube transcript extraction OR file uploads, not both.
    Returns extracted text based on the input (file or YouTube URL).
    """
    # Get YouTube URL or file from the request
    url = request.data.get("youtube_url", request.data.get("url", "")).strip()
    file = request.FILES.get("file", None)
    
    # Ensure only one input is provided (either file or YouTube URL)
    if url and file:
        return Response(
            {"error": "Please provide either a YouTube URL or a file, not both."},
            status=400,
        )
    
    # 🎬 Process YouTube URL if provided
    if url:
        # Improved regex to extract YouTube video ID from various URL formats
        regex = r"(?:v=|\/)([0-9A-Za-z_-]{11})(?:&|\/|$)"
        video_id_match = re.search(regex, url)
        
        if not video_id_match:
            return Response({"error": "Invalid YouTube URL"}, status=400)
        
        video_id = video_id_match.group(1)
        
        try:
            # Try multiple language options - including Arabic
            languages_to_try = ['en', 'ar', 'es', 'fr', 'de']
            transcript = None
            
            # First try specific languages
            for lang in languages_to_try:
                try:
                    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[lang])
                    break
                except NoTranscriptFound:
                    continue
            
            # If specific languages failed, try to get any available transcript
            if not transcript:
                # Get list of available transcripts
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                
                # First try to find an auto-generated transcript
                for t in transcript_list:
                    if t.is_generated:
                        transcript = t.fetch()
                        break
                
                # If no auto-generated transcript found, get the first available one
                if not transcript and len(list(transcript_list)) > 0:
                    transcript = list(transcript_list)[0].fetch()
            
            # If we still don't have a transcript, raise an error
            if not transcript:
                raise NoTranscriptFound(video_id, languages_to_try)
            
            # Extract the text from the transcript
            text = " ".join([item["text"] for item in transcript])
            
            return Response({
                
                "extracted_text": text
            })
        except TranscriptsDisabled:
            return Response({"error": "Transcripts are disabled for this YouTube video"}, status=400)
        except Exception as e:
            # Try to get available languages for better error message
            try:
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                available_language_codes = []
                
                for t in transcript_list:
                    if t.is_generated:
                        available_language_codes.append(f"{t.language_code} (auto-generated)")
                    else:
                        available_language_codes.append(t.language_code)
                
                language_options = ", ".join(available_language_codes)
                return Response({
                    "error": f"YouTube transcript extraction failed. Available languages: {language_options}",
                    "suggestion": "You may need to specify one of these languages in your request."
                }, status=400)
            except:
                return Response({"error": f"YouTube transcript extraction failed: {str(e)}"}, status=500)
    
    # 📂 Process file if provided
    if file:
        try:
            # Save the uploaded file
            file_name = default_storage.save(f"uploads/{file.name}", file)
            file_path = os.path.join(default_storage.location, file_name)
            
            # Determine the file extension
            file_ext = file.name.split(".")[-1].lower()
            extracted_text = ""
            
            # Process the file based on its extension
            if file_ext == "pdf":
                loader = PyPDFLoader(file_path)
                docs = loader.load()
                extracted_text = "\n".join([doc.page_content for doc in docs])
            elif file_ext == "docx":
                extracted_text = docx_to_text(file_path)
            elif file_ext == "pptx":
                extracted_text = pptx_to_text(file_path)
            elif file_ext in ["jpg", "jpeg", "png", "bmp", "tiff", "gif"]:
                extracted_text = image_to_text(file_path)
            elif file_ext == "txt":
                extracted_text = txt_to_text(file_path)
            else:
                return Response(
                    {
                        "error": f"Unsupported file format: .{file_ext}",
                        "supported_formats": ["pdf", "docx", "pptx"],
                    },
                    status=400,
                )
            
            # Check if text extraction was successful
            if not extracted_text.strip():
                return Response(
                    {
                        "error": "Text extraction failed. File might be empty or unreadable."
                    },
                    status=500,
                )
            
            # Return success response with extracted text
            return Response(
                {
                    
                    "extracted_text": extracted_text,
                }
            )
        except Exception as e:
            return Response({"error": f"Text extraction failed: {str(e)}"}, status=500)
    
    # ❌ If neither YouTube URL nor file is provided
    return Response({"error": "No file or YouTube URL provided"}, status=400)