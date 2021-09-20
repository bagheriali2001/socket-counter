<template>
    <div id="body-div">
        <form @submit.prevent="login">
            <div class="field-div">
                <label class="element"> Username : </label>
                <input type="Text" name="username" id="username" v-model="username" placeholder="  Username" class="element">
            </div>
            <div class="field-div">
                <label class="element">Password : </label>
                <input type="password" name="password" id="password" v-model="password" placeholder="  Password" class="element">
            </div>
            <button class="element" type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    data(){
        return({
            username:"",
            password:""
        })
    },
    methods:{
        login(){
            this.$emit('login', {username: this.username, password: this.password})
        }
    }
}
</script>

<style scoped>
form{
    align-self: center;
}
.field-div{
    margin: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: center;
}
.element{
    margin: 3px;
    direction: ltr;
    position: relative;
}
#body-div{
    align-content: center;
    align-self: center;
    align-items: center;
    border: solid gray 1px;
    margin: 3%;
    display: flex;
    flex-direction: column ;
    font-size: 18px;
    width: 300px;
}
#password{
    margin-right: 8px
}
</style>