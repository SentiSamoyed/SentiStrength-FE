import axios from 'axios'

const API_BASE_URL = '/api'

const endpoints = {
  sentimentAnalysisText: '/sentiment/analysis/text'
}

const api = {
  sentimentAnalysisText: (data) => axios.post(`${API_BASE_URL}${endpoints.sentimentAnalysisText}`, data)
}

export default api
