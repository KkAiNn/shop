import Vue from "vue";
import Vuex from "vuex";
import {setStore,getStore} from '../utils/storage.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login : false,
    userInfo:null,
    cartList : [],
    showCart : false
  },
  mutations: {
    initByCart(state){
      let initCart = getStore('buyCart')
      if(initCart){
        state.cartList = JSON.parse(initCart)
      }
    }
    ,
    ADDCART(state,{productId,productName,productImageBig,salePrice}){
      let cart = state.cartList
      let goods = {
        productId,
        productName,
        productImageBig,
        salePrice
      }
      let flag = true
      if(cart.length){
          cart.forEach(item=>{
            if(item.productId == productId){
              if(item.productNum>=0){
                flag = false
                item.productNum += 1
              }
            }
          })
      }
      if(!cart.length || flag){
        goods.productNum = 1
        cart.push(goods)
      }
      state.cartList = cart
      setStore('buyCart',cart)
    }
  },
  actions: {},
  modules: {}
});
