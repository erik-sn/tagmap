from django.db import models


# Create your models here.
class Tag(models.Model):
    point_id = models.IntegerField()
    name = models.TextField()
    object_type = models.TextField()
    change_date = models.DateTimeField()
    creation_date = models.DateTimeField()
    changer = models.TextField()
    creator = models.TextField()
    exdesc = models.TextField()
    scan = models.ForeignKey('ScanEvent')


class ScanEvent(models.Model):
    file_name = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
