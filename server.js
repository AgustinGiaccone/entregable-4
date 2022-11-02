const express = require('express')
// const multer = require('multer')
// const {Router} =require ('express')
const Contenedor = require('./Contenedor.js')
const app = express()
const port = process.env.PORT || 8080
const routerProductos = express.Router()
routerProductos.use(express.urlencoded({extended:true}))
routerProductos.use(express.json())
const itemRouter = express.Router({mergeParams: true})
const vehiculos = new Contenedor('productos.txt')


app.use('/api', routerProductos)
routerProductos.use('/:userId',itemRouter)

app.use(express.static(__dirname +'/public'))
app.use(express.urlencoded({extended:true}))

// routerProductos.use(express.json())
// routerProductos.use('/productos', routerProductos)
const servidor = app.listen(port, () => {
    console.log(`servidor en el http://localhost:${port}`)
})

// app.get('/', (req, res) => {
//     res.send('<h1>Bienvenido al entregable numero 3 de backend</h1><h2>Para visualisar todos los productos:</h2> <a>https://entregable3-giaccone.herokuapp.com/productos</a><br><h2>Para visualisar un producto aleatorio:</h2> <a>https://entregable3-giaccone.herokuapp.com/productosRandom</a>')
// })

routerProductos.get('/productos', async (req, res) => {
    const automovil = await vehiculos.getAll()
    res.send(automovil)
})
// app.get('/api/productosRandom', async (req, res) => {
//     const automovil = await vehiculos.getAll()
//     let vehiculoRandom = parseInt(Math.random() * automovil.length)
//     res.send(automovil[vehiculoRandom])
// })

// itemRouter.route('/:itemId')
//     .get(function (req, res) {
//         res.status(200)
//             .send('hello item ' + req.params.itemId + ' from user ' + req.params.userId);
//     });

itemRouter.get('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const producto = await vehiculos.getById(id);
    console.log('el id buscado es', id)
    res.send(producto)
})

routerProductos.post('/productos',async(req,res)=>{
    const {body}= req
    console.log(body)
    const nuevoVehiculo = await vehiculos.save(body)
    const automovil = await vehiculos.getAll()
    res.send(automovil)
})

itemRouter.delete('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const producto = await vehiculos.deleteById(id);
    console.log('Se elimino el vehiculo con el id', id)
    const automovil = await vehiculos.getAll()
    res.send(automovil)
})

itemRouter.put('/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const title = req.body.title
    const precio = req.body.precio
    const thumbnail = req.body.Thumbnail
    const producto = await vehiculos.editById(id,title,precio,thumbnail);
    const automovil = await vehiculos.getAll()
    res.send(automovil)
    
})



servidor.on('error', error => console.log(`error ${error}`))