from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response

from .serializers import UserSerializer, UserSerializerDetail
from rest_framework import generics, status
from .forms import UserForm
from rest_framework.decorators import api_view
from rest_framework.views import APIView


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializerDetail


def index(request):
    user = User.objects.filter(id=request.user.id)
    if len(user) != 0:
        return render(request, 'index.html')
    else:
        return redirect('login')


class UserLogin(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return render(request, 'login.html', {'invalid': True})

    def get(self, request):
        return render(request, 'login.html', {'invalid': False})


def user_logout(request):
    logout(request)
    return redirect('login')


class UserRegistration(APIView):
    def post(self, request):
        form = UserForm(request.data)
        if form.is_valid():
            username = form.cleaned_data['username']
            exciting_user = User.objects.filter(username=username)
            if len(exciting_user) == 0:
                password = form.cleaned_data['password']
                user = User.objects.create_user(username, '', password)
                user.save()
                user = authenticate(request, username=username, password=password)
                login(request, user)
                return redirect('index')
            else:
                return render(request, 'registration.html', {'invalid': True, 'form': form})

    def get(self, request):
        form = UserForm()
        return render(request, 'registration.html', {'invalid': True, 'form': form})
