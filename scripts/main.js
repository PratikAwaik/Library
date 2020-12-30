let myLibrary = [];
const container = document.getElementById("container");
const newBookButton = document.querySelector("#new-book-btn");
const form = document.querySelector(".popup-form");
const addBookButton = document.getElementById("add-book-btn");
const cancelButton = document.getElementById("cancel-btn");

newBookButton.addEventListener("click", () => {
    form.style.display = "block";
});

addBookButton.addEventListener("click", () => {
    addBookToLibrary();
    displayBook(myLibrary[myLibrary.length - 1]);
    clearInputs();
    form.style.display = "none";
});

cancelButton.addEventListener("click", () => {
    clearInputs();
    form.style.display = "none";
});

// Book Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary() {
    // get data from the form
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const read = document.getElementById("read").checked;

    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);

    updateLocalStorage();
}

function displayBook(book) {
    const index = myLibrary.indexOf(book);

    // create book card
    const div = document.createElement("div");
    div.classList.add("book-card");
    div.setAttribute("data-index", index);

    // add details of the book in book card
    const p = document.createElement("p");
    p.textContent = `${book["title"]}`;
    p.style.fontWeight = "bold";
    div.appendChild(p);
    const p1 = document.createElement("p");
    p1.textContent = `by ${book["author"]}`;
    div.appendChild(p1);
    const p2 = document.createElement("p");
    p2.textContent = `${book["pages"]} Pages`;
    div.appendChild(p2);

    const div2 = document.createElement("div");
    div2.classList.add("book-card-btns"); 

    // add read and remove buttons in book card
    const readButton = document.createElement("button");
    readButton.setAttribute("class", "read-btn");
    if (book["read"]) {
        readButton.textContent = "Read";
        readButton.style.backgroundColor = "rgb(24 132 8 / 60%)";
    }
    else {
        readButton.textContent = "Not Read";
        readButton.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
    }
    div2.appendChild(readButton); 

    const removeButton = document.createElement("button");
    removeButton.setAttribute("class", "remove-btn");
    removeButton.textContent = "Remove";
    div2.appendChild(removeButton);
    div.appendChild(div2);

    // add book card in container
    if (!container.hasChildNodes()) {
        container.appendChild(div);
    }
    else container.insertBefore(div, container.childNodes[0]);

    // alter the changes in the book and localStorage when read button is clicked 
    readButton.addEventListener("click", function() {
        const readText = this.textContent;
        if (readText === "Read") {
            this.textContent = "Not Read";
            const ind = this.parentElement.parentElement.getAttribute("data-index");
            const correspondingBook = myLibrary[ind];
            correspondingBook["read"] = false;
            readButton.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
            updateLocalStorage();
        }
        else {
            this.textContent = "Read";
            const ind = this.parentElement.parentElement.getAttribute("data-index");
            const correspondingBook = myLibrary[ind];
            correspondingBook["read"] = true;
            readButton.style.backgroundColor = "rgb(24 132 8 / 60%)";
            updateLocalStorage();
        }
    });

    // remove the book when button is clicked
    removeButton.addEventListener("click", function() {
        const parent = this.parentElement.parentElement;
        myLibrary.splice(parent.getAttribute("data-index"), 1);
        updateLocalStorage();
        container.removeChild(parent);
    });
} 

function displayAllBooks() {
    if (localStorage.length !== 0) {
        myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
        myLibrary.forEach((book) => {
            displayBook(book);
        });
    }
}

function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("pages").value = "";
    document.getElementById("read").checked = false;
}

function updateLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

window.onload = displayAllBooks;
