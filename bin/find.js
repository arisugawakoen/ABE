"use strict"

const models = require('../models')

models.bbs.findAll({
  where: {
    text: {
      $like: '%%'
    }
  },
  order: 'id DESC',
  attributes: ['id', 'text', 'replyto', 'date']
}).then((articles)=> {
  const jsonArticles = JSON.stringify(articles)
  console.log(jsonArticles)
}).then(()=> {
  return models.sequelize.close()
}).catch((e)=> {
  console.error(e)
})
