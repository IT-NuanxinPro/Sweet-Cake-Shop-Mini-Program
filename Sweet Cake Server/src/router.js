import * as api from "./api.js";
import ifLogin from "./middleware/ifLogin.js";

export const useRouter = app => {
    
    app.get("/", api.home); //首页
    
    app.post("/cateList", api.cateList); //获取分类列表

    app.post("/goodList", api.goodList); //获取商品列表

    app.post("/addcart",ifLogin,api.AddCart); //添加购物车
    
    app.post("/cart",ifLogin,api.Cart); //获取购物车数据
    
    app.post("/updatecart",ifLogin,api.UpdateCart); //更新购物车

    app.post('/islogin',ifLogin,api.isLogin) //判断是否登录

    app.post("/login",api.Login) //登录

    app.post("/logout",api.Logout) //退出登录
    
    app.post("/createorder",api.CreateOrder); //创建订单
    
    app.post("/orderlist",ifLogin,api.orderlist); //获取订单列表
    
    app.post("/editaddress",api.EditAddress); //编辑地址
    
    app.post("/addressList",api.getAddresslist); //获取地址列表
    
    app.post("/getalladdress",api.getAllAddress)//获取全部地址
    
    app.post("/deleteaddress",api.deleteAddress)//删除对应的地址
    
    app.post("/addaddress",api.addAddress)//添加数据到数据库
}
