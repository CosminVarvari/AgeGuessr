from django.db import models

from Image.models import Image

class Game(models.Model):
    username1 = models.CharField(max_length=30)
    username2 = models.CharField(max_length=30, null=True, blank=True)
    is_pvp = models.BooleanField()
    is_pvai = models.BooleanField()
    image = models.ForeignKey(Image, on_delete=models.CASCADE, related_name='games')
    user1_answer = models.IntegerField()
    user2_answer = models.IntegerField(null=True, blank=True)
    ai_answer = models.IntegerField(null=True, blank=True)
    tip_ai = models.CharField(max_length=50, null=True, blank=True)
    winner = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return f"Game: {self.username1} vs {self.username2} - Winner: {self.winner}"
