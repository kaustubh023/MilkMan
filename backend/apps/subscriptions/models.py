from django.db import models
from django.conf import settings
from apps.products.models import Product


class Subscription(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )

    quantity = models.PositiveIntegerField()
    months = models.PositiveIntegerField(default=1)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"
