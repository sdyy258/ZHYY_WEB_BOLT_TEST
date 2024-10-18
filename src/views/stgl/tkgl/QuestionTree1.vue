<template>
  <div>
    <el-tree
      ref="tree"
      :data="dataList"
      node-key="id"
      :default-expand-all="false"
      :expand-on-click-node="false"
      :props="defaultProps"
      @node-expand="handleNodeClick"
      @check-change="getCurrentNode"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span class="tree-node-label" @click="change(node,data)">{{ node.label }}</span>
        <!-- <span v-if="type !='adjust' && data.id !=0">
          <i v-if="data.id !== 0" @click="() => rename(node,data)" class="el-icon-edit-outline"></i>
          <el-button type="text" class="el-icon-plus" size="mini" @click="() => append(data)"></el-button>
          <el-button
            type="text"
            class="el-icon-delete"
            size="mini"
            @click="() => remove(node, data)"
            v-if="node.childNodes.length<=0"
          ></el-button>
        </span> -->
      </span>
    </el-tree>
    <!-- 编辑弹窗 -->
    <a-modal
      v-model="visible"
      width="500px"
      title="请输入新的名称"
      :mask-closable="true"
      @cancel="cancel"
      @ok="handleOk"
    >
      <a-input v-model="newName" type="text" />
    </a-modal>
  </div>
</template>

<script>
let id = 1000
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction, postAction } from '@/api/manage'

export default {
  mixins: [JeecgListMixin],
  props: {
    upData: {
      type: String,
      default: ''
    },
    dataList: {
      type: Object,
      default: ''
    }
  },
  data() {
    return {
      // data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cateNameInput: '',
      newName: '',
      dataSource: '',
      visible: false,
      type: '', // 区分删除是否存在
      url: {
        list: '/sys/category/rootList'
      }
    }
  },
  mounted() {
    this.type = this.upData.type
  },

  methods: {
    getCurrentNode(data) {
    },
    // 展开子节点
    handleNodeClick(data) {
      data.children = []
      const params = {
        field: 'id,,name,code,action',
        pid: data.id
      }
      getAction('/sys/category/childList', params).then(res => {
        if (res.success) {
          if (res.result && res.result.length > 0) {
            data.children = this.getDataByResult(res.result).map(item => {
              item.label = item.name
              return item
            })
          } else {
            record.children = ''
            record.hasChildrenField = '0'
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    getDataByResult(result) {
      if (result && result.length > 0) {
        return result.map(item => {
          // 判断是否标记了带有子节点
          if (item[this.hasChildrenField] == '1') {
            const loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      }
    },
    // 编辑名称
    rename(node, data) {
      this.visible = true
      this.newName = data.label
      this.dataSource = data
    },
    // 新名称确认
    handleOk(e) {
      this.dataSource.label = this.newName
      this.visible = false
      this.newName = ''
    },
    // 弹窗“取消
    cancel() {
      this.visible = false
      this.newName = ''
    },
    // 增加分类
    append(data) {
      const newChild = { id: id++, label: '新分类', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 删除分类
    remove(node, data) {
      this.$confirm({
        title: '确认要删除分类吗?',
        content: '',
        onOk() {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        },
        onCancel() {}
      })
    },

    change(node, data) {
      console.log('id', data.id)
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.tree-node-label {
  width: 70px;
  overflow: hidden;
}

.tree-node-label:focus {
  width: 70px;
  overflow: hidden;
  background: aliceblue;
  color: #2485dd;
}
</style>
