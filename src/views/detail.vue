<template>
  <div class="detail">
    <button @click="goBack()" class="btn primary backBtn"><i class="far fa-arrow-alt-circle-left"></i></button>
    <div class="img" v-if="locationDetail.img"><img :src="locationDetail.img" :alt="locationDetail.place"></div>
    <div class="img" v-else><img src="@/assets/images/no-image-placeholder.jpg" alt="No image"></div>
    
    <div class="info">
      <ul>
        <li>{{ locationDetail.city }}</li>
        <li><span>Place :</span> {{ locationDetail.place }}</li>
        <li><span>Population :</span> {{ locationDetail.population }}</li>
        <li><span>Temperature :</span> {{ temp }}</li>
        <li><span>Lat :</span> {{ locationDetail.lat }}</li>
        <li><span>Long :</span> {{ locationDetail.lng }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      locationDetail: [],
      openWeatherApiKey: 'aa57ec0edb6274f21ccb4051b2411e3a',
      temp: null
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.locationDetail = this.$route.params.locationDetail;
    
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${this.locationDetail.lat}&lon=${this.locationDetail.lng}&appid=${this.openWeatherApiKey}&units=metric`)
    .then((response) => {
      this.temp = response.data.main.temp;
    })
    .catch((error) => {
      console.log(error);
    })
  }
}
</script>

<style>

</style>