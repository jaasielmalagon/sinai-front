<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="text-xs-center">
          <v-btn @click="add" fab dark small color="teal">
            <v-icon dark>add</v-icon>
          </v-btn>
          <v-btn @click="renew" fab dark small color="teal">
            <v-icon dark>refresh</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <nuevo-cliente v-if="nuevo"></nuevo-cliente>
        <v-divider class="divisor"></v-divider>
        <prestamos-table></prestamos-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import NuevoCliente from "../components/nuevoClienteForm";
import PrestamosTable from "../components/PrestamosTable";

export default {
  name: "Prestamos",
  components: { NuevoCliente, PrestamosTable },
  data() {
    return {
      nuevo: false,
      refresh: false
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