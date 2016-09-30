'use strict'

const express = require('express')
const router = express.Router()
const models = require('../models')

const re = /\d+/

function findAllJson(res, Offset, Limit) {
  let jsonArticles

  models.bbs.findAll({
    offset: Offset,
    limit: Limit,
    order: 'id DESC',
    attributes: ['id', 'text', 'replyto', 'date', 'color']
  }).then((articles) => {
    jsonArticles = JSON.stringify(articles)
  }).then(() => {
    res.json(jsonArticles)
  }).catch((e) => {
    if(e) res.json(e)
  })
}

router.get('/:offset/:limit', (req, res, next) => {
  if (re.test(req.params.offset) && re.test(req.params.limit)) {
    findAllJson(res, req.params.offset, req.params.limit)
  } else {
    res.send('not decimal')
  }
})

router.get('/', (req, res, next) => {
  const offset = 0
  const limit = 30
  findAllJson(res, offset, limit)
})

router.post('/', (req, res, next) => {
  let replyNo
  replyNo = (re.test(req.body.replyto)) ? req.body.replyto : null

  models.bbs.create({
    text: req.body.text,
    replyto: replyNo,
    date: Date(),
    color: req.body.color
  }).then(() => {
    res.send('ok')
  }).catch((e) => {
    res.send('ng')
    console.log(e)
  })
})

module.exports = router
