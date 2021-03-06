# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-24 10:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20170424_0933'),
    ]

    operations = [
        migrations.AddField(
            model_name='scanevent',
            name='database',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.PiDatabase'),
        ),
        migrations.AlterField(
            model_name='pidatabase',
            name='name',
            field=models.TextField(unique=True),
        ),
        migrations.AlterField(
            model_name='scanevent',
            name='file_name',
            field=models.TextField(null=True),
        ),
    ]
