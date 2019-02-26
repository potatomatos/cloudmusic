define(["jquery", "util/util","template","util/music-list","core"], function ($, util,template,musicTool) {
    return function (container, param) {

        var page=1;
        get_toplist(page);

        function get_toplist(page) {
            util.loading.show();
            $.ajax({
                type: "get",
                url: "/cloudmusic/api.php",
                dataType:"json",
                data: {
                    action: "get_toplist",
                    id: param
                },
                success: function (data) {
                    util.loading.hide();
                    if(data instanceof Array&&data.length>0){
                        var dataObj=transList(data,page);
                        musicTool.pageSelect(dataObj);
                    }else {
                        util.error();
                    }
                },
                error:function(){
                    util.loading.hide();
                    util.error();
                }
            });
        }

        function transList(data,page){
            var obj={};
            obj.total=data.length;
            obj.page=page;
            obj.wrap=".music-list";
            obj.list=[];
            var list=util.arrayPage(data,page);
            for(var i=0;i<list.length;i++){
                var songInfo={};
                songInfo.name=list[i].name;
                songInfo.id=list[i].id;
                songInfo.alias="";
                if (list[i].alias.length>0){
                    songInfo.alias=list[i].alias[0];
                }
                songInfo.singerName="";
                for (var j=0;j<list[i].artists.length;j++){
                    songInfo.singerName+=list[i].artists[j].name;
                    songInfo.singerName+="/";
                }
                if(songInfo.singerName){
                    songInfo.singerName=songInfo.singerName.substring(0,songInfo.singerName.length-1);
                }
                songInfo.albumName=list[i].album.name;
                obj.list.push(songInfo);
            }
            obj.callback=function(page){
                var dataObj=transList(data,page);
                musicTool.pageSelect(dataObj);
            };
            return obj;
        }
        function pageSelect(page,data){

            var maxPage=Math.ceil((data.length)/10);
            var page_song_list=util.arrayPage(data,page);
            console.log("page",page);
            console.log("maxPage",maxPage);

            var html="";
            for(var i=0;i<page_song_list.length;i++){
                var alias="";
                var singerName="";
                if(page_song_list[i].alias.length>0){
                    alias+="(";
                    alias+=page_song_list[i].alias[0];
                    alias+=")";
                }
                for(var j=0;j<page_song_list[i].artists.length;j++){
                    singerName+=page_song_list[i].artists[j].name;
                    singerName+="/";
                }
                singerName=singerName.substring(0,singerName.length-1);

                if(i==0){
                    html+='<li class="active" data-nav="'+page_song_list[i].name+'"><strong class="pointer">-></strong><span data-musicid="'+page_song_list[i].id+'">'+((page-1)*10+i)+'.'+page_song_list[i].name+'</span><span class="alias">'+alias+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="singer-name">'+singerName+'</span></li>';
                }else{
                    html+='<li data-nav="'+page_song_list[i].name+'"><strong>-></strong><span data-musicid="'+page_song_list[i].id+'">'+((page-1)*10+i)+'.'+page_song_list[i].name+'</span><span class="alias">'+alias+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;<span class="singer-name">'+singerName+'</span></li>';
                }
            }
            $(".music-list>ul").html(html);

            var iLength=10;
            var iNum=0;
            document.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if(e && e.keyCode==38){//上
                    iNum--;
                    if(iNum<0){
                        iNum=iLength;
                        page--;
                        if(page<=0){
                            page=maxPage;
                        }
                        pageSelect(page,data);
                    }

                    $('.music-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.music-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.music-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }

                if(e && e.keyCode==40){//下
                    iNum++;
                    if (iNum>iLength-1){
                        iNum=0;
                        page++;
                        if(page>maxPage){
                            page=1;
                        }
                        pageSelect(page,data);
                    }
                    $('.music-list').find("li").eq(iNum).addClass("active").siblings().removeClass("active");
                    $('.music-list').find("li").eq(iNum).find("strong").addClass("pointer");
                    $('.music-list').find("li").eq(iNum).siblings().find("strong").removeClass("pointer");

                }
                if(e && e.keyCode==37){//左
                    window.history.go(-1);
                }
                if(e && e.keyCode==13){//回车播放
                    var musicId=$(".music-list").find(".active").find("span").attr("data-musicid");
                    var index=$(".music-list li").index($(".music-list").find(".active"));
                    console.log("index",index);
                    console.log(musicId);
                    var p1='{"ids":"['+musicId+']","br":128000,"csrf_token":""}';
                    var p2='010001';
                    var p3='00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
                    var p4='0CoJUm6Qyw8W8jud';
                    var h=d(p1,p2,p3,p4);
                    console.log(h);
                    var musicInfo=page_song_list[index];
                    console.log("musicInfo",musicInfo);
                    $(".song-name").html(musicInfo.name);
                    var singer="";
                    for(var i=0;i<musicInfo.artists.length;i++){
                        singer+=musicInfo.artists[i].name;
                        singer+="/";
                    }
                    singer=singer.substring(0,singer.length-1);
                    $(".singer").html(singer)
                    $(".album").html(musicInfo.album.name);
                    var pl=parseInt(musicInfo.privilege.pl)/1000;
                    var quality="";
                    if (pl<64){
                        quality="k ld";
                    }else if (64<=pl<=128){
                        quality="k md";
                    }else {
                        quality="k hd";
                    }
                    quality=pl+quality
                    $(".quality").html(quality);

                    $(".player").show();

                    get_music_play_url(h.encText,h.encSecKey);
                }
            };
        }

        var timer=null;
        function get_music_play_url(params,encSecKey){
            util.loading.show();
            $.ajax({
                type: "post",
                url: "/cloudmusic/api.php?action=get_music_play_url",
                dataType:"json",
                data: {
                    params:params,
                    encSecKey:encSecKey
                },
                success: function (data) {
                    util.loading.hide();
                    var music_src=data.data[0].url;
                    $("#music_player").attr("src",music_src);

                    var _audio = $('#music_player').get(0);
                    $(".bar").html('<span class="progress">=</span><span class="progress-pointer">></span>');
                    _audio.oncanplay = function(){
                        $(".music-icon").html("♫♩♬♪");
                        var time = _audio.duration;
                        var totalTime=changeTime(time);
                        $(".total-time").html(totalTime)
                        var pBarLength=$(".progress-bar").width();
                        var barLength=$(".bar .progress").width();
                        var speed=parseInt((pBarLength-barLength*4)/barLength);
                        timeSpeed=parseInt(time/speed);
                        console.log("speed",speed);

                        clearInterval(timer);
                        timer = setInterval(function () {
                            var currentTime=_audio.currentTime;
                            $(".now-time").html(changeTime(currentTime));


                            if(parseInt(currentTime)%timeSpeed==0){
                                    $(".bar").html('<span class="progress">=</span>'+$(".bar").html());
                            }
                        },1000);
                    };
                },
                error:function(){
                    util.loading.hide();
                    util.error();
                }
            });
        }
        $("#music_player").bind('ended',function () {
            clearInterval(timer);
            $(".music-icon").html("");
        });
        function changeTime(time){

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

            return minutes+":"+seconds;
        }
    }
});