/* ---- Ce fichier comporte les éléments nécessaire à l'affichage des éléments sur la page d'accueil ainsi que le header de la page d'un photographe. ---- */

document.addEventListener("DOMContentLoaded", function () {

    /**
     * Création d'une fonction principale "main" qui va appeler les autres fonctions.
     * @async
     * @function [<main>] 
     */
    async function main() {

        const { recipes } = await getApi(); // Varible qui attend de recevoir les données des photographes.
        displayData(recipes); // Appel de la fonction displayData avec en paramètre les données reçus.
        document.getElementById('searchRecipes').addEventListener('keyup', (e) => {

            if (e.target.value.length < 3) {
                displayData(recipes)
                return
            }

            let newRecipes = recipes.filter((recipe) => {
                let ingredientString = '';
                recipe.ingredients.map((item) => {
                    ingredientString += item.ingredient + ' ';
                })

                if (recipe.name.toLowerCase().match(e.target.value) || recipe.description.toLowerCase().match(e.target.value) || ingredientString.toLowerCase().match(e.target.value)) {
                    return recipe
                }
            })

            displayData(newRecipes)
        })
    };

    main(); // Appel de la fonction main.


    /**
     * Création d'une fonction permettant de récupérer les informations des photographes du fichier JSON.
     * @function [<getApi>]
     * @returns {Promise} - Promise qui va contenir les informations relatives aux photographes se trouvant dans le fichier JSON.
     */
    function getApi() {
        return fetch('http://localhost:5500/api/recipes.json')
            .then(function (response) {
                return response.json();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    /**
     * Création d'une fonction pour intégrer/afficher au HTML les données provenant de l'API
     * @function [<displayData>]
     * @param {Array} recipes - Tableau de tous les photographes contenant toutes leurs informations.
     */
    function displayData(recipes) {
        const recipesSection = document.getElementById("recipes-container");
        recipesSection.innerHTML = '';
        recipes.forEach((recipe) => {
            const recipeModel = recipesFactory(recipe); // Appel de la fonction photographerFactory avec en paramètre les informations des photographes.
            const recipeCardDOM = recipeModel.getRecipesCardDOM(); // Appel de la fonction getUser qui va générer les différents photographes
            recipesSection.appendChild(recipeCardDOM);
        });
    };

    function recipesFactory(data) {
        const { id, name, servings, ingredients, time, description, appliance, ustencils } = data;

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


        /**
            * Initialisation de la fonction getUserCardDOM permettant de créer dans le DOM un article contenant les informations relatives à chaque photographe, cette fonction est utilisée pour générer les différents photographes sur la page d'accueil. 
            * @function [<getUserCardDOM>]
            * @returns {HTMLArticleElement} Retourne un élément HTML "article".
        */
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
                            <div class="timeCard">${time} min</div>
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