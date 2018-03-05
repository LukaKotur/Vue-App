<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn dark large router to="/meetups" class="blue darken-1">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn dark large router to="/meetups/new" class="blue darken-1">Organize Meetups</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary"
                             :width="7"
                             :size="70"
                             v-if="loading"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <v-carousel style="cursor:pointer">
          <v-carousel-item v-for="meetup in meetups" :src="meetup.imageUrl" :key="meetup.id"
                           @click="onLoadMeetup(meetup.id)">
            <div class="title">
              {{meetup.title}}
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    computed: {
      meetups() {
        return this.$store.getters.featuredMeetups
      },
      loading() {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup(id) {
        this.$router.push("/meetups/" + id)
      }
    }
  };
</script>

<style scoped>
  .title {
    position: absolute;
    bottom: 50px;
    left: calc(50% - 80px);
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 4em;
    color: #fff;
    text-align: center;
    padding: 15px;
  }
</style>
