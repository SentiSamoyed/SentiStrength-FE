import axios from 'axios'

const API_BASE_URL = '/api'

const endpoints = {
  sentimentAnalysisText: '/sentiment/analysis/text',
  getAllVersions: '/repo/versions',
  initRepo: '/repo/init',
  getRepoScore: '/repo/score',
  getRepoGraph: '/repo/graph'
}

const api = {
  sentimentAnalysisText: (data) => axios.post(`${API_BASE_URL}${endpoints.sentimentAnalysisText}`, data),
  getAllVersions: (path) => axios.get(`${API_BASE_URL}${endpoints.getAllVersions}?path=${path}`),
  initRepo: (path) => axios.post(`${API_BASE_URL}${endpoints.initRepo}?path=${path}`),
  getRepoScore: (repo, versions) => axios.post(`${API_BASE_URL}${endpoints.getRepoScore}?repo=${repo}`, versions),
  getRepoGraph: (repo, xAxis) => axios.get(`${API_BASE_URL}${endpoints.getRepoGraph}?repo=${repo}&xAxis=${xAxis}`)

}

export default api
