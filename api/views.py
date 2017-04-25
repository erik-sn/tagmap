import pyodbc

from django.db.models import Count
from django.db.transaction import atomic
from django.db.utils import OperationalError
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import generics
from dateutil.parser import parse

from .models import ScanEvent, Tag, PiDatabase
from .serializers import ScanSerializer, TagSerializer, PiDatabaseSerializer
from .odbc import get_pi_conn


@api_view(['GET'])
def index(request):
    return render(request, 'api/index.html')


class TagView(viewsets.ReadOnlyModelViewSet):

    queryset = Tag.objects.all().order_by('-point_id')
    serializer_class = TagSerializer

    def list(self, request, **kwargs):
        scan = request.GET.get('scan', None)
        if not scan:
            return Response({'scan': 'this is a required url parameter'}, 400)
        tags = Tag.objects.filter(scan=scan)
        return Response(TagSerializer(tags, many=True).data, 200)

    def retrieve(self, request, pk=None, *args, **kwargs):
        tags = Tag.objects.filter(scan__id=pk)
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, 200)


class ScanEventView(viewsets.ModelViewSet):

    queryset = ScanEvent.objects.order_by('-created').annotate(tags=Count('tag'))
    serializer_class = ScanSerializer

    def create(self, request, *args, **kwargs):
        return Response(status=405)

    def update(self, request, *args, **kwargs):
        return Response(status=405)



class PiDatabaseView(viewsets.ModelViewSet):

    queryset = PiDatabase.objects.all().order_by('-created')
    serializer_class = PiDatabaseSerializer
    scan_query = """
    SELECT tag, exdesc FROM pipoint.pipoint2
    WHERE exdesc <> '' AND  (pointsource='C' OR exdesc LIKE '%event%')
    """

    def create(self, request, **kwargs):
        serializer = PiDatabaseSerializer(data=request.data)
        if serializer.is_valid():
            # test to see if connection can be made
            try:
                with get_pi_conn(request.data['server'], request.data['data_source']) as conn:
                    serializer.save()
                    return Response(serializer.data, status=201)
            except pyodbc.Error:
                return Response({'server': 'could not connect to the server through odbc'}, 400)
        return Response(serializer.errors, 400)

    def retrieve(self, request, pk=None, *args, **kwargs):
        """start database scan"""
        database = PiDatabase.objects.get(id=pk)
        with get_pi_conn(database.server, database.data_source) as conn:
            cursor = conn.cursor()
            cursor.execute(self.scan_query)
            tags = [tag for tag in cursor.fetchall()]
            scan = ScanEvent.objects.create(database=database)
            for tag in tags:
                print(tag)
        return Response('test', 200)


class FileUploadView(APIView):

    header_map = {}
    required_headers = [
        'name',
        'objecttype',
        'changedate',
        'changer',
        'creation',
        'creator',
        'pointid',
        'exdesc'
    ]
    invalid_rows = []

    def check_header_row(self, sheet):
        headers = [header.lower() for header in sheet[0]]
        for required in self.required_headers:
            found = False
            for i, h in enumerate(headers):
                if required in h:
                    found = True
                    self.header_map[required] = i
            if not found:
                raise ValueError('Invalid headers, header not found: {}'.format(required))

    @atomic
    def save_tags(self, tags):
        [tag.save() for tag in tags if tag is not None]

    def generate_tag(self, i, row, scan):
        if row[self.header_map['name']] == '' or row[self.header_map['exdesc']] == '':
            self.invalid_rows.append({'row': i + 1, 'values': row})
            return None
        tag = Tag(
            point_id=row[self.header_map['pointid']],
            name=row[self.header_map['name']],
            object_type=row[self.header_map['objecttype']],
            change_date=parse(row[self.header_map['changedate']]),
            creation_date=parse(row[self.header_map['creation']]),
            changer=row[self.header_map['changer']],
            creator=row[self.header_map['creator']],
            exdesc=row[self.header_map['exdesc']],
            scan=scan,
        )
        return tag

    def put(self, request, filename):
        file = request.FILES['file']
        sheet = [row for row in file.get_sheet()]

        if len(sheet) < 2:
            return Response({'format', 'Sheet must have at least 2 rows'}, 400)

        try:
            self.check_header_row(sheet)
            scan = ScanEvent.objects.create(file_name=filename)
            tags = [self.generate_tag(i, r, scan) for i, r in enumerate(sheet[1:])]
        except ValueError as e:
            return Response({'headers': e.args[0]}, 400)
        try:
            self.save_tags(tags)
        except OperationalError:
            return Response({'database': 'The database is locked - close any connections to sqlite'}, 400)
        return Response({'count': len(tags), 'invalid': self.invalid_rows}, status=200)
