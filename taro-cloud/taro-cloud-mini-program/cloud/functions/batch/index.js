// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({
  env: 'test-taro-1gs4sohn82c1ff34'
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db
      .collection("user")
      .where({
        name: "bella",
      })
      .remove()
      .then((res) => {
        console.log("here");
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};
