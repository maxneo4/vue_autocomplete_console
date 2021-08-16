<template lang="pug">
div
  input(type="text", size="50", v-model="url")
  button(type="button" @click="onConnect") connect
details.error(v-if="connectionError!=undefined")
  summary  {{ connectionError }}
  div review CORS configuration in server
div.console(ref="console")
  div.left(v-for="(item, index) in lines", :key="index")
    span.prefix {{ item.prefix }}
    span.command {{separator}} 
    span.command {{ item.command }}
CommandAutoComplete(@onNew-command='onNewCommand' @on-clearCommands='onClearCommands' :options="options" ref="autoComplete")
</template>

<script setup>
  import { ref } from 'vue';
  import CommandAutoComplete from './CommandAutoComplete.vue';
  import { options } from '../assets/RunExeCommands';
  
  const url = ref("http://localhost:8020/commands")
  const connectionError = ref(null)
  
  const console = ref(null)
  const separator = '>> ';
  const main_bg_color = 'black';
  const prefix_color = 'green';
  const font_color = '#d2cdcd';
  const error_color = 'red';
  
  const lines = ref([{ prefix: "disco", command: "command" },
        { prefix: "disco", command: "dos tercos" },
        { prefix: "disco", command: "No more" },
        { prefix: "disco B", command: "command" },
        { prefix: "disco C", command: "command" }])
        
  const onNewCommand = (newCommand) => {
    lines.value.push({prefix:"selCommand", command: newCommand});    
    console.value.scrollTop = console.value.scrollHeight; 
  }
  
  const onClearCommands = () => {
    lines.value = [];
  }
  
  const onConnect = () => {
    options.value = []
    fetchCommands();
  }
  
  function fetchCommands(){
    connectionError.value = undefined;
    fetch(url.value, { method: 'get', headers: {
      'content-type': 'application/json'
    } }).then(response => {
      response.json().then(data => options.value = data);
    }).catch(error => {
      connectionError.value = error;
    });
  }
</script>

<style scoped>
button {
  margin-left: 10px;
}

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
  height: 200px;
  overflow-y: auto;
}

.error {
  color: v-bind(error_color);
  font-size: 10px;
}
</style>
