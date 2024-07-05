from django.db import models

# Create your models here.
class Image(models.Model):
    imgPath = models.CharField(max_length=255, null=True, blank=True)
    realAge = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Image: {self.imgPath} - Correct Age: {self.realAge}"