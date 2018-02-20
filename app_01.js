const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient // le pilote MongoDB
const ObjectID = require('mongodb').ObjectID;

app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/',function(req, res){

 res.render('accueil.ejs')
})

app.get('/formulaire',function(req, res){

 res.render('formulaire.ejs')
})

////////////////////////////////////////////////////////////////////////////////

app.get('/membres',function(req, res){

var cursor = db.collection('db_exercice_6_NS').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('gabarit.ejs', {ex_6: resultat})
})
})

/////////////////////////////////////////////////////////////////////////////

app.get('/ajouter', function (req, res) {
 // Preparer l'output en format JSON

 db.collection('db_exercice_6_NS').save(req.query, (err, result) => {
 if (err) return console.log(err)
 console.log()

	
 res.redirect('/membres')
 })

});

app.get('/suprimer/:id', (req, res) => {
 var id = req.params.id
 console.log(id)
 db.collection('db_exercice_6_NS').findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/membres')  // redirige vers la route qui affiche la collection
 })
})

///////////////////////////////////////////////////////////////////////////////////////////////

app.post('/modifier', (req, res) => {

//console.log('req.body' + req.body)
console.log('***********************')
console.log( req.body['_id']);

 var oModif = {
 "_id": ObjectID(req.body['_id']), 
  nom: req.body.nom,
 prenom:req.body.prenom, 
 telephone:req.body.telephone,
 email:req.body.email
 }

 console.log(oModif);

  db.collection('db_exercice_6_NS').save(oModif, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/membres')
 })

 })

////////////////////////////////////////////////////////////////////////////////////////////

 app.get('/trier/:cle/:ordre', (req, res) => {
console.log(req.params.ordre)
 let cle = req.params.cle
 let ordre = (req.params.ordre == 'asc' ? 1 : -1)
 let cursor = db.collection('db_exercice_6_NS').find().sort(cle,ordre).toArray(function(err, resultat){

 ordre = (req.params.ordre == 1 ? 'desc' : 'asc')

 res.render('gabarit.ejs', {ex_6: resultat, cle_html:cle, ordre_html:ordre})

})
})

////////////////////////////////////////////////////////////////////////////////////////////

app.get('/peuplement', (req, res) => {
    let peupler = require('./component/peuplement.js');
    let nouvelleListe = peupler();
    db.collection('adresse').insert(nouvelleListe, (err, enreg) => {
        if (err) {
            res.status(500).send(err);
        } else {
            peupler = "";
            res.redirect('/');
        }
    });
})

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('db_exercice_6_NS')
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})
