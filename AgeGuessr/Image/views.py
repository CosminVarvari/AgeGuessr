from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.
from .models import Image
from .serializers import ImageSerializer
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)  # Print request data
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid")  # Print if serializer is valid
            self.perform_create(serializer)
            print("Saved data:", serializer.data)  # Print saved data
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", serializer.errors)  # Print serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()
        print("Data saved to database")  # Print after saving data