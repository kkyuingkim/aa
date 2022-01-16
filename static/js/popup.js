function popup(name,url,width,height,top,left)
{
	if (getCookie( name ) != 'done' ) {
	window.open(url,name,'width='+width+',height='+height+',top='+top+',left='+left+',resizable=no,scrollbars=no');
	}
	return;
}

function divPopup(no,name,imgUrl,linkUrl,blank,width,left,top){
	var clientWidth = document.documentElement.clientWidth;
	var bodyWidth = 980;
	var leftMargin = (parseInt(clientWidth) - parseInt(bodyWidth)) / 2;

	//left = leftMargin + parseInt(left);

	if (getCookie( name ) != 'done' ) {
	document.write("\
	<div id='"+name+"' style='position:absolute;width:"+width+";left:"+left+"px;top:"+top+"px;z-index:9999'>\
	  <form name='div_popform_"+no+"'>\
		<div>\
	");
	if(imgUrl != ""){
		if(linkUrl!=""){
			linkUrl = "http://"+linkUrl;
			if(blank == "1") document.write("<p><a href='"+linkUrl+"' target=_blank>");
			else document.write("<p><a href='"+linkUrl+"'>");
		}else {
			document.write("<p><a href='javascript:void(0);'>");
		}
	} else document.write("<p>");
	document.write("<img src='"+imgUrl+"'></a></p>");
	document.write("\
			<div style='width:"+width+";' class='pop_bar'>\
			  <div style='background:#333333;padding-top:5px'>\
				<input type='checkbox' name='checkbox' value='checkbox'> <a href='javascript:closePopWin("+no+");'><img src='../popup/today_no.gif'></a>\
				<a href='javascript:closePopWin("+no+");'><img src='../popup/close.gif'></a>\
			  </div>\
			</div>\
		</div>\
	  </form>\
	</div>\
	");
	}
}

function setCookie( name, value, expiredays ) { 
    var todayDate = new Date(); 
        todayDate.setDate( todayDate.getDate() + expiredays ); 
        document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";" 
} 

function getCookie( name )
{
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie )
		{
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
		break;
	}
	return "";
}

function closePopWin(no) { 
	var popForm = eval("document.div_popform_"+no);
	var divpop = eval("divpop_"+no);
	if ( popForm.checkbox.checked ){ 
        setCookie( "divpop_"+no, "done" , 7 ); 
    } 
    divpop.style.display = "none"; 
}
