import uuid

from django.core.validators import URLValidator
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Role(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name="Название")
    addImages = models.BooleanField(default=True, verbose_name="Добавление изображений", null=True)
    createPublicCollections = models.BooleanField(default=True, verbose_name="Создание публичных коллекций", null=True)
    addTags = models.BooleanField(default=True, verbose_name="Добавление тегов", null=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    update_date = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return '{}'.format(self.name)


def set_default_role():
    return Role.objects.get(name="Базовый пользователь")

class CustomUser(AbstractUser):
    role = models.ForeignKey('Role', verbose_name="Роль", on_delete=models.SET(set_default_role), related_name='users', blank=True, null=True)

    def __str__(self):
        return "{} : {}".format(self.username, self.email)


def user_directory_path(instance, filename):
    return 'user_{0}/{1}'.format(instance.loaded_by.username, filename)


class Image(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to=user_directory_path)
    loaded_by = models.ForeignKey(CustomUser, verbose_name='Загрузил', on_delete=models.SET_NULL, blank=True, null=True)
    originURL = models.URLField(max_length=400, blank=True, null=True)
    likes = models.ManyToManyField(CustomUser, related_name="image_likes", blank=True, null=True)
    tags = models.ManyToManyField("Tag", related_name="image_tags", blank=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    update_date = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def get_likes_count(self):
        return self.likes.count()

    def save(self, *args, **kwargs):

        if not self.originURL:
            print('Ссылка не была предоставлена. Генерирую ссылку платформы....')

            self.originURL = f"/image/{self.uuid}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f'\'{self.uuid}\' by {self.loaded_by.username}'


class Tag(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, blank=False, null=False, verbose_name="Название")
    creator = models.ForeignKey(CustomUser, verbose_name="Создал", on_delete=models.SET_NULL, blank=True, null=True)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def get_image_records_count(self):
        return self.image_tags.count()

    def __str__(self):
        return f'{self.title} ({self.get_image_records_count()})'