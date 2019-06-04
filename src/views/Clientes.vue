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
        <clientes-table v-on:editClient="editItem($event)"></clientes-table>
      </v-flex>
    </v-layout>

    <v-dialog v-model="showForm" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="cancelar">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="cancelar">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-divider class="divisor"></v-divider>

        <v-flex xs10 d-flex offset-xs1>
          <v-card>
            <v-toolbar color="green darken-1" dark>
              <v-toolbar-title>Datos del solicitante</v-toolbar-title>
            </v-toolbar>
            <cliente-form
              v-if="selectedItem != null"
              :cliente="selectedItem"
              :esReferencia="false"
              v-on:esCasado="isMarried($event)"
            ></cliente-form>
            <cliente-form
              v-if="selectedItem == null"
              :cliente="defaultCliente"
              :esReferencia="false"
              v-on:esCasado="isMarried($event)"
            ></cliente-form>
          </v-card>
        </v-flex>
        <v-divider class="divisor"></v-divider>

        <v-flex v-if="married" xs10 d-flex offset-xs1>
          <v-card>
            <v-toolbar color="green darken-1" dark>
              <v-toolbar-title>Datos del conyuge</v-toolbar-title>
            </v-toolbar>
            <cliente-form :cliente="defaultCliente" :esReferencia="true"></cliente-form>
          </v-card>
        </v-flex>
        <v-divider v-if="married" class="divisor"></v-divider>

        <v-flex xs10 d-flex offset-xs1>
          <v-card>
            <v-toolbar color="green darken-1" dark>
              <v-toolbar-title>Datos de la referencia</v-toolbar-title>
            </v-toolbar>
            <cliente-form :cliente="defaultCliente" :esReferencia="true"></cliente-form>
          </v-card>
        </v-flex>
        <v-divider class="divisor"></v-divider>

        <v-flex xs10 d-flex offset-xs1>
          <v-card>
            <v-toolbar color="green darken-1" dark>
              <v-toolbar-title>Datos del aval</v-toolbar-title>
            </v-toolbar>
            <cliente-form :cliente="defaultCliente" :esReferencia="true"></cliente-form>
          </v-card>
        </v-flex>
        <v-divider class="divisor"></v-divider>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ClienteForm from "../components/ClienteForm";
import ClientesTable from "../components/ClientesTable";
// import ReferenciaForm from "../components/ReferenciaForm";

export default {
  name: "Clientes",
  components: { ClienteForm, ClientesTable },
  data() {
    return {
      formTitle: "",
      showForm: false,
      refresh: false,
      notifications: false,
      sound: true,
      widgets: false,
      married: false,
      selectedItem: null,
      defaultCliente: {
        key: "",
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: "",
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      }
    };
  },
  methods: {
    editItem(item) {
      this.formTitle = "Editar cliente";
      this.showForm = true;
      this.selectedItem = item;
    },
    add() {
      this.formTitle = "Nuevo cliente";
      this.showForm = true;
      this.selectedItem = null;
    },
    renew() {
      this.showForm = false;
      this.refresh = true;
    },
    isMarried(is) {
      this.married = is;
    },
    cancelar() {
      this.showForm = false;
      this.selectedItem = {};
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