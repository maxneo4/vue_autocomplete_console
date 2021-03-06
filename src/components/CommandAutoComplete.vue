<template lang="pug" >
div.autocomplete
  input(ref="input" v-model='state.currentCommand' 
  spellcheck = 'false'
  @keydown.down.self.prevent='onArrowDown' @keydown.up.self.prevent='onArrowUp' 
  @keydown.tab.self.prevent='onArrowDown'  @input='onChange'
  @keydown.enter='onEnter'
  @keydown.escape.self.prevent='onEscape'
  @keydown.ctrl.delete.self.prevent = 'onClear')
  ul.autocomplete-results(v-show='state.isOpen' v-bind:style="{ left: state.compos + 'px' }")
    li.autocomplete-result(v-for='(item, i) in results' :key='i' @click='setOptionOnClick(item)' 
    :class="{ 'is-active': i === state.arrowCounter }")
     | {{ item.senseText }}
</template>

<script setup> 
import { ref, reactive } from 'vue';
import { textWidth } from '../api/textMeasure';
import { getTextCommandInfo, setSelectedCommand, setClickedCommand } from '../api/commands';

import { getNextUpPosition, getNextDownPosition } from '../api/cycle';

const props = defineProps({
    options: Array,
  })

const emit = defineEmits(['onNew-command', 'on-clearCommands']);
const input = ref(null);        
const fontCommandText = '15px Arial, sans-serif';
        
const results = ref([]);
const commandsHistorical = ref([]);
const state = reactive({
  compos: 0,
  arrowCounter: -1,
  arrowHistoricalCounter : -1,
  isOpen: false,
  currentCommand: "",
  currentWord: ""
});

function filterResults(textCommandInfo){   
  let optionsToAutoComplete = textCommandInfo.optionsToAutoComplete;

  results.value = state.currentWord.length > 1? optionsToAutoComplete.filter(
    (item) =>
      item.senseText.toLowerCase().indexOf(state.currentWord.toLowerCase()) > -1
  ) : optionsToAutoComplete;  
  
  return results.value.length;
}

function hideOptionsAndReset(){
  state.isOpen = false;
  resetArrowCounter();
}

function resetArrowCounter(){
  state.arrowCounter = -1;
}

const onEnter = () => { 
  hideOptionsAndReset();
  emit('onNew-command', state.currentCommand);
  commandsHistorical.value.push(state.currentCommand);
  state.arrowHistoricalCounter = -1;
  state.currentCommand = '';
}

const onClear = (where, e) => {
  emit('on-clearCommands');
}

const onEscape = () => {
  hideOptionsAndReset();
  setSelectedCommand(state, results); //set current word
}
        
const onArrowDown = () => {
  if(state.isOpen){
    state.arrowCounter = getNextDownPosition(state.arrowCounter, results.value);
    setSelectedCommand(state, results);
  }  
  if (!state.isOpen && commandsHistorical.value.length > 0) {
      state.arrowHistoricalCounter = getNextDownPosition(state.arrowHistoricalCounter, commandsHistorical.value);
      state.currentCommand = commandsHistorical.value[state.arrowHistoricalCounter];
  }  
}

const onArrowUp = () => {
  if (state.isOpen) {
      state.arrowCounter = getNextUpPosition(state.arrowCounter, results.value);
      setSelectedCommand(state, results);
  }
  if (!state.isOpen && commandsHistorical.value.length > 0) {
      state.arrowHistoricalCounter = getNextUpPosition(state.arrowHistoricalCounter, commandsHistorical.value);
      state.currentCommand = commandsHistorical.value[state.arrowHistoricalCounter];
  }
  
}

const onChange = () => {
  let textCommandInfo = getTextCommandInfo(state.currentCommand, props.options, input.selectionStart);  
  state.currentWord = textCommandInfo.currentWord;
  
  if(textCommandInfo.endsWithSpace){
    resetArrowCounter();
  }
  
  if (state.currentCommand.length > 0 && filterResults(textCommandInfo) > 0) {      
        state.isOpen = true;  
        state.compos = textWidth(state.currentCommand, fontCommandText);               
      } 
  else { 
    hideOptionsAndReset(); 
  }
}

const setOptionOnClick = (result) => {
  setClickedCommand(state, result);
  hideOptionsAndReset();
}

</script>

<style scoped>
input {
  display: table-row;
  width: 100%;
  border-width: thin;  
  font: v-bind(fontCommandText);
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
  position: absolute;
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  min-height: 1em;
  max-height: 12em;
  overflow-y: auto;
  overflow-x: hidden;
  display: table-caption;
}
.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
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
