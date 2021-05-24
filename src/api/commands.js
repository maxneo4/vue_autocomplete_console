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

function getCommandOptions(fullCommand, command, commands, args){
	let toFilter = commands;

	if(args.length > 1){
			const foundCommand = commands.find(opt => opt.senseText === command);
		  if(foundCommand){
				let options = foundCommand.senseOptions;
				let parameter =  args.length > 2? args[args.length - 2] : '';
				const foundParam = foundCommand.senseOptions.find(opt => opt.senseText === parameter);
				if(foundParam){
					options = foundParam.senseOptions;
				}else if(args.length % 2 != 0){
					options = [];
				}
		    toFilter = options.filter(
			    (item) =>
			      fullCommand.toLowerCase().indexOf(item.senseText.toLowerCase()) === -1
			  );
		  }
	}

	return toFilter;
}

export function getTextCommandInfo(fullCommand, commands, caretPosition) {
	let args = getArguments(fullCommand);
	let command = args[0];
	let toFilter = getCommandOptions(fullCommand, command, commands, args);

	return {
		arguments: args,
		command: command,
		currentWord: args[args.length-1],
		optionsToAutoComplete: toFilter,
		endsWithSpace: fullCommand.endsWith(' ')
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

export function setClickedCommand(state, result){
	let args = getArguments(state.currentCommand);
  args[args.length-1] = result.senseText;
	state.currentCommand = args.join(' ');
}
