var Sequelize = require ('sequelize');

var sequelize = new Sequelize('bbs', 'nodeuser', 'Sakure2*', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.')
  }).catch(function(err) {
    console.log('Unable to connect to the database:', err)
  })
