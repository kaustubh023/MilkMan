from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from django.db import models
from .models import Subscription
from .serializers import SubscriptionSerializer
from apps.orders.models import Order, OrderItem


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Subscription.objects.all()

        return Subscription.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def run_daily(self, request):
        if request.user.role != 'ADMIN':
            return Response(
                {"error": "Only admin can run daily subscriptions"},
                status=status.HTTP_403_FORBIDDEN
            )

        today = now().date()
        created_orders = 0

        subscriptions = Subscription.objects.filter(is_active=True)

        for sub in subscriptions:
            # stop if subscription expired
            if sub.end_date and today > sub.end_date:
                continue

            # Prevent duplicate order for same day
            existing_order = Order.objects.filter(
                user=sub.user,
                order_date=today,
                is_subscription_order=True
            ).exists()

            if existing_order:
                continue

            product = sub.product

            if product.stock < sub.quantity:
                continue  # skip if not enough stock

            # Deduct stock
            product.stock -= sub.quantity
            product.save()

            # Create Order
            order = Order.objects.create(
                user=sub.user,
                is_subscription_order=True,
                total_amount=product.price * sub.quantity
            )

            # Create OrderItem
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=sub.quantity,
                price=product.price
            )

            created_orders += 1

        return Response({
            "message": "Daily subscription processing complete",
            "orders_created": created_orders
        })
