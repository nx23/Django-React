from django.urls import path
from .views import RoomView, RoomCreate, GetRoom, UserInRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    path('view/', RoomView.as_view()),
    path('create-room/', RoomCreate.as_view()),
    path('get-room/', GetRoom.as_view()),
    path('user-in-room/', UserInRoom.as_view()),
    path('leave-room/', LeaveRoom.as_view()),
    path('update-room/', UpdateRoom.as_view()),
]
