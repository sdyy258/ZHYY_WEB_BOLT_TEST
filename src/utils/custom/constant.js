export const pageSizeMax = 0x7fffffff // 查询列表全部数据默认pageSize
const tKey = '048cc3fe99674c35749e394a1024af98'
export const TianDiTu = {
  Terrain: {
    Name: '地形',
    Map: 'https://t0.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=' + tKey,
    Annotion: 'https://t0.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=' + tKey
  },
  Satellite: {
    Name: '影像',
    Map: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=' + tKey,
    Annotion: 'https://t0.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=' + tKey
  },
  Normal: {
    Name: '矢量',
    Map: 'https://t0.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=' + tKey,
    Annotion: 'https://t0.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=' + tKey
  }
}
// export const colorPalette = [
//   'rgb(46, 199, 201)',
//   'rgb(182, 162, 222)',
//   'rgb(90, 177, 239)',
//   'rgb(255, 185, 128)',
//   'rgb(216, 122, 128)',
//   'rgb(141, 152, 179)',
//   'rgb(229, 207, 13)',
//   'rgb(151, 181, 82)',
//   'rgb(149, 112, 109)',
//   'rgb(220, 105, 170)',
//   'rgb(7, 162, 164)',
//   'rgb(154, 127, 209)',
//   'rgb(88, 141, 213)',
//   'rgb(245, 153, 78)',
//   'rgb(192, 80, 80)',
//   'rgb(89, 103, 140)',
//   'rgb(201, 171, 0)',
//   'rgb(126, 176, 10)',
//   'rgb(111, 85, 83)',
//   'rgb(193, 64, 137)'
// ]
