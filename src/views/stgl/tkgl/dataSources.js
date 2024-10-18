export const columns = [
  {
    title: '试题内容',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '题型',
    align: 'center',
    dataIndex: 'questionType_dictText',
    key: 'questionType_dictText',
    ellipsis: true,
    width: 80
  },
  // {
  //   title: '分类',
  //   align: 'center',
  //   dataIndex: 'prop3',
  //   key: 'prop3'
  // },
  // {
  //   title: '难度',
  //   align: 'center',
  //   dataIndex: 'difficult_dictText',
  //   key: 'difficult_dictText'
  // },
  {
    title: '分数',
    align: 'center',
    dataIndex: 'score',
    key: 'score',
    defaultHide: true,
    width: 80,
    ellipsis: true
  },
  // {
  // 	title: '创建人',
  // 	align: 'center',
  // 	dataIndex: 'createBy',
  // 	key: 'createBy'
  // },
  // {
  // 	title: '创建时间',
  // 	align: 'center',
  // 	dataIndex: 'createTime',
  // 	key: 'createTime',
  // 	width: 100
  // },
  {
    title: '监测类别',
    align: 'center',
    dataIndex: 'monitoringCategory_dictText',
    key: 'monitoringCategory_dictText',
    ellipsis: true,
    width: 100
  },
  {
    title: '科目(方法原理)',
    align: 'center',
    dataIndex: 'methodPrinciple_dictText',
    key: 'methodPrinciple_dictText',
    width: 100,
    ellipsis: true
  },
  {
    title: '标准号',
    align: 'center',
    dataIndex: 'standardNumber',
    key: 'standardNumber',
    ellipsis: true,
    width: 150
  },
  {
    title: '拒绝原因',
    align: 'center',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true,
    width: 150
  },
  {
    title: '审核状态',
    align: 'center',
    dataIndex: 'isReview_dictText',
    key: 'isReview_dictText',
    ellipsis: true,
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    // fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
export const columnsFx = [
  {
    title: '试题内容',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '题型',
    align: 'center',
    dataIndex: 'questionType_dictText',
    key: 'questionType_dictText',
    ellipsis: true,
    width: 80
  },
  // {
  //   title: '分类',
  //   align: 'center',
  //   dataIndex: 'prop3',
  //   key: 'prop3'
  // },
  // {
  //   title: '难度',
  //   align: 'center',
  //   dataIndex: 'difficult_dictText',
  //   key: 'difficult_dictText'
  // },
  {
    title: '分数',
    align: 'center',
    dataIndex: 'score',
    key: 'score',
    defaultHide: true,
    width: 80,
    ellipsis: true
  },
  {
    title: '监测类别',
    align: 'center',
    dataIndex: 'monitoringCategory_dictText',
    key: 'monitoringCategory_dictText',
    defaultHide: true,
    ellipsis: true,
    width: 100
  },
  {
    title: '科目(方法原理)',
    align: 'center',
    dataIndex: 'methodPrinciple_dictText',
    key: 'methodPrinciple_dictText',
    defaultHide: true,
    width: 100,
    ellipsis: true
  },
  {
    title: '标准号',
    align: 'center',
    dataIndex: 'standardNumber',
    key: 'standardNumber',
    defaultHide: true,
    ellipsis: true,
    width: 150
  },
  {
    title: '拒绝原因',
    align: 'center',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true,
    width: 150
  },
  {
    title: '创建人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 150,
    ellipsis: true
  },
  {
  	title: '创建时间',
  	align: 'center',
  	dataIndex: 'createTime',
  	key: 'createTime',
    defaultHide: true,
  	width: 120
  },
  {
    title: '审核状态',
    align: 'center',
    dataIndex: 'isReview_dictText',
    key: 'isReview_dictText',
    ellipsis: true,
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    // fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

export const columnsSh = [
  {
    title: '试题内容',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '题型',
    align: 'center',
    dataIndex: 'questionType_dictText',
    key: 'questionType_dictText',
    ellipsis: true,
    width: 80
  },
  {
    title: '分数',
    align: 'center',
    dataIndex: 'score',
    key: 'score',
    defaultHide: true,
    width: 80,
    ellipsis: true
  },
  {
    title: '监测类别',
    align: 'center',
    dataIndex: 'monitoringCategory_dictText',
    key: 'monitoringCategory_dictText',
    defaultHide: true,
    ellipsis: true,
    width: 100
  },
  {
    title: '科目(方法原理)',
    align: 'center',
    dataIndex: 'methodPrinciple_dictText',
    key: 'methodPrinciple_dictText',
    defaultHide: true,
    width: 100,
    ellipsis: true
  },
  {
    title: '标准号',
    align: 'center',
    dataIndex: 'standardNumber',
    key: 'standardNumber',
    defaultHide: true,
    ellipsis: true,
    width: 150
  },
  {
    title: '创建人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    key: 'createBy_dictText',
    width: 150,
    ellipsis: true
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    key: 'createTime',
    defaultHide: true,
    width: 120
  },
  {
    title: '审核状态',
    align: 'center',
    dataIndex: 'isReview_dictText',
    key: 'isReview_dictText',
    ellipsis: true,
    width: 100
  },
  {
    title: '拒绝原因',
    align: 'center',
    dataIndex: 'reason',
    key: 'reason',
    ellipsis: true,
    width: 150
  },
  {
    title: '上传地市',
    align: 'center',
    dataIndex: 'deptId_dictText',
    key: 'deptId_dictText',
    ellipsis: true,
    width: 150
  },
  {
    title: '上传人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    key: 'createBy_dictText',
    ellipsis: true,
    width: 150
  },
  // {
  //   title: '上传时间',
  //   align: 'center',
  //   dataIndex: 'createTime',
  //   key: 'createTime',
  //   ellipsis: true,
  //   width: 120
  // },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    // fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
export const dataSource = [{
  key: '1',
  prop1: '____统一发布国家环境质量、重点污染源检测信息及其重大环境信息。',
  prop2: '单选',
  type: 1,
  prop3: '试题分类/形势政策',
  prop4: '普通',
  prop5: '5',
  prop6: '蒋火华',
  prop7: '____统一发布国家环境质量、重点污染源检测信息及其重大环境信息',
  prop8: 'A',
  prop9: '暂无解析',
  prop10: '简单',
  prop12: '2023-04-06',
  prop11: [{
    index: 1,
    option: 'A',
    text: '国务院生态环境主管部门'
  }, {
    index: 2,
    option: 'B',
    text: '省级生态环境部门'
  }, {
    index: 3,
    option: 'C',
    text: '县级以上生态环境部门'
  },
  {
    index: 4,
    option: 'D',
    text: '各级生态生态环境部门'
  }]
}, {
  key: '2',
  prop1: '土壤酸性增大，使土壤中许多金属离子的溶解度增大，其有效或毒性均增大',
  prop2: '判断',
  type: 2,
  prop3: '试题分类/基础知识',
  prop4: '简单',
  prop5: '5',
  prop6: '周志光',
  prop7: '土壤酸性增大，使土壤中许多金属离子的溶解度增大，其有效或毒性均增大',
  prop8: '正确',
  prop9: '暂无解析',
  prop10: '简单',
  prop12: '2023-04-15',
  prop11: []
}, {
  key: '3',
  prop1: '配置氢氧化钠标准溶液时应注意___',
  prop2: '多选',
  type: 1,
  prop3: '试题分类/基础知识',
  prop4: '简单',
  prop5: '10',
  prop6: '周之光',
  prop12: '2023-04-06',
  prop7: '配置氢氧化钠标准溶液时应注意___',
  prop8: 'ABCD',
  prop9: '以上描述均正确。',
  prop10: '简单',
  prop11: [{
    index: 1,
    option: 'A',
    text: '选用无二氧化碳水配置，溶解后立即转入聚乙烯瓶'
  }, {
    index: 2,
    option: 'B',
    text: '冷却后须用装有碱石灰管的橡皮塞塞子塞紧'
  }, {
    index: 3,
    option: 'C',
    text: '静置24h后，吸取一定量上清液用无二氧化碳水稀释定容'
  }, {
    index: 4,
    option: 'D',
    text: '必须移入聚乙烯瓶内保存'
  }]
}
]
export const dataType = [{
  value: 1,
  text: '单选题'
}, {
  value: 2,
  text: '多选题'
}, {
  value: 3,
  text: '判断题'
}, {
  value: 4,
  text: '填空题'
},
{
  value: 5,
  text: '简答题'
},
{
  value: 6,
  text: '计算题'
},
{
  value: 7,
  text: '分析题'
},
{
  value: 8,
  text: '论述题'
}
]

export const difficultyLevel = [{
  value: 1,
  text: '简单'
}, {
  value: 2,
  text: '普通'
}, {
  value: 3,
  text: '困难'
}]
export const treeData1 = [{
  title: '分类选题',
  value: '0-0',
  key: '0-0',
  children: [
    {
      title: '示例1',
      value: '0-0-1',
      key: '0-0-1'
    },
    {
      title: '示例2',
      value: '0-0-2',
      key: '0-0-2'
    }
  ]
}, {
  title: '新分类',
  value: '0-1',
  key: '0-1'
}]
