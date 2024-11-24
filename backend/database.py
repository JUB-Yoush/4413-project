from env import DB_URI
from mongoengine import connect, DoesNotExist
from mongomock import MongoClient


# with mongoengine, the connection is a global singleton that is managed by the library,
# we don't need to manage or return a variable


def get_database(app):
    print("connecting to database...")
    try:
        print(app, app.config["TESTING"])
        if app and app.config.get("TESTING"):
            connect(
                "test_db", host="mongodb://localhost", mongo_client_class=MongoClient
            )
            print("Created in-memory test database")
        else:
            connect("djwamp", host=DB_URI)
            print("pinged deployment, connected to mongo!")
    except Exception as e:
        print(f"failed to connect to mongo: {e}")


if __name__ == "__main__":
    get_database()
