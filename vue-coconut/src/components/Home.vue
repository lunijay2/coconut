<template>
  <div>
    <div class="jumbotron text-center">
      <h1>QR코드 간편결제 시스템</h1>
      <br>
      <div class="row">
      <div class="col-md-4">
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
      </div>
        <div class="col-md-8">
          <h4>QR코드를 이용한 모바일 웹 애플리케이션</h4>
          <h4>인증서를 사용한 안전한 거래</h4>
          <h4>JSON Web Token기반의 무상태 서비스 제공</h4>
          <h4></h4>
        </div>
    </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <h3>Express Backend</h3>
        <p>Express는 웹 및 모바일 애플리케이션을 위한 일련의 강력한 기능을 제공하는 간결하고 유연한 Node.js 웹 애플리케이션 프레임워크입니다.</p>
        <p>자유롭게 활용할 수 있는 수많은 HTTP 유틸리티 메소드 및 미들웨어를 통해 쉽고 빠르게 강력한 API를 작성할 수 있습니다.</p>
      </div>
      <div class="col-md-4">
        <h3>Vue JS</h3>
        <p>Vue.js는 뷰(View)에 최적화된 프론트엔드 프레임워크입니다. 컨트롤러 대신 뷰 모델을 가지는 MVVM(Model-View-ViewModel) 패턴을 기반으로 디자인되었으며, 컴포넌트를 사용하여 재사용이 가능한 UI들을 묶고 뷰 레이어를 정리하는 것이 가장 강력한 기능입니다.</p>
        <p></p>
      </div>
      <div class="col-md-4">
        <h3>JWT Tokens</h3>
        <p>JSON Web Token은 정보를 안전하게 전송하기 위해 정의된 공개된 표준(RFC 7519)입니다. JWT은 자체적으로 필요한 모든 정보를 포함합니다. 헤더 정보와, 실제 전달할 데이터, 검증할 수 있는 서명 데이터를 모두 포함하고 있습니다.</p>
        <p>디지털 서명에 의해 검증할 수 있으며 신뢰할 수 있습니다. 비밀 값을 사용하는 HMAC 알고리즘이나 RDS or ECDSA와 같은 공개키, 개인키 쌍으로 서명될 수 있습니다.</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <h3>X.509 인증서</h3>
        <p>X.509는 PKI에서 사용하는 표준 인증서 형식이다. PKI에서 사용하는 공개키, 개인키 같은 비대칭키를 X.509 인증서로 관리한다.</p>
        <p>X.509(V1)은 1993년 디렉터리 접근 제어를 위한 두 가지 내용을 추가하기 위해 X.509(V2) 형식으로 개정되었다. 그리고 e메일의 보안 요소 등 새로운 개념이 포함된 X.509(V3)가 1996년에 발표되었다.</p>
      </div>
      <div class="col-md-4">
        <h3>Vuex</h3>
        <p>Vuex는 Vue.js 애플리케이션에 대한 상태 관리 패턴 + 라이브러리 입니다. 애플리케이션의 모든 컴포넌트에 대한 중앙 집중식 저장소 역할을 하며 예측 가능한 방식으로 상태를 변경할 수 있습니다. 또한 Vue의 공식 확장 프로그램과 통합되어 설정 시간이 필요 없는 디버깅 및 상태 스냅 샷과 같은 고급 기능을 제공합니다.</p>
      </div>
      <div class="col-md-4">
        <h3></h3>
        <p></p>
      </div>
    </div>
  </div>

  <!--
  <div>
    <body>
    <div id="wapper">-->
      <!--헤더시작
      <header>
        <iframe
                muted="muted"
                volume="0"
                width=100%
                height="480"
                src="https://www.youtube.com/embed/4HG_CJzyX6A?rel=0;amp;autoplay=1;mute=1;vq=hd720"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
        ></iframe>
      </header>
      -->
      <!--네비게이션-->
      <!--
      <nav>
        <p>nav</p>
      </nav>
      -->
      <!--콘텐츠부분-
      <div class="row">
        <div class="col-md-4">
          <img src="./apple.jpg" style="height:200px" />
        </div>
        <div class="col-md-4">
          <img src="./pear.jpeg" style="height:200px" />
        </div>
        <div class="col-md-4">
          <img src="./straw.jpeg" style="height:200px" />
        </div>
      </div>-->
      <!--
      <section>
        <p>section</p>
        <article>
          <p>
            What we do
            <br />STORY ABOUT US
            <br />Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </article>
        <div class="row">
          <div class="col-md-4">
            <img src="./apple.jpg" style="height:200px" />
          </div>
          <div class="col-md-4">
            <img src="./pear.jpeg" style="height:200px" />
          </div>
          <div class="col-md-4">
            <img src="./straw.jpeg" style="height:200px" />
          </div>
        </div>
      </section>
      -->

      <!--사이드바-->
      <!--
      <aside>
        <p>aside</p>
      </aside>
      -->
      <!--풋터-->
      <!--
      <footer>
        <address>
          <br />코코넛페이 주소 : 서울특별시 서초구 강남대로
          <br />전화번호 : (02) 123-4567 사업자등록번호 123-4567-890 대표자 : 홍길동
          <br />copyright(c) 2019 coconut pay. all rights reserved
          <br />
          <div class="padding">
            * Not intended for use by people under 22 years old or those who have been previously diagnosed with atrial fibrillation.
            Apple Watch Series 3 has a water resistance rating of 50 meters under ISO standard 22810:2010. This means that it may be used for shallow-water activities like swimming in a pool or ocean. However, it should not be used for scuba diving, waterskiing, or other activities involving high-velocity water or submersion below shallow depth.
            Participating equipment manufacturers and gyms vary.
            Apple Music requires a subscription.
            Wireless service plan required for cellular service. Apple Watch and iPhone service provider must be the same. Not available with all service providers. Not all service providers support enterprise accounts or prepaid plans; check with your employer and service provider. Some legacy plans may not be compatible. Roaming is not available. Contact your service provider for more details. Check www.apple.com/watch/cellular for participating wireless carriers and eligibility.
            Features are subject to change. Some features, applications, and services may not be available in all regions or all languages. Click here to see complete list.
          </div>
        </address>
      </footer>
      -->
  <!--
      <div class="padding">
        * Not intended for use by people under 22 years old or those who have been previously diagnosed with atrial fibrillation.
        Apple Watch Series 3 has a water resistance rating of 50 meters under ISO standard 22810:2010. This means that it may be used for shallow-water activities like swimming in a pool or ocean. However, it should not be used for scuba diving, waterskiing, or other activities involving high-velocity water or submersion below shallow depth.
        Participating equipment manufacturers and gyms vary.
        Apple Music requires a subscription.
        Wireless service plan required for cellular service. Apple Watch and iPhone service provider must be the same. Not available with all service providers. Not all service providers support enterprise accounts or prepaid plans; check with your employer and service provider. Some legacy plans may not be compatible. Roaming is not available. Contact your service provider for more details. Check www.apple.com/watch/cellular for participating wireless carriers and eligibility.
        Features are subject to change. Some features, applications, and services may not be available in all regions or all languages. Click here to see complete list.
      </div>
    </div>
    </body>
  </div>-->
</template>

<script>
  import QrcodeVue from 'qrcode.vue';
  export default {
    name: "Home",
    data() {
      return {
        value : 'https://coconutpay.herokuapp.com/',
        size : 250
      }
    },
    components: {
      QrcodeVue
    }
  };
</script>

<style scoped>
  /*
  .card-section {
    font-size: 20px;
  }

  body {
    text-align: center;
    color: #000;
    width: 100%;
  }
  div#wapper {
    width: 100%;
    text-align: center;
    margin: auto;
    height: -webkit-fill-available;
  }
  header,
  footer,
  nav,
  aside,
  section {
    /*border: 1px solid #999;
    padding: 10px;
  }
  header {
    height: 50%;
    /*background-color: #f8f8f8;
  }
  nav,
  section,
  aside {
    float: left;
    height: 800px;
  }
  nav {
    /*background-color: #f8f8f8;
    width: 10%;
  }
  section {
    /*background-color: #f8f8f8;
    width: 80%;
  }
  aside {
    /*background-color: #f8f8f8;
    width: 10%;
  }
  footer {
    font-size: 18px;
    text-align: center;
    color: black;
    height: auto;
    /*background-color: #f2f2f2;
    position: relative;
    clear: both;
  }
  article {
    color: #000;
    font-size: 15px;
    text-align: center;
    margin: 20px;
    /*background-color: #f8f8f8;
  }

  .padding {
    padding: 100px;
  }
  */
</style>