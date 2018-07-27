<template>
<div class="col-sm-12">
  <br/>
  <table class="table custom">
    <thead>
      <tr>
        <th width="33%">Info</th>
        <th width="33%">Timbangan</th>
        <th width="33%">History</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td align="center">

          <h4 align="left">Line</h4>
          <div>
            <b-form-select v-model="selectedLine" :options="listLine" class="mb-3" />
          </div>

          <h4 align="left">Mesin</h4>
          <div>
            <b-form-select v-model="selectedMachine" :options="listMachine[selectedLine]" class="mb-3" />
          </div>

          <h4 align="left">Category</h4>
          <div>
            <b-form-select v-model="selectedCategory" :options="listCategory[(selectedMachine.split('-'))[0]]" class="mb-3" />
          </div>

        </td>
        <td align="center">
          <h4 align="left">Berat (gr)</h4>
          <div>
            <b-form-input v-model="berattimbangan" type="text" placeholder="100"></b-form-input>
          </div>
          <b-button v-on:click="showModal" :size="lg" :variant="primary">
            Submit
          </b-button>
        </td>
        <td class="left-border">
          <div class="fix-height">
            <b-list-group>
              <b-list-group-item v-for="(item,ind) in this.listHistoryTimbang" :key="ind">
                <p>{{item.machine + ' | ' +  item.category}}</p>
                <p>Line {{item.line}}</p>
                <p>{{item.date + ' | ' +  item.time}}</p>
              </b-list-group-item>
            </b-list-group>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div>
    <b-modal ref="myModalRef" hide-footer title="Verifikasi Timbangan">
      <h4>Mesin: {{this.selectedMachine}}</h4>
      <h4>Line: {{this.selectedLine}}</h4>
      <h4>Kategori: {{this.selectedCategory}}</h4>
      <h4>Berat(gr): {{this.berattimbangan}}</h4>
      <!-- <div class="d-block text-center">
                <h3>Hello From My Modal!</h3>
              </div> -->
      <b-btn class="mt-3" variant="outline-danger" block @click="submitToDatabase">SUBMIT</b-btn>
    </b-modal>
  </div>
</div>
</template>

<script>
    import axios from 'axios'

    import MachineTimbanganList from './MachineTimbangan/MachineTimbanganList.vue'
    import konfigur from '@/assets/json/konfigurasi.json'

    axios.defaults.baseURL = konfigur.webserviceurl
    axios.defaults.headers = {
      'Access-Control-Allow-Origin': '*'
    }

    export default {
      name: 'machinetimbangan',
      components: {},
      props: ['machineid', 'machinename'],
      data: () => ({
        selectedCategory: '',
        selectedLine: '',
        selectedMachine: '',
        listLine: [],
        listMachine: [],
        listCategory: [],
        listHistoryTimbang: [],
        berattimbangan: '',
      }),

      mounted() {
        this.getAllCategory();
        this.getAllLine();
        this.getAllMachine();
        this.getHistoryTimbang();
        this.$electron.ipcRenderer.on('serialtimbangan', (event, data) => {
        this.berattimbangan = data;
          // console.log('data dari serial:', data);
        });  
      },

      methods: {
        showModal: function() {
          this.$refs.myModalRef.show();
        },

        getAllLine: function () {
          let options = [
            {value: '1', text: 'Line 1'},
            {value: '2', text: 'Line 2'},
            {value: '3', text: 'Line 3'}
          ]

          this.listLine = options
          axios.get('/lines/all').then(res => {
            this.listLine = res.data
          }).catch(error => {
            console.log('error get list line', error.config)
          })

        },
        getAllMachine: function () {
          let options = {
            "1": [
              {value: 'mixer-1', text: 'Mixer 1'},
              {value: 'oven-2', text: 'Oven 2'},
              {value: 'packaging-3', text: 'Packaging 3'}
            ],
            2: [
              {value: 'mixer-4', text: 'Mixer 4'},
              {value: 'oven-5', text: 'Oven 5'},
              {value: 'packaging-6', text: 'Packaging 6'}
            ],
            3: [
              {value: 'mixer-7', text: 'Mixer 7'},
              {value: 'oven-8', text: 'Oven 8'},
              {value: 'packaging-9', text: 'Packaging 9'}
            ],
          };
          
          this.listMachine = options;
          // axios.get('/devicetimbangan/getAllMachine').then(res => {
          //   this.listMachine = res.data
          // }).catch(error => {
          //   console.log('error get list machine', error.config)
          // })
        },

        getAllCategory: function () {
          let options = {
            'mixer': [
              {value: 'category1', text: 'Category 1'},
              {value: 'category2', text: 'Category 2'},
              {value: 'category3', text: 'Category 3'}
            ],
            'oven': [
              {value: 'category4', text: 'Category 4'},
              {value: 'category5', text: 'Category 5'},
              {value: 'category6', text: 'Category 6'}
            ],
            'packaging': [
              {value: 'category7', text: 'Category 7'},
              {value: 'category8', text: 'Category 8'},
              {value: 'category9', text: 'Category 9'}
            ],
          }
          this.listCategory = options
          // axios.get('/devicetimbangan/getBadStockCategoryList').then(res => {
          //   this.listCategory = res.data
          // }).catch(error => {
          //   console.log('error get list category', error.config)
          // })

        },

        getHistoryTimbang: function () {
          let data = [
            {line: 1, machine: 'mixer-1', category: 'category1', weight: 12000},
            {line: 1, machine: 'packaging-1', category: 'category2', weight: 15000},
            {line: 1, machine: 'oven-1', category: 'category3', weight: 1324000},
          ] 
          // axios.get('/devicetimbangan/getHistoryTimbang').then(res => {
          //   this.listHistoryTimbang = res.data
          // }).catch(error => {
          //   console.log('error get list history timbang', error.config)
          // })
          this.listHistoryTimbang = data;
        },

        submitToDatabase: function () {
          let submittedData = {line: this.selectedLine, machine: this.selectedMachine, category: this.selectedCategory, weight: this.berattimbangan};
          // listHistoryTimbang.push(submittedData)
          //submit to db via rest api
          this.$refs.myModalRef.hide();
          // axios.post('/devicetimbangan/submitdata').then(res => {

          // });
          console.log('Data submitted');
        }
      }
    }
</script>