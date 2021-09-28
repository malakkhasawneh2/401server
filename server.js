'use strict';


const express = require('express');

const cors = require('cors');

const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const PORT=process.env.PORT;

const mongoose = require('mongoose');
let fruitModel;
main().catch(err => console.log(err));
async function main(){
    await mongoose.connect (process.env.MONGOOSE_URL());
    const fruitSchema = new mongoose.Schema({
        name : String,
        image : String,
        price: Number,
        ownerEmail: String
    });
    fruitModel = mongoose.model('fruit',fruitSchema);
}

server.get('/getFruit',getfruitHandler);
server.post('/addToFav',addToFavHandler);
server.get('/getFavFruit',getFavfruitHandler);
server.put('/updateFav/:id',updateFavHandler);
server.delete('/deleteFav/:id',deleteFavHandler);


function getfruitHandler (req,res){
    axios
    .get(`https://fruit-api-301.herokuapp.com/getFruit`)
    .then(result =>{
        console.log(result.data.fruits);
        res.send(result.data.fruits);

    })
    .catch(err =>{
        res.send(err);
    })
}

async function addToFavHandler (req,res){
    const {name, image, price, ownerEmail}=req.body;
    await fruitModel.create({
        name: name,
        image:image,
        price: price,
        ownerEmail: ownerEmail

    });
    fruitModel.find({ownerEmail:ownerEmail},(err,result)=>{
        if (err){
            console.log(err);
        }
        else{
            res.send(result);
        }
        
    })
}


function getFavfruitHandler (req,res){
    const email = req.query.ownerEmail;
    fruitModel.find({ownerEmail:email},(err,result)=>{

        if (err){
            console.log(err);
        }
        else{
            res.send(result);
        }  
    })
}

function updateFavHandler (req,res){
    const id = req.params.id;
    const{name,image,price,ownerEmail}= req.body;
    fruitModel.findByIdAndUpdate(id,{name,image,price},(err,result)=>{
        fruitModel.find({ownerEmail:ownerEmail},(err,result)=>{

 if (err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send(result);
        }  
    })
})
}

function deleteFavHandler (req,res){
    const id = req.params.id;
    const ownerEmail = req.query.ownerEmail;
    fruitModel.deleteOne({_id:id},(err,result)=>{
        fruitModel.find({ownerEmail:ownerEmail},(err,result)=>{
            if (err){
                console.log(err);
            }else{
                res.send(result);
            }
        })
    })
}

server.listen(PORT,()=>{

console.log(`listin on port 3010 `);

})

