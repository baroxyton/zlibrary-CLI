import requests from "./request.js";
import menus from './menu.js';
import configs from "./config.js";

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
async function signup(username, password, email){
}
function logout(){
	configs.logout();
	return true;
}
export default {login, logout, signup, search};
