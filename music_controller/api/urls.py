from django.urls import path
from .views import RoomView, RoomCreate

urlpatterns = [
    path('view/', RoomView.as_view()),
    path('create/', RoomCreate.as_view()),
]
