const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "andreia123",
  database: "productdb",
  define:{
      timestamps: true,
  },
})
db.connect(function(err){
  if(err){
    console.error('Erro ao se conectado com banco de dados: '+ err.stack)
  }else{
    console.log("Conectado!!!")
  }
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const stock = req.body.stock;
  const price = req.body.price;
  const created_at = req.body.created_at
  const updated_at = req.body.updated_at
  db.query(
    "INSERT INTO product (name, stock, price, created_at,updated_at) VALUES (?,?,?,now(),now())",
    [name, stock, price,created_at, updated_at],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("totals Inserted");
      }
    }
  );
});

app.get("/data", (req, res) => {
  db.query("SELECT DATE_FORMAT(updated_at, '%d de %M de %Y as %T') from product;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/productdb", (req, res) => {
  db.query("SELECT * FROM product", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put(`/update`, (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const stock = req.body.stock;
  const price = req.body.price;
  const updated_at = req.body.updated_at
  db.query(
    "UPDATE product SET name = ?, stock = ?, price = ?, updated_at = now() WHERE id = ?",
    [name, stock, price, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result),
        console.log("enviado")
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM product WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("O servidor está na porta 3001");
});
