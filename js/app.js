window.addEventListener('load', function(){

	init();

	//create event
	(function(){
		var create = document.getElementById('create');
		create.addEventListener('click',function(){
			UI.enterWriteMode();
		});
	})();



	//save event
	(function(){
		var save = document.getElementById('save');
		save.addEventListener('click',function(){
			var title = document.getElementById('input-title').value;
			if(!title){

			}else{
				var content = document.getElementById('input-content').value;
				Storage.storeArticle(title,content);
				updateList();
			}
		});
	})();

	//list click event
	(function(){
		var ul = document.querySelector('.list ul');
		ul.addEventListener('click',function(event){
			console.log(event.target);
			if(event.target.tagName.toLowerCase() == 'p'){
				UI.enterViewMode();
				updateContent(event.target.innerText);
			}
		},true);
	})();

	//full screen
	(function(){
		var fullScreen = document.getElementById('full-screen');
		fullScreen.addEventListener('click',function(){
			enterFullSrceenMode();
		});
	})();


	// exit full screen
	(function(){
		var exit = document.getElementById('exit');
		exit.addEventListener('click',function(){
			exitFullScreenMode();
		});
	})();

	// edit
	(function(){
		var edit = document.getElementById('edit');
		edit.addEventListener('click',function(){
			var title = document.getElementById('title').innerText;
			Content.continueEdit(title);
		});
	})();


	//view notebook
	(function(){
		var notebook = document.getElementById('note-book');
		notebook.addEventListener('click',function(){
			NoteBook.viewNoteBookList();
		});
	})();

	// new notebook 点击创建新笔记本后的事件
	(function(){
		var newnotebook = document.getElementById('new-notebook');
		newnotebook.addEventListener('click',function(){
			NoteBook.enterAddNoteBookPage();
		});
	})();

	//创建笔记本页面输入框的事件
	(function(){
		var noteBookNameInputer = document.getElementById('input-notebook-name');
		noteBookNameInputer.addEventListener('input',function(){
			var newNotebookConfirm = document.getElementById('newnotebook-confirm');
			if(this.value){
				newNotebookConfirm.classList.remove('disable');
				newNotebookConfirm.classList.add('enable');
			}else{
				newNotebookConfirm.classList.remove('enable');
				newNotebookConfirm.classList.add('disable');
			}
		});
	})();

	//创建笔记本时候，点击取消后的事件

	(function(){
		var newNotebookCancal = document.getElementById('newnotebook-cancal');
		newNotebookCancal.addEventListener('click',function(){
			NoteBook.quitAddNoteBookPage();
		});
	})();

	//创建笔记本时候，点击确定后的事件
	(function(){
		var newNotebookConfirm = document.getElementById('newnotebook-confirm');
		newNotebookConfirm.addEventListener('click',function(){
			if(this.classList.contains('enable')){
				NoteBook.addNoteBook();	
			}
		});
	})();


	// 点击侧边栏的笔记图标显示笔记列表
	(function(){
		var sidebarNote = document.getElementById('sidebar-note');
		sidebarNote.addEventListener('click',function(){
			NoteList.viewNoteList();
		});
	})();

});



var NoteBook = {
	isNoteListChanged:false,
	isNoteListInit:false
};

NoteBook.enterAddNoteBookPage = function(){
	var newnotebookpopup = document.getElementById('new-notebook-popup');
	newnotebookpopup.style.display = 'block';
};

NoteBook.quitAddNoteBookPage = function(){
	var noteBookNameInputer = document.getElementById('input-notebook-name');
	noteBookNameInputer.value = "";
	var newNotebookPopup = document.getElementById('new-notebook-popup');
	newNotebookPopup.style.display = 'none';
};

NoteBook.addNoteBook = function(){
	var noteBookNameInputer = document.getElementById('input-notebook-name');
	var newNoteBookName = noteBookNameInputer.value;
	Storage.addNoteBook(newNoteBookName);
	NoteBook.quitAddNoteBookPage();
	this.isNoteListChanged = true;
	NoteBook.viewNoteBookList();
};

NoteBook.viewNoteBookList = function(){
	if(this.isNoteListInit==false ||(this.isNoteListInit == true && this.isNoteListChanged == true)){
		var notebooklist = Storage.getNoteBookList();
		var listTemplete = document.querySelector('#notebook-list-templete>li');
		var ul = document.getElementById('notebook-list-target-ul');
		ul.innerHTML = '';
		notebooklist.forEach(function(notebookName, index){
			var li = listTemplete.cloneNode(true);
			var p = li.querySelector('p');
			p.innerHTML = notebookName;
			ul.appendChild(li);		
		});
		this.isNoteListInit = true;
		this.isNoteListChanged = false;
	}
	var notebookElem = document.getElementById('notebook-list');
	var noteListElem = document.getElementById('note-list');
	if(WY.getStyle(notebookElem,'display')=='none'){
		notebookElem.style.display = 'block';
		noteListElem.style.display = 'none';
	}

};

var UI = {};

UI.enterWriteMode = function(){
	WY.replaceClass(document.body,'writeMode','viewMode');
	var view = document.getElementById('view');
	var write = document.getElementById('write');
	view.style.display = 'none';
	write.style.display = 'block';		
};
UI.enterViewMode = function(){
	WY.replaceClass(document.body,'viewMode','writeMode')
	var view = document.getElementById('view');
	var write = document.getElementById('write');
	view.style.display = 'block';
	write.style.display = 'none';
};


UI.init = function(){
		updateList();
	var	list = Storage.getArticleList();
	if(list.length > 0){
		updateContent(list[0]);
	}
};


function enterWriteMode(){
	var view = document.getElementById('view');
	var write = document.getElementById('write');
	view.style.display = 'none';
	write.style.display = 'block';	
}

function enterFullSrceenMode(){
	document.body.setAttribute('id', 'fullScreenMode');
}
function exitFullScreenMode(){
	document.body.removeAttribute('id');
}





function getTitie(li){
	return li.firstElementChild.innerText;
}

function init(){
	updateList();
	var	list = Storage.getArticleList();
	if(list.length > 0){
		updateContent(list[0]);
	}
}

function continueEdit(title){
	UI.enterWriteMode();
	document.getElementById('input-title').value = title;
	document.getElementById('input-content').value = Storage.getArticle(title);
}

function updateContent(title){
	var ct = document.getElementById('content');
	var ti = document.getElementById('title');
	ti.innerHTML = title;
	ct.innerHTML = marked(Storage.getArticle(title));
}

var NoteList = {};

var Content = {};

Content.continueEdit = function(title){
	UI.enterWriteMode();
	document.getElementById('input-title').value = title;
	document.getElementById('input-content').value = Storage.getArticle(title);

}

Content.updateContent =function(title){
	var ct = document.getElementById('content');
	var ti = document.getElementById('title');
	ti.innerHTML = title;
	ct.innerHTML = marked(Storage.getArticle(title));	
}



NoteList.viewNoteList =function(NoteBookName){
	if(arguments.length == 0){
		var	list = Storage.getArticleList();
		if(list.length == 0){
			return;
		}
		var noteCount = document.getElementById('note-count');
		noteCount.innerText = ''+list.length;
		var ul = document.getElementById('note-list-target-ul');
		ul.innerHTML = '';
		list.forEach(function(element, index){
			ul.innerHTML += createAList(element);
		});
	}
	var notebookElem = document.getElementById('notebook-list');
	var noteListElem = document.getElementById('note-list');
	if(WY.getStyle(noteListElem,'display')=='none'){
		notebookElem.style.display = 'none';
		noteListElem.style.display = 'block';
	}
}

function updateList(){
	var	list = Storage.getArticleList();
	if(list.length == 0){
		return;
	}
	var noteCount = document.getElementById('note-count');
	noteCount.innerText = ''+list.length;
	var ul = document.querySelector('.note-list .list ul');
	ul.innerHTML = '';
	list.forEach(function(element, index){
		ul.innerHTML += createAList(element);
	});
}

function createAList(content){
	return '<li><p>'+content+'</p></li>'; 
}


var Storage = {};

Storage.storeArticle = function(title,content){
	var list = localStorage.getItem('title-list');	
	if(list === null){
		localStorage.setItem('title-list',title);
	}else{
		if(!Storage.isExists(title)){
			localStorage.setItem('title-list',title+'&&&'+list);
		}	
	}
	localStorage.setItem(title,content);
}

Storage.getArticleList = function(){
	var listStr = localStorage.getItem('title-list');
	if(listStr){
		var list = listStr.split('&&&');
		return list;
	}else{
		return [];
	}
};

Storage.getArticle = function(title){
	return localStorage.getItem(title);
};

Storage.deleteArticle = function(title){
	var listStr = localStorage.getItem('title-list');
	listStr.replace(title+'&&&', '');
	localStorage.setItem('title-list',listStr);
	localStorage.removeItem(title);
};

Storage.isExists = function(title){
	var list = Storage.getArticleList();
	if(list.indexOf(title)!=-1){
		return true;
	}else{
		false;
	}
}

Storage.addNoteBook = function(bookName){
	var notebookTableName = 'notebook';
	var notebookStr = localStorage.getItem(notebookTableName);
	if(notebookStr){
		var notebooks = notebookStr.split('&&&');
		if(notebooks.indexOf(bookName)!=-1){
			return;   //已经存在了
		}
		notebookStr = bookName + '&&&' + notebookStr;
		localStorage.setItem(notebookTableName,notebookStr);
	}else{
		localStorage.setItem(notebookTableName,bookName);
	}
}	

Storage.getNoteBookList = function(){
	var notebookTableName = 'notebook';
	var notebookListStr = localStorage.getItem(notebookTableName);
	if(notebookListStr){
		return notebookListStr.split('&&&');
	}else{
		return [];
	}
}

var WY = {};

WY.getStyle = function(elem,styleName){
	var style = elem.currentStyle? elem.currentStyle : window.getComputedStyle(elem, null);
	return style[styleName];
}

WY.replaceClass = function(elem,newClass,oldClass){
	elem.classList.remove(oldClass);
	elem.classList.add(newClass);
}