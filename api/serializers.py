from rest_framework import serializers
from .models import Tag, ScanEvent, PiDatabase


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('point_id', 'name', 'object_type', 'change_date',
                  'creation_date', 'changer', 'creator', 'exdesc')


class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanEvent
        fields = ('file_name', 'created', 'modified')


class PiDatabaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = PiDatabase
        fields = ('id', 'server', 'data_source', 'name', 'description')
