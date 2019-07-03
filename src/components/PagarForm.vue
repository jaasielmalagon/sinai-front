<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn flat icon color="primary" v-on="on">
          <v-icon>attach_money</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="#4472C4" dark>
          <v-toolbar-title>
            Abonar al préstamo de:
            <small>{{prestamo.cliente.nombre}} {{prestamo.cliente.apaterno}}</small>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-layout row>
              <v-flex xs4>
                <v-subheader>Abono a préstamo:</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="pago.pagoTotal"
                  label="Monto*"
                  placeholder="00.00"
                  prefix="$"
                  type="number"
                  :error-messages="fieldErrors"
                  @blur="$v.pago.pagoTotal.$touch()"
                  @input="$v.pago.pagoTotal.$touch()"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs4>
                <v-subheader>Multas:</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="pago.multa"
                  label="Monto*"
                  placeholder="00.00"
                  prefix="$"
                  type="number"
                  :error-messages="fieldErrors"
                  @blur="$v.pago.multa.$touch()"
                  @input="$v.pago.multa.$touch()"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>* Campo obligatorio</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click="saveData()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import config from "../config";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
export default {
  name: "FormularioPagar",
  mixins: [validationMixin],
  validations: {
    pago: {
      pagoTotal: { required },
      multa: { required }
    }
  },
  props: {
    prestamo: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialog: false,
    db: config.db,
    defaultPago: {
      fecha: "",
      saldoFinal: "",
      saldoInicial: "",
      pagoCapital: 0,
      pagoInteres: 0,
      pagoTotal: 0,
      multa: 0
    },
    pago: {
      fecha: "",
      saldoFinal: "",
      saldoInicial: "",
      pagoCapital: 0,
      pagoInteres: 0,
      pagoTotal: 0,
      multa: 0
    }
  }),
  methods: {
    saveData() {
      if(!this.$v.$dirty){
        this.pago.fecha = new Date();
        this.pago.saldoInicial = this.prestamo.tabla
        this.prestamo.abonos.push(this.pago);
      }
    }
  },
  computed: {
    fieldErrors() {
      const errors = [];
      if (!this.$v.pago.pagoTotal.$dirty || !this.$v.pago.multa.$dirty) {
        return errors;
      }
      (!this.$v.pago.pagoTotal.required || !this.$v.pago.multa.required) &&
        errors.push("Este campo es obligatorio.");
      return errors;
    }
  }
};
</script>