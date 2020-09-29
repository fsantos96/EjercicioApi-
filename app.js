const request = require('request-promise');
const filters = {
    ingredients: "i=",
    fistLetter: "f=",
    name: "i=",
    idCocktail: "i=",
    idIngredient: "iid=",
    category: "c=",
    alcoholic: "a=",
    glass: "g="
};
function sentRequest(method, params) {
    var options ={
        url:"https://www.thecocktaildb.com/api/json/v1/1/" + method + ".php",
        json:true
    }
    
    if(params) {
        options.url += "?" + filters[params.filter] + params.value;
    }

    return request(options);
}

function getRandomCocktail() {
    var params = { filter: "random"};
    return sentRequest("random").then(cocktails => cocktails.drinks[0]);
}

function getCocktailFilteredByGlass(glass) {
    var params = { filter: "glass", value: glass};
    return sentRequest("filter", params).then(cocktails =>cocktails.drinks);
}

function main() {
    getRandomCocktail().then(cocktail => {
        console.log("Receta: " + cocktail.strDrink);
        var isAlcoholic = cocktail.strAlcoholic == "Non alcoholic" ? "No" : "Si";
        console.log("Alcoholica: " + isAlcoholic);
        var ingredient = Object.keys(cocktail).filter(key => key.indexOf("strIngredient") != -1 && cocktail[key] != null);
        console.log("Ingredienes:");
        ingredient.forEach(ingredient => {
            console.log("- " + cocktail[ingredient]);
        })

        console.log("Intrucciones: " + cocktail.strInstructions);
        getCocktailFilteredByGlass(cocktail.strGlass).then(cocktailByGlass => {
            console.log("Otras Sugerencias: ");
            cocktailByGlass.splice(10);
            cocktailByGlass.forEach(cocktailglass => {
                if(cocktailglass.strDrink != cocktail.strDrink) {
                    console.log(cocktailglass.strDrink);
                }
            })
        })
    })
}

main();