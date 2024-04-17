import extract_links.extract as extract
import xss_scan.xss_scan as xss
import sql_injection_scan.sql_scan as sql

internal_urls = extract.crawl("https://www.thepythoncode.com", 30)

for url in internal_urls:
    print(xss.scan_xss(url))
    print(sql.scan_sql_injection(url))


xss.scan_xss("https://alf.nu/alert1?world=alert&level=alert0")
sql.scan_sql_injection("https://alf.nu/alert1?world=alert&level=alert0")