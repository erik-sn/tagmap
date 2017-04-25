from rest_framework import serializers
from .models import Tag, ScanEvent, PiDatabase


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ('id', 'point_id', 'name', 'object_type', 'change_date',
                  'creation_date', 'changer', 'creator', 'exdesc')


class ScanSerializer(serializers.ModelSerializer):
    tags = serializers.ReadOnlyField()

    class Meta:
        model = ScanEvent
        depth = 1
        fields = ('id', 'file_name', 'database', 'created', 'modified', 'tags')


class PiDatabaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = PiDatabase
        fields = ('id', 'server', 'data_source', 'name', 'description',
                  'created', 'modified')
