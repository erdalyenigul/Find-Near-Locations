<template>
  <div class="containerFluid">
    <div class="modal" v-if="getLocationModal">
      <div class="content">
        <div v-if="errorStr">Error: {{ errorStr }}</div>
        <div v-if="gettingLocation">Getting your location...</div>
        <div class="locationInfo" v-if="latitude">
          <span><strong>Your current location</strong></span>
          <span>Latitude: {{ latitude }}</span>
          <span>Longtitude: {{ longitude}}</span>
          <button class="btn primary" @click="getLocationModal = !getLocationModal">OK</button>
        </div>
      </div>
    </div>
    <div class="modal" v-if="loading">
      <div class="content">
        <span class="loadingText" v-if="!loadingErrorMsg">Searching for <span> {{ search }} </span> places...</span>
        <img class="loadingImg" src="@/assets/images/loading.gif" alt="Loading" v-if="!loadingErrorMsg">
        <span class="loadingError" v-if="loadingErrorMsg">
          Error: Please search valid area.
          <button class="btn error" @click="loading = !loading">OK</button>
        </span>
       </div>
    </div>
    <div class="latLongInfo" v-if="!getLocationModal && headInfo">
      <span><strong>City: </strong> {{ cityName }} </span>
      <span><strong>Latitude: </strong> {{ latitude }}</span>
      <span><strong>Longtitude: </strong> {{ longitude}}</span>
      <span><button class="btn primary clearBtn" @click="clearLocalStorage">Clear</button></span>
    </div>
    <div class="container">
      <div class="search">
        <input type="text" placeholder="Search location..." v-model="search" @keyup.enter="searchLocation()">
        <button class="btn primary" @click="searchLocation()">Search</button>
      </div>
      <div class="results" v-if="headInfo">
        <router-link class="location" v-for="(location, index) in locationListFinal" :key="index" 
        :to="{ name: 'detail', params:{ place : location.place, locationDetail : location } }">
          <span class="img">
            <!-- <img v-if="location.img != null" :src="location.img" alt=""> -->
            <img v-if="location.img != null" v-lazy="location.img" alt="">
            <img v-else src="@/assets/images/no-image-placeholder.jpeg" alt="">
          </span>
          <span>{{ location.place }} / {{ location.city }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: false,
      loadingErrorMsg: false,
      getLocationModal:true,
      gettingLocation: false,
      latitude: null,
      longitude: null,
      errorStr:null,
      locationList: null,
      locationName: '',
      search: '',
      locationListFinal: [],
      cityName: '',
      headInfo: true,
    }
  },
  methods: {
    clearLocalStorage() {
      localStorage.clear();
      this.headInfo = false;
      this.search = '';
    },
    searchLocation() {
      this.loading = true;
      this.headInfo = true;
      axios.get(`https://secure.geonames.org/postalCodeSearchJSON?placename=${this.search}&maxRows=1&username=erdalyenigul`)
      .then((response) => {
        this.loadingErrorMsg = false;
        this.latitude = response.data.postalCodes[0].lat;
        this.longitude = response.data.postalCodes[0].lng;
        
        localStorage.setItem('searchKey', this.search);
        localStorage.setItem('lat', this.latitude);
        localStorage.setItem('lng', this.longitude);

        this.getLocations();
      })
      .catch(error => {
        console.log(error);
        this.loadingErrorMsg = true;
      })
    },
    getImages(geoNames) {
      this.locationListFinal = [];
      var item = {};
      for (let i = 0; i < geoNames.length; i++) {
        axios.get(`https://pixabay.com/api/?key=21345910-1a95b7aaeb9f735e29c360155&q=${geoNames[i].adminName1}&image_type=photo&lang=tr&per_page=100`)
        .then((response) => {
          let imgList = response.data.hits;
          
          item = {};
          item.city = geoNames[i].adminName1;
          item.place = geoNames[i].name;
          item.lat = geoNames[i].lat;
          item.lng = geoNames[i].lng;
          item.population = geoNames[i].population;

          for(let x = 0; x < imgList.length; x++) {
            if(imgList[i]){
              item.img = imgList[i].webformatURL;
            }
          }
          this.locationListFinal.push(item);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
      }
    },
    getLocations() {
      axios.get(`https://secure.geonames.org/findNearbyJSON?lat=${this.latitude}&lng=${this.longitude}&username=erdalyenigul&radius=300&maxRows=100`)
      .then((response) => {
        this.cityName = response.data.geonames[0].adminName1;
        this.getImages(response.data.geonames);
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    if(!localStorage.getItem('searchKey')) {
      if(!("geolocation" in navigator)) {
        this.errorStr = 'Geolocation is not available.';
        return;
      }
      this.gettingLocation = true;
      navigator.geolocation.getCurrentPosition(pos => {
        this.gettingLocation = false;
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.getLocations();
      }, err => {
        this.gettingLocation = false;
        this.errorStr = err.message;
      });
    } else {
      this.getLocationModal = false;
      this.latitude = localStorage.getItem('lat');
      this.longitude = localStorage.getItem('lng');
      this.getLocations();
    }
  }
}
</script>
