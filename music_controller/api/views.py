from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class UpdateRoom(APIView):
    serializers_class = UpdateRoomSerializer
    
    def patch(self, request, format=None):
        serializer = self.serializers_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            queryset = Room.objects.filter(code=code)
            if queryset.exists():
                room = queryset[0]
                user_id = self.request.session.session_key
                if user_id == room.host:
                    room.guest_can_pause = guest_can_pause
                    room.votes_to_skip = votes_to_skip
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_403_FORBIDDEN)   
        return Response(status=status.HTTP_400_BAD_REQUEST)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        queryset = Room.objects.filter(host=self.request.session.session_key)
        if queryset.exists():
            room = queryset[0]
            self.request.session.pop('code', room.code)
            host_id = self.request.session.session_key
            queryset = Room.objects.filter(host=host_id)
            if queryset.exists():
                room = queryset[0]
                room.delete()
        return Response({'Message':'Success'}, status=status.HTTP_200_OK)


class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        queryset = Room.objects.filter(host=self.request.session.session_key)
        if queryset.exists():
            room = queryset[0]
            data = {
                "roomCode": room.code,
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_200_OK)


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        roomCode = request.GET.get(self.lookup_url_kwarg)
        if roomCode != None:
            queryset = Room.objects.filter(code=roomCode)
            if queryset.exists():
                data = RoomSerializer(queryset[0]).data
                data['is_host'] = self.request.session.session_key == queryset[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
        

class RoomCreate(APIView):
    seriazer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.seriazer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
