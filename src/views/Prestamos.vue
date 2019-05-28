<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="text-xs-center">
          <v-dialog v-model="nuevo" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" fab dark small color="teal">
                <v-icon dark>add</v-icon>
              </v-btn>
              <!-- <v-btn color="primary" dark v-on="on">Open Dialog</v-btn> -->
            </template>
            <v-card>
              <v-toolbar dark color="primary">
                <v-btn icon dark @click="nuevo = false">
                  <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Nuevo prestamo</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark flat @click="nuevo = false">Guardar</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-divider class="divisor"></v-divider>

              <v-flex xs10 d-flex offset-xs1>
                <v-card>
                  <v-toolbar color="green darken-1" dark>
                    <v-toolbar-title>Datos personales</v-toolbar-title>
                  </v-toolbar>
                  <nuevo-cliente v-on:esCasado="isMarried($event)"></nuevo-cliente>
                </v-card>
              </v-flex>
              <v-divider class="divisor"></v-divider>

              <v-flex  v-if="married" xs10 d-flex offset-xs1>
                <v-card>
                  <v-toolbar color="green darken-1" dark>
                    <v-toolbar-title>Datos del conyuge</v-toolbar-title>
                  </v-toolbar>
                  <referencia-form></referencia-form>
                </v-card>
              </v-flex>
              <v-divider v-if="married" class="divisor"></v-divider>

              <v-flex xs10 d-flex offset-xs1>
                <v-card>
                  <v-toolbar color="green darken-1" dark>
                    <v-toolbar-title>Datos de la referencia</v-toolbar-title>
                  </v-toolbar>
                  <referencia-form></referencia-form>
                </v-card>
              </v-flex>
              <v-divider class="divisor"></v-divider>

            </v-card>
          </v-dialog>
          <v-btn @click="renew" fab dark small color="teal">
            <v-icon dark>refresh</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <prestamos-table></prestamos-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PrestamosTable from "../components/PrestamosTable";

export default {
  name: "Prestamos",
  components: { PrestamosTable },
  data() {
    return {
      nuevo: false,
      refresh: false,
      notifications: false,
      sound: true,
      widgets: false,
      married: false
    };
  },
  methods: {
    add() {
      this.nuevo = true;
      this.refresh = false;
    },
    renew() {
      this.nuevo = false;
      this.refresh = true;
    },
    isMarried(msg) {
      this.married = msg;
    }
  }
};
</script>

<style>
.divisor {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>