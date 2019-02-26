define(["jquery","util/util","util/music-list"], function($,util,listTool){
    return function(container,param){
        var index=1;
        get_search_result(index);

        //查询
        function get_search_result(page) {
            util.loading.show();
            $.ajax({
                type: "post",
                url: "/cloudmusic/api.php?action=music_search",
                dataType:"json",
                data: {
                    word: param,
                    page:page-1,
                    size:10
                },
                success: function (data) {
                    util.loading.hide();
                    console.log("result",data);
                    if(data.code!=200){
                        util.error();
                    }else {
                        var obj={};
                        obj.total=data.result.songCount;
                        obj.page=page;
                        obj.wrap=".music-list";
                        obj.list=[];
                        var list=data.result.songs;
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
                            get_search_result(page);
                        };
                        listTool.pageSelect(obj);
                    }

                },
                error:function(){
                    util.loading.hide();
                    util.error();
                }
            });
        }
    }
});