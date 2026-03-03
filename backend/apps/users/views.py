from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import User
from .serializers import RegisterSerializer, UserSerializer, StaffSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'ADMIN'


class StaffViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='STAFF')
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
