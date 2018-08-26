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

        conn.release();

        if (err) {

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

  const { name, password, title, contents } = req.body;

  console.log(req.body);
  if (checkValid(name.length, password.length, contents.length) == 1) {

    dbPool.getConnection((err, conn) => {

      if (err) {

        conn.release();
        console.log('DB Pool Error');
        res.status(400);
        res.json({
          "msg": "DB Pool Error",
          "code": 0
        });

      }

      let curTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

      let values = [name, title, password, contents, curTime];
      let sql = 'INSERT INTO testboard (`name`, `title`, `password`, `contents`, `createdate`) '
        + 'VALUES(?, ?, ?, ?, ?);'

      conn.query(sql, values, (err, queryResult) => {

        conn.release();

        if (err) {

          conn.release();
          console.log('SQL query Error');
          res.status(400);
          res.json({
            "msg": "SQL Query Error",
            "code": 0
          });

        }

        res.status(200);
        res.json({
          "msg": "작성되었습니다.",
          "code": 1
        });

      });

    });

  }
  else {
    res.status(400);
    res.json({
      "msg": "NOT Valid",
      "code": 0
    });
  }

}

exports.createPage = (req, res) => {

  res.render('write.html');

}

exports.test = (req, res) => {
  console.log(req.body);
  console.log(req.body.pw + '/' + req.body.boardID);
  console.log("call")
  res.status(200);
  res.send('call');
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

      conn.release();

      if (err) {

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
  let page = req.params.page;

  dbPool.getConnection((err, conn) => {

    if (err) {

      conn.release();
      console.log('DB Pool Error: ', err);
      res.status(404).body('DB Pool Error: ', err);

    }

    let selectQuery = 'SELECT title, name, contents, password FROM testboard WHERE boardID = ?;';

    conn.query(selectQuery, [boardId], (err, queryResult) => {

      conn.release();

      if (err) {

        console.log('Select Query Error: ', err);
        res.status(404).body('Select Query Error: ', err);

      }

      res.render('modify', { data: queryResult, page: page, boardID: boardId });

    });

  });

}

exports.modify = (req, res) => {

  let { title, name, password, contents } = req.body;
  let boardID = req.params.boardID;
  let page = req.params.page;

  dbPool.getConnection((err, conn) => {

    if (err) {

      conn.release();
      console.log('DB Poll Error: ', err);
      res.status(404);
      res.send('DB Pool Error: ', err);

    }

    let updateQuery = 'UPDATE testboard SET title=?, name=?, password=?, contents=?, createdate=? WHERE boardID = ?;'
    let curTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let values = [title, name, password, contents, curTime, boardID];

    conn.query(updateQuery, values, (err, queryResult) => {

      if (err) {

        conn.release();
        console.log('Update Query Error: ', err);
        res.status(404);
        res.send('Update Query Error: ', err);

      }

      res.status(200);
      res.json({
        "msg": "수정됐습니다.",
        "code": 1
      })

    });

  });

}

//게시글 삭제 api
exports.deleteBoard = (req, res) => {

  let boardID = req.params.boardID;

  dbPool.getConnection((err, conn) => {

    if (err) {

      conn.release();
      console.log('DB Pool Error: ', err);
      res.status(404);
      res.send('DB Pool Error: ', err);

    }


    console.log(boardID);
    let deleteQuery = 'DELETE FROM testboard WHERE boardID = ?;';

    conn.query(deleteQuery, [boardID], (err, queryResult) => {

      conn.release();
      if (err) {

        console.log('Query Error: ', err);
        res.status(404);
        res.send('Query Error: ', err);

      }

      res.status(302);
      res.redirect('/board/1');

    });

  });

}