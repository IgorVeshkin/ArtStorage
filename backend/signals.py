import os

from django.db.models.signals import post_migrate
from django.dispatch import receiver

from backend.models import CustomUser, Role


@receiver(post_migrate)
def create_initial_records(sender, **kwargs):

    global basic_role

    if not Role.objects.filter(name="Базовый пользователь").exists():
        basic_role = Role.objects.create(name="Базовый пользователь", addImages=True, createPublicCollections=True, addTags=True)

        print('Базовая роль была успешно создана....')

    if not CustomUser.objects.filter(is_superuser=True).exists():

        login, email, password = os.getenv('SUPER_USER_LOGIN'), os.getenv('SUPER_USER_EMAIL'), os.getenv('SUPER_USER_PASSWORD')

        CustomUser.objects.create_superuser(
            username=login,
            email=email,
            password=password,
            role=basic_role if basic_role else Role.objects.get(name="Базовый пользователь")
        )

        print('Супер-пользователь был успешно создан....')


