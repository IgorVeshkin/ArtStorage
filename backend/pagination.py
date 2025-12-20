from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK


class ImagesPagePagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = "page_size"
    page_query_param = "current_page"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "totalCount": self.page.paginator.count,
            "currentPage": self.page.number,
            "pageSize": int(self.request.query_params.get(self.page_size_query_param, self.page_size)),
            "totalPages": self.page.paginator.num_pages,
            "result": data,

        }, status=HTTP_200_OK)