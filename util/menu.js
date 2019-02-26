define(["jquery"], function($){
    return function () {
        var iLength=$('.list').find("li").length;
        var  iNum=0;
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];

            if(e && e.keyCode==38){//上
                iNum--;
                if(iNum<0){
                    iNum=iLength;
                }
                $('.list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                $('.list').find("li").eq(iNum).find("strong").addClass("pointer");
                $('.list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");
            }

            if(e && e.keyCode==40){//下
                iNum++;
                if (iNum>iLength-1){
                    iNum=0;
                }
                $('.list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                $('.list').find("li").eq(iNum).find("strong").addClass("pointer");
                $('.list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");
            }
            if(e && e.keyCode==37){//左
                window.history.go(-1);
            }
            if(e && e.keyCode==39){//右
                // $(".nav-text").html("/"+navText);
                var sLocation=$(".list").find(".active").find("span").attr("data-location");
                window.location.hash=sLocation;
            }
        };
    }
});