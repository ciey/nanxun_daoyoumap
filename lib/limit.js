/**
 * Created by Administrator on 2016/7/26.
 */
    var wx_active=0;
var language="chs";
var pointArray={
    "name":[],
    "lat":[],
    "lng":[]
};
//滑块方法 滑动外层固定层sliderOut，外层sliderBox，滑块sliderIn，滑动的外层盒子outBox，滑动的真实高度inbox sixItem*n
function sliderGo(sliderOut,sliderBox,sliderIn,outBox,inbox) {
    setTimeout(function(){
        console.log(inbox);
    },3000)
    $(sliderOut).css({
        "width": "0.02rem",
        "height": $(outBox).height(),
        "background-color": "#e5e5e5",
        "border-radius": "0.02rem",
        "position": "absolute",
        "right": "0.12rem"
    });
    $(sliderBox).css({
        "position": "relative",
        "width": "100%",
        "height": "100%",
    });
    console.log($(outBox).height() + "+" + inbox);
    $(sliderIn).css({
        "width": "0.12rem",
        "height": $(outBox).height() * $(outBox).height() / inbox,
        "border-radius": "0.4rem",
        "background-color": "#30acd1",
        "position": "absolute",
        "transform": "translateY(0px)",
        "left": "-0.06rem"
    });
}
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {   //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
if (browser.versions.mobile) {
    //判断是否是移动设备打开。browser代码在下面
    var ua = navigator.userAgent.toLowerCase();
    //获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //在微信中打开
        wx_active=1;
    }
}
function autoclick(t,k){
    $(".gobig").removeClass("gobig");
    $(""+t).addClass("gobig");
    $(".b_tool").show();
    var num = k;
    $(" .playBox").css({
        "background": "url(./webmap/imgs/pause22.svg)",
        "background-repeat": "no-repeat",
        "background-position": "43%,center"
    });
    $(".sliderBox").css({
        "left": "-" + (($(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right")) * 1) * num) + "px"
    }).show();
    $(".slider_active").removeClass("slider_active");
    $(".sliderBox>div").eq(num).addClass("slider_active");
}
//初始缩放大小
var startZoom;
var polygon2;

//初始当前位置定时器
var positionNow;
//是否第一次获取定位
var firstPosition=true;
var radioPlay=0;
var polygon3;
//弹窗点击关闭
$(".ok").click(function () {
    $(".mask").hide();
    $(".dialog").hide();
})
var latitudeNow,longitudeNow;
//获取当前位置的方法
function getLocation(){
    wx.getLocation({
        type:"gcj02",
        success: function (res) {
            latitudeNow = res.latitude;
            longitudeNow = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            //mapObj.setCenter([res.longitude,res.latitude]);
            if(typeof ee == 'object'&& ee != null){
                ee.setMap(null);
                ee=null;
            }
            ee = new AMap.Marker({
                map: mapObj,
                position:[longitudeNow,latitudeNow],
                icon: "./webmap/marker.png"
            });
            mapObj.add(ee);
            //ee.setMap(mapObj);
            mapObj.setCenter([longitudeNow,latitudeNow]);
            console.log(123);
            $("#wx_location").addClass("on");
            console.log(456);
            positionNow=setInterval(function () {
                wx.getLocation({
                    type:"gcj02",
                    success: function (res) {
                        latitudeNow = res.latitude;
                        longitudeNow = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        //mapObj.setCenter([res.longitude,res.latitude]);

                        //if(!auto_location3(120.373703,30.312672)){
                        //    //alert(auto_location3(currentLng,currentLat));
                        //    //console.log("gg");
                        //    return
                        //}
                        //else{
                        //    ee = new AMap.Marker({
                        //        map: mapObj,
                        //        position:[longitudeNow,latitudeNow],
                        //        icon: "./webmap/marker.png"
                        //    });
                        //ee.setMap(mapObj);
                        console.log('11111111111111111');
                        //alert(longitudeNow);
                        console.log(longitudeNow,latitudeNow);
                        setTimeout(function () {
                            ee.setPosition([longitudeNow,latitudeNow]);
                        },50)
                        //setTimeout(function () {
                        //    ee.moveTo(new AMap.LngLat(longitudeNow,latitudeNow),1000000, function () {
                        //        console.log("666")
                        //    });
                        //},500)

                        //mapObj.setZoom(18);
                        //mapObj.setCenter([longitude,latitude]);
                        //timer=0;
                        //if($("#wx_location").hasClass("on")){
                        //    ee.setMap(null);
                        //    ee=null;
                        //}
                        //定位marker点指针指北功能
                        var alpha = "";
                        var ua = navigator.userAgent.toLowerCase();
                        //判断用户设备类型
                        if (/android/.test(ua)) {
                            window.addEventListener('deviceorientationabsolute', DeviceOrientationHandler, false);

                            function DeviceOrientationHandler(event) {
                                alpha = event.alpha;
                                //document.getElementById("alpha").innerHTML = Math.round(360 - event.alpha);
                                $(".amap-icon img").css("transform","rotate("+Math.round(360 - event.alpha)+"deg) ");
                            }
                        } else {
                            window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
                            function DeviceOrientationHandler(event) {
                                alpha = event.webkitCompassHeading;
                                //document.getElementById("alpha").innerHTML = event.webkitCompassHeading;
                                $(".amap-icon img").css("transform","rotate("+event.webkitCompassHeading+"deg) ")
                            }
                        }//指北针
                        //}
                    },
                    cancel: function (res) {}
                });
            },700)

        },
        cancel: function (res) {}
    });
}
//判断点是否在景区电子围栏内
function auto_location3(a1,b1){
    var isPointIn;
    polygon3=new AMap.Polygon({
        map: mapObj,
        path: mainBound,
        strokeColor: "#fefefe", //线颜色
        strokeOpacity: 0, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: "#333", //填充色
        fillOpacity: 0//填充透明度
    });
    isPointIn=polygon3.contains([a1,b1]);
    if(!isPointIn){
        //alert("您不在当前景区，请在该景区内使用此功能");

        //$("#wx_location").removeClass("on");
        //setTimeout(function () {
        //    $("#wx_location").click();
        //},500)
        $("#wx_location").removeClass("on");
        return false
    }else{
        return true
    }
}
//当前景区的mp3语音地址
var currentMp3Url;
//当前景区名
var currentViewName;


//goLevel.eachLevel[(zoomTo-13)].mp3Url[0]  当前景区
//判断当前位置是否在语音点范围内
function auto_location2(a1,b1) {
    var isIn=false;
    timer++;
    var zoomcur=parseInt(mapObj.getZoom());
    for (var i = 0; i < goLevel.eachLevel[(zoomcur-13)].hotSpotBound.length; i++) {
        //console.log(goLevel.eachLevel[(zoomcur-13)].hotSpotBound[i]);
        var path = goLevel.eachLevel[(zoomcur-13)].hotSpotBound[i];
       //console.log(i);
            polygon2 = new AMap.Polygon({
                map: mapObj,
                path: path,
                strokeColor: "#fefefe", //线颜色
                strokeOpacity: 0, //线透明度
                strokeWeight: 3,    //线宽
                fillColor: "#333", //填充色
                fillOpacity: 0//填充透明度
            });
        var sty = polygon2.contains([a1, b1]);
        //alert(sty+"*"+i);
        if (sty) {
                //oAudio3.pause();
            //preI = i;
            isIn=true;
            //alert("在景点中");
            //判断在景点中后 判断中英 在改变音乐的播放路径
            if(language=="chs"){
                if(oAudio2.src ==goLevel.eachLevel[(zoomcur-13)].mp3Url[i]){}
                else{
                    oAudio2.src = goLevel.eachLevel[(zoomcur-13)].mp3Url[i];
                }
            }else if(language=="enu"){
                if(oAudio2.src ==goLevel_en.eachLevel[(zoomcur-13)].mp3Url[i]){}
                else{
                    oAudio2.src = goLevel_en.eachLevel[(zoomcur-13)].mp3Url[i];
                }
            }else if(language=="kor"){
                if(oAudio2.src ==goLevel_kor.eachLevel[(zoomcur-13)].mp3Url[i]){}
                else{
                    oAudio2.src = goLevel_kor.eachLevel[(zoomcur-13)].mp3Url[i];
                }
            }else if(language=="jpn"){
                if(oAudio2.src ==goLevel_jpn.eachLevel[(zoomcur-13)].mp3Url[i]){}
                else{
                    oAudio2.src = goLevel_jpn.eachLevel[(zoomcur-13)].mp3Url[i];
                }
            }


            if(timer%60==1){
                oAudio2.play();
                if(window.WeixinJSBridge){
                    WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                        oAudio2.play();
                    }, false);
                }else{
                    document.addEventListener("WeixinJSBridgeReady", function() {
                        WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                            oAudio2.play();
                        });
                    }, false);
                }

            }

            //autoclick(("#l"+(zoomcur-13)+i),i);
            break
        }
    }
    if(!isIn){
        timer=0;
        //alert("不在景区")
    }
    console.log(timer)
    //if(isRadioPlay==false){
    //    radioPlay=0;
    //    timer=0;
    //}
 }

//初始缩放级别
var zoomTo;
//是码头还是小岛
var isWharf;
var newView;

//自动导览下面不许点击语音点
var clickviable=true;
var url_head = "http://daoyou.worldmaipu.com";
var Imgline=[];
var numType = {
    "numType19": 0,
    "numType18": 0,
    "numType17": 0,
    "numType16": 0,
    "numType15": 0,
    "numType14": 0,
    "numType13": 0,
    "numType12": 0,
}
//从13到19的等级点
var viewList = [
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
]
var viewList_en = [
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
]
var viewList_kor = [
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
]
var viewList_jpn = [
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
    {"num": 0},
]
var marker_list = [
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
]
var marker_list_en = [
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
]
var marker_list_kor = [
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
]
var marker_list_jpn = [
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
    {"d": []},
]

//    当前显示级别,初始等级16
//中文
var goLevel = {
    "level": 16,
    "eachLevel": [
        {
            "levelId": 13,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 14,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 15,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 16,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 17,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]

        },
        {
            "levelId": 18,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 19,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        }
    ]
}
//英文
var goLevel_en = {
    "level": 16,
    "eachLevel": [
        {
            "levelId": 13,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 14,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 15,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 16,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 17,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]

        },
        {
            "levelId": 18,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 19,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        }
    ]
}
//韩文
var goLevel_kor = {
    "level": 16,
    "eachLevel": [
        {
            "levelId": 13,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 14,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 15,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 16,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 17,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]

        },
        {
            "levelId": 18,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 19,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        }
    ]
}
//日文
var goLevel_jpn = {
    "level": 16,
    "eachLevel": [
        {
            "levelId": 13,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 14,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 15,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 16,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 17,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]

        },
        {
            "levelId": 18,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        },
        {
            "levelId": 19,
            "txthead": [],
            "txtlongitude": [],
            "txtlatitude": [],
            "imgs": [],
            "mp3Url": [],
            "numData": [],
            "hid": [],
            "hotSpotBound":[]
        }
    ]
}
//    触摸
var touchMain;
var touch = {
    "startPageX": "",
    "startPageY": "",
    "endPageX": "",
    "endPageY": ""
};
var way = [];
var roadgo = {
    "u0": [],
    "u1": [],
    "u2": [],
    "u3": [],
    "u4": []

}


//学校列表
var hid = [4, 14, 32, 40, 44, 56, 58, 114, 64, 3, 18, 22, 30, 51, 15];

//辅助文字
var mapTxtMain = [];
var mapTxtMain_en=[];
var mapTxtMain_kor=[];
var mapTxtMain_jpn=[];
var mapTxt = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],

};
var mapTxt_en={
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var mapTxt_kor={
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var mapTxt_jpn={
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
//7种poi点

var typelist2_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist22_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist222_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist2222_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist3_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var typelist33_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var typelist333_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var typelist3333_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
}
var typelist4_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist44_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist444_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist4444_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist5_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist55_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist555_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist5555_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist6_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist66_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist666_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist6666_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist7_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist77_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist777_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist7777_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist8_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist88_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist888_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist8888_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist9_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist99_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist999_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist9999_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist10_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist1010_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist101010_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};
var typelist10101010_dengji = {
    "d13": [],
    "d14": [],
    "d15": [],
    "d16": [],
    "d17": [],
    "d18": [],
    "d19": [],
    "d19m": [],
    "d18m": [],
    "d17m": [],
    "d16m": [],
    "d15m": [],
    "d14m": [],
    "d13m": [],
};

var lineRoadGo = [];
var linen = [];
var pc = false;
var typelist1 =
    {
        "d19": [],
        "d18": [],
        "d17": [],
        "d16": [],
        "d15": [],
        "d14": [],
        "d13": [],
        "d19m": [],
        "d18m": [],
        "d17m": [],
        "d16m": [],
        "d15m": [],
        "d14m": [],
        "d13m": [],
    }
    ;
var typelist2 = [];
var typelist22=[];
var typelist222=[];
var typelist2222=[];
var typelist3 = [];
var typelist33 = [];
var typelist333 = [];
var typelist3333 = [];
var typelist4 = [];
var typelist444 = [];
var typelist44 = [];
var typelist4444 = [];
var typelist5 = [];
var typelist55 = [];
var typelist555 = [];
var typelist5555 = [];
var typelist6 = [];
var typelist66 = [];
var typelist666 = [];
var typelist6666 = [];
var typelist7 = [];
var typelist77 = [];
var typelist777 = [];
var typelist7777 = [];
var typelist8 = [];
var typelist88 = [];
var typelist888 = [];
var typelist8888 = [];
var typelist9 = [];
var typelist99 = [];
var typelist999 = [];
var typelist9999 = [];
var typelist10 = [];
var typelist1010 = [];
var typelist101010 = [];
var typelist10101010 = [];
//卫生间
var type2 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点变大icon加2.png
    "icon": "./Mmap_poibtn_toilte",
    //图片列表
    "img": []
}
//卫生间英文
var type22 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点变大icon加2.png
    "icon": "./Mmap_poibtn_toilte",
    //图片列表
    "img": []
}
//卫生间韩文
var type222 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点变大icon加2.png
    "icon": "./Mmap_poibtn_toilte",
    //图片列表
    "img": []
}
//卫生间日文
var type2222 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点变大icon加2.png
    "icon": "./Mmap_poibtn_toilte",
    //图片列表
    "img": []
}
//停车场
var type3 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type33 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type333 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type3333 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
//餐饮
var type4 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_food",
    //图片列表
    "img": []
}
var type44 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type444 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type4444 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
//景点
var type5 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_hotel",
    //图片列表
    "img": []
}
var type55 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type555 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
var type5555 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_park",
    //图片列表
    "img": []
}
//购物
var type6 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_shop",
    //图片列表
    "img": []
}
var type66 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_shop",
    //图片列表
    "img": []
}
var type666 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_shop",
    //图片列表
    "img": []
}
var type6666 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_shop",
    //图片列表
    "img": []
}
//游客服务
var type7 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}

var type77 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type777 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type7777 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
//去码头
var type8 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
//去码头
var type88 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type888 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type8888 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
//住宿
var type9 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type99 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type999 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type9999 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type10 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type1010 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type101010 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
var type10101010 = {
    "name": [],
    "longitude": [],
    "latitude": [],
    //气泡点
    "icon": "./Mmap_poibtn_inquiry",
    //图片列表
    "img": []
}
//去除所有导游点
function deleMarker() {
    mapObj.remove(marker_list[0].d);
    mapObj.remove(marker_list[1].d);
    mapObj.remove(marker_list[2].d);
    mapObj.remove(marker_list[3].d);
    mapObj.remove(marker_list[4].d);
    mapObj.remove(marker_list[5].d);
    mapObj.remove(marker_list[6].d);
    mapObj.remove(marker_list_en[0].d);
    mapObj.remove(marker_list_en[1].d);
    mapObj.remove(marker_list_en[2].d);
    mapObj.remove(marker_list_en[3].d);
    mapObj.remove(marker_list_en[4].d);
    mapObj.remove(marker_list_en[5].d);
    mapObj.remove(marker_list_en[6].d);
    mapObj.remove(marker_list_kor[0].d);
    mapObj.remove(marker_list_kor[1].d);
    mapObj.remove(marker_list_kor[2].d);
    mapObj.remove(marker_list_kor[3].d);
    mapObj.remove(marker_list_kor[4].d);
    mapObj.remove(marker_list_kor[5].d);
    mapObj.remove(marker_list_kor[6].d);
    mapObj.remove(marker_list_jpn[0].d);
    mapObj.remove(marker_list_jpn[1].d);
    mapObj.remove(marker_list_jpn[2].d);
    mapObj.remove(marker_list_jpn[3].d);
    mapObj.remove(marker_list_jpn[4].d);
    mapObj.remove(marker_list_jpn[5].d);
    mapObj.remove(marker_list_jpn[6].d);
}
//判断pc Or 移动端
var mouse_touch = {
    start: "",
    move: "",
    end: "",
    active: false,
//    第一次滑动的时候的left
    left: 0
};
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
//android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
// ios终端
if (isiOS) {
    mouse_touch.start = "touchstart";
    mouse_touch.move = "touchmove";
    mouse_touch.end = "touchend";
} else {
    if (isAndroid) {
        mouse_touch.start = "touchstart";
        mouse_touch.move = "touchmove";
        mouse_touch.end = "touchend";
    }
    else {
        pc = true;
        $("#container").css({"min-width": "800px"})
        mouse_touch.start = "mousedown";
        mouse_touch.move = "mousemove";
        mouse_touch.end = "mouseup";
        $(".sliderGo").css({
            "margin-left": ($(document).width() - $(".sliderGo").width()) / 2,
            "margin-right": ($(document).width() - $(".sliderGo").width()) / 2,
        })

    }
}
//坐标系转化
var a = 6378245.0;
var cc = 0.00669342162296594323;
function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
        + 0.2 * Math.sqrt(x > 0 ? x : -x);
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x
            * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0
            * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y
            * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
        * Math.sqrt(x > 0 ? x : -x);
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x
            * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0
            * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x
            / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
}
//等级处理
function changed(changeName, response, a, markerSign) {
    if (response.data.scenic.pointses[a].min_zoom == "19") {
        changeName.d19.push(markerSign)
    } else {
        if (response.data.scenic.pointses[a].min_zoom == "18") {
            changeName.d18.push(markerSign)
        }
        else {
            if (response.data.scenic.pointses[a].min_zoom == "17") {
                changeName.d17.push(markerSign)
            }
            else {
                if (response.data.scenic.pointses[a].min_zoom == "16") {
                    changeName.d16.push(markerSign)
                }
                else {
                    if (response.data.scenic.pointses[a].min_zoom == "15") {
                        changeName.d15.push(markerSign)
                    }
                    else {
                        if (response.data.scenic.pointses[a].min_zoom == "14") {
                            changeName.d14.push(markerSign)
                        }
                        else {
                            if (response.data.scenic.pointses[a].min_zoom == "13") {
                                changeName.d13.push(markerSign)
                            }
                        }
                    }
                }
            }
        }
    }
    if (response.data.scenic.pointses[a].max_zoom == "19") {
        changeName.d19m.push(markerSign)
    } else {
        if (response.data.scenic.pointses[a].max_zoom == "18") {
            changeName.d18m.push(markerSign)
        }
        else {
            if (response.data.scenic.pointses[a].max_zoom == "17") {
                changeName.d17m.push(markerSign)
            }
            else {
                if (response.data.scenic.pointses[a].max_zoom == "16") {
                    changeName.d16m.push(markerSign)
                }
                else {
                    if (response.data.scenic.pointses[a].max_zoom == "15") {
                        changeName.d15m.push(markerSign)
                    }
                    else {
                        if (response.data.scenic.pointses[a].max_zoom == "14") {
                            changeName.d14m.push(markerSign)
                        }
                        else {
                            if (response.data.scenic.pointses[a].max_zoom == "13") {
                                changeName.d13m.push(markerSign)
                            }
                        }
                    }
                }
            }
        }
    }
}
//判断是否在中国
function outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}
function transformFromWGSToGCJ(longitude, latitude) {

    //如果在国外，则默认不进行转换
    if (outOfChina(latitude, longitude)) {
        return new LatLng(latitude, longitude);
    }
    var dLat = transformLat(longitude - 105.0,
        latitude - 35.0);
    var dLon = transformLon(longitude - 105.0,
        latitude - 35.0);
    var radLat = latitude / 180.0 * Math.PI;
    var magic = Math.sin(radLat);
    magic = 1 - cc * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - cc)) / (magic * sqrtMagic) * Math.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);

    return [latitude + dLat, longitude + dLon];
}

function newzoomBylang(goLevel_type){
    var strLevel = "";
    $(".sliderBox").html("");
    for (var i = 0; i < goLevel_type.eachLevel[goLevel_type.level - 13].txthead.length; i++) {
        strLevel += "  <div page='" +
        (i + 1) +
        "' class='sliderGo'> <div class='box_spot'><div class='finger'></div><div class='listenBox' data='" +
        i +
        "'> <div class='playBox ";
        if (goLevel_type.eachLevel[goLevel_type.level - 13].mp3Url[i] != "") {
            strLevel += "playBox2";
        }
        strLevel +=
            "'></div><img src='" +
            param.newUrl +
            goLevel_type.eachLevel[goLevel_type.level - 13].imgs[i] +
            "' alt=''/> </div> <div class='goTxt'> " +
            "<div class='goHead'><a class='goDetail' href='" +
            param.contentUrl + goLevel_type.eachLevel[goLevel_type.level - 13].hid[i] +
                //tetUrl[num3] +
            "'>" +
            goLevel_type.eachLevel[goLevel_type.level - 13].txthead[i] +
            "</a></div> " +
            "<div class='goSum'></div> </div>"+
            " <div class='goTo'> <a href='javascript:void(0)'> <i class='iconfontCome' data='" +
            i +
            "'></i> </a> </div> </div> </div>"
    }
    $(".sliderBox").append(strLevel);
    $(".sliderGo").width($("body").width());
    //$(".sliderBox>div").css({
    //    "margin-right": ($("body").width() - $(".sliderGo").width() - parseInt($(".sliderGo").css("margin-left"))) / 2
    //})
    $(".gobig").removeClass("gobig");
    $(".mapBox").hide();
    $(".sliderBox").width($(window).width() * (goLevel_type.eachLevel[goLevel_type.level - 13].numData.length + 2));
    //变化的时候标记点消失

    removeTypelist();

    
    $(".alltalk").hide();
    mapObj.remove(mapTxtMain);
    mapObj.remove(mapTxtMain_en);
    mapObj.remove(mapTxtMain_kor);
    mapObj.remove(mapTxtMain_jpn);
}
//坐标系转化
//有语音poi点的时候的刷新 语音点点击的底部弹窗的中英切换
function newzoom() {
    console.log("newzoom");
    //变化的时候标记点消失
    goLevel.level = mapObj.getZoom() || 16;
    goLevel_en.level = mapObj.getZoom() || 16;
    goLevel_kor.level = mapObj.getZoom() || 16;
    goLevel_jpn.level = mapObj.getZoom() || 16;
    console.log(goLevel.level);
    if(clickviable){
        $(".b_tool").hide();
        $(".slide").show();
        $("#audioGuide").addClass("itemActive");
        $("#wx_location").show();
    }
    $(".sliderBox").empty().css("left", 0);

    if ($(".line").hasClass("lineActivity")) {
        deleMarker();
        $(".slide").hide();
    } else {
        if(language=="chs"){
            newzoomBylang(goLevel);
            mapObj.add(marker_list[goLevel.level - 13].d);
            mapObj.add(mapTxt.d16);
            mapObj.add(mapTxt.d15);
            mapObj.add(mapTxt.d14);
            mapObj.add(mapTxt.d13);
            mapObj.remove(mapTxt.d13m);
            mapObj.remove(mapTxt.d14m);
            mapObj.remove(mapTxt.d15m);
        }else if(language=="enu"){
            newzoomBylang(goLevel_en);
            mapObj.add(marker_list_en[goLevel_en.level - 13].d);
            mapObj.add(mapTxt_en.d16);
            mapObj.add(mapTxt_en.d15);
            mapObj.add(mapTxt_en.d14);
            mapObj.add(mapTxt_en.d13);
            mapObj.remove(mapTxt_en.d13m);
            mapObj.remove(mapTxt_en.d14m);
            mapObj.remove(mapTxt_en.d15m);
        }else if(language=="kor"){
            newzoomBylang(goLevel_kor);
            mapObj.add(marker_list_kor[goLevel_kor.level - 13].d);
            mapObj.add(mapTxt_kor.d16);
            mapObj.add(mapTxt_kor.d15);
            mapObj.add(mapTxt_kor.d14);
            mapObj.add(mapTxt_kor.d13);
            mapObj.remove(mapTxt_kor.d13m);
            mapObj.remove(mapTxt_kor.d14m);
            mapObj.remove(mapTxt_kor.d15m);
        }else{
            newzoomBylang(goLevel_jpn);
            mapObj.add(marker_list_jpn[goLevel_jpn.level - 13].d);
            mapObj.add(mapTxt_jpn.d16);
            mapObj.add(mapTxt_jpn.d15);
            mapObj.add(mapTxt_jpn.d14);
            mapObj.add(mapTxt_jpn.d13);
            mapObj.remove(mapTxt_jpn.d13m);
            mapObj.remove(mapTxt_jpn.d14m);
            mapObj.remove(mapTxt_jpn.d15m);
        }
    }

}


//    线路信息
var timeline = [];
var lineHid = [];
var lineName = [];
var linePosName = [];
var linePoslongitude = [];
var linePoslatitude = [];
var lineMp3 = [];
var listMp3 = [];
//    线路信息
var polyline;
var linelist = [];
var line = []
var weizhi;
var mapObj, geolocation, toolBar;
var watchNumber;
var num1 = 1;
var groundImage;
var sign;
//监控点
var watchID;
var audioPlay;
//定位点
var r1, l1;
var ssss;
var position;
var leLayer;
var limitBounds;
//bound 区域
var mainBound = [];
//    各个景点的区域
var hotSpotBound = [];
//点信息
var ees = [];
var txthead = [];
var txtlongitude = [];
var txtlatitude = [];
var imgs = [];
var mp3Url = [];
$(".slide").css({"left": ($("body").width() - $(".slide").width()) / 2});
$(".end").css({
    "left": ($("body").width() - $(".slide").width()) / 2,
    //"display": "none"
});
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

//步行路线规划
var walking;
//实际走路路线
//var polyline;
//规划路线的定时器
var interval;
//当前定位的定时器
var positionNow;
//定位当前位置的marker点
var ee;
//是否已规划路线
var isWalking=false;
//是否已自动导览
isSlideClick=false;

//$("#exit").hide();
//退出线路规划的方法
function stopInterval(){
    //恢复到默认缩放大小
    mapObj.setZoom(startZoom);
    isWalking=false;
    clearInterval(interval);
    interval=null;
    walking.clear();

    ee.setMap(null);
    ee=null;
    $("#wx_location").removeClass("on");
    //mapObj.setCenter([119.014632,29.593714]);
    mapObj.setCenter([response.data.scenic.longitude, response.data.scenic.latitude]);
}

function getNewZoom(List, typelist_dengji) {
    //document.getElementById('myaudio2').pause();
    //document.getElementById('myaudio').pause();
    $(" .playBox").css({
        "background": "url(./webmap/imgs/play.svg)",
        "background-repeat": "no-repeat",
        "background-position": "43%,center"
    });
    //$(".imgRight2").click();
    if ($(".line").hasClass("lineActivity")) {
        deleMarker();
        $(".slide").hide();
    }
    else {
        if (mapObj.getZoom() == 18) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
            mapObj.add(typelist_dengji.d14);
            mapObj.add(typelist_dengji.d15);
            mapObj.add(typelist_dengji.d16);
            mapObj.add(typelist_dengji.d17);
            mapObj.add(typelist_dengji.d18);
            mapObj.remove(typelist_dengji.d13m);
            mapObj.remove(typelist_dengji.d14m);
            mapObj.remove(typelist_dengji.d15m);
            mapObj.remove(typelist_dengji.d16m);
            mapObj.remove(typelist_dengji.d17m);
        }
        if (mapObj.getZoom() == 17) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
            mapObj.add(typelist_dengji.d14);
            mapObj.add(typelist_dengji.d15);
            mapObj.add(typelist_dengji.d16);
            mapObj.add(typelist_dengji.d17);
            mapObj.remove(typelist_dengji.d13m);
            mapObj.remove(typelist_dengji.d14m);
            mapObj.remove(typelist_dengji.d15m);
            mapObj.remove(typelist_dengji.d16m);
        }
        if (mapObj.getZoom() == 16) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
            mapObj.add(typelist_dengji.d14);
            mapObj.add(typelist_dengji.d15);
            mapObj.add(typelist_dengji.d16);
            mapObj.remove(typelist_dengji.d13m);
            mapObj.remove(typelist_dengji.d14m);
            mapObj.remove(typelist_dengji.d15m);
        }
        if (mapObj.getZoom() == 15) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
            mapObj.add(typelist_dengji.d14);
            mapObj.add(typelist_dengji.d15);
            mapObj.remove(typelist_dengji.d13m);
            mapObj.remove(typelist_dengji.d14m);
        }
        if (mapObj.getZoom() == 14) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
            mapObj.add(typelist_dengji.d14);
            mapObj.remove(typelist_dengji.d13m);
        }
        if (mapObj.getZoom() == 13) {
            mapObj.remove(List);
            mapObj.add(typelist_dengji.d13);
        }

    }


}
//学校id，必要参数
var href_url = "http://daoyou.worldmaipu.com/upload_resource/mpweb/fuyang/agriculture/newMap.html?hid="
var myurl = GetQueryString("hid").split("_")[0];
console.log(myurl);
//点击景点名载入
var txtUrl = [];

var date = Date.parse(new Date());

$.ajax({
    type: "get",
    //url: "http://daoyou.worldmaipu.com/api/v1/visitor_view!GetSingleSecent.action?hid=" +myurl+"&tempDate=20150101000000&appId=1",
    url: "http://daoyou.worldmaipu.com/api/v1/map_view!GetSingleSecentWebs.action?hid=" + myurl,
    dataType: "jsonp",
    //dataType: "json",
    data: '',
    jsonp: "callback",//服务端用于接收callback调用的function名的参数
    success: function (data) {
        response = data;
        var isMatou=false;
        var isNew=false;
        //景区名
        //currentViewName=response.data.scenic.name;
        //进入景点 播放过景点介绍没
        //if(sessionStorage.getItem(currentViewName)){
        //
        //}else{
        //    sessionStorage.setItem(currentViewName,"no");
        //
        //}


        if(response.data.scenic.name.indexOf("码头")!=-1){
            console.log(response.data.scenic.name.indexOf("码头"));
            isMatou=true;
            isNew=false;
        }else if(response.data.scenic.name.indexOf("文渊狮城")!=-1){
            console.log(response.data.scenic.name.indexOf("文渊狮城"));
            isMatou=false;
            isNew=true;
        }else if(response.data.scenic.name.indexOf("森林氧吧")!=-1){
            console.log(response.data.scenic.name.indexOf("森林氧吧"));
            isMatou=false;
            isNew=true;
        }else if(response.data.scenic.name.indexOf("下姜村")!=-1){
            console.log(response.data.scenic.name.indexOf("下姜村"));
            isMatou=false;
            isNew=true;
        }else if(response.data.scenic.name.indexOf("淳果小镇")!=-1){
            console.log(response.data.scenic.name.indexOf("淳果小镇"));
            isMatou=false;
            isNew=true;
        }else{
            console.log("gg");
            isMatou=false;
            isNew=false;
        }

        if(isMatou){
            isWharf=true
        }else{
            isWharf=false
        }
        if(isNew){
            newView=true;
        }else{
            newView=false;
        }
        console.log(isMatou);

        if (response.data.scenic.exturl!=null) {
            document.getElementById("exturl").href = ""
                + data.data.scenic.exturl;
            $("#exturl").show();
        }
        else {
            document.getElementById("exturl").href = "#";
            $("#exturl").hide();
        }
        //bound 区域
            document.title =response.data.scenic.name;
        //静态接口使用这段
        //$.each(response.data.scenic.pointses, function (i) {
        //    if(response.data.scenic.pointses[i].polygons!=null){
        //        $.each(response.data.scenic.pointses[i].polygons, function (j) {
        //            var ss = [];
        //            ss[0] = response.data.scenic.pointses[i].polygons[j].longitude;
        //            ss[1] = response.data.scenic.pointses[i].polygons[j].latitude;
        //            mainBound.push(new AMap.LngLat(ss[0], ss[1]));
        //        })
        //
        //    }
        //})
        //非静态接口使用下面这段
        $.each(response.data.scenic.polygons, function (i) {
            var ss = [];
            ss[0] = response.data.scenic.polygons[i].longitude;
            ss[1] = response.data.scenic.polygons[i].latitude;
            mainBound.push(new AMap.LngLat(ss[0], ss[1]));
        })
        //    各个景点的区域
        for (var i = 0; i < response.data.scenic.pointses.length; i++) {
            var xiaozu = [];
            if (response.data.scenic.pointses[i].type == "2") {

                //静态接口时使用：
                //if (response.data.scenic.pointses[i].polyStr==null){
                //    for(var j=0;j < response.data.scenic.pointses[i].polygons.length;j++){
                //        var dian=[];
                //        dian[0]=response.data.scenic.pointses[i].polygons[j].longitude;
                //        dian[1]=response.data.scenic.pointses[i].polygons[j].latitude;
                //        xiaozu.push(new AMap.LngLat(dian[0], dian[1]));
                //    }
                //    hotSpotBound.push(xiaozu);
                //}

                //非静态接口时使用
                if (response.data.scenic.pointses[i].polyStr) {
                    for (var j = 0; j < response.data.scenic.pointses[i].polyStr.split(",").length; j++) {
                        var dian = [];
                        dian[0] = response.data.scenic.pointses[i].polyStr.split(",")[j].split(";")[0];
                        dian[1] = response.data.scenic.pointses[i].polyStr.split(",")[j].split(";")[1];
                        if (!dian[1]) {
                            console.log(response.data.scenic.pointses[i]);
                            console.log(i + "*" + j);
                        }
                        xiaozu.push(new AMap.LngLat(dian[0], dian[1]));
                    }
                    hotSpotBound.push(xiaozu);
                }

            }
        }
        //    创建地图
        position = new AMap.LngLat(response.data.scenic.longitude, response.data.scenic.latitude);
        //加载麦扑地图
        mapObj = new AMap.Map("container", {
            view: new AMap.View2D({//创建地图二维视口
                center: position,//创建中心点坐标
                zoom: response.data.scenic.min_zoom, //设置地图缩放级别
                rotation: 0 //设置地图旋转角度
            }),
            resizeEnable: true,
            zooms: [13, 18],
            features: ["bg", "road", "building"],
            lang: "zh_cn"//设置地图语言类型，默认：中文简体
        });//创建地图实例
        mapObj.plugin(["AMap.ToolBar"], function() {
            mapObj.addControl(new AMap.ToolBar({
                position:"LB",
                //locate:true
                liteStyle:true,
                //offset:AMap.Pixel(-10,-10)
            }));

            //点击放大缩小按钮位置调整
            //$(".amap-zoomcontrol").css({"bottom":"0.3rem","width":"0.6rem","left":"0.1rem"});
            $(".amap-toolbar .amap-zoomcontrol").removeClass("amap-zoomcontrol").addClass("amap-zoomcontrol_1");
            $(".amap-zoom-touch-minus").css({"height":"0.6rem","border-radius":"0.15rem"});
            $(".amap-zoom-touch-plus").css({"height":"0.6rem","border-radius":"0.15rem","margin-bottom":"0"});
            $(".amap-zoom-touch-minus>div").css("line-height","0.6rem");
            $(".amap-zoom-touch-plus>div").css("line-height","0.6rem");
        });

        //瓦片加载
        leLayer = new AMap.TileLayer({
            // 图块取图地址,加了s=1就是下沙景区限制
            tileUrl: '' +
            "http://101.37.254.154/api/v1/tile!GetScenicTile.action?x=[x]&z=[z]&y=[y]&hid=" + myurl
            //"http://daoyou.worldmaipu.com/" +
            //'api/v1/tile!GetTile.action?x=[x]&y=[y]&z=[z]'
            //+"&s=1"
            ,
            zIndex: 2
        });
        leLayer.setMap(mapObj);
        //停止拖拽地图时触发。如地图有拖拽缓动效果，则在拽停止，缓动开始前触发 触发事件
        AMap.event.addListener(mapObj, 'zoomend', function () {
            hidLang();
            if(language=="chs"){
                switch ($(".active").attr("data")) {
                    case "8":
                        getNewZoom(typelist2, typelist2_dengji);
                        break;
                    case "停车场":
                        getNewZoom(typelist3, typelist3_dengji);
                        break;
                    case "餐饮":
                        getNewZoom(typelist4, typelist4_dengji);
                        break;
                    case "景点":
                        getNewZoom(typelist5, typelist5_dengji);
                        break;
                    case "购物":
                        getNewZoom(typelist6, typelist6_dengji);
                        break;
                    case "游客服务":
                        getNewZoom(typelist7, typelist7_dengji);
                        break;
                    case "码头":
                        getNewZoom(typelist8, typelist8_dengji);
                        break;
                    case "住宿":
                        getNewZoom(typelist9, typelist9_dengji);
                        break;
                    case "厨房":
                        getNewZoom(typelist10, typelist10_dengji);
                        break;
                    default :
                        newzoom();
                        break;
                }
                //调整辅助文字
                getNewZoom(mapTxtMain, mapTxt);
            }else if(language=="enu"){
                switch ($(".active").attr("data")) {
                    case "8":
                        getNewZoom(typelist22, typelist22_dengji);
                        break;
                    case "停车场":
                        getNewZoom(typelist33, typelist33_dengji);
                        break;
                    case "餐饮":
                        getNewZoom(typelist44, typelist44_dengji);
                        break;
                    case "景点":
                        getNewZoom(typelist55, typelist55_dengji);
                        break;
                    case "购物":
                        getNewZoom(typelist66, typelist66_dengji);
                        break;
                    case "游客服务":
                        getNewZoom(typelist77, typelist77_dengji);
                        break;
                    case "码头":
                        getNewZoom(typelist88, typelist88_dengji);
                        break;
                    case "住宿":
                        getNewZoom(typelist99, typelist99_dengji);
                        break;
                    case "厨房":
                        getNewZoom(typelist1010, typelist1010_dengji);
                        break;
                    default :
                        newzoom();
                        break;
                }
                //调整辅助文字
                getNewZoom(mapTxtMain_en, mapTxt_en);
            }else if(language=="kor"){
                switch ($(".active").attr("data")) {
                    case "8":
                        getNewZoom(typelist222, typelist222_dengji);
                        break;
                    case "停车场":
                        getNewZoom(typelist333, typelist333_dengji);
                        break;
                    case "餐饮":
                        getNewZoom(typelist444, typelist444_dengji);
                        break;
                    case "景点":
                        getNewZoom(typelist555, typelist555_dengji);
                        break;
                    case "购物":
                        getNewZoom(typelist666, typelist666_dengji);
                        break;
                    case "游客服务":
                        getNewZoom(typelist777, typelist777_dengji);
                        break;
                    case "码头":
                        getNewZoom(typelist888, typelist888_dengji);
                        break;
                    case "住宿":
                        getNewZoom(typelist999, typelist999_dengji);
                        break;
                    case "厨房":
                        getNewZoom(typelist101010, typelist101010_dengji);
                        break;
                    default :
                        newzoom();
                        break;
                }
                //调整辅助文字
                getNewZoom(mapTxtMain_kor, mapTxt_kor);
            }else if(language=="jpn"){
                switch ($(".active").attr("data")) {
                    case "8":
                        getNewZoom(typelist2222, typelist2222_dengji);
                        break;
                    case "停车场":
                        getNewZoom(typelist3333, typelist3333_dengji);
                        break;
                    case "餐饮":
                        getNewZoom(typelist4444, typelist4444_dengji);
                        break;
                    case "景点":
                        getNewZoom(typelist5555, typelist5555_dengji);
                        break;
                    case "购物":
                        getNewZoom(typelist6666, typelist6666_dengji);
                        break;
                    case "游客服务":
                        getNewZoom(typelist7777, typelist7777_dengji);
                        break;
                    case "码头":
                        getNewZoom(typelist8888, typelist8888_dengji);
                        break;
                    case "住宿":
                        getNewZoom(typelist9999, typelist9999_dengji);
                        break;
                    case "厨房":
                        getNewZoom(typelist10101010, typelist10101010_dengji);
                        break;
                    default :
                        newzoom();
                        break;
                }
                //调整辅助文字
                getNewZoom(mapTxtMain_jpn, mapTxt_jpn);
            }

            
        });
        mapObj.on('complete', function () {
            newzoom();
            //alert(1);
            //var isPlayed=sessionStorage.getItem(currentViewName);
            //if(isPlayed=="no"){
            //    oAudio3.play();
            //    sessionStorage.setItem(currentViewName,"yes")
            //}else{}
            setTimeout(function () {
                $("#wx_location").click();
            },1000)
            //alert("11");
            $(".amap-copyright").text("");
        });
            $(".amap-zoom-touch-plus>div").css({
                "height": "0.5rem!important",
                "line-height": "0.5rem!important"
            });
        $(".amap-zoom-touch-minus>div").css({
            "height": "0.5rem!important",
            "line-height": "0.5rem!important"
        })
        mapObj.on('click', function (e) {
            hidLang();

        });
        mapObj.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: false,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(0, 0),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                //buttonDom: '<img src="./webmap/imgs/btn_location.png"  class="location" id="location" />'
            });
            mapObj.addControl(geolocation);
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            function onComplete(data) {
                l1 = data.position.getLng();
                r1 = data.position.getLat();
            }
        });
        var str4 = '';
        var sum2 = 1;
        var sum3 = 1;
        var num4 = 0;
        //ajax传输的全景
        if (response.data.scenic.full_view_url!=null&&response.data.scenic.full_view_url!=" ") {
            document.getElementById("fullviewA").href = response.data.scenic.full_view_url;
            $("#fullview").show();
            $("#fullviewA").show();
        }
        else {
            if(newView){
                $("#fullviewA").show();

                $("#fullviewA").click(function () {
                    alert("暂无全景")
                })
            }else{
                $("#fullviewA").hide();
            }
        }
        //$("#shop").show();
        //线路
        if (response.data.scenic.hotspotLinesList.length!=0){
            $(".imgRight0").show();
        }
        else {
            $(".imgRight0").hide();
        }
        //线路
        if(response.data.scenic.hotspotLinesList!=null){
            $.each(response.data.scenic.hotspotLinesList, function (i) {
                if (response.data.scenic.hotspotLinesList[i].coordinateList.length > 0) {
                    timeline.push(response.data.scenic.hotspotLinesList[i].reserved3);
                    str4 = "<div class='line' data='" +
                    num4 +
                    "'><p class='lineTxt'>0" +
                    sum2 +
                    "</p></div>";
                    lineName.push(response.data.scenic.hotspotLinesList[i].lineName);
                    num4++;
                    sum2++;
                    $("#tip3").prepend(str4);
                    var linek = [];
                    var wayLine = [];
                    var namep = [];
                    var roadMp3 = [];
                    var hid = [];
                    var linehid0 = [];
                    var lineImg=[];
                    sum3 = 1;
                    for (var j = 0; j < response.data.scenic.hotspotLinesList[i].coordinateList.length; j++) {
                        wayLine.push(
                            new AMap.LngLat(Number(response.data.scenic.hotspotLinesList[i].coordinateList[j].longitude),
                                Number(response.data.scenic.hotspotLinesList[i].coordinateList[j].latitude))
                        );
                        if (response.data.scenic.hotspotLinesList[i].coordinateList[j].reserved1.split("")[0] == "默") {
                        }
                        else {
                            linehid0.push(response.data.scenic.hotspotLinesList[i].coordinateList[j].reserved2);
                            linek.push(
                                new AMap.LngLat(Number(response.data.scenic.hotspotLinesList[i].coordinateList[j].longitude),
                                    Number(response.data.scenic.hotspotLinesList[i].coordinateList[j].latitude))
                            )
                            lineImg.push(response.data.scenic.hotspotLinesList[i].coordinateList[j].thumb_img);
                            var url = response.data.scenic.hotspotLinesList[i].coordinateList[j].audio;
                            if(url){
                                var mindex = url.indexOf(".");
                                var mp3 = url.substr(0, mindex) + ".mp3";
                                var mpur = param.newUrl + mp3;
                                roadMp3.push(mpur);
                            }else {
                                roadMp3.push("");
                            }


                            namep.push(response.data.scenic.hotspotLinesList[i].coordinateList[j].reserved1);
                            var marker4 = new AMap.Marker({
                                map: mapObj,
                                content: "<div class='lineBox line" +
                                i +
                                "'data='" +
                                sum3 +
                                "' id='lineRoad" +
                                i +
                                sum3 +
                                "'>" +
                                sum3 +
                                "</div>",
                                position: new AMap.LngLat(response.data.scenic.hotspotLinesList[i].coordinateList[j].longitude, response.data.scenic.hotspotLinesList[i].coordinateList[j].latitude),
                                //icon: "./webmap/imgs/marker.png",
                                offset: new AMap.Pixel(-15, -12)
                            });
                            lineRoadGo.push(marker4);
                            if (i == 0) {
                                roadgo.u0.push(marker4);
                            }
                            if (i == 1) {
                                roadgo.u1.push(marker4);
                            }
                            if (i == 2) {
                                roadgo.u2.push(marker4);
                            }
                            if (i == 3) {
                                roadgo.u3.push(marker4);
                            }
                            if (i == 4) {
                                roadgo.u4.push(marker4);
                            }

                            AMap.event.addListener(marker4, "click", function (e) {
                                var si = $(".lineActivity").attr("data");
                                var tip_content = this.getContent();
                                var sign2 = tip_content.split("'");
                                var y = parseInt(sign2[3]);
                                $(".lineBig").removeClass("lineBig");
                                console.log(si);
                                $("#lineRoad" + si + y).addClass("lineBig");
                                $(".slider_active2").removeClass("slider_active2");
                                $(".line_Box").css("left", $("body").width() * y * (-1));
                                $(".line_Box>div").eq(y).addClass("slider_active2");
                                var x2 = parseInt($(".lineActivity").attr("data"));
                                var y2 = parseInt($(".slider_active2>.goTo>a>i.iconfontCome").attr("data"));
                                mapObj.setCenter([line[x2][y2].lng, line[x2][y2].lat]);
                                var id = parseInt($(".line_Box>div.slider_active2>.listenBox").attr("data"));
                                var firstSum = parseInt($(".lineActivity").attr("data"));
                                document.getElementById("myaudio").src = listMp3[firstSum][id];

                            })
                            sum3++;
                            linen.push(marker4);

                        }
                    }
                    Imgline.push(lineImg);
                    lineHid.push(linehid0);
                    listMp3.push(roadMp3)
                    linePosName.push(namep);
                    linelist.push(linen);
                    line.push(linek);
                    way.push(wayLine);
                    mapObj.remove(lineRoadGo);
                }

            })
        }


        var num3 = 0;
        var strtr = "";
        var pmae = [];
        $.each(response.data.scenic.pointses, function (i) {
            pmae.push(response.data.scenic.pointses[i].pname);
            pointArray.name.push(response.data.scenic.pointses[i].chs_name);
            pointArray.lng.push(response.data.scenic.pointses[i].longitude);
            pointArray.lat.push(response.data.scenic.pointses[i].latitude);
            //type==14 普通poi点 没有图标 只有文字
            if (response.data.scenic.pointses[i].type == 14) {
                if(response.data.scenic.pointses[i].l_type==1){
                    var marker32 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='resetTxt'>" +
                        response.data.scenic.pointses[i].chs_name +
                        "</div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(1, 1)
                    });
                    mapTxtMain.push(marker32);
                    marker32.setMap(mapObj);
                    changed(mapTxt, response, i, marker32);
                    mapObj.remove(marker32);
                }else if(response.data.scenic.pointses[i].l_type==2){
                    var marker322 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='resetTxt'>" +
                        response.data.scenic.pointses[i].chs_name +
                        "</div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(1, 1)
                    });
                    mapTxtMain_en.push(marker322);
                    marker322.setMap(mapObj);
                    changed(mapTxt_en, response, i, marker322);
                    mapObj.remove(marker322);
                }else if(response.data.scenic.pointses[i].l_type==3){
                    var marker3222 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='resetTxt'>" +
                        response.data.scenic.pointses[i].chs_name +
                        "</div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(1, 1)
                    });
                    mapTxtMain_kor.push(marker3222);
                    marker3222.setMap(mapObj);
                    changed(mapTxt_kor, response, i, marker3222);
                    mapObj.remove(marker3222);
                }else if(response.data.scenic.pointses[i].l_type==4){
                    var marker32222 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='resetTxt'>" +
                        response.data.scenic.pointses[i].chs_name +
                        "</div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(1, 1)
                    });
                    mapTxtMain_jpn.push(marker32222);
                    marker32222.setMap(mapObj);
                    changed(mapTxt_jpn, response, i, marker32222);
                    mapObj.remove(marker32222);
                }
            
            }


            var marker_typeFn= function (e) {
                var _this=this;
                //如果在微信中
                if(wx_active==1){
                    //var timer=0;
                    var route=[];
                    var latitude;
                    var longitude;

                    if(positionNow!=null){
                        clearInterval(positionNow);
                        positionNow=null;
                        if(ee!=null){
                            ee.setMap(null);
                            ee=null;
                        }
                        //alert("也关闭了")
                    }

                    //定位marker点指针指北功能
                    var alpha = "";
                    var ua = navigator.userAgent.toLowerCase();
                    //判断用户设备类型
                    if (/android/.test(ua)) {
                        window.addEventListener('deviceorientationabsolute', DeviceOrientationHandler, false);

                        function DeviceOrientationHandler(event) {
                            alpha = event.alpha;
                            //document.getElementById("alpha").innerHTML = Math.round(360 - event.alpha);
                            $(".amap-icon img").css("transform","rotate("+Math.round(360 - event.alpha)+"deg) ");
                        }
                    } else {
                        window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
                        function DeviceOrientationHandler(event) {
                            alpha = event.webkitCompassHeading;
                            //document.getElementById("alpha").innerHTML = event.webkitCompassHeading;
                            $(".amap-icon img").css("transform","rotate("+event.webkitCompassHeading+"deg) ")
                        }
                    }//指北针
                    //polyline.setMap(null);
                    wx.getLocation({
                        type:"gcj02",
                        success: function (res) {
                            latitude = res.latitude;
                            longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            //mapObj.setCenter([res.longitude,res.latitude]);
                            if(!auto_location3(longitude,latitude)){
                                //alert(auto_location3(currentLng,currentLat));
                                //console.log("gg");
                                $(".mask").show();
                                $(".dialog").show();
                                return
                            }else{

                                if($(".biger").length!=0){
                                    $(".biger").removeClass("biger");
                                }
                                //console.log($(".biger"));
                                var clickTarget=e.target.getContent();
                                var myClass=clickTarget.split("'")[3].split(" ")[0];
                                var myNum=clickTarget.split("'")[7];
                                console.log(myNum);
                                console.log($("."+myClass+"[number="+myNum+"]"));
                                $("."+myClass+"[number="+myNum+"]").addClass("biger");

                                if(ee==null){
                                    ee = new AMap.Marker({
                                        map: mapObj,
                                        position:[longitude,latitude],
                                        icon: "./webmap/marker.png"
                                    });
                                    ee.setMap(mapObj);
                                }
                                if($("#wx_location").hasClass("on")){
                                }else{
                                    $("#wx_location").addClass("on");
                                }


                                $(".slide").hide();
                                $(".exitFrom").show();
                                //$("#exit").show();
                                $(" .playBox").css({
                                    "background": "url(./webmap/imgs/play.svg)",
                                    "background-repeat": "no-repeat",
                                    "background-position": "43%,center"
                                });
                                var tip_content = _this.getContent();
                                $(".end").hide();
                                $(".sliderBox").css("left", 0);
                                var level = tip_content.split("'")[11];
                                sign = tip_content.split("'")[7];
                                console.log(sign,level);

                                console.log(tip_content.split("'"));
                                map_name=pointArray.name[sign];
                                map_lat=pointArray.lat[sign];
                                map_lng=pointArray.lng[sign];
                                //zl改
                                //清除已存在的规划路线
                                walking.clear();


                                //ee.setMap(null);
                                walking.search([longitude,latitude], [map_lng,map_lat]);

                                if(isWalking!=true){
                                    interval=setInterval(function () {
                                        //timer+=1;
                                        //if(hasLine){
                                        //    polyline.setMap(null);
                                        //}
                                        wx.getLocation({
                                            type:"gcj02",
                                            success: function (res) {
                                                latitude = res.latitude;
                                                longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                                //marker点位置移动
                                                //ee.setPosition([longitude,latitude]);
                                                setTimeout(function () {
                                                    ee.setPosition([longitude,latitude]);
                                                },50)
                                                //ee.moveTo([longitude,latitude],1000000);
                                            },
                                            cancel: function (res) {}
                                        });
                                        $(".amap-marker:eq(0)").css("z-index","101");
                                        console.log("22222222222222222222222");
                                        //ee.setPosition([118.919633,29.586386]);


                                    },1000);
                                    isWalking=true;
                                }else{
                                    //alert("xixi")
                                }

                            }
                        },
                        cancel: function (res) {}
                    });



                }
                else{
                    $(".mapBox").show();
                }
            }
            //码头
            if(response.data.scenic.pointses[i].type==13){
                if(response.data.scenic.pointses[i].l_type=="1"){
                    type8.name.push(response.data.scenic.pointses[i].chs_name);
                    type8.longitude.push(response.data.scenic.pointses[i].longitude);
                    type8.latitude.push(response.data.scenic.pointses[i].latitude);
                    type8.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type8 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='wharf2 iconall' data='8' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });
                    typelist8.push(marker_type8);
                    changed(typelist8_dengji, response, i, marker_type8);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type8, "click", marker_typeFn);
                    mapObj.remove(marker_type8);
                }else if(response.data.scenic.pointses[i].l_type=="2"){
                    type88.name.push(response.data.scenic.pointses[i].chs_name);
                    type88.longitude.push(response.data.scenic.pointses[i].longitude);
                    type88.latitude.push(response.data.scenic.pointses[i].latitude);
                    type88.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type88 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='wharf2 iconall' data='8' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });

                    typelist88.push(marker_type88);
                    changed(typelist88_dengji, response, i, marker_type88);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type88, "click", marker_typeFn);
                    mapObj.remove(marker_type88);
                }else if(response.data.scenic.pointses[i].l_type=="3"){
                    type888.name.push(response.data.scenic.pointses[i].chs_name);
                    type888.longitude.push(response.data.scenic.pointses[i].longitude);
                    type888.latitude.push(response.data.scenic.pointses[i].latitude);
                    type888.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type888 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='wharf2 iconall' data='8' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });

                    typelist888.push(marker_type888);
                    changed(typelist888_dengji, response, i, marker_type888);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type888, "click", marker_typeFn);
                    mapObj.remove(marker_type888);
                }else if(response.data.scenic.pointses[i].l_type=="4"){
                    type8888.name.push(response.data.scenic.pointses[i].chs_name);
                    type8888.longitude.push(response.data.scenic.pointses[i].longitude);
                    type8888.latitude.push(response.data.scenic.pointses[i].latitude);
                    type8888.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type8888 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='wharf2 iconall' data='8' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17, -17)
                    });

                    typelist8888.push(marker_type8888);
                    changed(typelist8888_dengji, response, i, marker_type8888);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type8888, "click", marker_typeFn);
                    mapObj.remove(marker_type8888);
                }


            }
            //厨房
            if(response.data.scenic.pointses[i].type==21){
                if(response.data.scenic.pointses[i].l_type=="1"){
                    type10.name.push(response.data.scenic.pointses[i].chs_name);
                    type10.longitude.push(response.data.scenic.pointses[i].longitude);
                    type10.latitude.push(response.data.scenic.pointses[i].latitude);
                    type10.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type10 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class=kitchen2 iconall' data='10' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });
                    typelist10.push(marker_type10);
                    changed(typelist10_dengji, response, i, marker_type10);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type10, "click",
                        //marker_typeFn
                        function(e){
                            let clickTarget=e.target.getContent();
                            let myNum=clickTarget.split("'")[6];
                            $(".kitchenBox").css("display","flex");
                            $("#container").addClass("vague");
                            $(".headTxt").text(response.data.scenic.pointses[myNum].chs_name);
                            $(".kitchenImg").attr("src","https://daoyou.worldmaipu.com/"+response.data.scenic.pointses[myNum].thumbImg);

                            $(".kitchenIntro").html(response.data.scenic.pointses[myNum].description);
                            $(".kitchenIntro img").load(
                                function(){
                                    console.log("加载完成")
                                }
                            )

                            $(".goKitchen").attr("href",response.data.scenic.pointses[myNum].intro);
                            //window.location.href=response.data.scenic.pointses[myNum].intro;
                            console.log(response.data.scenic.pointses[myNum].intro);
                        //    更新滚动条
                        //    sliderGo(".sliderKitchen",".sliderOutBox",".slider_bar",".kitchenIn",$(".kitchenInGo").height());
                        //    $(".kitchenIn").scroll(function(){
                        //        console.log(
                        //            $(".kitchenIn").scrollTop()/($(".kitchenInGo").height()-$(".kitchenIn").height())*($(".kitchenIn .sliderOutBox").height()-$(".kitchenIn .slider_bar").height()));
                        //
                        //        $(".info_box .slider_bar").css({
                        //            transform:'translateY(' +
                        //            $(".kitchenIn").scrollTop()/($(".kitchenInGo").height()-$(".kitchenIn").height())*($(".kitchenIn .sliderOutBox").height()-$(".kitchenIn .slider_bar").height())+
                        //            'px)',
                        //        })
                        //    })
                        }
                    );
                    mapObj.remove(marker_type10);
                }else if(response.data.scenic.pointses[i].l_type=="2"){
                    type1010.name.push(response.data.scenic.pointses[i].chs_name);
                    type1010.longitude.push(response.data.scenic.pointses[i].longitude);
                    type1010.latitude.push(response.data.scenic.pointses[i].latitude);
                    type1010.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type1010 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='kitchen2 iconall' data='10' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });

                    typelist1010.push(marker_type1010);
                    changed(typelist1010_dengji, response, i, marker_type1010);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type1010, "click", marker_typeFn);
                    mapObj.remove(marker_type1010);
                }else if(response.data.scenic.pointses[i].l_type=="3"){
                    type101010.name.push(response.data.scenic.pointses[i].chs_name);
                    type101010.longitude.push(response.data.scenic.pointses[i].longitude);
                    type101010.latitude.push(response.data.scenic.pointses[i].latitude);
                    type101010.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type101010 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='kitchen2 iconall' data='10' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17,-17)
                    });

                    typelist101010.push(marker_type101010);
                    changed(typelist101010_dengji, response, i, marker_type101010);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type101010, "click", marker_typeFn);
                    mapObj.remove(marker_type101010);
                }else if(response.data.scenic.pointses[i].l_type=="4"){
                    type10101010.name.push(response.data.scenic.pointses[i].chs_name);
                    type10101010.longitude.push(response.data.scenic.pointses[i].longitude);
                    type10101010.latitude.push(response.data.scenic.pointses[i].latitude);
                    type10101010.img.push(response.data.scenic.pointses[i].thumbImg);
                    var marker_type10101010 = new AMap.Marker({
                        map: mapObj,
                        content: "<div class='alltalk'><div class='wharf2 iconall' data='10' number='" +i+ "'></div><span class='poiName'> " +
                        response.data.scenic.pointses[i].chs_name +
                        "</span></div>",
                        position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                        //icon: "./webmap/imgs/marker.png",
                        offset: new AMap.Pixel(-17, -17)
                    });

                    typelist10101010.push(marker_type10101010);
                    changed(typelist10101010_dengji, response, i, marker_type10101010);
                    walking = new AMap.Walking({
                        map: mapObj,
                        hideMarkers:true
                    });
                    AMap.event.addListener(marker_type10101010, "click", marker_typeFn);
                    mapObj.remove(marker_type10101010);
                }
            }
            //这个链接暂时没有
            //tetUrl[num3]=response
            switch (response.data.scenic.pointses[i].pname) {
                case "导游":
                    xiaozu=[];
                    if (response.data.scenic.pointses[i].type != "1") {

                        //静态接口使用
                        //if(response.data.scenic.pointses[i].polygons!=null){
                        //    $.each(response.data.scenic.pointses[i].polygons, function (j) {
                        //        var dian = [];
                        //        dian[0] = response.data.scenic.pointses[i].polygons[j].longitude;
                        //        dian[1] = response.data.scenic.pointses[i].polygons[j].latitude;
                        //        xiaozu.push(new AMap.LngLat(dian[0], dian[1]));
                        //    })
                        //}

                        //非静态接口使用
                        if(response.data.scenic.pointses[i].polyStr!=null){
                            for (var j = 0; j < response.data.scenic.pointses[i].polyStr.split(",").length; j++) {
                                var dian = [];
                                dian[0] = response.data.scenic.pointses[i].polyStr.split(",")[j].split(";")[0];
                                dian[1] = response.data.scenic.pointses[i].polyStr.split(",")[j].split(";")[1];
                                if (!dian[1]) {
                                    console.log(response.data.scenic.pointses[i]);
                                    console.log(i + "*" + j);
                                }
                                xiaozu.push(new AMap.LngLat(dian[0], dian[1]));
                            }
                        }



                        txthead[num3] = response.data.scenic.pointses[i].chs_name;
                        txtlongitude[num3] = response.data.scenic.pointses[i].longitude;
                        txtlatitude[num3] = response.data.scenic.pointses[i].latitude;
                        imgs[num3] = response.data.scenic.pointses[i].thumbImg;
                        hid[i] = response.data.scenic.pointses[i].hid;
                        var url = response.data.scenic.pointses[i].audio;
                        if (url) {
                            var mindex = url.indexOf(".");
                            var mp3 = url.substr(0, mindex) + ".mp3";
                            mp3Url[num3] = param.newUrl + mp3;
                        } else {
                            mp3Url[num3] = "";
                        }

                        //swt为eachLevel的数组的序号，difference是最大值和最小值的差值，默认最小为13层
                        var swt = response.data.scenic.pointses[i].min_zoom - 13;
                        var difference = response.data.scenic.pointses[i].max_zoom - response.data.scenic.pointses[i].min_zoom;
                        var url = response.data.scenic.pointses[i].audio;
                        for (var k = 0; k < difference + 1; k++) {
                            //判断语言
                            if(response.data.scenic.pointses[i].l_type=="1"){
                                goLevel.eachLevel[swt + k].txthead.push(response.data.scenic.pointses[i].chs_name);
                                goLevel.eachLevel[swt + k].txtlongitude.push(response.data.scenic.pointses[i].longitude);
                                goLevel.eachLevel[swt + k].txtlatitude.push(response.data.scenic.pointses[i].latitude);
                                goLevel.eachLevel[swt + k].imgs.push(response.data.scenic.pointses[i].thumbImg);
                                goLevel.eachLevel[swt + k].numData.push(num3);
                                goLevel.eachLevel[swt + k].hid.push(response.data.scenic.pointses[i].hid);
                                goLevel.eachLevel[swt + k].hotSpotBound.push(xiaozu);
                                if (url) {
                                    var mindex = url.indexOf(".");
                                    var mp3 = url.substr(0, mindex) + ".mp3";
                                    goLevel.eachLevel[swt + k].mp3Url.push(param.newUrl + mp3);
                                } else {
                                    goLevel.eachLevel[swt + k].mp3Url.push("");
                                }
                            }else if(response.data.scenic.pointses[i].l_type=="2"){
                                goLevel_en.eachLevel[swt + k].txthead.push(response.data.scenic.pointses[i].chs_name);
                                goLevel_en.eachLevel[swt + k].txtlongitude.push(response.data.scenic.pointses[i].longitude);
                                goLevel_en.eachLevel[swt + k].txtlatitude.push(response.data.scenic.pointses[i].latitude);
                                goLevel_en.eachLevel[swt + k].imgs.push(response.data.scenic.pointses[i].thumbImg);
                                goLevel_en.eachLevel[swt + k].numData.push(num3);
                                goLevel_en.eachLevel[swt + k].hid.push(response.data.scenic.pointses[i].hid);
                                goLevel_en.eachLevel[swt + k].hotSpotBound.push(xiaozu);
                                //console.log(goLevel_en.eachLevel[swt+k])
                                if (url) {
                                    var mindex = url.indexOf(".");
                                    var mp3 = url.substr(0, mindex) + ".mp3";
                                    goLevel_en.eachLevel[swt + k].mp3Url.push(param.newUrl + mp3);
                                } else {
                                    goLevel_en.eachLevel[swt + k].mp3Url.push("");
                                }
                            }else if(response.data.scenic.pointses[i].l_type=="3"){
                                goLevel_kor.eachLevel[swt + k].txthead.push(response.data.scenic.pointses[i].chs_name);
                                goLevel_kor.eachLevel[swt + k].txtlongitude.push(response.data.scenic.pointses[i].longitude);
                                goLevel_kor.eachLevel[swt + k].txtlatitude.push(response.data.scenic.pointses[i].latitude);
                                goLevel_kor.eachLevel[swt + k].imgs.push(response.data.scenic.pointses[i].thumbImg);
                                goLevel_kor.eachLevel[swt + k].numData.push(num3);
                                goLevel_kor.eachLevel[swt + k].hid.push(response.data.scenic.pointses[i].hid);
                                goLevel_kor.eachLevel[swt + k].hotSpotBound.push(xiaozu);
                                //console.log(goLevel_en.eachLevel[swt+k])
                                if (url) {
                                    var mindex = url.indexOf(".");
                                    var mp3 = url.substr(0, mindex) + ".mp3";
                                    goLevel_kor.eachLevel[swt + k].mp3Url.push(param.newUrl + mp3);
                                } else {
                                    goLevel_kor.eachLevel[swt + k].mp3Url.push("");
                                }
                            }else if(response.data.scenic.pointses[i].l_type=="4"){
                                goLevel_jpn.eachLevel[swt + k].txthead.push(response.data.scenic.pointses[i].chs_name);
                                goLevel_jpn.eachLevel[swt + k].txtlongitude.push(response.data.scenic.pointses[i].longitude);
                                goLevel_jpn.eachLevel[swt + k].txtlatitude.push(response.data.scenic.pointses[i].latitude);
                                goLevel_jpn.eachLevel[swt + k].imgs.push(response.data.scenic.pointses[i].thumbImg);
                                goLevel_jpn.eachLevel[swt + k].numData.push(num3);
                                goLevel_jpn.eachLevel[swt + k].hid.push(response.data.scenic.pointses[i].hid);
                                goLevel_jpn.eachLevel[swt + k].hotSpotBound.push(xiaozu);
                                //console.log(goLevel_en.eachLevel[swt+k])
                                if (url) {
                                    var mindex = url.indexOf(".");
                                    var mp3 = url.substr(0, mindex) + ".mp3";
                                    goLevel_jpn.eachLevel[swt + k].mp3Url.push(param.newUrl + mp3);
                                } else {
                                    goLevel_jpn.eachLevel[swt + k].mp3Url.push("");
                                }
                            }



                        }
                        ;
                        //console.log(xiaozu);
                        num3++;

                        //各个缩放级别的marker
                        for (var h = 0; h < difference + 1; h++) {
                            if(response.data.scenic.pointses[i].l_type=="1"){
                                var marker324 = new AMap.Marker({
                                    map: mapObj,
                                    content: "<div class='alltalk'><div class='talk' data='1' number='" +
                                    viewList[swt + h].num +
                                    "'id='l" +
                                    (swt + h) + viewList[swt + h].num +
                                    "' floor_level='" +
                                    h +
                                    "'></div><span class='poiName'>" +
                                    response.data.scenic.pointses[i].chs_name +
                                    "</span></div>",
                                    position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                    //icon: "./webmap/imgs/marker.png",
                                    offset: new AMap.Pixel(-17, -17)
                                });

                                marker_list[swt + h].d.push(marker324);
                                viewList[swt + h].num = viewList[swt + h].num + 1;
                                AMap.event.addListener(marker324, "click", function (e) {
                                    console.log("中文语音点");
                                    $(".mapBox").hide();
                                    if(clickviable){

                                        $("#audioGuide").removeClass("itemActive");
                                        $(" .playBox").css({
                                            "background": "url(./webmap/imgs/play.svg)",
                                            "background-repeat": "no-repeat",
                                            "background-position": "43%,center"
                                        });
                                        var tip_content = this.getContent();
                                        $(".end").hide();
                                        $(".sliderBox").css("left", 0);
                                        var level = tip_content.split("'")[11];
                                        sign = tip_content.split("'")[7];
                                        console.log(level + "**" + sign);
                                        //alert(sign);
                                        document.getElementById("myaudio").src = goLevel.eachLevel[goLevel.level - 13].mp3Url[parseInt(sign)];
                                        console.log(goLevel.eachLevel[goLevel.level - 13].mp3Url[parseInt(sign)])
                                        $(".slide").hide();
                                        $(".sliderBox").show();
                                        $("#wx_location").hide();
                                        if ($("#l" + (swt + parseInt(level)) + sign).hasClass("gobig")) {
                                            $("#l" + (swt + parseInt(level)) + sign).removeClass("gobig");
                                            $(".b_tool").hide();
                                            $("#audioGuide").addClass("itemActive");
                                            $(".slide").show();
                                            $("#wx_location").show();
                                        }
                                        else {
                                            $(".gobig").removeClass("gobig");
                                            $("#l" + (swt + parseInt(level)) + sign).addClass("gobig");
                                            mapObj.setCenter([response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude]);
                                            $(".b_tool").show();
                                            $(".sliderBox>div").eq(0).addClass("slider_active");
                                            var num = parseInt(sign);
                                            $(".sliderBox").css({
                                                "left": "-" + (($(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right")) * 1) * num) + "px"
                                            })
                                            $(".slider_active").removeClass("slider_active");
                                            $(".sliderBox>div").eq(num).addClass("slider_active");
                                        }
                                        hidLang();
                                    }
                                    else{
                                        if(language=="chs"){
                                            alert("关闭自动导览解锁")
                                        }else if(language=="enu"){
                                            alert("Close automatic guide unlocking")
                                        }else if(language=="kor"){
                                            alert("자동 잠금 해제 사용 중지")
                                        }else if(language=="jpn"){
                                            alert("自動ロック解除を無効にする")
                                        }

                                    }

                                });
                                mapObj.remove(marker324);
                            }
                            else if(response.data.scenic.pointses[i].l_type=="2"){
                                var marker3244 = new AMap.Marker({
                                    map: mapObj,
                                    content: "<div class='alltalk'><div class='talk' data='1' number='" +
                                    viewList_en[swt + h].num +
                                    "'id='l" +
                                    (swt + h) + viewList_en[swt + h].num +
                                    "' floor_level='" +
                                    h +
                                    "'></div><span class='poiName'>" +
                                    response.data.scenic.pointses[i].chs_name +
                                    "</span></div>",
                                    position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                    //icon: "./webmap/imgs/marker.png",
                                    offset: new AMap.Pixel(-17, -17)
                                });

                                marker_list_en[swt + h].d.push(marker3244);
                                viewList_en[swt + h].num = viewList_en[swt + h].num + 1;
                                AMap.event.addListener(marker3244, "click", function (e) {
                                    console.log("英文语音点");
                                    $(".mapBox").hide();
                                    if(clickviable){
                                        $("#audioGuide").removeClass("itemActive");
                                        $(" .playBox").css({
                                            "background": "url(./webmap/imgs/play.svg)",
                                            "background-repeat": "no-repeat",
                                            "background-position": "43%,center"
                                        });
                                        var tip_content = this.getContent();
                                        $(".end").hide();
                                        $(".sliderBox").css("left", 0);
                                        var level = tip_content.split("'")[11];
                                        sign = tip_content.split("'")[7];
                                        console.log(level + "**" + sign);
                                        //alert(sign);
                                        document.getElementById("myaudio").src = goLevel_en.eachLevel[goLevel_en.level - 13].mp3Url[parseInt(sign)];
                                        console.log(goLevel_en.eachLevel[goLevel_en.level - 13].mp3Url[parseInt(sign)]);
                                        $(".slide").hide();
                                        $(".sliderBox").show();
                                        $("#wx_location").hide();
                                        if ($("#l" + (swt + parseInt(level)) + sign).hasClass("gobig")) {
                                            $("#l" + (swt + parseInt(level)) + sign).removeClass("gobig");
                                            $(".b_tool").hide();
                                            $("#audioGuide").addClass("itemActive");
                                            $(".slide").show();
                                            $("#wx_location").show();
                                        }
                                        else {
                                            $(".gobig").removeClass("gobig");
                                            $("#l" + (swt + parseInt(level)) + sign).addClass("gobig");
                                            mapObj.setCenter([response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude]);
                                            $(".b_tool").show();
                                            $(".sliderBox>div").eq(0).addClass("slider_active");
                                            var num = parseInt(sign);
                                            $(".sliderBox").css({
                                                "left": "-" + (($(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right")) * 1) * num) + "px"
                                            })
                                            $(".slider_active").removeClass("slider_active");
                                            $(".sliderBox>div").eq(num).addClass("slider_active");
                                        }
                                        hidLang();
                                    }
                                    else{
                                        if(language=="chs"){
                                            alert("关闭自动导览解锁")
                                        }else if(language=="enu"){
                                            alert("Close automatic guide unlocking")
                                        }else if(language=="kor"){
                                            alert("자동 잠금 해제 사용 중지")
                                        }else if(language=="jpn"){
                                            alert("自動ロック解除を無効にする")
                                        }

                                    }

                                });
                                mapObj.remove(marker3244);
                            }else if(response.data.scenic.pointses[i].l_type=="3"){
                                var marker32444 = new AMap.Marker({
                                    map: mapObj,
                                    content: "<div class='alltalk'><div class='talk' data='1' number='" +
                                    viewList_kor[swt + h].num +
                                    "'id='l" +
                                    (swt + h) + viewList_kor[swt + h].num +
                                    "' floor_level='" +
                                    h +
                                    "'></div><span class='poiName'>" +
                                    response.data.scenic.pointses[i].chs_name +
                                    "</span></div>",
                                    position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                    //icon: "./webmap/imgs/marker.png",
                                    offset: new AMap.Pixel(-17, -17)
                                });

                                marker_list_kor[swt + h].d.push(marker32444);
                                viewList_kor[swt + h].num = viewList_kor[swt + h].num + 1;
                                AMap.event.addListener(marker32444, "click", function (e) {
                                    console.log("韩文语音点");
                                    $(".mapBox").hide();
                                    if(clickviable){
                                        $("#audioGuide").removeClass("itemActive");
                                        $(" .playBox").css({
                                            "background": "url(./webmap/imgs/play.svg)",
                                            "background-repeat": "no-repeat",
                                            "background-position": "43%,center"
                                        });
                                        var tip_content = this.getContent();
                                        $(".end").hide();
                                        $(".sliderBox").css("left", 0);
                                        var level = tip_content.split("'")[11];
                                        sign = tip_content.split("'")[7];
                                        console.log(level + "**" + sign);
                                        //alert(sign);
                                        document.getElementById("myaudio").src = goLevel_kor.eachLevel[goLevel_kor.level - 13].mp3Url[parseInt(sign)];
                                        console.log(goLevel_kor.eachLevel[goLevel_kor.level - 13].mp3Url[parseInt(sign)]);
                                        $(".slide").hide();
                                        $(".sliderBox").show();
                                        $("#wx_location").hide();
                                        if ($("#l" + (swt + parseInt(level)) + sign).hasClass("gobig")) {
                                            $("#l" + (swt + parseInt(level)) + sign).removeClass("gobig");
                                            $(".b_tool").hide();
                                            $("#audioGuide").addClass("itemActive");
                                            $(".slide").show();
                                            $("#wx_location").show();
                                        }
                                        else {
                                            $(".gobig").removeClass("gobig");
                                            $("#l" + (swt + parseInt(level)) + sign).addClass("gobig");
                                            mapObj.setCenter([response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude]);
                                            $(".b_tool").show();
                                            $(".sliderBox>div").eq(0).addClass("slider_active");
                                            var num = parseInt(sign);
                                            $(".sliderBox").css({
                                                "left": "-" + (($(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right")) * 1) * num) + "px"
                                            })
                                            $(".slider_active").removeClass("slider_active");
                                            $(".sliderBox>div").eq(num).addClass("slider_active");
                                        }
                                        hidLang();
                                    }
                                    else{
                                        if(language=="chs"){
                                            alert("关闭自动导览解锁")
                                        }else if(language=="enu"){
                                            alert("Close automatic guide unlocking")
                                        }else if(language=="kor"){
                                            alert("자동 잠금 해제 사용 중지")
                                        }else if(language=="jpn"){
                                            alert("自動ロック解除を無効にする")
                                        }

                                    }

                                });
                                mapObj.remove(marker32444);
                            }else if(response.data.scenic.pointses[i].l_type=="4"){
                                var marker324444 = new AMap.Marker({
                                    map: mapObj,
                                    content: "<div class='alltalk'><div class='talk' data='1' number='" +
                                    viewList_jpn[swt + h].num +
                                    "'id='l" +
                                    (swt + h) + viewList_jpn[swt + h].num +
                                    "' floor_level='" +
                                    h +
                                    "'></div><span class='poiName'>" +
                                    response.data.scenic.pointses[i].chs_name +
                                    "</span></div>",
                                    position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                    //icon: "./webmap/imgs/marker.png",
                                    offset: new AMap.Pixel(-17, -17)
                                });

                                marker_list_jpn[swt + h].d.push(marker324444);
                                viewList_jpn[swt + h].num = viewList_jpn[swt + h].num + 1;
                                AMap.event.addListener(marker324444, "click", function (e) {
                                    console.log("日文语音点");
                                    $(".mapBox").hide();
                                    if(clickviable){
                                        $("#audioGuide").removeClass("itemActive");
                                        $(" .playBox").css({
                                            "background": "url(./webmap/imgs/play.svg)",
                                            "background-repeat": "no-repeat",
                                            "background-position": "43%,center"
                                        });
                                        var tip_content = this.getContent();
                                        $(".end").hide();
                                        $(".sliderBox").css("left", 0);
                                        var level = tip_content.split("'")[11];
                                        sign = tip_content.split("'")[7];
                                        console.log(level + "**" + sign);
                                        //alert(sign);
                                        document.getElementById("myaudio").src = goLevel_jpn.eachLevel[goLevel_jpn.level - 13].mp3Url[parseInt(sign)];
                                        console.log(goLevel_jpn.eachLevel[goLevel_jpn.level - 13].mp3Url[parseInt(sign)]);
                                        $(".slide").hide();
                                        $(".sliderBox").show();
                                        $("#wx_location").hide();
                                        if ($("#l" + (swt + parseInt(level)) + sign).hasClass("gobig")) {
                                            $("#l" + (swt + parseInt(level)) + sign).removeClass("gobig");
                                            $(".b_tool").hide();
                                            $("#audioGuide").addClass("itemActive");
                                            $(".slide").show();
                                            $("#wx_location").show();
                                        }
                                        else {
                                            $(".gobig").removeClass("gobig");
                                            $("#l" + (swt + parseInt(level)) + sign).addClass("gobig");
                                            mapObj.setCenter([response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude]);
                                            $(".b_tool").show();
                                            $(".sliderBox>div").eq(0).addClass("slider_active");
                                            var num = parseInt(sign);
                                            $(".sliderBox").css({
                                                "left": "-" + (($(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right")) * 1) * num) + "px"
                                            })
                                            $(".slider_active").removeClass("slider_active");
                                            $(".sliderBox>div").eq(num).addClass("slider_active");
                                        }
                                        hidLang();
                                    }
                                    else{
                                        if(language=="chs"){
                                            alert("关闭自动导览解锁")
                                        }else if(language=="enu"){
                                            alert("Close automatic guide unlocking")
                                        }else if(language=="kor"){
                                            alert("자동 잠금 해제 사용 중지")
                                        }else if(language=="jpn"){
                                            alert("自動ロック解除を無効にする")
                                        }

                                    }

                                });
                                mapObj.remove(marker324444);
                            }

                        }
                    }
                    //景点
                    if (response.data.scenic.pointses[i].type != "1"){
                        if(response.data.scenic.pointses[i].l_type=="1"){
                            type5.name.push(response.data.scenic.pointses[i].chs_name);
                            type5.longitude.push(response.data.scenic.pointses[i].longitude);
                            type5.latitude.push(response.data.scenic.pointses[i].latitude);
                            type5.img.push(response.data.scenic.pointses[i].thumbImg);
                            var marker_type5 = new AMap.Marker({
                                map: mapObj,
                                content: "<div class='alltalk'><div class='guide2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                                response.data.scenic.pointses[i].chs_name +
                                "</span></div>",
                                position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                //icon: "./webmap/imgs/marker.png",
                                offset: new AMap.Pixel(-17, -17)
                            })
                            typelist5.push(marker_type5);
                            changed(typelist5_dengji, response, i, marker_type5);
                            walking = new AMap.Walking({
                                map: mapObj,
                                hideMarkers:true,
                                autoFitView:false
                                //isOutline:false,
                                //outlineColor:"black"
                            });
                            AMap.event.addListener(marker_type5, "click", marker_typeFn);
                            mapObj.remove(marker_type5);
                        }else if(response.data.scenic.pointses[i].l_type=="2"){
                            type55.name.push(response.data.scenic.pointses[i].chs_name);
                            type55.longitude.push(response.data.scenic.pointses[i].longitude);
                            type55.latitude.push(response.data.scenic.pointses[i].latitude);
                            type55.img.push(response.data.scenic.pointses[i].thumbImg);
                            var marker_type55 = new AMap.Marker({
                                map: mapObj,
                                content: "<div class='alltalk'><div class='guide2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                                response.data.scenic.pointses[i].chs_name +
                                "</span></div>",
                                position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                //icon: "./webmap/imgs/marker.png",
                                offset: new AMap.Pixel(-17, -17)
                            })
                            typelist55.push(marker_type55);
                            changed(typelist55_dengji, response, i, marker_type55);
                            walking = new AMap.Walking({
                                map: mapObj,
                                hideMarkers:true,
                                autoFitView:false
                                //isOutline:false,
                                //outlineColor:"black"
                            });
                            AMap.event.addListener(marker_type55, "click", marker_typeFn);
                            mapObj.remove(marker_type55);
                        }else if(response.data.scenic.pointses[i].l_type=="3"){
                            type555.name.push(response.data.scenic.pointses[i].chs_name);
                            type555.longitude.push(response.data.scenic.pointses[i].longitude);
                            type555.latitude.push(response.data.scenic.pointses[i].latitude);
                            type555.img.push(response.data.scenic.pointses[i].thumbImg);
                            var marker_type555 = new AMap.Marker({
                                map: mapObj,
                                content: "<div class='alltalk'><div class='guide2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                                response.data.scenic.pointses[i].chs_name +
                                "</span></div>",
                                position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                //icon: "./webmap/imgs/marker.png",
                                offset: new AMap.Pixel(-17, -17)
                            })
                            typelist555.push(marker_type555);
                            changed(typelist555_dengji, response, i, marker_type555);
                            walking = new AMap.Walking({
                                map: mapObj,
                                hideMarkers:true,
                                autoFitView:false
                                //isOutline:false,
                                //outlineColor:"black"
                            });
                            AMap.event.addListener(marker_type555, "click", marker_typeFn);
                            mapObj.remove(marker_type555);
                        }
                        else if(response.data.scenic.pointses[i].l_type=="4"){
                            type5555.name.push(response.data.scenic.pointses[i].chs_name);
                            type5555.longitude.push(response.data.scenic.pointses[i].longitude);
                            type5555.latitude.push(response.data.scenic.pointses[i].latitude);
                            type5555.img.push(response.data.scenic.pointses[i].thumbImg);
                            var marker_type5555 = new AMap.Marker({
                                map: mapObj,
                                content: "<div class='alltalk'><div class='guide2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                                response.data.scenic.pointses[i].chs_name +
                                "</span></div>",
                                position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                                //icon: "./webmap/imgs/marker.png",
                                offset: new AMap.Pixel(-17, -17)
                            })
                            typelist5555.push(marker_type5555);
                            changed(typelist5555_dengji, response, i, marker_type5555);
                            walking = new AMap.Walking({
                                map: mapObj,
                                hideMarkers:true,
                                autoFitView:false
                                //isOutline:false,
                                //outlineColor:"black"
                            });
                            AMap.event.addListener(marker_type5555, "click", marker_typeFn);
                            mapObj.remove(marker_type5555);
                        }


                    }
                    break;
                case "卫生间":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type2.name.push(response.data.scenic.pointses[i].chs_name);
                        type2.longitude.push(response.data.scenic.pointses[i].longitude);
                        type2.latitude.push(response.data.scenic.pointses[i].latitude);
                        type2.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type2 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='toilet2 iconall' data='2' number='" +i+ "'></div><span class='poiName'> " +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist2.push(marker_type2);
                        changed(typelist2_dengji, response, i, marker_type2);
                        walking = new AMap.Walking({
                            map: mapObj,
                            isOutline:false,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type2, "click", marker_typeFn);
                        mapObj.remove(marker_type2);
                    }
                    else if(response.data.scenic.pointses[i].l_type=="2"){
                        type22.name.push(response.data.scenic.pointses[i].chs_name);
                        type22.longitude.push(response.data.scenic.pointses[i].longitude);
                        type22.latitude.push(response.data.scenic.pointses[i].latitude);
                        type22.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type22 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='toilet2 iconall' data='2' number='" +i+ "'></div><span class='poiName'> " +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist22.push(marker_type22);
                        changed(typelist22_dengji, response, i, marker_type22);
                        walking = new AMap.Walking({
                            map: mapObj,
                            isOutline:false,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type22, "click", marker_typeFn);
                        mapObj.remove(marker_type22);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type222.name.push(response.data.scenic.pointses[i].chs_name);
                        type222.longitude.push(response.data.scenic.pointses[i].longitude);
                        type222.latitude.push(response.data.scenic.pointses[i].latitude);
                        type222.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type222 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='toilet2 iconall' data='2' number='" +i+ "'></div><span class='poiName'> " +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist222.push(marker_type222);
                        changed(typelist222_dengji, response, i, marker_type222);
                        walking = new AMap.Walking({
                            map: mapObj,
                            isOutline:false,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type222, "click", marker_typeFn);
                        mapObj.remove(marker_type222);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type2222.name.push(response.data.scenic.pointses[i].chs_name);
                        type2222.longitude.push(response.data.scenic.pointses[i].longitude);
                        type2222.latitude.push(response.data.scenic.pointses[i].latitude);
                        type2222.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type2222 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='toilet2 iconall' data='2' number='" +i+ "'></div><span class='poiName'> " +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist2222.push(marker_type2222);
                        changed(typelist2222_dengji, response, i, marker_type2222);
                        walking = new AMap.Walking({
                            map: mapObj,
                            isOutline:false,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type2222, "click", marker_typeFn);
                        mapObj.remove(marker_type2222);
                    }



                    break;
                case "停车场":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type3.name.push(response.data.scenic.pointses[i].chs_name);
                        type3.longitude.push(response.data.scenic.pointses[i].longitude);
                        type3.latitude.push(response.data.scenic.pointses[i].latitude);
                        type3.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type3 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='park2 iconall' data='3' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist3.push(marker_type3);
                        changed(typelist3_dengji, response, i, marker_type3);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type3, "click", marker_typeFn);
                        mapObj.remove(marker_type3);
                    }else if(response.data.scenic.pointses[i].l_type=="2"){
                        type33.name.push(response.data.scenic.pointses[i].chs_name);
                        type33.longitude.push(response.data.scenic.pointses[i].longitude);
                        type33.latitude.push(response.data.scenic.pointses[i].latitude);
                        type33.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type33 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='park2 iconall' data='3' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist33.push(marker_type33);
                        changed(typelist33_dengji, response, i, marker_type33);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type33, "click", marker_typeFn);
                        mapObj.remove(marker_type33);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type333.name.push(response.data.scenic.pointses[i].chs_name);
                        type333.longitude.push(response.data.scenic.pointses[i].longitude);
                        type333.latitude.push(response.data.scenic.pointses[i].latitude);
                        type333.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type333 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='park2 iconall' data='3' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist333.push(marker_type333);
                        changed(typelist333_dengji, response, i, marker_type333);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type333, "click", marker_typeFn);
                        mapObj.remove(marker_type333);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type3333.name.push(response.data.scenic.pointses[i].chs_name);
                        type3333.longitude.push(response.data.scenic.pointses[i].longitude);
                        type3333.latitude.push(response.data.scenic.pointses[i].latitude);
                        type3333.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type3333 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='park2 iconall' data='3' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist3333.push(marker_type3333);
                        changed(typelist3333_dengji, response, i, marker_type3333);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type3333, "click", marker_typeFn);
                        mapObj.remove(marker_type3333);
                    }


                    break;
                case "餐饮":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type4.name.push(response.data.scenic.pointses[i].chs_name);
                        type4.longitude.push(response.data.scenic.pointses[i].longitude);
                        type4.latitude.push(response.data.scenic.pointses[i].latitude);
                        type4.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type4 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='cate2 iconall' data='4' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist4.push(marker_type4);
                        changed(typelist4_dengji, response, i, marker_type4);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type4, "click", marker_typeFn);
                        mapObj.remove(marker_type4);
                    }else if(response.data.scenic.pointses[i].l_type=="2"){
                        type44.name.push(response.data.scenic.pointses[i].chs_name);
                        type44.longitude.push(response.data.scenic.pointses[i].longitude);
                        type44.latitude.push(response.data.scenic.pointses[i].latitude);
                        type44.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type44 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='cate2 iconall' data='4' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist44.push(marker_type44);
                        changed(typelist44_dengji, response, i, marker_type44);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type44, "click", marker_typeFn);
                        mapObj.remove(marker_type44);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type444.name.push(response.data.scenic.pointses[i].chs_name);
                        type444.longitude.push(response.data.scenic.pointses[i].longitude);
                        type444.latitude.push(response.data.scenic.pointses[i].latitude);
                        type444.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type444 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='cate2 iconall' data='4' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist444.push(marker_type444);
                        changed(typelist444_dengji, response, i, marker_type444);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type444, "click", marker_typeFn);
                        mapObj.remove(marker_type444);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type4444.name.push(response.data.scenic.pointses[i].chs_name);
                        type4444.longitude.push(response.data.scenic.pointses[i].longitude);
                        type4444.latitude.push(response.data.scenic.pointses[i].latitude);
                        type4444.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type4444 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='cate2 iconall' data='4' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist4444.push(marker_type4444);
                        changed(typelist4444_dengji, response, i, marker_type4444);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type4444, "click", marker_typeFn);
                        mapObj.remove(marker_type4444);
                    }

                    break;
                case "住宿":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type9.name.push(response.data.scenic.pointses[i].chs_name);
                        type9.longitude.push(response.data.scenic.pointses[i].longitude);
                        type9.latitude.push(response.data.scenic.pointses[i].latitude);
                        type9.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type9 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='stay2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist9.push(marker_type9);
                        changed(typelist9_dengji, response, i, marker_type9);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type9, "click", marker_typeFn);
                        mapObj.remove(marker_type9);
                    }else if(response.data.scenic.pointses[i].l_type=="2"){
                        type99.name.push(response.data.scenic.pointses[i].chs_name);
                        type99.longitude.push(response.data.scenic.pointses[i].longitude);
                        type99.latitude.push(response.data.scenic.pointses[i].latitude);
                        type99.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type99 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='stay2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist99.push(marker_type99);
                        changed(typelist99_dengji, response, i, marker_type99);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type99, "click", marker_typeFn);
                        mapObj.remove(marker_type99);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type999.name.push(response.data.scenic.pointses[i].chs_name);
                        type999.longitude.push(response.data.scenic.pointses[i].longitude);
                        type999.latitude.push(response.data.scenic.pointses[i].latitude);
                        type999.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type999 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='stay2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist999.push(marker_type999);
                        changed(typelist999_dengji, response, i, marker_type999);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type999, "click", marker_typeFn);
                        mapObj.remove(marker_type999);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type9999.name.push(response.data.scenic.pointses[i].chs_name);
                        type9999.longitude.push(response.data.scenic.pointses[i].longitude);
                        type9999.latitude.push(response.data.scenic.pointses[i].latitude);
                        type9999.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type9999 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='stay2 iconall' data='5' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist9999.push(marker_type9999);
                        changed(typelist9999_dengji, response, i, marker_type9999);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type9999, "click", marker_typeFn);
                        mapObj.remove(marker_type9999);
                    }

                    break;
                case "购物":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type6.name.push(response.data.scenic.pointses[i].chs_name);
                        type6.longitude.push(response.data.scenic.pointses[i].longitude);
                        type6.latitude.push(response.data.scenic.pointses[i].latitude);
                        type6.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type6 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='shop2 iconall' data='6' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist6.push(marker_type6);
                        changed(typelist6_dengji, response, i, marker_type6);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type6, "click",marker_typeFn);
                        mapObj.remove(marker_type6);
                    }else if(response.data.scenic.pointses[i].l_type=="2"){
                        type66.name.push(response.data.scenic.pointses[i].chs_name);
                        type66.longitude.push(response.data.scenic.pointses[i].longitude);
                        type66.latitude.push(response.data.scenic.pointses[i].latitude);
                        type66.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type66 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='shop2 iconall' data='6' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist66.push(marker_type66);
                        changed(typelist66_dengji, response, i, marker_type66);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type66, "click",marker_typeFn);
                        mapObj.remove(marker_type66);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type666.name.push(response.data.scenic.pointses[i].chs_name);
                        type666.longitude.push(response.data.scenic.pointses[i].longitude);
                        type666.latitude.push(response.data.scenic.pointses[i].latitude);
                        type666.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type666 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='shop2 iconall' data='6' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist666.push(marker_type666);
                        changed(typelist666_dengji, response, i, marker_type666);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type666, "click",marker_typeFn);
                        mapObj.remove(marker_type666);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type6666.name.push(response.data.scenic.pointses[i].chs_name);
                        type6666.longitude.push(response.data.scenic.pointses[i].longitude);
                        type6666.latitude.push(response.data.scenic.pointses[i].latitude);
                        type6666.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type6666 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='shop2 iconall' data='6' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist6666.push(marker_type6666);
                        changed(typelist6666_dengji, response, i, marker_type6666);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type6666, "click",marker_typeFn);
                        mapObj.remove(marker_type6666);
                    }

                    break;
                case "游客服务":
                    if(response.data.scenic.pointses[i].l_type=="1"){
                        type7.name.push(response.data.scenic.pointses[i].chs_name);
                        type7.longitude.push(response.data.scenic.pointses[i].longitude);
                        type7.latitude.push(response.data.scenic.pointses[i].latitude);
                        type7.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type7 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='service2 iconall' data='7' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist7.push(marker_type7);
                        changed(typelist7_dengji, response, i, marker_type7);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type7, "click", marker_typeFn);
                        mapObj.remove(marker_type7);
                    }else if(response.data.scenic.pointses[i].l_type=="2"){
                        type77.name.push(response.data.scenic.pointses[i].chs_name);
                        type77.longitude.push(response.data.scenic.pointses[i].longitude);
                        type77.latitude.push(response.data.scenic.pointses[i].latitude);
                        type77.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type77 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='service2 iconall' data='7' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist77.push(marker_type77);
                        changed(typelist77_dengji, response, i, marker_type77);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type77, "click", marker_typeFn);
                        mapObj.remove(marker_type77);
                    }else if(response.data.scenic.pointses[i].l_type=="3"){
                        type777.name.push(response.data.scenic.pointses[i].chs_name);
                        type777.longitude.push(response.data.scenic.pointses[i].longitude);
                        type777.latitude.push(response.data.scenic.pointses[i].latitude);
                        type777.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type777 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='service2 iconall' data='7' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist777.push(marker_type777);
                        changed(typelist777_dengji, response, i, marker_type777);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type777, "click", marker_typeFn);
                        mapObj.remove(marker_type777);
                    }else if(response.data.scenic.pointses[i].l_type=="4"){
                        type7777.name.push(response.data.scenic.pointses[i].chs_name);
                        type7777.longitude.push(response.data.scenic.pointses[i].longitude);
                        type7777.latitude.push(response.data.scenic.pointses[i].latitude);
                        type7777.img.push(response.data.scenic.pointses[i].thumbImg);
                        var marker_type7777 = new AMap.Marker({
                            map: mapObj,
                            content: "<div class='alltalk'><div class='service2 iconall' data='7' number='"+i + "'></div><span class='poiName'>" +
                            response.data.scenic.pointses[i].chs_name +
                            "</span></div>",
                            position: new AMap.LngLat(response.data.scenic.pointses[i].longitude, response.data.scenic.pointses[i].latitude),
                            //icon: "./webmap/imgs/marker.png",
                            offset: new AMap.Pixel(-17, -17)
                        })
                        typelist7777.push(marker_type7777);
                        changed(typelist7777_dengji, response, i, marker_type7777);
                        walking = new AMap.Walking({
                            map: mapObj,
                            hideMarkers:true
                        });
                        AMap.event.addListener(marker_type7777, "click", marker_typeFn);
                        mapObj.remove(marker_type7777);
                    }

                    break;
                default :
                    break;
            }
            //等级设置好了之后弄
            //    移除除语音以外的
            mapObj.remove(typelist9);
            mapObj.remove(typelist8);
            mapObj.remove(typelist7);
            mapObj.remove(typelist6);
            mapObj.remove(typelist5);
            mapObj.remove(typelist4);
            mapObj.remove(typelist3);
            mapObj.remove(typelist2);
            //设置语音
            mapObj.remove(marker_list[0].d);
            mapObj.remove(marker_list[1].d);
            mapObj.remove(marker_list[2].d);
            mapObj.remove(marker_list[4].d);
            mapObj.remove(marker_list[5].d);
            mapObj.remove(marker_list[6].d);
            //    调整字
            if(language=="chs"){
                mapObj.remove(mapTxtMain);
                mapObj.add(mapTxt.d16);
                mapObj.add(mapTxt.d15);
                mapObj.add(mapTxt.d14);
                mapObj.add(mapTxt.d13);
                mapObj.remove(mapTxt.d13m);
                mapObj.remove(mapTxt.d14m);
                mapObj.remove(mapTxt.d15m);
            }else if(language=="enu"){
                mapObj.remove(mapTxtMain_en);
                mapObj.add(mapTxt_en.d16);
                mapObj.add(mapTxt_en.d15);
                mapObj.add(mapTxt_en.d14);
                mapObj.add(mapTxt_en.d13);
                mapObj.remove(mapTxt_en.d13m);
                mapObj.remove(mapTxt_en.d14m);
                mapObj.remove(mapTxt_en.d15m);
            }else if(language=="kor"){
                mapObj.remove(mapTxtMain_kor);
                mapObj.add(mapTxt_kor.d16);
                mapObj.add(mapTxt_kor.d15);
                mapObj.add(mapTxt_kor.d14);
                mapObj.add(mapTxt_kor.d13);
                mapObj.remove(mapTxt_kor.d13m);
                mapObj.remove(mapTxt_kor.d14m);
                mapObj.remove(mapTxt_kor.d15m);
            }
            else if(language=="jpn"){
                mapObj.remove(mapTxtMain_jpn);
                mapObj.add(mapTxt_jpn.d16);
                mapObj.add(mapTxt_jpn.d15);
                mapObj.add(mapTxt_jpn.d14);
                mapObj.add(mapTxt_jpn.d13);
                mapObj.remove(mapTxt_jpn.d13m);
                mapObj.remove(mapTxt_jpn.d14m);
                mapObj.remove(mapTxt_jpn.d15m);
            }
            
            
        })

        console.log(type9.name.length);
        //console.log($(".ulBox>ul>li:eq(1)"));
        //判断菜单栏需展示的菜单项
        if(type8.name.length==0&&type88.name.length==0){
            $(".ulBox>ul>li").eq(4).hide();
        }
        if(type2.name.length==0&&type22.name.length==0){
            $(".ulBox>ul>li").eq(3).hide();
        }
        if(type3.name.length==0&&type33.name.length==0){
            $(".ulBox>ul>li").eq(1).hide();
        }
        if(type4.name.length==0&&type44.name.length==0){
            $(".ulBox>ul>li").eq(5).hide();
        }
        if(type5.name.length==0&&type55.name.length==0){
            $(".ulBox>ul>li").eq(0).hide();
        }
        //if(newView){
        //    $(".ulBox>ul>li").eq(0).show();
        //}
        if(type6.name.length==0&&type66.name.length==0){
            $(".ulBox>ul>li").eq(6).hide();
        }
        if(type7.name.length==0&&type77.name.length==0){
            $(".ulBox>ul>li").eq(2).hide();
        }
        if(type9.name.length==0&&type99.name.length==0){
            $(".ulBox>ul>li").eq(7).hide();
        }
        $(".sliderBox").width($(window).width() * (goLevel.eachLevel[3].numData.length + 2));
        $(".sliderBox").append(strtr);
        $(".sliderBox>div").css({
            //"margin-left":($("body").width()-$(".sliderGo").width())/2 ,
            "margin-right": ($("body").width() - $(".sliderGo").width() - parseInt($(".sliderGo").css("margin-left"))) / 2
        });

    },
    error: function (a, b, c) {
        alert(a + "++" + b + "++" + c);
    }
})
$(".closeTip").hide();
function hidLang() {
    var tA = $(".rightNav");
    var rA = $("#rlang");
    setTimeout(function () {
        tA.animate({right: "-5.8rem"}, 200);
        rA.animate({right: "-0.1rem"}, 200);
    }, 50);
}
//清除锁定视角
function clearLimitBounds() {
    mapObj.clearLimitBounds();
}
var markerList = [];
//手绘图按钮开关
$("#handMap").click(function () {
    if ($(this).hasClass("itemActive")) {
        $(this).removeClass("itemActive");
        //mapObj.clearMap();
        leLayer.setMap(null);
        //$(".btntext").animate({left: "0.84rem"}, 500);
        //$(".croll").animate({left: "0.26rem"}, 500);
    }
    else {
        $(this).addClass("itemActive");
        leLayer.setMap(mapObj);
        //$(".btntext").animate({left: "0.26rem"}, 500);
        //$(".croll").animate({left: "1rem"}, 500);
    }

})
function initialize() {
    //newzoom();
    $(".slide").show();
    $("div.amap-copyright").empty();
    //    清除手绘地图
    var lkeys = $("#lkey").val();

}

// <!--处理语言-->
var tempS;
var languagenum = 1;

var isLangShow=false;
function languageFun(){
    if(!isLangShow){
        $(".rightNav").animate({"right":"-0.7rem"},600);
        isLangShow=true
    }else{
        hidLang();
        isLangShow=false;
    }
};
$("#l_name img").click(function (event) {
    //event.stopPropagation();
    event.preventDefault();
    //$(".rightNav").animate({"right":"-5.8rem"},900);
})


var pLong, pLat;
var sum = 60;
var sty;
var oAudio2 = document.getElementById('myaudio2');
//var oAudio3 = document.getElementById('myaudio3');
var param = {
    "headurl": "http://121.40.133.252/",
    "newUrl": "http://daoyou.worldmaipu.com/",
    //"newUrl": "http://map.worldmaipu.com/",
    "mp3Time": "3000",
    "contentUrl": "http://daoyou.worldmaipu.com/web/share!detail.action?hotId=",
//    设置一下最长的mp3播放时间同时也是自动播放的时间
}
//去除typeList
function removeTypelist(){
    deleMarker();
    mapObj.remove(typelist9);
    mapObj.remove(typelist8);
    mapObj.remove(typelist7);
    mapObj.remove(typelist6);
    mapObj.remove(typelist5);
    mapObj.remove(typelist4);
    mapObj.remove(typelist3);
    mapObj.remove(typelist2);
    mapObj.remove(typelist99);
    mapObj.remove(typelist88);
    mapObj.remove(typelist77);
    mapObj.remove(typelist66);
    mapObj.remove(typelist55);
    mapObj.remove(typelist44);
    mapObj.remove(typelist33);
    mapObj.remove(typelist22);
    mapObj.remove(typelist999);
    mapObj.remove(typelist888);
    mapObj.remove(typelist777);
    mapObj.remove(typelist666);
    mapObj.remove(typelist555);
    mapObj.remove(typelist444);
    mapObj.remove(typelist333);
    mapObj.remove(typelist222);
    mapObj.remove(typelist9999);
    mapObj.remove(typelist8888);
    mapObj.remove(typelist7777);
    mapObj.remove(typelist6666);
    mapObj.remove(typelist5555);
    mapObj.remove(typelist4444);
    mapObj.remove(typelist3333);
    mapObj.remove(typelist2222);
    mapObj.remove(markerList);
    mapObj.remove(mapTxtMain);
    mapObj.remove(mapTxtMain_en);
    mapObj.remove(mapTxtMain_kor);
    mapObj.remove(mapTxtMain_jpn);
}

function changeMarkerByLang(){
    if(language=="enu"){
        
        switch ($(".ulBox>ul>li.active").attr("data")) {
            //导游
            //case "1":
            //    mapObj.add(marker_list[goLevel.level - 13].d);
            //    mapObj.remove(typelist8);
            //    mapObj.remove(typelist7);
            //    mapObj.remove(typelist6);
            //    mapObj.remove(typelist5);
            //    mapObj.remove(typelist4);
            //    mapObj.remove(typelist3);
            //    mapObj.remove(typelist2);
            //    mapObj.remove(markerList);
            //    break;
            case "8":
                //卫生间
                removeTypelist();
                mapObj.add(typelist22);
                getNewZoom(typelist22, typelist22_dengji);
                break;
            case "停车场":
                removeTypelist();
                mapObj.add(typelist33);
                getNewZoom(typelist33, typelist33_dengji);
                break;
            case "餐饮":
                removeTypelist();
                mapObj.add(typelist44);
                getNewZoom(typelist44, typelist44_dengji);
                break;
            case "景点":
                removeTypelist();
                mapObj.add(typelist55);
                getNewZoom(typelist55, typelist55_dengji);
                break;
            case "购物":
                removeTypelist();
                mapObj.add(typelist66);
                getNewZoom(typelist66, typelist66_dengji);
                break;
            case "游客服务":;
                removeTypelist();
                mapObj.add(typelist77);
                getNewZoom(typelist77, typelist77_dengji);
                break;
            case "码头":
                removeTypelist();
                mapObj.add(typelist88);
                getNewZoom(typelist88, typelist88_dengji);
                break;
            case "住宿":
                removeTypelist();
                mapObj.add(typelist99);
                getNewZoom(typelist99, typelist99_dengji);
                break;
            default :
                //deleMarker();
                //mapObj.remove(typelist8);
                //mapObj.remove(typelist7);
                //mapObj.remove(typelist6);
                //mapObj.remove(typelist5);
                //mapObj.remove(typelist4);
                //mapObj.remove(typelist3);
                //mapObj.remove(markerList);
                //mapObj.remove(typelist2);
                if($(".ulBox>ul>li.active")){
                    console.log("en");
                    //removeTypelist();
                    //mapObj.add(marker_list_en[goLevel_en.level - 13].d);
                    newzoom();
                    //mapObj.remove(typelist8);
                    //mapObj.remove(typelist7);
                    //mapObj.remove(typelist6);
                    //mapObj.remove(typelist5);
                    //mapObj.remove(typelist4);
                    //mapObj.remove(typelist3);
                    //mapObj.remove(typelist2);
                    //mapObj.remove(markerList);
                    //mapObj.add(marker_list[goLevel.level - 13].d);
                }
                break;
        }
        getNewZoom(mapTxtMain_en, mapTxt_en);
        mapObj.add(mapTxt_en.d16);
        mapObj.add(mapTxt_en.d15);
        mapObj.add(mapTxt_en.d14);
        mapObj.add(mapTxt_en.d13);
        mapObj.remove(mapTxt_en.d13m);
        mapObj.remove(mapTxt_en.d14m);
        mapObj.remove(mapTxt_en.d15m);
    }else if(language=="chs"){
        switch ($(".ulBox>ul>li.active").attr("data")) {
            //导游
            //case "1":
            //    mapObj.add(marker_list[goLevel.level - 13].d);
            //    mapObj.remove(typelist8);
            //    mapObj.remove(typelist7);
            //    mapObj.remove(typelist6);
            //    mapObj.remove(typelist5);
            //    mapObj.remove(typelist4);
            //    mapObj.remove(typelist3);
            //    mapObj.remove(typelist2);
            //    mapObj.remove(markerList);
            //    break;
            case "8":
                //卫生间
                removeTypelist();
                mapObj.add(typelist2);
                getNewZoom(typelist2, typelist2_dengji);
                break;
            case "停车场":
                removeTypelist();
                mapObj.add(typelist3);
                getNewZoom(typelist3, typelist3_dengji);
                break;
            case "餐饮":
                removeTypelist();
                mapObj.add(typelist4);
                getNewZoom(typelist4, typelist4_dengji);
                break;
            case "景点":
                removeTypelist();
                mapObj.add(typelist5);
                getNewZoom(typelist5, typelist5_dengji);
                break;
            case "购物":
                removeTypelist();
                mapObj.add(typelist6);
                getNewZoom(typelist6, typelist6_dengji);
                break;
            case "游客服务":;
                removeTypelist();
                mapObj.add(typelist7);
                getNewZoom(typelist7, typelist7_dengji);
                break;
            case "码头":
                removeTypelist();
                mapObj.add(typelist8);
                getNewZoom(typelist8, typelist8_dengji);
                break;
            case "住宿":
                removeTypelist();
                mapObj.add(typelist9);
                getNewZoom(typelist9, typelist9_dengji);
                break;
            default :
                //deleMarker();
                //mapObj.remove(typelist8);
                //mapObj.remove(typelist7);
                //mapObj.remove(typelist6);
                //mapObj.remove(typelist5);
                //mapObj.remove(typelist4);
                //mapObj.remove(typelist3);
                //mapObj.remove(markerList);
                //mapObj.remove(typelist2);
                if($(".ulBox>ul>li.active")){
                    console.log("chs");
                    //removeTypelist();
                    //mapObj.add(marker_list[goLevel.level - 13].d);
                    newzoom();
                    //mapObj.remove(typelist8);
                    //mapObj.remove(typelist7);
                    //mapObj.remove(typelist6);
                    //mapObj.remove(typelist5);
                    //mapObj.remove(typelist4);
                    //mapObj.remove(typelist3);
                    //mapObj.remove(typelist2);
                    //mapObj.remove(markerList);
                    //mapObj.add(marker_list[goLevel.level - 13].d);
                }
                break;
        }
        getNewZoom(mapTxtMain, mapTxt);
        mapObj.add(mapTxt.d16);
        mapObj.add(mapTxt.d15);
        mapObj.add(mapTxt.d14);
        mapObj.add(mapTxt.d13);
        mapObj.remove(mapTxt.d13m);
        mapObj.remove(mapTxt.d14m);
        mapObj.remove(mapTxt.d15m);
    }else if(language=='kor'){
        switch ($(".ulBox>ul>li.active").attr("data")) {
            case "8":
                //卫生间
                removeTypelist();
                mapObj.add(typelist222);
                getNewZoom(typelist222, typelist222_dengji);
                break;
            case "停车场":
                removeTypelist();
                mapObj.add(typelist333);
                getNewZoom(typelist333, typelist333_dengji);
                break;
            case "餐饮":
                removeTypelist();
                mapObj.add(typelist444);
                getNewZoom(typelist444, typelist444_dengji);
                break;
            case "景点":
                removeTypelist();
                mapObj.add(typelist555);
                getNewZoom(typelist555, typelist555_dengji);
                break;
            case "购物":
                removeTypelist();
                mapObj.add(typelist666);
                getNewZoom(typelist666, typelist666_dengji);
                break;
            case "游客服务":;
                removeTypelist();
                mapObj.add(typelist777);
                getNewZoom(typelist777, typelist777_dengji);
                break;
            case "码头":
                removeTypelist();
                mapObj.add(typelist888);
                getNewZoom(typelist888, typelist888_dengji);
                break;
            case "住宿":
                removeTypelist();
                mapObj.add(typelist999);
                getNewZoom(typelist999, typelist999_dengji);
                break;
            default :
                if($(".ulBox>ul>li.active")){
                    console.log("kor");
                    newzoom();
                }
                break;
        }
        getNewZoom(mapTxtMain_kor, mapTxt_kor);
        mapObj.add(mapTxt_kor.d16);
        mapObj.add(mapTxt_kor.d15);
        mapObj.add(mapTxt_kor.d14);
        mapObj.add(mapTxt_kor.d13);
        mapObj.remove(mapTxt_kor.d13m);
        mapObj.remove(mapTxt_kor.d14m);
        mapObj.remove(mapTxt_kor.d15m);
    }else if(language=='jpn'){
        switch ($(".ulBox>ul>li.active").attr("data")) {
            case "8":
                //卫生间
                removeTypelist();
                mapObj.add(typelist2222);
                getNewZoom(typelist2222, typelist2222_dengji);
                break;
            case "停车场":
                removeTypelist();
                mapObj.add(typelist3333);
                getNewZoom(typelist3333, typelist3333_dengji);
                break;
            case "餐饮":
                removeTypelist();
                mapObj.add(typelist4444);
                getNewZoom(typelist4444, typelist4444_dengji);
                break;
            case "景点":
                removeTypelist();
                mapObj.add(typelist5555);
                getNewZoom(typelist5555, typelist5555_dengji);
                break;
            case "购物":
                removeTypelist();
                mapObj.add(typelist6666);
                getNewZoom(typelist6666, typelist6666_dengji);
                break;
            case "游客服务":;
                removeTypelist();
                mapObj.add(typelist7777);
                getNewZoom(typelist7777, typelist7777_dengji);
                break;
            case "码头":
                removeTypelist();
                mapObj.add(typelist8888);
                getNewZoom(typelist8888, typelist8888_dengji);
                break;
            case "住宿":
                removeTypelist();
                mapObj.add(typelist9999);
                getNewZoom(typelist9999, typelist9999_dengji);
                break;
            default :
                if($(".ulBox>ul>li.active")){
                    console.log("jpn");
                    newzoom();
                }
                break;
        }
        getNewZoom(mapTxtMain_jpn, mapTxt_jpn);
        mapObj.add(mapTxt_jpn.d16);
        mapObj.add(mapTxt_jpn.d15);
        mapObj.add(mapTxt_jpn.d14);
        mapObj.add(mapTxt_jpn.d13);
        mapObj.remove(mapTxt_jpn.d13m);
        mapObj.remove(mapTxt_jpn.d14m);
        mapObj.remove(mapTxt_jpn.d15m);
    }
}
//语言切换 中英
$("#rlang a").click(function () {
    $(this).css("color", "#62CBDB");//给点击的a标签加红色
    $(this).siblings().css("color", "#ffffff");//被点击之外的a标签颜色为黑色
    var lid = $(this).attr("id");
    //判断有没有切换语言 若切换了 再操作
    if(lid!=language){
        //alert($(this).attr("id"));
        //如果还停留在有语音poi点的状态（不在线路规划侧边栏选中的时候）
        //if(!$(".ulBox>ul>li.active")){
        //    newzoom();
        //    console.log("newzoom了")
        //}
        //设置语言
        //刷语言标记
        //$("#lkey").val(lid);
        //如果在自动导览下 默认退出
        if(isSlideClick){
            $(".end").click();
        }
        if(!document.getElementById("myaudio").paused){
            document.getElementById("myaudio").pause()
        }
        //刷新页面 区分中英文状态
        switch (lid) {
            case "chs":
                mapObj.setLang("zh_cn");
                language="chs";
                //languageFun();
                //自动导览开关中英文切换
                $(".slidego").text("自动导览");
                $(".end").html("结束导览<span class='shadow'></span>");
                //$(".tag_list #handMap.itemActive").css("")
                //步行规划图标英文切换
                $(".ulBox ul li span").removeClass("en").removeClass("kor").removeClass("jpn");
                $("#fullviewA img").attr("src","./webmap/quanjing.png");
                $("#goback img").attr("src","./webmap/quanyu.png");
                $("#guide img").attr("src","./webmap/quzheli.png");
                $("#shopcity").attr("src","./webmap/shopcity.png");
                $("#activity img").attr("src","./webmap/activity.png");
                // if($("#route").hasClass("imgRight2")){
                //     $("#route").attr("src","./webmap/xianlu1.png");
                // }else{
                //     $("#route").attr("src","./webmap/xianlu.png");
                // }
                $("#route").removeClass("en").removeClass("kor").removeClass("jpn");
                $("#handMap").removeClass("en").removeClass("kor").removeClass("jpn");
                $("#audioGuide").removeClass("en").removeClass("kor").removeClass("jpn");
                $("#wharf").removeClass("en").removeClass("kor").removeClass("jpn");
                $(".dialog .warning").text("提示");
                $(".dialog .content").text("您不在当前景区或者GPS信号弱，请在该景区或GPS信号稳定地带使用。");
                $(".dialog .ok").text("确定");
                changeMarkerByLang();
                break;
            case "enu":
                mapObj.setLang("en");
                language="enu";
                //languageFun();
                //自动导览开关中英文切换
                $(".slidego").text("automatic");
                $(".end").html("End<span class='shadow'></span>");
                //步行规划图标英文切换
                $(".ulBox ul li span").removeClass("kor").removeClass("jpn").addClass("en");
                $("#fullviewA img").attr("src","./webmap/quanjing1.png");
                $("#goback img").attr("src","./webmap/quanyu1.png");
                $("#guide img").attr("src","./webmap/quzheli1.png");
                $("#shopcity").attr("src","./webmap/shopcity1.png");
                $("#activity img").attr("src","./webmap/activity1.png")
                // if($("#route").hasClass("imgRight2")){
                //     $("#route").attr("src","./webmap/xianlu3.png");
                // }else{
                //     $("#route").attr("src","./webmap/xianlu2.png");
                // }
                $("#route").removeClass("kor").removeClass("jpn").addClass("en");
                $("#handMap").removeClass("kor").removeClass("jpn").addClass("en");
                $("#audioGuide").removeClass("kor").removeClass("jpn").addClass("en");
                $("#wharf").removeClass("kor").removeClass("jpn").addClass("en");
                $(".dialog .warning").text("Prompt");
                $(".dialog .content").text("You are not in the current scenic spot or the GPS signal is weak. Please use it in the scenic spot or stable GPS signal zone.");
                $(".dialog .ok").text("ok");
                changeMarkerByLang();
                break;
            case "kor":
                mapObj.setLang("en");
                language="kor";
                //languageFun();
                //自动导览开关中英文切换
                $(".slidego").text("자동 유도");
                $(".end").html("끝<span class='shadow'></span>");
                //$(".tag_list #handMap.itemActive").css("")
                //步行规划图标英文切换
                $(".ulBox ul li span").removeClass("en").removeClass("jpn").addClass("kor");
                $("#fullviewA img").attr("src","./webmap/quanjing2.png");
                $("#goback img").attr("src","./webmap/quanyu2.png");
                $("#guide img").attr("src","./webmap/quzheli2.png");
                $("#shopcity").attr("src","./webmap/shopcity2.png");
                $("#activity img").attr("src","./webmap/activity2.png");
                // if($("#route").hasClass("imgRight2")){
                //     $("#route").attr("src","./webmap/xianlu5.png");
                // }else{
                //     $("#route").attr("src","./webmap/xianlu4.png");
                // }
                $("#route").removeClass("en").removeClass("jpn").addClass("kor");
                $("#handMap").removeClass("en").removeClass("jpn").addClass("kor");
                $("#audioGuide").removeClass("en").removeClass("jpn").addClass("kor");
                $("#wharf").removeClass("en").removeClass("jpn").addClass("kor");
                $(".dialog .warning").text("제시");
                $(".dialog .content").text("您不在当前景区或者GPS信号弱，请在该景区或GPS信号稳定地带使用。");
                $(".dialog .ok").text("확정");
                changeMarkerByLang();
                break;
            case "jpn":
                mapObj.setLang("en");
                language="jpn";
                //languageFun();
                //自动导览开关中英文切换
                $(".slidego").text("自動ツアー");
                $(".end").html("終了<span class='shadow'></span>");
                //$(".tag_list #handMap.itemActive").css("")
                //步行规划图标英文切换
                $(".ulBox ul li span").removeClass("en").removeClass("kor").addClass("jpn");
                $("#fullviewA img").attr("src","./webmap/quanjing3.png");
                $("#goback img").attr("src","./webmap/quanyu3.png");
                $("#guide img").attr("src","./webmap/quzheli3.png");
                $("#shopcity").attr("src","./webmap/shopcity3.png");
                $("#activity img").attr("src","./webmap/activity3.png");
                // if($("#route").hasClass("imgRight2")){
                //     $("#route").attr("src","./webmap/xianlu7.png");
                // }else{
                //     $("#route").attr("src","./webmap/xianlu6.png");
                // }
                $("#route").removeClass("en").removeClass("kor").addClass("jpn");
                $("#handMap").removeClass("en").removeClass("kor").addClass("jpn");
                $("#audioGuide").removeClass("en").removeClass("kor").addClass("jpn");
                $("#wharf").removeClass("en").removeClass("kor").addClass("jpn");
                $(".dialog .warning").text("ヒント");
                $(".dialog .content").text("あなたは現在の景勝地にいないか、GPS信号が弱いです。この景色の地点またはGPS信号安定地帯で使用してください。");
                $(".dialog .ok").text("確定");
                changeMarkerByLang();
                break;
            default:
                alert("该功能暂未开放，敬请期待！");
                languageFun();
                //暂时没有开通韩文，日文功能
                //var par=window.location.search;
                //var pars=par.split('&');
                //window.location.href="http://121.40.133.252/web/hand_map.action"+pars[0]+"&lkey="+lid;
                break;
        }
    }
});
//清除地图上的点标记
function clearMap() {
    mapObj.clearMap();
}
var swid = window.screen.width;
//将语言栏去掉
//$(".rightLang").css("display", "none");
//$(".rightNav").css("display", "none");
//将语言栏去掉
//    document.getElementById("donw").style.display="none";
//document.getElementById("d_tip").style.display = "block";
document.getElementById("divtip").style.top = "0.2rem";
document.getElementById("tip3").style.top = "0.25rem";
$(".closeTip").css("top", "0.5rem");
//$(".tag").css("top", "0");

//}
var num2 = 1;
$(document).on("click", ".imgRight0", function () {
    hidLang();
    $(".lineActivity").removeClass("lineActivity");
    $(".clickCollege").click();
    //消失菜单
    // if(language=="chs"){
    //     $(this).get(0).src = "./webmap/xianlu1.png";
    // }else{
    //     $(this).get(0).src = "./webmap/xianlu3.png";
    // }

    $(".imgRight0")
        .addClass("imgRight2")
        .removeClass("imgRight0");
    $("#tip3").css("display", "block");
    $(".line").css("display", "block");
    //$("#divtip").css("display","none");
    $(".closeTip").css("display", "block");
    //出现菜单
    var s = 600;
})

$(document).on("click", ".imgRight2", function () {
    if(isLineClick==false){
        $(this).get(0).src = "./webmap/xianlu.png";
        $(".imgRight2")
            .addClass("imgRight0")
            .removeClass("imgRight2");
        $("#tip3").css("display", "none");
        return
    }else{
        mapObj.remove(lineRoadGo);
        mapObj.remove(roadgo.u0);
        mapObj.remove(roadgo.u1);
        mapObj.remove(roadgo.u2);
        mapObj.remove(roadgo.u3);
        mapObj.remove(roadgo.u4);
        $("#wx_location").show();
        $(this).get(0).src = "./webmap/xianlu.png";
        $(".imgRight2")
            .addClass("imgRight0")
            .removeClass("imgRight2");
        $("#tip3").css("display", "none");
        //$("#divtip").css("display","none");
        $(".closeTip").css("display", "none");
        $(".lineActivity").removeClass("lineActivity");
        $(".line_Box").empty();
        $(".lineBig").removeClass("lineBig");
        $(".lineBox").css("display", "none");
        $(".head").get(0).click();
        if($(".ulBox li.active").attr("data")==1){
            $(".slide").show();
        }
        $("#line_slider").hide();
        
        if(language=="chs"){
            switch ($(".ulBox>ul>li.active").attr("data")) {
                //导游
                //case "1":
                //    mapObj.add(marker_list[goLevel.level - 13].d);
                //    mapObj.remove(typelist8);
                //    mapObj.remove(typelist7);
                //    mapObj.remove(typelist6);
                //    mapObj.remove(typelist5);
                //    mapObj.remove(typelist4);
                //    mapObj.remove(typelist3);
                //    mapObj.remove(typelist2);
                //    mapObj.remove(markerList);
                //    break;
                case "8":
                    //卫生间
                    removeTypelist();
                    mapObj.add(typelist2);
                    getNewZoom(typelist2, typelist2_dengji);
                    break;
                case "停车场":
                    removeTypelist();
                    mapObj.add(typelist3);
                    getNewZoom(typelist3, typelist3_dengji);
                    break;
                case "餐饮":
                    removeTypelist();
                    mapObj.add(typelist4);
                    getNewZoom(typelist4, typelist4_dengji);
                    break;
                case "景点":
                    removeTypelist();
                    mapObj.add(typelist5);
                    getNewZoom(typelist5, typelist5_dengji);
                    break;
                case "购物":
                    removeTypelist();
                    mapObj.add(typelist6);
                    getNewZoom(typelist6, typelist6_dengji);
                    break;
                case "游客服务":;
                    removeTypelist();
                    mapObj.add(typelist7);
                    getNewZoom(typelist7, typelist7_dengji);
                    break;
                case "码头":
                    removeTypelist();
                    mapObj.add(typelist8);
                    getNewZoom(typelist8, typelist8_dengji);
                    break;
                case "住宿":
                    removeTypelist();
                    mapObj.add(typelist9);
                    getNewZoom(typelist9, typelist9_dengji);
                    break;
                default :
                    if($(".ulBox>ul>li.active")){
                        console.log(11);
                        removeTypelist();
                        newzoomBylang(goLevel);
                        mapObj.add(marker_list[goLevel.level - 13].d);
                    }
                    break;
            }
        }else if(language=="enu"){
            switch ($(".ulBox>ul>li.active").attr("data")) {
                case "8":
                    //卫生间
                    removeTypelist();
                    mapObj.add(typelist22);
                    getNewZoom(typelist22, typelist22_dengji);
                    break;
                case "停车场":
                    removeTypelist();
                    mapObj.add(typelist33);
                    getNewZoom(typelist33, typelist33_dengji);
                    break;
                case "餐饮":
                    removeTypelist();
                    mapObj.add(typelist44);
                    getNewZoom(typelist44, typelist44_dengji);
                    break;
                case "景点":
                    removeTypelist();
                    mapObj.add(typelist55);
                    getNewZoom(typelist55, typelist55_dengji);
                    break;
                case "购物":
                    removeTypelist();
                    mapObj.add(typelist66);
                    getNewZoom(typelist66, typelist66_dengji);
                    break;
                case "游客服务":;
                    removeTypelist();
                    mapObj.add(typelist77);
                    getNewZoom(typelist77, typelist77_dengji);
                    break;
                case "码头":
                    removeTypelist();
                    mapObj.add(typelist88);
                    getNewZoom(typelist88, typelist88_dengji);
                    break;
                case "住宿":
                    removeTypelist();
                    mapObj.add(typelist99);
                    getNewZoom(typelist99, typelist99_dengji);
                    break;
                default :
                    if($(".ulBox>ul>li.active")){
                        console.log(11);
                        removeTypelist();
                        newzoomBylang(goLevel_en);
                        mapObj.add(marker_list_en[goLevel_en.level - 13].d);
                    }
                    break;
            }
        }else if(language=="kor"){
            switch ($(".ulBox>ul>li.active").attr("data")) {
                case "8":
                    //卫生间
                    removeTypelist();
                    mapObj.add(typelist222);
                    getNewZoom(typelist222, typelist222_dengji);
                    break;
                case "停车场":
                    removeTypelist();
                    mapObj.add(typelist333);
                    getNewZoom(typelist333, typelist333_dengji);
                    break;
                case "餐饮":
                    removeTypelist();
                    mapObj.add(typelist444);
                    getNewZoom(typelist444, typelist444_dengji);
                    break;
                case "景点":
                    removeTypelist();
                    mapObj.add(typelist555);
                    getNewZoom(typelist555, typelist555_dengji);
                    break;
                case "购物":
                    removeTypelist();
                    mapObj.add(typelist666);
                    getNewZoom(typelist666, typelist666_dengji);
                    break;
                case "游客服务":;
                    removeTypelist();
                    mapObj.add(typelist777);
                    getNewZoom(typelist777, typelist777_dengji);
                    break;
                case "码头":
                    removeTypelist();
                    mapObj.add(typelist888);
                    getNewZoom(typelist888, typelist888_dengji);
                    break;
                case "住宿":
                    removeTypelist();
                    mapObj.add(typelist999);
                    getNewZoom(typelist999, typelist999_dengji);
                    break;
                default :
                    if($(".ulBox>ul>li.active")){
                        console.log(11);
                        removeTypelist();
                        newzoomBylang(goLevel_kor);
                        mapObj.add(marker_list_kor[goLevel_kor.level - 13].d);
                    }
                    break;
            }
        }else if(language=="jpn"){
            switch ($(".ulBox>ul>li.active").attr("data")) {
                case "8":
                    //卫生间
                    removeTypelist();
                    mapObj.add(typelist222);
                    getNewZoom(typelist2222, typelist2222_dengji);
                    break;
                case "停车场":
                    removeTypelist();
                    mapObj.add(typelist3333);
                    getNewZoom(typelist3333, typelist3333_dengji);
                    break;
                case "餐饮":
                    removeTypelist();
                    mapObj.add(typelist4444);
                    getNewZoom(typelist4444, typelist4444_dengji);
                    break;
                case "景点":
                    removeTypelist();
                    mapObj.add(typelist5555);
                    getNewZoom(typelist5555, typelist5555_dengji);
                    break;
                case "购物":
                    removeTypelist();
                    mapObj.add(typelist6666);
                    getNewZoom(typelist6666, typelist6666_dengji);
                    break;
                case "游客服务":;
                    removeTypelist();
                    mapObj.add(typelist7777);
                    getNewZoom(typelist7777, typelist7777_dengji);
                    break;
                case "码头":
                    removeTypelist();
                    mapObj.add(typelist8888);
                    getNewZoom(typelist8888, typelist8888_dengji);
                    break;
                case "住宿":
                    removeTypelist();
                    mapObj.add(typelist9999);
                    getNewZoom(typelist9999, typelist9999_dengji);
                    break;
                default :
                    if($(".ulBox>ul>li.active")){
                        console.log(11);
                        removeTypelist();
                        newzoomBylang(goLevel_jpn);
                        mapObj.add(marker_list_jpn[goLevel_jpn.level - 13].d);
                    }
                    break;
            }
        }
    }
    


})

var polyline;
var mStar, mEnd;
var st;
//点击第二次消失折线
//添加折线    预览


//清除折线  取消预览
function clearPoly() {
    if (mStar != null && mEnd != null) {
        mapObj.remove(mStar);
        mapObj.remove(mEnd);
    }
    return polyline && polyline.setMap(null);
}
var alog = "";
var alat = "";
//获取当前位置信息
function getCurrentPosition(log, lat, name) {
    alert(log + "--------" + lat + "-----" + name)
    alog = log;
    alat = lat;
    aname = name;
    geolocation.getCurrentPosition();
}
function showPosition(pos) {
    //alert(pos);
    slng = pos.coords.longitude;
    slat = pos.coords.latitude;
    pLong = pos.coords.longitude;
    pLat = pos.coords.latitude;
    return pLong, pLat;
}

var preNum;
var preI;

//去除蒙版
$("#closeBanner").click(function () {
    $(".masking").css("display", "none");
})
var ttt;
var audio = [];
var lat = [];
var lng = [];
var response;
//解析url


$(function () {
    $(document).on("click",".kitchenInClose",function(){
        $(".kitchenBox").css("display","none");
        $("#container").removeClass("vague");
    })
    $("#audioGuide").click(function () {
        $("#wx_location").show();
        if($(this).hasClass("itemActive")){
            $(this).removeClass("itemActive");
            if(isSlideClick){
                $(".end").click();
                $(".slide").hide()
            }else{
                $(".slide").hide()
            }
        }else{
            $(this).addClass("itemActive");
            $(".gobig").removeClass("gobig");
            $(".slide").show();
            $(".b_tool").hide();
            $(".sliderBox").hide();
            //poi点加载与移除
            removeTypelist()
            //判断是中文还是英文 显示对应的语音点
            if(language=="chs"){
                mapObj.add(marker_list[goLevel.level - 13].d);
            }else if(language=="enu"){
                mapObj.add(marker_list_en[goLevel_en.level - 13].d);
            }else if(language=="kor"){
                mapObj.add(marker_list_kor[goLevel_kor.level - 13].d);
            }else if(language=="jpn"){
                mapObj.add(marker_list_jpn[goLevel_jpn.level - 13].d);
            }
        }
    })
    function toWalking(){
        console.log(111);
        $(".tag_list").hide();
        $(".ulBox").show();
        $(".ulBox li.active").removeClass("active");
    }
    //$("#island").click(toWalking);
    $("#wharf").click(toWalking);
    $(".toMenu").click(function () {
        $(".biger").removeClass("biger");
        $(".ulBox").hide();
        $(".tag_list").show();
        $(".imgRight2").click();
        //$("#audioGuide").removeClass("itemActive");
        if(isWalking){
            //if(confirm("确定退出当前步行导航吗?")){
            stopInterval();
            setTimeout(function () {
                $("#wx_location").click();
            },500)
                //getLocation();
            //}
        }
        //poi点加载与移除 加载到语音导览
        if(language=="chs"){
            removeTypelist();
            mapObj.add(marker_list[goLevel.level - 13].d);
        }else if(language=="enu"){
            removeTypelist();
            mapObj.add(marker_list_en[goLevel_en.level - 13].d);
        }else if(language=="kor"){
            removeTypelist();
            mapObj.add(marker_list_kor[goLevel_kor.level - 13].d);
        }else if(language=="jpn"){
            removeTypelist();
            mapObj.add(marker_list_jpn[goLevel_jpn.level - 13].d);
        }

        if(!isSlideClick){
            $(".slide").show();
        }
        $("#audioGuide").addClass("itemActive");
        $(".ulBox li.active").removeClass("active");
    })

    //切换图标
    $(".ulBox>ul>li").on(mouse_touch.start, function () {
        $("#wx_location").show();
        $(".biger").removeClass("biger");
        if(isWalking){
            //if(confirm("确定退出当前步行导航吗?")){
                stopInterval();
                if ($(this).hasClass("active")) {}else {
                    $(".active").removeClass("active");
                    $(this).addClass("active");
                }
                $(".mapBox").hide();
                $(".imgRight2").click();
                var getData = $(this).attr("data");
                mapObj.remove(markerList);
                $(".lineBox").hide();
                $(".b_tool").hide();
                $(".line_Box").css({
                    'transform': "translateX(0px)",
                    '-webkit-transform': "translateX(0px)",
                    '-o-transform': "translateX(0px)",
                    '-moz-transform': "translateX(0px)",
                    'transition-duration': '0.6s',
                })
                if(language=="chs"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist8);
                            getNewZoom(typelist8, typelist8_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist2);
                            getNewZoom(typelist2, typelist2_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist3);
                            getNewZoom(typelist3, typelist3_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist4);
                            getNewZoom(typelist4, typelist4_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist5);
                            getNewZoom(typelist5, typelist5_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist6);
                            getNewZoom(typelist6, typelist6_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist7);
                            getNewZoom(typelist7, typelist7_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist9);
                            getNewZoom(typelist9, typelist9_dengji);
                            break;
                        case "厨房":
                            removeTypelist();
                            mapObj.add(typelist10);
                            getNewZoom(typelist10, typelist10_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain, mapTxt);
                    mapObj.add(mapTxt.d16);
                    mapObj.add(mapTxt.d15);
                    mapObj.add(mapTxt.d14);
                    mapObj.add(mapTxt.d13);
                    mapObj.remove(mapTxt.d13m);
                    mapObj.remove(mapTxt.d14m);
                    mapObj.remove(mapTxt.d15m);
                }else if(language=="enu"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist88);
                            getNewZoom(typelist88, typelist88_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist22);
                            getNewZoom(typelist22, typelist22_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist33);
                            getNewZoom(typelist33, typelist33_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist44);
                            getNewZoom(typelist44, typelist44_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist55);
                            getNewZoom(typelist55, typelist55_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist66);
                            getNewZoom(typelist66, typelist66_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist77);
                            getNewZoom(typelist77, typelist77_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist99);
                            getNewZoom(typelist99, typelist99_dengji);
                            break;
                        case "厨房":
                            removeTypelist();
                            mapObj.add(typelist1010);
                            getNewZoom(typelist1010, typelist1010_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_en, mapTxt_en);
                    mapObj.add(mapTxt_en.d16);
                    mapObj.add(mapTxt_en.d15);
                    mapObj.add(mapTxt_en.d14);
                    mapObj.add(mapTxt_en.d13);
                    mapObj.remove(mapTxt_en.d13m);
                    mapObj.remove(mapTxt_en.d14m);
                    mapObj.remove(mapTxt_en.d15m);
                }else if(language=="kor"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist888);
                            getNewZoom(typelist888, typelist888_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist222);
                            getNewZoom(typelist222, typelist222_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist333);
                            getNewZoom(typelist333, typelist333_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist444);
                            getNewZoom(typelist444, typelist444_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist555);
                            getNewZoom(typelist555, typelist555_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist666);
                            getNewZoom(typelist666, typelist666_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist777);
                            getNewZoom(typelist777, typelist777_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist999);
                            getNewZoom(typelist999, typelist999_dengji);
                            break;
                        case "厨房":
                            removeTypelist();
                            mapObj.add(typelist101010);
                            getNewZoom(typelist101010, typelist101010_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_kor, mapTxt_kor);
                    mapObj.add(mapTxt_kor.d16);
                    mapObj.add(mapTxt_kor.d15);
                    mapObj.add(mapTxt_kor.d14);
                    mapObj.add(mapTxt_kor.d13);
                    mapObj.remove(mapTxt_kor.d13m);
                    mapObj.remove(mapTxt_kor.d14m);
                    mapObj.remove(mapTxt_kor.d15m);
                }else if(language=="jpn"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist8888);
                            getNewZoom(typelist8888, typelist8888_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist2222);
                            getNewZoom(typelist2222, typelist2222_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist3333);
                            getNewZoom(typelist3333, typelist3333_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist4444);
                            getNewZoom(typelist4444, typelist4444_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist5555);
                            getNewZoom(typelist5555, typelist5555_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist6666);
                            getNewZoom(typelist6666, typelist6666_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist7777);
                            getNewZoom(typelist7777, typelist7777_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist9999);
                            getNewZoom(typelist9999, typelist9999_dengji);
                            break;
                        case "厨房":
                            removeTypelist();
                            mapObj.add(typelist10101010);
                            getNewZoom(typelist10101010, typelist10101010_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_jpn, mapTxt_jpn);
                    mapObj.add(mapTxt_jpn.d16);
                    mapObj.add(mapTxt_jpn.d15);
                    mapObj.add(mapTxt_jpn.d14);
                    mapObj.add(mapTxt_jpn.d13);
                    mapObj.remove(mapTxt_jpn.d13m);
                    mapObj.remove(mapTxt_jpn.d14m);
                    mapObj.remove(mapTxt_jpn.d15m);
                }
        
        }else if(isSlideClick){
            if(confirm(language=="chs"?"确定退出自动导览吗?":"Are you sure you want to exit automatic navigation?")){
                $(".end").click();
                if ($(this).hasClass("active")) {}
                else {
                    $(".active").removeClass("active");
                    $(this).addClass("active");
                }
                $(".mapBox").hide();
                $(".imgRight2").click();
                var getData = $(this).attr("data");
                mapObj.remove(markerList);
                $(".lineBox").hide();
                $(".b_tool").hide();

                $(".slide").hide();
                //alert("gg");
                $(".line_Box").css({
                    'transform': "translateX(0px)",
                    '-webkit-transform': "translateX(0px)",
                    '-o-transform': "translateX(0px)",
                    '-moz-transform': "translateX(0px)",
                    'transition-duration': '0.6s',
                })

                if(language=="chs"){
                    switch ($(this).attr("data")) {
                        //case "1":
                        //    //mapObj.setZoom("16");
                        //    mapObj.remove(typelist7);
                        //    mapObj.remove(typelist6);
                        //    mapObj.remove(typelist5);
                        //    mapObj.remove(typelist4);
                        //    mapObj.remove(typelist3);
                        //    mapObj.remove(typelist2);
                        //    mapObj.remove(markerList);
                        //    deleMarker();
                        //    mapObj.add(marker_list[goLevel.level - 13].d);
                        //    break;
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist8);
                            getNewZoom(typelist8, typelist8_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist2);
                            getNewZoom(typelist2, typelist2_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist3);
                            getNewZoom(typelist3, typelist3_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist4);
                            getNewZoom(typelist4, typelist4_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist5);
                            getNewZoom(typelist5, typelist5_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist6);
                            getNewZoom(typelist6, typelist6_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist7);
                            getNewZoom(typelist7, typelist7_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist9);
                            getNewZoom(typelist9, typelist9_dengji);
                            break;
                        case "厨房":
                            removeTypelist();
                            mapObj.add(typelist10);
                            getNewZoom(typelist10, typelist10_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain, mapTxt);
                    mapObj.add(mapTxt.d16);
                    mapObj.add(mapTxt.d15);
                    mapObj.add(mapTxt.d14);
                    mapObj.add(mapTxt.d13);
                    mapObj.remove(mapTxt.d13m);
                    mapObj.remove(mapTxt.d14m);
                    mapObj.remove(mapTxt.d15m);
                }else if(language=='enu'){
                    switch ($(this).attr("data")) {
                        //case "1":
                        //    //mapObj.setZoom("16");
                        //    mapObj.remove(typelist7);
                        //    mapObj.remove(typelist6);
                        //    mapObj.remove(typelist5);
                        //    mapObj.remove(typelist4);
                        //    mapObj.remove(typelist3);
                        //    mapObj.remove(typelist2);
                        //    mapObj.remove(markerList);
                        //    deleMarker();
                        //    mapObj.add(marker_list[goLevel.level - 13].d);
                        //    break;
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist88);
                            getNewZoom(typelist88, typelist88_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist22);
                            getNewZoom(typelist22, typelist22_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist33);
                            getNewZoom(typelist33, typelist33_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist44);
                            getNewZoom(typelist44, typelist44_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist55);
                            getNewZoom(typelist55, typelist55_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist66);
                            getNewZoom(typelist66, typelist66_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist77);
                            getNewZoom(typelist77, typelist77_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist99);
                            getNewZoom(typelist99, typelist99_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_en, mapTxt_en);
                    mapObj.add(mapTxt_en.d16);
                    mapObj.add(mapTxt_en.d15);
                    mapObj.add(mapTxt_en.d14);
                    mapObj.add(mapTxt_en.d13);
                    mapObj.remove(mapTxt_en.d13m);
                    mapObj.remove(mapTxt_en.d14m);
                    mapObj.remove(mapTxt_en.d15m);
                }else if(language=="kor"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist888);
                            getNewZoom(typelist888, typelist888_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist222);
                            getNewZoom(typelist222, typelist222_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist333);
                            getNewZoom(typelist333, typelist333_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist444);
                            getNewZoom(typelist444, typelist444_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist555);
                            getNewZoom(typelist555, typelist555_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist666);
                            getNewZoom(typelist666, typelist666_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist777);
                            getNewZoom(typelist777, typelist777_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist999);
                            getNewZoom(typelist999, typelist999_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_kor, mapTxt_kor);
                    mapObj.add(mapTxt_kor.d16);
                    mapObj.add(mapTxt_kor.d15);
                    mapObj.add(mapTxt_kor.d14);
                    mapObj.add(mapTxt_kor.d13);
                    mapObj.remove(mapTxt_kor.d13m);
                    mapObj.remove(mapTxt_kor.d14m);
                    mapObj.remove(mapTxt_kor.d15m);
                }else if(language=="jpn"){
                    switch ($(this).attr("data")) {
                        case "码头":
                            //mapObj.setZoom("16");
                            removeTypelist();
                            mapObj.add(typelist8888);
                            getNewZoom(typelist8888, typelist8888_dengji);
                            break;
                        case "8":
                            //卫生间
                            removeTypelist();
                            mapObj.add(typelist2222);
                            getNewZoom(typelist2222, typelist2222_dengji);
                            break;
                        case "停车场":
                            removeTypelist();
                            mapObj.add(typelist3333);
                            getNewZoom(typelist3333, typelist3333_dengji);
                            break;
                        case "餐饮":
                            removeTypelist();
                            mapObj.add(typelist4444);
                            getNewZoom(typelist4444, typelist4444_dengji);
                            break;
                        case "景点":
                            removeTypelist();
                            mapObj.add(typelist5555);
                            getNewZoom(typelist5555, typelist5555_dengji);
                            break;
                        case "购物":
                            removeTypelist();
                            mapObj.add(typelist6666);
                            getNewZoom(typelist6666, typelist6666_dengji);
                            break;
                        case "游客服务":
                            removeTypelist();
                            mapObj.add(typelist7777);
                            getNewZoom(typelist7777, typelist7777_dengji);
                            break;
                        case "住宿":
                            removeTypelist();
                            mapObj.add(typelist9999);
                            getNewZoom(typelist9999, typelist9999_dengji);
                            break;
                        default :
                            removeTypelist();
                            break;
                    }
                    getNewZoom(mapTxtMain_jpn, mapTxt_jpn);
                    mapObj.add(mapTxt_jpn.d16);
                    mapObj.add(mapTxt_jpn.d15);
                    mapObj.add(mapTxt_jpn.d14);
                    mapObj.add(mapTxt_jpn.d13);
                    mapObj.remove(mapTxt_jpn.d13m);
                    mapObj.remove(mapTxt_jpn.d14m);
                    mapObj.remove(mapTxt_jpn.d15m);
                }
            }else{
                return
            }
        }else{
            //mapObj.setCenter([response.data.scenic.longitude, response.data.scenic.latitude]);
            if ($(this).hasClass("active")) {}
            else {
                $(".active").removeClass("active");
                $(this).addClass("active");
            }
            $(".mapBox").hide();
            $(".imgRight2").click();
            var getData = $(this).attr("data");
            mapObj.remove(markerList);
            $(".lineBox").hide();
            $(".b_tool").hide();
            if($(this).attr("data")!=1){
                $(".slide").hide();
            }else{
                $(".slide").show();
            }
            $(".line_Box").css({
                'transform': "translateX(0px)",
                '-webkit-transform': "translateX(0px)",
                '-o-transform': "translateX(0px)",
                '-moz-transform': "translateX(0px)",
                'transition-duration': '0.6s',
            })
            if(language=="chs"){
                switch ($(this).attr("data")) {
                    //case "1":
                    //    //mapObj.setZoom("16");
                    //    mapObj.remove(typelist7);
                    //    mapObj.remove(typelist6);
                    //    mapObj.remove(typelist5);
                    //    mapObj.remove(typelist4);
                    //    mapObj.remove(typelist3);
                    //    mapObj.remove(typelist2);
                    //    mapObj.remove(markerList);
                    //    deleMarker();
                    //    mapObj.add(marker_list[goLevel.level - 13].d);
                    //    break;
                    case "码头":
                        removeTypelist();
                        mapObj.add(typelist8);
                        getNewZoom(typelist8, typelist8_dengji);
                        break;
                    case "8":
                        //卫生间
                        removeTypelist();
                        mapObj.add(typelist2);
                        getNewZoom(typelist2, typelist2_dengji);
                        break;
                    case "停车场":
                        removeTypelist();
                        mapObj.add(typelist3);
                        getNewZoom(typelist3, typelist3_dengji);
                        break;
                    case "餐饮":
                        removeTypelist();
                        mapObj.add(typelist4);
                        getNewZoom(typelist4, typelist4_dengji);
                        break;
                    case "景点":
                        removeTypelist();
                        mapObj.add(typelist5);
                        getNewZoom(typelist5, typelist5_dengji);
                        break;
                    case "购物":
                        removeTypelist();
                        mapObj.add(typelist6);
                        getNewZoom(typelist6, typelist6_dengji);
                        break;
                    case "游客服务":
                        removeTypelist();
                        mapObj.add(typelist7);
                        getNewZoom(typelist7, typelist7_dengji);
                        break;
                    case "住宿":
                        removeTypelist();
                        mapObj.add(typelist9);
                        getNewZoom(typelist9, typelist9_dengji);
                        break;
                    case "厨房":
                        removeTypelist();
                        mapObj.add(typelist10);
                        getNewZoom(typelist10, typelist10_dengji);
                        break;
                    default :
                        removeTypelist();

                        break;
                }
                getNewZoom(mapTxtMain, mapTxt);
                    mapObj.add(mapTxt.d16);
                    mapObj.add(mapTxt.d15);
                    mapObj.add(mapTxt.d14);
                    mapObj.add(mapTxt.d13);
                    mapObj.remove(mapTxt.d13m);
                    mapObj.remove(mapTxt.d14m);
                    mapObj.remove(mapTxt.d15m);
            }else if(language=='enu'){
                switch ($(this).attr("data")) {
                    //case "1":
                    //    //mapObj.setZoom("16");
                    //    mapObj.remove(typelist7);
                    //    mapObj.remove(typelist6);
                    //    mapObj.remove(typelist5);
                    //    mapObj.remove(typelist4);
                    //    mapObj.remove(typelist3);
                    //    mapObj.remove(typelist2);
                    //    mapObj.remove(markerList);
                    //    deleMarker();
                    //    mapObj.add(marker_list[goLevel.level - 13].d);
                    //    break;
                    case "码头":
                        removeTypelist();
                        mapObj.add(typelist88);
                        getNewZoom(typelist88, typelist88_dengji);
                        break;
                    case "8":
                        //卫生间
                        removeTypelist();
                        mapObj.add(typelist22);
                        getNewZoom(typelist22, typelist22_dengji);
                        break;
                    case "停车场":
                        removeTypelist();
                        mapObj.add(typelist33);
                        getNewZoom(typelist33, typelist33_dengji);
                        break;
                    case "餐饮":
                        removeTypelist();
                        mapObj.add(typelist44);
                        getNewZoom(typelist44, typelist44_dengji);
                        break;
                    case "景点":
                        removeTypelist();
                        mapObj.add(typelist55);
                        getNewZoom(typelist55, typelist55_dengji);
                        break;
                    case "购物":
                        removeTypelist();
                        mapObj.add(typelist66);
                        getNewZoom(typelist66, typelist66_dengji);
                        break;
                    case "游客服务":
                        removeTypelist();
                        mapObj.add(typelist77);
                        getNewZoom(typelist77, typelist77_dengji);
                        break;
                    case "住宿":
                        removeTypelist();
                        mapObj.add(typelist99);
                        getNewZoom(typelist99, typelist99_dengji);
                        break;
                    case "厨房":
                        removeTypelist();
                        mapObj.add(typelist1010);
                        getNewZoom(typelist1010, typelist10_dengji);
                        break;
                    default :
                        removeTypelist();
                        break;
                }
                getNewZoom(mapTxtMain_en, mapTxt_en);
                    mapObj.add(mapTxt_en.d16);
                    mapObj.add(mapTxt_en.d15);
                    mapObj.add(mapTxt_en.d14);
                    mapObj.add(mapTxt_en.d13);
                    mapObj.remove(mapTxt_en.d13m);
                    mapObj.remove(mapTxt_en.d14m);
                    mapObj.remove(mapTxt_en.d15m);
            }else if(language=="kor"){
                switch ($(this).attr("data")) {
                    case "码头":
                        //mapObj.setZoom("16");
                        removeTypelist();
                        mapObj.add(typelist888);
                        getNewZoom(typelist888, typelist888_dengji);
                        break;
                    case "8":
                        //卫生间
                        removeTypelist();
                        mapObj.add(typelist222);
                        getNewZoom(typelist222, typelist222_dengji);
                        break;
                    case "停车场":
                        removeTypelist();
                        mapObj.add(typelist333);
                        getNewZoom(typelist333, typelist333_dengji);
                        break;
                    case "餐饮":
                        removeTypelist();
                        mapObj.add(typelist444);
                        getNewZoom(typelist444, typelist444_dengji);
                        break;
                    case "景点":
                        removeTypelist();
                        mapObj.add(typelist555);
                        getNewZoom(typelist555, typelist555_dengji);
                        break;
                    case "购物":
                        removeTypelist();
                        mapObj.add(typelist666);
                        getNewZoom(typelist666, typelist666_dengji);
                        break;
                    case "游客服务":
                        removeTypelist();
                        mapObj.add(typelist777);
                        getNewZoom(typelist777, typelist777_dengji);
                        break;
                    case "住宿":
                        removeTypelist();
                        mapObj.add(typelist999);
                        getNewZoom(typelist999, typelist999_dengji);
                        break;
                    default :
                        removeTypelist();
                        break;
                }
                getNewZoom(mapTxtMain_kor, mapTxt_kor);
                mapObj.add(mapTxt_kor.d16);
                mapObj.add(mapTxt_kor.d15);
                mapObj.add(mapTxt_kor.d14);
                mapObj.add(mapTxt_kor.d13);
                mapObj.remove(mapTxt_kor.d13m);
                mapObj.remove(mapTxt_kor.d14m);
                mapObj.remove(mapTxt_kor.d15m);
            }else if(language=="jpn"){
                switch ($(this).attr("data")) {
                    case "码头":
                        //mapObj.setZoom("16");
                        removeTypelist();
                        mapObj.add(typelist8888);
                        getNewZoom(typelist8888, typelist8888_dengji);
                        break;
                    case "8":
                        //卫生间
                        removeTypelist();
                        mapObj.add(typelist2222);
                        getNewZoom(typelist2222, typelist2222_dengji);
                        break;
                    case "停车场":
                        removeTypelist();
                        mapObj.add(typelist3333);
                        getNewZoom(typelist3333, typelist3333_dengji);
                        break;
                    case "餐饮":
                        removeTypelist();
                        mapObj.add(typelist4444);
                        getNewZoom(typelist4444, typelist4444_dengji);
                        break;
                    case "景点":
                        removeTypelist();
                        mapObj.add(typelist5555);
                        getNewZoom(typelist5555, typelist5555_dengji);
                        break;
                    case "购物":
                        removeTypelist();
                        mapObj.add(typelist6666);
                        getNewZoom(typelist6666, typelist6666_dengji);
                        break;
                    case "游客服务":
                        removeTypelist();
                        mapObj.add(typelist7777);
                        getNewZoom(typelist7777, typelist7777_dengji);
                        break;
                    case "住宿":
                        removeTypelist();
                        mapObj.add(typelist9999);
                        getNewZoom(typelist9999, typelist9999_dengji);
                        break;
                    default :
                        removeTypelist();
                        break;
                }
                getNewZoom(mapTxtMain_jpn, mapTxt_jpn);
                mapObj.add(mapTxt_jpn.d16);
                mapObj.add(mapTxt_jpn.d15);
                mapObj.add(mapTxt_jpn.d14);
                mapObj.add(mapTxt_jpn.d13);
                mapObj.remove(mapTxt_jpn.d13m);
                mapObj.remove(mapTxt_jpn.d14m);
                mapObj.remove(mapTxt_jpn.d15m);
            }
            //调整图标自适应显示
            //mapObj.setFitView();
        }

    })

    //setTimeout(setMarker,100);
    $(".banner ").css({
        "margin-top": ($("body").height() - $(".banner").height()) / 3,
        "margin-left": ($("body").width() - $(".banner").width()) / 2
    });
    $(".click2").css("top", ($("body").height() - $(".banner").height()) / 3 + $(".w").width())
    $("body").height($(window).height());
    $("body").width($(window).width());
    $(".tag ul").width($(".service").width() * 8);
    $(".ulBox").css("width", $("body").width() - $(".mapBtn").width() - parseFloat($(".mapBtn").css("margin-left")))
    $(".hang").width($(".mapBtn").width() + $(".tag ul").width() + $(".tag li").width())
    $(".tag li").click(function () {
        var title=$(this).attr("data");
        console.log(title);
        console.log(response);
        if ($(this).hasClass("active")) {}
        else {
            $(".active").removeClass("active");
            $(this).addClass("active");
        }
    })
    $(".listClose").click(function () {
        $("#tip3").hide();
        $(".imgRight2").click();
        if ($(".collegelist").css("display") == "none") {
            $(".collegelist").show();
            $(".collegeGo").addClass("clickCollege")
        }
        else {
            $(".collegeGo").removeClass("clickCollege")
            $(".collegelist").hide()
        }

    })
    $('.b_tool').on(mouse_touch.start, function (e) {
        if (!mouse_touch.active) {
            touchMain = e;
            if (!pc) {
                e = e.originalEvent.targetTouches[0];
            }
            touch.startPageX = e.pageX;
            touch.startPageY = e.pageY;
            mouse_touch.active = true;
            mouse_touch.left = parseInt($(".sliderBox").css("left"));
        }

    });

    $('.b_tool').on(mouse_touch.move, function (e) {
        if (mouse_touch.active) {
            e.preventDefault();
            if (!pc) {
                e = e.originalEvent.changedTouches[0];
            }
            touch.endPageX = e.pageX;
            touch.endPageY = e.pageY;

            //$(".sliderBox").animate({"left":(mouse_touch.left+(-1)*(touch.startPageX-touch.endPageX))})
            $(".sliderBox").css("left", (mouse_touch.left + (-1) * (touch.startPageX - touch.endPageX)))

        }

    })
    $('.b_tool').on(mouse_touch.end, function (e) {
        mouse_touch.active = false;
        if (!pc) {
            e = e.originalEvent.changedTouches[0];
        }
        touch.endPageX = e.pageX;
        touch.endPageY = e.pageY;
        var move_length = $(".sliderGo").width() + parseInt($(".sliderGo").css("margin-right"));
        if (touch.startPageX - touch.endPageX > 120) {
            //$(".sliderBox").css("transform","translateX(0px)");
            var nub = $(".slider_active").attr("page");
            if (nub < $(".sliderBox>div").length) {
                $(".sliderBox").css("left", mouse_touch.left - move_length);
                $(".gobig").removeClass("gobig");
                mapObj.setCenter([goLevel.eachLevel[goLevel.level - 13].txtlongitude[parseInt(nub)], goLevel.eachLevel[goLevel.level - 13].txtlatitude[parseInt(nub)]]);
                $("#l" + (goLevel.level - 13) + nub).addClass("gobig");
                $(".slider_active").removeClass("slider_active");
                $(".sliderBox>div").eq(nub).addClass("slider_active");
                $(".mapBox").hide();
                var id = parseInt($(".slider_active .listenBox").attr("data"));
                document.getElementById("myaudio").src = goLevel.eachLevel[goLevel.level - 13].mp3Url[id];
                $(" .playBox").css({
                    "background": "url(./webmap/imgs/play.svg)",
                    "background-repeat": "no-repeat",
                    "background-position": "43%,center"
                });
            } else {
                $(".sliderBox").css("left", (mouse_touch.left ))
            }

        }
        else {
            if (touch.startPageX - touch.endPageX < -120) {
                //$(".sliderBox").css("transform","translateX(0px)");
                var nub2 = $(".slider_active").attr("page");
                if (nub2 > 1) {
                    $(".sliderBox").css("left", mouse_touch.left + move_length);
                    //$(".sliderBox").animate({"left": mouse_touch.left + move_length}, 300);
                    $(".slider_active").removeClass("slider_active");
                    $(".sliderBox>div").eq(nub2 - 2).addClass("slider_active");
                    $(".gobig").removeClass("gobig");
                    mapObj.setCenter([goLevel.eachLevel[goLevel.level - 13].txtlongitude[parseInt(nub2) - 2], goLevel.eachLevel[goLevel.level - 13].txtlatitude[parseInt(nub2) - 2]]);
                    $("#l" + (goLevel.level - 13) + (nub2 - 2)).addClass("gobig");

                    var id = parseInt($(".slider_active .listenBox").attr("data"));
                    document.getElementById("myaudio").src = goLevel.eachLevel[goLevel.level - 13].mp3Url[id];
                    $(" .playBox").css({
                        "background": "url(./webmap/imgs/play.svg)",
                        "background-repeat": "no-repeat",
                        "background-position": "43%,center"
                    });
                } else {
                    $(".sliderBox").css("left", (mouse_touch.left ))
                }

            } else {
                //$(".sliderBox").animate({"left": 0}, 300)
                $(".sliderBox").css("left", (mouse_touch.left ))
            }
        }
    })


    $(".view").click(function () {
        clearLimitBounds()
    })
    $(".closeTip").click(function () {
        $("#tip3").css("display", "none");
        $("#divtip").css("display", "block");
        $(".closeTip").css("display", "none");
        $("#tip3>div").css("display", "none");
    })
    $("#tip3,#tip3>div").css("display", "none");
//  点击开始导航
    $("#startGo").click(function () {
        if ($(this).text() == "开启自动导航") {
            document.getElementById("myaudio").pause();
            //alert("这里触发了没");
            preNum = "";
            preI = 99999999;
            getLocationUpdate();
            $(this).text("关闭自动导航")
        }
        else {
            navigator.geolocation.clearWatch(watchID);
            clearInterval(audioPlay);
            oAudio2.pause();
            oAudio2.src = "";

            mapObj.remove(ees);
            $(this).text("开启自动导航");
        }

    })
    $(document).bind("click", "#mp3Play", function (e) {
        //alert($(e.target).attr("id"));
        if ($(e.target).attr("id") == "mp3Play" || $(e.target).attr("id") == "startGo") {
            //alert("每次播放"+oAudio2.src);
            setTimeout(function () {
                oAudio2.play();
                //oAudio3.pause();
            }, 100)
        }
    })
})



//点击播放语音
$(document).on(mouse_touch.start, ".listenBox", function () {
    var _this=this;
    var s = $(this).attr("data");
    oAudio2.pause();
    //oAudio3.pause();
    touch.endPageX = touch.startPageX;
    touch.endPageY = touch.startPageY;
    if (document.getElementById("myaudio").paused) {
        $(this).children(".playBox").css({
            "background": "url(./webmap/imgs/pause22.svg)",
            "background-repeat": "no-repeat",
            "background-position": "43%,center"
        });
        document.getElementById("myaudio").play();
    }
    //document.getElementById("myaudio").src=mp3Url[parseInt(s)];

    else {
        $(this).children(".playBox").css({
            "background": "url(./webmap/imgs/play.svg)",
            "background-repeat": "no-repeat",
            "background-position": "43%,center"
        });
        document.getElementById("myaudio").pause();
    }
    $("#myaudio").bind("ended", function () {
        $(_this).children(".playBox").css({
            "background": "url(./webmap/imgs/play.svg)",
            "background-repeat": "no-repeat",
            "background-position": "43%,center"
        });
    })
})
//景点导航
$(document).on("click", ".sliderBox i", function () {
    var viewID = parseInt($(this).attr("data"));
    var numID = goLevel.level - 13;
    //var url =" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
    //    goLevel.eachLevel[numID].txtlongitude[viewID]+
    //    "," +
    //    goLevel.eachLevel[numID].txtlatitude[viewID]+
    //    "," +
    //    goLevel.eachLevel[numID].txthead[viewID]+
    //    "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
    //window.location.href = url;
    //$(".b_tool").hide();
    map_name=goLevel.eachLevel[numID].txthead[viewID];
    map_lat=goLevel.eachLevel[numID].txtlatitude[viewID];
    map_lng=goLevel.eachLevel[numID].txtlongitude[viewID];
    if(wx_active==1){
        //   微信中
        event.stopPropagation();
        //使用微信内置地图查看位置接口
        wx.openLocation({
            latitude:Number(map_lat), // 纬度，浮点数，范围为90 ~ -90
            longitude:Number(map_lng), // 经度，浮点数，范围为180 ~ -180。
            name: ''+map_name, // 位置名
            address: '点击右侧导航按钮启动导航软件', // 地址详情说明
            scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl:" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
            map_name+
            "," +map_lat +
            "," + map_lng+
            "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0" // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }
    else  {
        $(".mapBox").show();
        $(".b_tool").hide();
    }
});
var playmp3;
var iconArry=[];
//语音播报时间累加
var timer;
$(".slide").click(function () {
    if(wx_active==1){

        //alert(positionNow+"out");
        wx.getLocation({
            type:"gcj02",
            success: function (res) {
                latitude = res.latitude;
                longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                //mapObj.setCenter([res.longitude,res.latitude]);
                if(!auto_location3(longitude,latitude)){
                    //alert(auto_location3(currentLng,currentLat));
                    //console.log("gg");
                    $(".mask").show();
                    $(".dialog").show();
                    return
                }else{
                    if(positionNow){
                        clearInterval(positionNow);
                        position=null;
                        //alert(positionNow);
                    }
                    $(".gobig").removeClass(".gobig");
                    //if($("#wx_location").hasClass("on")){
                    //    ee.setMap(null);
                    //    ee=null;
                    //}
                    if(!$("#wx_location").hasClass("on")){
                        $("#wx_location").addClass("on");
                        ee = new AMap.Marker({
                            map: mapObj,
                            position:[longitude,latitude],
                            icon: "./webmap/marker.png"
                        });
                        ee.setMap(mapObj);
                        //alert("有了")
                    }else{
                        //ee.setPosition([longitude,latitude]);
                        setTimeout(function () {
                            ee.setPosition([longitude,latitude]);
                        },50)
                        //ee.moveTo([longitude,latitude],1000000);

                    }
                    //ee.setMap(mapObj);
                    //mapObj.setZoom(18);
                    mapObj.setCenter([longitude,latitude]);
                    timer=0;


                    $(".slideBall").animate({left: "1.26rem"}, 600);
                    //$(".shadow").css({
                    //    "width": "0rem",
                    //    "height": "0rem",
                    //    "top": "0.38rem",
                    //    "left": "1.38rem"
                    //});
                    clickviable=false;
                    setTimeout(function () {
                        $(".slide").css("display", "none");
                        $(".end").css("display", "inline-block");
                        document.getElementById("myaudio").pause();
                        //oAudio3.pause();
                        preNum = "";
                        preI = 99999999;
                    }, 600);


                    //定位marker点指针指北功能
                    var alpha = "";
                    var ua = navigator.userAgent.toLowerCase();
                    //判断用户设备类型
                    if (/android/.test(ua)) {
                        window.addEventListener('deviceorientationabsolute', DeviceOrientationHandler, false);

                        function DeviceOrientationHandler(event) {
                            alpha = event.alpha;
                            //document.getElementById("alpha").innerHTML = Math.round(360 - event.alpha);
                            $(".amap-icon img").css("transform","rotate("+Math.round(360 - event.alpha)+"deg) ");
                        }
                    } else {
                        window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
                        function DeviceOrientationHandler(event) {
                            alpha = event.webkitCompassHeading;
                            //document.getElementById("alpha").innerHTML = event.webkitCompassHeading;
                            $(".amap-icon img").css("transform","rotate("+event.webkitCompassHeading+"deg) ")
                        }
                    }//指北针
                    //var ll=29.737122;
                    if(isSlideClick!=true){
                        playmp3=setInterval(function () {
                            //timer+=1;
                            wx.getLocation({
                                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                success: function (res) {
                                    latitude = res.latitude;
                                    longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                    var speed = res.speed; // 速度，以米/每秒计
                                    var accuracy = res.accuracy; // 位置精度
                                    var wx_now=transformFromWGSToGCJ(longitude,latitude);

                                    //var ee = new AMap.Marker({
                                    //    map: mapObj,
                                    //    position:[res.longitude,res.latitude],
                                    //    icon: "./webmap/marker.png"
                                    //});
                                    //marker点位置移动
                                    //ee.setPosition([longitude,latitude]);
                                    setTimeout(function () {
                                        ee.setPosition([longitude,latitude]);
                                    },50)
                                    //ee.moveTo([longitude,latitude],1000000);
                                    console.log("333333333333333333333333");
                                    //mapObj.setCenter([longitude,latitude]);
                                    mapObj.remove(iconArry);
                                    //iconArry=[];
                                    //iconArry.push(ee);
                                    auto_location2(res.longitude,res.latitude);
                                    //ll+=0.0001;
                                    //$("#wx_location").css("display","inline-block");
                                    //$(".slide").hide();
                                },
                                cancel: function (res) {}
                            });
                        }, 1000);
                        isSlideClick=true;
                    }



                }
            },
            cancel: function (res) {}
        });

    }
    else{
        alert("该功能仅在微信中可用！请在微信内打开");
        $(".end").click();
    }

})
//退出自动导览
$(".end").bind("click", function () {
    isSlideClick=false;


    //getLocation();
    ee.setMap(null);
    ee=null;


    $(".end").css({
        "display": "none",
        "background": "rgba(55,63,71,0.80)"
    });
    //$("#wx_location").removeClass("on");
    //ee.setMap(null);
    mapObj.setZoom(zoomTo);
    mapObj.remove(iconArry);
    //$(this).css({
    //    "background": "#f7d044"
    //});
    //$(".shadow").css("display", "inline-block");
    //$(".shadow").animate({
    //    "width": "25rem",
    //    "height": "25rem",
    //}, 2000);
    clearInterval(playmp3);
    playmp3=null;
    //var s = setInterval(function () {
    //    $(".shadow").css({
    //        "top": $(".end").height() / 2 - $(".shadow").height() / 2,
    //        "left": $(".end").width() / 2 - $(".shadow").width() / 2
    //    })
    //}, 50);
    clickviable=true;
    //关闭自动导航
    $(".slideBall").css("left", "-0.18rem");
    if(!$("#audioGuide").hasClass("itemActive")){
        $(".slide").hide();
    }else{
        $(".slide").css("display", "inline-block");
    }
    setTimeout(function () {
        //clearInterval(s);
        oAudio2.pause();
        oAudio2.src = "";
        mapObj.remove(ees);
        mapObj.setCenter([response.data.scenic.longitude, response.data.scenic.latitude]);
        $("#wx_location").removeClass("on");
        $("#wx_location").click();
    }, 500)
})
//$(".end").mousedown(function(){
//
//})


//当前位置
//var current;
$("#wx_location").click(function () {
    var currentLat,currentLng;
    var _this=this;
    if(wx_active==1){
        if($(this).hasClass("on")){
            $(this).removeClass("on");
            if(isWalking||isSlideClick){
                return
            }else{
                clearInterval(positionNow);
                positionNow=null;
                ee.setMap(null);
                ee=null;
                mapObj.setCenter([response.data.scenic.longitude, response.data.scenic.latitude]);
                return
            }
        }else{

            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    currentLat = res.latitude;
                    currentLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    //currentLat =30.31251;
                    //currentLng = 120.373735;
                    //var ee = new AMap.Marker({
                    //    map: mapObj,
                    //    position:[res.longitude,res.latitude],
                    //    icon: "./webmap/marker.png"
                    //});
                    //marker点位置移动
                    if(isWalking||isSlideClick){
                        $(_this).addClass("on");
                        ee.setPosition([currentLng,currentLat]);
                        console.log(currentLng,currentLat);
                        mapObj.setCenter([currentLng,currentLat]);
                        mapObj.remove(iconArry);
                    }else{
                        ////定位marker点指针指北功能
                        //var alpha = "";
                        //var ua = navigator.userAgent.toLowerCase();
                        ////判断用户设备类型
                        //if (/android/.test(ua)) {
                        //    window.addEventListener('deviceorientationabsolute', DeviceOrientationHandler, false);
                        //
                        //    function DeviceOrientationHandler(event) {
                        //        alpha = event.alpha;
                        //        //document.getElementById("alpha").innerHTML = Math.round(360 - event.alpha);
                        //        $(".amap-icon img").css("transform","rotate("+Math.round(360 - event.alpha)+"deg) ");
                        //    }
                        //} else {
                        //    window.addEventListener('deviceorientation', DeviceOrientationHandler, false);
                        //    function DeviceOrientationHandler(event) {
                        //        alpha = event.webkitCompassHeading;
                        //        //document.getElementById("alpha").innerHTML = event.webkitCompassHeading;
                        //        $(".amap-icon img").css("transform","rotate("+event.webkitCompassHeading+"deg) ")
                        //    }
                        //}//指北针
                        //
                        //wx.getLocation({
                        //    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        //    success: function (res) {
                        //        currentLat = res.latitude;
                        //        currentLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        //        //var speed = res.speed; // 速度，以米/每秒计
                        //        //var accuracy = res.accuracy; // 位置精度
                        //        //var wx_now=transformFromWGSToGCJ(longitude,latitude);
                        //
                        //
                        //        //if(!auto_location3(currentLng,currentLat)){
                        //        if(!auto_location3(120.373703,30.312672)){
                        //            //alert(auto_location3(currentLng,currentLat));
                        //            //console.log("gg");
                        //            return
                        //        }else{
                        //            ee = new AMap.Marker({
                        //                map: mapObj,
                        //                position:[res.longitude,res.latitude],
                        //                icon: "./webmap/marker.png"
                        //            });
                        //            //marker点位置移动
                        //            ee.setPosition([currentLng,currentLat]);
                        //            //ee.setMap();
                        //            mapObj.setCenter([currentLng,currentLat]);
                        //            //mapObj.setCenter([119.014625,29.593715]);
                        //            mapObj.remove(iconArry);
                        //        }
                        //
                        //    },
                        //    cancel: function (res) {}
                        //});
                        if(!auto_location3(currentLng,currentLat)){
                            //alert(auto_location3(currentLng,currentLat));
                            if(firstPosition==true){
                                firstPosition=false;
                            }else{
                                $(".mask").show();
                                $(".dialog").show();
                            }
                           /* console.log("gg");
                            console.log(currentLng,currentLat);*/
                            //getLocation();
                            //return
                        }else{
                            getLocation();
                        }

                    }
                },
                cancel: function (res) {}
            });

        }
    }
})
$("#d_tip").css("display", "none");
$(".imgClose").click(function () {
    $("#line_slider").css("bottom", "-0rem");
    //$(".b_tool").css("bottom", "-0rem");
    $(".slide").css("bottom", "0.4rem");
    $(".end").css("bottom", "0.4rem");
    $("#donw").css("display", "none");
    $("#d_tip").css("display", "block");
})
//点击线路变化
var polyline;
var sop = 1;
var isLineClick=false;
$(document).on("click", ".line", function () {
    document.getElementById("head").click();
    $("#wx_location").hide();
    deleMarker();
    if(isWalking){
        stopInterval();
        setTimeout(function () {
            $("#wx_location").click();
        },500)
    }
    //mapObj.remove(lineRoadGo);
    mapObj.remove(roadgo.u0);
    mapObj.remove(roadgo.u1);
    mapObj.remove(roadgo.u2);
    mapObj.remove(roadgo.u3);
    mapObj.remove(roadgo.u4);
    $(".b_tool").hide();
    $(".slide").hide();
    $("#audioGuide").removeClass("itemActive");
    $(".line_Box").empty()
    $(".line_Box").css("left", 0);
    $(".lineActivity").removeClass("lineActivity");
    $(this).addClass("lineActivity");
    isLineClick=true;
    var y = $(this).attr("data");
    var u = parseInt(y);
    if (u == 0) {
        mapObj.add(roadgo.u0);
    }
    if (u == 1) {
        mapObj.add(roadgo.u1);
    }
    if (u == 2) {
        mapObj.add(roadgo.u2);
    }
    if (u == 3) {
        mapObj.add(roadgo.u3);
    }
    if (u == 4) {
        mapObj.add(roadgo.u4);
    }
    var x2 = parseInt($(".lineActivity").attr("data"));
    if (!line) {
        mapObj.setCenter([line[x2][0].lng, line[x2][0].lat]);
    }

    $(".line_Box").empty();
    $(".line_Box").width($("body").width() * (line[u].length + 2));

    //if(language=="chs"){
    //
    //}
    var r = "";
    r += "<div page='1' class='sliderhead Header slider_active2'> <div class='slideLeft'> <div class='slideHead'>" +
        lineName[u] +
        "</div>" +
        "<div class='headText'><span class='jingdian'></span><span class='viewSum'>" +
        line[u].length +
        "个景点</span><span class='time_icon'></span><span class='sumTime' >" +
        "建议" + timeline[u] +
        "</span> </div> </div> <div class='slideRight'> <i class='iconfontGo'></i> </div> </div>"
        //判断语音类型 填充dom
        // switch(language){
        //     case "chs":
            
        //     break;
        //     case "enu":

        //     break;
        //     case "kor":

        //     break;
        //     case "jpn":

        //     break;
        //     default:
        //     break
        // }
        for (var i = 0; i < line[u].length; i++) {
            r += "  <div page='" +
                (i + 2) +
                "' class='sliderGo2'> <div class='listenBox' data='" +
                i +
                    //   这个为语音播放按钮，暂时没有音频so隐藏
                "'> <div class='playBox playBox2'>" +
                "</div><img src='" +
                param.newUrl+Imgline[u][i]+
                "' alt=''/> </div> <div class='goTxt'> " +
                "<div class='goHead'><a class='goDetail' href='" +
                "http://daoyou.worldmaipu.com/web/share!detail.action?hotId=" + lineHid[u][i] +
                    //tetUrl[num3] +
                "'>" +
                linePosName[u][i] +
                "</a></div> " +
                "<div class='goSum'></div> </div>" +
                " <div class='goTo'> <a href='javascript:void(0)'> <i class='iconfontCome' data='" +
                i +
                "'></i> </a> </div>  </div>"
        }
    //console.log(($("body").width() - $(".sliderGo2").width()-parseInt($(".sliderGo2").css("border-width"))*2) / 2);
    //console.log(($("body").width() - $(".sliderGo2").width()) / 2);
    $(".line_Box").append(r);


    if($(".sliderGo2").length !=0){
        $(".line_Box>div").css({
            "margin-left": ($("body").width() - $(".sliderGo2").width()-parseInt($(".sliderGo2").css("border-width"))*2) / 2,
            "margin-right": ($("body").width() - $(".sliderGo2").width()) / 2
        })
    }else{
        $(".line_Box>div").css({
            "margin-left": ($("body").width() - $(".sliderhead").width()-parseInt($(".sliderhead").css("border-width"))*2) / 2,
            "margin-right": ($("body").width() - $(".sliderhead").width()) / 2
        })
    }

    $("#line_slider").css("display", "block");
    // mapObj.remove(typelist9);
    // mapObj.remove(typelist8);
    // mapObj.remove(typelist7);
    // mapObj.remove(typelist6);
    // mapObj.remove(typelist5);
    // mapObj.remove(typelist4);
    // mapObj.remove(typelist3);
    // mapObj.remove(markerList);
    // mapObj.remove(typelist2);
    removeTypelist()

    polyline = new AMap.Polyline({
        path: way[u],          //设置线覆盖物路径
        strokeColor: "#5DC7EB", //线颜色000333
        strokeOpacity: 0.8,       //线透明度
        strokeWeight: 3,        //线宽
        strokeStyle: 'solid',   //线样式
        strokeDasharray: [10, 5], //补充线样式
        zIndex: 9999
    });
    polyline.setMap(mapObj);
})
//景点详细介绍页
$(document).on("click",".goDetail", function (e) {
    e.preventDefault();
    $(".sliderBox").hide();
    console.log(1111);
    var goUrl=$(this).attr("href");
    console.log(goUrl);
    $("#viewDetail iframe").attr("src",goUrl);
    $("#viewDetail").show();
    setTimeout(function () {
        $(".toView").show();
    },600)
    //alert(11);
})
$(document).on("click",".toView", function () {
    $("#viewDetail").hide();
    $("#viewDetail iframe").attr("src","");
    $(".sliderBox").show();
})
var io = 0;
$(".head").click(function () {
    //if(io==0){ io=1;}
    //else{
    polyline.setMap(null);
    //}

})

//线路滑动

$('#line_slider').on(mouse_touch.start, function (e) {
    if (!mouse_touch.active) {
        if (!pc) {
            e = e.originalEvent.targetTouches[0];
        }

        touch.startPageX = e.pageX;
        touch.startPageY = e.pageY;
        mouse_touch.active = true;
        mouse_touch.left = parseInt($(".line_Box").css("left"));
    }

});
$('#line_slider').on(mouse_touch.move, function (e) {
    if (mouse_touch.active) {
        e.preventDefault();
        if (!pc) {
            e = e.originalEvent.changedTouches[0];
        }
        touch.endPageX = e.pageX;
        touch.endPageY = e.pageY;

        //$(".sliderBox").animate({"left":(mouse_touch.left+(-1)*(touch.startPageX-touch.endPageX))})
        $(".line_Box").css("left", (mouse_touch.left + (-1) * (touch.startPageX - touch.endPageX)))

    }

})
$('#line_slider').on(mouse_touch.end, function (e) {
    mouse_touch.active = false;
    if (!pc) {
        e = e.originalEvent.changedTouches[0];
    }
    var t = $(".lineActivity").attr("data");
    touch.endPageX = e.pageX;
    touch.endPageY = e.pageY;
//        判断是否滑动页面
    if (touch.startPageX - touch.endPageX > 120) {

        console.log(touch.startPageX - touch.endPageX);
        var nub = $(".slider_active2").attr("page");
        if (parseInt(nub) < $(".line_Box>div").length) {
            $(".line_Box").css("left", $("body").width() * parseInt(nub) * (-1));
            $(".line_Box").width();
            //alert(nub);
            $(".lineBig").removeClass("lineBig");
            $("#lineRoad" + $(".lineActivity").attr("data") + nub).addClass("lineBig");
            //$(".line"+t).eq(nub-1).addClass("lineBig");
            $(".slider_active2").removeClass("slider_active2");
            $(".line_Box>div").eq(nub).addClass("slider_active2");
            var id = parseInt($(".line_Box>div.slider_active2>.listenBox").attr("data"));
            var firstSum = parseInt($(".lineActivity").attr("data"));
            document.getElementById("myaudio").src = listMp3[firstSum][id];
            $(" .playBox").css({
                "background": "url(./webmap/imgs/play.svg)",
                "background-repeat": "no-repeat",
                "background-position": "43%,center"
            });
        }
        else {
            $(".line_Box").css("left", mouse_touch.left);
        }


    }
    else {
        if (touch.startPageX - touch.endPageX < -120) {
            console.log(touch.startPageX - touch.endPageX);
            var nub2 = $(".slider_active2").attr("page");
            if (nub2 > 1) {
                $(".line_Box").css("left", $("body").width() * parseInt(nub2 - 2) * (-1));
                $(".slider_active2").removeClass("slider_active2");
                if (nub2 - 2 == 0) {
                    $(".line_Box>div").eq(1).addClass("slider_active2");
                }
                else {
                    $("#lineRoad" + $(".lineActivity").attr("data") + (nub2 - 2)).addClass("lineBig");
                }
                $(".line_Box>div").eq(nub2 - 2).addClass("slider_active2");
                $(".lineBig").removeClass("lineBig");
                $("#lineRoad" + $(".lineActivity").attr("data") + (nub2 - 2)).addClass("lineBig");
                //}
                var id = parseInt($(".line_Box>div.slider_active2>.listenBox").attr("data"));
                var firstSum = parseInt($(".lineActivity").attr("data"));
                document.getElementById("myaudio").src = listMp3[firstSum][id];
                $(" .playBox").css({
                    "background": "url(./webmap/imgs/play.svg)",
                    "background-repeat": "no-repeat",
                    "background-position": "43%,center"
                });
            } else {
                $(".line_Box").css("left", mouse_touch.left);
            }

        } else {
            $(".line_Box").css("left", mouse_touch.left);
        }
    }
    var x2 = parseInt($(".lineActivity").attr("data"));
    var y2 = parseInt($(".slider_active2>.goTo>a>i.iconfontCome").attr("data"));
    mapObj.setCenter([line[x2][y2].lng, line[x2][y2].lat]);

})
var map_name="";
var map_lat="";
var map_lng="";
$(document).on("click", ".line_Box i", function () {
    var x = parseInt($(".lineActivity").attr("data"));
    var y = parseInt($(this).attr("data"));
    $(".b_tool").hide();
    map_name=linePosName[x][y];
    map_lat=line[x][y].lat;
    map_lng=line[x][y].lng;
    if(wx_active==1){
        wx.openLocation({
            latitude:""+map_lat, // 纬度，浮点数，范围为90 ~ -90
            longitude:""+map_lng, // 经度，浮点数，范围为180 ~ -180。
            name: ''+map_name, // 位置名
            address: '点击右侧导航按钮启动导航软件', // 地址详情说明
            scale: 14, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl:" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
            map_name+
            "," +map_lat +
            "," + map_lng+
            "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0" // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }else{
        $(".mapBox").show();
    }

    //var url =" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
    //    line[x][y].lng+
    //    "," +
    //    line[x][y].lat+
    //    "," +
    //    linePosName[x][y]+
    //    "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
    //
    //console.log(url);
    //window.location.href = url;
})
//
$(".account").on("" + mouse_touch.start, function () {
    $(".shade").hide();
    $(".leaguer").show();
});

$(document).on("click",".mapli",function(){
    switch ($(this).attr("data")){
        case "0":
            var url=" http://uri.amap.com/navigation//uri.amap.com/navigation?to=" +
                map_lng +
                "," +
                map_lat +
                "," +
                map_name +
                "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0"
            window.location.href=url;
            break;
        case "1":
            var url=" http://apis.map.qq.com/uri/v1/routeplan?type=drive"+
                "&to=" +map_name +
                "&tocoord=" +
                map_lng+
                "," +
                map_lat+
                "&policy=1"
            window.location.href=url;
            break;
        default :
            break;
    }
    $(".mapBox").hide();
});
$(document).on("click",".cancel",function(){
    $(".b_tool").show();
    $(".mapBox").hide();
});
window.onload= function () {
    if(isAndroid){
        //为了iosiframe 宽度会变大
        $("#viewDetail iframe").attr("scrolling","yes")
    }
}


