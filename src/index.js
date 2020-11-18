import Pie from './Pie'

const app = document.getElementById('app')
const div = document.createElement('div')
div.setAttribute('id', 'main')
div.setAttribute('style', 'float: left;width:400px;height:400px;margin: 0 auto;')
app.appendChild(div)

const texts = ['取消', '分析', '节点', '操作', '布局'] // 内圈pie对应的text文本
// const images = ['img/cancle.png', 'img/analyze.png', 'img/route.png', 'img/operate.png', 'img/layout.png','img/focuse.png']
const outPies = [1, 1, 3, 4, 1] // 外圈outPie的个数
const outTexts = [
  [],
  ['挖掘分析', '关系分析', '六度分析'],
  ['编辑', '删除', '隐藏'],
  ['照片', '档案', '添加关系', '镜像'],
  ['力导力道', '矩阵', '层级']
] // 外圈outPie对应的text文本
const centerPoint = {
  cx: parseInt(document.getElementById('main').style.width) / 2,
  cy: parseInt(document.getElementById('main').style.height) / 2
} // canvas中点坐标

const mainPie = new Pie(document.getElementById('main'), {
  number: 4, // 内圈pie的数量
  texts: texts, // 内圈pie对应的text文本
  // images: images, // 内圈pie对应的图片
  imgSize: {
    imgWidth: 20,
    imgHeight: 20,
    radius: 66
  }, // 图片宽高与距离中心距离
  outPies: outPies, // 外圈outPie的个数
  outTexts: outTexts, // 外圈outPie对应的text文本
  centerPoint: centerPoint, // canvas中点坐标
  radius: {
    innerr: 33,
    innerR: 99,
    outerr: 104,
    outerR: 150
  } // 内圈的内外半径和外圈的内外半径
})

const pieGroup = mainPie.pieGroup
// const imgGroup = mainPie.imgGroup
const outPieGroupObj = mainPie.outPieGroupObj

pieGroup.children()[0].on('click', function () {
  console.log('innerPie' + 0)
})
pieGroup.children()[1].on('click', function () {
  console.log('innerPie' + 1)
})
pieGroup.children()[2].on('click', function () {
  console.log('innerPie' + 2)
})
// imgGroup.children()[0].on('click', function () {
//   console.log('img' + 0)
// })
// imgGroup.children()[1].on('click', function () {
//   console.log('img' + 1)
// })
// imgGroup.children()[2].on('click', function () {
//   console.log('img' + 2)
// })
outPieGroupObj[2].children()[0].on('click', function () {
  console.log('2-0')
})
outPieGroupObj[2].children()[1].on('click', function () {
  console.log('2-1')
})
outPieGroupObj[2].children()[2].on('click', function () {
  console.log('2-2')
})

// new Pie(document.getElementById('main1'), {
//     number: 3, // 内圈pie的数量
//     texts: ['取消', '删除关系', '修改关系'], // 内圈pie对应的text文本
//     images: ['img/cancle.png', 'img/delete.png', 'img/edit.png'], // 内圈pie对应的图片
//     imgSize: {
//         imgWidth: 20,
//         imgHeight: 20,
//         radius: 73
//     }, // 图片宽高与距离中心距离
//     centerPoint: {
//         cx: 200,
//         cy: 200
//     }, // canvas中点坐标
//     radius: {
//         innerr: 45,
//         innerR: 99
//     } // 内圈的内外半径和外圈的内外半径
// })
