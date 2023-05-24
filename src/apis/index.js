import axios from 'axios'

const API_BASE_URL = '/api'

const endpoints = {
  sentimentAnalysisText: '/sentiment/analysis/text',
  getAllVersions: '/repo/versions',
  initRepo: '/repo/init'
}

const api = {
  sentimentAnalysisText: (data) => axios.post(`${API_BASE_URL}${endpoints.sentimentAnalysisText}`, data),
  getAllVersions: (path) => axios.get(`${API_BASE_URL}${endpoints.getAllVersions}?path=${path}`),
  initRepo: (path) => axios.post(`${API_BASE_URL}${endpoints.initRepo}?path=${path}`)

}

export default api
