from django.shortcuts import render
from datetime import datetime, timedelta
from django.http import HttpResponse
import hashlib, random

from django.contrib.auth.models import User
from member.models import Member
import logging
# DEBUG(10), INFO(20), WARNING(30), ERROR(40), CRITICAL(50)

# Create your views here.
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def auto_login_check_klicker(request):
    hash_packet = request.GET.get("SN", '')
    user_id = request.GET.get("ID", '')
    user_pw = request.GET.get("PW", '')
    hash_list = list(hash_packet)
    
    current_utctime = datetime.utcnow()
    curr_server_seconds = current_utctime.hour * 3600 + current_utctime.minute * 60 + current_utctime.second
    
    # 헤시코드에서 client_seconds server_seconds 추출
    client_seconds, server_seconds = str(), str()
    for ii in range(5):
        client_seconds = f"{client_seconds}{hash_list[5*ii]}"
    for ii in range(5, 10):
        server_seconds = f"{server_seconds}{hash_list[5*ii]}"

    pack_server_seconds = curr_server_seconds if server_seconds == "00000" else int(server_seconds)
    pack_client_seconds = int(client_seconds)
        
    # UserSequence 추출
    user_sequence = 0

    # MAC_ADDR 추출
    mac_address = str()
    for ii in range(0, 12):
        mac_address += hash_list[ii * 5 + 2]
    pack_client_ip_mac = get_client_ip(request) + mac_address

    # 마지막 VPN IP 추출
    last_hex_server = str()
    for ii in range(0, 8):
        last_hex_server += hash_list[ii * 5 + 3]

    # VPN REGION 추출
    vpn_region = hash_list[63]

    response_code = 0
    
    # 서버 시차 체크
    if abs(pack_server_seconds - curr_server_seconds) > 40:
        response_code = 9000
    else:
        # DB DATA 체크(ID, PW)
        try:
            data_expire_duration = 0
            data_expire_date = datetime.now()
            data_client_ip_mac = pack_client_ip_mac
            data_debug_level = str(logging.INFO)
            if len(user_id) > 0 and len(user_pw) > 0:
                user = User.objects.get(username=user_id)    # , password=user_pw
                if user is None:
                    response_code = 9100
                else:
                    member = Member.objects.get(user_id=user.id)
                    if member is None:
                        response_code = 9100
            if response_code == 0:
                data_expire_date = member.expire_date if member.expire_date is not None else data_expire_date
                data_client_ip_mac = member.login_ip if member.login_ip is not None else data_client_ip_mac
                data_debug_level = member.debug_level if member.debug_level is not None else data_debug_level
                if data_expire_date is None:
                    response_code = 9300
                else:
                    diff = data_expire_date - datetime.now()
                    data_expire_duration = diff.days
                    if data_expire_duration <= 0:
                        response_code = 9300
            if response_code == 0:
                member.login_ip = pack_client_ip_mac
                member.save()
                user_sequence = user.id
        except Exception as e:
            response_code = 9100
    if response_code != 0:
        user_sequence = 0
        
    # 64바이트의 해쉬 데이터 생성
    current_datetime = datetime.now()
    random_number = str(random.randrange(10000000, 99999999))
    msg = current_datetime.strftime("%Y%m%d%H%M%S") + random_number
    hash_data = hashlib.md5(msg.encode()).hexdigest() + hashlib.md5(msg.encode()).hexdigest()
    hash_list = list(hash_data)

    current_utctime = datetime.utcnow()
    curr_server_seconds = current_utctime.hour * 3600 + current_utctime.minute * 60 + current_utctime.second
    
    # 클라이언트시간+서버시간를 체워넣음
    client_server_seconds = str(pack_client_seconds).zfill(5) + str(curr_server_seconds).zfill(5)
    for ii in range(0, 10):
        hash_list[ii*5] = client_server_seconds[ii]

    # user_sequence 체워넣음
    user_sequence = str(user_sequence).zfill(10)   
    for ii in range(0, 10):
        hash_list[ii*5 + 1] = user_sequence[ii]

    response_code = str(response_code).zfill(4) + str(data_expire_duration).zfill(6)
    for ii in range(0, 10):
        hash_list[ii*5 + 4] = response_code[ii]

    hash_packet = ''.join(hash_list)
    data_packet = f"{hash_packet}{data_debug_level}{data_expire_date.strftime('%y-%m-%d %H:%M:%S')}{data_client_ip_mac}"
    response = HttpResponse(data_packet)
    return response

def auto_time_sync_klicker(request):
    hash_packet = request.GET.get("SN", '')
    user_sequence = request.GET.get("USEQ", '')
    mac_address = request.GET.get("MC", '')
    hash_list = list(hash_packet)
    
    current_utctime = datetime.utcnow()
    curr_server_seconds = current_utctime.hour * 3600 + current_utctime.minute * 60 + current_utctime.second
    
    # 헤시코드에서 client_seconds server_seconds 추출
    client_seconds, server_seconds = str(), str()
    for ii in range(5):
        client_seconds = f"{client_seconds}{hash_list[5*ii]}"
    for ii in range(5, 10):
        server_seconds = f"{server_seconds}{hash_list[5*ii]}"

    pack_server_seconds = curr_server_seconds if server_seconds == "00000" else int(server_seconds)
    pack_client_seconds = int(client_seconds)
        
    # UserSequence 추출
    user_sequence = str()
    for ii in range(0, 10):  
        user_sequence += hash_list[ii * 5 + 1]
    user_sequence = int(user_sequence)

    # MAC_ADDR 추출
    mac_address = str()
    for ii in range(0, 12):
        mac_address += hash_list[ii * 5 + 2]
    pack_client_ip_mac = get_client_ip(request) + mac_address

    # 마지막 VPN IP 추출
    last_hex_server = str()
    for ii in range(0, 8):
        last_hex_server += hash_list[ii * 5 + 3]

    # VPN REGION 추출
    vpn_region = hash_list[63]

    response_code = 0

    # 서버 시차 체크
    if abs(pack_server_seconds - curr_server_seconds) > 40:
        response_code = 9000
    else:
        # DB DATA 체크(IP, MAC)
        try:
            data_expire_duration = 0
            data_expire_date = datetime.now()
            data_client_ip_mac = pack_client_ip_mac
            data_debug_level = str(logging.INFO)
            if user_sequence > 0:
                member = Member.objects.filter(id=user_sequence).first()
                if member is None:
                    response_code = 9100
            if user_sequence > 0 and response_code == 0:
                    data_client_ip_mac = member.login_ip if member.login_ip is not None else data_client_ip_mac
                    data_expire_date = member.expire_date if member.expire_date is not None else data_expire_date
                    data_debug_level = member.debug_level if member.debug_level is not None else data_debug_level
                    if data_client_ip_mac is not None and data_client_ip_mac != pack_client_ip_mac:
                        response_code = 9200
                    elif data_expire_date is None:
                        response_code = 9300
                    else:
                        diff = data_expire_date - datetime.now()
                        data_expire_duration = diff.days
                        if data_expire_duration <= 0:
                            response_code = 9300
        except Exception as e:
            response_code = 9100

    # 64바이트의 해쉬 데이터 생성
    current_datetime = datetime.now()
    random_number = str(random.randrange(10000000, 99999999))
    msg = current_datetime.strftime("%Y%m%d%H%M%S") + random_number
    hash_data = hashlib.md5(msg.encode()).hexdigest() + hashlib.md5(msg.encode()).hexdigest()
    hash_list = list(hash_data)

    current_utctime = datetime.utcnow()
    curr_server_seconds = current_utctime.hour * 3600 + current_utctime.minute * 60 + current_utctime.second
    
    # 클라이언트시간+서버시간를 체워넣음
    client_server_seconds = str(pack_client_seconds).zfill(5) + str(curr_server_seconds).zfill(5)
    for ii in range(0, 10):
        hash_list[ii*5] = client_server_seconds[ii]

    # user_sequence 체워넣음
    user_sequence = str(user_sequence).zfill(10)   
    for ii in range(0, 10):
        hash_list[ii*5 + 1] = user_sequence[ii]

    response_code = str(response_code).zfill(4) + str(data_expire_duration).zfill(6)
    for ii in range(0, 10):
        hash_list[ii*5 + 4] = response_code[ii]

    hash_packet = ''.join(hash_list)
    data_packet = f"{hash_packet}{data_debug_level}{data_expire_date.strftime('%y-%m-%d %H:%M:%S')}{data_client_ip_mac}"
    response = HttpResponse(data_packet)
    return response
