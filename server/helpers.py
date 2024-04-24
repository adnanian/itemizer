import inspect

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