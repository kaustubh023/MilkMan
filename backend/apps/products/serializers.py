from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    image = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'stock',
            'image',
            'is_active',
            'category',
            'category_id'
        ]
