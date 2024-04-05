from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.user_logout),
    path('registration/', views.UserRegistration.as_view(), name='registration'),
    path('users/<int:pk>/', views.UserDetail.as_view()),
]
