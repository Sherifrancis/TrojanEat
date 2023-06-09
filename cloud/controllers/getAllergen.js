const Async = require("async");
const db = require("../routes/db");

/**
 *
 * @param openid user wechat openid
 * @param type  the type that user consider allergen
 * @returns Promise object that exec the sql query through async programming
 */
function getAllergen(openid, type) {
	return new Promise((resolve, reject) => {
		let sql = `select ${type} from userInfo where userOpenId = '${openid}' and ${type} = -1;`;
		db.query(sql, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
}
// let sql = `select ${type} from userInfo where userOpenId = '${openid}' and ${type} = -1;`;
module.exports = getAllergen;
