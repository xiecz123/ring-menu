(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.Pie = factory();
    }
}(this, function () {
    var Pie = function (container, options) {
        container = container || {};
        options = options || {};

        // 默认参数
        var defaults = {
            number: 6,                     //内圈pie的数量    
            //texts: texts,                //内圈pie对应的text文本
            //images: images,              //内圈pie对应的图片
            imgSize: { imgWidth: 20, imgHeight: 20 },                     // 图片宽高
            //outPies: outPies,            //外圈outPie的个数
            //outTexts: outTexts,          //外圈outPie对应的text文本          
            //centerPoint: centerPoint,    // canvas中点坐标
            radius: { innerr: 33, innerR: 99, outerr: 104, outerR: 150 }  // 内圈的内外半径和外圈的内外半径
        };

        var params = extend(defaults, options);
        this.params = params;

        var el = {};
        this.el = el;

        // 存储元素
        el.container = container;

        this.lastSelect = 0; //最近一次选择的pie的下标

        this.init();
    }

    Pie.prototype.init = function () {
        var zr = zrender.init(this.el.container); //初始化zrender

        this.pieGroup = new zrender.Group();
        this.imgGroup = new zrender.Group();
        if (this.params.outPies) {
            this.outPieGroupObj = {}
        }

        var InnerPie = zrender.Path.extend({
            type: 'innerPie',
            shape: {
                cx: 0, // 画布的原点坐标x
                cy: 0, // 画布的原点坐标y
                r: 0, // pie的内半径   
                R: 0, // pie的外半径
                i: 0, // 是第几个扇形
                number: 1 // 一个完整的圆环将分成几个扇形
            },
            buildPath: function (ctx, shape) {
                drawSector(ctx, shape, 'deviation', 0)
            }
        });

        var OutPie = zrender.Path.extend({
            type: 'outPie',
            shape: {
                cx: 0,
                cy: 0,
                r: 0,
                R: 0,
                i: 0,
                j: 0,
                number: 1
            },
            buildPath: function (ctx, shape) {
                // 绘制外圈扇形
                var baseRad = shape.innerPieIndex * 2 * Math.PI / ( shape.number / 2);              
                drawSector(ctx, shape, 'angle', baseRad)
            }
        })

        this.innerPie = InnerPie
        this.outPie = OutPie
        
        this.drawInnerPie(zr, this.params.number)
    }

    Pie.prototype.getPieGroup = function () {
        return this.pieGroup;
    }

    Pie.prototype.getImgGroup = function () {
        return this.imgGroup;
    }

    Pie.prototype.getOutPieGroupObj = function () {
        return this.outPieGroupObj;
    }

    Pie.prototype.drawInnerPie = function (zr, number) {
        var _this = this;
        var InnerPie = this.innerPie
        for (var i = 0; i < number; i++) {
            (function (i) {
                var innerPie = new InnerPie({
                    shape: {
                        cx: _this.params.centerPoint.cx,
                        cy: _this.params.centerPoint.cy,
                        r: _this.params.radius.innerr,
                        R: _this.params.radius.innerR,
                        i: i,
                        number: number
                    },
                    style: {
                        fill: '#1865ad',
                        textFill: "#ffffff"
                    },
                    name: 'pie' + i
                })

                if (_this.params.outPies) {
                    _this.drawOutPie(zr, i);
                }   

                innerPie.on('mouseover', function () {
                    this.setStyle('fill', '#0b3c7f');

                    // 当最后一次选择的pie下标不等于当前选择pie的下标时，执行以下方法
                    if (_this.lastSelect !== i) {
                        _this.pieGroup.childOfName('pie' + _this.lastSelect).setStyle('fill', '#1865ad');
                        if (_this.params.outPies) {
                            _this.outPieGroupObj[_this.lastSelect].hide();
                        }                     
                        _this.lastSelect = i;
                    }
                    if (_this.params.outPies) {
                        _this.outPieGroupObj[i].show();
                    }                 
                })

                _this.pieGroup.add(innerPie);

                var imgx = getX((2 * i + 1) * Math.PI / number, _this.params.imgSize.radius);
                var imgy = getY((2 * i + 1) * Math.PI / number, _this.params.imgSize.radius);

                if (_this.params.images) {
                    _this.drawImage(zr, i, imgx, imgy)
                }

            })(i)
            zr.add(this.pieGroup)
        }
    }

    Pie.prototype.drawOutPie = function (zr, i) {
        var _this = this;

        var outPieGroup = new zrender.Group();


        var OutPie = this.outPie
        for (var j = 0; j < _this.params.outPies[i]; j++) {
            (function (j) {
                var isOne = (_this.params.outPies[i] == 1) ? true : false; //是否只有一个外圈
                outPie = new OutPie({
                    shape: {
                        cx: _this.params.centerPoint.cx,
                        cy: _this.params.centerPoint.cy,
                        r: _this.params.radius.outerr,
                        R: _this.params.radius.outerR,
                        i: j,
                        innerPieIndex: i,
                        number: 2 * _this.params.number, // 设置外圈扇形是几分圆
                        isOne: isOne
                    },
                    style: {
                        fill: '#082956',
                        text: _this.params.outTexts[i][j],
                        textFill: "#ffffff",
                        textOffset: isOne ? [-10,10] : ""
                    },
                    name: 'outPie' + j
                })

                outPie.on('mouseover', function () {
                    this.setStyle('fill', '#0b3c7f');
                }).on('mouseout', function () {
                    this.setStyle('fill', '#082956');
                })

                outPieGroup.add(outPie)
            })(j)
        }

        outPieGroup.hide();
        _this.outPieGroupObj[i] = outPieGroup
        zr.add(outPieGroup)
    }

    Pie.prototype.drawImage = function (zr, i, x, y) {
        var _this = this
        var img = new zrender.Image({
            style: {
                image: _this.params.images[i],
                x: x,
                y: y,
                width: _this.params.imgSize.imgWidth,
                height: _this.params.imgSize.imgHeight,
                text: _this.params.texts[i],
                textFill: '#ffffff',
                textPosition: 'bottom'
            },
            position: [
                _this.params.centerPoint.cx - _this.params.imgSize.imgWidth / 2,
                _this.params.centerPoint.cy - _this.params.imgSize.imgHeight
            ],
            zlevel: 1
        });
        img.on('mouseover', function () {
            _this.pieGroup.childOfName('pie' + i).setStyle('fill', '#0b3c7f');
        })

        _this.imgGroup.add(img);
        zr.add(img);
    }

    function drawSector(ctx, shape, type, baseRad) {
        var ox = 0;
        var oy = 0;

        var startRad = baseRad + shape.i * 2 * Math.PI / shape.number;
        var endRad = 0;
        if (shape.isOne) {
            endRad = baseRad + (shape.i + 2) * 2 * Math.PI / shape.number;
        } else {
            endRad = baseRad + (shape.i + 1) * 2 * Math.PI / shape.number;
        }

        if (type === 'angle') {
            endRad = endRad - Math.PI / 180
        } else if (type === 'deviation') {
            if (shape.isOne) {
                ox = getX( baseRad + (2 * shape.i + 2) * Math.PI / shape.number, shape.number / 2);
                oy = getY( baseRad +(2 * shape.i + 2) * Math.PI / shape.number, shape.number / 2);
            } else {
                ox = getX( baseRad +(2 * shape.i + 1) * Math.PI / shape.number, shape.number / 2);
                oy = getY( baseRad +(2 * shape.i + 1) * Math.PI / shape.number, shape.number / 2);
            }
        }

        var Rx = getX(endRad, shape.R);
        var Ry = getY(endRad, shape.R);

        ctx.arc(shape.cx + ox, shape.cy + oy, shape.r, startRad, endRad);
        ctx.lineTo(shape.cx + Rx + ox, shape.cy + Ry + oy);
        ctx.arc(shape.cx + ox, shape.cy + oy, shape.R, endRad, startRad, true);
        ctx.closePath();
    }

    function getX(rad, r) {
        return Math.cos(rad) * r;
    }

    function getY(rad, r) {
        return Math.sin(rad) * r;
    }

    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    return Pie;
}))