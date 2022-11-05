from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as OrigUserAdmin
from .models import User, PasswordCodeReset


# Register your models here.
class UserAdmin(OrigUserAdmin):
    list_display = (
        'username', 'email', 'first_name', 'last_name', 'is_staff',
        'subscription'
        )

    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
                )
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
        ('Additional info', {
            'fields': ('subscription',)
        })
    )

    add_fieldsets = (
        (None, {
            'fields': ('username', 'password1', 'password2')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'email')
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
                )
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
        ('Additional info', {
            'fields': ('subscription', )
        })
    )

admin.site.register(User, UserAdmin)

@admin.register(PasswordCodeReset)
class PasswordCodeResetAdmin(admin.ModelAdmin):
    ...