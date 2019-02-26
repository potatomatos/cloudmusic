define(["jquery", "util/util","util/music-list"], function ($, util,musicTool) {
    return function (container, param) {

        var page=1;
        get_play_list_info(page);

        function get_play_list_info(page) {
            util.loading.show();
            $.ajax({
                type: "get",
                url: "/cloudmusic/api.php",
                dataType: "json",
                data: {
                    action: "get_playlist_info",
                    play_list_id: param
                },
                success: function (data) {
                    util.loading.hide();
                    if(data.code==200){
                        var dataObj=transList(data.result.tracks,page);
                        musicTool.pageSelect(dataObj);
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

        function transList(data,page){
            var obj={};
            obj.total=data.length;
            obj.page=page;
            obj.wrap=".play-list";
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
    }
});