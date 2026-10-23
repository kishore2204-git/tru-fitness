from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow administrators (or superusers).
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (getattr(request.user, 'role', None) == 'admin' or request.user.is_superuser)
        )


class IsAdminOrStaff(permissions.BasePermission):
    """
    Custom permission to allow admin, staff, or trainer roles (or superusers).
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                getattr(request.user, 'role', None) in ('admin', 'staff', 'trainer')
                or request.user.is_superuser
            )
        )
