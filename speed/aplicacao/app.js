const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const db = mysql.createConnection({
    host: 'nomedobanco.cbsni0sjuhqw.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'senha123',
    database: 'databaseName'
});


app.get("/form", function(req,res){
    res.sendFile("/app/formulario.html")
})

//app.get("/cadastrar", function(req,res){
//    res.sendFile("C:/Users/Inteli/Desktop/speed/front/formulario.html")
//})




app.post("/jogadores", (req, res) => {
    const nomeHTML = req.body.nome
    const idadeHTML = req.body.idade
    const posicaoHTML = req.body.posicao
    const timeHTML = req.body.time
    const kmsHTML = req.body.kms

    const sql = "INSERT INTO jogadores (nome, idade, posicao, time_atual, kms) VALUES (?,?,?,?,?)";
    db.query(sql, [nomeHTML, idadeHTML, posicaoHTML, timeHTML, kmsHTML] , (err, result) => {
        if (err) {
            // Handle the error here, for example:
            console.error("Error executing the SQL query:", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.sendFile("/app/formulario.html");
        }
    });
});

app.get('/', (req,res) => {
    const sql = "SELECT * FROM jogadores";
    const html = "<html><body><h1></h1></body></html>"
    db.query(sql, (err, result) => {
        if(err) {
            console.error(err);
        } else {
            let htmlContent = "<html><body><h1>Listagem de Jogadores</h1><ul>";

            // Iterar pelos resultados e criar elementos para cada registro
            console.log(result)
            result.forEach((row) => {
                htmlContent += `<li>${row.nome}, ${row.idade} anos, joga como ${row.posicao} no ${row.time_atual} e correu ${row.kms} Kilometros no jogo</li>`;
            });

            htmlContent += "</ul></body></html>";
            htmlContent += '<button><a href="/form">Voltar ao formulario</a></button>';
            
            res.send(htmlContent);
        }
    });
});

app.listen(8080);