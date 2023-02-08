import Enquirer from 'enquirer';
import configs from './config.js';
import api from './api.js'
async function startMenu(){
	console.clear();
	let accountPrompt = configs.isLoggedIn()?"Sign out":"Log in/Sign up";
	const prompt = new Enquirer.Select({
		name: 'startmenu',
		message: 'What would you like to do?',
		choices: [accountPrompt, "Seach z-library", "Browse downloaded books", "settings"]
	});
	let result = await prompt.run();
	console.log("RESULT:" + result)
	switch(result){
		case "Sign out": 
			api.logout();
			startMenu();
			break;
		case "Log in/Sign up":
			loginMenu();
			break;
		case "Search z-library":
			searchMenu();
			break;
		case "Browse downloaded books":
			openDownloads();
			break;
		case "settings":
			settingsMenu();
			break;
	}
}
function settingsMenu(){

}
function searchMenu(){}
async function loginMenu(){
	console.clear();
	const prompt = new Enquirer.Select({
		name: "loginMenu",
		message: "What would you like to do?",
		choices: ["Log in", "Sign up", "Log in with user key", "Back"]
	});
	let result = await prompt.run();
	switch(result){
		case "Back": 
			startMenu();
			break;
	}
}
function openDownloads(){}
startMenu();
