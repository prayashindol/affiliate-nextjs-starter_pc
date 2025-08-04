import requests
from bs4 import BeautifulSoup

index_url = "https://strspecialist.com/seo_generator_sitemap_index.xml"
r = requests.get(index_url)
soup = BeautifulSoup(r.content, 'xml')
sitemaps = [loc.text for loc in soup.find_all('loc')]

all_urls = []
for sitemap_url in sitemaps:
    r = requests.get(sitemap_url)
    soup = BeautifulSoup(r.content, 'xml')
    urls = [loc.text for loc in soup.find_all('loc')]
    all_urls.extend(urls)

with open('seo_generator_urls.csv', 'w') as f:
    for url in all_urls:
        f.write(url + '\n')

print(f"Exported {len(all_urls)} URLs!")
