<template>
  <v-card dark>
    <v-card-title>
      <v-toolbar color="blue lighten-2" dark>
        <v-toolbar-title>Datos personales</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
    <v-card-text class="px-5">
      <v-form>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-text-field
                v-model="request"
                :error-messages="requestErrors"
                :counter="5"
                label="Num. solicitud"
                required
                @input="$v.request.$touch()"
                @blur="$v.request.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md9>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="100px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field v-model="date" label="Fecha de nacimiento" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="date"
                  :max="new Date().toISOString().substr(0, 10)"
                  min="1950-01-01"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="30"
                label="Nombre"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="15"
                label="Apellido paterno"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md4>
              <v-text-field
                v-model="name"
                :error-messages="nameErrors"
                :counter="15"
                label="Apellido materno"
                required
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-radio-group row v-model="sexo" :error-messages="sexoErrors">
                <div>Sexo:</div>
                <v-radio label="Hombre" value="H"></v-radio>
                <v-radio label="Mujer" value="M"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="select"
                :items="items"
                item-text="label"
                item-value="value"
                :error-messages="selectErrors"
                label="Entidad de nacimiento"
                required
                @change="$v.select.$touch()"
                @blur="$v.select.$touch()"
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="E-mail"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-radio-group row>
                <div>Estado civil:</div>
                <v-radio label="Casado" value="1"></v-radio>
                <v-radio label="Soltero" value="0"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
    <!-- <v-card-actions>
      <v-btn color="green lighten-1" @click="submit">Aceptar</v-btn>
      <v-btn color="red darken-4" @click="clear">Cancelar</v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email, between } from "vuelidate/lib/validators";

export default {
  name: "NuevoCliente",
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(30) },
    request: { required, between: between(1, 99999), maxLength: maxLength(5) },
    email: { required, email },
    select: { required },
    sexo: { required },
    edocivil: { required },
    checkbox: {
      checked(val) {
        return val;
      }
    }
  },
  data() {
    return {
      request: "",
      date: null,
      menu: false,
      name: "",
      email: "",
      select: null,
      items: [
        { id: "MEX-AGS", value: "AS", label: "Aguascalientes (AGS)" },
        { id: "MEX-BCN", value: "BC", label: "Baja California Norte (BCN)" },
        { id: "MEX-BCS", value: "BS", label: "Baja California Sur (BCS)" },
        { id: "MEX-CAM", value: "CC", label: "Campeche (CAM)" },
        { id: "MEX-CHIS", value: "CS", label: "Chiapas (CHIS)" },
        { id: "MEX-CHIH", value: "CH", label: "Chihuahua (CHIH)" },
        { id: "MEX-COAH", value: "CL", label: "Coahuila (COAH)" },
        { id: "MEX-COL", value: "CM", label: "Colima (COL)" },
        { id: "MEX-DF", value: "DF", label: "Distrito Federal (DF)" },
        { id: "MEX-DGO", value: "DG", label: "Durango (DGO)" },
        { id: "MEX-GTO", value: "GT", label: "Guanajuato (GTO)" },
        { id: "MEX-GRO", value: "GR", label: "Guerrero (GRO)" },
        { id: "MEX-HGO", value: "HG", label: "Hidalgo (HGO)" },
        { id: "MEX-JAL", value: "JC", label: "Jalisco (JAL)" },
        { id: "MEX-EDM", value: "MC", label: "México - Estado de (EDM)" },
        { id: "MEX-MICH", value: "MN", label: "Michoacán (MICH)" },
        { id: "MEX-MOR", value: "MS", label: "Morelos (MOR)" },
        { id: "MEX-NAY", value: "NT", label: "Nayarit (NAY)" },
        { id: "MEX-NL", value: "NL", label: "Nuevo León (NL)" },
        { id: "MEX-OAX", value: "OC", label: "Oaxaca (OAX)" },
        { id: "MEX-PUE", value: "PL", label: "Puebla (PUE)" },
        { id: "MEX-QRO", value: "QO", label: "Querétaro (QRO)" },
        { id: "MEX-QROO", value: "QR", label: "Quintana Roo (QROO)" },
        { id: "MEX-SLP", value: "SP", label: "San Luis Potosí (SLP)" },
        { id: "MEX-SIN", value: "SL", label: "Sinaloa (SIN)" },
        { id: "MEX-SON", value: "SR", label: "Sonora (SON)" },
        { id: "MEX-TAB", value: "TC", label: "Tabasco (TAB)" },
        { id: "MEX-TAMPS", value: "TS", label: "Tamaulipas (TAMPS)" },
        { id: "MEX-TLAX", value: "TL", label: "Tlaxcala (TLAX)" },
        { id: "MEX-VER", value: "VZ", label: "Veracruz (VER)" },
        { id: "MEX-YUC", value: "YN", label: "Yucatán (YUC)" },
        { id: "MEX-ZAC", value: "ZS", label: "Zacatecas (ZAC)" }
      ],
      checkbox: false,
      sexo: false
    };
  },
  computed: {
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push("You must agree to continue!");
      return errors;
    },
    selectErrors() {
      const errors = [];
      if (!this.$v.select.$dirty) return errors;
      !this.$v.select.required && errors.push("Item is required");
      return errors;
    },
    requestErrors() {
      const errors = [];
      if (!this.$v.request.$dirty) return errors;
      !this.$v.request.maxLength &&
        errors.push("El numero de solicitud indicado es demasiado extenso.");
      !this.$v.request.required &&
        errors.push("Indique el numero de solicitud.");
      !this.$v.request.between &&
        errors.push("El numero de solicitud es invalido.");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    sexoErrors() {
      const errors = [];
      if (!this.$v.sexo.$dirty) return errors;
      !this.$v.sexo.checked && errors.push("Indique el sexo del solicitante.");
      !this.$v.email.required && errors.push("El sexo es obligatorio required");
      return errors;
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
      this.select = null;
      this.checkbox = false;
    },
    saveDate(date) {
      this.$refs.menu.saveDate(date);
    }
  }
};
</script>
