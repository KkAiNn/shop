<template>
    <div>
        <MHeader/>
        <router-view></router-view>
    </div>
</template>

<script>
import MHeader from '@/common/MHeader.vue'
export default {
    components : {
        MHeader
        }
}
</script>

<style lang="sass">
    
</style>