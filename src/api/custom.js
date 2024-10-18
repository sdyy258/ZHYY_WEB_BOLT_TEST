import { getAction } from '@/api/manage'
import { pageSizeMax } from '@/utils/custom/constant'
export const getSysDepartTree = () => getAction('/sys/sysDepart/queryTreeList')// 部门树查询
export const getTownTree = () => getAction('/baseCity/baseCity/tree')// 街道树查询
export const getCategoryItemTree = (type) => getAction('/sys/category/rootListNew', { pageSize: pageSizeMax, type: type })// 街道树查询
