require.config( {
	baseUrl: "./",
	paths: {
		//公共路径开始
		bootstrap:"./lib/bootstrap.min",
		dateutil:"./lib/dateutil",//公用日期工具
		route:"./lib/director",//公用路由。。去掉以前内个自己写的路由
		jquery:"./lib/jquery.min",//jquery
		es5shim:"./lib/es5-shim.min",//兼容IE8的一些ECMASCRIPT5的一些方法
		html5shiv:"./lib/html5shiv.min",//兼容HTML5的一些语法
		json3:"./lib/json3.min",
		bs_pagination:"./lib/jquery.bs_pagination",
		webuploader:"./lib/webuploader/webuploader.min",
		webuploader2:"./lib/webuploader2/webuploader",
		template:"./lib/template",
		"datatables.net":"./lib/jquery.dataTables.min",
        "dataTables.bootstrap.min":"./lib/dataTables.bootstrap.min",
		dialog:"./lib/dialog-plus",
		easyResponsiveTabs: "./lib/easyResponsiveTabs",
		kandytabs:"./lib/kandytabs.pack",
		icheck: "./lib/icheck",
		wdatePicker:"./lib/My97DatePicker/WdatePicker",
		popover:"./lib/popover",
		qrcode:"./lib/qrcode",
		jqueryTextChange:"./lib/jquery.splendid.textchange",
		placeholder: "./lib/jquery.placeholder.min",
		core:"js/core"
	},
	shim: {
	      bootstrap: {
	      	deps: ["jquery"]
	      },
	      bs_pagination: {
	      	deps: ["jquery"]
	      },
	      webuploader: {
	      	deps: ["jquery"]
	      },
	      "datatables.net": {
	      	deps: ["jquery"]
	      },
	      "dataTables.bootstrap.min": {
	      	deps: ["jquery", "datatables.net"]
	      },
	      dialog: {
	      	deps: ["jquery"]
	      },
	      icheck: {
	      	deps: ["jquery"]
	      },
	      easyResponsiveTabs :{
	      	deps: ["jquery"]
	      },
		  jqueryTextChange:{
			deps: ["jquery"]
		  },
		  placeholder:{
			deps: ["jquery"]
		  }

    },

	waitSeconds: 15//加载时间为15秒。。。。15秒还加载不到。。可以放弃了
} );