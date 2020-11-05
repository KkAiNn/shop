<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item, index) in small" :key="index" @click="changeBig(item)">
                <img v-lazy="item" />
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img v-lazy="big" />
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.productName}}</h4>
          <h6>
            <span></span>
            <span class="price">
              <em>¥</em>
              <i>{{product.salePrice}}</i>
            </span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <!-- <buy-num @handleValue="handleVal"></buy-num> -->
        </div>
        <div class="buy">
          <el-button type="primary">加入购物车</el-button>
          <el-button type="danger">现在购买</el-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <Shelf title="产品信息">
        <div slot="content">
          <div v-if="product.detail">
            <div v-html="product.detail"></div>
          </div>
          <div class="no-info" v-else>
            <br />该商品暂无内容数据
          </div>
        </div>
      </Shelf>
    </div>
  </div>
</template>
<script>
import Shelf from "@/components/Shelf";
export default {
  components: {
    Shelf,
  },
  data() {
    return {
      product: {},
      small: [],
      big: "",
    };
  },
  created() {
    this.$options.methods.getGoodsDetail.bind(this)();
  },
  methods: {
    getGoodsDetail() {
      return this.$http
        .get(`api/goods/productDet?productId=${this.$route.query.productId}`)
        .then((res) => {
          this.product = res.data;
          this.small = res.data.productImageSmall;
          this.big = res.data.productImageBig;

        })
        .catch((err) => err);
    },
    changeBig(e){
        this.big = e
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/mixin";

.store-content {
  clear: both;
  width: 1220px;
  min-height: 600px;
  padding: 0 0 25px;
  margin: 0 auto;
}

.gray-box {
  display: flex;
  padding: 60px;
  margin: 20px 0;
  .gallery-wrapper {
    .gallery {
      display: flex;
      width: 540px;
      .thumbnail {
        li:first-child {
          margin-top: 0px;
        }
        li {
          @include wh(80px);
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 5px;
          cursor: pointer;
          &.on {
            padding: 10px;
            border: 3px solid #ccc;
            border: 3px solid rgba(0, 0, 0, 0.2);
          }
          img {
            display: block;
            @include wh(100%);
          }
        }
      }
      .thumb {
        .big {
          margin-left: 20px;
        }
        img {
          display: block;
          @include wh(440px);
        }
      }
    }
  }
  // 右边
  .banner {
    width: 450px;
    margin-left: 10px;
    h4 {
      font-size: 24px;
      line-height: 1.25;
      color: #000;
      margin-bottom: 13px;
    }
    h6 {
      font-size: 14px;
      line-height: 1.5;
      color: #bdbdbd;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sku-custom-title {
      overflow: hidden;
      padding: 8px 8px 18px 10px;
      position: relative;
    }
    .params-name {
      padding-right: 20px;
      font-size: 14px;
      color: #8d8d8d;
      line-height: 36px;
    }
    .num {
      padding: 29px 0 8px 10px;
      border-top: 1px solid #ebebeb;
      display: flex;
      align-items: center;
    }
    .buy {
      position: relative;
      border-top: 1px solid #ebebeb;
      padding: 30px 0 0 10px;
    }
  }
}

.item-info {
  .gray-box {
    padding: 0;
    display: block;
  }
  .img-item {
    width: 1220px;
    // padding: 1vw;
    text-align: center;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

.no-info {
  padding: 200px 0;
  text-align: center;
  font-size: 30px;
}

.price {
  display: block;
  color: #d44d44;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  i {
    padding-left: 2px;
    font-size: 24px;
  }
}
</style>