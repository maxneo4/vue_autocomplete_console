<template lang="pug" >
div.autocomplete
  input.large(v-model='state.currentCommand' 
  @keydown.down.self.prevent='onArrowDown' @keydown.up.self.prevent='onArrowUp' 
  @keydown.tab.self.prevent='onArrowDown'  @input='onChange'
  @keydown.enter.self.prevent='hideOptionsAndReset'
  @keydown.escape.self.prevent='onEscape')
  ul.autocomplete-results(v-show='state.isOpen' v-bind:style="{ left: state.compos + 'px' }")
    li.autocomplete-result(v-for='(item, i) in results' :key='i' @click='setOptionOnClick(item)' 
    :class="{ 'is-active': i === state.arrowCounter }")
     | {{ item }}
</template>

<script setup> 
import { ref, reactive } from 'vue';
import { textWidth } from '../api/textMeasure';

const options = ref([ "listOracleUsers",
        "killAllConnections",
        "createNewBizagiUser",
        "dropBizagiUser",
        "scriptToChangeAttribsToNText",
        "getServerInfo",
        "listOracleDirs",
        "getBackupInfo",
        "getImportTemplate"]);
        
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
    state.currentCommand = results.value[state.arrowCounter];
  }
}

function filterResults(){
  state.currentWord = state.currentCommand;
  results.value = options.value.filter(
    (item) =>
      item.toLowerCase().indexOf(state.currentCommand.toLowerCase()) > -1
  );  
  return results.value.length;
}

const hideOptionsAndReset = () => {
  state.isOpen = false;
  state.arrowCounter = -1;
}

const onEscape = () => {
  hideOptionsAndReset();
  setSelectedCommand(); //set current word
}
        
const onArrowDown = () => {
  if (state.arrowCounter < results.value.length - 1) {
        state.arrowCounter = state.arrowCounter + 1;
  } else {
        state.arrowCounter = -1;
  }
  setSelectedCommand()
}

const onArrowUp = () => {
  if (state.arrowCounter > 0) {
        state.arrowCounter = state.arrowCounter - 1;
  }
  setSelectedCommand()
}

const onChange = () => {
  if (state.currentCommand.length > 0 && filterResults() > 0) {      
        state.isOpen = true;  
        state.compos = textWidth(state.currentCommand, "400 13.3333px Arial");                   
      } 
  else { 
    hideOptionsAndReset(); 
  }
}

const setOptionOnClick = (result) => {
  state.currentCommand = result;
  hideOptionsAndReset();
}

</script>

<style scoped>
input.large {
  display: table-row;
  width: 100%;
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
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4AAE9B;
  color: white;
}
</style>
