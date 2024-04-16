from config import app, db
from models.models import *
from faker import Faker

fake = Faker()

USER_SEED_SIZE = 10
PASSWORD = "Green+1234"


if __name__ == "__main__":
  with app.app_context():
    
    """_
      Seeding of 10 sample users. They will all have the same password
      to make it easier to test the code._
    """
    User.query.delete()
    
    users = []
    
    for i in range(USER_SEED_SIZE):
      first_name = fake.first_name()
      last_name = fake.last_name()
      number = fake.random_number(digits=4)
      username = (first_name[0]+last_name).lower() + str(number)
      email = (first_name + "." + last_name).lower() + str(number) + "@itemizer.com"
      user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email
      )
      user.password_hash = PASSWORD
      users.append(user)
      #print(user)
    
    db.session.add_all(users)
    db.session.commit()