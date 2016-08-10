var models = require('../models')

models.bbs.create({
  text: 'fuck',
  date: new Date(),
  replyto: 1
}).then(()=> {
  models.sequelize.close()
})
