import Enquirer from 'enquirer';
function startMenu(){
	const prompt = new Enquirer.Select({
		name: 'color',
		message: 'What would you like to do?',
		choices: ["Log In/Sign up", "Seach z-library", "Browse downloaded books", "settings"]
	});
	let result = prompt.run();
	console.log(result)
}
startMenu();
