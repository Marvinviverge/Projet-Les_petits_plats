document.addEventListener("DOMContentLoaded", function () {
    let newRecipes = []
    let allTags = []

    let searchRecipes = document.getElementById('searchRecipes')
    searchRecipes.value = ''

    async function main() {

        const { recipes } = await getApi(); // Varible qui attend de recevoir les données des recettes.
        newRecipes = recipes

        displayAll(recipes)
        searchBar(recipes)
    }

    main(); // Appel de la fonction main.

    // --- Fonction pour la recherche principale --- \\
    function searchBar(recipes) {

        searchRecipes.addEventListener('keyup', () => { // Evènement à la saisie de touches sur le clavier

            if (searchRecipes.value.length < 3) { // Si l'utilisateur saisie moins de trois caractères, on retourne l'affichage normal
                tagFilterFirst(recipes)
                displayAll(recipes)
                return
            }

            tagFilterSecond(recipes)
            displayAll(recipes)

        })

    }

    // --- Fonction pour l'affichage des dropdowns --- \\
    function displayDropdown(dropdown) {

        let buttn = dropdown.parentNode
        let btn = buttn.querySelector('.input-container')
        let iconContainer = buttn.querySelector('.icon-container')
        let dropdownList = [...dropdown.children]

        let dropdownContainer = buttn
        let dropdownInput = buttn.querySelector('.dropdown-input')
        let dropdownMenu = buttn.querySelector('.dropdown-menu')

        btn.onclick = () => {

            // Modification du style css des dropdown au clic. 
            iconContainer.classList.toggle('isRotate');
            dropdownContainer.classList.toggle('dropdown-container-opened');
            dropdownMenu.classList.toggle('not-active')

            // Evènement pour effectuer une recherche dans la liste du dropdown
            dropdownInput.addEventListener('keyup', (e) => {
                if (e.target.value.length > 0) {

                    dropdownList.map((list) => {
                        list.style.display = 'block'
                        if (list.textContent.toLowerCase().includes(e.target.value.toLowerCase())) {
                            return list
                        } else {
                            list.style.display = 'none'
                        }
                    })

                } else {
                    dropdownList.map((list) => {
                        list.style.display = 'block'
                    })
                }

            })

            // Modification du style des placeholders.
            if (dropdownContainer.getAttribute('class').includes('opened')) {
                dropdownInput.placeholder = dropdownInput.getAttribute('data-placeholder-opened');
            } else {
                dropdownInput.placeholder = dropdownInput.getAttribute('data-placeholder-closed');
                dropdownInput.value = ''
                dropdownList.map((list) => {
                    list.style.display = 'block'
                })
            }
        }

    }

    // --- Fonction numéro une pour effectuer un tri des recettes en fonction des filtres déjà cliqués --- \\
    function tagFilterFirst(recipes) {
        newRecipes = []

        for (const recipe of recipes) {
            let keep = true;

            for (const tag of allTags) {
                switch (tag.type) {
                    case 'appliance':
                        if (!recipe.appliance.toLowerCase().match(tag.value.toLowerCase())) {
                            keep = false;
                        }
                        break;

                    case 'ingredients':
                        var ti = [];
                        for (const u of recipe.ingredients) {
                            let result = u.ingredient.toLowerCase().match(tag.value.toLowerCase());

                            if (result && result.length > 0) {
                                ti.push(u);
                            }
                        }
                        if (ti.length == 0) {
                            keep = false;
                        }
                        break;

                    case 'ustensils':
                        var tu = [];
                        for (const u of recipe.ustensils) {
                            let result = u.toLowerCase().match(tag.value.toLowerCase());

                            if (result && result.length > 0) {
                                tu.push(u);
                            }
                        }
                        if (tu.length == 0) {
                            keep = false;
                        }
                        break;
                }
            }

            if (keep) {
                newRecipes.push(recipe);
            }
        }

    }

    // --- Fonction numéro une pour effectuer un tri des recettes en fonction des filtres déjà cliqués --- \\
    function tagFilterSecond(recipes) {
        newRecipes = []

        for (const recipe of recipes) {
            let keep = true

            for (const tag of allTags) {
                switch (tag.type) {
                    case 'appliance':
                        if (!recipe.appliance.toLowerCase().match(tag.value.toLowerCase())) {
                            keep = false
                        }
                        break;

                    case 'ingredients':
                        var ti = []
                        for (const u of recipe.ingredients) {
                            let result = u.ingredient.toLowerCase().match(tag.value.toLowerCase())

                            if (result && result.length > 0) {
                                ti.push(u)
                            }
                        }

                        if (ti.length == 0) {
                            keep = false
                        }
                        break;

                    case 'ustensils':
                        var tu = []
                        for (const u of recipe.ustensils) {
                            let result = u.toLowerCase().match(tag.value.toLowerCase())

                            if (result && result.length > 0) {
                                tu.push(u)
                            }
                        }

                        if (tu.length == 0) {
                            keep = false
                        }
                        break;
                }
            }

            if (keep) {
                let ingredientString = ''; // On initialise une variable d'une chaîne de caractère vide
                for (const item of recipe.ingredients) {
                    // On parcourt les ingrédients d'une recette
                    ingredientString += item.ingredient + ' '; // On ajoute à la variable de chaîne de caractère, les ingrédients de chaque recette parcourue
                }

                // Vérification du champs saisie pour ne retourner que les recettes qui contiennent la valeur saisie par l'utilisateur
                if (recipe.name.toLowerCase().match(searchRecipes.value.toLowerCase()) || recipe.description.toLowerCase().match(searchRecipes.value.toLowerCase()) || ingredientString.toLowerCase().match(searchRecipes.value.toLowerCase())) {
                    newRecipes.push(recipe)
                }
            }

        }
    }

    // --- Fonction qui fait appel à toutes les fonctions d'affichage --- \\
    function displayAll(recipes) {
        displayData();
        displayItems();
        tagClicked(recipes);

        // Affichage d'un message si la recherche ne donne aucune recette.
        let noRecipes = document.querySelector('#noMatch')
        if (newRecipes.length == 0) {
            noRecipes.classList.remove('not-active')
        } else {
            noRecipes.classList.add('not-active')
        }
    }

    // --- Fonction pour créer l'affichage des listes d'items dans chacun des dropdowns --- \\
    function displayItems() {
        let dropdownIngredients = document.getElementById('dropdownIngredients')
        dropdownIngredients.innerHTML = '';
        let ingredientsList = [];

        let dropdownUstensils = document.getElementById('dropdownUstensils')
        dropdownUstensils.innerHTML = ''
        let ustensilsList = [];

        let dropdownAppliance = document.getElementById('dropdownAppliance')
        dropdownAppliance.innerHTML = '';
        let applianceList = [];

        let dropdownInput = document.querySelectorAll('.dropdown-input')

        for (let i = 0; i < dropdownInput.length; i++) {
            const input = dropdownInput[i];
            let getInputId = input.getAttribute('id')

            switch (getInputId) {
                case 'searchIngredients':
                    newRecipes.map((item) => { // On parcourt les recettes

                        ingredientsList = [...ingredientsList, ...item.ingredients.map((i) => { // Et on ajoute au tableau ingredientsList, les ingrédients de chaque recette parcourue les uns à la suite des autres. 

                            return i.ingredient.toLowerCase();
                        })]
                    })


                    // Retrait des doublons du tableau
                    ingredientsList = ingredientsList.filter((ingredient, index) => {
                        return ingredientsList.indexOf(ingredient) == index
                    })

                    // On boucle ensuite sur le tableau pour que chaque ingrédient créé du html
                    for (let i = 0; i < ingredientsList.length; i++) {
                        let element = ingredientsList[i];
                        if (allTags.filter((e) => {
                            return e.value.toLowerCase() == element.toLowerCase()
                        }).length == 0) {
                            dropdownIngredients.insertAdjacentHTML(
                                "beforeend",
                                `
                                <li><a class="dropdown-item" href="#">${element}</a></li>
                                `
                            );
                        }
                    }
                    displayDropdown(dropdownIngredients)
                    break

                case 'searchUstensils':
                    newRecipes.map((item) => { // On parcourt les recettes

                        ustensilsList = [...ustensilsList, ...item.ustensils.map((u) => {
                            return u.toLowerCase()
                        })]
                    })

                    // Retrait des doublons du tableau
                    ustensilsList = ustensilsList.filter((ustensil, index) => {
                        return ustensilsList.indexOf(ustensil) == index
                    })

                    // On boucle ensuite sur le tableau pour que chaque ustensile créé du html
                    for (let i = 0; i < ustensilsList.length; i++) {
                        let element = ustensilsList[i];

                        if (allTags.filter((e) => {
                            return e.value.toLowerCase() == element.toLowerCase()
                        }).length == 0) {
                            dropdownUstensils.insertAdjacentHTML(
                                "beforeend",
                                `
                            <li><a class="dropdown-item" href="#">${element}</a></li>
                            `
                            );
                        }
                    }
                    displayDropdown(dropdownUstensils)
                    break

                case 'searchAppliance':
                    // On parcourt les recettes pour push chaque appareil dans le tableau
                    newRecipes.map((item) => {
                        applianceList.push(item.appliance)
                    })

                    // Retrait des doublons du tableau
                    applianceList = applianceList.filter((appliance, index) => {
                        return applianceList.indexOf(appliance) == index
                    })

                    // On boucle ensuite sur le tableau pour que chaque appareil créé du html
                    for (let i = 0; i < applianceList.length; i++) {
                        let element = applianceList[i];
                        if (allTags.filter((e) => {
                            return e.value.toLowerCase() == element.toLowerCase()
                        }).length == 0) {

                            dropdownAppliance.insertAdjacentHTML(
                                "beforeend",
                                `
                        <li><a class="dropdown-item" href="#">${element}</a></li>
                        `
                            );
                        }
                    }
                    displayDropdown(dropdownAppliance)
                    break
            }

        }
    }

    // --- Fonction pour gérer les évènements liés aux clics sur les différents items des dropdowns, que la création des tags sous la barre de recherche, ainsi que le filtrage des recettes --- \\
    function tagClicked(recipes) {

        let item = document.querySelectorAll('.dropdown-item')

        for (let i = 0; i < item.length; i++) {
            let tag = item[i];
            tag.addEventListener('click', (e) => {
                let focus = e.target.parentNode.parentNode.getAttribute('data-typeFilter')
                allTags.push({ type: focus, value: tag.textContent })
                // Création du DOM HTML pour les tags
                let tagBtn = document.createElement('button')

                tagBtn.classList.add('btn', 'btn-primary', 'tag')
                tagBtn.setAttribute('type', 'submit')
                tagBtn.innerHTML = tag.innerHTML + `<i class="fa-regular fa-circle-xmark"></i>`

                switch (focus) {
                    case 'appliance':
                        tagBtn.classList.add('tag-appliances')
                        document.getElementById('tag-container-appliances').appendChild(tagBtn);
                        break

                    case 'ingredients':
                        tagBtn.classList.add('tag-ingredients')
                        document.getElementById('tag-container-ingredients').appendChild(tagBtn);
                        break

                    case 'ustensils':
                        tagBtn.classList.add('tag-ustensils')
                        document.getElementById('tag-container-ustensils').appendChild(tagBtn);
                        break
                }

                let filteredRecipes = [];
                // Boucle sur les recettes afin de retenir celles qui correspondent aux tags.
                for (const recipe of newRecipes) {
                    let isMatch = false;

                    switch (focus) {
                        case 'appliance':
                            if (recipe.appliance.toLowerCase().match(tag.textContent.toLowerCase())) {
                                isMatch = true;
                            }
                            break;

                        case 'ingredients':
                            var ingredientsMatch = [];

                            for (const ingredient of recipe.ingredients) {
                                if (ingredient.ingredient.toLowerCase().match(tag.textContent.toLowerCase())) {
                                    ingredientsMatch.push(true);
                                } else {
                                    ingredientsMatch.push(false);
                                }
                            }

                            if (ingredientsMatch.includes(true)) {
                                isMatch = true;
                            }
                            break;

                        case 'ustensils':
                            var ustensilsMatch = [];

                            for (const ustensil of recipe.ustensils) {
                                if (ustensil.toLowerCase().match(tag.textContent.toLowerCase())) {
                                    ustensilsMatch.push(true);
                                } else {
                                    ustensilsMatch.push(false);
                                }
                            }

                            if (ustensilsMatch.includes(true)) {
                                isMatch = true;
                            }
                            break;
                    }

                    if (isMatch) {
                        filteredRecipes.push(recipe); // On push dans le tableau les recettes qui correspondent aux tags.
                    }
                }

                newRecipes = filteredRecipes; //La variable globale newRecipes prends la valeur du tableau créé pour la boucle afin d'afficher les recettes qui correspondent aux tags.


                displayAll(recipes)

                // Ajout d'un évènement au clic sur les tags sous la barre de recherche
                tagBtn.addEventListener('click', () => {

                    let updatedAllTags = [];
                    for (let tag of allTags) {
                        if (tag.value !== tagBtn.textContent) {
                            updatedAllTags.push(tag);
                        }
                    }
                    allTags = updatedAllTags;

                    // Prise en compte de l'input de la barre de recherche afin d'effectuer un nouveau tri à chaque tag cliqué et retiré
                    if (searchRecipes.value.length < 3) {
                        tagFilterFirst(recipes)
                        displayAll(recipes)
                        tagBtn.remove()
                        return
                    }

                    tagFilterSecond(recipes)
                    displayAll(recipes)
                    tagBtn.remove()

                })
            })
        }
    }

    // --- Fonction pour recevoir les données du JSON --- \\
    function getApi() {
        return fetch('http://localhost:5500/api/recipes.json')
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    // --- Fonction qui génère l'affichage des recettes --- \\
    function displayData() {
        const recipesSection = document.getElementById("recipes-container");
        recipesSection.innerHTML = '';

        newRecipes.forEach((recipe) => {
            const recipeModel = recipesFactory(recipe); // Appel de la fonction recipesFactory
            const recipeCardDOM = recipeModel.getRecipesCardDOM(); // Appel de la fonction getRecipesCardDOM qui va générer les différentes recettes
            recipesSection.appendChild(recipeCardDOM);
        });
    }

    // --- Fonction utilisant le patern Factory Function pour la création du DOM de chaque recette --- \\
    function recipesFactory(data) {
        const { name, ingredients, time, description } = data;

        let displayIngredients = "";

        ingredients.forEach((ingredient) => {
            let ingredientData = '';
            if (ingredient.unit) {
                ingredientData += ingredient.ingredient + ': ' + ingredient.quantity + " " + ingredient.unit;
            } else if (ingredient.quantity) {
                ingredientData = ingredient.ingredient + ': ' + ingredient.quantity;
            } else {
                ingredientData = ingredient.ingredient;
            }

            displayIngredients += "<li>" + ingredientData + "</li>";
        })


        //--- Initialisation de la fonction getUserCardDOM permettant de créer dans le DOM une div contenant les informations relatives à chaque recette --- \\

        function getRecipesCardDOM() {
            const rowCol = document.createElement('div');
            rowCol.classList.add('col-md-4');

            rowCol.insertAdjacentHTML(
                "beforeend",
                `
                <div class="card card-height margin">
                    <div class="card-background"></div>
                    <div class="card-body card-height-body">
                        <div class="titleCard">${name} 
                            <div class="timeCard"><i class="fa-regular fa-clock"></i> ${time} min</div>
                        </div>
                        <div class="descriptionCard">
                        <ul>
                        ${displayIngredients}
                        </ul>
                        <p>
                         ${description}
                        </p>
                        </div>
                    </div>
                </div>
                `
            );

            return (rowCol);
        }

        return { getRecipesCardDOM }
    }

})