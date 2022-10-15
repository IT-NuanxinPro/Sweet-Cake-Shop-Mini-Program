import { get, update } from "./db/api.js";
import { getDbId } from "./kits/hash.js";
import moment from "moment";

//默认
export const home = (req, res) => {res.send("欢迎来到甜心蜜语蛋糕坊");}

//商品列表
export const goodList = async (req, resp) => {
    try {
        const goodLists = await get("goodList");
        const params = req.body;
        const filterGood = goodLists.filter(item => {
            return item.text.includes(params.keyword);
        })
        resp.send(filterGood);
    } catch (e) {
        resp.status(500).send(e.message);
    }
}

//分类列表
export const cateList = async (req, resp) => {
    try {
        const cateLists = await get("cateList"); //获取数据
        resp.send(cateLists);
    } catch (e) {
        resp.status(500).send(e.message);
    }
}

//添加购物车
export const AddCart = async (req, resp) => {
    try {
        const params = req.body;
        console.log("传进来得信息",params);
        const cartList1 = await get("cart");
        const cartList = Object.values(cartList1);
        let flag = false;

        // 判断是否已经存在
        for (const cart of cartList) {
            if (cart.userId === params.userId && cart.goodId === params.id) {
                flag = true;
                cart.num += params.num;
                cart.favourName = params.favourName;
                if(params.buyWay="立即购买"){
                    cart.buyWay = "";
                }else{
                    cart.buyWay = params.buyWay;
                }
                break;
            }
        }

        // 如果不存在,则添加
        if (!flag) {
            params.goodId = params.id
            delete params.id
            delete params.tokenId
            cartList.push(params)
        }

        await update("cart", cartList)
        resp.send({
            code: "1",
            data: "添加成功"
        })

    } catch (e) {
        resp.send(e.message);
    }
}

//购物车
export const Cart = async (req,resp)=>{
    try{
        const params = req.body
        const cartList = await get("cart")
        const data = cartList.filter(item => item.userId === params.userId)
        resp.send({
            code:"1",
            data
        })
    } catch(e){
        resp.send(e.message);
    }
}

// 更新购物车
export const UpdateCart = async (req,resp) => {
    try {
        const params = req.body;
        const cartList = await get("cart");
        const cart_filter = cartList.filter(item => item.userId !== params.userId); 
        await update("cart",cart_filter.concat(params.list));
        resp.send({
            code:"1",
            data:""
        })
    } catch (e) {
        resp.send({
            code:"2",
            data:e.message
        })
    }
}

// 创建订单
export const CreateOrder = async (req,resp) => {
    try {
        const params = req.body;
        const orderList1 = await get("orderList")
        const orderList = Object.values(orderList1)
        const id = getDbId(Date.now().toString());
        const createTime = moment().format("YYYY-MM-DD HH:mm:ss")
        // 时间戳+6位随机数生成的订单号
        function orderCode() {
            let orderCode="";
            for(let i=0 ; i<5 ; i++){
                orderCode +=Math.floor(Math.random()*10);
            }
            orderCode = new Date().getTime() +orderCode;  //时间戳
            return orderCode
        }
        const orderNum = orderCode();
        orderList.push({
            id,
            userId:params.userId,
            createTime,
            orderNum,
            list:params.list,
            isSelect:false
        })
        await update("orderList",orderList)
        
        
        const cartList =  await get("cart")
        
        const cartList_filter = cartList.filter(item => item.isSelect !== true)
        
        await update("cart",cartList_filter)
        
        resp.send({
            code:"1",
            data:"创建订单成功"
        })
    } catch (e) {
        resp.send({
            code:"2",
            data:e.message
        })
    }
}

//订单列表
export const orderlist = async (req,resp) =>{
    try {
        const orderList = await get("orderList"); //获取数据
        resp.send(orderList);
    } catch (e) {
        resp.status(500).send(e.message);
    }
}

//判断是否登录
export const isLogin = async (req, resp) => {
    try {
        const params = req.body;
        const userList = await get("user");
        const sessionList = await get("session");
        const user = userList.data.find(item => {
            return item.id === params.id;
        }
        )
        const session = sessionList.data.find(item => {
            return item.userId === params.id;
        }
        )
        if (user) {
            resp.send({
                code: 1,
                data: {
                    id: user.id,
                    nickName: user.nickName,
                    avatarUrl: user.avatarUrl,
                    tokenId: session.tokenId
                }
            })
        } else {
            resp.send({
                code: 0,
                data: "未登录"
            })
        }
    } catch (e) {
        resp.send(e.message);
    }
}

//登录
export const Login = async (req, resp) => {
    try {
        const userlist = await get("user")
        const sessionList = await get("session")
        const params = req.body
        let flag = false,
            userObj = {},
            tokenId = ""

        for (const user of userlist) {
            if (user.nickName === params.nickName) {
                flag = true
                userObj = user
            }
        }
        // 判断该用户是否注册过
        if (flag) {
            // 注册过
            let sessionFlag = false
            // 是否已登陆
            for (const session of sessionList) {
                if (session.userId === userObj.id) {
                    // 已登陆
                    sessionFlag = true
                    session.actionTime = Date.now()
                    // 跟新会话表里的最新操作时间
                   await update("session", sessionList)
                    tokenId = session.tokenId
                }
            }
            if (!sessionFlag) {
                // 没有登陆,插入一条会话记录
                tokenId = await updateSession(userObj.id, sessionList)
            }
        } else {
            // 没有注册过
            const id = getDbId(params.nickName);
            // 插入一条用户基础信息
           await  updateUser(id, params.nickName, params.avatarUrl, userlist)
            // 插入一条会话信息
            tokenId = await updateSession(id.substring(0, 6), sessionList)
        }
        resp.send({
            tokenId
        })
    } catch (e) {
        resp.status(500).send(e.message)
    }
}

//退出登录
export const Logout = async (req, resp) => {
    try {
        const params = req.body
        const sessionList = await get("session");
        const sessionList_filter = sessionList.filter(item => item.tokenId === params.tokenId ? false : true)
        await update("session", sessionList_filter)
        resp.send("ok")
    } catch (e) {
        resp.status(500).send(e.message)
    }
}

//编辑地址
export const EditAddress = async (req,resp) => {
    try {
        const params = req.body
        const addressList =  await get("addressList");
        let flag = false
        for (const address of addressList) {
            address.isDefault = false
            if (address.id === params.id) {
                flag = true
                address.name = params.name
                address.mobile = params.mobile
                address.city = params.city
                address.street = params.street
                address.checked = params.checked
                address.isSelect = params.isSelect
                if (params.isDefault == true) {
                    address.isDefault = true
                } else {
                    address.isDefault = false
                }
            }
        }
        // 之前没存过地址s
        if(!flag){
            addressList.push({
                id: params.id,
                name: params.name,
                mobile: params.mobile,
                city: params.city,
                street: params.street,
                isDefault: params.isDefault,
                isSelect: false
            })
        }
       await update("addressList",addressList)
        resp.send({
            code:"1",
            data:"保存成功"
        })
    } catch (e) {
        resp.send({
            code:"2",
            data:e.message
        })
    }
}

// 添加地址====>请求到数据库
export const addAddress = async (req, resp) => {
    try {
        const params = req.body.address
        const addressList = await get("addressList")
        for (const address of addressList) {
            if (params.isDefault === true) {
                addressList.forEach((v) => {
                    v.isDefault = false
                })
            }
            if (params.id === address.id) {
                break
            }
        }
        addressList.unshift(params)
        await update("addressList", addressList)
        resp.send(addressList);
    } catch (e) {
        resp.send({
            code: "2",
            data: e.message
        })
    }
}

// 删除数据库地址请求
export const deleteAddress = async (req, resp) => {
    try {
        const params = req.body.address
        const addressList = await get("addressList")
        for( let i=0,length=addressList.length;i<length; i++){
            if(addressList[i].id==params.id){
                addressList.splice(i, 1)
                await update("addressList", addressList);
            }
        }
        resp.send(addressList);
    } catch (e) {
        resp.send({
            code: "2",
            data: e.message
        })
    }
}

// 拿到数据库全部地址数据
export const getAllAddress = async (req, resp) => {
    try {
        const addressList = await get("addressList");
        resp.send(addressList);
    } catch (e) {
        resp.send({
            code: "2",
            data: e.message
        })
    }
}

//选择地址的时候请求地址
export const getAddresslist = async (req, resp) => {
    try {
        const addressList = await get("addressList");
        resp.send(addressList);
    } catch (e) {
        resp.send({
            code: "2",
            data: e.message
        })
    }
}

// 更新用户表
const updateUser = async (id, nickName, avatarUrl, userlist) => {
    userlist.push({
        id: id.substring(0, 6),
        nickName: nickName,
        avatarUrl: avatarUrl,
        openId: ""
    })
   await update("user", userlist)
}

// 更新会话表
const updateSession = async (userId, sessionList) => {
    const tokenId = getDbId(userId);
    sessionList.push({
        userId,
        tokenId,
        actionTime: Date.now()
    })
    await update("session", sessionList)
    return tokenId
}



