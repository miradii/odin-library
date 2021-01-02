/*Data*/
function Book(name, author, pages, readStatus, key) {
	(this.name = name),
		(this.author = author),
		(this.pages = pages),
		(this.readStatus = readStatus),
		(this.key = key);
}
let library = [];
/*localStorage*/
/*utils*/
const upperFirst = (str) => str.split("")[0].toUpperCase().concat(str.slice(1));
const toTitleCase = (str) =>
	str
		.split(" ")
		.map((word) => upperFirst(word))
		.join(" ");

const removeElement = (array, key) => array.filter((e) => e.key != key);
/*all about the add Modal*/
const modal = document.getElementById("addModal");
const addBookBtn = document.getElementById("addBookBtn");
const closeModal = document.getElementById("closeModalBtn");

function showAddModal() {
	modal.style.display = "block";
}
function hideAddModal() {
	modal.style.display = "none";
}
addBookBtn.addEventListener("click", showAddModal);
closeModal.addEventListener("click", hideAddModal);
window.addEventListener("click", (e) => {
	if (e.target == modal) hideAddModal();
});

/* form processing */
const form = document.querySelector("form");

function processForm() {
	const Fd = new FormData(form);
	const book = new Book(
		toTitleCase(Fd.get("name").trim()),
		toTitleCase(Fd.get("author").trim()),
		Number(Fd.get("pages").trim()),
		Fd.get("read-status"),
		library.length * Math.random(100)
	);
	addNewBook(book);
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	processForm();
	form.reset();
	hideAddModal();
});
/*select tags*/
let selectedTag = "all";
function unselectTags() {
	const tagList = document.querySelectorAll(".tag-button");
	tagList.forEach((tag) => tag.classList.remove("selected-tag"));
}
function selectTag(tagButton) {
	unselectTags();
	tagButton.classList.add("selected-tag");
	selectedTag = tagButton.innerText;
	renderBooksByTag(tagButton.innerText);
}
document.querySelector(".tag-container").addEventListener("click", (e) => {
	if (e.target.getAttribute("class") == "tag-button") selectTag(e.target);
});
/* render books*/
const container = document.querySelector("#bookContainer");
function createBookTile(book) {
	const bookTile = document.createElement("div");
	bookTile.classList.add("booktile");
	bookTile.innerHTML = `
		<div class="remove-btn" id="removeBtn" data-index =${book.key}>&times</div>
     	<h3 class="booktitle">${book.name}</h3>                                           
        <h4 class="author">${book.author}</h4>                                                
        <h4 class="pages">${book.pages} pages</h4>                                                            
        <h4 class="shelf">${book.readStatus}</h4>`;
	return bookTile;
}
function removeBook(event) {
	console.log(event.target.getAttribute("id"));
	if (event.target.getAttribute("id") == "removeBtn") {
		const index = event.target.getAttribute("data-index");
		event.target.parentNode.remove();
		library = removeElement(library, index);
		console.log(library);
	}
}
function addNewBook(book) {
	library.push(book);
	renderBooksByTag(selectedTag);
}
function renderBookTile(book) {
	const bookTile = createBookTile(book);
	bookTile.addEventListener("click", (event) => removeBook(event));
	container.appendChild(bookTile);
}
function renderBooksByTag(tag) {
	const filterdLibrary =
		tag == "all"
			? library
			: library.filter((book) => book.readStatus == tag);
	while (container.firstChild) container.firstChild.remove();
	filterdLibrary.forEach((book) => renderBookTile(book));
}
