fetch("/src/components/navbar/navbar.html")
    .then(stream => stream.text())
    .then(text => define(text));

function define(html) {
    class MyNavBar extends HTMLElement {
        constructor() {
            super();
            var shadow = this.attachShadow({
                mode: 'open'
            });
            shadow.innerHTML = html;
        }
    }
    
    customElements.define('my-nav-bar', MyNavBar);
}
