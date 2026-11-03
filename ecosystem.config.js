module.exports={apps:[
{name:'apz-api',script:'index.js',cwd:'./apps/api',env:{NODE_ENV:'production',PORT:3001}},
{name:'apz-web',script:'node_modules/next/dist/bin/next',args:'start',cwd:'./apps/web',env:{NODE_ENV:'production',PORT:3000}}
]};
