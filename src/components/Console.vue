<template lang="pug">
div.console(ref="console")
  div.left(v-for="(item, index) in lines", :key="index")
    span.prefix {{ item.prefix }}
    span {{separator}} 
    span {{ item.command }}
CommandAutoComplete
</template>

<script setup>
  import { ref } from 'vue';
  import CommandAutoComplete from './CommandAutoComplete.vue';
  
  const separator = '>> ';
  
  const lines = ref([{ prefix: "disco", command: "command" },
        { prefix: "disco", command: "dos tercos" },
        { prefix: "disco", command: "No more" },
        { prefix: "disco B", command: "command" },
        { prefix: "disco C", command: "command" }])
</script>

<style scoped>
span.prefix {
  text-align: left;
  color: green;
}
div.left {
  text-align: left;
}
.console {
  background-color: cornsilk;
  margin: 15px;
  padding: 10px 0px 50px 10px;
  height: 100px;
  overflow-y: auto;
}
</style>
