define(["jquery","util/util","util/command-interpreter"], function($,util){
    return function(container,param){

        var commandCache=[];
        var commandIndex=-1;

        $(window).keydown(function (event) {

            var e = event || window.event || arguments.callee.caller.arguments[0];

            // console.log("index",commandIndex);
            //上，恢复命令
            if(e && e.keyCode==38){
                if (commandIndex>0){
                    commandIndex--;
                    var command=commandCache[commandIndex];
                    $(".command-input").val(command);
                }

            }

            //下一条命令
            if(e && e.keyCode==40){
                console.log("index",commandIndex);
                if (commandCache.length>0&&commandIndex>=0&&commandIndex<commandCache.length){
                    commandIndex++;
                    var command=commandCache[commandIndex];
                    $(".command-input").val(command);
                }

            }

            if(e && e.keyCode==13){//回车
                var command=$(".command-input").val();
                $(".tips").html("");
                if (command){
                    $(".tips").html("");
                    commandCache.push(command);
                    commandIndex=commandCache.length;
                    if (testRegx(command)){
                        //根据关键字查询
                        var params=getCommandParam(command);

                        if(params.commandType==param){
                            console.log(params);
                            window.location.hash="/command-search/"+params.commandParams;
                        }else {
                            $(".tips").html("<p>The command :\""+command+"\" is wrong ,usage:cloudmusic -"+param+" [params]</p>");
                        }
                    }else {
                        $(".tips").html("<p>The command:\""+command+"\" not found,please try again!</p>");
                    }
                    $(".command-input").val("");
                }
            }
        });
    }
});