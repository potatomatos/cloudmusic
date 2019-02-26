define(["jquery", "util/util","core"], function ($, util) {
    return function (container, param) {

        var page=1;
        get_album_list(page);

        function get_album_list(page) {

            var p1 = '{"area":"ALL","offset":"'+((page-1)*10)+'","total":"true","limit":"10","csrf_token":""}';
            var p2 = '010001';
            var p3 = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
            var p4 = '0CoJUm6Qyw8W8jud';
            var h = d(p1, p2, p3, p4);

            util.loading.show();
            $.ajax({
                type: "post",
                url: "/cloudmusic/api.php?action=get_new_album",
                dataType: "json",
                data: {
                    params: h.encText,
                    encSecKey: h.encSecKey
                },
                success: function (data) {
                    util.loading.hide();
                    if(data.code==200){
                        pageSelect(page,data);
                    }else {
                        util.error();
                    }

                },
                error: function () {
                    util.loading.hide();
                    util.error();
                }
            });
        }

        function pageSelect(page,data) {

            console.log("page", page);
            var maxPage = Math.ceil((data.total)/10);
            var html = "";
            var list=data.albums;
            for (let i = 0; i < list.length; i++) {
                var alias="";
                if (list[i].alias.length>0){
                    alias= "(" + list[i].alias[0] + ")";
                }

                if (i == 0) {
                    html += '<li class="active" data-nav="' + list[i].name + '"><strong class="pointer">-></strong><span data-listid="' + list[i].id + '">' + ((page - 1) * 10 + i) + '.' + list[i].name + '</span><span class="alias">' + alias + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="user">' + list[i].artist.name + '</span></li>';
                } else {
                    html += '<li data-nav="' + list[i].name + '"><strong>-></strong><span data-listid="' + list[i].id + '">' + ((page - 1) * 10 + i) + '.' + list[i].name + '</span><span class="alias">' + alias + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="user">' + list[i].artist.name+ '</span></li>';
                }
            }
            $(".album-list>ul").html(html);

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
                        get_album_list(page);
                    }

                    $('.album-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.album-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.album-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }

                if (e && e.keyCode == 40) {//下
                    iNum++;
                    if (iNum > iLength - 1) {
                        iNum = 0;
                        page++;
                        if (page > maxPage) {
                            page = 1;
                        }
                        get_album_list(page);
                    }
                    $('.album-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.album-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.album-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }
                if (e && e.keyCode == 37) {//左
                    window.history.go(-1);
                }
                if (e && e.keyCode == 39) {//右
                    var album_list=$(".album-list").find(".active").find("span").attr("data-listid");

                    window.location.hash="/albumlist-info/"+album_list;
                }
            };
        }
    }
});