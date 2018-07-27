<template>
    <div>
        <div>
            <label>List Mesin digunakan</label>
            <ul>
                <li v-for="(mac,ind) in mesinList" :key="ind">{{ 'Mesin id : '+mac.id+', Mesin : '+mac.name }}</li>
            </ul>
            <button @click="modalLine = true">Ubah Mesin</button>
        </div>
        <div>
            <label>Webservice url : </label>
            <input type="text" v-model="weburl">
        </div>
        <button @click="simpanKonfig()">Simpan Konfigurasi</button>
        <!-- modal untuk memilih mesin dalam satu line-->
        <transition name="mesin">
            <div v-if="modalLine" class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">
                      <div>
                          <label>Line :</label>
                          <select v-model="line">
                              <option v-for="(ln,ind) in lineSelect" :key="ind" :value="ln.id">{{ ln.name }}</option>
                          </select>
                      </div>
                      <div>
                          <label>Machine :</label>
                          <div>
                              <div v-for="(mc,ind) in machineSelect" :key="ind">
                                  <input type="checkbox" :value="mc.id" v-model="machine">
                                  <label>{{ mc.name }}</label>
                              </div>
                          </div>
                      </div>
                      <button @click="setMachine()">Set Mesin</button>
                    </div>
                </div>
            </div>
        </transition>
        <!-- modal after konfigurasi -->
        <transition name="finalisasi">
            <div v-if="finalisShow" class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <router-link :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" to="/">Kembali Login</router-link>
                        <button :class="['btn-machine', 'btn', 'btn-outline-primary', 'btn-sm']" @click="closeFinal()">Tutup</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
   import axios from 'axios'
   import konfigur from '@/assets/json/konfigurasi.json'

   axios.defaults.baseURL = konfigur.webserviceurl
   axios.defaults.headers = {'Access-Control-Allow-Origin': '*'}

   export default {
     name: 'donwtime-page',
     data: () => ({
       mesinList: konfigur.machines,
       weburl: konfigur.webserviceurl,
       modalLine: false,
       finalisShow: false,
       line: 1,
       machine: [],
       lineSelect: [],
       listMachine: []
     }),
     mounted () {
       this.loadLine()
       this.loadMachine()
     },
     computed: {
       machineSelect: function () {
         return this.listMachine[this.line]
       }
     },
     methods: {
       closeFinal: function () {
         this.finalisShow = false
       },
       loadLine: function () {
         axios.get('/lines/all').then(ress => {
           this.lineSelect = ress.data
         }).catch(error => {
           console.log('error get line', error.config)
         })
       },
       loadMachine: function () {
         axios.get('/machines/byline').then(ress => {
           this.listMachine = ress.data
         }).catch(error => {
           console.log('error get machine', error.config)
         })
       },
       setMachine: function () {
         axios.post('/machines/byidmachine', {machines: this.machine}).then(ress => {
           this.mesinList = ress.data
           this.modalLine = false
         }).catch(error => {
           console.log('error set mesin list', error.config)
           this.modalLine = false
         })
       },
       simpanKonfig: function () {
         let simpJson = {
           line: this.line,
           machines: this.mesinList,
           webserviceurl: this.weburl
         }
         this.$electron.ipcRenderer.send('konfig:save', simpJson)
         this.finalisShow = true
       }
     }
   }
</script>

<style>
.modal-mask{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper{
  display: table-cell;
  vertical-align: middle;
}
.modal-container{
  width: 240px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.mesin-enter {
  opacity: 0;
}
.mesin-leave-active {
  opacity: 0;
}
.mesin-enter .mesin-container,
.mesin-leave-active .mesin-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.finalisasi-enter {
  opacity: 0;
}
.finalisasi-leave-active {
  opacity: 0;
}
.finalisasi-enter .finalisasi-container,
.finalisasi-leave-active .mesin-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

