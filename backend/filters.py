import django_filters
import uuid

from .models import Image


class MultipleTagFilter(django_filters.CharFilter):
    # Фильтрация нескольких тегов, например: /?page=1&tags=ea195b05-d65e-4455-9572-a90c39658330%2C8edf4b66-fc0e-4aff-8cc3-fd7bf83a9b94
    # Где теги: ea195b05-d65e-4455-9572-a90c3965833,8edf4b66-fc0e-4aff-8cc3-fd7bf83a9b94 ----> "," равна %2C
    def filter(self, queryset, value):
        if not value:
            return queryset


        tag_uuids = [tag_uuid.strip() for tag_uuid in value.strip("[]'").split(',') if tag_uuid.strip()]
        uuid_list = []

        for uid in tag_uuids:
            try:
                uuid_list.append(uuid.UUID(uid))
            except ValueError:
                continue

        if not uuid_list:
            return queryset.none()

        return queryset.filter(tags__uuid__in=uuid_list).distinct()

class TagFilter(django_filters.FilterSet):
    tags = MultipleTagFilter(
        field_name="tags",
        lookup_expr="in",
    )

    class Meta:
        model = Image
        fields = ["tags"]
