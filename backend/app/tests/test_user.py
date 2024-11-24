import pytest
from ..models import *


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


"""
def test_sale_post(test_client):
    admin_data ={
        "email":"sudowamp@domain.com",
        "password":"wamp123"
    }
    user_data = {
        "fname": "wampington",
        "lname": "Mcsus",
        "email": "testsalepost@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    login_data = {
        "email": "testsalepost@domain.com",
        "password": "wamp123",
    }
    product_data = {
    "name":"DJ WAMP's Angels Tee",
    "category": "Apparel",
    "brand": "Wamp Collection",
    "album": "Wamp Collection",
    "price": 59.99,
    "description":"DJ Wamp's angels know how to shred on the decks.",
    "image_url":"https://djwamp.s3.us-east-2.amazonaws.com/tee4.png",
    "quantity":5
    }
    #user signup
    response = test_client.post("/signup", json=user_data)
    #admin signup
    response = test_client.post("/admin/signup", json=admin_data)

    response = test_client.post("/admin/login", json=admin_data)
    jwt = response.json["token"]
    headers = {"Authorization": f"Bearer {jwt}"}
    response = test_client.post("/products", json=product_data, headers=headers)
    assert response.status_code == 201
    response = test.client.post("/sale")
"""

def test_get_cart(test_client, create_user, login_user):
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.get("/cart/", headers=headers)
    assert response.status_code == 200
    user = User.objects(email=create_user["email"]).first()
    cart = [item.json_formatted() for item in user.cart_items]
    assert response.json["items"] == cart