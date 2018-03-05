<template>
  <v-container>
      <v-layout row wrap>
          <v-flex xs12>
              <v-card>
                  <v-card-title>
                      <h1>{{meetup.title}}</h1>
                  </v-card-title>
                <v-card-media
                :src="meetup.imageUrl"
                height="400px"
                >
                </v-card-media>
                <v-card-text>
                    <div class="blue--text"><strong>{{meetup.date | date}} at {{meetup.location}}</strong></div>
                    <div>{{meetup.location}}</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark class="blue darken-1">Register</v-btn>
                </v-card-actions>
              </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default{
    props: [
        'id'
    ],
    computed: {
        meetup(){
            return this.$store.getters.loadedMeetup(this.id)
        }
    }
}
</script>
