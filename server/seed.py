from config import app, db
from models.models import *
from faker import Faker
from seeds.item_seed import item_seed
import random
from datetime import datetime

fake = Faker()

USER_SEED_SIZE = 15
ITEM_SEED_SIZE = 30
ORG_SEED_SIZE = 8
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
  
def seed_orgs():
  Organization.query.delete()
  orgs = []
  users = User.query.all()
  for n in range(ORG_SEED_SIZE):
    name = fake.company()
    description = fake.sentence()
    org = Organization(
      name=name,
      description=description
    )
    orgs.append(org)
  
  db.session.add_all(orgs)
  db.session.commit()

def seed_memberships():
  Membership.query.delete()
  users = User.query.all()
  orgs = Organization.query.all()
  #members = []
  roles = ['owner', 'admin', 'regular']
  for org in orgs:
    membership_size = random.randint(1, len(users))
    #print(org.id, membership_size)
    user_selection = users[:]
    for n in range(membership_size):
      user = random.choice(user_selection)
      user_selection.remove(user)
      role = roles[0] if n == 0 else roles[random.randint(1,(len(roles)-1))]
      membership = Membership(
        user_id=user.id,
        organization_id=org.id,
        role=role
      )
      try:
        db.session.add(membership)
        db.session.commit()
      except ValueError as e:
        print(e)
        
def seed_assignments():
  Assignment.query.delete()
  items = Item.query.all()
  orgs = Organization.query.all()
  assignments = []
  for org in orgs:
    item_type_count = random.randint(1, len(items))
    item_selection = items[:]
    for n in range(item_type_count):
      item = random.choice(item_selection)
      item_selection.remove(item)
      count = random.randint(0, 10)
      assignment = Assignment(
        item_id = item.id,
        organization_id = org.id,
        count = count
      )
      assignments.append(assignment)
  db.session.add_all(assignments)
  db.session.commit()

if __name__ == "__main__":
    with app.app_context():
      seed_users()
      seed_items()
      seed_orgs()
      seed_memberships()
      seed_assignments()