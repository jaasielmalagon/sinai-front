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
        <td class="text-xs-center">{{ props.item.nombre }} {{ props.item.apaterno }} {{ props.item.amaterno }}</td>
        <td class="text-xs-center">{{ props.item.bornDate }}</td>
        <td class="text-xs-center">{{ props.item.sexo }}</td>
        <td class="text-xs-center">{{ props.item.curp }}</td>
        <td class="text-xs-center">{{ props.item.ocr }}</td>
        <td class="text-xs-center">{{ props.item.direccion }}</td>
        <td class="text-xs-center">{{ props.item.telefono }}</td>
        <td class="text-xs-center">{{ props.item.entidad }}</td>
        <td class="text-xs-center">{{ props.item.tipo }}</td>
        <td class="text-xs-center">
          <v-btn flat icon small color="transparent">
            <v-icon dark color="white">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">No se pudieron obtener resultados.</v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import config from "../config";
export default {
  data() {
    return {
      db: config.db,
      search: "",
      loading: false,
      headers: [
        {
          text: "Cliente",
          align: "center",
          sortable: true,
          value: "nombre"
        },
        {
          text: "F. de nac.",
          align: "center",
          sortable: true,
          value: "inicio"
        },
        {
          text: "Sexo",
          align: "center",
          sortable: true,
          value: "prestamo"
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
        { text: "Entidad", align: "center", sortable: true, value: "estado" },
        { text: "Tipo", align: "center", value: "pagar" },
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
    cargarPersonas(items) {
      this.items = [];
      for (let key in items) {
        this.items.push(items[key]);
      }
      this.items.reverse();
      this.filteredItems = this.items;
      // console.log(this.items);
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
      .on("value", snapshot => this.cargarPersonas(snapshot.val()));
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
