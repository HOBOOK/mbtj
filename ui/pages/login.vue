<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="5" class="text-center">
        <!-- 제목 -->
        <div class="text-h5 font-weight-bold mb-2">쉽게 가입하고</div>
        <div class="text-h5 font-weight-bold mb-4">간편하게 로그인하세요.</div>
        <div class="text-subtitle-2 mb-6 grey--text">하루에 한번</div>


        <!-- 소셜 버튼 -->
        <div style="min-height:400px;">


          <v-btn class="mb-16" outlined block height="50" @click="loginWith('google')">
            <img src="/icons/google.png" alt="google" width="16" height="16" class="mr-2" />
            구글 계정으로 계속하기
          </v-btn>
        </div>


      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    loginWith(provider) {
      alert(`${provider} 로그인 시도`);
      // 실제 로그인 로직 연동 부분
    },
    goTo(type) {
      alert(`${type} 페이지로 이동`);
      // 예: this.$router.push(...)
    }
  }
}
</script>

<style scoped></style>
