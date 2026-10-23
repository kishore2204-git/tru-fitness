from rest_framework.routers import DefaultRouter
from .views import PlanViewSet

router = DefaultRouter()
router.register(r'', PlanViewSet, basename='plan')

urlpatterns = router.urls
