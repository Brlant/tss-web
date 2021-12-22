<template>
  <div class="backIcon">
    <el-button @click="goBack" type="warning" icon="el-icon-back">返 回</el-button>
<!--    <i class="el-icon-back"></i>-->
  </div>
</template>

<script>
export default {
name: "BackIcon",
  methods: {
    goBack() {
      window.history.back()
    }
  }
}
</script>

<style lang="scss" scoped>
  .backIcon{
    background-color: #fff;
  }
</style>
