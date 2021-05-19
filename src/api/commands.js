export function getArguments(fullCommand) {
	let args = fullCommand.match(/(?:[^\s"]+|"[^"]*")+/g);
	if(args.length == 0) {
		return [];
	}
	return args
}
