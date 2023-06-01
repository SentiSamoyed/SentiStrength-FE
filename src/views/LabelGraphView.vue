<template>

  <LabelHeat />

  <LabelLine />

</template>

<script>
import LabelHeat from '@/components/label/LabelHeat.vue'
import LabelLine from '@/components/label/LabelLine.vue'

export default {
  name: 'LabelGraphView',
  components: { LabelLine, LabelHeat }
}
</script>

<style scoped>

</style>
