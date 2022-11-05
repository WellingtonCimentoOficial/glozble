from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from subscriptions.models import Subscription
from utils import global_variables
import re

# Create your models here.
class User(AbstractUser):
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True)

    def check_first_name(self):
        if re.search(r'\d', self.first_name) is None and re.search(r'\W', self.first_name) is None and re.search(r'.{1,20}', self.first_name) is not None and re.search(r'.{21}', self.first_name) is None:
            return True
        else:
            return False

    def check_last_name(self):
        if re.search(r'\d', self.last_name) is None and re.search(global_variables.SPECIAL_CHARACTERS_NO_SPACE, self.last_name) is None and re.search(r'.{1,50}', self.last_name) is not None and re.search(r'.{51}', self.last_name) is None:
            return True
        else:
            return False

    def check_good_user(self):
        if re.search(r"\W", self.username) is None and re.search(r"[A-Z]", self.username) is None and re.search(r".{5,20}", self.username) is not None and re.search(r".{21}", self.username) is None:
            return True
        else:
            return False

    def check_email(self):
        if re.search(global_variables.EMAIL_REGEX, self.email) is not None and re.search(r"\s", self.email) is None:
            return True
        else:
            return False

    def check_good_password(self):
        if re.search(r"[a-z]", str(self.password)) is not None and re.search(r"[A-Z]", str(self.password)) is not None and re.search(r"\W", str(self.password)) is not None and re.search(r"\d", str(self.password)) is not None and re.search(r".{8,64}", str(self.password)) is not None and re.search(r".{65}", str(self.password)) is None:
            return True
        else:
            return False

    def __str__(self):
        return self.first_name + " " + self.last_name

class PasswordCodeReset(models.Model):
    code = models.IntegerField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Código Reset Password"
        verbose_name_plural = "Códigos Reset Passwords"

    def is_expired(self):
        now = timezone.now()
        duration = now - self.created_at
        duration_seconds = duration.total_seconds()
        time_duration_limit = (60*60*24) * 1 # Tempo de duração em segundos do código
        if duration_seconds > time_duration_limit:
            return True
        return False

    def __str__(self):
        return str(self.code)