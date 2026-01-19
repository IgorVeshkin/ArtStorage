from django.urls import path
from .views import *

urlpatterns = [
    path("basic-response/", BasicResponse.as_view(), name="basic_response"),
    path("get-images/", ImagesResponse.as_view(), name="images_response"),
    path("get-specific-image/<uuid:image_uuid>", SpecificImageResponse.as_view(), name="specific_image_response"),
    path("set-like/<uuid:image_uuid>", LikesManagement.as_view(), name="set_like_response"),
    path("get-user/", UserResponse.as_view(), name="user_response"),
    path("check-tags-validation/", TagsValidationCheck.as_view(), name="check_tags_validation/"),
]