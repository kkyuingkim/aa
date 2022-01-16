$(window).load(function(){
	conInit();
	foundPopSlide();
	$('.list_down').find('> ul > li .question').click(function(){
		$(this).parent().addClass('open')
		$(this).parent().siblings().removeClass('open');
		if(AgentFlag){
			$(this).next().stop(true).slideDown(300);

		}else{
			$(this).next().stop(true).show();

		}

	});


});//end ready

$(window).scroll(function() {

});//end scroll

$(window).resize(function(){

});//end resize


function conInit(){

	var Actions,Event,total,nTarget;
	var cur				=	0;
	var ncur			=	0;
	var cTarget			=	$('#page_data');
	var nTarget			=	$('.sub_nav_wrap');
	var item			=	[];
	var default_last_h  =   0;

	Init = {
		_start:function(){
			//console.log('init');
			/*************
			/	variable Add
			*************/
			total	=	cTarget.find('> section').length;
			/*
			default_last_h = cTarget.find('> section:eq('+(total-1)+')').height();
			if(cTarget.find('> section:eq('+(total-1)+')').height() < SH){
				cTarget.find('> section:eq('+(total-1)+')').css('height',SH);
			}
			*/


			/*************
			/	Event Add
			*************/

			cTarget.find('.btn_next a').click(function(){
				var _y = cTarget.find('> section:eq('+($(this).parents('section').index()+1)+')').offset().top;
				Actions._pageMove(_y);
			});


			if($('.sub_nav_wrap').length > 0){
				nTarget  = $('.sub_nav_wrap');
				nTarget.find('> ul > li').bind('mouseenter mouseleave click',function(event){

						if(event.type=='mouseenter'){
							//Event._navHandler($(this).index());
							//$(this).find('.info').show();
						}else if(event.type=='mouseleave'){
							//$(this).find('.info').hide();
							///Event._navHandler(ncur);
							//console.log('li out');

						}else{
							if(!$(this).hasClass('none')){
							var _y	=	cTarget.find('> section:eq('+($(this).index())+')').offset().top-120
							Actions._pageMove(_y);
							}
						}

				});
				nTarget.find('ul').mouseleave(function(){
					Event._navHandler(ncur);

				});

			}


			/*************
			/	Item Add
			*************/
			var _i = 0;
			cTarget.find('> section').each(function($index){
				var _t	=	$(this);
				item[$index] = {
					_data:_i,
					_target:_t,
					_moveFlag:true,
					_numArr:null,
					_init:function(){
						if(this._target.find('.number_format').length>0){
							item[$index]._numArr = new Array();
							var __i = 0;
							this._target.find('.number_format').each(function(){
								var __c = true
								if(item[$index]._data == 0){
									__c = false;
								}
								item[$index]._numArr[__i] = new numberTicker($(this),__c);
								__i++;
							});
						}
					},
					_play:function(_posY){
						var target	=	this._target;
						var f_t	=	target.position().top;
						var f_b	=	f_t+600;
						var p_y	=	_posY - f_t;
						var d_y;
						var target_w = target.width();
						var target_h = target.height();
						if(item[cur]._moveFlag){
							//content motion
							var __i = 0;
							target.find('.e_wrap').each(function(){
								var _d = __i*0.15
								TweenMax.to($(this),0.8,{y:0,alpha:1,delay:_d,ease:Quad.easeOut});
								__i++
							});

							if(this._data == 0){
								target.find('.obj_list li').each(function(){
									var _delay = $(this).index() * 0.3
									TweenMax.to($(this),0.8,{scale:1,alpha:1,delay:_delay,ease:Back.easeOut});
								});
							}else if(this._data == 1){

							}else if(this._data == 3){
								var i = 0
								target.find('.number_format').each(function(){
									var _delay = i * 0.1
									TweenMax.to($(this),0.8,{alpha:1,delay:_delay});
									i++
								});
								var k=0;
								for(k=0;k<item[this._data]._numArr.length;k++){
									item[this._data]._numArr[k]._reset();

								}
							}
						}
						this._moveFlag = false;
					},
					_reset:function(){
						var target	=	this._target;
						var target_w = target.width();
						var target_h = target.height();
						this._moveFlag = true
						target.find('.e_wrap').each(function(){
							TweenMax.set($(this),{y:50,alpha:0});
						});

						if(this._data == 0){
							target.find('.obj_list li').each(function(){
								TweenMax.set($(this),{scale:0.5,alpha:0});
							});
						}else if(this._data == 1){

						}else if(this._data == 3){
							target.find('.number_format').each(function(){
								TweenMax.set($(this),{alpha:0});
							});
						}

					}
				}
				item[$index]._init();
				item[$index]._reset();
				_i++
			});

			if(item&&item[cur]){
				item[cur]._play(npos);
			}
		}
	}//init End

	Actions = {
		_pageMove:function(targetY){
			$('html,body').stop().animate({scrollTop:targetY},600)
		},
		_pageHandler:function(_posY){

			if(item&&item[cur]){
				item[cur]._play(_posY);
			}
			if(_posY == 0){
				cTarget.find('> section').each(function($index){
					//item[$index]._reset();
				});
				//item[cur]._play(_posY);
			}

			if(_posY > 300&& SW > 0){
				nTarget.addClass('fix');
				$('.point_title').css('margin-top',103);
			}else{
				nTarget.removeClass('fix');
				$('.point_title').css('margin-top',0);
			}

		},
		_pageResize:function(){
			cTarget.find('> section').each(function($index){
				//item[$index]._reset();
			});
		}
	}//Actions End

	Event = {
		_navHandler:function(_n){
			//媛앹껜議댁옱�щ�
			if(nTarget){
				var _t		=	nTarget.find('ul > li:eq('+(_n)+')');
				_t.addClass('actived').siblings().removeClass('actived');
				//console.log(_t);
			}
		},
		_activeHandler:function(index){
			var _mb = SH-(SH/3)
			cTarget.find('> section').each(function(){
				if($(this).index() != total-1){
					if(index >= $(this).position().top-_mb && index <= $(this).next().position().top-_mb){
						cur = $(this).index();
					}
					if(index >= $(this).position().top && index <= $(this).next().position().top){
						ncur = $(this).index();
					}
				}else{
					if(index >= $(this).position().top-_mb){
						cur = $(this).index();
					}
					if(index >= $(this).position().top){
						ncur = $(this).index();
					}
				}
			});
			Event._navHandler(ncur);
		}
	}//Event End

	$(window).scroll(function() {
		npos = $(window).scrollTop();
		SW	=	$(window).width();
		SH	=	$(window).height();
		Event._activeHandler(npos);
		Actions._pageHandler(npos);
	});//end scroll

	$(window).resize(function(){
		SW	=	$(window).width();
		SH	=	$(window).height();
		Actions._pageResize();
	});//end resize
	Init._start();
	Event._activeHandler(npos);
	Actions._pageHandler(npos);
	$('#page_data').css('visibility','visible');

	list_target = getParameter("pageNum")
	if(list_target != ""){
		var _n = Number(list_target)
		var _y	=	cTarget.find('> section:eq('+(_n)+')').offset().top;
		setTimeout(function(){
			$('html,body').stop(true).animate({scrollTop:_y},300);
		},300);
	}

}//conInit End
