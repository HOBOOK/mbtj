<template>
  <div class="google-ad">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1654715490901132"
         data-ad-slot="8885124316"
         data-ad-format="auto"
         data-full-width-responsive="true">
         
    </ins>
  </div>
</template>

<script>
export default {
  mounted() {
    // 클라이언트 사이드에서만 adsbygoogle.push 실행
    if (process.client && window.adsbygoogle) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense error:", e);
      }
    }

  }
}
</script>

<style scoped>
.google-ad {
  margin: 20px 0;
  text-align: center;
}
</style>
