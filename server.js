const fastify = require('fastify')({ logger: true })
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

const getToken = async () => {
    try{
        const formData = new FormData();
        formData.set('apikey', process.env.APIKEY);

        const response = await fetch(process.env.URL1, { method: 'POST', body: formData })
        const data = await response.json()

        console.log(data)
        return data.data.token;
    } catch (e){
        return e;
    }
}

//Add routes here, discussed in further steps
fastify.get('/icons/:q', async (request, reply) => {
    try {
        const formData = new FormData();
        formData.set('apikey', process.env.APIKEY);

        const response1 = await fetch(process.env.URL1, { method: 'POST', body: formData })
        const data1 = await response1.json()
        const token = data1.data.token;

        const response = await fetch(process.env.URL2 + request.params.q, {
            method: 'get',
            headers: {'Authorization': 'Bearer ' + token}
        });
        const data = await response.json();

        console.log(data,token);

        reply.send({
            data,token,apikey:process.env.APIKEY
        })

        /*reply.send(data.data.map(el => {
            return {name: `${el.description} ${el.family_name}`, image: el.images["24"]}
        }));*/
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

//@Server
const port = process.env.PORT || 3000
fastify.listen(port , (err) => {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        console.log(`Server running...`)
    }
})