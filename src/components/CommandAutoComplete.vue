<template lang="pug" >
div.autocomplete
  input(ref="input" v-model='state.currentCommand' 
  @keydown.down.self.prevent='onArrowDown' @keydown.up.self.prevent='onArrowUp' 
  @keydown.tab.self.prevent='onArrowDown'  @input='onChange'
  @keydown.enter='onEnter'
  @keydown.escape.self.prevent='onEscape')
  ul.autocomplete-results(v-show='state.isOpen' v-bind:style="{ left: state.compos + 'px' }")
    li.autocomplete-result(v-for='(item, i) in results' :key='i' @click='setOptionOnClick(item)' 
    :class="{ 'is-active': i === state.arrowCounter }")
     | {{ item.senseText }}
</template>

<script setup> 
import { ref, reactive, defineEmit } from 'vue';
import { textWidth } from '../api/textMeasure';
import { getArguments } from '../api/commands';

const emit = defineEmit(['onNew-command']);
const input = ref(null);

let paramOptions = [
  {senseText: "server", defaultValue: "localhost\sql2019dev", senseOptions:[]},
  {senseText: "userName",  defaultValue: "sa", senseOptions:[]},
  {senseText: "password", defaultValue: "sa", senseOptions:[]},
  {senseText: "dbName", defaultValue: "Reboot", senseOptions:[]},
  {senseText: "exeFile", defaultValue: "Export.exe", senseOptions:[]},
  {senseText: "workspaceDir", defaultValue: "H:\git\BC.C\Source\BizAgiCollaboration\TestPublication\ProofConcept\bin\Debug_x64", senseOptions:[]}
];
const options = ref( [
        {senseText: "changeWorkSpaceDirectory", senseOptions:[]},
        {senseText: "runExe", senseOptions:[]},
        {senseText: "changeConnStringSqlServer", senseOptions:[paramOptions[0], 
          paramOptions[1], paramOptions[2], paramOptions[3]]},
        {senseText: "changeConnStringOracle", senseOptions:[]},
        {senseText: "openConfigExe", senseOptions:[]}]);
        
const results = ref([]);
const state = reactive({
  compos: 0,
  arrowCounter: -1,
  isOpen: false,
  currentCommand: "",
  currentWord: ""
});
        
function setSelectedCommand(){
  if (state.arrowCounter === -1) {
    state.currentCommand = state.currentWord;
  } else {
    state.currentCommand = results.value[state.arrowCounter].senseText;
  }
}

function filterResults(){
  state.currentWord = state.currentCommand;
  let args = getArguments(state.currentCommand);
  let command = args[0];  
  const foundCommand = options.value.find(opt => opt.senseText === command);
  if(foundCommand){
    results.value = foundCommand.senseOptions;
    return results.value.length;
  }
  results.value = options.value.filter(
    (item) =>
      item.senseText.toLowerCase().indexOf(state.currentCommand.toLowerCase()) > -1
  );  
  return results.value.length;
}

function hideOptionsAndReset(){
  state.isOpen = false;
  state.arrowCounter = -1;
}

const onEnter = () => { 
  hideOptionsAndReset();
  emit('onNew-command', state.currentCommand);
  state.currentCommand = '';
}

const onEscape = () => {
  hideOptionsAndReset();
  setSelectedCommand(); //set current word
}
        
const onArrowDown = () => {
  if (state.arrowCounter < results.value.length - 1 && state.isOpen) {
        state.arrowCounter = state.arrowCounter + 1;
  } else {
        state.arrowCounter = -1;
  }
  setSelectedCommand()
}

const onArrowUp = () => {
  if (state.arrowCounter > 0 && state.isOpen) {
        state.arrowCounter = state.arrowCounter - 1;
  }
  setSelectedCommand()
}

const onChange = () => {
  if (state.currentCommand.length > 0 && filterResults() > 0) {      
        state.isOpen = true;  
        state.compos = textWidth(state.currentCommand, input.value.style.font);              
      } 
  else { 
    hideOptionsAndReset(); 
  }
}

const setOptionOnClick = (result) => {
  state.currentCommand = result.senseText;
  hideOptionsAndReset();
}

</script>

<style scoped>
input {
  display: table-row;
  width: 100%;
  border-width: thin;  
}
input:focus {
  outline: none !important;
  border:1px solid gray;
  box-shadow: 0 0 10px #719ECE;
}
.autocomplete {
  position: relative;  
  margin-left: 10px;
  margin-right: 10px;
}
.autocomplete-results {
  position: relative;
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  min-height: 1em;
  max-height: 8em;
  overflow: auto;
  display: table-caption;
}
.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
  font-size: 13px;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4AAE9B;
  color: white;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  min-height: 10px;
  background: rgba(0,0,0,.2);
  background-clip: padding-box;
  border-right: 2px solid transparent!important;
  border-left: 2px solid transparent!important;
  -webkit-border-radius: 4px;
}
</style>
