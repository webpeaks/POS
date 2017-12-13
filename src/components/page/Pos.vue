<template>
  <div class="pos">
    <el-row class="pos-main">
      <el-col :span="7" class="pos-order">
        <el-tabs type="card">
          <el-tab-pane label="订单">
            <el-table  :data="tableData" border style="width:100%">
              <el-table-column prop="goodsName" label="商品名称"></el-table-column>
              <el-table-column prop="count" label="数量" width="60"></el-table-column>
              <el-table-column prop="price" label="单价" width="60"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                  <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="totalDiv">
              <small>数量: </small><span>{{totalCount}}</span>&nbsp;/&nbsp;<small>总金额：</small><span>￥{{totalMoney}}元</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="挂单">挂单</el-tab-pane>
          <el-tab-pane label="外卖">外卖</el-tab-pane>
        </el-tabs>
        <div class="pos-btn">
          <el-button type="warning" >挂单</el-button>
          <el-button type="danger" @click="delAllGoods()">清空</el-button>
          <el-button type="success" @click="checkout()">结账</el-button>
        </div>
      </el-col>
      <el-col :span="17">
        <el-row class="pos-top">
          <div class="pos-title">热门商品</div>
          <div class="pos-shop">
            <ul>
              <li v-for="goods in oftenGoods" :key="goods.id" @click="addOrderList(goods)">
                <span>{{goods.goodsName}}</span>
                <span class="pos-price">￥{{goods.price}}元</span>
              </li>
            </ul>
          </div>
        </el-row>
        <el-row class="pos-bottom">
          <el-tabs type="card">
            <el-tab-pane label="订单">
              <div class="pos-tabs">
                <ul>
                  <li v-for="goods in type0Goods" :key="goods.id" @click="addOrderList(goods)">
                    <span class="goodImg"><img :src="goods.goodsImg" style="width:100%"></span>
                    <span class="goodName">{{goods.goodsName}}</span>
                    <span class="goodPrice">￥{{goods.price}}元</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="零食">
              <div class="pos-tabs">
                <ul>
                  <li v-for="goods in type1Goods" :key="goods.id" @click="addOrderList(goods)">
                    <span class="goodImg"><img :src="goods.goodsImg" style="width:100%"></span>
                    <span class="goodName">{{goods.goodsName}}</span>
                    <span class="goodPrice">￥{{goods.price}}元</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="主食">
              <div class="pos-tabs">
                <ul>
                  <li v-for="goods in type2Goods" :key="goods.id" @click="addOrderList(goods)">
                    <span class="goodImg"><img :src="goods.goodsImg" style="width:100%"></span>
                    <span class="goodName">{{goods.goodsName}}</span>
                    <span class="goodPrice">￥{{goods.price}}元</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
            <el-tab-pane label="套餐">
              <div class="pos-tabs">
                <ul>
                  <li v-for="goods in type3Goods" :key="goods.id" @click="addOrderList(goods)">
                    <span class="goodImg"><img :src="goods.goodsImg" style="width:100%"></span>
                    <span class="goodName">{{goods.goodsName}}</span>
                    <span class="goodPrice">￥{{goods.price}}元</span>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "pos",
  data() {
    return {
      // 左侧数据声明
      tableData: [],
      // 右侧上部数据声明
      oftenGoods: [],
      // 右侧下部数据声明
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
      totalCount: 0,
      totalMoney: 0
    };
  },
  created() {
    // 右侧上部 axios 数据
    axios
      .get("http://jspang.com/DemoApi/oftenGoods.php")
      .then(response => {
        this.oftenGoods = response.data;
      })
      .catch(error => {
        console.log(error);
        alert("网络错误，不能访问");
      });
    // 右侧下部 axios 数据
    axios
      .get("http://jspang.com/DemoApi/typeGoods.php")
      .then(response => {
        this.type0Goods = response.data[0];
        this.type1Goods = response.data[1];
        this.type2Goods = response.data[2];
        this.type3Goods = response.data[3];
      })
      .catch(error => {
        console.log(error);
        alert("无数据");
      });
  },
  methods: {
    // 添加商品
    addOrderList(goods) {
      // 每次都将 totalCount totalMoney 清零
      this.totalCount = 0;
      this.totalMoney = 0;

      // 首页判断是否已经存在于左侧列表中
      let isHave = false;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].goodsId == goods.goodsId) {
          isHave = true;
        }
      }

      // 根据 isHave 的值，判断：压入数据还是添加数量
      if (isHave) {
        // 如果有当前点击的商品，就增加数量
        let arr = this.tableData.filter(o => o.goodsId == goods.goodsId);
        arr[0].count++;
      } else {
        let newGoods = {
          goodsId  : goods.goodsId,
          goodsName: goods.goodsName,
          price    : goods.price,
          count    : 1
        };
        this.tableData.push(newGoods);
      };
      this.getAllMoney(goods);
    },

    // 清空
    delAllGoods() {
      this.tableData  = [];
      this.totalCount = 0;
      this.totalMoney = 0;
    },

    // 删除单件商品
    delSingleGoods(goods) {
      this.tableData = this.tableData.filter(o => o.goodsId != goods.goodsId);
      this.getAllMoney(goods);
    },

    //计算数量和总钱数
    getAllMoney(goods) {
      this.totalCount = 0;
      this.totalMoney = 0;
      if (this.tableData) {
        this.tableData.forEach(element => {
          this.totalCount += element.count;
          this.totalMoney  = this.totalMoney + element.count * element.price;
        });
      }
    },

    // 模拟结账
    checkout() {
    if (this.totalCount!=0) {
        this.tableData  = [];
        this.totalCount = 0;
        this.totalMoney = 0;
        this.$message({
            message: '结账成功，感谢你又为店里出了一份力!',
            type   : 'success'
        });

    }else{
        this.$message.error('不能空结。老板了解你急切的心情！');
    }

}
  }
};
</script>

<style scoped>
.pos,
.pos-main,
.el-col {
  height: 100%;
}
.pos-order {
  background-color: #f9fafc;
  border-right    : 1px solid #c0ccda;
}
.pos-top {
  overflow     : hidden;
  height       : 30%;
  border-bottom: 1px solid #c0ccda;
}
.pos-bottom {
  height: 70%;
}
.pos-btn {
  margin-top: 30px;
}
.pos-title {
  padding         : 10px;
  background-color: #f9fafc;
  text-align      : left;
  border-bottom   : 2px solid #d3dce6;
  height          : 18px;
}
.pos-shop {
  overflow  : hidden;
  overflow-y: scroll;
  height    : 86%;
}
.pos-top ul li {
  padding         : 10px;
  margin          : 10px;
  float           : left;
  list-style      : none;
  background-color: #fff;
  border          : 1px solid #f9fafc;
  cursor          : pointer;
}
.pos-price {
  color: #58b7ff;
}
.pos-tabs li {
  overflow        : hidden;
  padding         : 2px;
  margin          : 10px;
  float           : left;
  list-style      : none;
  width           : 20%;
  border          : 1px solid #e5e9f2;
  height          : auot;
  background-color: #fff;
  cursor          : pointer;
}
.goodImg {
  width: 40%;
}
.goodName {
  font-size   : 18px;
  padding-left: 10px;
  color       : brown;
}
.goodPrice {
  font-size   : 16px;
  padding-left: 10px;
  padding-top : 10px;
  color       : #58b7ff;
}
.totalDiv {
  padding      : 12px;
  border-bottom: 1px solid #e5e9f2;
}
.totalDiv span {
  color: #58b7ff;
}
</style>
