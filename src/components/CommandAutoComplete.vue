<template lang="pug" >
div.autocomplete
  input.large(@keydown.down.self.prevent='onArrowDown' @keydown.up.self.prevent='onArrowUp' 
  @keydown.tab.self.prevent='onArrowDown' v-model='state.currentCommand' @input='onChange')
  ul.autocomplete-results(v-show='state.isOpen' v-bind:style="{ left: state.compos + 'px' }")
    li.autocomplete-result(v-for='(item, i) in results' :key='i' @click='setResult(item)' 
    :class="{ 'is-active': i === state.arrowCounter }")
     | {{ item }}
</template>

<script setup> 
import { ref, reactive } from 'vue';

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
        
const onArrowDown = () => {
  if (state.arrowCounter < results.value.length - 1) {
        state.arrowCounter = state.arrowCounter + 1;
      } else {
        state.arrowCounter = -1;
      }
      if (state.arrowCounter === -1) {
        state.currentCommand = state.currentWord;
      } else {
        state.currentCommand = results.value[state.arrowCounter];
      }
}

const onArrowUp = () => {
  if (state.arrowCounter > 0) {
        state.arrowCounter = state.arrowCounter - 1;
      }
}

const onChange = () => {
  if (state.currentCommand.length > 0) {
        filterResults();
        state.isOpen = true;        
      } else {
        state.isOpen = false;
      }
}

const filterResults = () => {
  state.currentWord = state.currentCommand;
  results.value = options.value.filter(
    (item) =>
      item.toLowerCase().indexOf(state.currentCommand.toLowerCase()) > -1
  );  
}

const setResult = (result) => {
  state.currentCommand = result;
  state.isOpen = false;
}

</script>

<style scoped>
input.large {
  display: table-row;
  width: 98%;
}
.autocomplete {
  position: relative;
  width: 95%;
  margin-left: 10px;
  margin-right: 10px;
}
.autocomplete-results {
  position: relative;
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  min-height: 1em;
  max-height: 6em;
  overflow: auto;
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
