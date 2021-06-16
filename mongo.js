const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.9phs0.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  const contactSchema = new mongoose.Schema({
  content: String,
  number: String,
})

const Contact = mongoose.model('Person', contactSchema)


const contact = new Contact({
  content: name,
  number: number,
})


if(process.argv.length===5) {
    contact.save().then(response => {
        console.log('added ' + contact.content + ' ' + contact.number + ' to phonebook')
        mongoose.connection.close()
      })

} else if(process.argv.length<4) {
    Contact.find({}).then(result => {
        result.forEach(contact => {
          console.log(contact)
        })
        mongoose.connection.close()
      })
}