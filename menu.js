import Enquirer from 'enquirer';
import configs from './config.js';
import api from './api.js';
import vimShortcuts from './vim-shortcuts.js';
import fs from 'fs';
import open from 'open';

const sleep = ms => new Promise(r => setTimeout(r, ms));

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
		choices: ["Log in", "Sign up", "Log in with user key", "Update personal domain", "Back"],
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
			signupMenu();
			break;
		case "Log in with user key":
			tokenLoginMenu();
			break;
		case "Update personal domain":
			await api.getPrivateDomain();
			await startMenu();
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
async function signupMenu(){
        console.clear();
        const prompt = new Enquirer.Form({
                name: "signupForm",
                message:"Sign up to Z-Library",
                choices: [
                        {name: "mail", type: "input", message: "E-Mail", initial:"johndoe@example.com"},
                        {name: "name", type: "name", message: "User name", initial:"JohnDoe"},
                        {name:"password", type: "password", message: "Password", initial:"your password"}
                ]
        })
        const response = await prompt.run();
        await api.signup(response.mail, response.password, response.password);
        startMenu();
}
async function tokenLoginMenu(){
	console.clear();
	const prompt = new Enquirer.Form({
		name: "tokenLoginForm",
	message:"Log in with session token",
		choices: [
			{name:"id", type: "input", message:"Remix user id"},
			{name:"token", type: "input", message:"Remix user token"}
		]
	});
	const response = await prompt.run();
	await api.tokenLogin(response.id, response.token);
}

async function openDownloads(){
	open(configs.getDownloadPath());
	await startMenu();
}
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
	try{
		await viewBook(bookList.books[postToView.book]);
	}
	catch(err){
		await bookListMenu(bookList);
	}
}
async function viewBook(bookData){
	console.clear();
	let displayData = "";
	for(let data in bookData){
		displayData += `${data}: ${bookData[data]}\n`
	}
	console.log(displayData);
	const prompt = new Enquirer.Toggle({
		message:"Download book? ",
		name:"downloadBook",
		enabled:"Download",
		disabled:"Cancel"
	});	
	let answer = await prompt.run();
	if(!answer){
		throw new Error("download cancelled");
	}
	await downloadMenu(bookData.id, bookData.hash);
}
async function downloadMenu(id, hash){
	console.clear();
	console.log("fetching download link..");
	const downloadData = await api.getDownloadLink(id, hash);
	if(!downloadData.success == 1){
		console.log("Error", downloadData);
		await sleep(2000);
		throw new Error("downloadError");
	}
	console.log("Downloading file..");
	console.log("0%");
	const fileData = await api.downloadFile(downloadData.file.downloadLink);
	console.log("100%");

	let isDirectoryCreated = fs.existsSync(configs.getDownloadPath())
	if(!isDirectoryCreated){
		fs.mkdirSync(configs.getDownloadPath(), { recursive: false })
	}
	console.log("Saving file..");
	fs.writeFileSync(downloadData.filename, fileData);
	await startMenu();
	
}
startMenu();
export default {errorPrompt};
