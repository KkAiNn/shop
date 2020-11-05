<template>
  <div class="goods">
    <div class="nav">
      <div class="w">
        <a
          @click="isSort(i)"
          :class="{ active: isIndex == i }"
          href="javascript:;"
          v-for="(navItem, i) in navList"
          :key="i"
          >{{ navItem.title }}</a
        >
        <div class="price-interval">
          <input type="number" class="input" placeholder="價格" v-model="min" />
          <span style="margin: 0 5px">-</span>
          <input type="number" placeholder="價格" v-model="max" />
          <el-button
            type="primary"
            size="small"
            style="margin-left: 10px"
            @click="getDate()"
            >確定</el-button
          >
        </div>
      </div>
    </div>
    <div class="goods-box w">
      <MallGoods
        v-for="(item, index) in allGoods"
        :key="index"
        :goods="item"
      ></MallGoods>
    </div>
    <div class="w">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import MallGoods from "@/components/MallGoods";
export default {
  components: { MallGoods },
  data() {
    return {
      min: "",
      max: "",
      navList: [
        { title: "綜合排序" },
        { title: "价格由低到高" },
        { title: "价格由高到低" },
      ],
      isIndex: 0,
      currentPage: 1,
      pageSize: 20,
      sort: "",
      total: 0,
      allGoods: [],
    };
  },
  watch: {
      $route : function () { 
          this.$options.methods.getDate.bind(this)();
       }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.$options.methods.getDate.bind(this)();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$options.methods.getDate.bind(this)();
    },
    priceSort(v) {
      this.sort = v;
      this.$options.methods.getDate.bind(this)();
    },
    getDate() {
      return this.$http
        .get(
          `/api/goods/allGoods?page=${this.currentPage}&size=${this.pageSize}&sort=${this.sort}&priceGt=${this.min}&priceLte=${this.max}&cid=${this.$route.query.cid}`
        )
        .then((res) => {
          this.allGoods = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => err);
    },
    isSort(i) {
      this.isIndex = i;
      switch (i) {
        case 0:
          this.$options.methods.priceSort.bind(this)(i);
          break;
        case 1:
          this.$options.methods.priceSort.bind(this)(i);
          break;
        case 2:
          this.$options.methods.priceSort.bind(this)(-1);
          break;
      }
    },
  },

  created() {
    this.$options.methods.getDate.bind(this)();
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/mixin";
@import "../../assets/style/theme";

.nav {
  height: 60px;
  line-height: 60px;
  > div {
    display: flex;
    align-items: center;
    a {
      padding: 0 30px 0 0;
      height: 100%;
      @extend %block-center;
      font-size: 12px;
      color: #999;
      &.active {
        color: #5683ea;
      }
      &:hover {
        color: #5683ea;
      }
    }
    input {
      @include wh(80px, 30px);
      border: 1px solid #ccc;
    }
    input + input {
      margin-left: 10px;
    }
  }
  .price-interval {
    padding: 0 15px;
    @extend %block-center;
    input[type="number"] {
      border: 1px solid #ccc;
      text-align: center;
      background: none;
      border-radius: 5px;
    }
  }
}

.goods-box {
  overflow: hidden;
  > div {
    float: left;
    border: 1px solid #efefef;
  }
}

.no-info {
  padding: 100px 0;
  text-align: center;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  .no-data {
    align-self: center;
  }
}

.img-item {
  display: flex;
  flex-direction: column;
}

.el-pagination {
  align-self: flex-end;
  margin: 3vw 10vw 2vw;
}

.section {
  padding-top: 8vw;
  margin-bottom: -5vw;
  width: 1218px;
  align-self: center;
}

.recommend {
  display: flex;
  > div {
    flex: 1;
    width: 25%;
  }
}
</style>