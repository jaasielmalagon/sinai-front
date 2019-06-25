<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="text-xs-center">
          <v-btn @click="add" fab dark small color="light-green lighten-2">
            <v-icon dark>add</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <prestamos-table v-on:editClient="editItem($event)"></prestamos-table>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="formDialog"
      fullscreen
      hide-overlay
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark class="light-blue lighten-2">
          <v-btn icon dark @click="cancel">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="saveData">
              <v-icon>save</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <v-flex xs12 md4 d-flex offset-md4 style="margin-bottom: 5px">
            <div>
              <v-alert
                v-model="alert.show"
                dismissible
                transition="scale-transition"
                :color="alert.style"
                icon="warning"
                class="text-xs-center"
              >{{alert.message}}</v-alert>
            </div>
          </v-flex>
          <!-- <pre>{{$data.solicitud}}</pre> -->
          <!-- <v-divider class="divisor"></v-divider> -->

          <v-flex xs12 d-flex v-if="showForm">
            <v-card>
              <v-toolbar class="light-green lighten-1" dark>
                <v-toolbar-title>
                  Cliente: {{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}} {{prestamo.cliente.amaterno}}
                  <br>
                  Comisionista: {{prestamo.comisionista.nombre}}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <prestamo-form ref="prestamoForm" :prestamo="prestamo"></prestamo-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="error">Cancelar</v-btn>
                <v-btn color="success" @click="generarPrestamo">Calcular</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-divider class="divisor" v-if="showForm && prestamo.cliente == ''"></v-divider>

          <v-flex xs12 d-flex v-if="prestamo.tabla != ''">
            <v-card>
              <v-toolbar class="light-green lighten-1" dark>
                <v-toolbar-title>Detalles del préstamo</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-data-table :items="prestamo.tabla" class="elevation-1" hide-actions>
                  <template v-slot:items="props">
                    <td>{{ props.item }}</td>
                    <td>{{ props.item.name }}</td>
                    <td class="text-xs-right">{{ props.item.calories }}</td>
                    <td class="text-xs-right">{{ props.item.fat }}</td>
                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                    <td class="text-xs-right">{{ props.item.protein }}</td>
                    <td class="text-xs-right">{{ props.item.iron }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-divider class="divisor" v-if="showForm && prestamo.cliente == ''"></v-divider>
          <v-flex xs12 d-flex v-if="prestamo.cliente == ''">
            <clientes-table v-on:selectClient="setSolicitud($event)" :options="2"></clientes-table>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-dialog>
    <loading-dialog :activator="loadingDialog"></loading-dialog>
    <!-- <pre>{{$data}}</pre> -->
  </v-container>
</template>

<script>
import PrestamosTable from "../components/PrestamosTable";
import PrestamoForm from "../components/PrestamoForm";
import ClientesTable from "../components/ClientesTable";
import LoadingDialog from "../components/LoadingDialog";
import config from "../config";
import { setTimeout } from "timers";

export default {
  name: "Prestamos",
  components: {
    PrestamosTable,
    PrestamoForm,
    ClientesTable,
    LoadingDialog
  },
  data() {
    return {
      db: config.db,
      formTitle: "",
      formDialog: false,
      showForm: false,
      loadingDialog: false,
      refresh: false,
      notifications: false,
      sound: true,
      widgets: false,
      alert: {
        message: "",
        style: "",
        show: false
      },
      clientes: [],
      solicitud: {
        key: "",
        aval: "",
        conyuge: "",
        referencia: "",
        solicitante: ""
      },
      defaultSolicitud: {
        key: "",
        aval: "",
        conyuge: "",
        referencia: "",
        solicitante: ""
      },
      prestamo: {
        activo: "",
        inicio: "",
        solicitud: "",
        cliente: "",
        tipo: "",
        capital: "",
        tasa: "",
        intereses: "",
        plazo: "",
        comisionista: "",
        pago: "",
        tabla: [] //{ fecha: "", capital: "", interes: "", pago: "", inicial: "", final: "" }
      },
      defaultPrestamo: {
        activo: "",
        inicio: "",
        solicitud: "",
        cliente: "",
        tipo: "",
        capital: "",
        tasa: "",
        intereses: "",
        plazo: "",
        comisionista: "",
        pago: "",
        tabla: [] //{ fecha: "", capital: "", interes: "", pago: "", inicial: "", final: "" }
      },
      amortHeaders:["Pago","Fecha","Abono a capital","Interés","Total de pago","Saldo anterior", "Saldo final"]
    };
  },
  methods: {
    saveData() {
      this.loadingDialog = true;
      let formInvalid = this.$refs.prestamoForm.submit();
      if (
        this.prestamo.solicitud != "" &&
        this.prestamo.cliente != "" &&
        this.prestamo.tabla.length > 0 &&
        formInvalid == false
      ) {
        // let generado = this.generarPrestamo();
        // if (generado) {
        this.db
          .ref("prestamos/")
          .push(this.prestamo)
          .then(() => {
            this.loadingDialog = false;
            this.alerta("Préstamo generado correctamente", "success");
            this.closeAlert();
          });
        // } else {
        // this.loadingDialog = false;
        // this.alerta(
        //   "El préstamo no ha sido generado correctamente, por favor verifique la información y reintente.",
        //   "error"
        // );
        // }
      } else {
        this.loadingDialog = false;
        this.alerta(
          "Para generar un préstamo primero seleccione una solicitud y complete todos los campos del formulario.",
          "error"
        );
        this.closeAlert();
      }
    },
    buscarPrestamoActivo(item) {
      let result = false;
      this.db
        .ref("/prestamos/cliente")
        .orderByChild("key")
        .equalTo(item.key)
        .once("value", snapshot => {
          let snap = snapshot.val();
          for (let key in snap) {
            console.log(snap[key]);
            return;
            if (snap[key].activo == true) {
              result = true;
              break;
            }
          }
        });
      // console.log(result);
      return result;
    },
    generarPrestamo() {
      this.loadingDialog = true;
      let formInvalid = this.$refs.prestamoForm.submit();
      if (formInvalid == false) {
        this.prestamo.inicio = this.getDate();
        if (this.prestamo.inicio != null) {
          let pagoCapital = this.prestamo.capital / this.prestamo.plazo;
          let pagoInteres =
            (this.prestamo.capital * this.prestamo.tasa * 4) /
            this.prestamo.plazo;
          this.prestamo.pago = parseFloat(
            (pagoCapital + pagoInteres).toFixed(2)
          );
          this.prestamo.intereses = parseFloat(
            (pagoInteres * this.prestamo.plazo).toFixed(2)
          );
          this.tablaAmortizacion();
        }
      } else {
        this.loadingDialog = false;
        this.alerta(
          "El préstamo no ha sido generado correctamente, por favor verifique la información y reintente.",
          "error"
        );
        this.closeAlert();
      }
    },
    tablaAmortizacion() {
      let pagoCapital = this.prestamo.capital / this.prestamo.plazo;
      let pagoInteres =
        (this.prestamo.capital * this.prestamo.tasa * 4) / this.prestamo.plazo;
      let totalPago = pagoCapital + pagoInteres;
      let prestamo = this.prestamo.capital + this.prestamo.intereses;
      for (let i = 0; i < this.prestamo.plazo; i++) {
        let pagoN = {
          nPago: i + 1,
          fecha: this.siguientePago(i + 1),
          pagoCapital: parseFloat(pagoCapital.toFixed(2)),
          pagoInteres: parseFloat(pagoInteres.toFixed(2)),
          totalPago: parseFloat(totalPago.toFixed(2)),
          final: parseFloat((prestamo - totalPago * (i + 1)).toFixed(2)),
          inicial: parseFloat((prestamo - totalPago * i).toFixed(2))
        };
        this.prestamo.tabla.push(pagoN);
      }
      return this.prestamo.tabla.length == this.prestamo.plazo;
    },
    siguientePago(semanas) {
      let hoy = new Date();
      let semanasEnMilisegundos = 1000 * 60 * 60 * 24 * 7 * semanas;
      let suma = hoy.getTime() + semanasEnMilisegundos; //getTime devuelve milisegundos de esa fecha
      let proximaFecha = new Date(suma);
      var dd = String(proximaFecha.getDate()).padStart(2, "0");
      var mm = String(proximaFecha.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = proximaFecha.getFullYear();
      return dd + "-" + mm + "-" + yyyy;
    },
    getDate() {
      let fecha = null;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      fecha = dd + "-" + mm + "-" + yyyy;
      return fecha;
    },
    setSolicitud(item) {
      this.loadingDialog = true;
      if (!this.buscarPrestamoActivo(item)) {
        this.db
          .ref("/solicitudes")
          .orderByChild("solicitante")
          .equalTo(item.key)
          .once("value", snapshot => {
            let snap = snapshot.val();
            this.solicitud = null;
            for (let key in snap) {
              this.solicitud = snap[key];
              this.solicitud.key = key;
            }
            if (this.solicitud.key != "") {
              this.prestamo.solicitud = this.solicitud.key;
              this.prestamo.comisionista = item.comisionista;
              this.prestamo.cliente = item;
              this.prestamo.activo = true;
              this.loadingDialog = false;
              this.showForm = true;
            } else {
              this.showForm = false;
              this.loadingDialog = false;
              this.alerta(
                "La solicitud de crédito seleccionada no se ha cargado correctamente. Intente de nuevo más tarde.",
                "error"
              );
              this.closeAlert();
            }
          });
      } else {
        this.loadingDialog = false;
        this.showForm = false;
        this.alerta(
          "No puede asignar un nuevo préstamo a este cliente debido a que aún cuenta con un préstamo activo.",
          "error"
        );
        this.closeAlert();
      }
    },
    editItem(item) {
      this.loadingDialog = true;
      this.cancel();
      this.formTitle = "Editar cliente";
      this.db
        .ref("/solicitudes")
        .orderByChild("solicitante")
        .equalTo(item.key)
        .once("value", snapshot => {
          this.cargarSolicitud(snapshot.val());
          setTimeout(() => {
            this.loadingDialog = false;
            this.formDialog = true;
          }, 1800);
        });
    },
    add() {
      // this.cancel();
      this.formTitle = "Generar préstamo";
      this.formDialog = true;
    },
    cancel() {
      this.showForm = false;
      this.formDialog = false;
      Object.assign(this.solicitud, this.defaultSolicitud);
      Object.assign(this.prestamo, this.defaultPrestamo);
    },
    closeAlert() {
      setTimeout(() => {
        this.alert.show = false;
        this.alert.message = "";
        this.alert.style = "";
        // this.cancel();
      }, 3000);
    },
    alerta(msj, type) {
      this.alert.style = type;
      this.alert.message = msj;
      this.alert.show = true;
    }
  },
  created() {}
};
</script>

<style>
.divisor {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>