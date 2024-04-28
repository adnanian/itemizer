from config import app, db
from models.models import *
from faker import Faker
from seeds.item_seed import item_seed
from helpers import print_starting_seed, print_progress
import random
import traceback

fake = Faker()

USER_SEED_SIZE = 100
""" Number of users that will be generated."""

MIN_USERNAME_LENGTH = 8
"""Usernames must be at least eight characters in length."""

DEFAULT_NUMBER_LENGTH = int(MIN_USERNAME_LENGTH / 2)
"""
  Each username will have a certain number of digits after their first initial and last name.
  The default is 4, but may have more digits if the user's name is too short.
"""

ITEM_SEED_SIZE = 30
"""Number of items that will be generated. See seeds/item_seed.py"""

ORG_SEED_SIZE = 53
"""Number of organizations that will be generated."""

REQUEST_SEED_LIMIT = 10
""" Maximum number of requests that will be generated per organization.
    This is only for the seed. This limit is not applied in actual run time of
    the web application.
"""

PASSWORD = "Green+1234"
"""All seeded users will have the same password for the purposes of testing this application in the development phase."""


def clear_tables():
    """
        Delete all items from the tables before recreating the seeds.
    """
    print("Deleting old data.")
    User.query.delete()
    Item.query.delete()
    Organization.query.delete()
    Membership.query.delete()
    Assignment.query.delete()
    Request.query.delete()
    print("Old data deletion complete.")

def seed_users():
    """
        Seeds 10 users; all users will have the same password for easier code testing.
    """
    #User.query.delete()
    users = []
    print_starting_seed("users")
    for i in range(USER_SEED_SIZE):
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = (initials := (first_name[0] + last_name).lower()) + (
            number := str(
                fake.random_number(
                    digits=(
                        DEFAULT_NUMBER_LENGTH
                        if len(initials) >= DEFAULT_NUMBER_LENGTH
                        else MIN_USERNAME_LENGTH - len(initials)
                    )
                )
            ).rjust(DEFAULT_NUMBER_LENGTH, '0')
        )
        email = (first_name + "." + last_name).lower() + number + "@itemizer.com"
        user = User(
            first_name=first_name, last_name=last_name, username=username, email=email
        )
        user.password_hash = PASSWORD
        users.append(user)
        # print(user)
        print_progress(i < USER_SEED_SIZE - 1)

    db.session.add_all(users)
    db.session.commit()
    print("User seed complete.")


def seed_items():
    """
        Seeds 30 items, which are pre-defined in a separate module.
    """
    #Item.query.delete()
    items = []
    print_starting_seed("items")
    for key, value in (my_items := item_seed.items()):
        part_number = (
            "".join([fake.random_uppercase_letter() for n in range(4)])
            + "-"
            + str(fake.random_number(digits=5))
        )
        item = Item(
            name=key,
            description=value["description"],
            part_number=part_number,
            image_url=value["image_url"],
        )
        # print(item)
        items.append(item)
        print(".", end="")
    print()
    db.session.add_all(items)
    db.session.commit()
    print("Item seed complete.")


def seed_orgs():
    """
        Seeds 53 organizations.
    """
    #Organization.query.delete()
    orgs = []
    print_starting_seed("organizations")
    for n in range(ORG_SEED_SIZE):
        name = fake.company()
        description = fake.sentence()
        org = Organization(name=name, description=description)
        orgs.append(org)
        print_progress(n < ORG_SEED_SIZE - 1)

    db.session.add_all(orgs)
    db.session.commit()
    print("Organization seed complete.")


def seed_memberships():
    """
        For each organization, a random number of memberships will be assigned to
        a random selection of users.
    """
    #Membership.query.delete()
    users = User.query.all()
    orgs = Organization.query.all()
    # members = []
    roles = ["owner", "admin", "regular"]
    print_starting_seed("memberships")
    for org in orgs:
        membership_size = random.randint(1, len(users))
        # print(org.id, membership_size)
        user_selection = users[:]
        for n in range(membership_size):
            user = random.choice(user_selection)
            user_selection.remove(user)
            role = roles[0] if n == 0 else roles[random.randint(1, (len(roles) - 1))]
            membership = Membership(user_id=user.id, organization_id=org.id, role=role)
            try:
                db.session.add(membership)
                db.session.commit()
            except ValueError as e:
                print(e)
            finally:
                print_progress(n < membership_size - 1)
    print("Membership seed complete.")


def seed_assignments():
    """
        For each organization, a random selection of items will be assigned to it,
        seeding the item assignments in the process.
    """
    #Assignment.query.delete()
    items = Item.query.all()
    orgs = Organization.query.all()
    assignments = []
    print_starting_seed("assignments")
    for org in orgs:
        item_type_count = random.randint(1, len(items))
        item_selection = items[:]
        for n in range(item_type_count):
            item = random.choice(item_selection)
            item_selection.remove(item)
            count = random.randint(0, 10)
            assignment = Assignment(
                item_id=item.id, organization_id=org.id, count=count
            )
            assignments.append(assignment)
            print_progress(n < item_type_count - 1)
    db.session.add_all(assignments)
    db.session.commit()
    print("Assignment seed complete.")
    
def seed_requests():
    """
        For each organization, a random number of membership requests will be generated
        for a random selection of users.
    """
    #Request.query.delete()
    users = User.query.all()
    user_ids = [user.id for user in users]
    orgs = Organization.query.all()
    # requests = []
    print_starting_seed("requests")
    for org in orgs:
        member_user_ids = [membership.user_id for membership in  org.memberships]
        non_member_user_ids = list(filter(lambda user_id: user_id not in member_user_ids, user_ids))
        #print(len(non_member_user_ids))
        #print(non_members)
        if not len(non_member_user_ids):
            continue
        request_count = random.randint(1, min(REQUEST_SEED_LIMIT, len(non_member_user_ids)))
        #print(f"Org Id={org.id}, RequestSize={request_count}, NonMembers={len(non_member_user_ids)}")
        for n in range(request_count):
            #print(f"({n},{len(non_member_user_ids)})")
            user_id = random.choice(non_member_user_ids)
            non_member_user_ids.remove(user_id)
            #print(user_id)
            request = Request(
                user_id=user_id,
                organization_id=org.id,
                reason_to_join=fake.sentence()
            )
            try:
                db.session.add(request)
                db.session.commit()
            except ValueError as e:
                print(e)
            finally:
                pass
                print_progress(n < request_count - 1)
        
    print("Request seed complete.")
    
if __name__ == "__main__":
    with app.app_context():
        print("BEGIN SEED")
        done = False
        limit = 1
        attempt_number = 0
        while (not done and attempt_number < limit):
            try:
                clear_tables()
                seed_users()
                seed_items()
                seed_orgs()
                seed_memberships()
                seed_assignments()
                seed_requests()
                done = True
            except Exception as e:
                traceback.print_exc()
                print("An error occurred.")
            finally:
                attempt_number += 1
        print("Seeding complete!")
