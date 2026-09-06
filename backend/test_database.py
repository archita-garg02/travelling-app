from sqlalchemy import text

from app.database import engine


def test_connection():
    with engine.connect() as connection:
        database_name = connection.execute(
            text("SELECT DATABASE()")
        ).scalar()

        print("Database connected successfully")
        print("Connected database:", database_name)


if __name__ == "__main__":
    test_connection()