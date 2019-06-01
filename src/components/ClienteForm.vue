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
        <v-flex xs6>
          <v-select
            @change="comisionista = $event.id"
            :items="comisionistas"
            item-text="nombre"
            :return-object="true"
            label="Comisionista"
            no-data-text="No hay comisionistas"
          ></v-select>
        </v-flex>
        <v-flex xs6>
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
                v-model="bornDate"
                label="Fecha de nacimiento"
                :error-messages="bornDateErrors"
                readonly
                v-on="on"
                @input="$v.bornDate.$touch()"
                @blur="$v.bornDate.$touch()"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="bornDate"
              ref="picker"
              :max="maxDate"
              min="1950-01-01"
              @change="saveDate"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="nombre"
            :error-messages="nombreErrors"
            :counter="30"
            label="Nombre"
            required
            @input="$v.nombre.$touch()"
            @blur="$v.nombre.$touch()"
            @keyup="uppercasedName"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="apaterno"
            :error-messages="apaternoErrors"
            :counter="20"
            label="Apellido paterno"
            required
            @input="$v.apaterno.$touch()"
            @blur="$v.apaterno.$touch()"
            @keyup="uppercasedLastname"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field
            v-model="amaterno"
            :error-messages="amaternoErrors"
            :counter="20"
            label="Apellido materno"
            required
            @input="$v.amaterno.$touch()"
            @blur="$v.amaterno.$touch()"
            @keyup="uppercasedLastname"
          ></v-text-field>
        </v-flex>
        <v-flex xs5>
          <v-text-field v-model="curp" label="CURP" readonly></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="homoclave"
            :error-messages="homoclaveErrors"
            :counter="2"
            label="Homoclave"
            required
            @input="$v.homoclave.$touch()"
            @blur="$v.homoclave.$touch()"
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
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
        <v-flex xs7 md4>
          <v-radio-group row v-model="sexo" :error-messages="sexoErrors">
            <div>Sexo:</div>
            <v-radio label="Hombre" value="H"></v-radio>
            <v-radio label="Mujer" value="M"></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs5 md4>
          <v-switch
            @change="$emit('esCasado', switch1)"
            v-model="switch1"
            color="success"
            label="El solicitante es casado."
          ></v-switch>
        </v-flex>
        <v-flex xs7>
          <v-select
            v-model="entidad"
            :items="items"
            item-text="label"
            item-value="value"
            :error-messages="entidadErrors"
            label="Entidad de nacimiento"
            required
            @change="$v.entidad.$touch()"
            @blur="$v.entidad.$touch()"
          ></v-select>
        </v-flex>
        <v-flex xs5>
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
        <v-flex xs12>
          <v-text-field
            v-model="direccion"
            :error-messages="addressErrors"
            label="Direccion particular"
            required
            @input="$v.direccion.$touch()"
            @blur="$v.direccion.$touch()"
            @keyup="uppercasedAddress"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn color="green lighten-1" @click="writeClientData">Aceptar</v-btn>
    <v-btn color="red darken-4" @click="clear">Cancelar</v-btn>
  </v-form>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  between
} from "vuelidate/lib/validators";
import config from "../config";

export default {
  name: "NuevoCliente",
  mixins: [validationMixin],
  validations: {
    bornDate: { required, maxLength: maxLength(10) },
    nombre: { required, maxLength: maxLength(30) },
    apaterno: { required, maxLength: maxLength(20) },
    amaterno: { required, maxLength: maxLength(20) },
    direccion: { required, minLength: minLength(10) },
    entidad: { required },
    sexo: { required },
    edocivil: { required },
    homoclave: { required, maxLength: maxLength(2) },
    ocr: { required, maxLength: maxLength(13) },
    telefono: { required, maxLength: maxLength(10) }
  },
  data() {
    return {
      db: config.db,
      nombre: "",
      apaterno: "",
      amaterno: "",
      bornDate: "",
      sexo: false,
      curp: "",
      homoclave: "",
      ocr: "",
      direccion: "",
      telefono: "",
      entidad: "",
      comisionista: "",
      maxDate:
        new Date().toISOString().substr(0, 4) -
        18 +
        "-" +
        new Date().toISOString().substr(5, 2) +
        "-" +
        new Date().toISOString().substr(8, 2),
      menu: false,
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
      switch1: false,
      nuevoCliente: {
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: false,
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      },
      defaultCliente: {
        nombre: "",
        apaterno: "",
        amaterno: "",
        bornDate: "",
        sexo: false,
        curp: "",
        ocr: "",
        direccion: "",
        telefono: "",
        entidad: "",
        tipo: 1,
        comisionista: ""
      },
      comisionistas: []
    };
  },
  watch: {
    menu(val) {
      val &&
        setTimeout(() => {
          return (this.$refs.picker.activePicker = "YEAR");
        });
    }
  },
  methods: {
    generateCurp() {
      if (
        this.curp == "" &&
        (this.nombre != "" &&
          this.apaterno != "" &&
          this.amaterno != "" &&
          this.bornDate != "" &&
          this.entidad != "" &&
          this.sexo != "" &&
          this.homoclave != "",
        this.comisionista != 0)
      ) {
        this.amaterno =
          this.amaterno == undefined ? "XXXXX" : this.amaterno;
        let apaternoFiltrado = this.filtrarApaterno();
        let amaternoFiltrado = this.filtrarAmaterno();

        let c1 =
          apaternoFiltrado.substring(0, 1) == "Ñ"
            ? "X"
            : apaternoFiltrado.substring(0, 1);

        let c2 = this.getSecondChar(apaternoFiltrado);

        let c3 =
          amaternoFiltrado.substring(0, 1) == "Ñ"
            ? "X"
            : amaternoFiltrado.substring(0, 1);

        this.curp = c1 + c2 + c3;
        let nombreFiltrado = this.filtrarNombre();
        this.setDateCurp();
        this.curp += this.sexo + this.entidad;
        let consonantesApaterno = this.consonantesApaterno(apaternoFiltrado);
        let consonantesAmaterno = this.consonantesAmaterno(amaternoFiltrado);
        let consonantesNombre = this.consonantesNombre(nombreFiltrado);

        this.curp +=
          consonantesApaterno[0] == "Ñ" ? "X" : consonantesApaterno[0];
        this.curp +=
          consonantesAmaterno[0] == "Ñ" ? "X" : consonantesAmaterno[0];
        this.curp += consonantesNombre[0] == "Ñ" ? "X" : consonantesNombre[0];
      }
    },
    consonantesNombre(nombreFiltrado) {
      let consonantesNombre = [];
      for (let i = 1; i < nombreFiltrado.length; i++) {
        //recopilar todas las consonantes del nombre a partir del segundo caracter (omitimos el primero) en un arreglo
        if (
          nombreFiltrado.charAt(i) != "A" &&
          nombreFiltrado.charAt(i) != "E" &&
          nombreFiltrado.charAt(i) != "I" &&
          nombreFiltrado.charAt(i) != "O" &&
          nombreFiltrado.charAt(i) != "U" &&
          nombreFiltrado.charAt(i) != "a" &&
          nombreFiltrado.charAt(i) != "e" &&
          nombreFiltrado.charAt(i) != "i" &&
          nombreFiltrado.charAt(i) != "o" &&
          nombreFiltrado.charAt(i) != "u"
        ) {
          consonantesNombre.push(nombreFiltrado.charAt(i));
        }
      }
      return consonantesNombre;
    },
    consonantesAmaterno(amaternoFiltrado) {
      let consonantesAmaterno = [];
      for (let i = 1; i < amaternoFiltrado.length; i++) {
        //recopilar todas las consonantes del apellido materno a partir del segundo caracter (omitimos el primero) en un arreglo
        if (
          amaternoFiltrado.charAt(i) != "A" &&
          amaternoFiltrado.charAt(i) != "E" &&
          amaternoFiltrado.charAt(i) != "I" &&
          amaternoFiltrado.charAt(i) != "O" &&
          amaternoFiltrado.charAt(i) != "U" &&
          amaternoFiltrado.charAt(i) != "a" &&
          amaternoFiltrado.charAt(i) != "e" &&
          amaternoFiltrado.charAt(i) != "i" &&
          amaternoFiltrado.charAt(i) != "o" &&
          amaternoFiltrado.charAt(i) != "u"
        ) {
          consonantesAmaterno.push(amaternoFiltrado.charAt(i));
        }
      }
      return consonantesAmaterno;
    },
    consonantesApaterno(apaternoFiltrado) {
      let consonantesApaterno = [];
      for (let i = 1; i < apaternoFiltrado.length; i++) {
        //recopilar todas las consonantes del apellido paterno a partir del segundo caracter en un arreglo (omitimos el primero)
        if (
          apaternoFiltrado.charAt(i) != "A" &&
          apaternoFiltrado.charAt(i) != "E" &&
          apaternoFiltrado.charAt(i) != "I" &&
          apaternoFiltrado.charAt(i) != "O" &&
          apaternoFiltrado.charAt(i) != "U" &&
          apaternoFiltrado.charAt(i) != "a" &&
          apaternoFiltrado.charAt(i) != "e" &&
          apaternoFiltrado.charAt(i) != "i" &&
          apaternoFiltrado.charAt(i) != "o" &&
          apaternoFiltrado.charAt(i) != "u"
        ) {
          consonantesApaterno.push(apaternoFiltrado.charAt(i));
        }
      }
      return consonantesApaterno;
    },
    setDateCurp() {
      let year = this.bornDate.substring(2, 4);
      let month = this.bornDate.substring(6, 7);
      let day = this.bornDate.substring(8, 10);
      month < 10
        ? (this.curp += year + "0" + month)
        : (this.curp += year + month);
      day < 10 ? (this.curp += "0" + day) : (this.curp += day);
    },
    getSecondChar(apaternoFiltrado) {
      for (let i = 1; i < apaternoFiltrado.length; i++) {
        if (
          apaternoFiltrado.charAt(i) == "A" ||
          apaternoFiltrado.charAt(i) == "E" ||
          apaternoFiltrado.charAt(i) == "I" ||
          apaternoFiltrado.charAt(i) == "O" ||
          apaternoFiltrado.charAt(i) == "U" ||
          apaternoFiltrado.charAt(i) == "a" ||
          apaternoFiltrado.charAt(i) == "e" ||
          apaternoFiltrado.charAt(i) == "i" ||
          apaternoFiltrado.charAt(i) == "o" ||
          apaternoFiltrado.charAt(i) == "u"
        ) {
          return apaternoFiltrado.charAt(i);
        }
      }
      return "X";
    },
    filtrarNombre() {
      let partirNombre = this.nombre.split(" ");
      if (partirNombre.length >= 2) {
        if (
          partirNombre[0] == "JOSE" ||
          partirNombre[0] == "MARIA" ||
          partirNombre[0] == "JOSÉ" ||
          partirNombre[0] == "MARÍA" ||
          partirNombre[0] == "J" ||
          partirNombre[0] == "MA" ||
          partirNombre[0] == "J." ||
          partirNombre[0] == "MA." ||
          partirNombre[0] == "JOCE" ||
          partirNombre[0] == "MARYA" ||
          partirNombre[0] == "JOCÉ" ||
          partirNombre[0] == "JOZE" ||
          partirNombre[0] == "JOZÉ"
        ) {
          this.curp += partirNombre[1].substring(0, 1);
          return partirNombre[1];
        } else {
          this.curp +=
            this.nombre.substring(0, 1) == "Ñ"
              ? "X"
              : this.nombre.substring(0, 1);
          return partirNombre[0];
        }
      } else {
        this.curp +=
          this.nombre.substring(0, 1) == "Ñ"
            ? "X"
            : this.nombre.substring(0, 1);
        return this.nombre;
      }
    },
    filtrarAmaterno() {
      let partirAmaterno = this.amaterno.split(" ");
      if (partirAmaterno.length >= 2) {
        for (let i = 0; i < partirAmaterno.length; i++) {
          if (
            partirAmaterno[i] != "DA" &&
            partirAmaterno[i] != "DAS" &&
            partirAmaterno[i] != "DE" &&
            partirAmaterno[i] != "DEL" &&
            partirAmaterno[i] != "DER" &&
            partirAmaterno[i] != "DI" &&
            partirAmaterno[i] != "DIE" &&
            partirAmaterno[i] != "DD" &&
            partirAmaterno[i] != "EL" &&
            partirAmaterno[i] != "LA" &&
            partirAmaterno[i] != "LOS" &&
            partirAmaterno[i] != "LAS" &&
            partirAmaterno[i] != "LE" &&
            partirAmaterno[i] != "LES" &&
            partirAmaterno[i] != "MAC" &&
            partirAmaterno[i] != "MC" &&
            partirAmaterno[i] != "VAN" &&
            partirAmaterno[i] != "VON" &&
            partirAmaterno[i] != "Y"
          ) {
            return partirAmaterno[i];
          }
        }
      } else {
        return partirAmaterno[0];
      }
    },
    filtrarApaterno() {
      let partirApaterno = this.apaterno.split(" ");
      if (partirApaterno.length >= 2) {
        for (let i = 0; i < partirApaterno.length; i++) {
          if (
            partirApaterno[i] != "DA" &&
            partirApaterno[i] != "DAS" &&
            partirApaterno[i] != "DE" &&
            partirApaterno[i] != "DEL" &&
            partirApaterno[i] != "DER" &&
            partirApaterno[i] != "DI" &&
            partirApaterno[i] != "DIE" &&
            partirApaterno[i] != "DD" &&
            partirApaterno[i] != "EL" &&
            partirApaterno[i] != "LA" &&
            partirApaterno[i] != "LOS" &&
            partirApaterno[i] != "LAS" &&
            partirApaterno[i] != "LE" &&
            partirApaterno[i] != "LES" &&
            partirApaterno[i] != "MAC" &&
            partirApaterno[i] != "MC" &&
            partirApaterno[i] != "VAN" &&
            partirApaterno[i] != "VON" &&
            partirApaterno[i] != "Y"
          ) {
            return partirApaterno[i];
          }
        }
      } else {
        return partirApaterno[0];
      }
    },
    writeClientData() {
      this.generateCurp();
      this.nuevoCliente.nombre = this.nombre;
      this.nuevoCliente.apaterno = this.apaterno;
      this.nuevoCliente.amaterno = this.amaterno;
      this.nuevoCliente.bornDate = this.bornDate;
      this.nuevoCliente.sexo = this.sexo;
      this.nuevoCliente.ocr = this.ocr;
      this.nuevoCliente.direccion = this.direccion.toUpperCase();
      this.nuevoCliente.telefono = this.telefono;
      this.nuevoCliente.entidad = this.entidad;
      this.nuevoCliente.comisionista = this.comisionista;
      this.nuevoCliente.curp =
        this.curp.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + this.homoclave;
      if (this.curp.length == 16) {
        this.db
          .ref("personas/")
          .push(this.nuevoCliente)
          .then(response => {
            this.clear();
            console.log(response);
          });
      } else {
        alert("LA CURP NO SE GENERÓ");
      }
    },
    clear() {
      this.nuevoCliente = this.defaultCliente;
      this.nombre = "";
      this.apaterno = "";
      this.amaterno = "";
      this.bornDate = "";
      this.sexo = false;
      this.curp = "";
      this.homoclave = "";
      this.ocr = "";
      this.direccion = "";
      this.telefono = "";
      this.entidad = "";
      this.menu = false;
      this.$v.$reset();
    },
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    uppercasedName(){
      this.nombre = this.nombre.toUpperCase();
    },
    uppercasedLastname(){
      this.apaterno = this.apaterno.toUpperCase();
      this.amaterno = this.amaterno.toUpperCase();
    },
    uppercasedAddress(){
      this.direccion = this.direccion.toUpperCase();
    }
  },
  computed: {
    nombreErrors() {
      const errors = [];
      if (!this.$v.nombre.$dirty) return errors;
      !this.$v.nombre.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.nombre.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    amaternoErrors() {
      const errors = [];
      if (!this.$v.amaterno.$dirty) return errors;
      !this.$v.amaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.amaterno.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    apaternoErrors() {
      const errors = [];
      if (!this.$v.apaterno.$dirty) return errors;
      !this.$v.apaterno.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.apaterno.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    sexoErrors() {
      const errors = [];
      if (!this.$v.sexo.$dirty) return errors;
      !this.$v.email.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    entidadErrors() {
      const errors = [];
      if (!this.$v.entidad.$dirty) return errors;
      !this.$v.entidad.required && errors.push("Este campo es obligatorio");
      return errors;
    },
    addressErrors() {
      const errors = [];
      if (!this.$v.direccion.$dirty) return errors;
      !this.$v.direccion.minLength && errors.push("La direccion es incorrecta");
      !this.$v.direccion.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    bornDateErrors() {
      const errors = [];
      if (!this.$v.bornDate.$dirty) return errors;
      !this.$v.bornDate.maxLength &&
        errors.push("La fecha de nacimiento es incorrecta.");
      !this.$v.bornDate.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    homoclaveErrors() {
      const errors = [];
      if (!this.$v.homoclave.$dirty) return errors;
      !this.$v.homoclave.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.homoclave.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    ocrErrors() {
      const errors = [];
      if (!this.$v.ocr.$dirty) return errors;
      !this.$v.ocr.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.ocr.required && errors.push("Este campo es obligatorio.");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.telefono.$dirty) return errors;
      !this.$v.telefono.maxLength &&
        errors.push("El valor introducido es demasiado largo.");
      !this.$v.telefono.required && errors.push("Este campo es obligatorio.");
      return errors;
    }
  },
  created() {
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
