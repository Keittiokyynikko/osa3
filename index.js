require('dotenv').config()
const express = require('express')
const app = express()
const Contact = require('./models/contact')

const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

var morgan = require('morgan')
const { response } = require('express')

//const { request, response } = require('express')


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)

}


const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next()
  }


app.use(requestLogger)


morgan.token('method', (req, res) => req.method)
morgan.token('path', (req, res) => req.path)
morgan.token('status', (req, res) => res.statusCode)
morgan.token('body', (req, res) => req.body)

app.use(morgan(':method - :path - :status - :body'))



app.get('/api/persons', (req, res) => {
    Contact.find({}).then(people => {
        res.json(people)
    })
  })

app.get('/info', (req, res) => {
    const date = new Date()
    Contact.countDocuments({}, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send('<p>Phonebook has info for ' + result + ' people</p>' + date)
        }
    })
})

app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log(req.body)

    if(!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else if(!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    } else if(!Contact.find({content: {$eq: body.content}})) {
        return res.status(400).json ({
            error: 'name must be unique'
        })
    } else {
        const person = new Contact({
            content: body.content,
            number: body.number,
        }) 

        person.save()      
            .then(savedPerson => savedPerson.toJSON())
            .then(savedAndFormattedPerson => {
                res.json(savedAndFormattedPerson)
            })
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        content: body.content,
        number: body.number,
    }

    Contact.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
    Contact.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}


app.use(unknownEndpoint)

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})