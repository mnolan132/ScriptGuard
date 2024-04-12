import extract_links.extract as extract
import xss_scan.xss_scan as xss
import sql_injection_scan.sql_scan as sql

internal_urls = extract.crawl("https://www.thepythoncode.com", 30)

for url in internal_urls:
    print(xss.scan_xss(url))
    print(sql.scan_sql_injection(url))


