let activePageIndex = 0;
let pages = [];

(function() {})()

function init() {
  pages = document.getElementsByClassName("page");
  navigation = document.getElementsByClassName("nav-btn");
  setActivePage(activePageIndex);
}

function setActivePage(newIndex) {
  let newPage = pages[newIndex];
  let currentPage = pages[activePageIndex];
  let newNav = navigation[newIndex];
  let currentNav = navigation[activePageIndex];
  if (currentPage) {
    currentPage.classList.add("inactive");
    currentPage.classList.remove("active");
    currentNav.classList.add("inactive");
    currentNav.classList.remove("active");

  }
  newPage.classList.add("active");
  newPage.classList.remove("inactive");
  newNav.classList.add("active");
  newNav.classList.remove("inactive");
  activePageIndex = newIndex;
}

function goToPreviousPage() {
  if (activePageIndex > 0) {
    setActivePage(activePageIndex - 1);
  } else {
    setActivePage(pages.length - 1);
  }
}

function goToNextPage() {
  if (activePageIndex < pages.length - 1) {
    setActivePage(activePageIndex + 1);
  } else {
    setActivePage(0);
  }
}