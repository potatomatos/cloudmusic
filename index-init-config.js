/*
 * Copyright (c) 2019. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

//配置路由
require(["jquery","route","template", "util/storage","util/httpPrompt","placeholder","bootstrap","es5shim","html5shiv","json3"],function($,Route,template,storage,_http_error_statues){
	var container = $(".container");


	//扩展模板方法

	var routePathMap = {
		'#/home':{'path':'home/'},//主页
		'#/toplist':{'path':'toplist/'},//排行榜
        '#/musiclist':{'path':'musiclist/',"slashParam":true},
        '#/command':{'path':'command/',"slashParam":true},
        '#/command-search':{'path':'command/search',"slashParam":true},
        '#/guestbook':{'path':'guestbook/'},
        '#/playlist':{'path':'playlist/'},
        '#/playlist-info':{'path':'playlist/playlist-info',"slashParam":true},
        '#/new':{'path':'new/'},
        '#/albumlist-info':{'path':'new/albumlist-info',"slashParam":true},
	};

	var routeDic = createRouteDic(routePathMap, routeHandler);
	Router(routeDic).configure({notfound : redirectToNotFoundPage}).init();
	if(window.location.hash){

	}else{
		window.location.hash = "#/home";
	}
	function routeHandler(param){
		var urlInfo = getUrlInfoFromRoutePathMap(param);
		var fixedUrlPart = urlInfo.url,
			filePath = urlInfo.path,
			direction = urlInfo.direction,
			initFlag = urlInfo.init;


		if(direction){
			container=$(direction);
		}
	    //移除container身上所有代理事件
	    container.off();
		container.find("*").off();
        container.find("*").unbind();
	    //调用empty清楚container内元素，empty方法先移除子元素的数据和事件处理函数，然后移除子元素。防止内存溢出
	    container.empty();

	    $(".loading p").show();
		$.ajax({
			url:"modules/" + filePath + "/index.html",
			contentType:"text/html",
			success:function(page){
                $(".loading p").hide();
                container.html(page);
				require(["modules/" + filePath + "/index"],function(index){
                    index(container, param);
					$('input[placeholder], textarea[placeholder]').placeholder();
					$("input").focus();
					$("input").blur(function(){
						$(this).focus();
					});
				});
			},
			error: redirectToNotFoundPage
		});
	}

	//生成Router的路由表
	function createRouteDic(routePathMap, routeHandler){
		var routeDic = {},
			url = null;
		for(var key in routePathMap){
			url = key.substr(1);
			if(routePathMap[key].slashParam){
				routeDic[url] = {
						'/(.*)':routeHandler
				};
			}else{
				routeDic[url] = routeHandler;
			}
		}
		return routeDic;
	}

	//从routePathMap中找到当前路由所属条目
	function getUrlInfoFromRoutePathMap(param){
		var currentHash = window.location.hash;
		var currentFixedUrlPart = currentHash;
		if(!!param){
			var currentFixedUrlEndIndex = currentHash.indexOf(param) - 1;
			currentFixedUrlPart = currentHash.slice(0,currentFixedUrlEndIndex);
		}
		if(routePathMap[currentFixedUrlPart]){
			return {'url': currentFixedUrlPart, 'path': routePathMap[currentFixedUrlPart].path, 'direction':routePathMap[currentFixedUrlPart].direction};
		}
		return {};
	}

	

	function redirectToNotFoundPage(){
        $(".loading p").hide();
		if(!window.location.hash){
			window.location.hash = "#/home";
			return;
		}
		$.ajax({
			url:"modules/error/error404.html",
			contentType:"text/html",
			success: function(template){
                $(".container").html(template);
			}
		});
	}
});
