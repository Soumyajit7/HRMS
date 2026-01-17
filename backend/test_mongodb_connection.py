# test_mongo_atlas.py
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError, OperationFailure
import sys

# Your real connection string
MONGODB_URI = (
    "mongodb+srv://dev_user:zzvQ1686CI7IN5zf@"
    "freecluster.sbg2z.mongodb.net/"
    "hrms_lite?retryWrites=true&w=majority"
)

def test_atlas_connection(uri: str):
    print("Testing MongoDB Atlas connection...")
    # Hide password in output for safety
    hidden_uri = uri.replace("zzvQ1686CI7IN5zf", "***")
    print(f"URI: {hidden_uri}\n")

    try:
        # Create client with reasonable timeouts
        client = MongoClient(
            uri,
            serverSelectionTimeoutMS=7000,   # Fail fast if cluster unreachable
            connectTimeoutMS=10000,
            socketTimeoutMS=20000
        )

        # This command actually verifies the connection works
        client.admin.command('ping')

        print("SUCCESS: Connection to MongoDB Atlas is working!")
        print("Ping response received from server.")

        # Optional: show databases and collections in your DB
        dbs = client.list_database_names()
        print("\nDatabases found:", dbs)

        if "hrms_lite" in dbs:
            db = client["hrms_lite"]
            cols = db.list_collection_names()
            print(f"Collections in 'hrms_lite': {cols or '[empty database]'}")
        else:
            print("Database 'hrms_lite' not found yet (normal for new DB)")

    except ConfigurationError as e:
        print("ConfigurationError → something wrong with connection string format")
        print(e)
        sys.exit(1)

    except ConnectionFailure as e:
        print("ConnectionFailure → cannot reach the cluster")
        print("Most common causes:")
        print("  • Your IP address is NOT whitelisted in Atlas Network Access")
        print("  • Cluster is paused or deleted")
        print("  • Wrong cluster name in URI")
        print("  • Network/firewall/VPN issue")
        print(f"Error details: {e}")
        sys.exit(1)

    except OperationFailure as e:
        print("OperationFailure → authentication or permission problem")
        print("Check:")
        print("  • Username: dev_user")
        print("  • Password: zzvQ1686CI7IN5zf")
        print("  • User has correct roles (at least readWrite on hrms_lite)")
        print(f"Error: {e}")
        sys.exit(1)

    except Exception as e:
        print("Unexpected error:", type(e).__name__, str(e))
        sys.exit(1)

    finally:
        if 'client' in locals():
            client.close()
            print("\nConnection closed safely.")

if __name__ == "__main__":
    test_atlas_connection(MONGODB_URI)