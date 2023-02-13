import Conf from 'conf';
import envPaths from 'env-paths';

const configPath = envPaths('zlibCLI').config;

const configSchema = {
	isLoggedIn: {type: 'boolean', default: false},
	installedBooks: {type: 'array', default: []},
	userid: {type: 'string', default: undefined},
	userkey: {type: 'string', default: undefined},
	domain: {type: 'string', default: 'https://1lib.ch'},
	lang: {type: 'string', default: 'EN'},
	downloadPath: {type: 'string', default: configPath + '/downloads'},
};

const config = new Conf ({projectName: 'zlibCLI', schema:configSchema});
function isLoggedIn(){
	return config.get("isLoggedIn"); 
}

/**
 * @param userid {string}
 * @param userkey {string}
 */
function login(userid, userkey){
	config.set("isLoggedIn", true);
	config.set("userid", userid);
	config.set("userkey", userkey);
	return;
}
function logout(){
	config.set("isLoggedIn", false);
	config.set("userid", "undefined");
	config.set("userkey", "undefined");
}
/**
 * @param bookID {number}
 */
function addDownloadedBook(bookID){
	let downloads = config.get("installedBooks");
	downloads.push(bookID);
	config.set("installedBooks", downloads);
}

/**
 * @param url {string}
 */
function setMirror(url){
	config.set("domain", url);
}

/**
 * @param lang {string}
 */
function setLang(lang){
	config.set("lang", lang);
}
function getLogin(){
	return {"remix-userid":config.get("userid"),"remix-userkey":config.get("userkey"), "cookie":`remix_userid=${config.get("userid")}; remix_userkey=${config.get("userkey")};`};
}
function getMirror(){
	return config.get("domain");
}

/**
 * @param bookid {number}
 */
function isBookInstalled(bookid){
	return config.get("installedBooks").includes(bookid);
}
function getLang(){
	return config.get("lang");
}
function getDownloadPath(){
	return config.get("downloadPath");
}
export default {isLoggedIn, login, logout, addDownloadedBook, setMirror, setLang, getLogin, getMirror, isBookInstalled, getLang, getDownloadPath};
