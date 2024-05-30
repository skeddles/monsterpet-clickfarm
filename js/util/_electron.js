var electronPromptCallback;

function electronPrompt (text, callback) {
	electronPromptCallback = callback;
	document.querySelector('electronprompt').style.display = 'block';
	document.querySelector('electronprompt').querySelector('div').innerHTML = text;
	document.querySelector('electronprompt input').value = '';
	document.querySelector('electronprompt input').focus();

}

document.querySelector('electronprompt button').addEventListener('click', () => {
	electronPromptCallback(document.querySelector('electronprompt input').value);
	document.querySelector('electronprompt').style.display = 'none';
});