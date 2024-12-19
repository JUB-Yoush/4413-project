import pytest
from app import create_app
from ..models import *


@pytest.fixture(scope="module")
def test_client():
    app = create_app(True)

    with app.test_client() as client:
        yield client


@pytest.fixture(scope="module")
def create_user(test_client):
    user_data = {
        "fname": "Wampington",
        "lname": "Mcsus",
        "email": "test_user@domain.com",
        "password": "wamp123",
        "street": "8 wamp avenue",
        "city": "brampton",
        "province": "wamplandia",
        "postal": "W1W1W1",
        "card": "1234123412341234-1212-123",
    }
    response = test_client.post("/signup", json=user_data)
    assert response.status_code == 201
    return user_data


@pytest.fixture(scope="module")
def create_admin(test_client):
    admin_data = {
        "email": "test_admin@domain.com",
        "password": "wamp123",
    }
    response = test_client.post("/admin/signup", json=admin_data)
    assert response.status_code == 201
    return admin_data


@pytest.fixture(scope="module")
def login_user(test_client, create_user):
    login_data = {
        "email": create_user["email"],
        "password": create_user["password"],
    }
    response = test_client.post("/login", json=login_data)
    assert response.status_code == 200
    jwt = response.json["token"]
    assert jwt is not None
    return jwt


@pytest.fixture(scope="module")
def login_admin(test_client, create_admin):
    login_data = {
        "email": create_admin["email"],
        "password": create_admin["password"],
    }
    response = test_client.post("/admin/login", json=login_data)
    assert response.status_code == 200
    jwt = response.json["token"]
    assert jwt is not None
    return jwt


@pytest.fixture(scope="module")
def post_product(test_client, login_admin):
    product_data = {
        "name": "DJ WAMP's Angels Tee",
        "category": "Apparel",
        "brand": "Wamp Collection",
        "album": "Wamp Collection",
        "price": 59.99,
        "description": "DJ Wamp's angels know how to shred on the decks.",
        "image_url": "https://djwamp.s3.us-east-2.amazonaws.com/tee4.png",
        "quantity": 5,
    }
    headers = {"Authorization": f"Bearer {login_admin}"}
    response = test_client.post("/catalog/products", json=product_data, headers=headers)
    id = Product.objects(name=product_data["name"]).first()
    assert response.status_code == 201
    return id


@pytest.fixture(scope="module")
def post_cart(test_client, create_user, login_user, post_product):
    purchase_data = {"product_id": str(post_product.id), "quantity": 1}
    headers = {"Authorization": f"Bearer {login_user}"}
    response = test_client.post("/cart/", json=purchase_data, headers=headers)
    assert response.status_code == 201


"""
NEED 2 FIX
def post_sale(test_client, create_user, login_user, post_product, post_cart):
    headers = {"Authorization": f"Bearer {login_user}"}
    json_body = {
        "use_saved_info":True
    }
    response = test_client.post("/checkout/", json=json_body, headers=headers)
    assert response.status_code == 201
"""
