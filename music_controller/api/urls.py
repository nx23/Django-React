from django.urls import path
from .views import RoomView, RoomInsert

urlpatterns = [
    path('view/', RoomView.as_view()),
    path('insert/', RoomInsert.as_view()),
]
