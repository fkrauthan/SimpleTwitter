require('babel/register')({
    experimental: true,
    optional: ['runtime']
});

require('./src/server');
