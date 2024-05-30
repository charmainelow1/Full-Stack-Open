import { useState } from 'react'

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

const Persons = ({ persons, newFilter }) => {
  const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))
  return (
    filteredPersons.map(person =>
      <p key={person.name}>{person.name} {person.number}</p>
    )
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas', 
      number: 12345678
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState(0)
  const [newFilter, setNewFilter] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setNewFilter(event.target.value)
  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange}/>

      <h2>add a new</h2>
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit}/>

      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter}/>
    </div>
  )
}

export default App