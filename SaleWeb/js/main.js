//SaleWeb JavaScript document

//如何在一个网站或者一个页面中书写你的JS代码

//1.JS的分层(功能):jQuery(tools)  组件(UI) 应用(app)  MVC(backboneJS)
//2.JS的规划(管理):避免全局变量的方法(命名空间,闭包,面向对象),模块化(seaJs,requireJS)

window.onload = function(){
	mv.app.toTip();
	mv.app.toBanner();
	mv.app.toSel();
	mv.app.toRun();
}


var mv = {};//命名空间

mv.tools = {};


mv.tools.getByClass = function(oParent,sClass){
	var aEle = oParent.getElementsByTagName('*');
	var arr =[];
	
	for(var i=0;i<aEle.length;i++){
		if(aEle[i].className == sClass){
			arr.push(aEle[i]);
		}
	}
	return arr;
}
mv.tools.getStyle = function(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

//通用组件层
mv.ui = {};

//内容改变默认显示框架
mv.ui.textChange = function(obj,str){
	obj.onfocus = function(){
		if(this.value == str){
			this.value = '';
		}
	}
	
	obj.onblur = function(){
		if(this.value == ''){
			this.value = str
		}
	}
}

//颜色淡入函数框架
mv.ui.fadeIn = function(obj){
	var iCur = mv.tools.getStyle(obj,'opacity');
	if(iCur==1){ return false; }
	
	var value = 0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = 5;
		if(value == 100){
			clearInterval(obj.timer);
		}else{
			value += iSpeed;
			obj.style.opacity = value/100;
			obj.style.filter = 'alpha(opacity ='+ value +')';
		}
	},30)
}

//颜色淡出函数框架
mv.ui.fadeOut = function(obj){
	var iCur = mv.tools.getStyle(obj,'opacity');
	if(iCur==0){ return false; }
	
	var value = 100;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var iSpeed = -5;
		if(value == 0){
			clearInterval(obj.timer);
		}else{
			value += iSpeed;
			obj.style.opacity = value/100;
			obj.style.filter = 'alpha(opacity ='+ value +')';
		}
	},30)
}

//div左移动函数框架
mv.ui.moveLeft = function(obj,old,now){
	
	clearInterval(obj.timer);
	
	obj.timer = setInterval(function(){
		
		var iSpeed = (now-old)/10;
		iSpeed = iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
		
		if(now == old){
			clearInterval(obj.timer);
		}else{
			old += iSpeed;
			obj.style.left = old + 'px';
		}
		
	},30)
}




//应用层
mv.app = {};

//搜索框默认内容改变
mv.app.toTip = function(){
	var oText1 = document.getElementById('text1');
	var oText2 = document.getElementById('text2');
	
	mv.ui.textChange(oText1,'Search Website');
	mv.ui.textChange(oText2,'Search Website');
}

//banner颜色淡入淡出
mv.app.toBanner = function (){
	var oAd = document.getElementById('ad');
	var aLi = oAd.getElementsByTagName('li');
	
	var oPrevBg = mv.tools.getByClass(oAd,'prev_bg')[0];
	var oNextBg = mv.tools.getByClass(oAd,'next_bg')[0];
	
	var oPrev = mv.tools.getByClass(oAd,'prev')[0];
	var oNext = mv.tools.getByClass(oAd,'next')[0];
	
	var iNow = 0;
	
	var timer = setInterval(autoNext,3000);
	
	function autoNext(){//图片变换函数
		
		if(iNow == aLi.length-1){
			iNow = 0;
		}else{
			iNow++;
		}
		
		for(var i=0;i<aLi.length;i++){
			mv.ui.fadeOut(aLi[i]);
		}
		mv.ui.fadeIn(aLi[iNow]);
	}
	
	function autoPrev(){//图片变换函数
		
		if(iNow == 0){
			iNow = aLi.length-1;
		}else{
			iNow--;
		}
		
		for(var i=0;i<aLi.length;i++){
			mv.ui.fadeOut(aLi[i]);
		}
		
		mv.ui.fadeIn(aLi[iNow]);
	}
	
	
	oPrevBg.onmouseover = oPrev.onmouseover = function(){
		oPrev.style.display = 'block';
		clearInterval(timer);
	};
	
	oNextBg.onmouseover = oNext.onmouseover = function(){
		oNext.style.display = 'block';
		clearInterval(timer);
	};
	
	oPrevBg.onmouseout = oPrev.onmouseout = function(){
		oPrev.style.display = 'none';
		timer = setInterval(autoNext,3000);
	};
	
	oNextBg.onmouseout = oNext.onmouseout = function(){
		oNext.style.display = 'none';
		timer = setInterval(autoNext,3000);
	};
	
	oPrev.onclick = function(){
		autoPrev();
	};
	
	oNext.onclick = function(){
		autoNext();
	};
}

//下拉列表实现
mv.app.toSel = function (){
	var oSel = document.getElementById('sel1');
	var aDd = oSel.getElementsByTagName('dd');
	var aA = oSel.getElementsByTagName('a');
	var aUl = oSel.getElementsByTagName('ul');
	var aH2 = oSel.getElementsByTagName('h2');
	
	
	for(var i=0;i<aDd.length;i++){//点击dd显示列表UL
		aDd[i].index = i;
		aDd[i].onclick = function(ev){
			var ev = ev || window.event;
			var This = this;
			
			for(var i=0;i<aUl.length;i++){
				aUl[i].style.display = 'none';
			}

			aUl[this.index].style.display = 'block';
				
			document.onclick = function(){
				aUl[This.index].style.display = 'none';
			}

			ev.cancelBubble = true;
		}
	}
	
	for(var i=0;i<aUl.length;i++){//点击li隐藏ul和把li的内容添加到h2中
		aUl[i].index = i;
		
		(function(ul){//闭包写法
			var aLi = ul.getElementsByTagName('li');
			
			for(var i=0;i<aLi.length;i++){
				aLi[i].onmouseover = function(){
					this.className = 'active';
				}
				aLi[i].onmouseout = function(){
					this.className = '';
				}
				aLi[i].onclick = function(ev){
					var ev = ev || window.evrnt;
					aH2[this.parentNode.index].innerHTML = this.innerHTML;
					
					ev.cancelBubble = true;
					this.parentNode.style.display = 'none'
				}
			}
		})(aUl[i])
	}
}


//图片轮播函数
mv.app.toRun = function(){
	var oRun = document.getElementById('run1');
	var oUl = oRun.getElementsByTagName('ul')[0];
	var aLi = oUl.getElementsByTagName('li');
	
	var oPrev = document.getElementById('scroll_prev');
	var oNext = mv.tools.getByClass(oRun,'next')[0];
	
	var iNow = 0;
	
	oUl.innerHTML += oUl.innerHTML;
	oUl.style.width = aLi.length * aLi[0].offsetWidth + 'px';
	
	oPrev.onclick = function(){
		if(iNow == 0){
			iNow = aLi.length/2;
			oUl.style.left = -oUl.offsetWidth + 'px';
		}
		mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,-(iNow-1)*aLi[0].offsetWidth)
		iNow--;
	}
	
	oNext.onclick = function(){
		
		if(iNow == aLi.length/2){
			iNow = 0;
			oUl.style.left = 0;
		}
		mv.ui.moveLeft(oUl,-iNow*aLi[0].offsetWidth,-(iNow+1)*aLi[0].offsetWidth);
		iNow++;
		
	}
}
