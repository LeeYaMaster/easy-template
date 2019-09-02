class TemplateClass {
	label = {
		startTag: '<%', //开始标签
		endTag: '%>', //结束标签
	};

	//初始化方法
	init(tpl, data) {
		if (typeof tpl !== 'string') {
			return '';
		}
		if (!toString.call(data).slice(8, -1) == "Object") {
			console.error("传入的data必须是对象");
			return;
		}

		return this.compile(tpl)(data);
	}

	compile(tpl, opt) {
		let that = this;
		try {
			console.log("编译阶段")
			//这句话是拿到总的代码(方法)，注意，还没有导入数据
			var RenderFun = this.compiler(tpl, this.label);
			//RenderFun是compiler返回的，把总的代码转换为总的代码方法，注意是方法，不能代码块，这样才能导入数据。
			console.log("编译结束");
		} catch (e) {
			e.name = '编译错误';
			e.tpl = tpl;
			e.render = e.temp;
			delete e.temp;
			return this.handelError(e);
		}

		function render(data) {
			console.log("渲染阶段")
			try {
				//执行总的代码方法，把数据导入进入，返回生成的HTML字符串，搞定！
				var html = RenderFun(data);
				return html;
			} catch (e) {
				e.name = '渲染错误';
				e.tpl = tpl;
				e.render = Render.toString();
				return that.handelError(e)();
			}
		}
		console.log("闭包，准备执行渲染")
		return render;
	}
	//报错输出信息
	handelError(e) {
		var message = 'template.js error\n\n';
		for (var key in e) {
			message += '<' + key + '>\n' + e[key] + '\n\n';
		}
		message += '<message>\n' + e.message + '\n\n';
		console.error(message);
		return 'template.js error:' + message;
	}

	//编译data数据,拿到中心代码。
	parse(tpl, opt) {
		console.log("编译阶段，HTML和JS整合")
		var code = '';
		var startTag = opt.startTag;
		var endTag = opt.endTag;
		var tokens = tpl.split(startTag); //转换为数组
		//根据开始标签和结束标签，对text/html里面的文字，进行拆分
		for (var i = 0, len = tokens.length; i < len; i++) {
			var token = tokens[i].split(endTag);
			//拆分之后，进行js和html编译。
			if (token.length === 1) {
				code += this.parsehtml(token[0]);
			} else {
				code += this.parsejs(token[0], true);
				if (token[1]) {
					code += this.parsehtml(token[1]);
				}
			}
		}
		//编译完成后，返回中心代码，中心代码才是用户写的代码。
		return code;
	}
	//编译HTML
	parsehtml(line) {
		// 单双引号转义，换行符替换为空格
		line = line.replace(/('|")/g, '\\$1').replace(/\n/g, ' ');
		return `;__code__ += ("${line}")\n`;
	}
	//编译JS
	parsejs(line) {
		//去掉"="符号
		if(line.charAt(0)== "="){
			line = line.substr(1);
			let code = `;__code__ += (typeof (${line}) !== "undefined" ? ${line} : "")\n`;
			return code;
		}
		//如果没有"="符号，编译成原生js
		return `;${line}\n`;
	}

	compiler(tpl, opt) {
		console.log("编译阶段开始")
		var mainCode = this.parse(tpl, opt);
		console.log("编译阶段，中心代码与顶部底部组合")
		//中心代码与顶部底部组合，进行拼接，顶部和底部的代码，使用的自调用语法
		//顶部代码，是负责把data导入进中心代码里面
		var headerCode = '\n' +
			'    var html = (function (__data__) {\n' +
			'        var __str__ = "", __code__ = "";\n' +
			'        for(var key in __data__) {\n' +
			'            __str__+=("var " + key + "=__data__[\'" + key + "\'];");\n' +
			'        }\n' +
			'        eval(__str__);\n\n';
		//底部代码是自调用的语法。
		var footerCode = ";return __code__;}(__data__));return html;";
		//中心代码和顶部底部组合完成之后，生成一个总的代码。
		var code = headerCode + mainCode + footerCode;
		code = code.replace(/[\r]/g, ' ');//把\r转义成空字符
		try {
			//把总的代码弄成方法，这样才能在下一步渲染阶段是导入数据。
			var Render = new Function('__data__', code);
			return Render;
		} catch (e) {
			e.temp = code;
			throw e;
		}
	}
	//单例模式，避免多次new，减少性能消耗
	static getInstance() {
		if (!this.instance) {
			this.instance = new TemplateClass();
		}
		return this.instance;
	}

}
//这里试过TemplateClass.getInstance().init，但是这样init里面的this指向为undefined
let template = TemplateClass.getInstance();
//let template = new TemplateClass();
