from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.index, name='home'),
    path('<slug:slug>/', views.PostDetail.as_view(), name='post_detail'),
    path('<slug:slug>/', views.post_detail, name='post_detail'),
]
