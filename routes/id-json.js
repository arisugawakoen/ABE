"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

let jsonArticle
const re = /\d+/

router.get('/:id', (req, res, next)=> {
  if (re.test(req.params.id)) {
    models.bbs.findById(req.params.id, {
      attributes: ['id', 'text', 'replyto', 'date']
    }).then((article)=> {
      jsonArticle = JSON.stringify(article)
    }).then(()=> {
      res.json(jsonArticle)
    })
  } else {
    res.send('not decimal')
  }
})

module.exports = router;