import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

function CloudTest() {
  const [images, setImages] = useState([]);

  const db = Taro.cloud.database();

  const addUser = () => {
    db.collection('user')
      .add({
        data: {
          name: 'alice',
          age: '26',
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
    // db.collection('user')
    //   .add({
    //     data: {
    //       name: 'bella',
    //       age: '25',
    //     },
    //   })
    //   .then(res => {
    //     console.log(res);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  };

  const searchUser = () => {
    db.collection('user')
      .doc('ce805e78600240ff047e687051ecb4c3')
      .get()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const deleteUser = () => {
    db.collection('user')
      .doc('ce805e78600240ff047e687051ecb4c3')
      .remove()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const updateUser = () => {
    db.collection('user')
      .doc('ce805e78600240ff047e687051ecb4c3')
      .update({
        data: {
          age: 22,
        },
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const batchDelete = () => {
    Taro.cloud
      .callFunction({
        name: 'batch',
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getOpenID = () => {
    Taro.cloud
      .callFunction({
        name: 'login',
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const upload = () => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
    })
      .then(res => {
        Taro.cloud
          .uploadFile({
            cloudPath: `${new Date().getTime()}.png`, // 上传至云端的路径
            filePath: res.tempFilePaths[0], // 小程序临时文件路径
          })
          .then(res => {
            db.collection('image').add({
              data: {
                fileID: res.fileID,
              },
            });
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const show = () => {
    Taro.cloud
      .callFunction({
        name: 'login',
      })
      .then(res => {
        db.collection('image')
          .where({
            _openid: res.result.openid,
          })
          .get()
          .then(res => {
            console.log(res);
            setImages(res.data);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => console.error(err));
  };

  const download = fileID => {
    Taro.cloud
      .downloadFile({
        fileID: fileID,
      })
      .then(res => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
          .then(res => {
            Taro.showToast({
              title: '保存成功',
              icon: 'success',
            });
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

  const imageList = images.map((item, index) => {
    return (
      <View>
        <Image src={item.fileID}></Image>;
        <Button onClick={() => download(item.fileID)}>下载图片</Button>
      </View>
    );
  });

  return (
    <view>
      <Text>云数据库</Text>
      <Button onClick={addUser}>添加用户</Button>
      <Button onClick={searchUser}>查询用户</Button>
      <Button onClick={deleteUser}>删除用户</Button>
      <Button onClick={updateUser}>更新用户信息</Button>
      <Text>云函数</Text>
      <Button onClick={batchDelete}>批量删除用户</Button>
      <Button onClick={getOpenID}>获取openid</Button>
      <Text>云存储</Text>
      <Button onClick={upload}>上传图片</Button>
      <Button onClick={show}>展示图片</Button>
      <View>{imageList}</View>
    </view>
  );
}

export default CloudTest;
