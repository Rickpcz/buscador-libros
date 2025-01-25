const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");
const resultsDiv = document.getElementById("results");
const paginationDiv = document.getElementById("pagination");

let currentPage = 1;
const booksPerPage = 20;

// Evento para manejar la búsqueda
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  currentPage = 1;
  const query = searchInput.value.trim();
  const type = searchType.value;
  if (!query) return;
  fetchBooks(query, type, currentPage);
});

// Función para obtener libros
async function fetchBooks(query, type, page) {
  const startIndex = (page - 1) * booksPerPage;
  const url = `https://openlibrary.org/search.json?${type}=${encodeURIComponent(
    query
  )}&limit=${booksPerPage}&offset=${startIndex}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.docs);
    createPagination(data.numFound, page);
  } catch (error) {
    resultsDiv.innerHTML =
      "<p>Ocurrió un error al buscar. Por favor, intenta de nuevo.</p>";
    console.error(error);
  }
}

// Función para mostrar los resultados
function displayResults(books) {
  resultsDiv.innerHTML = "";
  if (books.length === 0) {
    resultsDiv.innerHTML = "<p>No se encontraron libros.</p>";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add(
      "shadow-md",
      "rounded-lg",
      "overflow-hidden",
      "bg-white"
    );

    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : null;

    bookElement.innerHTML = `
        <div class="relative w-full h-48 flex items-center justify-center bg-gray-200">
          ${
            coverUrl
              ? `<img src="${coverUrl}" alt="${book.title}" class="w-full h-full object-cover">`
              : `<p class="text-gray-500 text-sm">Imagen no disponible</p>`
          }
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2">${book.title}</h3>
          <p class="text-sm text-gray-700"><strong>Autor:</strong> ${
            book.author_name ? book.author_name.join(", ") : "Desconocido"
          }</p>
          <p class="text-sm text-gray-700"><strong>Año:</strong> ${
            book.first_publish_year || "Desconocido"
          }</p>
          <p class="text-sm text-gray-700"><strong>ISBN:</strong> ${
            book.isbn ? book.isbn.join(", ") : "No disponible"
          }</p>
        </div>
      `;
    resultsDiv.appendChild(bookElement);
  });
}

// Función para crear la paginación
function createPagination(totalBooks, currentPage) {
  paginationDiv.innerHTML = "";
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  // Definir el rango de páginas visibles
  const maxVisiblePages = 10;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (startPage > 1) {
    const firstPageButton = document.createElement("button");
    firstPageButton.classList.add(
      "px-4",
      "py-2",
      "border",
      "rounded-md",
      "bg-white",
      "text-gray-700"
    );
    firstPageButton.textContent = "1";
    firstPageButton.addEventListener("click", () => {
      fetchBooks(searchInput.value.trim(), searchType.value, 1);
    });
    paginationDiv.appendChild(firstPageButton);

    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("px-2", "text-gray-500");
      paginationDiv.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("px-4", "py-2", "border", "rounded-md");
    if (currentPage === i) {
      pageButton.classList.add("bg-blue-500", "text-white");
    } else {
      pageButton.classList.add("bg-white", "text-gray-700");
    }
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      fetchBooks(searchInput.value.trim(), searchType.value, i);
    });
    paginationDiv.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("px-2", "text-gray-500");
      paginationDiv.appendChild(dots);
    }

    const lastPageButton = document.createElement("button");
    lastPageButton.classList.add(
      "px-4",
      "py-2",
      "border",
      "rounded-md",
      "bg-white",
      "text-gray-700"
    );
    lastPageButton.textContent = totalPages;
    lastPageButton.addEventListener("click", () => {
      fetchBooks(searchInput.value.trim(), searchType.value, totalPages);
    });
    paginationDiv.appendChild(lastPageButton);
  }
}
