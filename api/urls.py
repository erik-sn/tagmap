from django.conf.urls import url
from rest_framework.routers import DefaultRouter

from . import views

urlpatterns = [

    url(r'upload/(?P<filename>.*)$', views.FileUploadView.as_view(), name='upload'),
]

router = DefaultRouter()
routes = {
    'tags': views.TagView,
    'scans': views.ScanEventView,
}

for route, viewset in routes.items():
    router.register(route, viewset, base_name=route)

urlpatterns += router.urls
