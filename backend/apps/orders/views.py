from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Order, Cart, CartItem
from .serializers import OrderSerializer, CartItemWriteSerializer, CartItemReadSerializer
from django.db import models


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Order.objects.all().order_by('-created_at')

        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()

        if request.user.role != 'ADMIN':
            return Response(
                {"error": "Only admin can update order status"},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')

        if new_status not in ['PENDING', 'DELIVERED', 'CANCELLED']:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        return Response({"message": "Order status updated successfully"})
    
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        if request.user.role != 'ADMIN':
            return Response(
                {"error": "Only admin can view dashboard"},
                status=status.HTTP_403_FORBIDDEN
            )

        from apps.users.models import User

        total_customers = User.objects.filter(role='CUSTOMER').count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(status='DELIVERED').aggregate(
            total=models.Sum('total_amount')
        )['total'] or 0

        from apps.subscriptions.models import Subscription
        from django.utils.timezone import now
        today = now().date()
        active_subscriptions = Subscription.objects.filter(is_active=True).exclude(end_date__lt=today).count()

        return Response({
            "total_customers": total_customers,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "active_subscriptions": active_subscriptions
        })


class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_or_create_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self._get_or_create_cart(request.user)
        items = CartItem.objects.filter(cart=cart)
        data = CartItemReadSerializer(items, many=True).data
        return Response({"items": data})

    @action(detail=False, methods=['post'])
    def add(self, request):
        serializer = CartItemWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = self._get_or_create_cart(request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
        if not created:
            item.quantity += quantity
            item.save()
        return Response({"message": "Added to cart"})

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        serializer = CartItemWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = self._get_or_create_cart(request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        try:
            item = CartItem.objects.get(cart=cart, product=product)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not in cart"}, status=status.HTTP_404_NOT_FOUND)
        item.quantity = quantity
        item.save()
        return Response({"message": "Updated"})

    @action(detail=False, methods=['delete'])
    def remove(self, request):
        serializer = CartItemWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = self._get_or_create_cart(request.user)
        product = serializer.validated_data['product']
        CartItem.objects.filter(cart=cart, product=product).delete()
        return Response({"message": "Removed"})

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = self._get_or_create_cart(request.user)
        CartItem.objects.filter(cart=cart).delete()
        return Response({"message": "Cleared"})

    @action(detail=False, methods=['post'])
    def sync(self, request):
        items = request.data.get('items', [])
        cart = self._get_or_create_cart(request.user)
        for item in items:
            serializer = CartItemWriteSerializer(data=item)
            serializer.is_valid(raise_exception=True)
            product = serializer.validated_data['product']
            quantity = serializer.validated_data['quantity']
            obj, _ = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': quantity})
            if obj.quantity != quantity:
                obj.quantity = quantity
                obj.save()
        return Response({"message": "Synced"})
