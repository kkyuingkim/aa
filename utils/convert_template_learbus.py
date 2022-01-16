import glob, re, os, hashlib
from urllib.parse import urlparse
from urlextract import URLExtract
from requests import get

extractor = URLExtract()
TAG_DICT = {".css": "css", ".js": "js", ".swf": "swf", ".png": "img", ".jpg": "img", ".JPG": "img", ".gif": "img"}

APP_NAME = "search"
APP_STATIC_DIR = f"{APP_NAME}/static"
APP_TEMPLATE_DIR = f"{APP_NAME}/templates"

first_load_static = "{% load static %}\n"
prefix = r"{" + f"% static '{APP_NAME}/assets/"
surfix = r"' %}"

def download(url, type, file_name=''):
    try:
        response = get(url)
        if file_name.find('.') < 0:
            file_name = response.url.split('/')[-1]
        asset_dir = f"{APP_STATIC_DIR}/{APP_NAME}/assets/{type}"
        if not os.path.isdir(asset_dir):
            os.makedirs(asset_dir)
        asset_file = f"{asset_dir}/{file_name}"
        with open(asset_file, "wb") as file:   # open in binary mode
            file.write(response.content)      # write to file
    except Exception as e:
        print(url, e)        
        
path = f"{APP_TEMPLATE_DIR}/{APP_NAME}/*.html"
file_list = glob.glob(path)
for file_name in file_list:
    if file_name.find('.html.html') >= 0:
        continue
    with open(file_name, 'r', encoding="utf-8") as ff:
        lines = ff.readlines()
        for index, line in enumerate(lines):
            line = line.replace(' ', '____')
            line = line.replace(r'href="//', r'href="https://')     # 불완전하게 사용되고 있는 http를 고쳐놓음
            
            # https:~.css, https:~.js, https:~.swf, https:!png,jpg 문장에 파일을 다운로드하고 static를 변환을 함
            static_processed = False
            for key, value in TAG_DICT.items():
                if line.find("https") >= 0 and line.find(key) >= 0 and line.find("https") < line.find(key):
                    https_list = extractor.find_urls(line)
                    for ii, org_https in enumerate(https_list):
                        if org_https.find(key) >= 0:
                            src_https = org_https.replace("____", "%20")
                            http_file = src_https.split('/')[-1]    # /blabla.css?v=1.0
                            http_file = http_file.split('?')[0]
                            download(src_https, value, http_file)
                            tgt_https = f"{prefix}{value}/{http_file}{surfix}"
                            line = line.replace(org_https, tgt_https)
                            static_processed = True

            # 추가적인 javascript 추출
            if not static_processed and line.find("javascript") >= 0 and line.find("src=") >= 0 and line.find("javascript") < line.find("src="):
                https_list = extractor.find_urls(line)
                for ii, org_https in enumerate(https_list):
                    src_https = org_https.replace("____", "%20")
                    value = "js"
                    http_file = src_https.split('/')[-1]    # /blabla.css?v=1.0
                    http_file = http_file.split('?')[0]
                    if http_file.find('js') < 0: 
                        http_file += ".js"
                    download(src_https, value, http_file)
                    tgt_https = f"{prefix}{value}/{http_file}{surfix}"
                    line = line.replace(org_https, tgt_https)
                    static_processed = True
                            
            # 추가적인 img 추출
            if not static_processed and line.find("img") >= 0 and line.find("src=") >= 0 and line.find("img") < line.find("src="):
                https_list = extractor.find_urls(line)
                for ii, org_https in enumerate(https_list):
                    src_https = org_https.replace("____", "%20")
                    value = "img"
                    hasher = hashlib.md5()
                    hasher.update(src_https.encode('utf-8'))
                    http_file = f"{hasher.hexdigest()}.png"
                    download(src_https, value, http_file)
                    tgt_https = f"{prefix}{value}/{http_file}{surfix}"
                    line = line.replace(org_https, tgt_https)
            lines[index] = line.replace('____', ' ')
            
            
        data = ''.join(lines)
    file_name += ".html"
    with open(file_name, 'w', encoding="utf-8") as ff:
        ff.write(first_load_static)
        ff.write(data)

print("finished!!")
