require('babel/register')({
    stage: 0,
    optional: ['runtime']
});

require('./src/server');
