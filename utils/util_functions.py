import requests
from bs4 import BeautifulSoup as bs

def get_all_forms(url):
    # this function returns all forms from HTML content
    soup = bs(requests.get(url).content, "html.parser")
    return soup.find_all("form")

def get_form_details(form):
    # This function extracts all possible useful information about an HTML form

    details = {}
    # get the form action
    action = form.attrs.get("action", "").lower()
    # get the form method (POST, GET, etc)
    method = form.attrs.get("method", "get").lower()
    # get all input details such as type and name
    inputs = []
    for input_tag in form.find_all("input"):
        input_type = input_tag.attrs.get("type", "text")
        input_name = input_tag.attrs.get("name")
        inputs.append({"type": input_type, "name": input_name})
    # put everything to the resulting dictionary
    details["action"] = action
    details["method"] = method
    details["inputs"] = inputs
    return details