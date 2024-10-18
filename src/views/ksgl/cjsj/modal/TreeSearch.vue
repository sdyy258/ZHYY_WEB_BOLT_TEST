<template>
  <div>
    <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
    <a-tree
      :tree-data="treeData"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :replace-fields="{key:'value' }"
      :default-expand-parent="true"
      :selected-keys="selectedKeys"
      @expand="onExpand"
      @select="onSelect"
    >
      <template slot="title" slot-scope="item">
        <!-- 如果是新节点 -->
        <span v-if="item.isNewItem">
          <input v-model="item.title" type="text" class="editInput">
          <span class="tree-cancle_icon edit-require_icon">
            <a-icon type="close-circle" @click="closeClick(item)" />
          </span>
          <span class="tree-save_icon edit-require_icon">
            <a-icon type="check-circle" @click="checkClick(item)" />
          </span>
        </span>
        <div>
          <!-- 编辑时展示输入框 -->
          <div v-if="item.isEdit">
            <input v-model="item.title" type="text" class="editInput">
            <span class="tree-cancle_icon edit-require_icon">
              <a-icon type="close-circle" />
            </span>
            <span class="tree-save_icon edit-require_icon">
              <a-icon type="check-circle" />
            </span>
          </div>
          <!-- 否则展示原来的节点信息 -->
          <div v-else>
            <template slot="title" slot-scope="{ title }">
              <span v-if="item.title.indexOf(searchValue) > -1">
                {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
                <span
                  style="color: #f50"
                >{{ searchValue }}</span>
                {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else class="node-title">{{ item.title }}</span>
            </template>
            <span class="node-title">{{ item.title }}</span>
            <span class="icon-wrap">
              <a-icon type="edit" @click="editNode(item)" />
            </span>
            <span class="icon-wrap">
              <a-icon type="plus" @click="addNewNode(item)" />
            </span>
            <span class="icon-wrap">
              <a-icon type="delete" @click="deleteNode(item)" />
            </span>
          </div>
        </div>
      </template>
    </a-tree>
  </div>
</template>
<script>
const treeData = [
  {
    id: 1,
    key: 1,
    // isEdit: false, // 是否处于编辑状态
    // isNewItem: false, // 该节点是否是新增节点
    title: '节点名字',
    // depth: 1, // 该节点的层级
    scopedSlots: { title: 'custom' }, // 自定义组件需要绑定
    children: [
      {
        id: 2,
        key: 2,
        isEdit: false, // 是否处于编辑状态
        isNewItem: false, // 该节点是否是新增节点
        title: '子节点名字',
        depth: 2, // 该节点的层级
        scopedSlots: { title: 'custom' }
      }
    ]
  }
]
const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const { key, title } = node
    dataList.push({ key, title: title })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(treeData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
export default {
  props: {
    treeData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      // treeData:,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: treeData
    }
  },
  methods: {
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = true
    },
    // 搜索
    onChange(e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 树选择
    onSelect(selectedKeys, e, a, v) {
      this.$emit('ok', selectedKeys[0])
    },
    // 添加节点名字
    addNewNode(item) {
      const newItem = {
        id: Math.ceil(Math.random() * 10000), // 避免和已有的id冲突
        key: Math.ceil(Math.random() * 10000), // 避免和已有的key冲突
        isEdit: false,
        name: '',
        isNewItem: true,
        title: '',
        depth: item.depth + 1, // 如果需要添加顶级节点，值为0
        scopedSlots: { title: 'custom' },
        children: []
      }
      if (!item.dataRef.children) {
        this.$set(item.dataRef, 'children', [])
      }
      this.treeData = this.treeData
      item.dataRef.children.push(newItem)
    },
    // 编辑节点名字
    editNode(item) {
      item.title = item.dataRef.title
      item.dataRef.isNewItem = true
    },
    checkClick(item) {
      item.dataRef.isNewItem = false
      item.dataRef.title = item.title
    },
    // 输入框取消
    closeClick(item) {
      item.dataRef.isNewItem = false
    },
    // 删除该节点
    deleteNode(data) {
      Object.assign(data.dataRef, null)
      this.searchOption(data.dataRef, this.treeData)
    },
    //  递归查找操作的节点，在父节点的children中删除
    searchOption(option, arr, obj = {}) {
      // 首先循环arr最外层数据
      for (let s = 0; s < arr.length; s++) {
        // 如果匹配到了arr最外层中的我需要删除的数据
        if (arr[s].key === option.key) {
          // 删除即删除即可
          arr.splice(s, 1)
          break
        } else if (arr[s].children && arr[s].children.length > 0) {
          // 递归条件
          this.searchOption(option, arr[s].children, obj)
        } else {
          continue
        }
      }
    }
  }
}
</script>
