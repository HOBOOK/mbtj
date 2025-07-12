<template>
    <multipane-template
        :menuItems="menuItems"
        id="sample"
        :extend="extend"
    >
        <template v-slot:body>
            <div>
                Body
            </div>
        </template>

        <template v-slot:footer>
            <v-btn @click="extend = !extend">하단 패널 확장</v-btn>
        </template>

        <template v-slot:menuItem="{menuItem}">
        
            <!-- 1번 패널 -->
            <div v-if="menuItem === '1'">
                {{menuItem}}
            </div>

            <!-- 2번 패널 -->
            <div v-else-if="menuItem === '2'">
                2
            </div>
        </template>

        <template v-slot:extend>
            <div>
                extend
            </div>
        </template>
    </multipane-template>

</template>

<script>

export default {
  name: 'MultipaneTemplateSample',
  data() { 
    return {
      extend:false,
      menuItems:[{
        icon:'mdi-bullhorn-variant-outline',
        title:'title1',
        actions:[{
          icon:'mdi-chevron-right',
          event: () => {
            alert('1')
          }
        }]
      },{
        icon:'mdi-factory',
        title:'title2',
        actions:[{
          icon:'mdi-refresh',
          event: () => {
              alert('2')
          }
        }]
      }]
    }
  }
}
</script>