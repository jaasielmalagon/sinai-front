<template>
  <v-card>
    <v-card-title>
      <h1>Prestamos</h1>
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
        <td class="text-xs-center">{{ props.item.nombre }}</td>
        <td class="text-xs-center">{{ props.item.inicio }}</td>
        <td class="text-xs-center">{{ props.item.prestamo }}</td>
        <td class="text-xs-center">{{ props.item.adeudo }}</td>
        <td class="text-xs-center">{{ props.item.pago }}</td>
        <td class="text-xs-center">{{ props.item.comisionista.nombre }}</td>
        <td class="text-xs-center">{{ props.item.dia }}</td>
        <td class="text-xs-center">{{ props.item.estado }}</td>
        <td class="text-xs-center">
          <v-text-field label="Cantidad" prefix="$"></v-text-field>
        </td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">No se pudieron obtener resultados.</v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
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
          text: "Inicio",
          align: "center",
          sortable: true,
          value: "inicio"
        },
        {
          text: "Prestamo",
          align: "center",
          sortable: true,
          value: "prestamo"
        },
        { text: "Adeudo", align: "center", sortable: true, value: "adeudo" },
        {
          text: "Pago semanal",
          align: "center",
          sortable: true,
          value: "pago"
        },
        {
          text: "Comisionista",
          align: "center",
          sortable: true,
          value: "comisionista"
        },
        {
          text: "Dia de cobro",
          align: "center",
          sortable: true,
          value: "dia"
        },
        { text: "Estado", align: "center", sortable: true, value: "estado" },
        { text: "Pagar", align: "center", value: "pagar" }
      ],
      items: [
        {
          nombre: "Juan Lopez Perez",
          inicio: "04/01/2019",
          prestamo: 10000,
          adeudo: 6200,
          pago: 800,
          comisionista: {
            id: 1,
            nombre: "Monserrath Castillo"
          },
          dia: "Lunes",
          estado: "REGULAR"
        },
        {
          nombre: "Juan Lopez Perez",
          inicio: "04/01/2019",
          prestamo: 10000,
          adeudo: 6200,
          pago: 800,
          comisionista: {
            id: 2,
            nombre: "Mariela Rojas"
          },
          dia: "Martes",
          estado: "REGULAR"
        },
        {
          nombre: "Juan Lopez Perez",
          inicio: "04/01/2019",
          prestamo: 10000,
          adeudo: 6200,
          pago: 800,
          comisionista: {
            id: 3,
            nombre: "Beatriz Vega"
          },
          dia: "Miercoles",
          estado: "REGULAR"
        }
      ],
      filteredItems: [],
      comisionistas: [
        {
          id: 0,
          nombre: "Todos"
        },
        {
          id: 1,
          nombre: "Monserrath Castillo"
        },
        {
          id: 2,
          nombre: "Mariela Rojas"
        },
        {
          id: 3,
          nombre: "Beatriz Vega"
        }
      ]
    };
  },
  methods: {
    filtrarPrestamos(comisionista) {
      let items = [];
      this.filteredItems.map(
        comisionista => {
          console.log(this.filteredItems);          
        }
      ).bind(this);      
    },
    initialize() {
      this.filteredItems = this.items;
    }
  },
  created() {
    this.initialize();
  }
};
</script>
