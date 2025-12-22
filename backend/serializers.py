from rest_framework import serializers

from .models import CustomUser, Role, Image

class CustomUserRole(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('name', 'addImages', 'createPublicCollections', 'addTags', )

class CustomUserSerializer(serializers.ModelSerializer):

    role = CustomUserRole()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', )


class ImagesSerializer(serializers.ModelSerializer):

    # Кастомные сериализаторы для связанных моделей
    loaded_by = CustomUserSerializer()

    class Meta:
        model = Image
        exclude = ("likes",)
        ordering = ("-id",)

    # Модицикация значений полей
    def to_representation(self, instance):
        representation = super(ImagesSerializer, self).to_representation(instance)
        representation['create_date'] = instance.create_date.strftime('%d/%m/%Y %H:%M:%S')
        representation['update_date'] = instance.update_date.strftime('%d/%m/%Y %H:%M:%S')

        representation["tags"] = [{ "tag_uuid": tag.uuid, "tag_name": f"{tag.title} ({tag.get_image_records_count()})" } for tag in instance.tags.all()]

        request = self.context.get('request', None)
        current_user = request.user if request else None

        representation["likes"] = {"likesCount": instance.get_likes_count(),
                                  "isLiked": instance.likes.filter(id=current_user.id).exists() if current_user and current_user.is_authenticated else None}
        return representation