# easy-template
  这是我学习编译原理时，自己写的JS模版引擎，为什么写模版引擎呢？因为我看别人的源码，也才三四百行代码，啃起来，也比较容易，所以选择这个，用来练手。在开发的过程中，研究了别人优秀的源码，如：  
    颜海镜大神的模版引擎(百度知道，58金融在使用)  
    腾讯的Art(应该用了Webpack，我看变量名都是简写，啃起来难)  
  借鉴了别人的博客，如:  
    20行代码实现JavaScript模板引擎：https://blog.csdn.net/weixin_33935777/article/details/91431900，  
    最简单的JavaScript模板引擎：https://www.cnblogs.com/dolphinX/p/3489269.html  
  使用方法:  
    见index.html  
  学习收获：通过啃源码，让我学会了UMD规范，整个模版引擎的使用过程(啃源码的过程中，我起码写了上百个console.log)，模版引擎的原理为：把模版编译成一个方法，再把数据放进方法里，即可生成HTML，就这么简单。也学会了JS的冷门方法，try，catch，这种我都是写后台才用到，with方法，eval方法(以前，看JS大犀牛的时候，认为性能差，并且安全差，所以实际项目开发中，从来不用。没想到在这里竟然能用上)，在模版编译成方法的过程中，也涉及到编译原理的基础吧，建议程序员，一定要看编译原理这本书。  
  使用技巧：
  ```html
    <script id="tpl" type="text/html">
	<%=data.newsTpl%><br/><br/>
	<%for(i = 0; i < data.list.length; i++) {%>
		<%=list[i].title%><br/>
		<%=list[i].content%><br/>
		<%=list[i].desc%><br/>
	<%}%>
      <%if ('1') {
        console.log("123")
      }%>
    </script>
```
```js
	<script>
		let data = {
			newsTpl: "hello world",
			list: [{
					title: '这是我的第一条数据',
					content: '乌拉'
				},
				{
					title: '这是我的第二条数据',
					content: '呀哈'
				},
				{
					title: '这是我的第三条数据',
					content: '斯巴达'
				},
			]
		}
		var html = template.init(document.getElementById('tpl').innerHTML, data);
		document.getElementById('wp').innerHTML = html;
	</script>
	```
    注意：
      data变量必须是对象。
      在循环中，forEach不能使用。
      在if判断中，里面不能写代码，会被直接编译成字符串。
