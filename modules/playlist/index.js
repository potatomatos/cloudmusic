
define(["jquery","util/util"], function($,util){
    return function(container,param){
        var page=1;
        get_playlist(page);
        function get_playlist(page){
            util.loading.show();
            $.ajax({
                type: "get",
                url: "/cloudmusic/api.php",
                dataType:"json",
                data: {
                    action: "get_playlist",
                    page:page
                },
                success: function (data) {
                    util.loading.hide();
                    if (!data){
                        page=1;
                    }
                    pageSelect(page,data);
                },
                error:function(){
                    util.loading.hide();
                    util.error();
                }
            });
        }

        function pageSelect(page,data) {

            console.log("page", page);
            var maxPage = 131;
            var html = "";
            for (var i = 0; i < data.length; i++) {
                var nb = "(收藏：" + data[i].nb + ")";
                if (i == 0) {
                    html += '<li class="active" data-nav="' + data[i].name + '"><strong class="pointer">-></strong><span data-listid="' + data[i].id + '">' + ((page - 1) * 10 + i) + '.' + data[i].name + '</span><span class="nb">' + nb + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="user">' + data[i].user + '</span></li>';
                } else {
                    html += '<li data-nav="' + data[i].name + '"><strong>-></strong><span data-listid="' + data[i].id + '">' + ((page - 1) * 10 + i) + '.' + data[i].name + '</span><span class="nb">' + nb + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="user">' + data[i].user + '</span></li>';
                }
            }
            $(".play-list>ul").html(html);

            var iLength = 10;
            var iNum = 0;
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if (e && e.keyCode == 38) {//上
                    iNum--;
                    if (iNum < 0) {
                        iNum = iLength;
                        page--;
                        if (page <= 0) {
                            page = maxPage;
                        }
                        get_playlist(page);
                    }

                    $('.play-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.play-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.play-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }

                if (e && e.keyCode == 40) {//下
                    iNum++;
                    if (iNum > iLength - 1) {
                        iNum = 0;
                        page++;
                        if (page > maxPage) {
                            page = 1;
                        }
                        get_playlist(page);
                    }
                    $('.play-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.play-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.play-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }
                if (e && e.keyCode == 37) {//左
                    window.history.go(-1);
                }
                if (e && e.keyCode == 39) {//右
                    var play_list_id=$(".play-list").find(".active").find("span").attr("data-listid");

                    window.location.hash="/playlist-info/"+play_list_id;
                }
            };
        }
    }
});