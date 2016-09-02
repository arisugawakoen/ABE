"use strict"

const express = require('express')
const router = express.Router()
const models = require('../models')

const re = /\d+/

router.get('/:offset/:limit', (req, res, next) => {
  let jsonArticles

  if (re.test(req.params.offset) && re.test(req.params.limit)) {
    models.bbs.findAll({
      offset: req.params.offset,
      limit: req.params.limit,
      order: 'id DESC',
      attributes: ['id', 'text', 'replyto', 'date']
    }).then((articles) => {
      jsonArticles = JSON.stringify(articles)
    }).then(() => {
      res.json(jsonArticles)
    }).catch((e) => {
      if(e) res.json(e)
    })
  } else {
    res.send('not decimal')
  }
})

router.get('/', (req, res, next) => {
  let jsonArticles
  const limit = 30

  models.bbs.findAll({
    limit: limit,
    order: 'id DESC',
    attributes: ['id', 'text', 'replyto', 'date']
  }).then((articles) => {
    jsonArticles = JSON.stringify(articles)
  }).then(() => {
    res.json(jsonArticles)
  }).catch((e) => {
    if(e) res.json(e)
  })
})

router.post('/', (req, res, next) => {
  let replyNo
  replyNo = (re.test(req.body.replyto)) ? req.body.replyto : null

  models.bbs.create({
    text: req.body.text,
    replyto: replyNo,
    date: Date()
  }).then(() => {
    res.send('ok')
  }).catch((e) => {
    res.send('ng')
    console.log(e)
  })
})

module.exports = router