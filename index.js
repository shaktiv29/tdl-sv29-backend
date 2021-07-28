import express from "express"
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

async function index(){
dotenv.config()
try{
let x = await mongoose.connect(`mongodb+srv://shaktiv:${process.env.PASSWORD}@cluster0.7d28x.mongodb.net/ToDoListData?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
console.log('database connected')
}catch(e){
    console.log('not connected')
    console.log(e)
}
const port = process.env.PORT || 8000

const messageSchema = new mongoose.Schema({
    idbrowser: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

const ToDoListOne = new mongoose.model("ToDoListOne", messageSchema);


let app = express()
app.use(cors({ origin: true, credentials: true }))

const createDocument = async(req) => {
    console.log('Create Request')
    try {
        const newMessage = new ToDoListOne(req.body)
        const x = await newMessage.save()
        return x._id

    } catch (e) {
        console.log(e)
    }

}
const ReadDocument = async() => {
    console.log('Read Request')
    try {
        const result = await ToDoListOne.find()
        return result
    } catch (e) {
        return e
    }
}

const UpdateDocument = async(req) => {
    console.log('Update Request')
    try {
        const result = await ToDoListOne.updateOne({idbrowser:req.body.idbrowser},{
            data: req.body.uvalue
        })
    }
    catch(e){
        console.log(e)
        return e
    }
}

const DeleteDocument = async(req) => {
    console.log('Delete Request')
    try {
        const result = await ToDoListOne.deleteOne(req.body)
        return result
    }
    catch(e){
        console.log(e)
        return e
    }
}
app.get('/', (req, res) => {
    res.send('Yes this worked')
})
app.use(express.json())
app.post('/addtask', async(req, res) => {
    const ident = await createDocument(req)
    const idjson = { id: ident}
    res.send(idjson)
})
app.get('/readtasks', async(req, res) => {
    const data = await ReadDocument()
    res.send(data)
})
app.post('/updatetask', async(req,res) => {
    const data = await UpdateDocument(req)
    res.send(data)
})
app.post('/deletetask', async(req,res)=>{
    const data = await DeleteDocument(req)
    res.send(data)
})

app.listen(port, () => {
    console.log('app listening on port '+ port)
})
}

index();