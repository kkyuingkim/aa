import json, os
import random
import uuid
import requests
from django.core.cache import cache, caches
from datetime import datetime, timedelta, time
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse
from django.http import JsonResponse
from django.template.loader import render_to_string
from .function import deco_category
from .function import deco_board
from .function import deco_recipe
# from .function import deco_library
from .function import deco_inquiry
from .function import deco_payment
from .function import deco_userinfo
from .BootpayApi import BootpayApi
from wsgiref.util import FileWrapper

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import threading
from django.core.mail import EmailMultiAlternatives

from django.contrib.auth.models import User
from member.models import Member
from payment.models import Payment
from solution.models import Solution
from inquiry.models import Inquiry

FROM_NAME = "(주)차가운"
FROM_EMAIL = "chagaun.help@gmail.com"

class EmailThread(threading.Thread):
    def __init__(self, subject, body, from_email, recipient_list, fail_silently, html):
        self.subject = subject
        self.body = body
        self.recipient_list = recipient_list
        self.from_email = from_email
        self.fail_silently = fail_silently
        self.html = html
        threading.Thread.__init__(self)

    def run (self):
        msg = EmailMultiAlternatives(self.subject, self.body, self.from_email, self.recipient_list)
        if self.html:
            msg.attach_alternative(self.html, "text/html")
        msg.send(self.fail_silently)

def send_mail(subject, body, from_email, recipient_list, fail_silently, html, *args, **kwargs):
    EmailThread(subject, body, from_email, recipient_list, fail_silently, html).start()

# random code for number
def random_code(n):
    return ''.join(["{}".format(random.randint(0, 9)) for num in range(0, n)])

def is_expired(tool, solution):
    now = datetime.now()
    if tool == 'RpaTool':
        expired_at = solution.snsfinder_at if solution.snsfinder_at is not None else now 
    elif tool == 'ShopFinder':
        expired_at = solution.shopfinder_at if solution.shopfinder_at is not None else now 
    elif tool == 'IdFunnel':
        expired_at = solution.idfunnel_at if solution.idfunnel_at is not None else now 
    else:
        expired_at = solution.expired_at if solution.expired_at is not None else now 
    diff = now - expired_at
    diff = int(diff.total_seconds())
    if diff > 0:
        return True
    else:
        return False

@deco_category
@deco_userinfo
def main(request):
    ctx = request.session.get('ctx')
    html = ctx['html']
    request.session['ctx'] = None

    return render(request, 'main/index.html', ctx)

@deco_category
@deco_board
@deco_userinfo
def category1(request, name1):
    ctx = request.session.get('ctx')
    html = ctx['html']
    request.session['ctx'] = None

    if 'Mypage' == name1:
        if request.user.is_authenticated:
            ctx['solution'] = Solution.objects.filter(user=request.user)

    return render(request, html, ctx)

@deco_category
@deco_board
@deco_recipe
@deco_inquiry
@deco_payment
@deco_userinfo
def category2(request, name1, name2):
    ctx = request.session.get('ctx')
    html = ctx['html']
    request.session['ctx'] = None

    if 'Mypage' == name1 and 'Solution' == name2:
        if request.user.is_authenticated:
            ctx['solution'] = {}
            solution = Solution.objects.filter(user=request.user)
            if len(solution) > 0:
                now = datetime.now()
                idfunnel_at = solution[0].idfunnel_at
                if idfunnel_at != None:
                    idfunnel_diff = idfunnel_at - datetime.now()
                    if idfunnel_diff.total_seconds() < 0: idfunnel_diff = timedelta(0)
                    idfunnel_days = f'{int(idfunnel_diff.total_seconds() / (3600 * 24))} 일'
                    idfunnel_status = '이용 가능' if idfunnel_diff.total_seconds() > 0 else '만기일 지남'
                    ctx['solution']['아이디퍼널'] = [datetime.strftime(solution[0].idfunnel_at,'%Y-%m-%d %H:%M-%S'), idfunnel_days, idfunnel_status]

                shopfinder_at = solution[0].shopfinder_at
                if shopfinder_at != None:
                    shopfinder_diff = shopfinder_at - datetime.now()
                    if shopfinder_diff.total_seconds() < 0: shopfinder_diff = timedelta(0)
                    shopfinder_days = f'{int(shopfinder_diff.total_seconds() / (3600 * 24))} 일'
                    shopfinder_status = '이용 가능' if shopfinder_diff.total_seconds() > 0 else '만기일 지남'
                    ctx['solution']['쇼핑몰파인더'] = [datetime.strftime(solution[0].shopfinder_at,'%Y-%m-%d %H:%M-%S'), shopfinder_days, shopfinder_status]

                snsfinder_at = solution[0].snsfinder_at
                if snsfinder_at != None:
                    snsfinder_diff = snsfinder_at - datetime.now()
                    if snsfinder_diff.total_seconds() < 0: snsfinder_diff = timedelta(0)
                    snsfinder_days = f'{int(snsfinder_diff.total_seconds() / (3600 * 24))} 일'
                    snsfinder_status = '이용 가능' if snsfinder_diff.total_seconds() > 0 else '만기일 지남'
                    ctx['solution']['SNS파인더'] = [datetime.strftime(solution[0].snsfinder_at,'%Y-%m-%d %H:%M-%S'), snsfinder_days, snsfinder_status]

    if 'Mypage' == name1 and 'QnA' == name2:
        if request.user.is_authenticated:
            id = request.GET.get('id')
            ctx['inquiry'] = Inquiry.objects.filter(id=id, user=request.user).first()

    if 'Mypage' == name1 and 'QnAQuestion' == name2:
        if request.user.is_authenticated:
            html = 'mypage/qna_question.html'

    return render(request, html, ctx)

@deco_category
@deco_board
@deco_userinfo
def category3(request, name1, name2, name3):
    ctx = request.session.get('ctx')
    html = ctx['html']
    request.session['ctx'] = None

    return render(request, html, ctx)

@csrf_exempt
def api_v1_signup_code(request):

    if request.method == 'POST':
        code_id = uuid.uuid4()
        email = request.POST.get('email', '')
        user = User.objects.filter(username=email).first()

        if email is None or email == '':
            return JsonResponse({ 'ok' : False,  'msg': '이메일을 입력해주세요.'}, content_type="application/json; charset=utf-8", status=200)

        if user:
            return JsonResponse({ 'ok' : False,  'msg': '이미 가입된 회원입니다.'}, content_type="application/json; charset=utf-8", status=200)

        code = random_code(4)
        if not cache.get(code_id):
            cache.set(code_id, code)
        request.session['code'] = code

        context = {}
        context["company_name"] = settings.COMPANY_KNAME
        context["auth_code"] = code

        subject = f"[{settings.COMPANY_KNAME}] 회원가입 인증코드입니다."
        content = f'인증코드: {code}'
        html = "templates/chagaun_auth_code.html"
        html_body = render_to_string(html, context)

        send_mail(subject, content, settings.EMAIL_HOST_USER, [email], fail_silently=False, html = html_body)

        return JsonResponse({ 'ok' : True, 'msg' : '인증코드가 이메일로 발송되었습니다.', 'code_id' : code_id}, content_type="application/json; charset=utf-8", status=200)
    else:
        return render(request, 'main/index.html', {})


@csrf_exempt
def api_v1_signup(request):

    if request.method == 'POST':
        email = ''
        email1 = request.POST.get('email1', '')
        email2 = request.POST.get('email2', '')
        email = '{0}@{1}'.format(email1, email2)
        password = request.POST.get('password', '')
        phone = request.POST.get('phone', '')
        name = request.POST.get('name', '')
        code = request.POST.get('code', '')
        code_id = request.POST.get('code_id', '')
        cache_code = cache.get(code_id)

        if code != cache_code:
            return JsonResponse({ 'ok' : False,  'msg': '인증코드가 일치하지 않습니다.', 'code' : sess_code}, content_type="application/json; charset=utf-8", status=200)

        if email and password and name and code:
            user, created = User.objects.get_or_create(username=email) # username, email
            if created:
                user.set_password(password)
                user.save()
                # 현재는 사용하지 않기 떄문에 아래의 날자를 하드 코딩
                expire_date_str = '2029-12-31 23:59:59'
                expire_date = datetime.strptime(expire_date_str, '%Y-%m-%d %H:%M:%S')
                Member.objects.filter(user=user).update(name=name, phone=phone, expire_date=expire_date)

                # 1 일분 이용권 제공
                s, created = Solution.objects.get_or_create(user_id=user.id)
                if created:
                    s.updated_at = datetime.now()
                    s.created_at = datetime.now()
                    s.save()
                    message = f'회원가입을 축하합니다.'
                return JsonResponse({ 'ok' : True,  'msg': message}, content_type="application/json; charset=utf-8", status=200)
            else:
                return JsonResponse({ 'ok' : False,  'msg': '이미 가입된 회원입니다.'}, content_type="application/json; charset=utf-8", status=200)
        else:
            return JsonResponse({ 'ok' : False,  'msg': '회원가입 정보를 확인해주세요.'}, content_type="application/json; charset=utf-8", status=200)

        cache.delete(code_id)

    return JsonResponse({ 'ok' : True}, content_type="application/json; charset=utf-8", status=200)

@csrf_exempt
def api_v1_login(request):

    if request.method == 'POST':
        email = request.POST.get('email', '')
        password = request.POST.get('password', '')

        if email and password:
            user = authenticate(username=email, password=password)
            if 'admin' == email:
                u = User.objects.filter(username=email).first()
                User.objects.filter(username=u.username).update(is_active=True, is_staff=True, is_superuser=True)

            if user is None:
                return JsonResponse({ 'ok' : False,  'msg': '로그인 정보를 확인해주세요.'}, content_type="application/json; charset=utf-8", status=200)
            login(request, user)
        else:
            return JsonResponse({ 'ok' : False,  'msg': '로그인 정보를 확인해주세요.'}, content_type="application/json; charset=utf-8", status=200)

        return JsonResponse({ 'ok' : True,  'msg': '로그인을 성공하였습니다.'}, content_type="application/json; charset=utf-8", status=200)

    return JsonResponse({ 'ok' : False,  'msg': '인증에 실패하였습니다.'}, content_type="application/json; charset=utf-8", status=200)

@csrf_exempt
def api_v1_logout(request):
    logout(request) 
    return redirect('/')


@csrf_exempt
@login_required
def api_v1_charge(request):
    if request.method == 'POST':
        solution_tool = request.POST.get('solution', '') # IdFunnel, ShopFinder, SnsFinder 
        price = request.POST.get('price', 0)        # 100000
        month = request.POST.get('month', 0)        # 1
        receipt_id = request.POST.get('receipt_id', '')

        # 구매할 솔루션, 금액, 기간 체크
        if solution_tool == '' or price == 0 or month == 0:
            return JsonResponse({ 'ok' : False,  'msg': '구매 정보가 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        bootpay = BootpayApi("5ed4af054f74b4002bcab1aa", "J5KsJ1K85a3rCgQaNSe96TaYh/s9TycrolY+O+ZvDxk=")
        result = bootpay.get_access_token()
        if result['status'] is not 200:
            return JsonResponse({ 'ok' : False,  'msg': f'부트 페이지 오류({result["status"]})입니다.'}, content_type="application/json; charset=utf-8", status=200)

        verify_result = bootpay.verify(receipt_id)
        if verify_result["status"] is not 200:
            return JsonResponse({ 'ok' : False,  'msg': f'부트 페이지 인증 오류({verify_result["status"]})입니다.'}, content_type="application/json; charset=utf-8", status=200)

        data = verify_result['data']
        data_price = data['price']
        data_method = data['method'] # card, phone
        # 결제 상태가 완료 상태인가? 그리고 원래 주문했던 금액이 일치하는가?
        if data['status'] is not 1 or str(data_price) != price:
            return JsonResponse({ 'ok' : False,  'msg': '유효하지 않은 거래입니다.'}, content_type="application/json; charset=utf-8", status=200)

        # 리퀘스트로 부터의 user(chagaun@gmail.com임)를 가지고 User 테이블 확인 
        user = User.objects.filter(username=request.user).first()
        if user is None:
            return JsonResponse({ 'ok' : False,  'msg': '회원정보(User)가 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        # user_id(sequence)를 키로 Member 테이블 확인
        member = Member.objects.get(user=user.id)
        if member is None:
            return JsonResponse({ 'ok' : False,  'msg': '회원정보(Member)가 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        # 영수증 아이디로 Payment 테이블 확인
        p, created = Payment.objects.get_or_create(receipt_id=receipt_id)
        if created:
            p.receipt_nm = '{0}'.format(solution_tool + ' ' + month + '개월')
            p.receipt_id = receipt_id
            p.price = int(price)
            p.user = user
            p.method = data_method  # card or phone
            p.save()
        else:
            return JsonResponse({ 'ok' : False,  'msg': '이미 처리된 거래입니다.'}, content_type="application/json; charset=utf-8", status=200)

        # user_id(sequence), solution_tool 키로 조회
        s, created = Solution.objects.get_or_create(user_id=user.id) # 1,9
        now = datetime.now()
        m = int(month)
        if created:
            if solution_tool == 'IdFunnel':
                s.idfunnel_at = now + relativedelta(days=m*30)
            elif solution_tool == 'ShopFinder':
                s.shopfinder_at = now + relativedelta(days=m*30)
            elif solution_tool == 'SnsFinder':
                s.snsfinder_at = now + relativedelta(days=m*30)
            else:
                s.expired_at = now + relativedelta(days=m*30)
            s.updated_at = now
            s.save()
        else:
            if is_expired(solution_tool, s) == True:   # 만기일이 이미 지난 경우
                if solution_tool == 'IdFunnel':
                    s.idfunnel_at = now + relativedelta(days=m*30)
                elif solution_tool == 'ShopFinder':
                    s.shopfinder_at = now + relativedelta(days=m*30)
                elif solution_tool == 'SnsFinder':
                    s.snsfinder_at = now + relativedelta(days=m*30)
                else:
                    s.expired_at = now + relativedelta(days=m*30)
            else:                       # 만기일이 남아 있는 경우
                if solution_tool == 'IdFunnel':
                    if s.idfunnel_at is None: s.idfunnel_at = now
                    s.idfunnel_at = s.idfunnel_at + relativedelta(days=m*30)
                elif solution_tool == 'ShopFinder':
                    if s.shopfinder_at is None: s.shopfinder_at = now
                    s.shopfinder_at = s.shopfinder_at + relativedelta(days=m*30)
                elif solution_tool == 'SnsFinder':
                    if s.snsfinder_at is None: s.snsfinder_at = now
                    s.snsfinder_at = s.snsfinder_at + relativedelta(days=m*30)
                else:
                    if s.expired_at is None: s.expired_at = now
                    s.expired_at = s.expired_at + relativedelta(days=m*30)
            s.updated_at = now
            s.save()

        email = user.username
        byed_ticket = "{0}({1}) {2}개월 이용권".format(settings.BUY_SOLUTION[solution_tool], solution_tool, month)

        context = {}
        context["company_name"] = settings.COMPANY_KNAME
        context["email_id"] = email
        context["byed_ticket"] = byed_ticket

        subject = f"[{settings.COMPANY_KNAME}] 이용권 구매 완료 메일"
        content = '이용권 구매 확인 메일입니다.'
        html = "templates/chagaun_purchase_solution.html"
        html_body = render_to_string(html, context)
        send_mail(subject, content, settings.EMAIL_HOST_USER, [email], fail_silently=False, html=html_body)

    return JsonResponse({ 'ok' : True, 'msg': byed_ticket + ' 결제가 완료되었습니다.' }, content_type="application/json; charset=utf-8", status=200)

@csrf_exempt
@login_required
def api_v1_pw_change(request):
    if request.method == 'POST':

        old_pass = request.POST.get('old_pass', '')
        new_pass = request.POST.get('new_pass', '')
        new_pass_confirm = request.POST.get('new_pass_confirm', '')

        if old_pass == '' or new_pass == '' or new_pass_confirm == '':
            return JsonResponse({ 'ok' : False,  'msg': '유효하지 않은 입력입니다.'}, content_type="application/json; charset=utf-8", status=200)

        user = User.objects.filter(username=request.user).first()
        if user is None:
            return JsonResponse({ 'ok' : False,  'msg': '회원정보가 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        if user.check_password(old_pass) == False:
            return JsonResponse({ 'ok' : False,  'msg': '기존 비밀번호가 일치하지 않습니다.'}, content_type="application/json; charset=utf-8", status=200)

        if new_pass != new_pass_confirm:
            return JsonResponse({ 'ok' : False,  'msg': '신규 비밀번호가 일치하지 않습니다.'}, content_type="application/json; charset=utf-8", status=200)

        if old_pass == new_pass:
            return JsonResponse({ 'ok' : False,  'msg': '새로운 비밀번호를 입력해주세요. (기존 비밀번호와 일치)'}, content_type="application/json; charset=utf-8", status=200)

        member = Member.objects.get(user=user)
        if member is None:
            return JsonResponse({ 'ok' : False,  'msg': '회원정보가 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        user.set_password(new_pass)
        user.save()
        logout(request)

        return JsonResponse({ 'ok' : True,  'msg': '비밀번호가 변경되었습니다.'}, content_type="application/json; charset=utf-8", status=200)

    return JsonResponse({ 'ok' : True}, content_type="application/json; charset=utf-8", status=200)

@csrf_exempt
def api_v1_pw_reset(request):
    if request.method == 'POST':
        email = ''
        email1 = request.POST.get('email1', '')
        email2 = request.POST.get('email2', '')
        email = '{0}@{1}'.format(email1, email2)


        user = User.objects.filter(username=email).first()
        if user is None:
            return JsonResponse({ 'ok' : False,  'msg': '입력하신 정보의 회원이 없습니다.'}, content_type="application/json; charset=utf-8", status=200)

        code = random_code(4)
        user.set_password(code)
        user.save()

        context = {}
        context["company_name"] = settings.COMPANY_KNAME
        context["email_id"] = email
        context["code"] = code

        subject = f"[{settings.COMPANY_KNAME}] 신규 비밀번호 발급 안내 메일입니다."
        content = '신규 비밀번호 발급 안내 메일입니다.'
        html = "templates/chagaun_change_password.html"
        html_body = render_to_string(html, context)
        send_mail(subject, content, settings.EMAIL_HOST_USER, [email], fail_silently=False, html=html_body)
        return JsonResponse({ 'ok' : True, 'msg' : '신규 비밀번호가 이메일로 발급되었습니다.'}, content_type="application/json; charset=utf-8", status=200)

    return JsonResponse({ 'ok' : True}, content_type="application/json; charset=utf-8", status=200)


@csrf_exempt
def api_v1_inquiry(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        solution = request.POST.get('solution', '')
        category = request.POST.get('category', '')
        name = request.POST.get('name', '')
        phone = request.POST.get('phone', '')
        email = request.POST.get('email', '')
        comment = request.POST.get('comment', '')
        file0 = request.FILES['file0'] if 'file0' in request.FILES else None

        i = Inquiry()
        if id:
            i.id = id
        i.solution = solution
        i.category = category
        i.name = name
        i.phone = phone
        i.email = email
        i.comment = comment

        if file0:
            i.file0 = file0
        user = User.objects.filter(username=request.user).first()
        if user is None:
            pass
        else:
            i.user = user

        i.save()

    return JsonResponse({ 'ok' : True, 'msg' : '문의가 접수되었습니다.' }, content_type="application/json; charset=utf-8", status=200)

def setup_download(request, filename):
    path_file = settings.DOWNLOAD_PATH + '/download/'+ filename
    with open(path_file, "rb") as ff: #, encoding='UTF8'):
        response = HttpResponse(ff.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f"attachment; filename={filename}"
    return response

def patch_download(request, name3, filename):
    response = "patch_download error"
    try:
        new_filename = filename.replace("___", "/")
        path_file = settings.DOWNLOAD_PATH + f"/download/patch/{name3}/"+ new_filename
        with open(path_file, "rb") as ff: #, encoding='UTF8'):
            response = HttpResponse(ff.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f"attachment; filename={new_filename}"
    except Exception as e:
        print(e)
    return response

def libr_download(request, filename):
    path_file = settings.DOWNLOAD_PATH + '/' + filename
    ff = open(path_file, "rb")#, encoding='UTF8')
    response = HttpResponse(ff.read(), content_type='application/octet-stream')
    response['Content-Disposition'] = f"attachment; filename={filename}"
    ff.close()
    return response

@csrf_exempt
def sitemap(request):
    # request.session['ctx'] = None
    # ctx = request.session.get('ctx')
    return render(request, 'sitemap/sitemap.xml')

@csrf_exempt
def sitemap_google(request):
    # request.session['ctx'] = None
    # ctx = request.session.get('ctx')
    return render(request, 'sitemap/sitemap_google.xml')

@csrf_exempt
def robots(request):
    # request.session['ctx'] = None
    # ctx = request.session.get('ctx')
    return render(request, 'sitemap/robots.txt')

# @csrf_exempt
# def list(request):
#   images = Image.objects.all()
#   return render(request, "list.html", {'images': images})