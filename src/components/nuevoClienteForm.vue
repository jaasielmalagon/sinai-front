<template>
  <!-- <v-card dark>
    <v-card-title>
      <v-toolbar color="blue lighten-2" dark>
        <v-toolbar-title>Datos personales</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
  <v-card-text class="px-5">-->
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
              <v-text-field
                v-model="date"
                label="Fecha de nacimiento"
                :error-messages="dateErrors"
                readonly
                v-on="on"
                @input="$v.date.$touch()"
                @blur="$v.date.$touch()"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              ref="picker"
              :max="maxDate"
              min="1950-01-01"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            :v-model="name"
            :error-messages="nameErrors"
            :counter="30"
            label="Nombre"
            required
            @keyup="name.toUpperCase()"
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="apaterno"
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
            v-model="amaterno"
            :error-messages="nameErrors"
            :counter="15"
            label="Apellido materno"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="curp"
            :error-messages="curpErrors"
            :counter="18"
            label="CURP"
            required
            @input="$v.curp.$touch()"
            @blur="$v.curp.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field
            v-model="ocr"
            :error-messages="ocrErrors"
            :counter="13"
            label="Clave de elector"
            required
            @input="$v.ocr.$touch()"
            @blur="$v.ocr.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-radio-group row v-model="sexo" :error-messages="sexoErrors">
            <div>Sexo:</div>
            <v-radio label="Hombre" value="H"></v-radio>
            <v-radio label="Mujer" value="M"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs4>
          <v-switch
            @change="$emit('esCasado', switch1)"
            v-model="switch1"
            color="success"
            label="El solicitante es casado."
          ></v-switch>
        </v-flex>
        <v-flex xs4>
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
            v-model="direccion"
            :error-messages="addressErrors"
            label="Direccion particular"
            required
            @input="$v.direccion.$touch()"
            @blur="$v.direccion.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            v-model="telefono"
            :error-messages="phoneErrors"
            :counter="10"
            label="Telefono celular"
            required
            @input="$v.telefono.$touch()"
            @blur="$v.telefono.$touch()"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
  <!-- </v-card-text>
    <v-card-actions>
      <v-btn color="green lighten-1" @click="submit">Aceptar</v-btn>
      <v-btn color="red darken-4" @click="clear">Cancelar</v-btn>
    </v-card-actions>
  </v-card>-->
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, between } from "vuelidate/lib/validators";

export default {
  name: "NuevoCliente",
  mixins: [validationMixin],
  validations: {
    date: { required, maxLength: maxLength(10) },
    name: { required, maxLength: maxLength(30) },
    apaterno: { required, maxLength: maxLength(15) },
    amaterno: { required, maxLength: maxLength(15) },
    request: { required, between: between(1, 99999), maxLength: maxLength(5) },
    direccion: { required },
    select: { required },
    sexo: { required },
    edocivil: { required },
    curp: { required, maxLength: maxLength(18) },
    ocr: { required, maxLength: maxLength(13) },
    telefono: { required, maxLength: maxLength(10) },
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
      maxDate:
        new Date().toISOString().substr(0, 4) -
        18 +
        "-" +
        new Date().toISOString().substr(5, 2) +
        "-" +
        new Date().toISOString().substr(8, 2),
      menu: false,
      name: "",
      apaterno: "",
      amaterno: "",
      curp: "",
      ocr: "",
      direccion: "",
      telefono: "",
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
      sexo: false,
      switch1: false
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  mounted: function() {
    this.writeClientData();
  },
  methods: {
    writeClientData(userId, name, email, imageUrl) {
      // database.ref("users/" + userId).set({
      //   username: 'JAASIEL',
      //   email: 'maalaagasz@gmail.com',
      //   profile_picture: 'https://randomuser.me/api/portraits/men/54.jpg'
      // });
    },
    upperCasedName() {
      this.name.toUpperCase();
    },
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
      this.$refs.menu.save(date);
    }
  },
  computed: {
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
        errors.push("El valor introducido es incorrecto.");
      !this.$v.name.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    sexoErrors() {
      const errors = [];
      if (!this.$v.sexo.$dirty) return errors;
      !this.$v.sexo.checked && errors.push("Indique el sexo del solicitante.");
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.direccion.$dirty) return errors;
      !this.$v.direccion.maxLength && errors.push("La direccion es incorrecta");
      !this.$v.direccion.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.date.$dirty) return errors;
      !this.$v.date.maxLength &&
        errors.push("La fecha de nacimiento es incorrecta.");
      !this.$v.date.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    curpErrors() {
      const errors = [];
      if (!this.$v.curp.$dirty) return errors;
      !this.$v.curp.maxLength &&
        errors.push("El valor introducido es incorrecto.");
      !this.$v.curp.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    ocrErrors() {
      const errors = [];
      if (!this.$v.ocr.$dirty) return errors;
      !this.$v.ocr.maxLength &&
        errors.push("El valor introducido es incorrecto.");
      !this.$v.ocr.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.telefono.$dirty) return errors;
      !this.$v.telefono.maxLength &&
        errors.push("El valor introducido es incorrecto.");
      !this.$v.telefono.required && errors.push("Este campo es obligatorio.");
      return errors;
    }
  }
};
</script>
