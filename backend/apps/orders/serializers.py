from rest_framework import serializers
from .models import Order, OrderItem, Cart, CartItem
from apps.products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    order_items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'status',
            'total_amount',
            'is_subscription_order',
            'items',
            'order_items',
            'created_at'
        ]
        read_only_fields = ['status', 'total_amount', 'is_subscription_order']

    def get_order_items(self, obj):
        return [
            {
                "product": item.product.name,
                "quantity": item.quantity,
                "price": item.price
            }
            for item in obj.items.all()
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user

        order = Order.objects.create(user=user)

        total_amount = 0

        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}"
                )

            product.stock -= quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price
            )

            total_amount += product.price * quantity

        order.total_amount = total_amount
        order.save()

        return order


class CartItemWriteSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1)


class CartItemReadSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['product', 'product_name', 'quantity', 'price']

    def get_price(self, obj):
        return obj.product.price
