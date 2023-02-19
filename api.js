import requests from "./request.js";
import menus from './menu.js';
import configs from "./config.js";
import axios from 'axios';

async function getPrivateDomain(){
	const domainRequest = (await requests.GETRequest(configs.getMirror(true) + "/")).data.split("\n");
        const domains = domainRequest.find(line=>line.includes("const domainsList"));
        const domainList = JSON.parse(domains.slice(domains.indexOf("["), -1));
        configs.setPersonalDomain("https://" + domainList[0]);
        return true;
}
/**
 * @params username {string}
 * @params password {string}
 */
async function login(email, password){
	const response = await requests.POSTRequest("/eapi/user/login", {email, password});	
	if(response.data.success != 1){
		await menus.errorPrompt(JSON.stringify(response.data))
		return false;
	}
	configs.login(response.data.user.id.toString(), response.data.user.remix_userkey);
	await getPrivateDomain();
	return true;
}
async function signup(email, password, name){
	const response = await requests.POSTRequest("/eapi/user/registration", {email, password, name});
	if(response.data.success != 1){
		await menus.errorPrompt(JSON.stringify(response.data));
		return false;
	}
	configs.login(response.data.user.id.toString(), response.data.user.remix_userkey);
	await getPrivateDomain();
	return true;
}
async function search(searchData){
	const response = await requests.POSTRequest("/eapi/book/search", searchData);
	if(response.data.success != 1){
		await menus.errorPrompt(JSON.stringify(response.data))
		return false;
	}
	return response.data;
}
function logout(){
	configs.logout();
	return true;
}
async function getDownloadLink(id, hash){
	let response = (await requests.GETRequest(`/eapi/book/${id}/${hash}/file`)).data;
	if(!response.file){
		return false;
	}
	response.filename = configs.getDownloadPath() + "/" + response.file.description.replaceAll(/\.| |\\|\/|\:/g, "") + "." + response.file.extension; 
	console.log(response);
	return response;
}
async function downloadFile(url){
	let response = await requests.download(url);
	return Buffer.from(response.data, 'binary');
}
export default {login, logout, signup, search, getDownloadLink, downloadFile};
