from rest_framework import viewsets
from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class IsAdminOrReadOnly(BasePermission):
    """
    Allow read-only access to everyone.
    Allow write access only to ADMIN users.
    """

    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS
        if request.method in SAFE_METHODS:
            return True

        # Allow only ADMIN for write operations
        return request.user.is_authenticated and request.user.role == 'ADMIN'


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]