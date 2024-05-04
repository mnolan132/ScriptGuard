import requests
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import colorama


# init the colorama module
colorama.init()
GREEN = colorama.Fore.GREEN
GRAY = colorama.Fore.LIGHTBLACK_EX
RESET = colorama.Fore.RESET
YELLOW = colorama.Fore.YELLOW

# initialize the set of links (unique links)
internal_urls = set()
external_urls = set()

# function to validate URLs (not all links in <a> tags are valid)
def is_valid(url):
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)


# function to return all valid URLS that belong to the same website:
def get_all_website_links(url):
    # all URLs of 'url'
    urls = set()
    # domain name of the URL without the protocol
    domain_name = urlparse(url).netloc
    soup = BeautifulSoup(requests.get(url).content, "html.parser")

    for a_tag in soup.findAll("a"):
        href = a_tag.attrs.get("href")
        if href == "" or href is None:
            #href empty tag
            continue

        # join the URL if it's relative (not absolute link)
        href = urljoin(url, href)
        
        parsed_href = urlparse(href)
        # remove URL GET parameters, URL fragments, etc.
        href = parsed_href.scheme + "://" + parsed_href.netloc + parsed_href.path

        if not is_valid(href):
            # not a valid URL
            continue
        if href in internal_urls:
            # already in the set 
            continue
        if domain_name not in href:
            # external link
            if href not in external_urls:
                print(f"{GRAY}[!] External link: {href}{RESET}")
                external_urls.add(href)
            continue
        print(f"{GREEN}[*] Internal link: {href}{RESET}")
        urls.add(href)
        internal_urls.add(href)
    return urls


total_urls_visited = 0 

def crawl(url, max_urls=30):
    # Crawls a web page and extracts all links

    global total_urls_visited
    total_urls_visited += 1
    print(f"{YELLOW}[*] Crawling: {url}{RESET}")
    links = get_all_website_links(url)
    for _ in links:
        if total_urls_visited > max_urls:
            break
    return internal_urls


# if __name__ == "__main__":

#     url = "https://www.thepythoncode.com"
#     max_urls = 30
#     domain_name = urlparse(url).netloc
#     crawl(url, max_urls=max_urls)

#     print("[+] Total Internal links:", len(internal_urls))
#     print("[+] Total External links:", len(external_urls))
#     print("[+] Total URLs:", len(external_urls) + len(internal_urls))
#     print("[+] Total crawled URLs:", max_urls)

#     # save the internal links to a file
#     with open(f"internal_links.txt", "w") as f:
#         for internal_link in internal_urls:
#             print(internal_link.strip(), file=f)

#     # save the external links to a file
#     with open(f"external_links.txt", "w") as f:
#         for external_link in external_urls:
#             print(external_link.strip(), file=f)
#^^^^the above code is for testing purposes