<template>
  <v-card>
    <v-card-title>
      <h1>Clientes</h1>
      <v-spacer></v-spacer>
      <v-select
        @change="filtrarPrestamos($event)"
        :items="comisionistas"
        item-text="nombre"
        :return-object="true"
        label="Comisionistas"
        no-data-text="No hay comisionistas"
      ></v-select>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Buscar" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <!-- <td class="text-xs-center">{{ props.item.key }}</td> -->
        <td
          class="text-xs-center"
        >{{ props.item.nombre }} {{ props.item.apaterno }} {{ props.item.amaterno }}</td>
        <td class="text-xs-center">{{ props.item.curp }}</td>
        <td class="text-xs-center">{{ props.item.ocr }}</td>
        <td class="text-xs-center">{{ props.item.direccion }}</td>
        <td class="text-xs-center">{{ props.item.telefono }}</td>
        <!-- <td class="text-xs-center">{{ props.item.entidad }}</td> -->
        <!-- <td class="text-xs-center">{{ props.item.tipo }}</td> -->
        <td class="text-xs-center">
          <v-btn @click="$emit('editClient', props.item)" icon small color="transparent">
            <v-icon dark color="white">edit</v-icon>
          </v-btn>
          <v-btn @click="deleteItem(props.item)" icon small color="transparent">
            <v-icon dark color="white">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">No se pudieron obtener resultados.</v-alert>
      </template>
    </v-data-table>

    <loading-dialog :activator="loadingDialog"></loading-dialog>

    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">¿Realmente desea eliminar el elemento seleccionado?</v-card-title>
        <v-card-text>Si lo elimina, la información no podrá ser recuperada.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click="deleteDialog = false">No, cancelar</v-btn>
          <v-btn color="green darken-1" flat @click="confirmDeletion()">Si, eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import config from "../config";
import LoadingDialog from "./loadingDialog";
export default {
  components: { LoadingDialog },
  data() {
    return {
      db: config.db,
      search: "",
      loading: false,
      deleteDialog: false,
      loadingDialog: false,
      selectedItem: {
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
      },
      headers: [
        // { text: "Key", align: "center", sortable: true, value: "key" },
        {
          text: "Cliente",
          align: "center",
          sortable: true,
          value: "nombre"
        },
        { text: "Curp", align: "center", sortable: true, value: "adeudo" },
        {
          text: "OCR",
          align: "center",
          sortable: true,
          value: "pago"
        },
        {
          text: "Dirección",
          align: "center",
          sortable: true,
          value: "comisionista"
        },
        {
          text: "Teléfono",
          align: "center",
          sortable: true,
          value: "dia"
        },
        // { text: "Entidad", align: "center", sortable: true, value: "estado" },
        // { text: "Tipo", align: "center", value: "pagar" },
        { text: "Opciones", align: "center", value: "opc" }
      ],
      items: [],
      filteredItems: [],
      comisionistas: []
    };
  },
  mounted: function() {
    // this.cargarDatos();
  },
  methods: {    
    deleteItem(item) {
      // this.editedIndex = this.teams.indexOf(item);
      this.selectedItem = item;
      this.deleteDialog = true;
    },
    confirmDeletion() {
      this.deleteDialog = false;
      this.loadingDialog = true;
      this.db
        .ref("/personas/" + this.selectedItem.key)
        .set(null)
        .then(() => {
          this.loadingDialog = false;
        });
    },
    cargarPersonas(items) {
      this.items = [];
      for (let key in items) {
        this.items.push({
          key: key,
          nombre: items[key].nombre,
          apaterno: items[key].apaterno,
          amaterno: items[key].amaterno,
          bornDate: items[key].bornDate,
          sexo: items[key].sexo,
          curp: items[key].curp,
          ocr: items[key].ocr,
          direccion: items[key].direccion,
          telefono: items[key].telefono,
          entidad: items[key].entidad,
          tipo: items[key].tipo,
          comisionista: items[key].comisionista
        });
      }
      this.items.reverse();
      this.filteredItems = this.items;
    },
    filtrarPrestamos(comisionista) {
      this.filteredItems = this.items;
      if (comisionista.id !== 0) {
        let items = this.filteredItems.filter(function(item) {
          return item.comisionista.id === comisionista.id;
        });
        this.filteredItems = items;
      }
    }
  },
  created() {
    //CARGAR PERSONAS
    this.db
      .ref("/personas")
      .orderByChild('tipo')
      .equalTo(1)
      .on("value", snapshot => {
        this.loading = true;
        this.cargarPersonas(snapshot.val());
        this.loading = false;
      });
    //CARGAR COMISIONISTAS
    this.db.ref("/empleados").on("value", snapshot => {
      this.comisionistas = [];
      let items = snapshot.val();
      for (let key in items) {
        this.comisionistas.push(items[key]);
      }
    });
  }
};
</script>
