// const {
//     Pagination
// } = require('element-ui')
const fs = require('fs')

//分页
function pagination(pageSize, currentPage, data) {
    //当前页 已显示的所有数据长度
    let Num = (currentPage - 1) * pageSize
    //下一页数据的长度大于总页数 则取所有数据 否则取当前数据长度到这页结束时获取的长度
    data = (Num + pageSize >= data.length) ? data.slice(Num, data.length) : data.slice(Num, Num + pageSize)
    return data
}

//排序
function sortBy(attr, rev) {
    if (rev == undefined) {
        //默认升序
        rev = 1
    } else {
        rev = rev ? 1 : -1
    }
    return function (a, b) {
        a = a[attr]
        b = b[attr]
        if (a < b) {
            return rev * -1
        }
        if (a > b) {
            return rev * 1
        }
        return 0
    }
}

//过滤
function range(arr, gt, lte) {
    return arr.filter(item => item.salePrice >= gt && item.salePrice <= lte)
}
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cartListJson = require('./db/cartList.json')

module.exports = {
    devServer: {
        before(app, serve) {
            app.use(cors())
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended:false}))

            app.get('/api/goods/home', (req, res) => {
                fs.readFile('./db/home.json', 'utf-8', (err, data) => {
                    if (!err) {
                        res.json(JSON.parse(data))
                    }
                })
            })
            app.get('/api/goods/allGoods', (req, res) => {
                // 获取地址栏get传参
                const page = parseInt(req.query.page)
                const size = parseInt(req.query.size)
                const sort = parseInt(req.query.sort)
                const gt = parseInt(req.query.priceGt)
                const lte = parseInt(req.query.priceLte)
                const cid = parseInt(req.query.cid)
                let newData = []
                fs.readFile('./db/allGoods.json', 'utf-8', (err, data) => {
                    let {
                        result
                    } = JSON.parse(data)
                    let allData = result.data

                    //    分页显示
                    newData = pagination(size, page, allData);

                    if (cid == 1184) {
                        newData = allData.filter(item => {
                            let Name = item.productName
                            return Name.match('Smartisan')

                        })
                        if (sort == 1) {
                            newData = newData.sort(sortBy('salePrice', true))
                        } else if (sort == -1) {
                            newData = newData.sort(sortBy('salePrice', false))
                        }
                        if (gt >= 0 && lte >= gt) {
                            //在gt 和 lte 之间的数据
                            newData = range(newData, gt, lte)
                        }
                    } else {
                        if (sort == 1) {
                            newData = newData.sort(sortBy('salePrice', true))
                        } else if (sort == -1) {
                            newData = newData.sort(sortBy('salePrice', false))
                        }
                        if (gt >= 0 && lte >= gt) {
                            //在gt 和 lte 之间的数据
                            newData = range(newData, gt, lte)
                        }
                    }



                    if (newData.length <= size) {
                        res.json({
                            data: newData,
                            total: allData.length
                        })
                    } else {
                        res.json({
                            data: allData,
                            total: allData.length
                        })
                    }
                })
            })

            //详情
            app.get('/api/goods/productDet', (req, res) => {
                let productId = req.query.productId
                fs.readFile('./db/goodsDetail.json', 'utf-8', (err, data) => {
                    if (!err) {
                        let { result } = JSON.parse(data)
                        let newData = result.find(item => item.productId == productId)
                        res.json(newData)
                    }
                })
            })
            
            //登录
            app.post('/api/login',(req,res)=>{
                let username = req.body.user
                res.json({
                    //第一个参数  加密对象  第二个参数 加密规则
                    token: jwt.sign({username : username},'abcd',{
                        expiresIn : "3000s" //过期时间
                    }),
                    username : username,
                    state :1,
                    file : './static/images/1570600179870.png',
                    code : 200,
                    address : null,
                    balance : null,
                    description : null,
                    email : null,
                    message : null,
                    phone : null,
                    points : null,
                    sex : null,
                    id : 62
                })
            })
        
            app.post('/api/verify',(req,res)=>{
                let token = req.headers.authorization

                jwt.verify(token,'abcd',(err,decode)=>{
                    if(err){
                        res.json({
                            msg : '当前用户未登录'
                        })
                    }else{
                        res.json({
                            //第一个参数  加密对象  第二个参数 加密规则
                            token: jwt.sign({username : decode.username},'abcd',{
                                expiresIn : "3000s" //过期时间
                            }),
                            username: decode.username,
                            state :1,
                            file : '../../static/images/1570600179870.png',
                            code : 200,
                            address : null,
                            balance : null,
                            description : null,
                            email : null,
                            message : null,
                            phone : null,
                            points : null,
                            sex : null,
                            id : 62
                        })
                    }
                })
            })
            
            //加入购物车
            app.post('/api/addCart',(req,res)=>{
                let {userIds,productIds,productNums} = req.body;
                fs.readFile('./db/allGoods.json','utf-8',(err,data)=>{
                    let {result} = JSON.parse(data)
                    if(userIds && productIds){
                        let {cartList} = cartListJson.result.find(item => item.id==userIds)
                        let newData = result.data.filter(item=> item.productId == productIds)[0]
                        newData.limitNum = 100

                        let flag = true  //判断购物车是否为空
                        if(cartList && cartList.length){
                            cartList.forEach(item =>{
                                if(item.productId == productIds){
                                    if(item.productNum >= 1){
                                        flag = false  //购物车不为空
                                        item.productNum += parseInt(productNums)
                                    }
                                }
                            })
                        }
                        //购物车为空
                        if(!cartList.length || flag){
                            newData.productNum = parseInt(productNums);
                            cartList.push(newData)
                        }
                        fs.writeFile('./db/cartList.json',JSON.stringify(cartListJson),(err,data)=>{
                            if(!err){
                                res.json({
                                    code : 200,
                                    message : "success",
                                    result : 1,
                                    success : true,
                                    timestamp : 123465123
                                })
                            }
                        })
                    }
                })
            })
            
            app.post('/api/cartList',(req,res)=>{
                let {userId} = req.body
                fs.readFile('./db/cartList.json','utf-8',(err,data)=>{
                    let {result} = JSON.parse(data)
                    let newData = result.find(item=>item.id == userId)
                    res.json({
                        code : 200,
                        cartList :  newData,
                        success : true,
                        message : 'success'
                    })
                })
            })
        }
    }
}