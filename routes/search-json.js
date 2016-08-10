"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

/* GET home page. */
let jsonArticles

router.get('/', (req, res, next)=> {
  const searchQuery = req.param('q')

  if (searchQuery) {
    const searchLike = `%${searchQuery}%`

    models.bbs.findAll({
      where: {
        text: { $like: searchLike }
      },
      order: 'id DESC',
      attributes: ['id', 'text', 'replyto', 'date']
    }).then((articles)=> {
      jsonArticles = JSON.stringify(articles)
    }).then(()=> {
      res.json(jsonArticles)
    })
  } else {
    res.send('query nothing')
  }  
})

module.exports = router;
