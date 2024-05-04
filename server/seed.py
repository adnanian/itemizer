from config import app, db
from models.models import *
from faker import Faker
from seeds.item_seed import item_seed
from helpers import (
    print_starting_seed,
    println_starting_seed,
    print_ending_seed,
    print_progress,
    execute_to_success,
)
import random
import time

# import traceback

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

MAX_COUNT = 10
"""Maximum count of an assigned item for the seed."""

REQUEST_SEED_LIMIT = 25
""" Maximum number of requests that will be generated per organization.
    This is only for the seed. This limit is not applied in actual run time of
    the web application.
"""

PASSWORD = "Green+1234"
"""All seeded users will have the same password for the purposes of testing this application in the development phase."""

ATTEMPT_LIMIT = 5
"""The number of times that the execute_to_success helper function will execute."""


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
    # User.query.delete()
    users = []
    print_starting_seed("users")
    for i in range(USER_SEED_SIZE):
        user = execute_to_success(create_user, i < USER_SEED_SIZE - 1, ATTEMPT_LIMIT)
        users.append(user)
        # print(user)

    db.session.add_all(users)
    db.session.commit()
    print_ending_seed("users")


def create_user():
    """Creates a new instance of User and returns it.

    Returns:
        User: a new instance of User.
    """
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
        ).rjust(DEFAULT_NUMBER_LENGTH, "0")
    )
    email = (first_name + "." + last_name).lower() + number + "@itemizer.com"
    user = User(
        first_name=first_name, last_name=last_name, username=username, email=email
    )
    user.password_hash = PASSWORD
    return user


def seed_items():
    """
    Seeds 30 items, which are pre-defined in a separate module.
    """
    # Item.query.delete()
    items = []
    print_starting_seed("items")
    for key, value in item_seed.items():
        item = execute_to_success(create_item, True, ATTEMPT_LIMIT, key, value)
        # print(item)
        items.append(item)
    print()
    db.session.add_all(items)
    db.session.commit()
    print_ending_seed("items")


def create_item(key, value):
    """Creates a new instance of Item and returns it.

    Args:
        key (str): the item name
        value (dict): the dictionary consiting of the dictionary and image url's.

    Returns:
        Item: a new instance of Item.
    """
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
    return item


def seed_orgs():
    """
    Seeds 53 organizations.
    """
    # Organization.query.delete()
    orgs = []
    print_starting_seed("organizations")
    for n in range(ORG_SEED_SIZE):
        org = execute_to_success(create_org, n < ORG_SEED_SIZE - 1, ATTEMPT_LIMIT)
        orgs.append(org)

    db.session.add_all(orgs)
    db.session.commit()
    print_ending_seed("organizations")


def create_org():
    """Creates a new instance of Organization and returns it.

    Returns:
        Organization: a new instance of Organization.
    """
    name = fake.company()
    description = fake.sentence()
    org = Organization(name=name, description=description)
    return org


def seed_relational_models():
    """Seeds Memberships, Assignments, and Requests, by establishing randomized relations with Users, Items, and Organizations."""
    users = User.query.all()
    items = Item.query.all()
    orgs = Organization.query.all()
    roles = ["owner", "admin", "regular"]
    println_starting_seed("memberships")
    println_starting_seed("assignments")
    println_starting_seed("requests")
    for org in orgs:
        # Memberships
        membership_size = random.randint(1, len(users))
        # Assignments
        assignment_size = random.randint(1, len(items))
        # Requests
        non_member_size = len(users) - membership_size
        max_request_size = (
            non_member_size
            if non_member_size < REQUEST_SEED_LIMIT
            else REQUEST_SEED_LIMIT
        )
        request_size = random.randint(0, max_request_size)
        # Randomization
        user_selection = users[:]
        item_selection = items[:]
        print(f"Populating Org #{org.id}: (M={membership_size}, A={assignment_size}, R={request_size})", end="\t", flush=True)
        for n in range(membership_size):
            user = random.choice(user_selection)
            user_selection.remove(user)
            role = roles[0] if n == 0 else roles[random.randint(1, (len(roles) - 1))]
            membership = Membership(user_id=user.id, organization_id=org.id, role=role)
            db.session.add(membership)
            print_progress(True, "M")

        for n in range(assignment_size):
            item = random.choice(item_selection)
            item_selection.remove(item)
            count = random.randint(0, MAX_COUNT)
            assignment = Assignment(
                item_id=item.id, organization_id=org.id, count=count
            )
            db.session.add(assignment)
            print_progress(n < assignment_size - 1 or request_size > 0, "A")

        for n in range(request_size):
            user = random.choice(user_selection)
            user_selection.remove(user)
            request = Request(
                user_id=user.id, organization_id=org.id, reason_to_join=fake.sentence()
            )
            db.session.add(request)
            print_progress(n < request_size - 1, "R")

    db.session.commit()
    print_ending_seed("memberships")
    print_ending_seed("assignments")
    print_ending_seed("requests")


if __name__ == "__main__":
    with app.app_context():
        start_time = time.time()
        print("BEGIN SEED")
        # done = False
        # limit = 1
        # attempt_number = 0
        clear_tables()
        seed_users()
        seed_items()
        seed_orgs()
        seed_relational_models()
        """
        while (not done and attempt_number < limit):
            try:
                clear_tables()
                seed_users()
                seed_items()
                seed_orgs()
                seed_relational_models()
                #seed_memberships()
                #seed_assignments()
                #seed_requests()
                done = True
            except Exception as e:
                traceback.print_exc()
                print("An error occurred.")
            finally:
                attempt_number += 1
        """
        print("Seeding complete!")
        end_time = time.time()
        print(f"Seeding duration: {end_time - start_time} seconds.")
