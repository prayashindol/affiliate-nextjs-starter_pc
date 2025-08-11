import os
import requests
from bs4 import BeautifulSoup

# Optionally load from .env if available during local runs
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

SITE_URL = os.getenv("SITE_URL") or os.getenv("NEXT_PUBLIC_SITE_URL") or "https://strspecialist.com"

index_url = f"{SITE_URL.rstrip('/')}/seo_generator_sitemap_index.xml"
r = requests.get(index_url, timeout=30)
r.raise_for_status()
soup = BeautifulSoup(r.content, 'xml')
sitemaps = [loc.text for loc in soup.find_all('loc')]

all_urls = []
for sitemap_url in sitemaps:
    r = requests.get(sitemap_url, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.content, 'xml')
    urls = [loc.text for loc in soup.find_all('loc')]
    all_urls.extend(urls)

with open('seo_generator_urls.csv', 'w', encoding='utf-8') as f:
    for url in all_urls:
        f.write(url + '\n')

print(f"Exported {len(all_urls)} URLs!")
