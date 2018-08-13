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