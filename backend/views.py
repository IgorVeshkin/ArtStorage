from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView

from .filters import TagFilter, TagSearchFilter
from .pagination import ImagesPagePagination

from .models import Image, Tag

from .serializers import ImagesSerializer, TagSerializer


# Create your views here.

class BasicResponse(APIView):

    def get(self, request):

        return Response({'message': 'If you see this message than everything works correct!'})


class ImagesResponse(APIView):
    queryset = Image.objects.all()
    pagination_class = ImagesPagePagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TagFilter

    def get(self, request):
        filter_instance = self.filterset_class(
            data=dict(request.query_params),
            queryset=self.queryset
        )
        filtered_queryset = filter_instance.qs


        paginator = self.pagination_class()
        page = paginator.paginate_queryset(filtered_queryset, request)
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

    permission_classes = (IsAuthenticated,)

    def get(self, request):

        return Response({"is_auth": not request.user.is_anonymous}, status=HTTP_200_OK)


class TagsValidationCheck(APIView):

    def get(self, request):

        found_tags = []

        if "tags" in request.GET:

            tags_slug = request.GET.get("tags").split(",")

            if not tags_slug:
                Response({"tags": []}, status=HTTP_200_OK)

            found_tags = Tag.objects.filter(title_slug__in=tags_slug)


        return Response({"tags": TagSerializer(found_tags, many=True).data}, status=HTTP_200_OK)


class TagSearch(APIView):
    queryset = Tag.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = TagSearchFilter

    def get(self, request):
        filter_instance = self.filterset_class(
            data=request.query_params,
            queryset=self.queryset
        )
        filtered_queryset = filter_instance.qs

        serializer = TagSerializer(filtered_queryset, many=True, context={'request': request})

        return Response({"found_matches": serializer.data}, status=HTTP_200_OK)