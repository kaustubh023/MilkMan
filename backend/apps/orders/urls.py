from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = router.urls
