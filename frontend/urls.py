from django.urls import path
from .views import *

urlpatterns = [
    path("", index, name="index"),
    path("login/", index, name="login"),
    path("image/<slug:record_uuid>", index, name="image"),
]