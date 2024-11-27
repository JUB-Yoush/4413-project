from mongoengine import *
from cryptography.fernet import Fernet


class Product(Document):
    name = StringField(required=True)
    category = StringField()
    brand = StringField()
    album = StringField()
    price = FloatField()
    description = StringField()
    image_url = StringField()
    quantity = IntField()

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        del model_json["_id"]
        return model_json


# CartItem document that's stored in User's cart
class CartItem(EmbeddedDocument):
    product_id = ReferenceField(Product, required=True)
    quantity = IntField(default=1)

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        cart_items = []

        for item in user.cart_items:
            product = Product.objects.get(id=item.product_id.id)
            cart_items.append(
                {
                    "product_id": str(product.id),
                    "name": product.name,
                    "price": product.price,
                    "total_price": product.price * item.quantity,
                    "quantity": item.quantity,
                    "image_url": product.image_url,
                }
            )
        return cart_items


# class Product(Document):
#     name = StringField(required=True)
#     category = StringField()
#     brand = StringField()
#     album = StringField()
#     price = FloatField()
#     description = StringField()
#     image_url = StringField()
#     quantity = IntField()


# CartItem document that's stored in User's cart
class CartItem(EmbeddedDocument):
    product_id = ReferenceField(Product, required=True)
    quantity = IntField(default=1)


class User(Document):
    fname = StringField(required=True)
    lname = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    # stores the number, expiry, and cvv, one string because I dont' want to ecnrypt and decrypt 3 diff things lol
    cc_info = StringField(required=True)
    # credit card decription key, store somewhere safe in the final version
    decryption_key = StringField(required=True)
    # purchases = ListField(ReferenceField(Purchase))
    street = StringField(required=True)
    city = StringField(required=True)
    province = StringField(required=True)
    postal_code = StringField(required=True)

    # Shopping Cart
    cart_items = ListField(EmbeddedDocumentField(CartItem), default=[])
    cart_total = FloatField(default=0.0)

    def get_credit_card_string(self):
        cipher = Fernet(self.decryption_key.encode("utf-8"))
        return cipher.decrypt(self.cc_info.encode("utf-8")).decode("utf-8")

    def update_credit_card(self, new_cc):
        self.cc_info = new_cc
        self.save()

    def update_cart_total(self):
        """Recalculate total amount that cart costs"""
        total = 0.0
        for item in self.cart_items:
            product = Product.objects.get(id=item.product_id.id)
            total += product.price * item.quantity
        self.cart_total = total
        self.save()

    def __str__(self):
        return self.email

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        del model_json["_id"]
        return model_json

    def update_cart_total(self):
        """Recalculate total amount that cart costs"""
        total = 0.0
        for item in self.cart_items:
            product = Product.objects.get(id=item.product_id.id)
            total += product.price * item.quantity
        self.cart_total = total
        self.save()


class Admin(Document):
    email = StringField(required=True)
    password = StringField(required=True)

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        del model_json["_id"]
        return model_json


class Sale(Document):
    date = DateField(required=True)
    user = ReferenceField(User)
    purchases = ListField(EmbeddedDocumentField(CartItem), required=True)
    approved = BooleanField(required=True)

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        model_json["user"] = User.objects.get(id=self.user)
        model_json["purchases"] = [
            cart_item.json_formatted() for cart_item in purchases
        ]
        del model_json["_id"]
        return model_json


class Purchase(Document):
    date = DateField(required=True)
    user = ReferenceField(User, required=True)
    product = ReferenceField(Product, required=True)
    price = FloatField(required=True)
    # {product_id:quantity}
    quantity = DictField()
