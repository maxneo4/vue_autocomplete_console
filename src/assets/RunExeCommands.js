import { ref } from 'vue';

let paramOptions = [
  {senseText: "-server", defaultValue: "localhost\sql2019dev", senseOptions:[]},
  {senseText: "-userName", defaultValue: "sa", senseOptions:[]},
  {senseText: "-password", defaultValue: "sa", senseOptions:[]},
  {senseText: "-dbName", defaultValue: "Reboot", senseOptions:[]},
  {senseText: "-exeFile", defaultValue: "Export.exe", senseOptions:[{senseText:"createImport.exe"},
  {senseText: "export.exe"}]},
  {senseText: "-workspaceDir", defaultValue: "H:\git\BC.C\Source\BizAgiCollaboration\TestPublication\ProofConcept\bin\Debug_x64", senseOptions:[]}
];

const options = ref( [
        {senseText: "changeWorkSpaceDirectory", senseOptions:[ paramOptions[5] ]},
        {senseText: "runExe", senseOptions:[ paramOptions[4] ]},
        {senseText: "changeConnStringSqlServer", senseOptions:paramOptions.slice(0,3)},
        {senseText: "changeConnStringOracle", senseOptions:paramOptions.slice(0,2)},
        {senseText: "openConfigExe", senseOptions:[ paramOptions[4] ]}]);

export { options };
