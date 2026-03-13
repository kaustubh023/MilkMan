from rest_framework import serializers
from datetime import timedelta
from django.utils.timezone import now
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id',
            'product',
            'quantity',
            'months',
            'start_date',
            'end_date',
            'total_price',
            'is_active'
        ]
        read_only_fields = ['start_date', 'end_date', 'total_price']

    def get_total_price(self, obj):
        return obj.months * obj.quantity * obj.product.price

    def create(self, validated_data):
        # Compute end_date as 30 * months days after start_date
        months = validated_data.get('months', 1)
        start = now().date()
        validated_data['end_date'] = start + timedelta(days=30 * months)
        return super().create(validated_data)
