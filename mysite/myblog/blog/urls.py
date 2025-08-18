from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.index, name='home'),
    path('embedded/', views.embedded_blog, name='embedded'),
    path('embedded/<slug:slug>/', views.embedded_post_detail, name='embedded_detail'),
    path('<slug:slug>/', views.post_detail, name='post_detail'),
]