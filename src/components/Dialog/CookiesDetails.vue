<template>
  <div class="mb-4">
    <v-expansion-panels>
      <v-expansion-panel :title="title">
        <v-expansion-panel-text>
          <div v-for="(content, index) in content" :key="index">
            <v-card class="mb-4">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="4"> Name: </v-col>
                    <v-col cols="8"> {{ content.name }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4"> Country: </v-col>
                    <v-col cols="8"> {{ content.country }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4"> Time: </v-col>
                    <v-col cols="8"> {{ content.time }} </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4"> Description: </v-col>
                    <v-col cols="8"> {{ content.Description }} </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    content: Array
  }
};
</script>
