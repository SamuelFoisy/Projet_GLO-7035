use duproprio;
db.createUser( {
    "user": "DuproprioWebApp",
    "pwd": "CetteApplicationEstVraimentExcellente",
    "roles": [ { role: "readWrite", db: "duproprio" } ]
});


db.createUser( {
    "user": "DataExtractor",
    "pwd": "CetExtracteurEstVraimentIncroyable",
    "roles": [ { role: "readWrite", db: "duproprio" } ]
});

use admin;

db.createUser( {
    "user": "SamAndJt",
    "pwd": "CesAdminsSontVraimentHorsDuCommin",
    "roles": [ { role: "root", db: "admin" } ]
});
