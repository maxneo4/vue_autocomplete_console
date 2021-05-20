function getArguments(fullCommand) {
	let args = fullCommand.match(/(?:[^\s"]+|"[^"]*")+/g);
	if(!args) {
		args = [];
	}
	if(fullCommand.endsWith(' ')) {
		args.push(' ');
	}
	return args
}

function getCommandOptions(fullCommand, command, commands){
	let toFilter = commands;

	const foundCommand = commands.find(opt => opt.senseText === command);
  if(foundCommand){
    toFilter = foundCommand.senseOptions.filter(
	    (item) =>
	      fullCommand.toLowerCase().indexOf(item.senseText.toLowerCase()) === -1
	  );
  }

	return toFilter;
}

export function getTextCommandInfo(fullCommand, commands, caretPosition) {
	let args = getArguments(fullCommand);
	let command = args[0];
	let toFilter = getCommandOptions(fullCommand, command, commands);

	return {
		arguments: args,
		command: command,
		currentWord: args[args.length-1],
		optionsToAutoComplete: toFilter
	};
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
