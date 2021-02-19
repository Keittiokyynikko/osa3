const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323532" 
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345" 
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122" 
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/info', (req, res) => {
    const personList = persons.length
    const date = new Date()
    res.send('<p>Phonebook has info for ' + personList + ' people</p>' + date)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const num = persons.find(per => per.id === id)

    if(num) {
        res.json(num)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(per => per.id !== id)

    res.status(204).end()
})

const generateId = () => {
    /* const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1 */

  const maxId = Math.floor(Math.random() * 99) + 1
  return maxId
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})