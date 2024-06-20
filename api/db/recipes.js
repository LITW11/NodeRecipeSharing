const sql = require('mssql/msnodesqlv8');
const camelCaseDeep = require('camelcase-object-deep');

const config = {
    database: 'NodeRecipeSharing',
    server: '.\\sqlexpress',
    driver: 'msnodesqlv8',
    options: {
        trustServerCertificate: true,
        trustedConnection: true
    }
}

const add = async (recipe, imageName, userId) => {
    await sql.connect(config);

    recipe.ingredients = JSON.stringify(recipe.ingredients);
    recipe.steps = JSON.stringify(recipe.steps);

    const { title, categoryId, ingredients, steps, isPublic } = recipe;

    await sql.query`INSERT INTO Recipes (Title, CategoryId, UserId, Ingredients, Steps, ImageName, IsPublic) 
    VALUES(${title}, ${categoryId}, ${userId}, ${ingredients}, ${steps}, ${imageName}, ${isPublic})`;

    await sql.close();
}

const getAllPublic = async () => {

    await sql.connect(config);
    const { recordset } = await sql.query`SELECT r.*, c.Name as 'CategoryName' FROM Recipes r 
    JOIN Categories c ON c.Id = r.CategoryId 
    WHERE r.IsPublic = 1`;
    await sql.close();
    if(!recordset.length) {
        return [];
    }

    const recipes = camelCaseDeep(recordset);
    recipes.forEach(r => {
        r.steps = JSON.parse(r.steps);
        r.ingredients = JSON.parse(r.ingredients);
    });

    return recipes;
}

module.exports = {add, getAllPublic};