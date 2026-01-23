import django_filters

from .models import Image, Tag


class MultipleTagFilter(django_filters.CharFilter):
    # Фильтрация нескольких тегов, например: /?page=1&tags=ea195b05-d65e-4455-9572-a90c39658330%2C8edf4b66-fc0e-4aff-8cc3-fd7bf83a9b94
    # Где теги: ea195b05-d65e-4455-9572-a90c3965833,8edf4b66-fc0e-4aff-8cc3-fd7bf83a9b94 ----> "," равна %2C
    # Поменял отображение тегов: вместо uuid теперь slug
    def filter(self, queryset, value):
        if not value:
            return queryset

        tag_slugs = [tag_slug.strip() for tag_slug in value.strip("[]'").split(',') if tag_slug.strip()]
        slug_list = []

        for slug in tag_slugs:
            try:
                slug_list.append(slug)
            except ValueError:
                continue

        if not slug_list:
            return queryset.none()


        return queryset.filter(tags__title_slug__in=slug_list).distinct()

class TagFilter(django_filters.FilterSet):
    tags = MultipleTagFilter(
        field_name="tags",
        lookup_expr="in",
    )

    class Meta:
        model = Image
        fields = ["tags"]


class TagSearchFilter(django_filters.FilterSet):
    tag = django_filters.CharFilter(
        field_name="title_slug",
        lookup_expr="icontains",
    )

    class Meta:
        model = Tag
        fields = ["title_slug"]