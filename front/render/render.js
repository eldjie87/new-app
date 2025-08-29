import { HomePage } from "../pages/homepage.js";

export function Render(...pages){
    const root = document.querySelector('.root');
    root.innerHTML = '';
    pages.forEach(page => {
        root.appendChild(page);
    });
}

export function navigate(path){
    history.pushState(null, '', path);
    route(path);
}

export function route(path) {
    if (path === '/') {
        Render(HomePage(navigate));
    } else {
        Render(NotFoundPage(navigate));
    }
}

route(window.location.pathname);

window.addEventListener('popstate', () => {
    route(window.location.pathname);
});