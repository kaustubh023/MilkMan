from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MeView, StaffViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet, basename='staff')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', MeView.as_view(), name='me'),
    path('', include(router.urls)),
]
