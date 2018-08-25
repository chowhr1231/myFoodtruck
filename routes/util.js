const dbPool = require('./config/dbconfig');

exports.checkValid = (user, pw, content) => {

    let userValid = 0;
    let pwValid = 0;
    let contentValid = 0;

    if (user > 0 && user < 31)
        userValid = 1;
    else
        userValid = 0;

    if (pw > 0 && pw < 11)
        pwValid = 1;
    else
        pwValid = 0;

    if (content > 0 && content < 501)
        contentValid = 1;
    else
        contentValid = 0;

    return userValid&&pwValid&&contentValid;

}

exports.passwordValid = (req, res) => {

    let {password, boardID} = req.body;
    
    dbPool.getConnection((err, conn)=>{

        if(err){

            conn.release();
            console.log('DB Pool Error: ', err);
            res.status(404);

        }

        let selectQuery = 'SELECT password FROM testboard WHERE boardID = ?;';

        conn.query(selectQuery, [boardID], (err, queryResult)=>{

            let code = 0;

            if(queryResult[0].password == password)
                code = 1;
            else
                code = 0;
            
            if(code == 1){

                res.status(200);
                res.json({"code": code});
    
            }else{

                res.status(200);
                res.json({"code": code});

            }

        });

    });

}