			const template = document.querySelector("#myTemp").content;
			const main = document.querySelector("main");
			const nav = document.querySelector("nav");

			const modal = document.querySelector(".modal-bg");

            modal.addEventListener("click", ()=>modal.classList.add("hide"));

			const productlistLink = "http://kea-alt-del.dk/t5/api/productlist";
            const catLink = "http://kea-alt-del.dk/t5/api/categories";

            const productLink = "http://kea-alt-del.dk/t5/api/product?id=";

            const imgLink = "https://kea-alt-del.dk/t5/site/imgs/";

            const allLink = document.querySelector("#all");
            allLink.addEventListener("click", ()=>showCategory("all"));

            fetch(catLink).then(e=>e.json()).then(data=>createCatSections(data));

			function createCatSections(categories){
				console.log(categories);
                categories.forEach(cat=>{

                    const newA = document.createElement("a");
                    newA.textContent=cat;
                    newA.href="#";
                    newA.addEventListener("click", ()=>showCategory(cat));
                    nav.appendChild(newA)

                    const newSection = document.createElement("section");
                    const newHeader = document.createElement("h2");
                    newSection.id=cat;
                    newHeader.textContent=cat;
                    main.appendChild(newHeader);
                    main.appendChild(newSection);

                    })
                    fetch(productlistLink).then(e=>e.json()).then(data=>data.forEach(showData));
                }

            function showCategory(category){
                console.log(category)
                document.querySelectorAll("main section").forEach(section=>{
                    if(section.id == category || category == "all"){
                        section.style.display="grid";
                        section.previousElementSibling.style.display="block";
                    }else{
                        section.style.display="none";
                        section.previousElementSibling.style.display="none";
                    }
                })
            }

            function showDetails(product){
                console.log(product);
                modal.querySelector("h1").textContent=product.name;
                modal.classList.remove("hide");
            }

            function showData(product){
                const section = document.querySelector("#"+product.category)
                let clone = template.cloneNode(true);
                clone.querySelector("h1").textContent=product.name;

                clone.querySelector("button").addEventListener("click", ()=>{
                    fetch(productLink+product.id).then(e=>e.json()).then(data=>showDetails(data));
                });

                clone.querySelector("h2").textContent=product.price;
                clone.querySelector("img").src="https://kea-alt-del.dk/t5/site/imgs/small/" + product.image + "-sm.jpg";
                clone.querySelector("img").alt=product.image;
                if(product.vegetarian == false){
                    clone.querySelector(".vegetarian").remove()
                }

                if(product.soldout){
                    const article = clone.querySelector("article");
                    article.classList.add("soldout");
                    const message = document.createElement("p");
                    message.textContent="Sold Out";
                    message.classList.add("overlay");
                    article.appendChild(message)
                }
                section.appendChild(clone);

            }
