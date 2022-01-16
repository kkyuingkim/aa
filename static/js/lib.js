
function setCookie( name, value, expiredays ){
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name+"="+escape( value )+"; path=/;expires="+todayDate.toGMTString()+";"
}

function getCookie(Name) {
	var search = Name + "=";
	if (document.cookie.length > 0) {
	offset = document.cookie.indexOf(search);
	if (offset != -1) {
		offset += search.length;
		end = document.cookie.indexOf(";", offset);

		if (end == -1) end = document.cookie.length;
			return unescape(document.cookie.substring(offset, end));
		} else return false;
	} else return false;
}

// 폼체크 [DND FUNCTION]
// required="required" title="이름을 입력해주세요."
// radio,checkbox 는 네임값이 같으므로 네임값별로 한군데만 넣어준다
// radio,checkbox 필수입력값이 존재할때 alt테그로 경고문구를 넣어준다
// if(form_check('regForm','input')=="failed")return;
//타입을 여러개검색하고싶을때는 input/select/textarea 이런식으로해준다
function form_check(form_name,choice) {
	var mode_array = choice.split("/");
	var mode_len = mode_array.length;
	var result = "success";
	for (MF=0;MF<mode_len;MF++){
		var form_obj = $("form[name='"+form_name+"'] "+mode_array[MF]);
		var len = form_obj.length;
		if(result == "success" && len>0){
			for (F=0;F<len;F++){
				var obj = form_obj.eq(F);
				var plural_result="out";
				var plural_title="";
				if(obj.attr('required') && (obj.attr("type")=='radio' || obj.attr("type")=='checkbox')){
					var plural_len=$("input[name='"+obj.attr("name")+"']:checked").length;
					if(plural_len<=0)plural_result="in";
					if(obj.prop("alt")){
						if(obj.prop("checked")==false){
							plural_title=obj.attr("alt");
							plural_result="in";
						}
					}
				}
				if(obj.attr('required') && (obj.val()=='' || plural_result=='in')){
					var msg = (plural_title=="")?obj.attr('title'):plural_title;
					alert(msg);
					obj.focus();
					result = "failed";
					break;
				}
			}
		}
	}
	return result;
}
