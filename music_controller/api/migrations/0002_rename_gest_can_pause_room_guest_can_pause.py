# Generated by Django 3.2.3 on 2021-05-29 19:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='gest_can_pause',
            new_name='guest_can_pause',
        ),
    ]