# portfolio/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # La ruta raíz '' se mapea a la vista index_view
    path('', views.index_view, name='index'),
]