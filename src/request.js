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
	headers["User-Agent"] = "CLI";
	return await axios({
		method:"get",
		url:endpoint,
		baseURL:config.getMirror(),
		params:query,
		headers
	}).catch(err=>{return err.response});	
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
	headers["User-Agent"] = "CLI";
	
	return await axios({
		method:"post",
		url:endpoint,
		baseURL:config.getMirror(),
		data:params,
		headers
	}).catch(err=>{return err.response});
}
async function download(url){
let headers = {};
	if(config.isLoggedIn()){
		headers = config.getLogin();
	}
	headers["User-Agent"] = "CLI";
	return await axios.get(url, {responseType: "arraybuffer", headers, onDownloadProgress:progressEvent=>{
		console.log(Math.floor(progressEvent.progress* 100) + "%")
	}});
}
export default {GETRequest, POSTRequest, download};
