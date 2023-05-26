import axios from 'axios'

const API_BASE_URL = '/api'

function buildUrl(endpoint, params = {}) {
  let url = `${API_BASE_URL}${endpoint}`
  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g')
    url = url.replace(regex, value)
  })
  console.log('请求URL：' + url)
  return url
}

const endpoints = {
  sentimentAnalysisText: '/sentiment/analysis/text',
  getRepoList: '/repo/list',
  getRepoInfo: '/repo/{owner}/{name}',
  initRepo: '/repo/{owner}/{name}/init',
  getRepoIssues: '/repo/{owner}/{name}/issues',
  getRepoReleases: '/repo/{owner}/{name}/releases',
  getRepoTendency: '/repo/{owner}/{name}/tendency',
  getRepoTotal: '/repo/{owner}/{name}/total',
  getRepoPieChart: '/repo/{owner}/{name}/pieChart'
}

const api = {
  sentimentAnalysisText: (data) => axios.post(buildUrl(endpoints.sentimentAnalysisText), data),
  getRepoList: () => axios.get(buildUrl(endpoints.getRepoList)),
  getRepoInfo: (owner, name) => axios.get(buildUrl(endpoints.getRepoInfo, { owner: owner, name: name })),
  getRepoIssues: (owner, name) => axios.get(buildUrl(endpoints.getRepoIssues, { owner, name })),
  getRepoReleases: (owner, name) => axios.get(buildUrl(endpoints.getRepoReleases, { owner, name })),
  initRepo: (owner, name) => axios.get(buildUrl(endpoints.initRepo, { owner: owner, name: name })),
  getRepoTendency: (owner, name, granularity) => axios.get(buildUrl(endpoints.getRepoTendency, {
    owner,
    name
  }) + `?granularity=${granularity}`),
  getRepoTotal: (owner, name, releaseTags) => axios.post(buildUrl(endpoints.getRepoTotal, {
    owner,
    name
  }), releaseTags),
  getRepoPieChart: (owner, name, from, to) => axios.get(buildUrl(endpoints.getRepoPieChart, {
    owner,
    name
  }) + `?from=${from}&to=${to}`)
}

export default api
