import axios from 'axios';
import config from './config.js';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
* @param endpoint {string}
* @param {object}
*/
async function GETRequest(endpoint, query){
	let headers = {};
	if(config.isLoggedIn()){
		headers = config.getLogin();
	}
	return await axios({
		method:"get",
		url:endpoint,
		baseURL:config.getMirror(),
		params:query,
		headers
	})	
}
/**
* @param endpoint {string}
* @param params {object}
*/
async function POSTRequest(endpoint, params){
	let headers = {};
	if(config.isLoggedIn()){
		headers = config.getLogin();
	}
	headers["Content-Type"] = 'application/x-www-form-urlencoded';
	return await axios({
		method:"post",
		url:endpoint,
		baseURL:config.getMirror();
		data:params,
		headers
	})
}
export default {GETRequest, POSTRequest};
