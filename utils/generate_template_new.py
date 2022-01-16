# python ./utils/generate_template_new.py --app_name=clipliner --is_bss=True

import glob, re, os, hashlib, argparse, shutil
from urllib.parse import urlparse
from urlextract import URLExtract
from requests import get
from datetime import datetime

TAG_DICT = {".css": "css", ".js": "js", ".swf": "swf", ".png": "img", ".jpg": "img", ".JPG": "img", ".gif": "img"}

# opt.is_bss :
# 부트스트랩스튜디오에서 작성된 파일을 Convert하는지 여부
# True : BSS에서 생성된 assets 폴더를 {opt.app_name}/static/{opt.app_name}/ 폴더에 가져다 놓고, 
# 탬플릿 파일(*.html)들은 {opt.app_name}/templates/{opt.app_name}/ 폴더에 가져다 놓은 후 --is_bss=True로 실행 
# False : 탬플릿 파일(*.html)들을 {opt.app_name}/templates/{opt.app_name}/ 폴더에 가져다 놓은 후 --is_bss=True로 실행하면 
# css, js, png, jpg등과 같은 static 파일들을 {opt.app_name}/static/{opt.app_name}/ 하위 폴더에 자동으로 내려받아 줌 

def str2bool(v): 
    if isinstance(v, bool): 
        return v 
    if v.lower() in ('yes', 'true', 't', 'y', '1'): 
        return True 
    elif v.lower() in ('no', 'false', 'f', 'n', '0'): 
        return False 
    else: 
        raise argparse.ArgumentTypeError('Boolean value expected.')

def folderfind(search_dir, sub_folder, search_file):
    searched_file = str()
    full_path = f"{BASE_DIR}/{opt.app_name}/{search_dir}"
    for (root, dirs, files) in os.walk(full_path):
        for file_name in files:
            if root.find(sub_folder) >= 0 and file_name == search_file:
                searched_file = root.replace(f"{BASE_DIR}/{opt.app_name}/static/", "")
                break
        if searched_file != "":
            break
    return searched_file

def download(url, type, file_name=''):
    try:
        response = get(url)
        if file_name.find('.') < 0:
            file_name = response.url.split('/')[-1]
        asset_dir = f"{APP_STATIC_DIR}/{opt.app_name}/assets/{type}"
        if not os.path.isdir(asset_dir):
            os.makedirs(asset_dir)
        asset_file = f"{asset_dir}/{file_name}"
        with open(asset_file, "wb") as file:   # open in binary mode
            file.write(response.content)      # write to file
    except Exception as e:
        print(url, e)        

def main():        
    path = f"{APP_TEMPLATE_DIR}/{opt.app_name}/*.html"
    file_list = glob.glob(path)
    for file_name in file_list:
        if file_name.find('.html.html') >= 0:
            # 히스토리 폴더에 파일을 복사해 놓음
            hist_path = f"{APP_TEMPLATE_DIR}/{opt.app_name}/history"
            if not os.path.isdir(hist_path):
                os.makedirs(hist_path)
            _, file = os.path.split(file_name)
            ymdhms = datetime.today().strftime("%y%m%d%H%M%S")
            hist_file = f"{hist_path}/{ymdhms}_{file}"
            shutil.copyfile(file_name, hist_file)
            continue
        
        with open(file_name, 'r', encoding="utf-8") as ff:
            lines = ff.readlines()
            for index, line in enumerate(lines):
                line = line.replace(' ', '____')
                line = line.replace(r"&quot;", r"'")                            # "&quot;"=>"'"로 먼저 치환
                line = line.replace(r'href="//', r'href="https://')             # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r'src="../assets', r'src="assets')             # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r'href="../assets', r'href="assets')             # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r'src="assets/', r'src="https://google.com/assets/')   # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r'href="assets/', r'href="https://google.com/assets/')   # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r"background-image:url('assets/", r"background-image:url('https://google.com/assets/")   # 불완전하게 사용되고 있는 http를 고쳐놓음
                line = line.replace(r"background:url('assets/", r"background:url('https://google.com/assets/")   # 불완전하게 사용되고 있는 http를 고쳐놓음

                # https:~.css, https:~.js, https:~.swf, https:!png,jpg 문장에 파일을 다운로드하고 static를 변환을 함
                static_processed = False
                for key, value in TAG_DICT.items():
                    if key == '.css' and line.find('assets/bootstrap/css/bootstrap.min.css') >= 0:
                        print()
                    if line.find("https") >= 0 and line.find(key) >= 0 and line.find("https") < line.find(key):
                        https_list = extractor.find_urls(line)
                        for ii, org_https in enumerate(https_list):
                            if org_https.find(key) >= 0:
                                src_https = org_https.replace("____", "%20")
                                http_file = src_https.split('/')[-1]    # /blabla.css?v=1.0
                                http_file = http_file.split('?')[0]

                                # sub folder 추출
                                sub_folder = str()
                                if src_https.find('/assets/bootstrap') >= 0:
                                    sub_folder = '/assets/bootstrap'
                                if opt.is_bss:
                                    http_file = http_file.replace("%20", " ")
                                    tgt_dir = f"static/{opt.app_name}/assets"
                                    tgt_https = r"{" + f"% static '{folderfind(tgt_dir, sub_folder, http_file)}/{http_file}{surfix}"
                                else:
                                    http_file = http_file.replace("%20", " ")
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
                        if opt.is_bss:
                            tgt_dir = f"static/{opt.app_name}/assets"
                            tgt_https = r"{" + f"% static '{folderfind(tgt_dir, http_file)}/{http_file}{surfix}"
                        else:
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
                        if opt.is_bss:
                            tgt_dir = f"static/{opt.app_name}/assets"
                            tgt_https = r"{" + f"% static '{folderfind(tgt_dir, http_file)}/{http_file}{surfix}"
                        else:
                            download(src_https, value, http_file)
                            tgt_https = f"{prefix}{value}/{http_file}{surfix}"
                        line = line.replace(org_https, tgt_https)
                lines[index] = line.replace('____', ' ')
                
            data = ''.join(lines)
        file_name += ".html"
        with open(file_name, 'w', encoding="utf-8") as ff:
            ff.write(first_load_static)
            ff.write(data)

    print(f"{opt.app_name} template file generated!!")

parser = argparse.ArgumentParser(description='generate template file for python(use: python generate_template.py --app_name=learnus --is_bss=1')
parser.add_argument('--app_name', type=str, required=True, help="앱이름(ex: --app_name=learnus)")
parser.add_argument('--is_bss', '--boolean_flag', help='boolean flag', default=False, type=str2bool)
opt = parser.parse_args()

BASE_DIR = os.getcwd()
APP_STATIC_DIR = f"{opt.app_name}/static"
APP_TEMPLATE_DIR = f"{opt.app_name}/templates"

first_load_static = "{% load static %}\n"
prefix = r"{" + f"% static '{opt.app_name}/assets/"
surfix = r"' %}"

extractor = URLExtract()

if __name__ == '__main__':
    main()    