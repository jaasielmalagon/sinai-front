<template>
  <v-container grid-list-md text-xs-center>
    <v-card class="light-blue lighten-5">
      <v-card-title>
        <v-container grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <div class="display-2 font-weight-light">Clientes</div>
            </v-flex>
            <v-flex xs12 sm8>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-select
                    @change="filtrar($event)"
                    :items="comisionistas"
                    item-text="nombre"
                    :return-object="true"
                    label="Comisionistas"
                    no-data-text="No hay comisionistas"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>
      <v-card-text v-resize="onResize">
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :search="search"
          :loading="loading"
          elevation-24
          no-data-text="No existen registros..."
          :hide-headers="isMobile"
          v-if="!isMobile"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ props.header.text }}</span>
              </template>
              <span>Ordenar por {{ props.header.text }}</span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td class="text-xs-center">{{ props.item.nombre }}</td>
              <td>{{ props.item.apaterno }}</td>
              <td>{{ props.item.amaterno }}</td>
              <td class="text-xs-center">{{ props.item.curp }}</td>
              <td class="text-xs-center">{{ props.item.ocr }}</td>
              <td class="text-xs-center">{{ props.item.direccion }}</td>
              <td class="text-xs-center">{{ props.item.telefono }}</td>
              <td class="text-xs-center" v-if="options == 1">
                <v-btn @click="$emit('editClient', props.item)" icon small color="transparent">
                  <v-icon dark color="light-blue accent-3">edit</v-icon>
                </v-btn>
                <v-btn @click="deleteItem(props.item)" icon small color="transparent">
                  <v-icon dark color="red lighten-1">delete</v-icon>
                </v-btn>
              </td>
              <td class="text-xs-center" v-if="options == 2">
                <v-btn @click="$emit('selectClient', props.item)" icon small color="transparent">
                  <v-icon dark color="light-blue accent-3">check</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
          <template
            v-slot:pageText="props"
          >Registros {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}</template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              El parámetro buscado
              <strong>"{{search}}"</strong> no generó resultados.
            </v-alert>
          </template>
        </v-data-table>

        <v-container fluid grid-list-md v-else>
          <v-data-iterator
            :items="filteredItems"
            :search="search"
            :loading="loading"
            content-tag="v-layout"
            row
            wrap
          >
            <template v-slot:item="props">
              <v-flex xs6>
                <v-card>
                  <v-card-title>
                    <h4>{{ props.item.nombre }} {{ props.item.apaterno }} {{ props.item.amaterno }}</h4>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-tile>
                      <v-list-tile-content>CURP:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.curp }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>OCR:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.ocr }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>Teléfono:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.telefono }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-content>Dirección:</v-list-tile-content>
                      <v-list-tile-content class="align-end">{{ props.item.direccion }}</v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="options == 1">
                      <v-list-tile-content>
                        <v-btn
                          @click="$emit('editClient', props.item)"
                          icon
                          small
                          color="transparent"
                        >
                          <v-icon dark color="light-blue accent-3">edit</v-icon>
                        </v-btn>
                        <v-btn @click="deleteItem(props.item)" icon small color="transparent">
                          <v-icon dark color="red lighten-1">delete</v-icon>
                        </v-btn>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="options == 2">
                      <v-list-tile-content>
                        <v-btn
                          @click="$emit('selectClient', props.item)"
                          icon
                          small
                          color="transparent"
                        >
                          <v-icon dark color="light-blue accent-3">check</v-icon>
                        </v-btn>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
            </template>
          </v-data-iterator>
        </v-container>
      </v-card-text>
      <loading-dialog :activator="loadingDialog"></loading-dialog>

      <v-dialog v-if="options == 1" v-model="deleteDialog" persistent max-width="290">
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
  </v-container>
</template>

<script>
import config from "../config";
import LoadingDialog from "./LoadingDialog";
export default {
  name: "ClientesTable",
  components: { LoadingDialog },
  props: {
    options: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      db: config.db,
      search: "",
      isMobile: false,
      loading: true,
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
          text: "Nombre",
          align: "center",
          sortable: true,
          value: "nombre"
        },
        {
          text: "Ap. paterno",
          align: "center",
          sortable: true,
          value: "apaterno"
        },
        {
          text: "Ap. materno",
          align: "center",
          sortable: true,
          value: "amaterno"
        },
        { text: "Curp", align: "center", sortable: true, value: "curp" },
        {
          text: "OCR",
          align: "center",
          sortable: true,
          value: "ocr"
        },
        {
          text: "Dirección",
          align: "center",
          sortable: true,
          value: "direccion"
        },
        {
          text: "Teléfono",
          align: "center",
          sortable: true,
          value: "telefono"
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
    onResize() {
      if (window.innerWidth < 769) this.isMobile = true;
      else this.isMobile = false;
    },
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
        .update({
          activo: 0
        })
        .then(() => {
          this.loadingDialog = false;
        });
    },
    cargarPersonas(items) {
      this.items = [];
      for (let key in items) {
        // console.log(items[key]);
        if (items[key].activo == 1) {
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
      }
      this.items.reverse();
      this.filteredItems = this.items;
    },
    filtrar(comisionista) {
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
      .orderByChild("tipo")
      .equalTo(1)
      .on("value", snapshot => {
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

<style>
.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}
</style>
