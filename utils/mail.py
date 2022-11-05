from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_email(subject, template, context, from_email, to_emails):
    subject = subject
    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    to = to_emails
    send_mail(subject, plain_message, from_email, to, html_message=html_message, fail_silently=True)