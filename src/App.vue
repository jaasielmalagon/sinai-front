<template>
  <v-app>
    <v-toolbar app :color="color">
      <v-toolbar-side-icon dark @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/">
        <v-toolbar-title class="headline text-uppercase">
          <!-- <span>SINAI</span>
          <span class="font-weight-light">V1.0</span> -->
          <v-img
            :src="`https://drive.google.com/file/d/1PSJeehL0dfI-KgOGlGNklYcz8z0zhPdM/view?usp=sharing`"
            :lazy-src="`https://drive.google.com/file/d/1PSJeehL0dfI-KgOGlGNklYcz8z0zhPdM/view?usp=sharing`"
            aspect-ratio="1"
            class="grey lighten-2"
          >
            <template v-slot:placeholder>
              <v-layout fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
        </v-toolbar-title>
      </router-link>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" temporary app :class="color">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>Nombre de Usuario</v-list-tile-title>
            </v-list-tile-content>

            <!-- <v-list-tile-action>
              <v-btn icon @click.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>-->
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile v-for="(item, i) in items" :key="i" router :to="item.url">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content class="blue-grey lighten-4">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      color: "#4472C4",
      // color: "brown lighten-5",
      drawer: false,
      items: [
        { title: "Prestamos", icon: "attach_money", url: "/prestamos" },
        { title: "Clientes", icon: "person_pin", url: "/clientes" },
        {
          title: "Supervisores",
          icon: "supervisor_account",
          url: "/supervisores"
        },
        {
          title: "Control de gastos",
          icon: "trending_up",
          url: "/gastos"
        },
        {
          title: "Control de depositos",
          icon: "local_atm",
          url: "/depositos"
        },
        { title: "Nomina", icon: "payment", url: "/nomina" }
      ],
      mini: false,
      right: null
    };
  }
};
</script>
