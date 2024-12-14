import pytest
import mongomock
from mongomock import MongoClient
from flask import json
from mongoengine import connect, disconnect
from mongoengine import Document, StringField
from app import create_app
from ..models import *
from ..auth.session import get_user_from_token


# USER
def test_get_user(test_client, create_user, login_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get("/user/", headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()
    assert response.json["user"] == user.json_formatted()


def test_patch_user(test_client, login_user, create_user, create_admin, login_admin):
    # user modification
    headers = {"Authorization": f"Bearer {login_user}"}
    changed_json = {"fname": "Wampette"}
    response = test_client.patch("/user/", json=changed_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()

    assert user.fname == changed_json["fname"]


def test_patch_user_admin(
    test_client, login_user, create_user, create_admin, login_admin
):
    # admin modification
    headers = {"Authorization": f"Bearer {login_admin}"}
    changed_json = {
        "email": "test_user@domain.com",
        "fname": "Wampington",
    }
    response = test_client.patch("/user/", json=changed_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()

    assert user.fname == changed_json["fname"]


def test_patch_card(test_client, login_user, create_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    patch_json = {"card": "4321432143214321-4343-432"}
    response = test_client.patch("/user/cc", json=patch_json, headers=headers)
    assert response.status_code == 201
    user = User.objects(email=create_user["email"]).first()
    assert patch_json["card"] == user.get_credit_card_string()


def test_query_user(test_client, create_user, create_admin, login_admin):
    headers = {"Authorization": f"Bearer {login_admin}"}
    response = test_client.get("/user/users?fname=Wampington", headers=headers)
    assert response.status_code == 201
    assert "Wampington" == response.json["users"][0]["fname"]


# CART
def test_get_cart(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get("/cart/", headers=headers)
    assert response.status_code == 200
    cartitem = response.json["items"]
    assert cartitem[0]["name"] == "DJ WAMP's Angels Tee"


def test_patch_cart(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    request_json = {"quantity": 2}
    response = test_client.patch(
        f"/cart/{post_product.id}", json=request_json, headers=headers
    )
    assert response.status_code == 200
    response = test_client.get("/cart/", headers=headers)
    assert response.status_code == 200
    cartitem = response.json["items"]
    assert cartitem[0]["quantity"] == 2


def test_delete_cart(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.delete(f"/cart/{post_product.id}", headers=headers)
    assert response.status_code == 200
    response = test_client.get("/cart/", headers=headers)
    assert response.status_code == 200
    cartitem = response.json["items"]
    assert len(cartitem) == 0


# Catalog


def test_query_products(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get(
        "/catalog/products?name=DJ%20WAMP's%20Angels%20Tee", headers=headers
    )
    assert response.status_code == 201
    assert response.json["products"][0]["name"] == "DJ WAMP's Angels Tee"


def test_patch_products(
    test_client,
    create_user,
    login_user,
    create_admin,
    login_admin,
    post_product,
    post_cart,
):
    headers = {"Authorization": f"Bearer {login_admin}"}
    json_body = {"name": "DJ SUS's Angels Tee"}
    response = test_client.patch(
        f"/catalog/products/{post_product.id}", headers=headers, json=json_body
    )
    assert response.status_code == 201
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get(f"/catalog/products/{post_product.id}", headers=headers)
    assert response.json["name"] == json_body["name"]


def test_checkout(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    json_body = {"use_saved_info": True}
    response = test_client.post("/checkout/", json=json_body, headers=headers)
    assert response.status_code == 201
