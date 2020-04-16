/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const sections = document.querySelectorAll("section");
const navbar = document.getElementById("navbar__list");
const scrollToTop = document.getElementById("top__navigation");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// callback function for the observer
function onChange(changes, observer) {
  const hasVisibleSection = changes.some((change) => change.isIntersecting);

  changes.forEach((change) => {
    const section = change.target;
    const sectionNavigationLink = document.querySelector(
      `li[data-nav=${change.target.id}]`
    );
    activateElement(section, change.isIntersecting);
    activateElement(sectionNavigationLink, change.isIntersecting);
    activateElement(scrollToTop, hasVisibleSection);

    observer.unobserve(change.target);
  });
}

// makes elements active based on a condition
function activateElement(element, condition) {
  element.classList.toggle("active", condition);
}

// creates observer
function createObserver() {
  let options = {
    root: null, // relative to document viewport
    rootMargin: "0px", // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 0.7, // visible amount of item shown in relation to root
  };

  let observer = new IntersectionObserver(onChange, options);
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// check each section if it's active
function checkEachSectionForVisibility() {
  for (let section of sections) {
    const sectionNavigationLink = document.querySelector(
      `li[data-nav=${section.id}]`
    );
    const sectionIsVisible = checkIfElementIsVisible(section);
    activateElement(section, sectionIsVisible);
    activateElement(sectionNavigationLink, sectionIsVisible);
    activateElement(scrollToTop, sectionIsVisible);
  }
}

// checks if each element is active in comparison to the window and document using Element.getBoundingClientRect()
function checkIfElementIsVisible(element) {
  const elementSize = element.getBoundingClientRect();
  return (
    elementSize.top <= 50 &&
    elementSize.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    elementSize.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
function createNavigationMenu() {
  const fragment = document.createDocumentFragment(); // DocumentFragment instead of a <div> for permormance
  for (let section of sections) {
    const newElement = document.createElement("li");
    newElement.dataset.nav = section.id;
    newElement.innerText = section.dataset.nav;
    newElement.classList.add("menu__link");
    fragment.appendChild(newElement);
  }

  navbar.appendChild(fragment); // reflow and repaint once here
}

// Add class 'active' to section when near top of viewport
function setActiveSectionOnScroll() {
  window.addEventListener("scroll", (event) => {
    if ("IntersectionObserver" in window) {
      return createObserver();
    }
    checkEachSectionForVisibility();
  });
}

// Scroll to anchor ID using scrollTO event
function scrollToAnchor() {
  navbar.addEventListener("click", (event) => {
    const sectionToScrollTo = document.getElementById(event.target.dataset.nav);
    sectionToScrollTo.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
createNavigationMenu();

// Scroll to section on link click
scrollToAnchor();

// Set sections as active
setActiveSectionOnScroll();
