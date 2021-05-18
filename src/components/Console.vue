<template lang="pug">
div.console(ref="console")
  div.left(v-for="(item, index) in lines", :key="index")
    span.prefix {{ item.prefix }}
    span.command {{separator}} 
    span.command {{ item.command }}
CommandAutoComplete(@onNew-command='onNewCommand')
</template>

<script setup>
  import { ref } from 'vue';
  import CommandAutoComplete from './CommandAutoComplete.vue';
  
  const console = ref(null)
  const separator = '>> ';
  const main_bg_color = 'black';
  const prefix_color = 'green';
  const font_color = '#d2cdcd';
  
  const lines = ref([{ prefix: "disco", command: "command" },
        { prefix: "disco", command: "dos tercos" },
        { prefix: "disco", command: "No more" },
        { prefix: "disco B", command: "command" },
        { prefix: "disco C", command: "command" }])
        
  const onNewCommand = (newCommand) => {
    lines.value.push({prefix:"selCommand", command: newCommand});    
    console.value.scrollTop = console.value.scrollHeight; 
  }
</script>

<style scoped>
span.prefix {
  text-align: left;
  color: v-bind(prefix_color);
}
span.command {
  color: v-bind(font_color);
}
div.left {
  text-align: left;
}
.console {
  background-color: v-bind(main_bg_color);  
  margin: 15px;
  padding: 10px 0px 50px 10px;
  height: 100px;
  overflow-y: auto;
}
</style>
