import axios from 'axios'
const api_key = import.meta.env.VITE_KEY

const getAll = (lat, lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`)
    return request.then(request => request.data)
}

export default { getAll }