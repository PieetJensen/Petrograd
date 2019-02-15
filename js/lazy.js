/*jslint es6*/
"use strict";
const main = document.querySelector("main");
const container = document.createElement('section');
const modal = document.querySelector(".modal");
const product_link = "http://kea-alt-del.dk/t5/api/product?id=";
const list_link = "http://kea-alt-del.dk/t5/api/productlist";
let globalData;
let globalCount = 0;

const options = {
    rootMargin: '0px',
    threshold: 1
}

const observer = new IntersectionObserver(callback, options);
const target = document.querySelector('#target');
observer.observe(target);

function callback(entries, observer) {
    entries.forEach(entry => {
        console.log(entry.target);
        if (entry.isIntersecting) { //observer fires once when the page loads
            if (globalData) {
                splitData(globalData, 0, 3);
            }
        }
    });
};

function loadJSON(link, from, to) {
    fetch(link).then((e) => e.json()).then((data) => splitData(data, from, to));
}

function loadDetails(link) {
    fetch(link).then((e) => e.json()).then((data) => showDetails(data));
}

function splitData(data, from, to) {
    let part = data.slice(from, to);
    data.splice(from, to);
    globalData = data;
    console.log(part);
    console.log(globalData);
    showList(part);
}

function showList(data) {
    main.removeChild(target);
    data.forEach((product) => {
        globalCount++;
        let clone = document.querySelector(".product").content.cloneNode(true);
        let name = clone.querySelector(".name");
        let image = clone.querySelector(".product-small-img");
        let price = clone.querySelector(".price");
        let discount = clone.querySelector(".discount");
        let link = clone.querySelector("a");
        let button = clone.querySelector("button");
        button.addEventListener("click", function () {
            loadDetails(product_link + product.id);
        });
        name.textContent = globalCount + " " + product.name + " " + product.id;
        image.src = "http://kea-alt-del.dk/t5/site/imgs/small/" + product.image + "-sm.jpg";
        image.alt = product.name;
        price.textContent = "Price: " + product.price + ",-";
        if (product.discount > 0) {
            discount.textContent = "Now: " + Math.floor(product.price * product.discount / 100) + ",-";
            price.style.textDecoration = "line-through";
        } else {
            discount.style.display = "none";
        }
        link.href = "http://kea-alt-del.dk/t5/site/imgs/large/" + product.image + ".jpg";
        container.appendChild(clone);
    });
    main.appendChild(container);
    if (globalData.length > 0) {
        main.appendChild(target);
    }
}

modal.addEventListener("click", function () {
    modal.style.display = "none";
});

function showDetails(data) {
    //console.log(data);
    modal.style.display = "block";
    modal.querySelector(".modal-name").textContent = data.name;
    modal.querySelector(".modal-image").src = "http://kea-alt-del.dk/t5/site/imgs/small/" + data.image + "-sm.jpg";
    modal.querySelector(".modal-description").textContent = data.longdescription;
    modal.querySelector(".modal-price").textContent = "Price: " + data.price;
    modal.querySelector(".modal-discount").textContent = "Now: " + Math.floor(data.price * data.discount / 100) + ",-";
}

loadJSON(list_link, 0, 3);
