from Image.models import Image
from Image.serializers import ImageSerializer
from rest_framework import serializers
from .models import Game


class GameSerializer(serializers.ModelSerializer):
    image = ImageSerializer()
    ai_answer = serializers.IntegerField(required=False, allow_null=True)
    winner = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    username2 = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    tip_ai = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    user2_answer = serializers.IntegerField(required=False,  allow_null=True)
    
    class Meta:
        model = Game
        fields = [
            'id', 'username1', 'username2', 'is_pvp', 'is_pvai',
            'image', 'user1_answer', 'user2_answer', 'ai_answer', 'tip_ai', 'winner'
        ]

    def create(self, validated_data):
        image_data = validated_data.pop('image')
        image, created = Image.objects.get_or_create(imgPath=image_data['imgPath'], defaults=image_data)
        if not created:
            image.realAge = image_data.get('realAge', image.realAge)
            image.save()
        
        game = Game.objects.create(image=image, **validated_data)
        return game

    def update(self, instance, validated_data):
        image_data = validated_data.pop('image')
        image = instance.image

        instance.username1 = validated_data.get('username1', instance.username1)
        instance.username2 = validated_data.get('username2', instance.username2)
        instance.is_pvp = validated_data.get('is_pvp', instance.is_pvp)
        instance.is_pvai = validated_data.get('is_pvai', instance.is_pvai)
        instance.user1_answer = validated_data.get('user1_answer', instance.user1_answer)
        instance.user2_answer = validated_data.get('user2_answer', instance.user2_answer)
        instance.ai_answer = validated_data.get('ai_answer', instance.ai_answer)
        instance.tip_ai = validated_data.get('tip_ai', instance.tip_ai)
        instance.winner = validated_data.get('winner', instance.winner)

        image.imgPath = image_data.get('imgPath', image.imgPath)
        image.realAge = image_data.get('realAge', image.realAge)
        image.save()

        instance.save()
        return instance
