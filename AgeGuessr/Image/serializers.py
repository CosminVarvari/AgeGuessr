from .models import Image
from rest_framework import serializers

class ImageSerializer(serializers.ModelSerializer):
    realAge = serializers.IntegerField(required=False, allow_null=True)
    class Meta:
        model = Image
        fields = '__all__'