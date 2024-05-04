import inspect
import sys
import types
from sqlalchemy.exc import IntegrityError


def is_non_empty_string(var):
    return isinstance(var, str) and len(var)


INVOKED_STACK_INDEX = 2
MODEL_INVOKER_INDEX = 7
INVOKED_METHOD_NAME_INDEX = 3


def get_invoked_method_name():
    return inspect.stack()[INVOKED_STACK_INDEX][INVOKED_METHOD_NAME_INDEX]


def stack_trace():
    for method in inspect.stack():
        print(method[INVOKED_METHOD_NAME_INDEX])


def get_model_invoker():
    return inspect.stack()[MODEL_INVOKER_INDEX][INVOKED_METHOD_NAME_INDEX]


def print_starting_seed(model_name):
    print(f"Seeding {model_name}: ", end="", flush=True)
    
def println_starting_seed(model_name):
    print(f"Seeding {model_name}: ")
    
def print_ending_seed(model_name):
    print(f"{model_name.title()} seeding complete.")


def print_progress(condition, progress_mark="."):
    print(progress_mark, end="" if condition else "\n", flush=True)

# Specifically for python seed.py - All callback functions must return something.
def execute_to_success(callback, progress_condition, limit=sys.maxsize, *args):
    if isinstance(callback, types.FunctionType) and type(limit) is int:
        execution_successful = False
        counter = 0
        return_object = None
        
        while (not execution_successful) and counter < limit:
            try:
                return_object = callback(*args)
                execution_successful = True
                print_progress(progress_condition)
            except (ValueError, IntegrityError) as e:
                print(e)
                print(f"Attempt {counter + 1} out of {limit} failed.")
            finally:
                counter += 1
                if (not execution_successful and counter < limit):
                    print("Trying again!")
        if not execution_successful:
            raise Exception("Execution not successful.")
        return return_object
    else:
        raise ValueError(
            "Callback and limit must be of types function and int respectively."
        )
