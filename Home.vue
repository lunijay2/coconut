<template>
<div>
  <body>
    <div id="wapper">
      <!--헤더시작-->
      <header>
        <video
          id="app2"
          preload="auto"
          autoplay="true"
          loop="loop"
          muted="muted"
          volume="0"
          height=""
          width=""
          position= "fixed"
          z-index="-100"
          src="../assets/red.mp4"
        ></video>
      </header>
      <!--네비게이션-->
      <nav>
        <p>nav</p>
        <ul>
          <li>
            <a href>link</a>
          </li>
          <li>
            <a href>link</a>
          </li>
          <li>
            <a href>link</a>
          </li>
        </ul>
      </nav>
      <!--콘텐츠부분-->
      <section>
        <p>section</p>
        <article>
          <p>article</p>
        </article>
      </section>
      <!--사이드바-->
      <aside>
        <p>aside</p>
      </aside>
      <!--풋터-->
      <footer>
			<address>
				코코넛페이 주소 : 서울특별시 서초구 강남대로<br />
				전화번호 : (02) 123-4567   사업자등록번호 123-4567-890   대표자 : 홍길동<br />
				copyright(c) 2019 coconut pay. all rights reserved 
			</address>
</footer>
    </div>
  </body>
</div>
</template>

<script>
export default {
  name: "testvue"
};
</script>

<style scoped>

#app2 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 100%;
  max-height: 50%;
}
body {
  text-align: center;
  color: #fff;
  width: 100%;
}
div#wapper {
  width: 100%;
  text-align: left;
  margin: 0 auto;
  height: -webkit-fill-available;
}
header,
footer,
nav,
aside,
section {
  border: 1px solid #999;
  margin: 5px;
  padding: 10px;
}
header {
  height: 10%;
  background-color: red;
}
nav,
section,
aside {
  float: left;
  height: 1000px;
}
nav {
  background-color: goldenrod;
  width: 10%;
}
section {
  background-color: green;
  width: 70%;
  height: 1000px;
}
aside {
  background-color: goldenrod;
  width: 10%;
}
footer {
  text-align: center;
  color:white;
  height: auto;
  background-color: gray;
  position: relative;
  clear: both;
}
article {
  width: 90%;
  margin: 20px;
  background-color: #999;
}

#text {
  position: fixed;
  z-index: -99;        
  font-size:3rem;
        text-transform:uppercase;
        margin-top:0;
        letter-spacing:.3rem
}
</style>