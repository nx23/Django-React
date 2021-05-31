from django.urls import path
from .views import RoomView, RoomCreate, GetRoom, UserInRoom, LeaveRoom

urlpatterns = [
    path('view/', RoomView.as_view()),
    path('create/', RoomCreate.as_view()),
    path('get-room/', GetRoom.as_view()),
    path('user-in-room/', UserInRoom.as_view()),
    path('leave-room/', LeaveRoom.as_view()),
]
