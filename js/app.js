window.addEventListener('load', function(){

	UI.init();

	// 点击创建笔记按钮之后的事件
	//new Note
	(function(){
		var create = document.getElementById('create');
		create.addEventListener('click',function(){
			UI.enterWriteMode();
			document.getElementById('input-title').value ='';
			document.getElementById('input-content').value = '';
			var category = document.getElementById('category');
			category.innerHTML = '未分类';
			Content.currentProcNoteName = null;
			Content.state = 'edit';
		});
	})();


	// new notebook 点击创建新笔记本后的事件
	(function(){
		var newnotebook = document.getElementById('new-notebook');
		newnotebook.addEventListener('click',function(){
			NoteBook.enterAddNoteBookPage();
		});

	})();




	//save note
	(function(){
		var save = document.getElementById('save');
		save.addEventListener('click',function(){
			var title = document.getElementById('input-title').value;
			if(title){
				var content = document.getElementById('input-content').value;
				var category = document.getElementById('category').innerHTML;
				if(title != Content.currentProcNoteName){ //修改了笔记的名字
					Storage.storeNote(title,content,category,Content.currentProcNoteName);
				}else{
					Storage.storeNote(title,content,category);					
				}
				Content.currentProcNoteName = title;
				NoteList.updateList();
				UI.enterViewMode();
				UI.updateContent(title);
			}
		});
	})();

	//edit note
	(function(){
		var edit = document.getElementById('edit');
		edit.addEventListener('click',function(){
			UI.editNote(Content.currentProcNoteName);
			Content.currentProcNoteName = document.getElementById('input-title').value;
		});
	})();


	//list click event	和 删除笔记事件，点击列表中删除笔记后的动作
	(function(){
		var ul = document.querySelector('.list ul');
		ul.addEventListener('click',function(event){
			var clickTag = event.target.tagName.toLowerCase();
			if(clickTag == 'p'){
				var selected = document.getElementsByClassName('list-selected');
				if(selected.length>0){
					selected[0].classList.remove('list-selected');
				}
				event.target.classList.add('list-selected');
				UI.enterViewMode();
				UI.updateContent(event.target.innerHTML);
				Content.currentProcNoteName = event.target.innerHTML;
				CategorySelectList.updateList();//Content.currentProcNoteName
			}else if(clickTag == 'i'){
				function getDeleteNoteNameElem(i){
					var p = i.parentNode.parentNode.parentNode.parentNode.firstElementChild;
					return p;
				}
				var noteName = getDeleteNoteNameElem(event.target).innerHTML;
				UI.enterDeleteNotePage(noteName);
				Content.readyToDeleteNoteName = noteName;
			}
		},true);
	})();

	(function(){
		var deleteNoteOp = document.getElementById('delete-note-op');
		deleteNoteOp.addEventListener('click',function(event){
			var opType = event.target.getAttribute('id') ; 
			if(opType == 'delete-note-delete'){
				//delete
				Storage.deleteNote(Content.readyToDeleteNoteName);
				UI.quitDeleteNotePage();
				NoteList.updateList();
				UI.updateContent();
			}else if(opType == 'delete-note-cancel'){
				//cacel
				UI.quitDeleteNotePage();
			}
			Content.readyToDeleteNoteName='';
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

	

	//view notebook
	(function(){
		var notebook = document.getElementById('note-book');
		notebook.addEventListener('click',function(){
			UI.updateNoteBookList();
			Content.currentNoteBook = null;
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
				overTitle.innerHTML = title.innerHTML;
			}else{
				overTitle.innerHTML = '';
			}
		});
	})();


	// 点击笔记本列表的事件，这个时候应该切换到笔记列表，并且显示本笔记本下的笔记
	//以及点击列表中的删除和编辑按钮时的事件
	(function(){
		var ul = document.getElementById('notebook-list-target-ul');
		ul.addEventListener('click',function(event){
			if(event.target.tagName.toLowerCase() == 'p'){
				var noteBookName = event.target.innerHTML;
				Content.currentNoteBook = noteBookName;
				NoteList.viewNoteList(noteBookName);
			}
			else if(event.target.tagName.toLowerCase() == 'i'){
				if(event.target.classList.contains('del')){ //delete nootbook
					Content.readyToDeleteNoteBookName = event.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
					UI.enterDeleteNoteBookPage();
					var deleteNotebookName = document.getElementById('delete-notebook-name');
					deleteNotebookName.innerHTML = Content.readyToDeleteNoteBookName;
				}else{ //edit

				}
				event.stopPropagation();
			}
		});

		(function(){
			var deleteNotebookDelete = document.getElementById('delete-notebook-delete');
			deleteNotebookDelete.addEventListener('click',function(){
				Storage.deleteNoteBook(Content.readyToDeleteNoteBookName);
				UI.quitDeleteNoteBookPage();
				UI.updateNoteBookList();
			});

			var  deleteNotebookCancel = document.getElementById('delete-notebook-cancel');
			deleteNotebookCancel.addEventListener('click',function(){
				UI.quitDeleteNoteBookPage();				
			});
		})();


	})();

	// 选择分类
	(function(){
		var selectCategory = document.getElementById('select-category');
		var dropDown = document.getElementById('drop-down');
		
		selectCategory.addEventListener('click',function(){
			WY.replaceClass(dropDown,'block','none');
		});

		var categorySelectList = document.getElementById('category-select-list');
		categorySelectList.addEventListener('click',function(event){
			var categoryName = event.target.innerHTML;
			var selected = document.getElementsByClassName('category-select');
			if(selected.length>0){
				selected[0].classList.remove('category-select');
			}
			event.target.parentNode.classList.add('category-select');
			document.getElementById('category').innerHTML = categoryName;
			event.stopPropagation();
		}) ;

		dropDown.addEventListener('mouseleave',function(){
			WY.replaceClass(this,'none','block');
		});
	})();



});


var Content = {
	readyToDeleteNoteName:'',
	currentNoteBook:null,
	currentNote:null,
	state:'view',
	currentProcNoteName:null
};


var NoteBook = {};

NoteBook.enterAddNoteBookPage = function(){
	var newnotebookpopup = document.getElementById('new-notebook-popup');
	WY.replaceClass(newnotebookpopup,'block','none');
};

NoteBook.quitAddNoteBookPage = function(){
	var noteBookNameInputer = document.getElementById('input-notebook-name');
	noteBookNameInputer.value = "";
	var newNotebookPopup = document.getElementById('new-notebook-popup');
	WY.replaceClass(newNotebookPopup,'none','block');
};

NoteBook.addNoteBook = function(){
	var noteBookNameInputer = document.getElementById('input-notebook-name');
	var newNoteBookName = noteBookNameInputer.value;
	Storage.addNoteBook(newNoteBookName);
	NoteBook.quitAddNoteBookPage();
	UI.updateNoteBookList();
};

NoteBook.moveNote = function(noteBookName,noteName){
	var noteList = Storage.getNoteList(noteBookName);
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

UI.init = function(){
	NoteList.updateList();
	var	list = Storage.getNoteList();
	if(list.length > 0){
		UI.updateContent(list[0]);
		Content.currentProcNoteName = list[0];
	}else{
		Content.currentProcNoteName = null;
		UI.updateContent();
	}
	CategorySelectList.updateList();
	Storage.addNoteBook('未分类');
};

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
	WY.replaceClass(view,'block','none');
	WY.replaceClass(write,'none','block');
};

UI.enterAddNoteBookPage = function(){
	var newnotebookpopup = document.getElementById('new-notebook-popup');
	newnotebookpopup.style.display = 'block';
};

UI.enterDeleteNotePage = function(title){
	var deleteNotePage = document.getElementById('delete-note-popup');
	deleteNotePage.style.display = 'block';
	var deleteNoteName = document.getElementById('delete-note-name');
	deleteNoteName.innerHTML = title;
}
UI.quitDeleteNotePage = function(){
	var deleteNotePage = document.getElementById('delete-note-popup');
	deleteNotePage.style.display = 'none';	
}

UI.enterDeleteNoteBookPage = function(){
	var deleteNotebookPopup = document.getElementById('delete-notebook-popup');
	deleteNotebookPopup.style.display = 'block';
};

UI.quitDeleteNoteBookPage = function(){
	var deleteNotebookPopup = document.getElementById('delete-notebook-popup');
	deleteNotebookPopup.style.display = 'none';
};

UI.enterFullSrceenMode = function(){
	document.body.setAttribute('id', 'fullScreenMode');
};
UI.exitFullScreenMode = function(){
	document.body.removeAttribute('id');
};

UI.editNote = function(noteName){
	UI.enterWriteMode();
	document.getElementById('input-title').value = noteName;
	document.getElementById('input-content').value = Storage.getNoteContent(noteName);

}

UI.updateContent =function(noteName){
	var ct = document.getElementById('content');
	var ti = document.getElementById('title');
	if(noteName){
		var note =  Storage.getNote(noteName);
		ti.innerHTML = note.title;
		ct.innerHTML = marked(note.content);
	}else{
		var noteList = Storage.getNoteList(Content.currentNoteBook);
		if(noteList.length > 0){
			var note =  Storage.getNote(noteList[0]);
			ti.innerHTML = note.title;
			ct.innerHTML = marked(note.content);
		}else{
			ti.innerHTML = '';
			ct.innerHTML = '';
		}
	}	
};

UI.updateNoteBookList = function(){
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
	var notebookElem = document.getElementById('notebook-list');
	var noteListElem = document.getElementById('note-list');
	if(WY.getStyle(notebookElem,'display')=='none'){
		WY.replaceClass(noteListElem,'none','block');
		WY.replaceClass(notebookElem,'block','none');
	}
};


var CategorySelectList = {};

CategorySelectList.updateList = function(){
	var list = Storage.getNoteBookList();
	var ul = document.getElementById('category-select-list');
	var li = document.getElementById('category-list-templete').firstElementChild;
	ul.innerHTML = '';
	list.forEach(function(notebookName, index){
		var li_ = li.cloneNode(true);
		li_.firstElementChild.innerHTML = notebookName;
		var noteList = Storage.getNoteList(notebookName);
		if(noteList.indexOf(Content.currentProcNoteName)!=-1){
			li_.classList.add('category-select');
			document.getElementById('category').innerHTML = notebookName;
		}
		ul.appendChild(li_);
	});
};



var NoteList = {};

NoteList.viewNoteList =function(NoteBookName){
	NoteList.updateList(NoteBookName);
	var notebookElem = document.getElementById('notebook-list');
	var noteListElem = document.getElementById('note-list');
	if(WY.getStyle(noteListElem,'display')=='none'){
		WY.replaceClass(notebookElem,'none','block');
		WY.replaceClass(noteListElem,'block','none');
	}
}

NoteList.createAList = function(text){
	var li_ = document.getElementById('note-list-templete').firstElementChild;
	var li = li_.cloneNode(true);
	var p = li.querySelector('p');
	p.innerHTML = text;
	return li;
};
NoteList.updateList = function(noteBookName){
	var	list = Storage.getNoteList(noteBookName);
	var noteCount = document.getElementById('note-count');
	noteCount.innerHTML = ''+list.length;
	var ul = document.getElementById('note-list-target-ul');
	ul.innerHTML = '';
	list.forEach(function(title, index){
		ul.appendChild(NoteList.createAList(title));
	});
	var noteListTitle = document.getElementById('note-list-title');
	if(noteBookName){
		noteListTitle.innerHTML = noteBookName;
	}else{
		noteListTitle.innerHTML = '笔记';
	}
}


var Storage = {};

function Note(title,content,category){
	this.title = title;	
	this.content = content;
	this.category = category || '未分类';
	this.createTime = (new Date()).toString();
}

Storage.storeNote = function(titleOrNote,content,category,oldNoteTitle){
	var note;
	if(titleOrNote instanceof Object){
		note = titleOrNote;
		localStorage.setItem(note.title,JSON.stringify(note));
	}else{
		var title = titleOrNote;
		var list = localStorage.getItem('notelist');
		if(!list){
			localStorage.setItem('notelist',title);
		}else{
			if(!Storage.isExists(title)){
				localStorage.setItem('notelist',''+title +'&&&'+list);
			}
		}
		note = new Note(title,content,category);
		localStorage.setItem(title,JSON.stringify(note));
	}
	Storage.addNoteToCategory(title,category);
	if(oldNoteTitle){
		Storage.deleteNote(oldNoteTitle);
	}
};

Storage.getNoteList = function(noteBookName){
	var list = [];
	var str;
	if( ! noteBookName){
		var str = localStorage.getItem('notelist');
	}else{
		str = localStorage.getItem('notebook_'+noteBookName);
	}
	if(str){
		list = str.split('&&&');
	}
	return list;
};

Storage.getNote = function(noteName){
	var note = JSON.parse(localStorage.getItem(noteName));
	return  note;
};

Storage.getNoteTitle = function(noteName){
	var note = Storage.getNote(noteName);
	return note.title;
}

Storage.getNoteContent = function(noteName){
	var note = Storage.getNote(noteName);
	return note.content;
}

Storage.getNoteCategory = function(noteName){
	var note = Storage.getNote(noteName);
	return note.category;
};

Storage.deleteNote = function(noteName){
	var listStr = localStorage.getItem('notelist');
	if(listStr.indexOf('&&&')!=-1){
		listStr = listStr.replace(noteName+'&&&', '');
	}else{
		listStr = '';
	}
	localStorage.setItem('notelist',listStr);
	var category = Storage.getNoteCategory(noteName);
	Storage.removeNotefromCategory(noteName,category);
	localStorage.removeItem(noteName);
};

Storage.isExists = function(noteName){
	var list = Storage.getNoteList();
	if(list.indexOf(noteName)!=-1){
		return true;
	}else{
		false;
	}
}

Storage.addNoteBook = function(bookName){
	var notebookStr = localStorage.getItem('notebook');
	if(notebookStr){
		var notebooks = notebookStr.split('&&&');
		if(notebooks.indexOf(bookName)!=-1){
			return;   //已经存在了
		}
		notebookStr = bookName + '&&&' + notebookStr;
	}else{
		notebookStr = bookName;
	}
	localStorage.setItem('notebook',notebookStr);
}	

Storage.getNoteBookList = function(){
	var notebookListStr = localStorage.getItem('notebook');
	if(notebookListStr){
		return notebookListStr.split('&&&');
	}else{
		return [];
	}
}

Storage.addNoteToCategory = function(title,category){
	var list = Storage.getNoteList(category);
	if(list.indexOf(title)==-1){
		list.push(title);
	}
	localStorage.setItem('notebook_'+category,list.join('&&&'));
};

Storage.removeNotefromCategory = function(title,category){
	var list = Storage.getNoteList(category);
	var index = list.indexOf(title);
	if(index!=-1){
		list.splice(index,1);
	}
	localStorage.setItem('notebook_'+category,list.join('&&&'));
};

Storage.deleteNoteBook = function(noteBookName){
	var noteList = Storage.getNoteList(noteBookName);
	noteList.forEach(function(noteName, index){
		var note = Storage.getNote(noteName);
		note.category = '未分类';
		console.log(note);
		Storage.storeNote(note);
	});
	localStorage.removeItem('notebook_'+noteBookName);
	var list = Storage.getNoteBookList();
	var index  = list.indexOf(noteBookName);
	if(index!=-1){
		list.splice(index,1);
	}
	localStorage.setItem('notebook',list.join('&&&'));
};

var WY = {};

WY.getStyle = function(elem,styleName){
	var style = elem.currentStyle? elem.currentStyle : window.getComputedStyle(elem, null);
	return style[styleName];
}

WY.replaceClass = function(elem,newClass,oldClass){
	elem.classList.remove(oldClass);
	elem.classList.add(newClass);
}
