"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

/* GET home page. */
let jsonArticles
const re = /\d+/

router.get('/:offset/:limit', (req, res, next)=> {
  if (re.test(req.params.offset) && re.test(req.params.limit)) {
    models.bbs.findAll({
      offset: req.params.offset,
      limit: req.params.limit,
      order: 'id DESC',
      attributes: ['id', 'text', 'replyto', 'date']
    }).then((articles)=> {
      jsonArticles = JSON.stringify(articles)
    }).then(()=> {
      res.json(jsonArticles)
    })
  } else {
    res.send('not decimal')
  }
})

router.get('/', (req, res, next)=> {
  let limit = 30

  models.bbs.findAll({
    limit: limit,
    order: 'id DESC',
    attributes: ['id', 'text', 'replyto', 'date']
  }).then((articles)=> {
    jsonArticles = JSON.stringify(articles)
  }).then(()=> {
    res.json(jsonArticles)
  })  
})

module.exports = router;
