from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_401_UNAUTHORIZED
from rest_framework.views import APIView

from .pagination import ImagesPagePagination

from .models import Image

from .serializers import ImagesSerializer


# Create your views here.

class BasicResponse(APIView):

    def get(self, request):

        return Response({'message': 'If you see this message than everything works correct!'})

class ImagesResponse(APIView):

    pagination_class = ImagesPagePagination

    def get(self, request):
        images = Image.objects.all()
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(images, request)
        serializer = ImagesSerializer(page, many=True, context={'request': request})

        return paginator.get_paginated_response(serializer.data)


class SpecificImageResponse(APIView):

    def get(self, request, *args, **kwargs):
        image_uuid = kwargs.get("image_uuid")

        image = Image.objects.get(uuid=image_uuid)

        return Response(ImagesSerializer(image, context={'request': request}).data, status=HTTP_200_OK)


class LikesManagement(APIView):

    permission_classes = (IsAuthenticated,)

    def put(self, request, image_uuid):

        current_image = get_object_or_404(Image, uuid=image_uuid)

        if current_image.likes.filter(id=request.user.id):
            current_image.likes.remove(request.user)
        else:
            current_image.likes.add(request.user)

        return Response({

                          "message": "Внимание: Успешно оставили/убрали лайк изображения",

                          "result": {
                              "likesCount": current_image.get_likes_count(),
                              "isLiked": current_image.likes.filter(id=request.user.id).exists()
                          }

                          }, status=HTTP_200_OK)



class UserResponse(APIView):

    def get(self, request):

        return Response({"is_auth": not request.user.is_anonymous}, status=HTTP_200_OK)