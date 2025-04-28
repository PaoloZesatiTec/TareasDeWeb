// Import the express library
import express from 'express'

// Import the file system library
import fs from 'fs'

// Create a new express application
const app = express()

// Define the port to listen on
const port = 3000

// Use the express.json() middleware to parse the body of the request
app.use(express.json())

// The ./public directory will be used to serve static files (html, css, js, images, etc.)
app.use(express.static('./public'))

// The root route will serve the index.html file, which is located in the ./public/html directory
app.get('/', (req, res)=>
    {
        fs.readFile('./public/index.html', 'utf8', 
        (err, html) => {
            if(err)
            {
                res.status(500).send('There was an error: ' + err)
                return 
            }
            
            console.log("Sending page...")
            res.send(html)
            console.log("Page sent!")
        })
    })

    // Datos locales (en memoria)
let itemsCatalog = []; // Lista de items
let users = [];        // Lista de usuarios

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});