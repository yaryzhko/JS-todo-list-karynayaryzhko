if (!localStorage.getItem("todo")) {
	localStorage.setItem("todo", JSON.stringify([]));
}

let todoLists = JSON.parse(localStorage.getItem("todo"));
let todoContainer = document.querySelector(".todo-app");

let newListInputBtn = document.querySelector(".add-todo-list__btn");
let newListInputLabel = document.querySelector(".add-todo-list__input");
newListInputBtn.addEventListener("click", handleNewListInput);
newListInputLabel.addEventListener("keyup", handleNewListInput);

document.addEventListener("click", toggleAddTodoListWindow);

document.addEventListener("click", toggleAddTodoItemWindow);

updateTodoList();

function handleNewListInput(e) {
	if (
		e.key === "Enter" ||
		[...e.target.classList].includes("add-todo-list__btn")
	) {
		if (newListInputLabel.value.length > 0) {
			newListInputLabel.parentElement.classList.toggle("active");
			addTodoList(newListInputLabel.value);
			newListInputLabel.value = "";
		}
	}
}

function toggleAddTodoListWindow(e) {
	const addTodoListWindow = document.querySelector(".add-todo-list__window");
	if (e.target === document.querySelector(".add-todo-list")) {
		addTodoListWindow.classList.toggle("active");
	} else if (e.target !== newListInputLabel) {
		addTodoListWindow.classList.remove("active");
	}
}

function toggleAddTodoItemWindow(e) {
	const addTodoItemWindows = document.querySelectorAll(
		".todo-list__add-item-window"
	);
	if ([...e.target.classList].includes("todo-list__add-item")) {
		addTodoItemWindows.forEach((window) => {
			if (window.id === e.target.parentNode.id) {
				window.classList.toggle("active");
			} else {
				window.classList.remove("active");
			}
		});
	} else if (![...e.target.classList].includes("todo-list__add-item-input")) {
		addTodoItemWindows.forEach((window) => {
			window.classList.remove("active");
		});
	}
}

function updateTodoList() {
	let addTodoListContainer = document.querySelector(".add-todo-list");
	todoContainer.innerHTML = "";
	todoLists.forEach((list) => {
		todoContainer.innerHTML += generateTodoListHTML(list);
	});
	document.querySelectorAll(".todo-list__add-item-input").forEach((label) => {
		label.addEventListener("keyup", handleAddItemInput);
	});
	document.querySelectorAll(".todo-list__add-item-btn").forEach((btn) => {
		btn.addEventListener("click", handleAddItemInput);
	});
	todoContainer.appendChild(addTodoListContainer);
}

function generateTodoListHTML(list) {
	return `
    <div class="todo-list" id="${list.id}">
      <div class="todo-list__title">
        <p class="todo-list__title-text">${list.title}</p>
        <button class="todo-list__delete-item-btn" onclick="deleteTodoList(${
					list.id
				})">
          <img src="img/trash.svg" alt="" />
        </button>
      </div>
      <ul class="todo-list__list">
        ${generateListItems(list.id)}
      </ul>
      <div class="todo-list__add-item " id="${list.id}">
        <p class="todo-list__add-item-btn-text">Add Item</p>
         <img class="todo-list__add-item-icon" src="img/plus-solid (1).svg" alt="" /> 
        <div class="todo-list__add-item-window" id="${list.id}">
          <input
            type="text"
            required
            placeholder="Input text"
            class="todo-list__add-item-input"
            id="${list.id}" />
						<button class="todo-list__add-item-btn" id="${list.id}">
							<img src="img/send.svg" alt="" />
						</button>
        </div>
      </div>
    </div>
  `;
}

function generateListItems(id) {
	let html = "";
	const list = todoLists.find((list) => list.id === id);
	if (list) {
		list.items
			.sort((a, b) => {
				if (a.completed && !b.completed) return 1;
				if (!a.completed && b.completed) return -1;
				return 0;
			})
			.forEach((listItem) => {
				html += generateListItemHTML(listItem);
			});
	}
	return html;
}

function generateListItemHTML(listItem) {
	return `<li class="todo-item__list-item" id="${listItem.id}">
    <p class="todo-item__list-item-text ${
			listItem.completed ? "completed" : ""
		}">${listItem.text}</p>
    <div class="list-item__actions">
      <button class="list-item__action list-item__action--complete" onclick="completeListItem(${
				listItem.id
			})">
        <img src="img/complete-icon.svg" alt="" />
      </button>
      <button class="list-item__action list-item__action--delete" onclick="deleteListItem(${
				listItem.id
			})">
        <img src="img/delete-icon.svg" alt="" />
      </button>
    </div>
  </li>`;
}

function addTodoList(todoListName) {
	todoLists.push({
		id: generateID(),
		title: todoListName,
		items: [],
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function deleteTodoList(id) {
	todoLists = todoLists.filter((list) => list.id !== id);
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function handleAddItemInput(e) {
	if (
		e.key === "Enter" ||
		[...e.target.classList].includes("todo-list__add-item-btn")
	) {
		const label = e.target.parentNode.querySelector("input");
		label.parentElement.classList.toggle("active");
		if (label.value.length > 0) {
			addListItem(label.id, label.value);
		}
	}
}

function addListItem(todoListId, listItemText) {
	const list = todoLists.find((list) => list.id === +todoListId);
	if (list) {
		list.items.push({
			id: generateID(),
			text: listItemText,
			completed: false,
		});
		localStorage.setItem("todo", JSON.stringify(todoLists));
		updateTodoList();
	}
}

function completeListItem(id) {
	todoLists.forEach((list) => {
		const item = list.items.find((item) => item.id === +id);
		if (item) {
			item.completed = !item.completed;
		}
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function deleteListItem(id) {
	todoLists.forEach((list) => {
		list.items = list.items.filter((item) => item.id !== id);
	});
	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

function editListItem(listItemId, newText) {}

function generateID() {
	return Date.now();
}

// Swap Lists

let grabId = null;
let ghost = null;
let active = null;
let hovering = null;

document.addEventListener("mousedown", (e) => {
	if (e.target.classList.contains("todo-list")) {
		e.preventDefault();

		grabId = e.target.id;

		// Ghost
		ghost = e.target.cloneNode(true);
		ghost.classList.add("ghost");
		active = e.target;
		active.classList.add("active");
		document.querySelector("body").appendChild(ghost);
		const boundingRect = ghost.getBoundingClientRect();
		ghost.style.transform = `translate(${
			e.clientX - boundingRect.width / 2
		}px, ${e.clientY}px)`;
		ghost.style.opacity = "0.5";
	}
});

// Ghost
document.addEventListener("mousemove", (e) => {
	if (ghost) {
		const boundingRect = ghost.getBoundingClientRect();
		ghost.style.transform = `translate(${
			e.clientX - boundingRect.width / 2
		}px, ${e.clientY}px)`;
		document.body.style.cursor = "grabbing";
	} else {
		document.body.style.cursor = "default";
	}

	const closestTodoList = e.target.closest(".todo-list");

	if (
		ghost &&
		closestTodoList &&
		closestTodoList !== hovering &&
		closestTodoList !== active
	) {
		if (hovering) {
			hovering.style.opacity = "1";
		}
		hovering = closestTodoList;
		hovering.style.opacity = "0.5";
	} else if (!closestTodoList && hovering) {
		hovering.style.opacity = "1";
		hovering = null;
	}
});

document.addEventListener("mouseup", (e) => {
	if (active) {
		active.classList.remove("active");
		active = null;
	}
	if (e.target.closest(".todo-list") && grabId) {
		swapLists(+grabId, +e.target.closest(".todo-list").id);
		grabId = null;
	}
	// Ghost
	if (ghost) {
		document.querySelector("body").removeChild(ghost);
		ghost = null;
	}
});

function swapLists(firstId, secondId) {
	let firstIndex = todoLists.findIndex((item) => item.id === firstId);
	let secondIndex = todoLists.findIndex((item) => item.id === secondId);

	if (firstIndex === -1 || secondIndex === -1) {
		return;
	}

	todoLists.splice(secondIndex, 0, todoLists.splice(firstIndex, 1)[0]);

	localStorage.setItem("todo", JSON.stringify(todoLists));
	updateTodoList();
}

// Swap List Items

let itemToSwap = null;
let itemGhost = null;

document.addEventListener("mousedown", (e) => {
	if (e.target.classList.contains("todo-item__list-item")) {
		e.preventDefault();
		itemToSwap = e.target;

		// Ghost
		itemGhost = itemToSwap.cloneNode(true);
		itemGhost.classList.add("ghost");
		document.querySelector("body").appendChild(itemGhost);
		itemGhost.style.opacity = "0.7";
		itemGhost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
	}
});

document.addEventListener("mousemove", (e) => {
	if (itemGhost) {
		itemGhost.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
	}
});

document.addEventListener("mouseup", (e) => {
	if (e.target.closest(".todo-item__list-item") && itemToSwap) {
		swapListItems(
			+itemToSwap.id,
			+e.target.closest(".todo-item__list-item").id
		);
	} else if (e.target.closest(".todo-list") && itemToSwap) {
		addItemToList(+itemToSwap.id, +e.target.closest(".todo-list").id);
	}

	itemToSwap = null;

	// Ghost
	if (itemGhost) {
		document.querySelector("body").removeChild(itemGhost);
		itemGhost = null;
	}
});

function addItemToList(itemId, listId) {
	let itemToAdd = null;
	todoLists.forEach((list) => {
		list.items.forEach((item) => {
			if (item.id === itemId) {
				itemToAdd = list.items.splice(
					list.items.findIndex((i) => i === item),
					1
				)[0];
			}
		});
	});
	if (!itemToAdd) return;
	todoLists.forEach((list) => {
		if (list.id === listId) {
			addListItem(list.id, itemToAdd.text);
		}
	});
}

function swapListItems(firstId, secondId) {
	let firstItem, secondItem;

	todoLists.forEach((list) => {
		list.items.forEach((item) => {
			if (item.id === firstId) {
				firstItem = item;
			} else if (item.id === secondId) {
				secondItem = item;
			}
		});
	});

	if (firstItem && secondItem) {
		const temp = { ...firstItem };
		firstItem.text = secondItem.text;
		firstItem.completed = secondItem.completed;
		secondItem.text = temp.text;
		secondItem.completed = temp.completed;

		localStorage.setItem("todo", JSON.stringify(todoLists));
		updateTodoList();
	}
}



let todoThemeBtn = document.getElementById('todo-theme-btn');
let todoThemeImage = document.getElementById('todo-theme-image');
let todoListIcon = document.querySelector('.add-todo-list__icon')
let listIcon = document.querySelector('.todo-list__add-item-icon');



function setLightTheme() {
	document.body.classList.add('light')
        todoThemeImage.src = 'img/moon.png'
        todoListIcon.src = 'img/plus-solid.svg'
		listIcon.src = 'img/plus-solid.svg'
		localStorage.theme = 'light'
	

}
function setDarkTheme(){
	document.body.classList.remove('light')
		localStorage.theme = 'dark'
        todoThemeImage.src = 'img/sun.png'
        todoListIcon.src = 'img/plus-solid (1).svg'
		listIcon.src = 'img/plus-solid (1).svg'
		
}

todoThemeBtn.addEventListener('click', () => {
    if (document.body.classList.contains('light'))setDarkTheme()
	 else setLightTheme() 
})

if (localStorage.theme === 'light') setLightTheme()

