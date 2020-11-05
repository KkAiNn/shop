
<template>
  <div class="login">
    <div class="box">
      <span>使用账号 登录官网</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <el-input
            type="text"
            v-model="ruleForm.user"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="goToHome()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { setStore } from "@/utils/storage.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateUser = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        user: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        user: [{ validator: validateUser, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("api/login", this.ruleForm)
            .then((res) => {
              let { username, token, id } = res.data;
              setStore("token", token);
              setStore("id", id);
              this.$router.push({
                name: "home",
              });
            })
            .catch((err) => err);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goToHome() {
      this.$router.push({
        name: "home",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  overflow: visible;
  background: #ededed;
  .box {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px 50px 50px 10px;
    margin-left: -225px;
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 10px 20px -10px rgba(0, 0, 0, 0.04);
    text-align: center;
    form {
      margin-top: 30px;
    }
    span {
      color: #333;
      font-weight: 400;
    }
  }
}
</style>