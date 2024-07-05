from django.urls import path
from .views import GameListView, GameCreateView, GameUpdateView, GameDeleteView

urlpatterns = [
    path('games/', GameListView.as_view(), name='game-list'),
    path('creategame/', GameCreateView.as_view(), name='game-create'),
    path('updategame/<int:pk>/', GameUpdateView.as_view(), name='game-update'),
    path('deletegame/<int:pk>/', GameDeleteView.as_view(), name='game-delete'),
]