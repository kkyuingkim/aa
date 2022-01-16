
             function iGetPoint(addr, flag){

 var geocoder = new google.maps.Geocoder();

            geocoder.geocode(

      { 'address': addr },

      function (results, status) {

       var lat = "" ; //위도

    var lng = "" ; //경도

    var user_lat = document.getElementById('user_lat').value;
    var user_lng = document.getElementById('user_lng').value;

          if (results != "" || (user_lat!="" && user_lng!="") ) {

			if(user_lat!="" && user_lng!=""){

              lat = user_lat;

              lng = user_lng;

			}else {

              var location = results[0].geometry.location;

              lat = location.lat();

              lng = location.lng();

			}


              if(lat == "" || lng == "")

     {

      $("#googleMapLayer").hide() ;

      alert("위치를 지도에서 찾을수 없습니다.") ;

     }

     else

     {

      $("#googleMapLayer").show() ;

      var myLatlng = new google.maps.LatLng(lat, lng);

      var myOptions = {

       zoom: 15,

       center: myLatlng,

       mapTypeControl: true, // 지도,위성,하이브리드 등등 선택 컨트롤 보여줄 것인지

       scaleControl: false, // 지도 축적 보여줄 것인지.

       navigationControl: true, // 눈금자 형태로 스케일 조절하는 컨트롤 활성화 선택.

       navigationControlOptions: { 

        position: google.maps.ControlPosition.TOP_RIGHT,

        style: google.maps.NavigationControlStyle.DEFAULT // ANDROID, DEFAULT, SMALL, ZOOM_PAN

       },

       scrollwheel: false, //스크롤로 이미지확대,축소

       mapTypeId: google.maps.MapTypeId.ROADMAP

       }

       globalMap = new google.maps.Map(document.getElementById("map_canvas"), myOptions) ;

       google.maps.event.addListener(globalMap, 'click',function(event){

        placeMarker(event.latLng) ;

       }) ;

       $(".jLat").val(lat) ; 

       $(".jLng").val(lng) ; 

       var latLngCls = new google.maps.LatLng(lat,lng) ;

       placeMarker(latLngCls) ;

       static_lat = lat ; //전역 위도 

       static_lng = lng ; //전역 경도

       static_flag = flag ;

      

     }

          }

      });

             }


             //단일매장?

             function placeMarker(location)

             {

                    var clickedLocation = new google.maps.LatLng(location);

                    var marker = new google.maps.Marker({

                      position: location, 

                      map: globalMap

                    });

//                    if(globalMarker != "" || globalMarker == null)
//
//                    {
//
//                           globalMarker.setOptions({
//
//                                 map: null,
//
//                                 visible: false
//
//                           }) ;
//
//                    }

                    globalMarker = marker ; 

                    globalMap.setCenter(location);

                    $(".jLat").val(location.lat()) ; 

                    $(".jLng").val(location.lng()) ; 

                    static_lat = location.lat() ; 

                    static_lng = location.lng() ;

             }

             //<!-- 구글맵 scope -->
