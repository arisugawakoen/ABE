"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

router.get('/', (req, res, next)=> {
  let jsonArticles
  const searchQuery = req.query.q

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
    }).catch((e)=> {
      if(e) res.json(e)
    })
  } else {
    res.send('query nothing')
  }  
})

module.exports = router
