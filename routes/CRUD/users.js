const moment = require('moment');
const dbPool = require('../config/dbconfig');
const { checkValid } = require('../util');

//게시판 api
exports.boardList = (req, res) => {

  const page = req.params.page;

  dbPool.getConnection((err, conn) => {

    if (err) {

      conn.release();
      console.log('DB Pool Error: ' + err);
      res.send(400, 'DB Pool Error');

    }

    let selectQuery = 'SELECT boardID, contents, name, createdate, title '
      + 'FROM testboard '
      + 'ORDER BY boardId DESC '
      + 'LIMIT ?, 8;';

    let countQuery = 'SELECT COUNT(boardID) FROM testboard;';

    conn.query(selectQuery, [8 * (page - 1)], (err, queryResult) => {

      if (err) {

        conn.release();
        console.log('Error Select Query: ', err);
        res.send(404, 'Error select qeury: ', err);

      }

      conn.query(countQuery, (err, countResult) => {

        if (err) {

          conn.release();
          console.log('Error Count Qeury: ', err);
          res.send(404, 'Error Count Query: ', err);

        }

        let count = countResult[0]['COUNT(boardID)'];

        res.status(200);
        //queryResult-DB에서 가져온 정보 page-url에서 받아온 정보 count-DB에 있는 게시글 개수
        res.render('boardList', { data: queryResult, page: page, count: count });

      });

    });

  });

}

//게시판 작성관한 api
/*
  조건
  1. 작성자 최대 30자
  2. 비밀번호 최대 10자
*/
exports.createBoard = (req, res) => {

  const { name, pw, title, content } = req.body;

  if (checkValid(user.length, pw.length, content.length) == 1) {

    dbPool.getConnection((err, conn) => {

      if (err) {

        conn.release();
        console.log('DB Pool Error');
        res.send(404, 'DB Pool Error');

      }

      let curTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      let values = [user, title, pw, content, curTime];
      let sql = 'INSERT INTO testboard (`name`, `title`, `password`, `contents`, `createdate`) '
        + 'VALUES(?, ?, ?, ?, ?);'

      conn.query(sql, values, (err, queryResult) => {

        if (err) {

          conn.release();
          console.log('SQL query Error');
          res.send(404, 'SQL query Error');

        }

        conn.release();
        res.status(200);
        res.redirect('/board/1');

      });

    });

  }
  else
    res.send('Not Valid');

}

exports.createPage = (req, res) => {

  res.render('write.html');

}

//게시글 api
exports.boardShow = (req, res) => {

  let boardId = req.params.boardID;
  let page = req.params.page;

  dbPool.getConnection((err, conn) => {

    if (err) {

      conn.release();
      console.log('DB Pool Error: ', err);
      res.send(404, 'DB Pool Error: ', err);

    }

    let selectQuery = 'SELECT title, name, contents, password FROM testboard WHERE boardID = ?;';

    conn.query(selectQuery, [boardId], (err, result) => {

      if (err) {

        conn.release();
        console.log('Query Error: ', err);
        res.send(404, 'Query Error: ', err);

      }

      res.render('show', { data: result, page: page, boardID: boardId });

    });

  });

}

//게시글 수정 api
exports.modifyView = (req, res) => {

  let boardId = req.params.boardID;

  dbPool.getConnection((err, conn)=>{

    if(err){

      conn.release();
      console.log('DB Pool Error: ', err);
      res.status(404).body('DB Pool Error: ', err);

    }

    let selectQuery = 'SELECT title, name, contents password FROM testboard WHERE boardID = ?;';

    conn.query(selectQuery, [boardId], (err, queryResult)=>{

      if(err){

        conn.release();
        console.log('Select Query Error: ', err);
        res.status(404).body('Select Query Error: ', err);

      }

      res.render('modify', {data: queryResult});

    });

  });

}

exports.modify = (req, res)=>{

  let {title, name, password, contents} = req.body;
  let boardID = req.params.boardID;
  let page = req.params.page;

  dbPool.getConnection((err, conn)=>{

    if(err){

      conn.release();
      console.log('DB Poll Error: ', err);
      res.status(404).body('DB Pool Error: ', err);

    }

    let updateQuery = 'UPDATE testboard SET title=?, name=?, password=?, contents=?, createdate=? WHERE boardID = ?;'
    let curTime = moment(Date()).format('YYYY-MM-DD HH:mm:ss');
    let values = [title, name, password, contents, curTime, boardID];

    conn.query(updateQuery, values, (err, queryResult)=>{

      if(err){

        conn.release();
        console.log('Update Query Error: ', err);
        res.status(404).body('Update Query Error: ', err);

      }

      res.status(200);
      res.redirect('/board/' + page + '/' + boardID);

    });

  });

}