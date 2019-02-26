define(["jquery", "util/util", "core"], function ($, util) {

    var timer = null;
    $("#music_player").bind('ended', function () {
        clearInterval(timer);
        $(".music-icon").html("");
    });
    var obj = {};
    obj.pageSelect = function (data) {
        var maxPage = Math.ceil(data.total / 10);
        console.log("page", data.page);

        var html = "";
        for (let i = 0; i < data.list.length; i++) {
            if (0==i) {
                html += '<li class="active" data-nav="' + data.list[i].name + '"><strong class="pointer">-></strong><span data-musicid="' + data.list[i].id + '">' + ((data.page - 1) * 10 + i) + '.' + data.list[i].name + '</span><span class="alias">' + data.list[i].alias + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="singer-name">' + data.list[i].singerName + '</span></li>';
            } else {
                html += '<li data-nav="' + data.list[i].name + '"><strong>-></strong><span data-musicid="' + data.list[i].id + '">' + ((data.page - 1) * 10 + i) + '.' + data.list[i].name + '</span><span class="alias">' + data.list[i].alias + '</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="singer-name">' + data.list[i].singerName + '</span></li>';
            }
        }
        $(data.wrap).html(html);

        var iLength = $(data.wrap).children('li').length;
        var iNum = 0;
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];

            if (e && e.keyCode == 38) {//上
                iNum--;
                if (iNum < 0) {
                    iNum = iLength;
                    data.page--;
                    if (data.page <= 0) {
                        data.page = maxPage;
                    }
                    data.callback && data.callback(data.page, maxPage, data.total);
                }

                $(data.wrap).find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                $(data.wrap).find("li").eq(iNum).find("strong").addClass("pointer");
                $(data.wrap).find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

            }

            if (e && e.keyCode == 40) {//下
                iNum++;
                if (iNum ==iLength) {
                    iNum = 0;
                    data.page++;
                    if (data.page > maxPage) {
                        data.page = 1;
                    }
                    data.callback && data.callback(data.page, maxPage, data.total);
                }
                $(data.wrap).find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                $(data.wrap).find("li").eq(iNum).find("strong").addClass("pointer");
                $(data.wrap).find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

            }
            if (e && e.keyCode == 37) {//左
                window.history.go(-1);
            }
            if (e && e.keyCode == 13) {//回车播放
                var musicId = $(data.wrap).find(".active").find("span").attr("data-musicid");
                var index = $(data.wrap + " li").index($(data.wrap).find(".active"));
                console.log("musicId",musicId);
                var p1 = '{"ids":"[' + musicId + ']","br":128000,"csrf_token":""}';
                var p2 = '010001';
                var p3 = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
                var p4 = '0CoJUm6Qyw8W8jud';
                var h = d(p1, p2, p3, p4);
                console.log(h);
                var musicInfo = data.list[index];
                console.log("musicInfo", musicInfo);
                $(".song-name").html(musicInfo.name);
                $(".singer").html(musicInfo.singerName);
                $(".album").html(musicInfo.albumName);

                $(".player").show();

                get_music_play_url(musicId, h.encText, h.encSecKey);
            }
        };
    };

    function get_music_play_url(id, params, encSecKey) {
        util.loading.show();
        $.ajax({
            type: "post",
            url: "/cloudmusic/api.php?action=get_music_play_url",
            dataType: "json",
            data: {
                id: id,
                params: params,
                encSecKey: encSecKey
            },
            success: function (data) {
                util.loading.hide();
                if(data.data[0].code==200){
                    var music_src = data.data[0].url;
                    $("#music_player").attr("src", music_src);

                    var _audio = $('#music_player').get(0);

                    var pl = parseInt(data.data[0].br) / 1000;
                    var quality = "";
                    if (pl < 64) {
                        quality = "k LQ";
                    } else if (64 <= pl <= 128) {
                        quality = "k MQ";
                    } else {
                        quality = "k HQ";
                    }
                    quality = pl + quality;
                    $(".quality").html(quality);

                    _audio.oncanplay = function () {
                        $(".music-icon").html("♫♩♬♪");
                        var time = _audio.duration;
                        var totalTime = changeTime(time);
                        $(".total-time").html(totalTime);

                        var processLength=$(".progress-bar").width()-12;

                        clearInterval(timer);
                        timer = setInterval(function () {
                            var currentTime = _audio.currentTime;
                            $(".now-time").html(changeTime(currentTime));
                            var scale = currentTime/time;

                            $(".progress").css("width",(scale * processLength) + 'px');

                        }, 1000);
                    };

                }else{
                    util.error();
                }

            },
            error: function () {
                util.loading.hide();
                util.error();
            }
        });
    }

    function changeTime(time) {

        time = parseInt(time);
        //分钟
        var minute = time / 60;
        var minutes = parseInt(minute);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        var second = time % 60;
        var seconds = Math.round(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    return obj;
});
