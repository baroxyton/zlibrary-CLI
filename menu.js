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
		choices: [accountPrompt, "Search z-library", "Browse downloaded books", "settings"],
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
			await searchMenu();
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
async function searchMenu(){
	const prompt = new Enquirer.Form({
		name:"searchForm",
		message:"Search Z-Library",
		choices: [
		{name:"message", message:"Search term", initial:""},
		{name:"yearFrom", message:"Start Year", initial:"0"},
		{name:"yearTo", message:"End year", initial:String(new Date().getFullYear())},
		{name:"languages", message:"languages", initial:"english,german,french"}
		
		]
	});
	let answer = await prompt.run();
	answer.languages = answer.languages.split(",");
	answer.limit = 50
	answer.order = "popular";
	const response = await api.search(answer);
	try{
	await bookListMenu(response);
	}
	catch(err){
		await searchMenu();
	}
}
async function bookListMenu(bookList){
	const promptChoices = bookList.books.map((book,index)=>{
		return {
		name:String(index),
		value:String(index),
		message: String(index + 1) + "| " +book.title + " by " + book.author
		}	
	});
	const postToView = await Enquirer.prompt([{
		type:"select",
		name:"book",
		message:"Which book do you want to view?",
		initial:"0",
		choices:promptChoices,
		actions:vimShortcuts
	}]);
	
}
startMenu();
export default {errorPrompt};
