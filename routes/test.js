const request = require('request');
const xml2js = require('xml2js');
const proj4 = require('proj4');

exports.test = () => {

    const url = 'http://www.localdata.kr/platform/rest/24_87_01_P/openApi?authKey=IEoaWrAc1/2RtpvSVJWkqFLrj2z2rZB7FHzWIZ1vtHQ=&localCode=6110000&state=01&pageSize=100';
   // const url = 'http://www.localdata.kr/platform/rest/GR0/openDataApi?authKey=oPwBKkdOlJJdhwveIEB2CXwCN=QmfGbf1iqmgr9mP=8=';
    
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            if (err) {
                console.log('err: ', err);
                return reject(err);
            }
            else {
                let parser = new xml2js.Parser();
                let xml = body;
                parser.parseString(xml, (res, result) => {
                    let data = result.result.body[0].rows[0].row;

                    let firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-145.907,505.034,685.756,-1.162,2.347,1.592,6.342";
                    var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
                    
                    let arry = new Array();
                    
                    for (var i in data) {
                        let list = new Object();
                        
                        let location = proj4(firstProjection, secondProjection, [parseFloat(data[i].x[0]), parseFloat(data[i].y[0])]);

                        list.name = data[i].bplcNm[0];
                        list.x = parseFloat(location[1]);
                        list.y = parseFloat(location[0]);

                        arry.push(list);
                    }

                    resolve(arry);
                });
            }
        });
    });
}