from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from backend.models import CustomUser, Role, Image, Tag


# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Измененная модель Пользователь"""

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "role",

    )
    list_filter = ("username", 'role', )

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ('Personal info', {"fields": ("last_name", "first_name", "email",)}),
        (
            'Permissions',
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ('Important dates', {"fields": ("last_login", "date_joined")}),

        ('Роль', {'fields': ('role',)}),
    )

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "addImages",
        "createPublicCollections",
        "addTags",
        "create_date",
        "update_date",

    )
    list_filter = ("name", )

@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('image', 'loaded_by', 'originURL', 'create_date', 'update_date',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("title", "title_slug", "creator", "create_date",)
    prepopulated_fields = {"title_slug": ("title",)}