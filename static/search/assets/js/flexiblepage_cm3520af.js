/**
 * 코스모스 3.5 : required moodle version 3.5
 */
$(document).ready(function() 
{     
    var url = document.location;
    var isSimpleMode = true;
    var isModuleUrlView = true; // moduel url

    var filter = "win16|win32|win64|mac|macintel";
    var isMobile = false;

    if ( navigator.platform ) {
        if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
            isMobile = true;
        }
    }
    $('head').append('<style type="text/css">.notice_popup, .vtbanner_popup{display: block !important; }</style>'); 
    $(".notice_popup .close").click(function(){
        $(this).parent().parent().remove(); 
	});
	$(".vtbanner_popup .close").click(function(){
        $(this).parent().parent().remove(); 
	});

    /** 
	 * 
	 * Made By #ellena
	 * 1. 수정 시 기존에 사용된 방식과 동일하게 정리
	 * 2. 주석기재
	 * 
	 **/

    /********************************************
        공통 form 개선
    *********************************************/
    $('head').append('<style type="text/css">.trans_message .trans_waitcount,.trans_message .trans_waitorder { display: none; }</style>');
    $('head').append('<style type="text/css">.mform .fitem .felement select, select.form-control { transition: none !important; -webkit-transition: none !important;}</style>');	// selectBox 개선 - #Jeenlee

    if(url.pathname =='/mod/econtents/view.php'){   // 모바일로 E-contents 들어가면 버튼 숨김, 공지표시
        $('#page-mod-econtents-view.device_mobile #page-content #region-main .btn').hide();
        $('#page-mod-econtents-view.device_mobile #page-content #region-main .btn').after('<p>이 콘텐츠는 PC 웹브라우저에서만 재생이 가능한 콘텐츠입니다. (모바일에서 재생할 수 없는 양식의 콘텐츠입니다.)</p>')
    }
    
    if(url.pathname=='/course/modedit.php')
    {
        //식별번호 숨김
        $('#fitem_id_cmidnumber').hide();
    
        //접근제한 CSS 보정
        setTimeout(function(){ $('#fitem_id_availabilityconditionsjson div.availability-field').css('padding','0px').css('border','0px'); }, 3000);
        setTimeout(function(){ $('#fitem_id_availabilityconditionsjson div.availability-button').css('margin-left','0px'); }, 3000);

        // 동영상선택-공유 #Jeenlee
        $('#page-mod-vod-mod #share div#zclip-ZeroClipboardMovie_1').css('display','none');
    }

    var isMForm=($('#mform1').attr('onsubmit')!=undefined) ? $('#mform1').attr('onsubmit'):'none';

    /********************************************
        과제(activity_assign)
    *********************************************/
    // 고급설정 > 과제 관리     
    if(url.pathname=='/mod/assign/view.php' || url.pathname=='/grade/grading/manage.php' || url.pathname.indexOf('/grade/grading/form/rubric/')>-1 || url.pathname=='/grade/grading/pick.php')
    {
        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) { 
            link=$(this).find('a').attr('href'); 
            if(link.indexOf('/admin/roles')>-1||link.indexOf('/filter/')>-1||link.indexOf('/report/log/')>-1||link.indexOf('/backup/')>-1) { $(this).html(''); }
         });

        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');
    }

    // 과제 설정
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=assign')>-1) || isMForm.indexOf('mod_assign')>0) )
    {
        $('#fgroup_id_assignsubmission_onlinetext_wordlimit_group').hide();
        $('#id_submissionsettings').hide(); // 제출 설정
        $('#id_feedbacktypes').hide();  // 피드백 유형
        $('#id_notifications').hide(); // 알림

        $('#id_modgrade_type').on("change",function() {
            if($(this).val()=='scale')
            {
                $('#id_modgrade_point').prev().prev().hide();
                $('#id_modgrade_point').prev().hide();
                $('#id_modgrade_point').hide();
                $('#id_modgrade_scale').prev().prev().show();
                $('#id_modgrade_scale').prev().show();
                $('#id_modgrade_scale').show();
            } else if($(this).val()=='point') { 
                $('#id_modgrade_scale').prev().prev().hide();
                $('#id_modgrade_scale').prev().hide();
                $('#id_modgrade_scale').hide();
                $('#id_modgrade_point').prev().prev().show();
                $('#id_modgrade_point').prev().show();
                $('#id_modgrade_point').show();
            } 
        });
        $('#id_modgrade_scale').prev().prev().hide();
        $('#id_modgrade_scale').prev().hide();
        $('#id_modgrade_scale').hide();
        $('#fitem_id_gradepass').hide();

        setTimeout(function(){ $('#id_modstandardgrade div.moreless-actions').hide(); }, 3000);

        //과제 수행을 위한 소속팀 필요여부 - 17.09.06 OBJ
        $('#fitem_id_preventsubmissionnotingroup').hide();
        $('#id_preventsubmissionnotingroup').val(1).prop("selected", true);
        

        //제출 버튼 보이기 위치 이동
        var $temp = $("#fitem_id_submissiondrafts").clone(); $temp.removeClass("show"); $("#fitem_id_submissiondrafts").remove(); $("#fitem_id_requireallteammemberssubmit").before($temp);
        if($('#id_teamsubmission').attr('type')=="hidden") $('#id_submissiondrafts').attr('disabled', 'true');
        
        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    //과제 확인
    if(url.pathname=='/mod/assign/view.php' && url.search.indexOf('?id=')>-1 && url.search.indexOf('&action=')==-1)
    {
        $('div.submissionlinks a').addClass('btn-primary').addClass('write');
        $('div.singlebutton input.btn').addClass('form-submit');
    }


    //과제 채점하기
    if(url.pathname=='/mod/assign/view.php' && url.search.indexOf('action=grading')>-1 )
    {
        $('table.generaltable thead th').css('white-space','nowrap');

        //사진
        $('table.generaltable thead th.c1').hide();
        $('table.generaltable tbody td.c1').hide();

        //이름
        $('table.generaltable tbody td.c2').css('white-space','nowrap');
        //학번
        $('table.generaltable tbody td.c3').css('white-space','nowrap');
        //채점 상태
        $('table.generaltable tbody td.c4').css('white-space','nowrap');

        //성적

        //편집
        $('table.generaltable .textmenu').html('<img src="/theme/image.php/coursemosv2/core/1468025184/i/settings" />');

        //제출 수정일
        $('table.generaltable tbody td.c7').css('white-space','nowrap');

        //직접입력
        $('table.generaltable tbody td.c8').css('text-align','center').css('white-space','nowrap');
        $('table.generaltable tbody td.c8 div.no-overflow').hide();

        //첨부파일
        $('table.generaltable tbody td.c9').css('white-space','nowrap');
        $("head").append($("<style>").text(".ygtvcell.ygtvhtml.ygtvcontent>div {white-space:nowrap;}.ygtvcell.ygtvhtml.ygtvcontent>div>a {min-width:50px; font-size:0 !important;} .ygtvcell.ygtvhtml.ygtvcontent>div>a:before {white-space:nowrap; font-size:16px; content:\"저장\" !important;}"));



        $('#fitem_id_showonlyactiveenrol').hide();

        $('#fitem_id_sendstudentnotifications').hide(); //학습자들에게 통지
        $('#fitem_id_savequickgrades').css('margin-top','20px');
        $('#id_savequickgrades').addClass('form-submit');
    }

    //과제 개별 채점하기
    if(url.pathname=='/mod/assign/view.php' && url.search.indexOf('&action=grade')>-1)
    {
        $('#fitem_id_sendstudentnotifications').hide();
        $('#id_savegrade').addClass('form-submit');
    }

    /********************************************
        퀴즈(activity_quiz)
    *********************************************/
    // 퀴즈
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=quiz')>-1) || (url.search.indexOf('&add=quiz')>-1) || isMForm.indexOf('mod_quiz')>0) ) 
    {
        $('#id_timing').removeClass('collapsed');
        if(url.hostname !== 'www.learnus.org'){ //연대 제외
            $('#id_display').hide(); //화면 구성
            $('#id_security').hide(); //응시에의 추가 제한
            $('#id_overallfeedbackhdr').hide(); //전반적인 피드백
        }


        // $('#fgroup_id_duringoptionsgrp fieldset > span').eq(6).remove();  
        // $('#fgroup_id_immediatelyoptionsgrp fieldset > span').eq(6).remove();  
        // $('#fgroup_id_openoptionsgrp fieldset > span').eq(6).remove();  
        // $('#fgroup_id_closedoptionsgrp fieldset > span').eq(6).remove();

		// // 일반적인 피드백
        // $('#fgroup_id_duringoptionsgrp fieldset > span').eq(4).remove();  
        // $('#fgroup_id_immediatelyoptionsgrp fieldset > span').eq(4).remove();
        // $('#fgroup_id_openoptionsgrp fieldset > span').eq(4).remove();
        // $('#fgroup_id_closedoptionsgrp fieldset > span').eq(4).remove();
            
		// // 구체적인 피드백 삭제
        // $('#fgroup_id_duringoptionsgrp fieldset > span').eq(3).remove();  
        // $('#fgroup_id_immediatelyoptionsgrp fieldset > span').eq(3).remove();  
        // $('#fgroup_id_openoptionsgrp fieldset > span').eq(3).remove();
        // $('#fgroup_id_closedoptionsgrp fieldset > span').eq(3).remove();

        // //점수
        // $('#fgroup_id_duringoptionsgrp fieldset > span').eq(1).remove();  
        // $('#fgroup_id_immediatelyoptionsgrp fieldset > span').eq(1).remove();  
        // $('#fgroup_id_openoptionsgrp fieldset > span').eq(1).remove();  
        // $('#fgroup_id_closedoptionsgrp fieldset > span').eq(1).remove();
 
        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    if(url.pathname=='/mod/quiz/view.php' || 
        url.pathname=='/mod/quiz/edit.php' || 
        url.pathname=='/mod/quiz/report.php' || 
        url.pathname=='/mod/quiz/review.php' ||  
        url.pathname=='/mod/quiz/attempt.php' || 
        url.pathname=='/mod/quiz/summary.php'  || 
        url.pathname=='/mod/quiz/overrides.php' || 
        (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_quiz')>0))
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');

        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
            link=$(this).find('a').attr('href');
            if(link.indexOf('/admin/roles/assign.php')>-1||link.indexOf('/admin/roles/check.php')>-1||link.indexOf('/filter/')>-1||link.indexOf('/report/log/')>-1||link.indexOf('/backup/')>-1) { $(this).html(''); }
        }); 
        $("a[href*='/mod/quiz/report.php'][href*=overview]",$("li.type_setting")).each(function() { $(this).attr("href",$(this).attr("href")+"&slotmarks=0"); });
    }

    // 퀴즈 확인    
    if(url.pathname=='/mod/quiz/view.php')
    {
        //결과 보기 단순화
        var href=$('div.quizattemptcounts > a').attr('href'); 
        $('div.quizattemptcounts > a').attr('href',href+'&slotmarks=0');
        
        $('div.quizinfo p').first().css('font-weight','bold');
        $('div.quizinfo p').last().css('font-weight','bold');
        $('div.singlebutton input[type=submit]').css('color','#fff').css('background-color','#5bc0de ').css('border-color','#46b8da ').on("mouseover",function() { $(this).css('background-color','#31b0d5').css('border-color','#269abc');  }).on("mouseout",function() { $(this).css('background-color','#5bc0de').css('border-color','#46b8da');  });
    }

    if(url.pathname=='/mod/quiz/report.php')
    {
        if(url.search.indexOf('&mode=overview')>-1 || url.search.indexOf('&mode=responses')>-1) {
            $('#region-main h2').next().addClass('alert').addClass('alert-success').css('margin-left','0px').css('font-weight','bold');
        }

        if(url.search.indexOf('&mode=overview')>-1 || $('#mform1 input[name=mode]').val()=='overview'){
            $('#id_preferencesuser').addClass('collapsed'); //보고서 설정
            if($('#menudownload')) {
                $('#mform1').next().hide(); $('#mform1').next().next().hide();
                $('#menudownload').val('excel');
                $('#menudownload').next().removeClass('btn-default').addClass('btn-info');
            }
            if($('#attempts')) {
                $('#attempts th').css('text-align','center');
                $('#attempts td').css('text-align','center');
            }
            $('a.reviewlink').append('<img src="http://newcyber.moodler.co.kr/theme/image.php?theme=coursemosv2&amp;component=core&amp;rev=1470896408&amp;image=i%2Fpreview" width="12" height="12" />');
        }
    }

    if(url.pathname=='/mod/quiz/review.php')
    {
        $('div.othernav > a').addClass('btn').addClass('btn-info');
        $('div.submitbtns > a').addClass('btn').addClass('btn-info');
        $('.mobiletheme .mod_quiz-next-nav').css('margin-bottom','50px');	// 모바일화면 - 검토완료 버튼 여백추가
    }

    if(url.pathname=='/mod/quiz/attempt.php'){
        $('.mobiletheme .mod_quiz-next-nav').css('margin-bottom','50px');	// 모바일화면 - 검토완료 버튼 여백추가
    }

    if(url.pathname=='/mod/quiz/attempt.php' || url.pathname=='/mod/quiz/summary.php')
    {
        $('div.othernav > a').addClass('btn').addClass('btn-warning');
        $('div.submitbtns input[type=submit]').removeClass('btn-default').addClass('btn-info');
    }

    // 퀴즈 편집    
    if(url.pathname=='/mod/quiz/edit.php')
    {

        $('div.statusdisplay').css('background-color','#f2dede').css('border-color','#ebccd1').css('color','#a94442');
        $('#inputmaxgrade').css('width','60px');

        $('div.last-add-menu ul li a span').first().addClass('btn').addClass('btn-success');
        $('div.last-add-menu ul li a b').remove();
        $('div.last-add-menu').css('margin','0px').css('margin-top','20px');

        //첫번째 section heading 삭제
        $('div.content div.instancesectioncontainer').first().hide();
    }

    // 문제은행
    if(url.pathname=='/question/edit.php')
    {
        $('#qbshowtext_on').parent().hide();
        if ($("form#displayoptions input:checkbox[name='qbshowtext']").length>0 && !$("form#displayoptions input:checkbox[name='qbshowtext']").is(":checked")) {
            $("form#displayoptions input:checkbox[name='qbshowtext']").prop("checked", true);
            $('form#displayoptions').submit();
        }

        $('#advancedsearch').hide();
        $('.sorters').hide();
        $('#displayoptions div div.categoryinfo').hide();  //... 공유되었습니다.
    }

    // 문제은행 > 미리보기
    if(url.pathname=='/question/preview.php')
    {
        $('#techinfo').hide();
        $('form.mform').hide();
    }

    // 문제은행 > 문제 유형 추가    
    if(url.pathname=='/question/question.php')
    {
        //선다형
        if(url.search.indexOf('&qtype=multichoice')>0 || $('#mform1 input:hidden[name=qtype]').val()=="multichoice")
        {
            // $('#id_answernumbering').val('123');
            //보기 피드백 삭제
            $('div.fitem_feditor').each(function(i){ if($(this).attr('id').indexOf('fitem_id_feedback_')>-1) { $(this).find('div').hide(); } });

            //정답 피드백 숨김
            $('#id_combinedfeedbackhdr').hide();    

            //감정비율
            $('#id_penalty').val('0');
            //힌트 삭제
            $('#fitem_id_hint_0').hide();
            $('#fitem_id_hint_1').hide();
            $('#fgroup_id_hintoptions_0').hide();
            $('#fgroup_id_hintoptions_1').hide();
            $('#fitem_id_addhint').hide();
        }

        //주관식단답형
        if(url.search.indexOf('&qtype=shortanswer')>0 || $('#mform1 input:hidden[name=qtype]').val()=="shortanswer")
        {
            //보기 피드백 삭제
            $('div.fitem_feditor').each(function(i){ if($(this).attr('id').indexOf('fitem_id_feedback_')>-1) { $(this).find('div').hide(); }  });
            //정답 피드백 숨김
            $('#id_combinedfeedbackhdr').hide();  
            //감정비율
            $('#id_penalty').val('0');
            //힌트 삭제
            $('#fitem_id_hint_0').hide();
            $('#fitem_id_hint_1').hide();
            // $('#fgroup_id_hintoptions_0').hide();
            // $('#fgroup_id_hintoptions_1').hide();
            $('#fitem_id_addhint').hide();
        }

        //서술형
        if(url.search.indexOf('&qtype=essay')>0 || $('#mform1 input:hidden[name=qtype]').val()=="essay") 
        {
            $('#id_responsetemplateheader').addClass('collapsed');
            $('#id_graderinfoheader').hide();
        }

        //OX형
        if(url.search.indexOf('&qtype=truefalse')>0 || $('#mform1 input:hidden[name=qtype]').val()=="truefalse")
        {
            $('#fitem_id_feedbacktrue').hide();
            $('#fitem_id_feedbackfalse').hide();
            $('#id_multitriesheader').hide();
        }

        //짝짓기형
        if(url.search.indexOf('&qtype=match')>0 || $('#mform1 input:hidden[name=qtype]').val()=="match")
        {
            //정답 피드백 숨김
            if(url.hostname!='cyber.gachon.ac.kr') {
                $('#id_combinedfeedbackhdr').hide();
            }

            //감정비율
            $('#id_penalty').val('0');
            //힌트 삭제
            $('#fitem_id_hint_0').hide();
            $('#fitem_id_hint_1').hide();
            $('#fgroup_id_hintoptions_0').hide();
            $('#fgroup_id_hintoptions_1').hide();
            $('#fitem_id_addhint').hide();
        }

        //빈칸채우기형
        if(url.search.indexOf('&qtype=multianswer')>0 || $('#mform1 input:hidden[name=qtype]').val()=="multianswer")
        {
            //감정비율
            $('#id_penalty').val('0');
            //힌트 삭제
            $('#fitem_id_hint_0').hide();
            $('#fitem_id_hint_1').hide();
            $('#fgroup_id_hintoptions_0').hide();
            $('#fgroup_id_hintoptions_1').hide();
            $('#fitem_id_addhint').hide();
        }
        
        //수치형
        if(url.search.indexOf('&qtype=numerical')>0 || $('#mform1 input:hidden[name=qtype]').val()=="numerical")
        {
            //보기 피드백 삭제
            $('div.fitem_feditor').each(function(i){ if($(this).attr('id').indexOf('fitem_id_feedback_')>-1) { $(this).find('div').hide(); }  });

            //정답 피드백 숨김
            // $('#id_combinedfeedbackhdr').hide();

            //감정비율
            $('#id_penalty').val('0');
            //힌트 삭제
            $('#fitem_id_hint_0').hide();
            $('#fitem_id_hint_1').hide();
            $('#fgroup_id_hintoptions_0').hide();
            $('#fgroup_id_hintoptions_1').hide();
            $('#fitem_id_addhint').hide();
        }

    }
    // if(url.hostname !== 'www.learnus.org'){ //연대 제외
    //     //퀴즈 > 응시에의 추가제한 > 비밀번호 숨김 (수정자: ellena)
    //     if(url.pathname=='/course/modedit.php') {
    //         if($('#page-mod-quiz-mod').length > 0){
    //             $('#id_quizpassword').attr('disabled','disabled');
    //         }
    //     }
    // }

    /********************************************
        투표(activity_choice)
    *********************************************/
    // 투표
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=choice')>-1) || isMForm.indexOf('mod_choice')>0) )
    {
        $('#id_showunanswered').val("1"); // 응답 없는 항목보기 > 옵션 기본 값 설정
        $('#fitem_id_showunanswered').hide(); // 응답 없는 항목 보기
        $('#fitem_id_includeinactive').hide(); // 비활동중/유보된 사용자...

        // $('#id_optionhdr > legend > a').text('문항 설정');
        $('#id_option_add_fields').val('문항 추가').removeClass('btn-default').addClass('btn-info');

        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    // 투표 확인
    if(url.pathname=='/mod/choice/view.php')
    {
        $("div.expired").css('background-color','#f2dede').css('border-color','#ebccd1').css('color','#a94442');
        $('#region-main input[type=submit]').removeClass('btn-default').addClass('btn-info');
    }

    // 투표 결과
    if(url.pathname=='/mod/choice/report.php')
    {
        $('div.downloadreport ul li').each(function(i){ if(i!=1) $(this).html(''); });

        var temp=$('div.downloadreport').clone();
        $('div.downloadreport').remove();$('h3').after(temp);
        $('div.downloadreport ul li input[type=submit].btn').css('color','#fff').css('background-color','#5cb85c').css('border-color','#4cae4c ').on("mouseover",function() { $(this).css('background-color','#449d44').css('border-color','#398439'); }).on("mouseout",function() { $(this).css('background-color','#5cb85c').css('border-color','#4cae4c'); });

        $('div.downloadreport').css('margin','0px');
        $('div.downloadreport ul li').css('float','right').css('margin-right','80px');

        var temp2=$('div.responseaction div.singleselect div').html();
        $('div.responseaction div.singleselect').remove();
        $('div.responseaction label').css('margin-left','10px').css('margin-right','10px').after(temp2);
        $('div.responseaction a').first().removeClass('btn-default').addClass('btn-info');
    }

    if(url.pathname=='/mod/choice/view.php' ||
        url.pathname=='/mod/choice/report.php' ||
            (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_choice')>0))
        {
            //학습활동 블록 숨김
            $('div.block-quick-mod').addClass('hidden');

            $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
            var link;
            $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
                if(i!=0) $(this).html('');
            });
        }

    /********************************************
        설문조사(activity_feedback)
    *********************************************/
    //설문조사
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=feedback')>-1) || isMForm.indexOf('mod_feedback')>0) )
    {
        $('#id_timinghdr').removeClass('collapsed'); //이용 기간 설정
        $('#fitem_id_email_notification').hide(); //응답결과 이에일 통지
        $("#id_autonumbering").val("1"); //설문 문항에 자동 번호 부여
        $('#id_feedbackhdr').removeClass('collapsed'); //설문조사 방법

        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }


    //설문조사 > 문항편집
    if(url.pathname=='/mod/feedback/edit_item.php')
    {
        if($("input[name=typ]").attr("value") == 'multichoice' )
        {    //선다 typ=multichoice
            $("#id_hidenoselect").val("1");
            $('#fitem_id_hidenoselect').hide();
        } else if($("input[name=typ]").attr("value") == 'multichoicerated' )
        {    //선다(등급) typ=multichoicerated
            $("#id_hidenoselect").val("1");
            $('#fitem_id_hidenoselect').hide();
        } 
    }
    
    //설문조사 >  응답보기
    if(url.pathname=='/mod/feedback/show_entries.php' && url.search.indexOf('do_show=showentries')>-1 )
    {
        $(".initialbar.firstinitial").hide();
        $(".initialbar.lastinitial").hide();
    }

    /********************************************
            팀플평가(activity_ubpeer)
    *********************************************/
    //팀플평가
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=ubpeer')>-1) || isMForm.indexOf('mod_ubpeer')>0) )
    {
        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    if(url.pathname=='/mod/ubpeer/view.php' ||
            url.pathname=='/mod/ubpeer/evaluation.php' || 
            url.pathname=='/mod/ubpeer/options.php' || url.pathname=='/mod/ubpeer/result.php' || 
            url.pathname=='/mod/ubpeer/status.php' || 
            (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_ubpeer')>0))
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');
        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
            if(i!=0) $(this).html('');
        });
    }


    /********************************************
            채팅방(activity_ubchat)
    *********************************************/
    //채팅방
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=ubchat')>-1) || isMForm.indexOf('mod_ubchat')>0) )
    {
        // 버튼 삭제
        $('#id_submitbutton2').hide(); 
    }

    if(url.pathname=='/mod/ubchat/view.php' ||
        (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_ubchat')>0))
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');

        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
                if(i!=0) $(this).html('');
        });
    }

    /********************************************
            토론방(activity_forum)
    *********************************************/
    //토론방
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=forum')>-1) || isMForm.indexOf('mod_forum')>0) )
    {
        $('#id_name').after('<div style="color:#b92626;">[토론기간설정]은 페이지 아래 <b>[접근제한] > [날짜]</b> 에서 기간형성을 하시기 바랍니다.</div>'); //기본 > 문구 추가
        $('#id_attachmentswordcounthdr').hide(); // 첨부파일 및 단어 수

        $('#id_forcesubscribe').val('3');  //구족 및 추적 > 구독 옵션
        if(url.hostname !== 'www.learnus.org') {
            $('#id_subscriptionandtrackinghdr').hide(); //구독 및 추적
        }

        //게시한도 및 차단
        $('#id_blockafterheader').hide();

        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    //토론방 글쓰기
    if(url.pathname=='/mod/forum/post.php')
    {
        // $('#fitem_id_discussionsubscribe').hide();
        // $('#fitem_id_mailnow').hide();
    }

    //토론방 보기
    if(url.pathname=='/mod/forum/view.php')
    {
        $('td.lastpost, th.lastpost').css('width','170px'); //최종 활동 시간

    }
    if(url.pathname=='/mod/forum/view.php' ||
        url.pathname=='/mod/forum/post.php' || 
        url.pathname=='/mod/forum/discuss.php' ||
            (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_forum')>0))
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');
        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
		if (url.hostname != 'snowboard.sookmyung.ac.kr' && url.hostname != 'ecampus.kookmin.ac.kr')
		{
			var link;
			$("li",$('#settingsnav li.type_setting ul')).each(function(i) {
				if(i!=0) $(this).html('');
			});
		}

    }


    /********************************************
            게시판(activity_ubboard)
    *********************************************/
    //게시판
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=ubboard')>-1) || isMForm.indexOf('mod_ubboard')>0) )
    {
        $('#id_etc_settings').removeClass('collapsed');

        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    if(url.pathname=='/mod/ubboard/view.php' || url.pathname=='/mod/ubboard/article.php' || url.pathname=='/mod/ubboard/modify.php' || url.pathname=='/mod/ubboard/write.php' || url.pathname=='/mod/ubboard/category.php' || url.pathname=='/mod/ubboard/category_modify.php' || (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_ubboard')>0))
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');

        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
            link=$(this).find('a').attr('href');
            if(link.indexOf('/admin/roles/assign.php')>-1||link.indexOf('/admin/roles/check.php')>-1||link.indexOf('/filter/')>-1||link.indexOf('/report/log/')>-1||link.indexOf('/backup/')>-1) { $(this).html(''); }
        });
    }

    /********************************************
            위키(activity_wiki)
    *********************************************/
    //wiki
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=wiki')>-1) || isMForm.indexOf('mod_wiki')>0) )
    {
        $('#id_wikifieldset').hide(); //형식

        // 버튼 삭제
        $('#id_submitbutton2').hide();
    }

    //wiki 편집
    if(url.pathname=='/mod/wiki/edit.php')
    {
        $('#fgroup_id_buttonar #save').css('color','#fff').css('background-color','#337ab7 ').css('border-color','#2e6da4').on("mouseover",function() { $(this).css('background-color','#286090').css('border-color','#204d74');  }).on("mouseout",function() { $(this).css('background-color','#337ab7').css('border-color','#2e6da4');  });
        $('#fgroup_id_buttonar #preview').css('color','#fff').css('background-color','#5bc0de ').css('border-color','#46b8da ').on("mouseover",function() { $(this).css('background-color','#31b0d5').css('border-color','#269abc');  }).on("mouseout",function() { $(this).css('background-color','#5bc0de').css('border-color','#46b8da');  });
        
    }

    //wiki 파일
    if(url.pathname=='/mod/wiki/files.php')
    {
        //파일이 등록되었을 경우
        $('#ygtv0').css('margin-top','20px').css('margin-bottom','20px').css('padding-bottom','20px').css('border-bottom','1px solid #D9D9D9');
        $('div.box div.generalbox').css('text-align','center').css('margin-top','20px').css('margin-bottom','20px');
        $('div.singlebutton').css('text-align','center');
        $('div.singlebutton input[type=submit].btn').css('color','#fff').css('background-color','#5cb85c').css('border-color','#4cae4c').on("mouseover",function() { $(this).css('background-color','#449d44').css('border-color','#398439'); }).on("mouseout",function() { $(this).css('background-color','#5cb85c').css('border-color','#4cae4c'); });
    }    

        if(url.pathname=='/mod/wiki/view.php' || url.pathname=='/mod/wiki/edit.php' || 
        url.pathname=='/mod/wiki/comments.php' || url.pathname=='/mod/wiki/editcomments.php' || 
        url.pathname=='/mod/wiki/history.php' || url.pathname=='/mod/wiki/diff.php' || 
        url.pathname=='/mod/wiki/map.php' || url.pathname=='/mod/wiki/files.php' || url.pathname=='/mod/wiki/filesedit.php' || 
        url.pathname=='/mod/wiki/admin.php' || (url.pathname=='/course/modedit.php' && isMForm.indexOf('mod_wiki')>0))
        {
            //학습활동 블록 숨김
            $('div.block-quick-mod').addClass('hidden');

            $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
            var link;
            $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
                if(i!=0) $(this).html('');
            });
        }

    /********************************************
            턴잇인(activity_turnitin)
    *********************************************/
    // 턴잇인
        if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=turnitintooltwo')>-1) ||  ( isMForm.indexOf('mod_turnitintooltwo')>-1 ) ))
        {
            // var text_ko="학생들에게 포털에서 메일을 등록하도록 안내해 주세요.";
            // var text_en="Please ask students for their e-mail uploaded at Portal.";
            // $('#fitem_id_name').before('<div class="alert alert-danger">'+ text +'</div>');
            $('#id_reportgenspeed').val('2');

            // 버튼 삭제
            $('#id_submitbutton2').hide();
        }

    /********************************************
        파일(resource_file)
    *********************************************/
    // 파일
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=ubfile')>-1) ||  ( isMForm.indexOf('mod_ubfile')>-1 ) ))
    {
        // if(url.hostname != 'lms.sch.ac.kr'){
        //     $('#fitem_id_download > .fselectyesno').append('<div style="color:red; margin-top:10px;">문서의 용량이 15MB 이상인 경우 문서 변환이 원활하지 않을 수 있습니다.</div>')	// 문구추가
        // }
        // $('#fitem_id_showsize').hide();
        // $("#fitem_id_showtype").hide();
        setTimeout(function(){ $('div.moreless-actions').hide(); }, 3000); //더보기

        $('#id_submitbutton').hide();
    }
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=resource')>-1) ||  ( isMForm.indexOf('mod_resource')>-1 ) ))
    {
        $('#id_optionssection').hide();
        $('#id_submitbutton').hide();
    }

    /********************************************
        URL 링크(resource_url)
    *********************************************/
    // URL 링크
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=url')>-1) || isMForm.indexOf('mod_url')>0) )
    {
        $('#id_optionssection').hide(); //화면 구성
        $('#id_parameterssection').hide(); //URL 변수
        $('#id_submitbutton').hide(); //저장 후 확인
    }


    /********************************************
        폴더(resource_folder)
    *********************************************/
    // 폴더
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=folder')>-1) || isMForm.indexOf('mod_folder')>0) )
    {
        $('#fitem_id_files label').text('파일선택');
        $('#fitem_id_display').hide();
        $('#fitem_id_showexpanded').hide();
        $('#id_submitbutton').hide();
    }

    if(url.pathname=='/mod/folder/view.php')
    {
        //학습활동 블록 숨김
        $('div.block-quick-mod').addClass('hidden');

        // 고급 설정 > 폴더 관리
        $($("li",$("#settingsnav ul")).get(0)).css('background-color','#F5EFD7');
        var link;
        $("li",$('#settingsnav li.type_setting ul')).each(function(i) {
            link=$(this).find('a').attr('href');
            if(link.indexOf('/admin/roles/')>-1||link.indexOf('/filter/')>-1||link.indexOf('/report/log/')>-1||link.indexOf('/backup/')>-1) { $(this).html(''); }
        });
         
        // Download folder 버튼
        $('div.singlebutton input[type=submit]').css('color','#fff').css('background-color','#5bc0de ').css('border-color','#46b8da ').on("mouseover",function() { $(this).css('background-color','#31b0d5').css('border-color','#269abc');  }).on("mouseout",function() { $(this).css('background-color','#5bc0de').css('border-color','#46b8da');  });
        
    }

    /********************************************
        동영상(resource_vod)
    *********************************************/
    //vod
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=vod')>-1) || isMForm.indexOf('mod_vod')>0) )
    {
        // $('#id_showplaytime').prop('checked', true); // 화면 구성 > 재생시간 표시
        $('#fitem_id_showsize').hide();
        $('#fitem_id_showplaytime').hide();
        $('#id_vod_popup').addClass('collapsed'); // 화면구성 닫힘 상태
        $('#id_submitbutton').hide(); //저장 후 확인
    }

    /********************************************
        econtents (resource_econtents)
    *********************************************/
    // econtents
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=econtents')>-1) || isMForm.indexOf('mod_econtents')>0) )
    {
        $('#id_submitbutton').hide();
    }

    /********************************************
        콘텐츠 제작도구
    *********************************************/
    if(url.pathname=='/course/modedit.php' && ( (url.search.indexOf('?add=xncommons')>-1) || isMForm.indexOf('mod_xncommons')>0) )
    {
        // 버튼 삭제
        $('#id_submitbutton').hide(); 
    }

    /********************************************
        팀 설정
    *********************************************/
    // 팀설정 
    if(url.pathname=='/group/autogroup.php'){
        $("#fitem_id_groupid").hide();
        $("#fitem_id_notingroup").hide();
        // $("#showimportgroups").hide(); // 팀가져오기
    }

    /********************************************
        강좌설정
    *********************************************/
    //이수과정 추적
    if(url.pathname=='/local/ubion/setting/course.php'){
        $("#enablecompletion").parent().parent().hide();
    }

    /********************************************
        고급강좌관리
    *********************************************/
    //고급 > 설정
    if(url.pathname=='/course/edit.php'){
        $("#id_descriptionhdr").hide(); //설명
        $("#id_courseformathdr").hide(); //강좌 형식
        $("#fitem_id_lang").hide();
    }

    /********************************************
        성적부
    *********************************************/

    // 카테고리 설정
    if(url.pathname=='/grade/edit/tree/index.php')
    {
        $('#gradetreeform .generaltable .gradeitemdescription').hide();
        $('#gradetreeform .generaltable .textmenu').html('<img src="/theme/image.php/coursemosv2/core/1468025184/i/settings" />');
        $('#gradetreeform .generaltable .column-actions').css('text-align','center');
    }

    // 개인성적표
    if(url.pathname=='/grade/report/user/index.php')
    {
        $('.gradeitemdescription').hide();
    }

    // 성적이력
    if(url.pathname=='/grade/report/history/index.php'){
        $('#mform2 fieldset div.fitemtitle').css('width','200px');
    }

    // 환경설정
    if(url.pathname=='/grade/edit/settings/index.php'){
        $('#id_general').hide(); //기본 설정
        $('#fitem_id_report_user_showgrade').hide(); //최종성적 공개
    }

    // 성적항목관리>성적부설정
        if(url.pathname=='/grade/report/grader/preferences.php'){
            $('#id_prefshow').hide(); //보고서 도구
            $('#id_prefrows').hide(); //특별 행
        }

    // 척도
    if(url.pathname=='/grade/edit/scale/edit.php'){
        $('#fitem_id_standard').hide();
        $('#fitem_id_description_editor').hide(); //설명
    }

    // 가져오기 > csv, 수동등록
    if(url.pathname=='/grade/import/csv/index.php' || url.pathname=='/grade/import/direct/index.php')
    {
        $('#fitem_id_verbosescales').hide(); //verbose 척도
        $('#fitem_id_previewrows').hide(); // 행으로 미리보기
        $('#fitem_id_forceimport').hide();

        $('#id_mapto').val("useridnumber").prop("selected", true);
        $('#fitem_id_mapto').hide();
    }

    // 내보내기
    if(url.pathname=='/grade/export/xls/index.php')
    {
        $('.tabs-sub').hide();
        $('#fitem_id_export_feedback').hide();
        $('#fitem_id_export_onlyactive').hide();
    }

	// *****************************************************************************
    // 공통
    // *****************************************************************************
	switch (url.pathname) {
		case '/course/modedit.php':
			$('#id_vod_select').before('<br><div style="font-weight:bold; color:red; margin-bottom:0.5rem;">※ 학습기간 도중, 동영상 변경 시, 진도 기록이 모두 초기화 되므로 주의해 주시기 바랍니다.</div>');
		break;

        //과제 제출하기
		case '/mod/assign/view.php':
			// if (url.search.indexOf('&action=editsubmission')>-1) {
			// 	var text_ko = "[저장] 버튼을 클릭 시 최종 과제 제출일이 업데이트 되오니 주의하세요.";
            //     var text_en = "Please note that clicking [Save changes] changes the latest submission date.";
			// 	if($('#id_submitbutton').val()=='저장') { 
			// 		$('#fgroup_id_buttonar div.fgroup').append("<div style='margin-top:10px;margin-left:5px;color:#d9534f;font-weight:bold;'>"+text_ko+"</div>"); 
			// 	} else {
			// 		$('#fgroup_id_buttonar div.fgroup').append("<div style='margin-top:10px;margin-left:5px;color:#d9534f;font-weight:bold;'>"+text_en+"</div>"); 
			// 	}
			// }
        break;
    }
    

    // *****************************************************************************
	// 연세대학교(운영)
	// *****************************************************************************
	// (Made By #ellena)
    if(url.hostname == 'www.learnus.org') {
		switch (url.pathname)
		{
            //강좌 가져오기
            case '/backup/import.php': 
                if($('#page-backup-import').length >0) {
                    var excludes = [
                        "jinotechboard",
                        "textbook",
                        "teamboard",
                        "jinoforum",
                        "lcms",
                        "commons",
                        "alrs",
                        "chat"
                    ]
                    
                    $("#id_coursesettings .form-check-input").each(function(idx, val){
                        var name = $(this).attr("name");
                        var checkBox = $(this);
                        $.each(excludes, function(idx, val){
                            var isExists = name.includes(val);
                            if(isExists){
                                $(checkBox).attr('checked',false).attr('disabled','true');
                            }
                        })
                    
                    });
                }
            break;

            case '/course/modedit.php':

                //동영상, 이러닝콘텐츠
                if($('#page-mod-vod-mod').length > 0 || $('#page-mod-econtents-mod').length > 0){
                    //활동이수 > 성적 필수 옵션
                    $("#id_completionusegrade").prop('checked', false).attr('disabled', 'disabled');
                    setTimeout(function(){ $('#id_activitycompletionheader .fcontainer .form-group').eq(2).remove();}, 3000);
                }

                //퀴즈
                if($('#page-mod-quiz-mod').length > 0){
                    //응시에의 추가 제한 > 더보기 
                    $("#id_security .advanced").addClass("show");
                    setTimeout(function(){ 
                        $("#id_security .moreless-toggler").remove();
                    }, 2000);

                    //기타 설정 > 식별번호
                    $('#fitem_id_cmidnumber').show();
                }

                //과제
                if($('#page-mod-assign-mod').length > 0) {
                    //기타 설정 > 식별번호
                    $('#fitem_id_cmidnumber').show();
                }

            break;
            case '/mod/feedback/show_entries.php':
                if($('#page-mod-feedback-show_entries').length > 0){
                    // 설문조사 > 응답보기 - 글자수 체크
                    $('.generaltable tbody tr').each(function(key, val){
                        if( $(this).attr('class') != "emptyrow" ){
                            $(this).children('td').each(function(key, val){
                                if(key != 0 && $(val).text() != "" ){
                                    if($(val).text().length > 1){
                                        var tmpText = $(val).text() + " (" + $(val).text().replace(/ /gi, '').length + ")";
                                        $(val).text(tmpText);
                                    }
                                }
                            })
                        }
                    
                    });
                }
            break;
            case '/mod/feedback/complete.php':
                if($('#page-mod-feedback-complete').length > 0){
                    // 설문조사 > 응시화면 - 글자수 체크
                    var boxWidth = $('#feedback_complete_form .feedback-item-textarea .col-md-9 textarea').width();
                    
                    var lengthBox = "<div>글자 수 : <span id='text-cnt'>0</span></div>";
                    lengthBox = $.parseHTML(lengthBox);
                    
                    $(lengthBox).css('width',boxWidth + "px");
                    $(lengthBox).css('text-align',"center");
                    $(lengthBox).css('margin-left',"2rem");
                                      
                    $('#feedback_complete_form .feedback-item-textarea .col-md-9').after(lengthBox);     
                    
                    //글자수 카운트
                    $('#feedback_complete_form .feedback-item-textarea .col-md-9 textarea').keyup(function (e){
                        var content = $(this).val();
                        var contentLength = content.replace(/ /gi, '').length;
                        // console.log(contentLength);
                        $(this).parent().next().children('span').html(contentLength);
                    });
                }
            break;
            case '/mod/assign/view.php':
                if($('#page-mod-assign-grading').length > 0 ){
                    // 과제 평가 > 이메일 칼럼 숨김
                    $('#mform3 .box .no-overflow .flexible thead tr th.column-email').hide();
                    $('#mform3 .box .no-overflow .flexible tbody tr td.column-email').hide();

                    // 과제 평가 > 파일 명 표시
                    setTimeout(function(){
                        $('#mform3 .box .no-overflow .flexible tbody tr td .ygtvcontent a').each(function(key, val){
                            $(this).after('<div>'+ $(val).text() + '</div>');
                        });
                    }, 1000);
                }
                if($('#page-mod-assign-grade').length > 0 ){
                    // 과제 평가 > 이미지 첨부 버튼 숨김
                    setTimeout(function(){
                        $('#fitem_id_assignfeedbackcomments_editor .editor_atto_toolbar .files_group .atto_image_button').hide();
                    }, 1000);
                }
            break;
            case '/mod/quiz/attempt.php':
                if($('#page-mod-quiz-attempt').length > 0 ){
                    // 퀴즈 응시 중 선다형 다답/단답 문제  안내문구 숨김
                    $('#responseform .ablock .prompt').each(function(key, val){
                        // console.log(this);
                        $(this).hide();
                    });
                }
            break;
            case '/mod/quiz/review.php':
                if($('#page-mod-quiz-review').length > 0 ){
                    // 퀴즈 응시 중 선다형 다답/단답 문제  안내문구 숨김
                    $('#page-content .ablock .prompt').each(function(key, val){
                        // console.log(this);
                        $(this).hide();
                    });
                }
            break;
            case '/course/edit.php':
                if($('#page-course-edit').length > 0 ){
                    // 기본 > Course end date 옵션 숨김
                    $('#fitem_id_enddate').hide();
                }
            break;
		}
    }
    // *****************************************************************************
	// 전주대학교(운영)
	// *****************************************************************************
	// (Made By #ellena)
    if(url.hostname == 'cyber.jj.ac.kr') {
		switch (url.pathname)
		{
            case '/question/question.php':
                // 빈칸채우기
                if($('#page-question-type-multianswer').length > 0){
                    $('#id_generalheader').after('<div class="form-group row  fitem"><div class="col-md-3 col-form-label d-flex justify-content-md-end">표현식 예시</div><div class="col-md-9 form-inline felement">단답형 예시) 글로벌 공통표준언어는 {1:SHORTANSWER:%100%영어#정답 ~%100%english#정답} 입니다.<br/>선다형 예시) 글로벌 공통표준언어는 ﻿{1:MULTICHOICE:%100%영어#정답 ~%100%english#정답~미국#오답}입니다.</div></div>');
                }
            break;

            case '/course/modedit.php':
                if($('#page-mod-vod-mod').length > 0){
                    // $('#id_uploadcontentbtn').hide(); // 동영상 업로드
                    // $('#id_selectcontentbtn').hide(); // 동영상 선택

                    // $('#id_selectcontentbtn').on('click',function(){
                    //     $('#vod-hd').parent().parent().parent().on('shown.bs.modal', function (e) {
                    //         $('#vod-bd .vod_list .vod_upload .upload .btn-vod-upload').hide();
                    //     });
                    // })
                }
            break;
		}
    }
    

});

$.GET = function(name){ // Don't Confuse between php = $_GET '[]' this $.GET '()' 
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}