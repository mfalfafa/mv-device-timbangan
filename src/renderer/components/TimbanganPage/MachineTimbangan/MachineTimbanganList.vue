

<template>
    <div class="fix-height">
        <p>listhistorytimbang.length</p>

        <b-list-group>
            <b-list-group-item v-for="(item,ind) in listhistorytimbang" :key="ind">
                <p>{{item.machine | item.category}}</p>
                <p>{{item.line}}</p>
                <p{{item.date | item.time}}</p>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
    export default {
      name: 'history-list',
      props: ['listhistorytimbang'],

      mounted () {
          console.log('Panjang: ', listhistorytimbang.length)
      }
    }

</script>