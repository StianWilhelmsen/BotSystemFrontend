<template>
    <div class="main-wrapper">
        <h1>Bot som faen</h1>
        <h2>- gutta</h2>
    
        <div class="menu">
          <button class="menu-btn">Registrer</button>
          <button class="menu-btn">Logg inn</button>
        </div>
      </div>
    </template>

<script>
import store from '@/store.js';


</script>

<style scoped>


.main-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 88vh;
  background-color: #a86a07;
  font-family: Roboto;
  overflow: hidden;
}
.main-wrapper:before, .main-wrapper:after {
  content: "";
  position: absolute;
  left: 50%;
  min-width: 300vw;
  min-height: 300vw;
  background-color: #FCFFF5;
  -webkit-animation-name: rotate;
          animation-name: rotate;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
}
.main-wrapper:before {
  bottom: 15vh;
  border-radius: 45%;
  -webkit-animation-duration: 10s;
          animation-duration: 10s;
}
.main-wrapper:after {
  bottom: 12vh;
  opacity: 0.5;
  border-radius: 47%;
  -webkit-animation-duration: 10s;
          animation-duration: 10s;
}

@-webkit-keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0%) rotateZ(360deg);
  }
}

@keyframes rotate {
  0% {
    transform: translate(-50%, 0) rotateZ(0deg);
  }
  50% {
    transform: translate(-50%, -2%) rotateZ(180deg);
  }
  100% {
    transform: translate(-50%, 0%) rotateZ(360deg);
  }
}
h1, h2 {
  color: #000000;
  z-index: 10;
  margin: 0;
  font-weight: 300;
  line-height: 1.3;
  text-align: center;
}

h1 {
  font-size: 36px;
}
@media (min-width: 480px) {
  h1 {
    font-size: 5.5vw;
  }

}


</style>