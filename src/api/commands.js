export function getArguments(fullCommand) {
	let args = fullCommand.match(/(?:[^\s"]+|"[^"]*")+/g);
	if(!args) {
		args = [];
	}
	if(fullCommand.endsWith(' ')) {
		args.push(' ');
	}
	return args
}

export function setSelectedCommand(state, results){
	let args = getArguments(state.currentCommand);
  if (state.arrowCounter === -1) {
		args[args.length-1] = state.currentWord;
  } else {
		args[args.length-1] = results.value[state.arrowCounter].senseText;
  }
	state.currentCommand = args.join(' ');
}
