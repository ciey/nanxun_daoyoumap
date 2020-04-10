/**
 * Created by Administrator on 2016/10/31.
 */
var  url_head="http://daoyou.worldmaipu.com";
//var  url_head="http://121.40.133.252";
//下面的广告默认关掉
var sign_key="";
var hash;
(function(){
    sign_key=""+window.screen.width+"*"+window.screen.height+navigator.platform+navigator.systemLanguage;
    var c;
    var cv = 16;
    if (cv != "Netscape")
        c = screen.colorDepth;
    else
        c = screen.pixelDepth;
    var s=navigator.userAgent.split(";")[1].split(")")[0];
    sign_key=sign_key+c+s;
    hash = hex_md5(sign_key);
})();
function closeguanggao(){
    $("#line_slider").css("bottom","-0rem");
    $(".b_tool").css("bottom","-0rem");
    $(".slide").css("bottom","0.4rem");
    $(".end").css("bottom","0.4rem");
    $("#donw").css("display","none");
}
closeguanggao();
function setCookie(c_name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie=c_name+ "=" +escape(value)+
         "; expires="+ exp.toGMTString();
}
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
//登录界面
$(".l_header>span").click(function(){
    $(".tag_active").removeClass("tag_active");
    $(this).addClass("tag_active");
    if($(this).hasClass("entry")){
        $(".register_block").hide();
        $(".entry_block").show();
    }else{
        $(".entry_block").hide();
        $(".register_block").show();
    }
})
$(".Login .btn").click(function(){
    $.ajax({
        "method":"get",
        "url":url_head+"/api/v1/scenic!Activate.action",
        "dataType":"jsonp",
        "jsonp": "callback",
        "data":{"mobile":$(".phoneNum").text(),"cd_key":$(".key_nub").text(),"m_key":hash},
        "error":function(a,b,c){
            alert("激活失败！"+a+"|"+b+"|"+c);
        },
        "success":function(data){
            alert(data.data.msg);
            if(data.data.result){
                $(".out_shade").hide();
                setCookie("id_phone",$(".phoneNum").text());
                setCookie("id_key",$(".key_nub").text());
            }
        }
    })
})
