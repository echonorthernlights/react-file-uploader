const express = require('express');
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT || 5000
const app = express()

app.use(fileUpload());
app.get('/', (req, res) => {
    res.send('Hello world!!')
})

app.post('/upload', (req, res) => {
    if(req.files === null) {
        return res.status(400).json({msg:'No File Uploaded'})
    }
    //console.log(req.files.file.name)
    const file = req.files.file
    file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
        if(err){
            console.error(err)
            return res.status(500).send(err)
        }
        return res.json({fileName : file.name, filePath : `/uploads/${file.name}`})
    })

})
app.listen(PORT, ()=>{
   console.log('Server running on port : '+PORT+' ....')
})
// const server = express.createServer();
