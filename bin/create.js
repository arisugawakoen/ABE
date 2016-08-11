var models = require('../models')

models.bbs.create({
  text: 'sex',
  date: Date(),
  replyto: 2
}).then(()=> {
  models.sequelize.close()
})
