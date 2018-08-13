const express = require('express');
const bodyparser = require('body-parser');
const router = require('./router');

const app = express();

//css engine
app.set('views', './views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//body-parser는 전체적으로 사용하기 때문에 app.use사용
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json({extended:true}));

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