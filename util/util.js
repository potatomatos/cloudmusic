define(["jquery"], function($){
    return{
        loading:{
            show:function () {
                $(".loading .normal").show();
            },
            hide:function () {
                $(".loading>p").hide();
            }
        },
        error:function(){
            $(".loading .error").show();
        },
        arrayPage:function(arr,page){
            var newArr=[];
            var size=10;
            var length=(page-1)*size+size;
            var begin=(page-1)*size;

            if(length>arr.length){
                length=arr.length;
            }

            var index=0;
            for(var i=begin;i<length;i++){
                newArr[index++]=arr[i];
            }
            return newArr;
        }
    }
});