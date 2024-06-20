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

const add = async category => {
    await sql.connect(config);

    const { name, userId } = category;
    await sql.query`INSERT INTO Categories (Name, UserId) VALUES(${name}, ${userId})`;

    await sql.close();
}

const getAll = async (userId) => {

    await sql.connect(config);
    const { recordset } = await sql.query`SELECT c.Id, c.Name, count(r.Id) as 'RecipeCount' FROM Categories c
LEFT JOIN Recipes r
ON c.Id = r.CategoryId
WHERE c.UserId = ${userId}
GROUP BY c.Id, c.Name`;
    await sql.close();
    if(!recordset.length) {
        return [];
    }

    return camelCaseDeep(recordset);
}

module.exports = {add, getAll};