import pytest
import mongomock
from mongomock import MongoClient
from flask import json
from mongoengine import connect, disconnect
from mongoengine import Document, StringField
from app import create_app
from ..models import *
from ..auth.session import get_user_from_token


def test_get_user(test_client, create_user, login_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get("/user/", headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()
    assert response.json["user"] == user.json_formatted()


def test_patch_user(test_client, login_user, create_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    changed_json = {"fname": "wampette", "lname": "LeSus"}
    response = test_client.patch("/user/", json=changed_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()

    assert user.fname == changed_json["fname"]
    assert user.lname == changed_json["lname"]


def test_patch_card(test_client, login_user, create_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    patch_json = {"card": "4321432143214321-4343-432"}
    response = test_client.patch("/user/cc", json=patch_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()
    assert patch_json["card"] == user.get_credit_card_string()
