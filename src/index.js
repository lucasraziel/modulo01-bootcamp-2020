const express = require('express')
const {uuid, isUuid} = require('uuidv4')

const app = express()

app.use(express.json())

const projects = []

function logrequest(request, response, next){
  const {method, url} = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)

  return next()
}

function validadeProjectId(request, response, next){
  const {id} = request.params

 if (!isUuid(id)){
   return response.status(400).json({error:'uuid nao valido'})
 }  
 return next()
}

app.use(logrequest)


app.use('/projects/:id', validadeProjectId)
app.get('/projects', (request, response)=>{
  const {title} = request.query

  const results = title? projects.filter(project=> project.title.includes(title)): projects

  
  return response.json(results)
})

app.post('/projects', (request, response)=>{
  const {title, owner} = request.body

  const project = {id: uuid(), title, owner}

  projects.push(project)


  
  return response.json(project)
})
app.put('/projects/:id', (request, response)=>{
  const {id} = request.params
  const {title, owner} = request.body

  const projectIndex = projects.findIndex(project=>project.id===id)

  if (projectIndex<0){
    return response.status(400).json({error: 'Project does not exist'})
  }
  const project = {
    id,
    title,
    owner
  }
  projects[projectIndex] = project

  return response.json(project)
})

app.delete('/projects/:id', (request, response)=>{
  const {id} = request.params

  const projectIndex = projects.findIndex(project=>project.id===id)

  if (projectIndex<0){
    return response.status(400).json({error: 'Project does not exist'})
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})


app.listen(3333, ()=>{
  console.log('Back-end has started 😊')

})