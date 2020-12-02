import zrender from 'zrender'
import { getX, getY, extend, drawSector } from './util'

export default class Pie {
  constructor (container = {}, options = {}) {
    // 默认参数
    const defaults = {
      number: 6, // 内圈pie的数量
      // texts: texts,                //内圈pie对应的text文本
      // images: images,              //内圈pie对应的图片
      imgSize: {
        imgWidth: 20,
        imgHeight: 20
      }, // 图片宽高
      // outPies: outPies,            //外圈outPie的个数
      // outTexts: outTexts,          //外圈outPie对应的text文本
      // centerPoint: centerPoint,    // canvas中点坐标
      radius: {
        innerr: 33,
        innerR: 99,
        outerr: 104,
        outerR: 150
      } // 内圈的内外半径和外圈的内外半径
    }

    this.params = extend(defaults, options)

    const el = {}
    this.el = el

    // 存储元素
    el.container = container

    this.lastSelect = 0 // 最近一次选择的pie的下标

    this.init()
  }

  init () {
    const zr = zrender.init(this.el.container) // 初始化zrender

    this.pieGroup = new zrender.Group()
    this.imgGroup = new zrender.Group()
    if (this.params.outPies) {
      this.outPieGroupObj = {}
    }

    const InnerPie = zrender.Path.extend({
      type: 'innerPie',
      shape: {
        cx: 0, // 画布的原点坐标x
        cy: 0, // 画布的原点坐标y
        r: 0, // pie的内半径
        R: 0, // pie的外半径
        i: 0, // 是第几个扇形
        number: 1 // 一个完整的圆环将分成几个扇形
      },
      buildPath (ctx, shape) {
        drawSector(ctx, shape, 'deviation', 0)
      }
    })

    const OutPie = zrender.Path.extend({
      type: 'outPie',
      shape: {
        cx: 0,
        cy: 0,
        r: 0,
        R: 0,
        i: 0,
        innerPieIndex: 0,
        number: 1,
        isOne: false
      },
      buildPath (ctx, shape) {
        const baseRad =
          (shape.innerPieIndex * 2 * Math.PI) / (shape.number / 2)
        drawSector(ctx, shape, 'angle', baseRad)
      }
    })

    this.innerPie = InnerPie
    this.outPie = OutPie

    this.drawInnerPie(zr)
  }

  drawInnerPie (zr) {
    const _this = this
    const InnerPie = this.innerPie
    const {
      centerPoint,
      radius,
      outPies,
      imgSize,
      images,
      number
    } = _this.params
    let { lastSelect } = this
    for (let i = 0; i < number; i++) {
      (function (i) {
        const innerPie = new InnerPie({
          shape: {
            cx: centerPoint.cx,
            cy: centerPoint.cy,
            r: radius.innerr,
            R: radius.innerR,
            i,
            number
          },
          style: {
            fill: '#1865ad',
            textFill: '#ffffff'
          },
          name: `pie${i}`
        })

        if (outPies) {
          _this.drawOutPie(zr, i)
        }

        innerPie.on('mouseover', function () {
          this.setStyle('fill', '#0b3c7f')
          // 当最后一次选择的pie下标不等于当前选择pie的下标时，执行以下方法
          if (lastSelect !== i) {
            _this.pieGroup
              .childOfName(`pie${lastSelect}`)
              .setStyle('fill', '#1865ad')
            if (outPies) {
              _this.outPieGroupObj[lastSelect].hide()
            }
            lastSelect = i
          }
          if (outPies) {
            _this.outPieGroupObj[i].show()
          }
        })

        _this.pieGroup.add(innerPie)

        const imgx = getX(((2 * i + 1) * Math.PI) / number, imgSize.radius)
        const imgy = getY(((2 * i + 1) * Math.PI) / number, imgSize.radius)

        if (images) {
          _this.drawImage(zr, i, imgx, imgy)
        }
      })(i)
      zr.add(this.pieGroup)
    }
  }

  drawOutPie (zr, i) {
    const _this = this
    const OutPie = this.outPie
    const { centerPoint, radius, outPies, number, outTexts } = _this.params
    const outPieGroup = new zrender.Group()

    for (let j = 0; j < outPies[i]; j++) {
      (function (j) {
        const isOne = outPies[i] === 1 // 是否只有一个外圈
        const outPie = new OutPie({
          shape: {
            cx: centerPoint.cx,
            cy: centerPoint.cy,
            r: radius.outerr,
            R: radius.outerR,
            i: j,
            innerPieIndex: i,
            number: 2 * number, // 设置外圈扇形是几分圆
            isOne
          },
          style: {
            fill: '#082956',
            text: outTexts[i][j],
            textFill: '#ffffff',
            textOffset: isOne ? [-10, 10] : ''
          },
          name: `outPie${j}`
        })

        outPie
          .on('mouseover', function () {
            this.setStyle('fill', '#0b3c7f')
          })
          .on('mouseout', function () {
            this.setStyle('fill', '#082956')
          })

        outPieGroup.add(outPie)
      })(j)
    }

    outPieGroup.hide()
    _this.outPieGroupObj[i] = outPieGroup
    zr.add(outPieGroup)
  }

  drawImage (zr, i, x, y) {
    const _this = this
    const { images, imgSize, texts, centerPoint } = this.params
    const img = new zrender.Image({
      style: {
        image: images[i],
        x,
        y,
        width: imgSize.imgWidth,
        height: imgSize.imgHeight,
        text: texts[i],
        textFill: '#ffffff',
        textPosition: 'bottom'
      },
      position: [
        centerPoint.cx - imgSize.imgWidth / 2,
        centerPoint.cy - imgSize.imgHeight
      ],
      zlevel: 1
    })
    img.on('mouseover', () => {
      _this.pieGroup.childOfName(`pie${i}`).setStyle('fill', '#0b3c7f')
    })

    _this.imgGroup.add(img)
    zr.add(img)
  }
}
