"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

/* GET home page. */
let jsonArticles

router.get('/', (req, res, next)=> {
  models.bbs.findAll({
    order: 'id DESC',
    attributes: ['id', 'text', 'replyto', 'date']
  }).then((articles)=> {
    jsonArticles = JSON.stringify(articles)
  }).then(()=> {
    res.json(jsonArticles)
  })  
})

module.exports = router;
