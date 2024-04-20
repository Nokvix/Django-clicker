# Generated by Django 5.0.4 on 2024-04-19 16:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Boost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lvl', models.IntegerField(default=1)),
                ('price', models.IntegerField(default=20)),
                ('power', models.IntegerField(default=1)),
                ('core', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.core')),
            ],
        ),
    ]
