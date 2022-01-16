/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */

// ajax, php 간에 통신시 사용되는 규칙
var mesg = new Object();
mesg.success = "100";
mesg.failure = "300";
mesg.failureSesskey = "310";
mesg.failureNotLogin = "399";

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if (isNaN(r)){u=a=64}else if (isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if (u!=64){t=t+String.fromCharCode(r)}if (a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if (r<128){t+=String.fromCharCode(r)}else if (r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if (r<128){t+=String.fromCharCode(r);n++}else if (r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


function location_search2(key, value) {
    var queryParameters = {},
        queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g,
        m;

    while ((m = re.exec(queryString))) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }


    // Ls 변경으로 인해서 page값이 변경이 되는데 기존 page갯수보다 작아지면..
    // 문제가 생기기 때문에 ls값을 변경 하면 무조건 page 1로 이동으로 시켜야됨.
    if (queryParameters.hasOwnProperty('page')) {
        queryParameters['page'] = 1;
    }

    queryParameters[key] = value;

    location.search = $.param(queryParameters);
}

function location_search(key, value) {
    var queryParameters = {},
        queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g,
        m;

    while ((m = re.exec(queryString))) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    queryParameters[key] = value;
    // Ls 변경으로 인해서 page값이 변경이 되는데 기존 page갯수보다 작아지면..
    // 문제가 생기기 때문에 ls값을 변경 하면 무조건 page 1로 이동으로 시켜야됨.

    location.search = $.param(queryParameters);
}

function showProgress() {
    $("body").append('<div id="ajax_loading"><div id="ajax_loading_img"><img src="/theme/coursemosv2/pix/ajax-loader-small.gif" alt="loading..." /> Loading...</div></div>');
    $("#ajax_loading").css({
        height: $(document).height()
    });
    $("#ajax_loading_img").pagetop();
}

function hideProgress() {
    if ($("#ajax_loading").length > 0) {
        $("#ajax_loading").remove();
    }
}

function showSubmitProgress() {
    $("#ajax_loading_submit").show().css({
        height: $(document).height()
    });
    $("#ajax_loading_container").center().show();
}

function hideSubmitProgress() {
    if ($("#ajax_loading_container").length > 0) {
        $("#ajax_loading_container").hide();
        $("#ajax_loading_submit").hide();
    }
}

$(".course-buttons .course-record-local").click(function() {
    screencapture($(this).data('userid'));
});

function screencapture(userId) {
    disable_ajax_error();

    $.ajax({
        url: "http://127.0.0.1:8099/pid:" + userId,
        type: "POST",
        timeout: 1000,
        async: true,
        dataType: 'jsonp',
        cache: false,
        crossDomain: true,
        complete: function(xhr, responseText, thrownError) {},
        success: function(data, textStatus, XMLHttpRequest) {}
    });
}

function myServerCheck(data) {
    if (data.status == "LIVE") {
        $("#screenrecorder").show();
    }
}

function myCallback(data) {
    if (data.status == "OK") {
        alert("'녹화 시작' 버튼을 클릭하세요.");
    }
}

function screencapturecheck() {
    disable_ajax_error();

    $.ajax({
        url: "http://127.0.0.1:8099/check:",
        type: "POST",
        timeout: 1000,
        async: true,
        dataType: 'jsonp',
        cache: false,
        crossDomain: true,
        complete: function(xhr, responseText, thrownError) {},
        success: function(data, textStatus, XMLHttpRequest) {}
    });
}

function disable_ajax_error() {
    $.ajaxSetup({
        error: function(xhr, msg) {

        }
    });
}

$.fn.center = function() {
    $(this).css({
        "position": "absolute",
        "top": ($(window).scrollTop() + ($(window).height() - $(this).height()) / 2) + "px",
        "left": ($(window).scrollLeft() + ($(window).width() - $(this).width()) / 2) + "px"
    });

    return this;
}

$.fn.pagetop = function() {
    $(this).css({
        "position": "fixed",
        "top": "5px",
        "left": ($(window).scrollLeft() + ($(window).width() - $(this).width()) / 2) + "px"
    });

    return this;
}

$.fn.selectRange = function(start, end) {
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};

function formSubmit(url, parameter) {
    // 임시로 form을 만들어서 submit시킴
    // parameter는 반드시 object형태여야 합니다.

    var dynamicForm = $("<form method='post' action='" + url + "' />");

    var objParam = parameter;
    if (typeof parameter === 'string') {
        var stringParameter = parameter;

        var re = /([^&=]+)=([^&]*)/g,
            m,
            pkey,
            pvalue;

        objParam = {};

        while ((m = re.exec(stringParameter))) {
            pkey = decodeURIComponent(m[1]);
            pvalue = decodeURIComponent(m[2]);

            if (objParam[pkey] !== undefined) {
                if (!$.isArray(objParam[pkey])) {
                    objParam[pkey] = [objParam[pkey]];
                }
                objParam[pkey].push(pvalue);

            } else {
                objParam[pkey] = pvalue;
            }
        }
    }

    var isSesskey = false;
    for (key in objParam) {
        if (key == 'sesskey') {
            isSesskey = true;
        }

        if (parameter.hasOwnProperty(key)) {
            if ($.isArray(parameter[key])) {
                for (ar in parameter[key]) {
                    dynamicForm.append('<input type="hidden" name="' + key + '" value="' + parameter[key][ar] + '" />');
                }
            } else {
                dynamicForm.append('<input type="hidden" name="' + key + '" value="' + parameter[key] + '" />');
            }

        }
    }

    // Sesskey가 등록되지 않았다면 강제로 sesskey 추가
    if (!isSesskey) {
        dynamicForm.append('<input type="hidden" name="sesskey" value="' + M.cfg.sesskey + '" />');
    }

    dynamicForm.appendTo('body').submit();
}



function courseHeaderShowHide(scrollTop) {
    if ($("body").hasClass('coursemos-coursepage-main')) {
        var className = 'coursemos-coursepage-courseheader-show';

        if (scrollTop > 0) {
            $("body").removeClass(className);
        } else {
            $("body").addClass(className);
        }
    }
}

courseHeaderShowHide($(document).scrollTop());
$(window).scroll(function() {
    courseHeaderShowHide($(document).scrollTop());
});


function roll_book(hyhg,domain,hakno,bb,sbb) {
    var form=document.createElement("form");
    form.setAttribute("method","POST");
    form.setAttribute("action","https://ysrollbook.yonsei.ac.kr/eams/faculty/atdc/profRollbook");
    form.setAttribute("target","_blank");
    var hyhgField=document.createElement("input");
    hyhgField.setAttribute("type","hidden");
    hyhgField.setAttribute("name","hyhg");
    hyhgField.setAttribute("value",hyhg);
    form.appendChild(hyhgField);
    var domainField=document.createElement("input");
    domainField.setAttribute("type","hidden");
    domainField.setAttribute("name","domain");
    domainField.setAttribute("value",domain);
    form.appendChild(domainField);
    var haknoField=document.createElement("input");
    haknoField.setAttribute("type","hidden");
    haknoField.setAttribute("name","hakno");
    haknoField.setAttribute("value",hakno);
    form.appendChild(haknoField);
    var bbField=document.createElement("input");
    bbField.setAttribute("type","hidden");
    bbField.setAttribute("name","bb");
    bbField.setAttribute("value",bb);
    form.appendChild(bbField);
    var sbbField=document.createElement("input");
    sbbField.setAttribute("type","hidden");
    sbbField.setAttribute("name","sbb");
    sbbField.setAttribute("value",sbb);
    form.appendChild(sbbField);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form)
}

function popupCenter(url, name, w, h) {
	var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
	var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

	var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

	var left = ((width / 2) - (w / 2)) + dualScreenLeft;
	var top = ((height / 2) - (h / 2)) + dualScreenTop;
	
	var newWindow = window.open(url, name, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left + ', toolbar=0, location=0, status=0, fullscreen=0');

	// Puts focus on the newWindow
	if (newWindow && newWindow.focus) {
		newWindow.focus();
	}
}
