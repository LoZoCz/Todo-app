const themeBtn = document.querySelector(".theme-btn");
const createInp = document.querySelector(".task-inp");
const todoWrapper = document.querySelector(".todo-wrapper");
const numberOfTodo = document.querySelector(".tasks-num");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearBtn = document.querySelector(".clear-btn");

let todoIndex = 1;

// Theme changer
function changeUserTheme() {
  const userTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  if (userTheme == "dark") {
    themeBtn.childNodes[1].style.transform = "translateX(-1.625rem)";
    themeBtn.childNodes[3].style.transform = "translateX(-1.625rem)";
  } else {
    themeBtn.childNodes[1].style.transform = "translateX(0rem)";
    themeBtn.childNodes[3].style.transform = "translateX(0rem)";
  }

  themeBtn.setAttribute("data-theme", userTheme);
}

function themeChanger() {
  let themeState = themeBtn.getAttribute("data-theme");

  if (themeState == "light") {
    themeBtn.setAttribute("data-theme", "dark");
    themeBtn.childNodes[1].style.transform = "translateX(-1.625rem)";
    themeBtn.childNodes[3].style.transform = "translateX(-1.625rem)";
  } else {
    themeBtn.setAttribute("data-theme", "light");
    themeBtn.childNodes[1].style.transform = "translateX(0rem)";
    themeBtn.childNodes[3].style.transform = "translateX(0rem)";
  }
}

//Creating new todo
function createNewTodo() {
  let todoContent = createInp.value;

  if (todoContent == "") {
    return;
  }

  let newTodo = document.createElement("div");

  newTodo.classList.add("task-box");
  newTodo.classList.add(`task-${todoIndex}`);
  newTodo.classList.add("active");
  newTodo.setAttribute("draggable", "true");

  newTodo.innerHTML = `
    <div class="task-info">
        <input type="checkbox" class="task-inp-check" />
        <p class="task-content">${todoContent}</p>
    </div>
    <button class="delete-task-btn btn">
        <img src="images/icon-cross.svg" alt="" />
    </button>`;

  todoWrapper.appendChild(newTodo);

  todoIndex++;

  createInp.value = "";

  const deleteBtns = document.querySelectorAll(".delete-task-btn");
  for (let btn of deleteBtns) {
    btn.addEventListener("click", () => {
      let btnTodo = btn.parentElement;
      btnTodo.remove();
      todoLeft();
    });

    listenersTodo();
  }

  const todoCheckboxes = document.querySelectorAll(".task-inp-check");
  //   const todoBoxes = document.querySelectorAll(".task-box");
  todoCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      let todoParent = checkbox.parentElement.parentElement;
      if (checkbox.checked) {
        todoParent.classList.add("completed");
        todoParent.classList.remove("active");
      } else {
        todoParent.classList.remove("completed");
        todoParent.classList.add("active");
      }
      todoLeft();
    });
  });
}

// Todo left
function todoLeft() {
  const activeTodo = document.querySelectorAll(".task-box.active");

  numberOfTodo.textContent = activeTodo.length;
}

//Filtering todo
function filteringTodo(e) {
  switch (e.target.classList[1]) {
    case "all-filter":
      filterBtns.forEach((filter) => {
        filter.setAttribute("aria-pressed", "false");
      });
      e.target.setAttribute("aria-pressed", "true");

      todoWrapper.childNodes.forEach((box) => {
        box.style.display = "flex";
      });
      break;
    case "active-filter":
      filterBtns.forEach((filter) => {
        filter.setAttribute("aria-pressed", "false");
      });
      e.target.setAttribute("aria-pressed", "true");

      todoWrapper.childNodes.forEach((box) => {
        if (box.classList.contains("active")) {
          box.style.display = "flex";
        } else {
          box.style.display = "none";
        }
      });
      break;
    case "completed-filter":
      filterBtns.forEach((filter) => {
        filter.setAttribute("aria-pressed", "false");
      });
      e.target.setAttribute("aria-pressed", "true");

      todoWrapper.childNodes.forEach((box) => {
        if (box.classList.contains("completed")) {
          box.style.display = "flex";
        } else {
          box.style.display = "none";
        }
      });
      break;
  }
}

// Clearing all todo
function clearAll() {
  const completedTodo = todoWrapper.querySelectorAll(".completed");
  completedTodo.forEach((todo) => todo.remove());
  todoLeft();
}

//Drag and drop todo
function listenersTodo() {
  const todoDivs = document.querySelectorAll(".task-box");
  todoDivs.forEach((todo) => {
    todo.addEventListener("dragstart", () => {
      setTimeout(() => todo.classList.add("dragging"), 0);
    });

    todo.addEventListener("dragend", () => todo.classList.remove("dragging"));
  });
}

const todoDrag = (e) => {
  e.preventDefault();
  const draggingItem = todoWrapper.querySelector(".dragging");
  const siblings = [
    ...todoWrapper.querySelectorAll(".task-box:not(.dragging)"),
  ];

  let nextSibling = siblings.find((sibling) => {
    const rect = sibling.getBoundingClientRect();
    return e.clientY <= rect.top + rect.height / 2;
  });

  todoWrapper.insertBefore(draggingItem, nextSibling);
};

todoWrapper.addEventListener("dragover", todoDrag);
todoWrapper.addEventListener("dragenter", (e) => e.preventDefault());

// Function call
changeUserTheme();

themeBtn.addEventListener("click", themeChanger);

createInp.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    createNewTodo();
    todoLeft();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", filteringTodo);
});

clearBtn.addEventListener("click", clearAll);
