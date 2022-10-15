const baseUrl = "http://192.168.101.27:3000";

export const assertUrl = "http://192.168.101.27:3000/assets/";

export const request = (api, data) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + api,
            data: data,
            method: "POST",
            success: res => {
                if (res.statusCode === 200) {
                    switch (res.data.code) {
                        case "3":
                            wx.removeStorageSync('userInfo');
                            wx.removeStorageSync('hasUserInfo');
                            wx.removeStorageSync('tokenId');
                            wx.switchTab({
                                url: '/pages/user/user'
                            })
                            reject(res.data.data);
                            break;
                        case "1":
                            resolve(res.data.data);
                            break;
												case "2":
													  reject(res.data.data);
                            break;
                        default:
                            resolve(res);
                            break;
                    }
                }else {
                    reject("请求失败");
                }
            },
            fail: err => {
                reject(err.errMsg);
            }

        })
    })
}