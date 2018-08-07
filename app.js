const express = require('express');
const app = express();
const router = require('./router');

//css engine
app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const Log = (req, res, next)=>{
  
  console.log('[API/Method]: '+ req.url + ' / ' + req.method);
  next();

}

app.use(express.static('public'));

app.use('/', Log);
app.get('/', (req, res)=>{

  res.render('index.html');

});
app.use('/', router);

app.listen(3000, ()=>{
  console.log('Server is running 3000 Port...');
});