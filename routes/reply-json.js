"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

let jsonArticles
const re = /\d+/

router.get('/:id', (req, res, next)=> {
  if (re.test(req.params.id)) {
    models.bbs.findAll({
      where: {
        replyto: req.params.id
      },
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

module.exports = router;