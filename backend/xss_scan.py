import requests
from pprint import pprint
from urllib.parse import urljoin
import utils as util


def submit_form(form_details, url, value):
    # submits a form given in 'form_details)

    # construct the full URL  (if the URL provided in action is relative)
    target_url = urljoin(url, form_details["action"])
    # get the inputs
    inputs = form_details["inputs"]
    data = {}
    for input in inputs:
        # replace all text and search values with 'value'
        if input["type"] == "text" or input["type"] == "search":
            input["value"] = value
        input_name = input.get("name")
        input_value = input.get("value")
        if input_name and input_value:
            # if input name and input value are not None,
            # then add them to the data of form submission
            data[input_name] = input_value
    
    print(f"[+] Submitting malicious payload to {target_url}")
    print(f"[+] Data: {data}")
    if form_details["method"] == "post":
        return requests.post(target_url, data=data)
    else:
        # GET request
        return requests.get(target_url, params=data)
    
def scan_xss(url):
    # Given a 'url', it prints all XSS vunlerable forms and
    # returns True if any is vulnerable, False otherwise

    # get all forms from the URL
    forms = util.get_all_forms(url)
    print(f"[+] Detected {len(forms)} forms on {url}.")
    js_script = "<Script>alert('hi')</scripT>"
    # returning value
    is_vulnerable = False
    # iterate over all forms
    for form in forms:
        form_details = util.get_form_details(form)
        content = submit_form(form_details, url, js_script).content.decode()
        if js_script in content:
            print(f"[+] XSS Detected on {url}")
            print("[*] Form details:")
            pprint(form_details)
            is_vulnerable = True
            # won't break because it is to print available vulnerable forms
    return is_vulnerable

