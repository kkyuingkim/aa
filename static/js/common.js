
/*메뉴슬라이드*/
$(function() {
$(window).scroll(function(){
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop != 0)
                        $('#header_wrap').stop().animate({'opacity':'1'},400);
                    else
                        $('#header_wrap').stop().animate({'opacity':'1'},400);
                });

                $('#header_wrap').hover(
                    function (e) {
                        var scrollTop = $(window).scrollTop();
                        if(scrollTop != 0){
                            $('#header_wrap').stop().animate({'opacity':'1'},400);
                        }
                    },
                    function (e) {
                        var scrollTop = $(window).scrollTop();
                        if(scrollTop != 0){
                            $('#header_wrap').stop().animate({'opacity':'1'},400);
                        }
                    }
                );
});





/*탭*/
  function show_tab(tabnum){
 var i;
 var tm = document.getElementById("tap_action").getElementsByTagName("li");
 var len = tm.length;
 var d = new Array(len);
 for(i=0; i<len; i++){
  d[i] = document.getElementById("tap_content"+i);
	d[i].style.display = (tabnum==i)?"":"none";
	tm[i].className = (tabnum==i)?"on":"";
 };
};



$.fn.navigation = function(options) {
	var $this = this;
	var config = $.extend(
		{
			header	: $("#header")					//헤더영역
		   ,depth1	: $(".lnb_1")					//첫번째뎁스
		   ,depth2	: $(".bg_navi")					//두번째뎁스
		   ,depth2_item: $(".bg_navi").find("a")	//닫기버튼
       ,dim : $("#lnb_dim")
           ,speed : 500								//모션스피드
		},options);
	return this.each(function(){
		//각각에 메뉴에 오버하거나 포커스가 가면 네비열림
		$this.each(function(){
			var is_nav = false;
			config.depth1.on("focusin mouseover", function(e){
				var target = $(e.currentTarget);
				var idx = target.index()+1;
				config.depth1.removeClass("on");
				$(".lnb"+idx).addClass("on");
				if(is_nav == true){return;};
				// config.depth2.css({"height":"311px","background":"#ffffff", "border-bottom":"0px solid #275cab"}).slideDown(config.speed);
        config.depth2.stop().animate({
          height:"350px",
          backgroundColor:"#fff",
        },200);

				config.depth2.find("li.bgn").hide();
				config.depth2.find("li.bgn"+idx).show();
				config.depth1.find("ul").slideDown(config.speed, function(){
					is_nav = false;
				});

			})
		})
		//헤더영역에서 마우스가 나가면 네비게이션닫힘
		config.header.on('mouseleave', function(){
      config.depth1.removeClass("on");
			config.depth1.find("ul").stop().slideUp(200);
			// config.depth2.stop().slideUp();
      config.depth2.stop().animate({
        height:"100px",
        backgroundColor:"transparent"
      },200);

		});
		//네비닫기 버튼을 클릭하면 네비게이션닫힘
		config.depth2_item.on('click', function(){
			config.depth1.removeClass("on");
			config.depth1.find("ul").stop().slideUp();
			config.depth2.stop().slideUp();
		});

	}); // return each
};




$(document).ready(function() {
	//모바일메뉴바스크립트
	// $(".mobile_menu_area").css( "display","none");
	// $(".menu_btn").click(function (){
	// 	$(".mobile_menu_area").slideToggle("fast");
	// });
	// $(".menu_close").click(function (){
	// 	$(".mobile_menu_area").slideToggle("fast");
	// });
  //모바일메뉴바스크립트


$(".mobile_menu_area").css( "display","none");
$(".menu_btn").click(function (){
  $(".mobile_menu_area").fadeIn("slow");
  $(".my_menu").css("margin-right","0px");
  $(".my_menu").css("transition","0.5s");
  $("header").unbind('touchmove');
  $("body").bind('touchmove', function(e){e.preventDefault()});
  // $('body').on('scroll touchmove mousewheel', function(e){
  //       e.preventDefault();
  //       e.stopPropagation();
  //       return false;
  //     });
});
$(".menu_close").click(function (){
  $(".mobile_menu_area").fadeOut("slow");
  $(".my_menu").css("margin-right","-300px");
  $(".my_menu").css("transition","1s");
  $("body").unbind('touchmove');
  // $('body').on(' touchmove', function(e){
  //
  //     });
});

	$(".mobile_lnb .depth1").click(function (){
		var vol = $(".mobile_lnb .depth1").index(this);
		var height_tmp = $(".mobile_lnb .depth2 li").css("height").replace("px","");
		var obj = $(".mobile_lnb .depth2:eq("+vol+")");
		var len = $(".mobile_lnb .depth2:eq("+vol+") li").length;
		var check = ( obj.css("height").replace("px","") * 1 );
		if(check==0){
			obj.animate( {height:((height_tmp*len)+(len-1))+"px"} ,'500');
			$(".mobile_lnb .depth2").not(":eq("+vol+")").animate( {height:0} ,'500');
		}else {
			obj.animate( {height:0} ,'500');
		}
	});


	//패밀리사이트
	$(".select_tit").click(function (){
		var height_tmp = $(".select_list li").css("height").replace("px","");
		var len = $(".select_list li").length;
		if($(".select_list").css("height")=="0px"){
			$(".select_list").animate( {height:((height_tmp*len)+(len-0))+"px"} ,'200');
		}else {
			$(".select_list").animate( {height:"0px"} ,'200');
		}
	});



		//계열사 셀렉트
	$(".select_smenu").click(function (){
		var height_tmp = $(".select_smenu_list li").css("height").replace("px","");
		var len = $(".select_smenu_list li").length;
		if($(".select_smenu_list").css("height")=="0px"){
			$(".select_smenu_list").animate( {height:((height_tmp*len)+(len-1))+"px"} ,'200');
		}else {
			$(".select_smenu_list").animate( {height:"0px"} ,'200');
		}
	});






});

//익스플로러버전
function getInternetExplorerVersion() {
         var rv = -1; // Return value assumes failure.
         if (navigator.appName == 'Microsoft Internet Explorer') {
              var ua = navigator.userAgent;
              var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null){
     if(ua.match("Trident\/([4]\.[0])")){
      rv = parseFloat(8);
     }else if(ua.match("Trident\/([5]\.[0])")) {
      rv = parseFloat(9);
     }else if(ua.match("Trident\/([6]\.[0])")) {
      rv = parseFloat(10);
     }else{
      rv = parseFloat(RegExp.$1);
     }
    }
             }
    if(rv!=-1){
    return rv;
    }else{
    return "";
    }
}





function number_format(input){
 var input = String(input);
 var reg = /(\-?\d+)(\d{3})($|\.\d+)/;
 if(reg.test(input)){
 return input.replace(reg, function(str, p1,p2,p3){
 return number_format(p1) + "," + p2 + "" + p3;
 }
 );
 }else{
 return input;
 }
 }
