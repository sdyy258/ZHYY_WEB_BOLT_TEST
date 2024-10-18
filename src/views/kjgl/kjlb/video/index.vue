<template>
  <a-card>
    <div class="top">
      <div style="border: 2px solid #333;height: 643px;flex: 1">
        <video ref="video" width="100%" height="100%" controls autoplay>
          <source :src="url">
        </video>
      </div>
      <div style="width: 30%">
        <div class="tabs-list">
          <div
            v-for="i in tabsOption"
            :key="i.value"
            class="tabs-item"
            :class="i.value===tabsValue ? 'active' : '' "
            @click="tabsValue=i.value"
          >
            {{ i.text }}
          </div>
          <div style="background: #343639" />
        </div>
        <div class="top-right">
          <div v-if="tabsValue===1" class="course-introduction">
            <p>随着信息时代的到来，会计技术也发生了巨大的变化，掌握会计技术，是企业核心竞争力的关链所在。中级会计课程作为会计人才的专业培训，受到了更多企业的青睐。</p>
            <p>首先，中级会计课程的内容内容非常丰富，包括会计基础知识、财务会让、分析会让、管理会让、审让、中让报表分析、税收会让、财务管理、成本会计、信息系统等，共中几乎涵盖了所有会让技能，可以满足从业者对理论知识和技术能力的全方而i要求。</p>
            <p>其次，中级会计课程的学习方式也是课程的亮点。它不仅以教师的多维度讲解为主，而且很注重形象的解释，比较直观的理解，让学员不仅能够掌挥会计知识，还能够运用会计知识解决问题。另外，学习者在课程中会有不同形式的知识竞赛、模拟实战，利用趣味性的学习方式让学员更加深入地理解知识。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        <div class="course-name">中级会计职称-会计实务精讲课第二十二期第一讲</div>
        <div class="course-author">作者：柳豆豆</div>
      </div>
      <div class="thumbs-collect">
        <div class="flex align-center">
          <img v-if="isThumbs" :src="icon.thumbsHL" @click="isThumbs=false">
          <img v-else :src="icon.thumbs" @click="isThumbs=true">
          <span>101次</span>
        </div>
        <div class="ml20 flex align-center">
          <img v-if="isCollect" :src="icon.collectHL" @click="isCollect=false">
          <img v-else :src="icon.collect" @click="isCollect=true">
          <span>36次</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      url: 'http://114.115.161.86:9000/hbyddzfiles/%E5%9C%9F%E5%A3%A4%E7%8E%AF%E5%A2%83%E7%9B%91%E6%B5%8B%E6%A0%B7%E5%93%81%E9%87%87%E9%9B%86%E6%8A%80%E6%9C%AF%E8%A7%84%E5%AE%9A%E4%BD%9C%E4%B8%9A%E6%8C%87%E5%AF%BC%E4%B9%A6%E8%AE%B2%E8%A7%A3%20-%20%E5%BD%95%E5%88%B6~1.mp4',
      tabsValue: 1,
      tabsOption: [{
        text: '课程介绍',
        value: 1
      }, {
        text: '课程目录',
        value: 2
      }, {
        text: '用户评论(93)',
        value: 3
      }],
      isCollect: true,
      isThumbs: true,
      icon: {
        collect: require('@/assets/collect.png'),
        collectHL: require('@/assets/collectHL.png'),
        thumbsHL: require('@/assets/thumbsHL.png'),
        thumbs: require('@/assets/thumbs.png')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.top {
  display: flex;

  .tabs-list {
    display: flex;

    .tabs-item {
      background: #585858;
      cursor: pointer;
      border: 1px solid #a89595;
      color: white;
      padding: 10px 0;
      width: 33.33%;
      text-align: center;

      &.active {
        background: #397FF6;
      }
    }

  }

  .top-right {
    background: #343639;
    color: white;
    height: 600px;

    .course-introduction {
      padding: 15px;
      text-indent: 2em;
      line-height: 23px;
    }
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding: 20px 500px 20px 20px;

  .course-name {
    font-weight: 600;
    font-size: 24px;
    letter-spacing: 1px;
  }

  .course-author {
    color: #999;
    margin-top: 5px;
  }
  .thumbs-collect{
    display: flex;

    img{
      cursor: pointer;
    }
  }
}
</style>
