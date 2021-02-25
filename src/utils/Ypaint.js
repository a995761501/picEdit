(function(){
	CONST = {
        edgeLen: 25,
        angle: 15
    };
    const ID = function(id) {
        return document.getElementById(id);
    };
    params = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        currentX: 0,
        currentY: 0,
        flag: false,
        kind: "drag"
    }
    let getCss = function(o, key) {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
    };
    let img
    const wheelEvents = function(){
        let userAgent = navigator.userAgent;  // 取得浏览器的userAgent字符串
        if(userAgent.indexOf("Firefox") > -1){
            return "DOMMouseScroll"
        }else{
            return "mousewheel"
        }
    }
    function Ypaint(){
		this.init = function(canvas,file){
			this.outerParams= {
				rect:{},
				circle:{},
				line:{},
                arrow:{},
            }
            this.YpaintFile = '1'
			this.isLine = false,
            this.isArrow = false,
            this.isRect = false,
            this.isCircle = false,
            this.drag = false,
            this.textFlag = false
            this.textBox = document.getElementById("textBox")
            this.textContent = ""
            this.flag = false
            this.masaike = false

            this.x = 0
            this.y = 0
            this.scaleX = 1,
            this.scaleY = 1,
			this.lock = false; //鼠标是否在被拖动
			this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d'); //canvas对象
            this.w = this.canvas.width; //画布的宽
        	this.h = this.canvas.height; //画布的高  	
        	this.touch = ("createTouch" in document); //判定是否为手持设备
            this.StartEvent = this.touch ? "touchstart" : "mousedown";
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.Wheel = 'mousewheel'
            this.r = 30
            this.ax = 30
            this.ay = 30
            this.num = 1
            this.angle = 0
            this.clickDrag = [];
            this.lineX = [];
            this.lineY = [];
            this.beginPoint = {};
            this.stopPoint = {}; 
            this.storage = {};
            this.rect = {}; //
            this.polygonVertex = [];
            this.status = {
                lineArr: [],
                arrowArr: [],
                circleArr: [],
                rectArr: [],
                textArr: [],
                saike:[],
            };
            this.leftMargin = 0
            this.topMargin = 0
            this.bind()
		}
        this.chooseRect = function(){
            this.isLine = false;
            this.isArrow = false;
            this.isRect = true;
            this.isCircle = false;
            this.drag = false
            this.textFlag = false
            this.masaike = false
        }
        this.chooseCircle = function(){
            this.isLine = false;
            this.isArrow = false;
            this.isRect = false;
            this.isCircle = true;
            this.drag = false
            this.textFlag = false
            this.masaike = false

        }
        this.chooseLine = function(){
            this.isLine = true;
            this.isArrow = false;
            this.isRect = false;
            this.isCircle = false;
            this.textFlag = false
            this.masaike = false
            this.drag = false
        }
        this.chooseArrow = function(){
            this.isLine = false;
            this.isArrow = true;
            this.isRect = false;
            this.isCircle = false;
            this.textFlag = false
            this.textFlag = false
            this.masaike = false
            this.drag = false
        }
        this.edit = function(){
            this.isLine = false;
            this.isArrow = false;
            this.isRect = false;
            this.isCircle = false;
            this.textFlag = false
            this.textFlag = true
            this.masaike = false
            this.drag = false
        }
        this.zoomIn = function(){
            var t = this
            t.isLine = false;
            t.isArrow = false;
            t.isRect = false;
            t.masaike = false
            t.isCircle = false;
            t.drag = true
            if(t.scaleX > 1.5) return
            if(t.angle == 360 || (t.angle % 90) != 0) t.angle = 0
            t.scaleX = t.scaleX += 0.1
            t.scaleY = t.scaleY += 0.1
            t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ')'
        }
        this.masaiked = function(){
            this.isLine = false;
            this.isArrow = false;
            this.isRect = false;
            this.isCircle = false;
            this.textFlag = false
            this.textFlag = false
            this.masaike = true
            this.drag = false
        }
        this.zoomOut = function(){
            var t = this
            t.isLine = false;
            t.isArrow = false;
            t.isRect = false;
            t.masaike = false
            t.isCircle = false;
            t.drag = true
            if(t.scaleX < 0.7) return
            if(t.angle == 360 || (t.angle % 90) != 0) t.angle = 0
            t.scaleX = t.scaleX -= 0.1 
            t.scaleY = t.scaleY -= 0.1
            t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ')'
        }
        this.refreshRight = function(){
            var t = this
            if(t.angle == 360 || (t.angle % 90) != 0) t.angle = 0
            t.angle += 90
            t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ')'
        }
        this.refreshLeft = function(){
            var t = this
            if(t.angle == 0 || (t.angle % 90) != 0) t.angle = 360
            t.angle -= 90
            t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ')'
        }
		this.bind = function(){
			var t = this;
			this.canvas['on' + t.StartEvent] = function(e) {
				var touch = t.touch ? e.touches[0] : e;
                //记录点击的坐标点
                t.lock = true;
                var _x = touch.offsetX;
                var _y = touch.offsetY;
                if(t.isRect){
                	t.rect.x = _x;
	            	t.rect.y = _y;
                } else if (t.isCircle) {
                    t.storage.x = _x;
                    t.storage.y = _y;
                } else if (t.isLine) {
                    t.movePoint(_x, _y);
                    t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.outerParams.line.lineWidth, t.outerParams.line.color);
                } else if(t.masaike){
                    t.movePoint(_x, _y);
                    t.drawmasaike(t.lineX, t.lineY, t.clickDrag, t.outerParams.line.lineWidth, t.outerParams.line.color);
                } else if (t.isArrow) {
                    t.beginPoint.x = _x;
                    t.beginPoint.y = _y;
                } else if(t.drag) {
                    // console.log(touch.clientX);
                } else if(t.textFlag){
                    // let leftMargin = 0
                    // let topMargin = 0
                    // if(!t.flag){
                    //     var leftMargin = _x
                    //     var topMargin = _y
                    // }
                    
                    if(!t.flag){
                        if(t.textBox.value != ''){
                            // t.flag = true
                            t.textContent = t.textBox.value;
                        // t.flag = false;
                        t.textBox.style['z-index'] = 0;
                        t.textBox.value = "";
                        // 设置画笔的颜色和大小
                        t.ctx.fillStyle = t.outerParams.rect.color;
                        t.ctx.strokeStyle = "blue"; // 画笔的颜色
                        t.ctx.lineWidth = 5; // 指定描边线的宽度
                        t.ctx.save();
                        t.ctx.beginPath();
                        // 写字
                        t.ctx.font = "16px 微软雅黑";
                        // console.log(t.textContent);
                        var result = t.breakLinesForCanvas(t.textContent,
                            300, '16px 微软雅黑');
                        console.log(result);
                        result.forEach(function(line, index) {
                            // context.fillText(line, 100, lineHeight * index + 30);
                            t.status.textArr.push({textContent:line,leftX:parseInt(t.leftMargin),rightY:parseInt(t.topMargin + 20 + (30 * index +30))})
                            t.ctx.fillText(line, parseInt(t.leftMargin), parseInt(t.topMargin + 20 + (30 * index +30)));
                        });
                        t.ctx.restore();
                        t.ctx.closePath();
                        }
                        // console.log(touch);
                        t.topMargin = _y
                        t.leftMargin = _x
                        t.textBox.style.left = touch.pageX + 'px';
                        t.textBox.style.top = touch.pageY + 'px';
                        // t.textBox.style.left = _x + 'px';
                        // t.textBox.style.top = _y + 'px';
                        t.textBox.style['z-index'] = 6;
                        t.textBox.style.borderColor = 'red';
                    }
                }
			}

			this.canvas['on' + t.MoveEvent] = function(e) {
				if(t.lock){
					if(t.isRect){
						t.rect.width = Math.abs(t.rect.x - e.offsetX)
			            t.rect.height = Math.abs(t.rect.y - e.offsetY)
			            if (t.rect.x > e.offsetX) {
			                t.rect.realX = e.offsetX
			            } else {
			                t.rect.realX = t.rect.x
			            }
			            if (t.rect.y > e.offsetY) {
			                t.rect.realY = e.offsetY
			            } else {
			                t.rect.realY = t.rect.y
			            }
                        t.clear();
                        t.creatImage()
			            t.redrawAll();
			            t.drawRect(t.rect.realX, t.rect.realY, t.rect.width, t.rect.height, t.outerParams.rect.radius, t.outerParams.rect.color,t.outerParams.rect.lineWidth);
					} else if (t.isCircle) {
                        if (t.storage.x > e.offsetX) {
                            var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
                        } else {
                            var pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
                        }
                        if (t.storage.y > e.offsetY) {
                            var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
                        } else {
                            var pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
                        }
                        var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
                        var lineY = Math.abs(t.storage.y - e.offsetY) / 2
                        t.clear();
                        t.creatImage()
                        t.redrawAll();
                        t.drawEllipse(pointX, pointY, lineX, lineY, t.outerParams.circle.lineWidth ,t.outerParams.circle.color);
                    } else if (t.isLine) {
                        t.movePoint(e.offsetX, e.offsetY, true);
                        t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.lineWidth, t.outerParams.line.color);
                    } else if(t.masaike){
                        t.movePoint(e.offsetX, e.offsetY, true);
                        t.drawmasaike(t.lineX, t.lineY, t.clickDrag, t.lineWidth, t.outerParams.line.color);
                    } else if (t.isArrow) {
                        t.stopPoint.x = e.offsetX;
                        t.stopPoint.y = e.offsetY;
                        t.clear();
                        t.creatImage()
                        t.redrawAll();
                        t.arrowCoord(t.beginPoint, t.stopPoint, t.outerParams.arrow.range);
                        t.sideCoord();
                        t.drawArrow(t.outerParams.arrow.color);
                    } else if(t.drag){
                        // console.log('拖动停止');
                        t.drawPaint(e)
                    }
				}
			}

			this.canvas['on' + t.EndEvent] = function(e) {
				if(t.isRect){
					t.status.rectArr.push({ realX: t.rect.realX, realY: t.rect.realY, width: t.rect.width, height: t.rect.height, radius: t.outerParams.rect.radius, color: t.outerParams.rect.color, lineWidth: t.outerParams.rect.lineWidth});
					t.rect = {};
				}else if (t.isCircle) {
                    if (t.storage.x > e.offsetX) {
                        var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
                    } else {
                        var pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
                    }
                    if (t.storage.y > e.offsetY) {
                        var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
                    } else {
                        var pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
                    }
                    var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
                    var lineY = Math.abs(t.storage.y - e.offsetY) / 2;
                    t.status.circleArr.push({ x: pointX, y: pointY, a: lineX, b: lineY, color: t.outerParams.circle.color, lineWidth: t.outerParams.circle.lineWidth});
                    t.storage = {};
                } else if (t.isLine) {
                    t.status.lineArr.push({ x: t.lineX, y: t.lineY, clickDrag: t.clickDrag, lineWidth: t.outerParams.line.lineWidth, color: t.outerParams.line.color})
                    t.lineX = [];
                    t.lineY = [];
                    t.clickDrag = [];
                } else if(t.masaike){
                    t.status.saike.push({ x: t.lineX, y: t.lineY, clickDrag: t.clickDrag, lineWidth: t.outerParams.line.lineWidth, color: t.outerParams.line.color})
                    t.lineX = [];
                    t.lineY = [];
                    t.clickDrag = [];
                } else if (t.drawArrow) {
                    var tempObj = {
                        beginPoint: t.beginPoint,
                        stopPoint: { x: e.offsetX, y: e.offsetY },
                        range: t.outerParams.arrow.range,
                        color: t.outerParams.arrow.color
                    }
                    t.status.arrowArr.push(tempObj);
                    t.beginPoint = {};
                } 
				t.lock = false;
            }
            let wheel = "mousewheel"
            let userAgent = navigator.userAgent;  // 取得浏览器的userAgent字符串
            if(userAgent.indexOf("Firefox") > -1){
                wheel  =  "DOMMouseScroll"
            }else{
                wheel =  "mousewheel"
            }
            if(wheel == "DOMMouseScroll"){
                this.canvas.addEventListener("DOMMouseScroll",e => {
                    if(e.detail > 0){
                        if(t.scaleX > 1.5) return
                        if(t.angle == 0 || (t.angle % 90) != 0) t.angle = 0
                        t.scaleX += 0.1
                        t.scaleY += 0.1
                        t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ') '
                    }else{
                        if(t.scaleX < 0.7) return
                        if(t.angle == 0 || (t.angle % 90) != 0) t.angle = 0
                        t.scaleX -= 0.1
                        t.scaleY -= 0.1
                        t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ') '
                    }
                })
            }else{
                this.canvas['on' + wheel] = function(e){
                    if(e.wheelDelta > 0){
                        if(t.scaleX > 1.5) return
                        if(t.angle == 0 || (t.angle % 90) != 0) t.angle = 0
                        t.scaleX += 0.1
                        t.scaleY += 0.1
                        t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ') '
                    }else{
                        if(t.scaleX < 0.7) return
                        if(t.angle == 0 || (t.angle % 90) != 0) t.angle = 0
                        t.scaleX -= 0.1
                        t.scaleY -= 0.1
                        t.canvas.style.transform = 'rotate(' + t.angle + 'deg) scale(' + t.scaleX,t.scaleY + ') '
                    }
                }
            }
        }
        //寻找切换断点
        this.findBreakPoint =  function (text, width, context) {
            var min = 0;
            var max = text.length - 1;
            while (min <= max) {
                var middle = Math.floor((min + max) / 2);
                var middleWidth = context.measureText(text.substr(0, middle)).width;
                var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
                if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
                    return middle;
                }
                if (middleWidth < width) {
                    min = middle + 1;
                } else {
                    max = middle - 1;
                }
            }
 
            return -1;
        }
        this.breakLinesForCanvas = function (text, width, font) {
            var canvas = document.getElementById('drawCanvas');
            var context = canvas.getContext('2d');
            var result = [];
            var breakPoint = 0;
 
            if (font) {
                context.font = font;
            }
            result = text.split("\n");
            let textString = text.replace("\n",'')
            if(result.length > 0){
                result.forEach(item => {
                    // console.log(item);
                    textString = textString.replace(item,'');
                })
            }
            text = textString 
            if(text !== ''){
                while ((breakPoint = this.findBreakPoint(text, width, context)) !== -1) {
                    result.push(text.substr(0, breakPoint));
                    text = text.substr(breakPoint);
                    
                }
                if (text) {
                    result.push(text);
                }
            }
            return result;
        }
        this.drawPaint = function(e){
            let tem_imgx = this.x + e.movementX
            let tem_imgy = this.y + e.movementY
            this.clear()
            // this.ctx.clearRect(this.x,this.y,this.w,this.h)
            this.x = tem_imgx
            this.y = tem_imgy
            this.creatImage()
            // this.redrawAll()
            this.canvas.style.backgroundImage = ""
            // this.redrawAll()
        }
        this.movePoint = function(x, y) {
            this.lineX.push(x);
            this.lineY.push(y);
            this.clickDrag.push(y);
        },
        this.drawPoint = function(x, y, clickDrag, lineWidth, color) {
            for (var i = 0; i < x.length; i++) //循环数组
            {
                this.ctx.beginPath();
                if (clickDrag[i] && i) {
                    this.ctx.moveTo(x[i - 1], y[i - 1]);
                } else {
                    this.ctx.moveTo(x[i] - 1, y[i]);
                }
                
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = color;
                this.ctx.lineTo(x[i], y[i]);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        },
        this.drawmasaike = function(x, y, clickDrag, lineWidth, color) {
            for (var i = 0; i < x.length; i++) //循环数组
            {
                this.ctx.beginPath();
                if (clickDrag[i] && i) {
                    this.ctx.moveTo(x[i - 1], y[i - 1]);
                } else {
                    this.ctx.moveTo(x[i] - 1, y[i]);
                }
                
                this.ctx.lineWidth = 10;
                this.ctx.strokeStyle = 'rgba(112,128,144,0.5)';
                this.ctx.lineTo(x[i], y[i]);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        },
        this.getRadian = function(beginPoint, stopPoint) {
            this.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
        },
        this.arrowCoord = function(beginPoint, stopPoint, range) {
            this.polygonVertex[0] = beginPoint.x;
            this.polygonVertex[1] = beginPoint.y;
            this.polygonVertex[6] = stopPoint.x;
            this.polygonVertex[7] = stopPoint.y;
            this.getRadian(beginPoint, stopPoint);
            this.polygonVertex[8] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle + range));
            this.polygonVertex[9] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle + range));
            this.polygonVertex[4] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle - range));
            this.polygonVertex[5] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle - range));
        },
        this.sideCoord = function() {
            var midpoint = {};
            midpoint.x = (this.polygonVertex[4] + this.polygonVertex[8]) / 2;
            midpoint.y = (this.polygonVertex[5] + this.polygonVertex[9]) / 2;
            this.polygonVertex[2] = (this.polygonVertex[4] + midpoint.x) / 2;
            this.polygonVertex[3] = (this.polygonVertex[5] + midpoint.y) / 2;
            this.polygonVertex[10] = (this.polygonVertex[8] + midpoint.x) / 2;
            this.polygonVertex[11] = (this.polygonVertex[9] + midpoint.y) / 2;
        },
        this.drawArrow = function(color) {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(this.polygonVertex[0], this.polygonVertex[1]);
            this.ctx.lineTo(this.polygonVertex[2], this.polygonVertex[3]);
            this.ctx.lineTo(this.polygonVertex[4], this.polygonVertex[5]);
            this.ctx.lineTo(this.polygonVertex[6], this.polygonVertex[7]);
            this.ctx.lineTo(this.polygonVertex[8], this.polygonVertex[9]);
            this.ctx.lineTo(this.polygonVertex[10], this.polygonVertex[11]);
            this.ctx.closePath();
            this.ctx.fill();
        },
		this.createRect = function(x, y, width, height, radius, color, type ,lineWidth) { //绘制圆
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + radius);
            this.ctx.lineTo(x, y + height - radius);
            this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
            this.ctx.lineTo(x + width - radius, y + height);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);                                                                                                                              
            this.ctx.lineTo(x + width, y + radius);
            this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
            this.ctx.lineTo(x + radius, y);
            this.ctx.quadraticCurveTo(x, y, x, y + radius);
            this.ctx[type + 'Style'] = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.closePath();
            this.ctx[type]();
        },
        this.drawRect = function(realX, realY, width, height, radius, color, lineWidth){
            this.createRect(realX, realY, width, height, radius, color, 'stroke', lineWidth)
        }
        this.drawEllipse = function(x, y, a, b, lineWidth, color) {
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = 'rgba(0,0,0,0)';
            this.ctx.strokeStyle = color;
            this.ctx.fill();
            this.ctx.stroke();
        },
        this.clear = function(){
            this.ctx.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点
            this.creatImage()
        }
        this.redrawAll = function(){
        	var t = this;
        	if (this.status.rectArr.length > 0) {
                this.status.rectArr.forEach(function(val) {
                    t.drawRect(val.realX, val.realY, val.width, val.height, val.radius, val.color, val.lineWidth)
                })
            }
            if (this.status.circleArr.length > 0) {
                this.status.circleArr.forEach(function(val) {
                    t.drawEllipse(val.x, val.y, val.a, val.b, val.lineWidth, val.color)
                })

            }
            if (this.status.lineArr.length > 0) {
                this.status.lineArr.forEach(function(val, index) {
                    t.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth, val.color);
                })
            }
            if (this.status.saike.length > 0) {
                this.status.saike.forEach(function(val, index) {
                    t.drawmasaike(val.x, val.y, val.clickDrag, val.lineWidth, val.color);
                })
            }
            if (this.status.arrowArr.length > 0) {
                this.status.arrowArr.forEach(function(val, index) {
                    if (val.beginPoint != {}) {
                        t.arrowCoord(val.beginPoint, val.stopPoint, val.range);
                        t.sideCoord();
                        t.drawArrow(val.color);
                    }
                })
            }
            if(this.status.textArr.length > 0){
                this.status.textArr.forEach(val => {
                    t.drawText(val.textContent, val.leftX, val.rightY);
                })
            }
        }
        // 绘制文字
        this.drawText = function(context,x,y){
            var t = this
            t.ctx.fillStyle =t.outerParams.rect.color; // 填充颜色为红色
            t.ctx.strokeStyle = "blue"; // 画笔的颜色
            t.ctx.lineWidth = 5; // 指定描边线的宽度
            t.ctx.save();
            t.ctx.beginPath();
            // 写字
            t.ctx.font = "16px 微软雅黑";
            t.ctx.fillText(context, x, y);
            t.ctx.restore();
            t.ctx.closePath();
        }
        this.creatImage = function(){
            const image = new Image();
            image.setAttribute("crossOrigin", "anonymous");
            image.src = this.YpaintFile;
            this.ctx.drawImage(image,this.x,this.y,this.w,this.h,)
        }
        // 裁剪完成
        this.check = function(){
            this.status.rectArr = []
            this.status.circleArr = []
            this.status.lineArr = []
            this.status.arrowArr = []
            this.status.textArr = []
            var tx = this.canvas.offsetLeft + (this.w - img.width) / 2;
            var ty = this.canvas.offsetTop + (this.h - img.height) / 2;
            var x = parseInt(ID("zxxCropBox").style.left) - tx,
                y = ID("zxxCropBox").offsetTop + ID("zxxCropBox").parentNode.offsetTop - ty,
                w = document.getElementById("cropImageWidth").value,
                h = document.getElementById("cropImageHeight").value;
            this.cropImage(img, x, y, parseInt(w), parseInt(h));
        }
        this.cropImage = function (img, cropPosX, cropPosY, width, height) {
            this.canvas.style.backgroundImage = ""
            var cropContainer = ID("cropContainer");
            cropContainer.parentNode.removeChild(cropContainer);
            // this.ctx.clearRect(0, 0, this.w, this.h);
            this.ctx.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点
            
            //sx,sy 是相对于图片的坐标。巨坑
            // this.x = cropPosX
            // this.y = cropPosY
            // this.w = width
            // this.h = height
            
            
            this.ctx.drawImage(img, cropPosX, cropPosY, width, height, this.w / 2 - width / 2, this.h / 2 - height /2, width, height);
            this.YpaintFile = this.canvas.toDataURL()


            var cancas = document.getElementById("test");
            cancas.width = width;
            cancas.height = height;
            var context = cancas.getContext("2d");
            context.drawImage(img, cropPosX, cropPosY, width, height,0,0,width,height);
            this.YpaintFile = cancas.toDataURL()


            this.ctx.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点

            const image = new Image();
            image.setAttribute("crossOrigin", "anonymous");
            image.src = this.YpaintFile;
            this.canvas.width = width
            this.canvas.height = height
            this.w = width
            this.h = height
            this.x = 0
            this.y = 0
            document.getElementById("drawCanvas").style.backgroundImage = "url('"+image.src+"')";
            // const image = new Image();
            // image.setAttribute("crossOrigin", "anonymous");
            // image.src = this.YpaintFile;
            this.clear()
            this.creatImage()
        }
        // 启动裁剪图片的功能
        this.scissors = function(){
            let oneD = document.getElementsByClassName("charRecordImg")
            let oneDWidth = oneD[0].clientWidth
            let canvasStyleTransfrom = this.canvas.style.transform
            let canvasStyleArray = canvasStyleTransfrom.split(' ')
            let cavasTransformScalc = canvasStyleArray[1].substring(6,9)
            let canvasWidth = this.w * cavasTransformScalc
            let canvasMarginLeft = (oneDWidth - 40 - canvasWidth) / 2    // 向左不能小于
            
            
            img = new Image()
            img.setAttribute("crossOrigin", "anonymous");
            img.src = this.YpaintFile
            var clickFlag = false;

            var iCurWidth = this.w;
            var iCurHeight = this.h;

            var oRelDiv = document.createElement("div");
            oRelDiv.style.position = "absolute";
            oRelDiv.style.width = iCurWidth + "px";
            oRelDiv.style.height = iCurHeight + 30 + "px";
            oRelDiv.style.top = "30px";
            oRelDiv.id = "cropContainer";

            var iOrigWidth = this.w,
                iOrigHeight = this.h;
            var scaleX = iCurWidth / iOrigWidth;
            var scaleY = iCurHeight / iOrigHeight;

            this.canvas.parentNode.insertBefore(oRelDiv, this.canvas);

            //初始化坐标与剪裁高宽
            var cropW = 240,
                cropH = 240;
            var posX = (this.canvas.offsetLeft + this.canvas.width / 2 - cropW / 2),
                posY = this.canvas.offsetTop + this.canvas.height / 2 - cropH / 2;
            var sInnerHtml =
                '<div id="zxxCropBox" style="z-index:2;height:' + cropH + 'px; width:' + cropW + 'px; position:absolute; left:' + posX +
                'px; top:' + posY + 'px; border:1px solid black;">' +
                '<div id="zxxDragBg" style="height:100%; background:white; opacity:0.3; filter:alpha(opacity=30); cursor:move"></div>' +
                '<div id="dragLeftTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:-3px; cursor:nw-resize;"></div>' +
                '<div id="dragLeftBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; bottom:-3px; cursor:sw-resize;"></div>' +
                '<div id="dragRightTop" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:-3px; cursor:ne-resize;"></div>' +
                '<div id="dragRightBot" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; bottom:-3px; cursor:se-resize;"></div>' +
                '<div id="dragTopCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; top:-3px; left:50%; margin-left:-3px; cursor:n-resize;"></div>' +
                '<div id="dragBotCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; bottom:-3px; left:50%; margin-left:-3px; cursor:s-resize;"></div>' +
                '<div id="dragRightCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; right:-3px; top:50%; margin-top:-3px; cursor:e-resize;"></div> ' +
                '<div id="dragLeftCenter" style="position:absolute; width:4px; height:4px; border:1px solid #000; background:white; overflow:hidden; left:-3px; top:50%; margin-top:-3px; cursor:w-resize;"></div>' +
                '</div>' +
                '<input type="hidden" id="cropPosX" value="' + posX / scaleX + '" />' +
                '<input type="hidden" id="cropPosY" value="' + posY / scaleY + '" />' +
                '<input type="hidden" id="cropImageWidth" value="' + cropW / scaleX + '" />' +
                '<input type="hidden" id="cropImageHeight" value="' + cropH / scaleY + '" />';

            oRelDiv.innerHTML = sInnerHtml;

            var startDrag = function(point, target, kind) {
                //point是拉伸点，target是被拉伸的目标，其高度及位置会发生改变
                //此处的target与上面拖拽的target是同一目标，故其params.left,params.top可以共用，也必须共用
                //初始化宽高
                params.width = getCss(target, "width");
                params.height = getCss(target, "height");
                //初始化坐标
                if (getCss(target, "left") !== "auto") {
                    params.left = getCss(target, "left");
                }
                if (getCss(target, "top") !== "auto") {
                    params.top = getCss(target, "top");
                }
                //target是移动对象
                point.onmousedown = function(event) {
                    params.kind = kind;
                    params.flag = true;
                    clickFlag = true;
                    if (!event) {
                        event = window.event;
                    }
                    var e = event;
                    params.currentX = e.clientX;
                    params.currentY = e.clientY;
                    //防止IE文字选中，有助于拖拽平滑
                    // point.onselectstart = function() {
                    //     return false;
                    // };

                    document.onmousemove = function(event) {
                        let e = event ? event : window.event;
                        clickFlag = false;
                        // document.getElementById("zxxCropBox").style.left.split('px')[0] > canvasMarginLeft &&
                        if ( params.flag) {
                            var nowX = e.clientX,
                                nowY = e.clientY;
                            var disX = nowX - params.currentX,
                                disY = nowY - params.currentY;
                            if (params.kind === "n") {
                                //上拉伸
                                //高度增加或减小，位置上下移动
                                target.style.top = parseInt(params.top) + disY + "px";
                                target.style.height = parseInt(params.height) - disY + "px";
                            } else if (params.kind === "w") { //左拉伸
                                target.style.left = parseInt(params.left) + disX + "px";
                                target.style.width = parseInt(params.width) - disX + "px";
                            } else if (params.kind === "e") { //右拉伸
                                target.style.width = parseInt(params.width) + disX + "px";
                            } else if (params.kind === "s") { //下拉伸
                                target.style.height = parseInt(params.height) + disY + "px";
                            } else if (params.kind === "nw") { //左上拉伸
                                target.style.left = parseInt(params.left) + disX + "px";
                                target.style.width = parseInt(params.width) - disX + "px";
                                target.style.top = parseInt(params.top) + disY + "px";
                                target.style.height = parseInt(params.height) - disY + "px";
                            } else if (params.kind === "ne") { //右上拉伸
                                target.style.top = parseInt(params.top) + disY + "px";
                                target.style.height = parseInt(params.height) - disY + "px";
                                target.style.width = parseInt(params.width) + disX + "px";
                            } else if (params.kind === "sw") { //左下拉伸
                                target.style.left = parseInt(params.left) + disX + "px";
                                target.style.width = parseInt(params.width) - disX + "px";
                                target.style.height = parseInt(params.height) + disY + "px";
                            } else if (params.kind === "se") { //右下拉伸
                                target.style.width = parseInt(params.width) + disX + "px";
                                target.style.height = parseInt(params.height) + disY + "px";
                            } else { //移动
                                target.style.left = parseInt(params.left) + disX + "px";
                                target.style.top = parseInt(params.top) + disY + "px";
                            }
                        }
                        // else {
                        //     document.getElementById("zxxCropBox").style.left = canvasMarginLeft + 10 + 'px'
                        // }
                        document.onmouseup = function() {
                            params.flag = false;
                            if (getCss(target, "left") !== "auto") {
                                params.left = getCss(target, "left");
                            }
                            if (getCss(target, "top") !== "auto") {
                                params.top = getCss(target, "top");
                            }
                            params.width = getCss(target, "width");
                            params.height = getCss(target, "height");

                            //给隐藏文本框赋值
                            posX = parseInt(target.style.left);
                            posY = parseInt(target.style.top);
                            cropW = parseInt(target.style.width);
                            cropH = parseInt(target.style.height);
                            if (posX < 0) {
                                posX = 0;
                            }
                            if (posY < 0) {
                                posY = 0;
                            }
                            if ((posX + cropW) > iCurWidth) {
                                cropW = iCurWidth - posX;
                            }
                            if ((posY + cropH) > iCurHeight) {
                                cropH = iCurHeight - posY;
                            }
                            // 赋值
                            ID("cropPosX").value = posX;
                            ID("cropPosY").value = posY;
                            ID("cropImageWidth").value = parseInt(ID("zxxCropBox").style.width) == null ? '' : parseInt(ID("zxxCropBox").style.width);
                            ID("cropImageHeight").value = parseInt(ID("zxxCropBox").style.height);
                        };
                    }
                };
			}


            //绑定拖拽
            startDrag(ID("zxxDragBg"), ID("zxxCropBox"), "drag");
            //绑定拉伸
            startDrag(ID("dragLeftTop"), ID("zxxCropBox"), "nw");
            startDrag(ID("dragLeftBot"), ID("zxxCropBox"), "sw");
            startDrag(ID("dragRightTop"), ID("zxxCropBox"), "ne");
            startDrag(ID("dragRightBot"), ID("zxxCropBox"), "se");
            startDrag(ID("dragTopCenter"), ID("zxxCropBox"), "n");
            startDrag(ID("dragBotCenter"), ID("zxxCropBox"), "s");
            startDrag(ID("dragRightCenter"), ID("zxxCropBox"), "e");
            startDrag(ID("dragLeftCenter"), ID("zxxCropBox"), "w");


            //图片不能被选中，目的在于使拖拽顺滑
            // ID("myCanvas").onselectstart = function() {
            //     return false;
            // };
            // img.onselectstart = function() {
            //     return false;
            // };
        }
	}
	window.Ypaint = function(canvas) {
        var p = new Ypaint();
        p.init(canvas);
        return p;
    };
})()