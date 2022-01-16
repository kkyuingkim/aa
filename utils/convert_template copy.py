import glob, re
from urllib.parse import urlparse
from urlextract import URLExtract

extractor = URLExtract()
TAG_DICT = {".css": "css", ".js": "js", ".swf": "swf", ".png": "img", ".jpg": "img", ".gif": "img"}

first_load_static = "{% load static %}\n"
prefix = r"{% static 'search/assets/"
surfix = r"' %}"

path = "search/templates/search/*.html"
file_list = glob.glob(path)
for file_name in file_list:
    with open(file_name, 'r', encoding="utf-8") as ff:
        lines = ff.readlines()
        for index, line in enumerate(lines):
            for key, value in TAG_DICT.items():
                # if key.find(".png") >= 0 and line.find(key) >= 0:
                #     print(line)
                if line.find("http") >= 0 and line.find(key) >= 0 and line.find("http") < line.find(key) >= 0:
                    line = line.replace(' ', '____')
                    https_list = extractor.find_urls(line)
                    for ii, src_https in enumerate(https_list):
                        if src_https.find(key) >= 0:
                            http_file = src_https.split('/')[-1]
                            tgt_https = f"{prefix}{value}/{http_file}{surfix}"
                            line = line.replace(src_https, tgt_https)
                            line = line.replace('____', ' ')
                            lines[index] = line.replace('____', ' ')
        data = ''.join(lines)
    file_name += ".html"
    with open(file_name, 'w', encoding="utf-8") as ff:
        ff.write(first_load_static)
        ff.write(data)

print("finished!!")
