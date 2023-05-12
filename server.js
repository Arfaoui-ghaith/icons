const fastify = require('fastify')({ logger: true })
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()
const FormData = require('form-data');

//Add routes here, discussed in further steps
fastify.get('/icons/:q/', async (request, reply) => {
    try {

        const formData = new FormData();
        formData.append('apikey', "V3zwjQCYZ2NvTbU11gV9GMBg3HdDt2GPTO2H3My0mTydaoPp");

        const response1 = await fetch("https://api.flaticon.com/v3/app/authentication", { method: 'POST', body: formData })
        const data1 = await response1.json()
        const token = data1.data['token'];

        const response = await fetch("https://api.flaticon.com/v3/search/icons/{orderBy}?q=" + request.params.q, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + token}
        });
        console.log("hi");
        const data = await response.json();
        reply.send(data.data.map(el => {
            return {name: `${el.description} ${el['family_name']}`, image: el.images["24"]}
        }));
    }catch (e){

        reply.send(e);
    }
});

fastify.all('*', (request, reply) => {
    reply.status(404).send({
        status: 'fail',
        message: `can't find ${request.url}`
    });
});

fastify.listen({ port: 3000 }, err => {
    if (err) {
        process.exit(1)
    } else {
        console.log(`Server running...`)
    }
})