<template lang="pug">
div
  input(type="text", size="50", v-model="url")
  button(type="button" @click="onConnect") connect
details.error(v-if="connectionError!=undefined")
  summary  {{ connectionError }}
  div review CORS configuration in server or server is up
div.console(ref="console")
  div.left(v-for="(item, index) in lines", :key="index")
    span.prefix {{ item.prefix }}
    span.command {{separator}} 
    span.command(v-bind:style="{ color: item.color }") {{ item.command }}
CommandAutoComplete(@onNew-command='onNewCommand' @on-clearCommands='onClearCommands' :options="options" ref="autoComplete")
</template>

<script setup>
  import { ref } from 'vue';
  import CommandAutoComplete from './CommandAutoComplete.vue';
  import { options } from '../assets/RunExeCommands';
    
  const console = ref(null)
  const separator = '>> ';
  const main_bg_color = 'black';
  const prefix_color = 'green';
  const default_color = '#d2cdcd';  
  const error_color = 'red';
    
  const url = ref("http://localhost:8020/commands")
  const connectionError = ref(null)
  const lines = ref([])
  const result = ref(null)
  const prefix = ref("")
        
  const onNewCommand = (newCommand) => {
    addLine(newCommand);
    fetchRunCommand(newCommand);
  }
  
  const onClearCommands = () => {
    lines.value = [];
  }
  
  const onConnect = () => {
    options.value = []
    fetchCommands();
  }
  
  function addLine(newText, font_color = default_color){
    lines.value.push({prefix:prefix.value, command: newText, color: font_color});
    console.value.scrollTop = console.value.scrollHeight;
  }
  
  function fetchCommands(){
    connectionError.value = undefined;
    fetch(url.value, { method: 'get', headers: {
      'content-type': 'application/json'
    } }).then(response => {
      response.json().then(data => options.value = data);
      addLine(`connected to ${url.value}`)
    }).catch(error => {
      connectionError.value = error;
    });
  }
  
  function fetchRunCommand(newCommand){    
    fetch("http://localhost:8020/runCommand", { method: 'post', headers: {
      'content-type': 'application/json'
    }, body: JSON.stringify({ command: newCommand })
    }).then(response => {
      response.json().then(data => updateDataFromOutPutExecution(data));
    }).catch(error => {
      connectionError.value = error;
    });
  }
  
  function updateDataFromOutPutExecution(data){
    result.value = data;
    prefix.value = result.value.prefix;
    if(result.value.error){      
      addLine(result.value.error, error_color);      
    }else{
      addLine(result.value.result, default_color);
    }    
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
  color: v-bind(default_color);
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
