window.addEventListener('load', function(){

	UI.init();

	//create event
	(function(){
		var create = document.getElementById('create');
		create.addEventListener('click',function(){
			UI.enterWriteMode();
			document.getElementById('input-title').value ='';
			document.getElementById('input-content').value = '';
			Content.currentNote = null;
			Content.state = 'edit';
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
				var category = document.getElementById('category').innerText;
				Storage.storeNote(title,content,category);
				NoteList.updateList();
				UI.enterViewMode();
				Content.updateContent(title);
			}
		});
	})();

	//list click event	和 删除笔记事件，点击列表中删除笔记后的动作
	(function(){
		var ul = document.querySelector('.list ul');
		ul.addEventListener('click',function(event){
			var clickTag = event.target.tagName.toLowerCase();
			if(clickTag == 'p'){
				if(Content.currentSelectList != event.target){
					if(Content.currentSelectList == ''){
						Content.currentSelectList = event.target;
					}else{
						Content.currentSelectList.classList.remove('list-selected');
					}
					Content.currentSelectList = event.target;
					Content.currentSelectList.classList.add('list-selected');
				}
				UI.enterViewMode();
				Content.updateContent(event.target.innerText);
				Content.currentNote = event.target.innerText;
			}else if(clickTag == 'i'){
				var noteName = getDeleteNoteNameElem(event.target).innerText;
				UI.enterDeleteNotePage(noteName);
				Content.readyToDeleteNoteName = noteName;
				if(Content.currentSelectList == getDeleteNoteNameElem(event.target)){
					Content.isNeedUpdateContent = true;
					Content.currentSelectList = "";
				}
				function getDeleteNoteNameElem(i){
					var p = i.parentNode.parentNode.parentNode.parentNode.firstElementChild;
					return p;
				}
			}
			console.log(event.target.tagName.toLowerCase());
		},true);
	})();

	(function(){
		var deleteNoteOp = document.getElementById('delete-note-op');
		deleteNoteOp.addEventListener('click',function(event){
			var opType = event.target.getAttribute('id') ; 
			if(opType == 'delete-note-delete'){
				//delete
				Content.deleteNote(Content.readyToDeleteNoteName);
				Content.readyToDeleteNoteName = '';
				UI.quitDeleteNotePage();
				NoteList.updateList();
				if( Content.isNeedUpdateContent== true){
					Content.updateContent();
					Content.isNeedUpdateContent = false;
				}

			}else if(opType == 'delete-note-cancel'){
				//cacel
				Content.readyToDeleteNoteName = '';
				UI.quitDeleteNotePage();
			}
		});
	})();



	//full screen
	(function(){
		var fullScreen = document.getElementById('full-screen');
		fullScreen.addEventListener('click',function(){
			UI.enterFullSrceenMode();
		});
	})();


	// exit full screen
	(function(){
		var exit = document.getElementById('exit');
		exit.addEventListener('click',function(){
			UI.exitFullScreenMode();
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
			Content.currentNoteBook = null;
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


	// 在编辑模式下如果标题向上滚动出了屏幕，那就把标题放在over-title
	(function(){
		var  view = document.getElementById('view');
		view.addEventListener('scroll',function(){
			var title = document.getElementById('title');
			var overTitle = document.getElementById('over-title');
			if(view.scrollTop > title.parentNode.clientHeight){
				overTitle.innerText = title.innerText;
			}else{
				overTitle.innerText = '';
			}
		});
	})();


	// 点击笔记本列表的事件，这个时候应该切换到笔记列表，并且显示本笔记本下的笔记
	(function(){
		var ul = document.getElementById('notebook-list-target-ul');
		ul.addEventListener('click',function(event){
			if(event.target.tagName.toLowerCase() == 'p'){
				var noteBookName = event.target.innerText;
				Content.currentNoteBook = noteBookName;
				NoteList.viewNoteList(noteBookName);
			}
		});
	})();

	// 选择分类
	(function(){
		var selectCategory = document.getElementById('select-category');
		var dropDown = document.getElementById('drop-down');
		
		selectCategory.addEventListener('click',function(){
			dropDown.style.display = 'block';
			CategorySelectList.updateList();
		});

		var categorySelectList = document.getElementById('category-select-list');
		categorySelectList.addEventListener('click',function(event){
			var categoryName = event.target.innerText;
			var noteName = Content.currentNote;
			NoteBook.moveNote(categoryName,noteName);
			event.target.parentNode.classList.add('category-select');
			document.getElementById('category').innerText = categoryName;
		}) ;

		dropDown.addEventListener('mouseleave',function(){
			this.style.display = 'none';
		})
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

NoteBook.moveNote = function(noteBookName,noteName){
	var noteList = localStorage.getItem('notebook_'+noteBookName);
	if(noteList){
		var ls = noteList.split('&&&');
		if(ls.indexOf(noteName)==-1){
			noteList = noteName + '&&&' + noteList;
			localStorage.setItem('notebook_'+noteBookName,noteList);
		}
	}else{
		localStorage.setItem('notebook_'+noteBookName,noteName);
	}
}


var UI = {};

UI.enterWriteMode = function(){
	WY.replaceClass(document.body,'writeMode','viewMode');
	var view = document.getElementById('view');
	var write = document.getElementById('write');
	WY.replaceClass(view,'none','block');
	WY.replaceClass(write,'block','none');
};
UI.enterViewMode = function(){
	WY.replaceClass(document.body,'viewMode','writeMode')
	var view = document.getElementById('view');
	var write = document.getElementById('write');
	view.style.display = 'block';
	write.style.display = 'none';
};


UI.init = function(){
	NoteList.updateList();
	var	list = Storage.getNoteList();
	if(list.length > 0){
		Content.updateContent(list[0]);
		Content.currentNote = list[0];
	}
	CategorySelectList.updateList();
};

var CategorySelectList = {};

CategorySelectList.updateList = function(){
	var list = Storage.getNoteBookList();
	var ul = document.getElementById('category-select-list');
	var li = document.getElementById('category-list-templete').firstElementChild;
	ul.innerHTML = '';
	list.forEach(function(notebookName, index){
		var li_ = li.cloneNode(true);
		li_.firstElementChild.innerText = notebookName;
		var noteList = Storage.getNoteList(notebookName);
		if(noteList.indexOf(Content.currentNote)!=-1){
			li_.classList.add('category-select');
			document.getElementById('category').innerText = notebookName;
		}
		ul.appendChild(li_);
	});
};

UI.enterAddNoteBookPage = function(){
	var newnotebookpopup = document.getElementById('new-notebook-popup');
	newnotebookpopup.style.display = 'block';
};

UI.enterDeleteNotePage = function(title){
	var deleteNotePage = document.getElementById('delete-note-popup');
	deleteNotePage.style.display = 'block';
	var deleteNoteName = document.getElementById('delete-note-name');
	deleteNoteName.innerText = title;
}
UI.quitDeleteNotePage = function(){
	var deleteNotePage = document.getElementById('delete-note-popup');
	deleteNotePage.style.display = 'none';	
}

UI.enterFullSrceenMode = function(){
	document.body.setAttribute('id', 'fullScreenMode');
};
UI.exitFullScreenMode = function(){
	document.body.removeAttribute('id');
};



var NoteList = {};

var Content = {
	readyToDeleteNoteName:'',
	currentSelectList:'',
	currentNoteBook:null,
	currentNote:null,
	state:'view'
};

Content.continueEdit = function(title){
	UI.enterWriteMode();
	document.getElementById('input-title').value = title;
	document.getElementById('input-content').value = Storage.getNote(title);

}

Content.updateContent =function(title){
	var ct = document.getElementById('content');
	var ti = document.getElementById('title');
	if(title){
		ti.innerHTML = title;
		var note = JSON.parse(Storage.getNote(title));
		ct.innerHTML = marked(note.content);
	}else{
		var list = Storage.getNoteList(Content.currentNoteBook);
		if(list.length > 0){
			ti.innerHTML = list[0];
			var note = JSON.parse(Storage.getNote(list[0]));
			ct.innerHTML = marked(note.content);
		}
	}	
}

Content.deleteNote = function(noteName){
	Storage.deleteNote(noteName);
};


NoteList.viewNoteList =function(NoteBookName){
	NoteList.updateList(NoteBookName);
	var notebookElem = document.getElementById('notebook-list');
	var noteListElem = document.getElementById('note-list');
	if(WY.getStyle(noteListElem,'display')=='none'){
		notebookElem.style.display = 'none';
		noteListElem.style.display = 'block';
	}
}

NoteList.createAList = function(text){
	var li_ = document.getElementById('note-list-templete').firstElementChild;
	var li = li_.cloneNode(true);
	var p = li.querySelector('p');
	p.innerText = text;
	return li;
};
NoteList.updateList = function(noteBookName){
	var	list = Storage.getNoteList(noteBookName);
	var noteCount = document.getElementById('note-count');
	noteCount.innerText = ''+list.length;
	var ul = document.getElementById('note-list-target-ul');
	ul.innerHTML = '';
	list.forEach(function(element, index){
		ul.appendChild(NoteList.createAList(element));
	});
	var noteListTitle = document.getElementById('note-list-title');
	if(noteBookName){
		noteListTitle.innerText = noteBookName;
	}else{
		noteListTitle.innerText = '笔记';
	}
}


var Storage = {};

Storage.storeNote = function(title,content,category){
	var list = localStorage.getItem('title-list');
	if(list === null){
		localStorage.setItem('title-list',title);
	}else{
		if(!Storage.isExists(title)){
			localStorage.setItem('title-list',title+'&&&'+list);
		}
	}
	if(!category){
		category = '未分类';
	}
	var time = new Date();
	var note = {
		'title':title,
		'content':content,
		'category':category,
		'time':time
	};
	localStorage.setItem(title,JSON.stringify(note));
}

Storage.getNoteList = function(noteBookName){
	var list = [];
	var str;
	if(noteBookName == null){
		var str = localStorage.getItem('title-list');
	}else{
		str = localStorage.getItem('notebook_'+noteBookName);
	}
	if(str){
		list = str.split('&&&');
	}
	return list;
};

Storage.getNote = function(title){
	//JSON.stringify()
	return  localStorage.getItem(title);
};

Storage.getNoteCategory = function(title){
	return localStorage.getItem(title);
};

Storage.deleteNote = function(title){
	var listStr = localStorage.getItem('title-list');
	listStr = listStr.replace(title+'&&&', '');
	localStorage.setItem('title-list',listStr);
	localStorage.removeItem(title);
};

Storage.isExists = function(title){
	var list = Storage.getNoteList();
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
