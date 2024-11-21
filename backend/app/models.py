from mongoengine import *



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

class User(Document):
    fname = StringField(required=True)
    lname = StringField(required=True)
    email = StringField(required=True)
    password = StringField(required=True)
    # stores the number, expiry, and cvv, one string because I dont' want to ecnrypt and decrypt 3 diff things lol
    cc_info = BinaryField(required=True)
    # credit card decription key, store somewhere safe in the final version
    decryption_key = BinaryField(required=True)
    # purchases = ListField(ReferenceField(Purchase))
    street = StringField(required=True)
    city = StringField(required=True)
    province = StringField(required=True)
    postal_code = StringField(required=True)
    cart = ListField(ReferenceField(Product))

    def update_credit_card(self, new_cc):
        self.cc_info = new_cc
        self.save()

    def __str__(self):
        return self.username

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        del model_json["_id"]
        return model_json


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
    user = ReferenceField(User, required=True)
    purchases = ListField(ReferenceField(Product, required=True))

    def json_formatted(self):
        print(f"serializing {self.__str__}")
        model_json = self.to_mongo().to_dict()
        model_json["id"] = str(model_json["_id"])
        model_json["user"] = user.json_formatted()
        model_json["purchases"] = [purchase.json_formatted() for purchase in purchases]
        del model_json["_id"]
        return model_json
