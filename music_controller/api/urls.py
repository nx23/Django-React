from django.urls import path
from .views import RoomView, RoomCreate, GetRoom

urlpatterns = [
    path('view/', RoomView.as_view()),
    path('create/', RoomCreate.as_view()),
    path('get-room/', GetRoom.as_view()),
]
