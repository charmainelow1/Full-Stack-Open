import { useState, useEffect } from 'react'
import phonebookService from './phonebook.js'

const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      filter shown with:<input onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form>
      <div>
        name: <input onChange={handleNameChange}/>
      </div>
      <div>
        number: <input onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit" onClick={handleSubmit}>add</button>
      </div>
  </form>
  )
}

const Persons = ({ persons, newFilter, handleDelete }) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  return (
    filteredPersons.map(person =>
      <div key={person.name}>
        <p>{person.name} {person.number}</p>
        <button onClick={() => handleDelete(person)}>Delete</button>
      </div>
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilter(event.target.value)
  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = {...person, number: newNumber}

        phonebookService
          .update(updatedPerson.id, updatedPerson)
          .then( response => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : response))
          })
      }
    } else {
        const personObject = {
          name: newName,
          number: newNumber
        }

        phonebookService
          .create(personObject)
          .then(response => {
            setPersons(persons.concat(response))
          })
    }
  }

  const handleDelete = (personToRemove) => {
    if (window.confirm(`Delete ${personToRemove.name}`)) {
      phonebookService
      .remove(personToRemove.id)
      .then(response => {
        setPersons(
          persons.filter(person => person.id !== personToRemove.id)
        )
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange}/>

      <h2>add a new</h2>
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit}/>

      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App