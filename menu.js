import Enquirer from 'enquirer';
import configs from './config.js';
import api from './api.js'
import vimShortcuts from './vim-shortcuts.js'
async function startMenu(){
	console.clear();
	let accountPrompt = configs.isLoggedIn()?"Sign out":"Log in/Sign up";
	const prompt = new Enquirer.Select({
		name: 'startmenu',
		message: 'What would you like to do?',
		choices: [accountPrompt, "Seach z-library", "Browse downloaded books", "settings"],
		actions:vimShortcuts
	});
	let result = await prompt.run();
	switch(result){
		case "Sign out": 
			api.logout();
			startMenu();
			break;
		case "Log in/Sign up":
			loginOptions();
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
async function loginOptions(){
	console.clear();
	const prompt = new Enquirer.Select({
		name: "loginMenu",
		message: "What would you like to do?",
		choices: ["Log in", "Sign up", "Log in with user key", "Back"],
		actions:vimShortcuts	
	});
	let result = await prompt.run();
	switch(result){
		case "Back": 
			startMenu();
			break;
		case "Log in":
			loginMenu();
			break;
		case "Sign up":
			break;
		case "Log in with user key":
			break;
	}
}
async function loginMenu(){
	console.clear();
	const prompt = new Enquirer.Form({
		name: "loginForm",
		message:"Login to Z-Library",
		choices: [
			{name: "mail", type: "input", message: "E-Mail", initial:"johndoe@example.com"},
			{name:"password", type: "password", message: "Password", initial:"your password"}
		]
	})
	const response = await prompt.run();
	await api.login(response.mail, response.password);
	startMenu();
}
function openDownloads(){}
/**
* @param error {string}
*/
async function errorPrompt(error){
	const prompt = new Enquirer.Toggle({
		message: "Error: " + error,
		enabled:"Ok",
		disabled: "Ok"
	});
	await prompt.run();
}
startMenu();
export default {errorPrompt};
