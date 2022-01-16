$(document).ready(function(){

    var url = window.location.hostname;
    var path = document.location.pathname;

    if(path == '/course/view.php'){
        getCsmsCode();


    }


});


function getCsmsCode(){
    var lang = $("html").attr('lang');
    console.log(lang)
    var btnLabel = "레코더";
    if(lang == "en"){
        btnLabel = "Lecoder";
    }
    $.ajax({
        url: "/local/csmsmedia/apis/getCMCode.php",
        //data: data,
        dataType : "json",
        async: true,
        success: function(data){
           
            if(data.code == 100){
                var btnExists = $(".buttons .course-edit").length;
                if(btnExists){
                    var btnExtVodLink = $(".buttons .course-edit").clone();
                    $(".buttons .course-edit").before(btnExtVodLink);
                    $(btnExtVodLink).find('form').attr('action','https://lecoder.kr/ko/launcher/?from=' + data.org_code);
                    $(btnExtVodLink).find('form').attr('target','_blank');
                    $(btnExtVodLink).find('.btn-default').css('margin-right','6px');
                    $(btnExtVodLink).find('.btn-default').css('background', "url('https://s3.ap-northeast-2.amazonaws.com/code.coursemos.co.kr/csmsmedia/src/btn_play.png') no-repeat center 12px #e61e61");
                    $(btnExtVodLink).find('.btn-default').val(btnLabel);
                }else{
                    switch(window.location.hostname){
                        case "plms.postech.ac.kr":
                        
                            var btnExtVodLink = "<div class='btn-leecoder'><a ><div class='btn btn-default'>" + btnLabel + "</div></a> </div>";
                            btnExtVodLink = $.parseHTML(btnExtVodLink);
        
                            $(".share-button").before(btnExtVodLink);
                            $(btnExtVodLink).find('a').attr('href','https://lecoder.kr/ko/launcher/?from=' + data.org_code);
                            $(btnExtVodLink).find('a').attr('target','_blank');
                            //$(btnExtVodLink).find('.btn-default').css('margin-right','6px');
                            $(btnExtVodLink).find('.btn-default').css('background', "url('https://s3.ap-northeast-2.amazonaws.com/code.coursemos.co.kr/csmsmedia/src/btn_play.png') no-repeat center 11px #e61e61");
                            $(btnExtVodLink).find('.btn-default').val(btnLabel);
        
                            $(btnExtVodLink).find('.btn-default').css('border-radius','50%');
                            $(btnExtVodLink).find('.btn-default').css('font-size','11px');
                            $(btnExtVodLink).find('.btn-default').css('color','white');
                            $(btnExtVodLink).find('.btn-default').css('border','0px');
                            $(btnExtVodLink).find('.btn-default').css('padding','32px 10px 10px');
                            $(btnExtVodLink).find('.btn-default').css('width','52px');
                            $(btnExtVodLink).find('.btn-default').css('height','52px');
                            $(btnExtVodLink).find('.btn-default').css('margin-bottom','4px');
                            $(btnExtVodLink).find('.btn-default').css('margin-bottom','4px');
                        break;
                        case "www.learnus.org":
                            var btnExtVodLink = $(".course-header-container .course-edit").clone();
                            $(".course-header-container .course-edit").after(btnExtVodLink);
                            $(btnExtVodLink).find('form').attr('action','https://lecoder.kr/ko/launcher/?from=' + data.org_code);
                            $(btnExtVodLink).find('form').attr('target','_blank');
                            $(btnExtVodLink).find('.btn-secondary').css('margin-right','');
                            $(btnExtVodLink).find('.btn-secondary').css('background', "url('https://s3.ap-northeast-2.amazonaws.com/code.coursemos.co.kr/csmsmedia/src/btn_play.png') no-repeat center 11px #e61e61");
                            $(btnExtVodLink).find('.btn-secondary').css('bottom', "120px");
                            $(btnExtVodLink).find('.btn-secondary').css('font-size', "9px");
                            $(btnExtVodLink).find('.btn-secondary').val(btnLabel);
                            $(btnExtVodLink).find('.btn-secondary').html(btnLabel);
                            $(".course-edit").css('float','right');
                            $(".course-edit").css('margin-left','6px');
                        break;
                        case "pnucm35.moodler.kr":
                            var btnExtVodLink = $(".course-header-container .course-edit").clone();
                            $(".course-header-container .course-edit").after(btnExtVodLink);
                            $(btnExtVodLink).find('form').attr('action','https://lecoder.kr/ko/launcher/?from=' + data.org_code);
                            $(btnExtVodLink).find('form').attr('target','_blank');
                            $(btnExtVodLink).find('.btn-secondary').css('margin-right','');
                            $(btnExtVodLink).find('.btn-secondary').css('background', "url('https://s3.ap-northeast-2.amazonaws.com/code.coursemos.co.kr/csmsmedia/src/btn_play.png') no-repeat center 11px #e61e61");
                            $(btnExtVodLink).find('.btn-secondary').css('bottom', "139px");
                            $(btnExtVodLink).find('.btn-secondary').css('font-size', "9px");
                            $(btnExtVodLink).find('.btn-secondary').val(btnLabel);
                            $(btnExtVodLink).find('.btn-secondary').html(btnLabel);
                            $(".course-edit").css('float','right');
                            $(".course-edit").css('margin-left','6px');
                        break;

                    }

                }


            }


        }		  
      });	

}