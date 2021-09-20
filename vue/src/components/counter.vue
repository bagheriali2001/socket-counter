<template>
    <div id="body-div" :class="flexDirectionRow">
        <h3> {{ counter.name }} </h3>
        <div class="flex-row" v-if="accessLevel > 0">
            <img src="../assets/add.png" alt="Add" class="opacity90" @click="changeCounter(1, 'firstDosage')"/>
            <p> {{ counter.todayCount.firstDosage }}</p>
            <p class="persianText" > First Dosage : </p>
            <img src="../assets/minus.png" alt="Subtract"  @click="changeCounter(-1, 'firstDosage')"/>
        </div>
        <div class="flex-row" v-if="accessLevel > 0">
            <img src="../assets/add.png" alt="Add" class="opacity90" @click="changeCounter(1, 'secondDosage')"/>
            <p> {{ counter.todayCount.secondDosage }}</p>
            <p class="persianText" > Second Dosage : </p>
            <img src="../assets/minus.png" alt="Subtract"  @click="changeCounter(-1, 'secondDosage')"/>
        </div>
        <div class="flex-row" v-if="accessLevel > 0">
            <img src="../assets/add.png" alt="Add" class="opacity90" @click="changeCounter(1, 'fails')"/>
            <p> {{ counter.todayCount.fails }}</p>
            <p class="persianText" > Fails: </p>
            <img src="../assets/minus.png" alt="Subtract"  @click="changeCounter(-1, 'fails')"/>
        </div>
        <div class="flex-row">
            <p> {{ counter.todayCount.total }}</p>
            <p class="persianText" > Totays Total : </p>
        </div>
        <div id="details" >
            <p> All time Total : {{ counter.totalCount }}</p>
            <button name="resetButton" id="resetButton" @click="resetToday" v-if="accessLevel > 1"> Reset Todays Count</button>
        </div>
  </div>
</template>

<script>
export default {
    props:['counter', "flexDirectionRow", "accessLevel",],
    methods:{
        changeCounter(change, type) {
            this.$emit('change-counts', {id: this.counter._id, change, type})
        },
        resetToday(){
            this.$emit('reset-counts', {id: this.counter._id})
      }
  }
}
</script>

<style scoped>
#body-div{
    align-content: center;
    border: solid gray 1px;
    border-radius: 40px;
    margin: 3%;
    display: flex;
    flex-direction: column ;
    font-size: 30px;
    /*width: 30%;*/
}
.flex-row{
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    align-self: center;
}
img{
    width: 50px;
    height: 50px;
    margin: 10px;
}
.width-based{
    width: 30%;
    height: 90%;
}
.height-based{
    height: 30%;
    width: 90%
}
.persianText{
    direction: ltr;
    margin: 10px
}
.opacity90{
    opacity: 90%;
}
#details{
    direction: ltr;
}
</style>