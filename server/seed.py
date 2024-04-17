from config import app, db
from models.models import *
from faker import Faker
from seeds.item_seed import item_seed

fake = Faker()

USER_SEED_SIZE = 10
ITEM_SEED_SIZE = 30
PASSWORD = "Green+1234"

"""
  Seeds 10 users; all users will have the same password for easier code testing.
"""
def seed_users():
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
    # print(user)

  db.session.add_all(users)
  db.session.commit()
    
def seed_items():
  Item.query.delete()
  items = []
  for (key, value) in item_seed.items():
    part_number = ''.join([fake.random_uppercase_letter() for n in range(4)]) + "-" + str(fake.random_number(digits=5))
    item = Item(
      name=key,
      description=value["description"],
      part_number=part_number,
      image_url=value["image_url"]
    )
    #print(item)
    items.append(item)
    
  db.session.add_all(items)
  db.session.commit()

if __name__ == "__main__":
    with app.app_context():
      seed_users()
      seed_items()