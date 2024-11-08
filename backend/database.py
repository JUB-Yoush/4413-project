from env import DB_URI
from mongoengine import connect, DoesNotExist


# with mongoengine, the connection is a global singleton that is managed by the library,
# we don't need to manage or return a variable


def get_database():
    print("CONNECTING TO DATABASE...")
    try:
        connect("djwamp", host=DB_URI)
        print("Pinged Deployment, Connected to Mongo!")
    except Exception as e:
        print(f"Failed to connect to Mongo: {e}")


if __name__ == "__main__":
    get_database()
