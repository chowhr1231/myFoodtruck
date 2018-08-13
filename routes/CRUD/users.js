const moment = require('moment');
const dbPool = require('../config/dbconfig');
const {checkValid} = require('../util');

//초기 화면
exports.boardList = (req, res)=>{

  res.render('boardList.html');

}

//게시판 작성관한 api
/*
  조건
  1. 작성자 최대 30자
  2. 비밀번호 최대 10자
*/
exports.createBoard = (req, res)=>{

  const {user, pw, title, content} = req.body;
  
  if(checkValid(user.length, pw.length, content.length) == 1){

    dbPool.getConnection((err,conn)=>{

      if(err){

        conn.release();
        console.log('DB Pool Error');
        res.send(400, 'DB Pool Error');

      }

      let curTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      let params = [user, title, pw, content, curTime];
      let sql = 'INSERT INTO testboard (`name`, `title`, `password`, `contents`, `createdate`) ' 
              + 'VALUES(?, ?, ?, ?, ?);'

      conn.query(sql, params, (err, queryResult)=>{

        if(err){

          conn.release();
          console.log('SQL query Error');
          res.send(400, 'SQL query Error');

        }

        conn.release();
        res.redirect(200, '/board');

      });

    });

  }
  else
    res.send('Not Valid');

}

exports.createPage = (req, res)=>{

  res.render('write.html');

}