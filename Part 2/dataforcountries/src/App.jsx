/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import dataforcountriesService from './dataforcountries.js'
import weatherdataService from './weatherdata.js'

const SearchBar = ({ onChange }) => {
  return (
    <form>
      <label htmlFor="country">find country</label>
      <input name="country" onChange={onChange}/>
    </form>
  )
}

const CountryList = ({ searchedCountries, newSearch, handleClick }) => {
  if (newSearch === '') return null

  if (searchedCountries.length >= 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (searchedCountries.length > 1) {
      return (
        <>
          {searchedCountries.map(country => 
            <div key={country.name.common}>
                <p>{country.name.common}</p>
                <button onClick={() => handleClick(country)}>show</button>
            </div>
            )}
        </>
      )
  } else if (searchedCountries.length === 1) return null
}

const CountryDisplay = ({ searchedCountries }) => {
  if (searchedCountries.length === 1) {
    const country = searchedCountries[0]
    const languages = Object.values(country.languages)

    const countryNameStyle = {
      fontWeight: 'bold',
      fontSize: '30px'
    }
    const languageStyle = {
      fontWeight: 'bold',
      fontSize: '15px'
    }
    
    return (
      <div>
        <p style={countryNameStyle}>{country.name.common}</p>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <p style={languageStyle}>languages</p>
        <ul> 
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} />
      </div>
    )
  } else return null
}

const WeatherDisplay = ({ newWeather, searchedCountries}) => {
  if (newWeather === null) return null

  if (searchedCountries[0].cca2 === newWeather.city.country) {
    const img_src = `https://openweathermap.org/img/wn/${newWeather.list[0].weather[0].icon}@2x.png`
    const headerStyle = {
      fontWeight: 'bold',
      fontSize: '20px'
    }

    return (
      <div>
        <p style={headerStyle}>Weather in {newWeather.city.name}</p>
        <p>temperature {Math.round((newWeather.list[0].main.temp-273)*10)/10} Celsius</p>
        <img src={img_src}/>
        <p>wind {newWeather.list[0].wind.speed} m/s</p>
      </div>
    )    
  } else return null
}

const App = () => {
  const [newSearch, setNewSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [searchedCountries, setSearchedCountries] = useState([])
  const [newWeather, setNewWeather] = useState(null)

  useEffect(() => {
    dataforcountriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  useEffect(() => {
    setSearchedCountries(
      countries.filter((country) => 
        country.name.common.toLowerCase().includes(newSearch.toLowerCase()
    )))
  }, [countries, newSearch])

  useEffect(() => {
    if (searchedCountries.length === 1) {
      const lat = searchedCountries[0].capitalInfo.latlng[0]
      const lon = searchedCountries[0].capitalInfo.latlng[1]
      weatherdataService
        .getAll(lat, lon)
        .then(response => {
          setNewWeather(response)
        })
    } else {
      setNewWeather(null)
    }
  }, [searchedCountries, newWeather])

  const handleSearchChange = (event) => setNewSearch(event.target.value)
  const handleClick = (country) => setNewSearch(country.name.common)

  return (
    <div>
      <SearchBar onChange={handleSearchChange}/>
      <CountryList searchedCountries={searchedCountries} newSearch={newSearch} handleClick={handleClick}/>
      <CountryDisplay searchedCountries={searchedCountries} />
      <WeatherDisplay newWeather={newWeather} searchedCountries={searchedCountries}/>
    </div>
  )
}

export default App