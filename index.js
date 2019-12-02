const app = require('./app')
const port = process.env.port || 5000
app.listen(5000,()=>console.log(`Server started! on port ${port}`));

