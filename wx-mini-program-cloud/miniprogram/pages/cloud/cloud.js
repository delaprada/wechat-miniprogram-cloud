//index.js
const app = getApp();

// 云数据库
const db = wx.cloud.database();

Page({
  data: {
    images: []
  },
  addUser: function () {
    // promise写法
    db.collection('user').add({
      data: {
        name: "jerry",
        age: "22"
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })

    // db.collection('user').add({
    //   data: {
    //     name: "oliver",
    //     age: "28"
    //   },
    //   success: res => {
    //     console.log(res);
    //   }, 
    //   fail: err => {
    //     console.log(err);
    //   }
    // })
  },
  updateUser: function () {
    db.collection('user').doc('b45a21d56000094504c906d53ce26cb8').update({
      data: {
        age: "29"
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  deleteUser: function () {
    db.collection('user').doc('21ded5cb600007b404f3e9ca65787bab')
      .remove()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  },
  searchUser: function () {
    db.collection('user').where({
      name: "oliver"
    })
      .get().then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
  },
  sum: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'add',
      // 云函数参数
      data: {
        a: 1,
        b: 2,
      }
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  getOpenID: function () {
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  },
  upload: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      const tempFilePaths = res.tempFilePaths;
      console.log(tempFilePaths);
      wx.cloud.uploadFile({
        cloudPath: `${new Date().getTime()}.png`, // 上传至云端的路径
        filePath: tempFilePaths[0], // 小程序临时文件路径
      }).then(res => {
        // 返回文件 ID
        console.log(res.fileID);
        db.collection('image').add({
          data: {
            filePath: res.fileID
          }
        })
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  },
  show: function () {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res);
      // 只能看到用户自己上传的图片，用openid来判断
      db.collection('image')
        .where({
          _openid: res.result.openid
        })
        .get()
        .then(res => {
          this.setData({
            images: res.data
          })
        })
        .catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    })
  },
  download: function(event) {
    console.log(event);
    wx.cloud.downloadFile({
      fileID: event.target.dataset.fileid, // 文件 ID
    }).then(res => {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath
      }).then(res => {
        wx.showToast({
          title: '保存成功',
        })
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  }
})
