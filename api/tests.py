from datetime import datetime
from unittest import TestCase

from django.core.exceptions import ObjectDoesNotExist
from rest_framework.test import APIClient


from .models import ScanEvent, PiDatabase, Tag


class TestScanEventView(TestCase):

    @classmethod
    def setUpClass(cls):
        database = PiDatabase.objects.create(
            name='test database',
            description='this is for testing',
            server='127.0.0.1',
            data_source='localhost'
        )
        ScanEvent.objects.create(file_name='test1.xlsx')
        ScanEvent.objects.create(file_name='test2.xlsx')
        ScanEvent.objects.create(file_name='test3.xlsx')
        cls.db_scan = ScanEvent.objects.create(database=database)

        Tag.objects.create(
            point_id=1,
            name='tag1',
            object_type='type1',
            change_date=datetime.now(),
            creation_date=datetime.now(),
            changer='test name',
            creator='test name',
            exdesc='equation 1',
            scan=cls.db_scan,
        )

        Tag.objects.create(
            point_id=2,
            name='tag2',
            object_type='type1',
            change_date=datetime.now(),
            creation_date=datetime.now(),
            changer='test name',
            creator='test name',
            exdesc='equation 2',
            scan=cls.db_scan,
        )

    @classmethod
    def tearDownClass(cls):
        Tag.objects.all().delete()
        ScanEvent.objects.all().delete()
        PiDatabase.objects.all().delete()

    def setUp(self):
        self.client = APIClient()

    def test_retrieves_all_scans(self):
        response = self.client.get('/api/scans/')
        self.assertEqual(200, response.status_code)
        self.assertEqual(4, len(response.data))

    def test_retrieves_all_tags_from_scan(self):
        id = self.db_scan.id
        response = self.client.get('/api/scans/{}/'.format(id))
        self.assertEqual(200, response.status_code)
        self.assertEqual(id, response.data['id'])

    def test_returns_404_if_scan_does_not_exist(self):
        response = self.client.get('/api/scans/99/')
        self.assertEqual(404, response.status_code)

    def test_post_not_available(self):
        response = self.client.post('/api/scans/')
        self.assertEqual(405, response.status_code)

    def test_put_not_available(self):
        response = self.client.put('/api/scans/99/')
        self.assertEqual(405, response.status_code)

    def test_delete(self):
        scan = ScanEvent.objects.create(file_name='test1.xlsx')
        response = self.client.delete('/api/scans/{}/'.format(scan.id))
        self.assertEqual(200, response.status_code)
        with self.assertRaises(ObjectDoesNotExist):
            ScanEvent.objects.get(id=scan.id)

