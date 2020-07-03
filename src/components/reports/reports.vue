<template>
  <el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 2.为Echarts准备一个Dom -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
var echarts = require("echarts");

export default {
  data() {
    return {};
  },
  mounted() {
    this.useEchart();
  },
  methods: {
    async useEchart() {
      var myEchart = echarts.init(document.getElementById("main"));
      const res = await this.$http.get(`reports/type/1`);
      let option2 = res.data.data;
      let option1 = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      };
      let option = {...option1, ...option2};
      myEchart.setOption(option);
    }
  }
};
</script>

