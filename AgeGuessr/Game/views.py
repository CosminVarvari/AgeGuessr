from Image.models import Image
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Game
from .serializers import GameSerializer
from tensorflow.keras.models import load_model # type: ignore
import numpy as np
from tensorflow.keras.preprocessing.image import img_to_array, load_img # type: ignore
import os

def load_and_prepare_image(image_path):
    img = load_img(image_path, target_size=(200, 200), color_mode='grayscale')
    img = img_to_array(img)
    img /= 255.0
    img = np.expand_dims(img, axis=0)
    return img

def load_and_prepare_imageHard(image_path):
    img = load_img(image_path, target_size=(200, 200), color_mode='rgb')
    img = img_to_array(img)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

model = load_model('AI_Models/final_cnn_model.h5')
modelHard = load_model('AI_Models/final_resnet_model.h5')

class GameCreateView(generics.CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        data = serializer.validated_data
        username1 = data.get('username1')
        username2 = data.get('username2', None)
        resultuser1 = data.get('user1_answer')
        resultuser2 = data.get('user2_answer', 0)
        is_pvp = data.get('is_pvp')
        is_pvai = data.get('is_pvai')
        tip_ai = data.get('tip_ai', None)
        image = data.get('image')
        image_path = image.get('imgPath')
        allImage = Image.objects.filter(imgPath =image_path)
        realAge = 10
        for img in allImage:
            if img.imgPath == image['imgPath']:
                image['realAge'] = img.realAge 
                realAge = img.realAge
                break
        resultuser1 = resultuser1 if resultuser1 is not None else 0
        realAge = realAge if realAge is not None else 0
        winner = None
        ai_answer = None
        if is_pvp:
            if abs(resultuser1 - realAge) < abs(resultuser2 - realAge):
                winner = username1
            elif abs(resultuser1 - realAge) > abs(resultuser2 - realAge):
                winner = username2
            else:
                winner = 'draw'
        elif is_pvai:
            if tip_ai == 'easy':
                image_relative_path = os.path.join('..', 'AgeGuessr-frontend', 'src', 'assets', 'images', 'ai', image_path)
                image_path = os.path.abspath(image_relative_path)
                img = load_and_prepare_image(image_path)
                predicted_age = model.predict(img)
                ai_answer = int(predicted_age)
                if abs(predicted_age-realAge) < abs(resultuser1 - realAge):
                    winner = 'ai'
                elif abs(predicted_age-realAge) > abs(resultuser1 - realAge):
                    winner = username1
                else:
                    winner = 'draw'
            elif tip_ai == 'hard':
                image_relative_path = os.path.join('..', 'AgeGuessr-frontend', 'src', 'assets', 'images', 'ai', image_path)
                image_path = os.path.abspath(image_relative_path)
                img = load_and_prepare_imageHard(image_path)
                predicted_age = modelHard.predict(img)
                ai_answer = int(predicted_age)
                if abs(predicted_age-realAge) < abs(resultuser1 - realAge):
                    winner = 'ai'
                elif abs(predicted_age-realAge) > abs(resultuser1 - realAge):
                    winner = username1
                else:
                    winner = 'draw'
        game = serializer.save(
            username1=username1,
            username2=username2,
            is_pvp=is_pvp,
            is_pvai=is_pvai,
            image=image,
            user1_answer=resultuser1,
            user2_answer=resultuser2,
            ai_answer=ai_answer,
            tip_ai=tip_ai,
            winner=winner
        )
        return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)


class GameListView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

class GameUpdateView(generics.UpdateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

class GameDeleteView(generics.DestroyAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Game deleted successfully"}, status=status.HTTP_200_OK)
