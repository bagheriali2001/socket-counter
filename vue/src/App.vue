<template>
    <div class="flex-div" id="header-div">
        <h1 class="margin10">Synchronized Counter</h1>
        <div class="flex-div" id="date-div">
            <p class="margin10 date-text">Time : {{ time }}</p>
            <p class="margin10 date-text">Date : {{ date }}</p>
        </div>
    </div>
    <div id="counter-div" :style="{ flexDirection: flexDirection }">
        <counter
            v-for="counter in counters"
            :key="counter._id"
            :counter="counter"
            :flex-direction-row="directionIsRow"
            :access-level="accessLevel"
            @change-counts="changeCount"
            @reset-counts="resetCounts"
        >
        </counter>
    </div>
    <p> Todats Total: {{ totalOfDay }}</p>
    <p> All time Total : {{ totalOfAllTime }}</p>
    <div id="login-logout-div">
        <button name="loginShower" id="loginShower" @click="changeloginPanelStatus" v-if="!isLogedIn">
            Sign in
        </button>
        <button name="logout" id="logout" @click="logout" v-if="isLogedIn">
            Sign out
        </button>
        <login v-if="loginPanelStatus" @login="login"></login>
    </div>
    <div id="about-developer">
        <p>
            Create and Designed By <a href="https://www.bagheriali.dev">Ali Bagheri</a>
        </p>
    </div>
</template>

<script>
import counter from "./components/counter";
import login from "./components/login";
import io from "socket.io-client";

export default {
    name: "App",
    components: {
        counter,
        login,
    },
    data() {
        return {
            counters: [],
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            flexDirection: "row",
            directionIsRow: "width-based",
            socket: {},
            loginPanelStatus: false,
            isLogedIn: false,
            accessLevel: 0,
            jwt: null,
            interval: null,
            time: null,
            date: null,
            totalOfDay: 0,
            totalOfAllTime: 0,
        };
    },
    watch: {
        windowHeight(newHeight) {
            if (newHeight > this.windowWidth) {
                this.flexDirection = "column";
                this.directionIsRow = "height-based";
            } else {
                this.flexDirection = "row";
                this.directionIsRow = "width-based";
            }
        },
        windowWidth(newWidth) {
            if (newWidth > this.windowHeight) {
                this.flexDirection = "row";
                this.directionIsRow = "width-based";
            } else {
                this.flexDirection = "column";
                this.directionIsRow = "height-based";
            }
        },
        accessLevel(newAccessLevel) {
            localStorage.accessLevel = newAccessLevel;
        }
    },
    created() {
        this.socket = io(process.env.VUE_APP_SOCKET_URI);
        this.interval = setInterval(() => {
        this.time = Intl.DateTimeFormat(process.env.VUE_APP_LOCALES, {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        }).format();
        this.date = Intl.DateTimeFormat(process.env.VUE_APP_LOCALES, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        }).format();
        }, 1000);
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });

        if (localStorage.accessLevel && localStorage.accessLevel > 0) {
            this.accessLevel = localStorage.accessLevel;
            this.isLogedIn = true
        }

        if (this.windowHeight > this.windowWidth) {
            this.flexDirection = "column";
            this.directionIsRow = "height-based";
        } else {
            this.flexDirection = "row";
            this.directionIsRow = "width-based";
        }

        this.socket.on("hello", (data) => {
            // console.log(data);
            this.counters = data;
            this.totalOfDay = this.counters[0].todayCount.total + this.counters[1].todayCount.total + this.counters[2].todayCount.total
            this.totalOfAllTime = this.counters[0].totalCount + this.counters[1].totalCount + this.counters[2].totalCount
        });
        this.socket.on("updatedCount", (data) => {
            // console.log("data => ", data);
            let item;
            for (item of this.counters) {
                if (item._id === data._id) {
                    item.todayCount = data.todayCount;
                    item.totalCount = data.totalCount;
                }
            }
            this.totalOfDay = this.counters[0].todayCount.total + this.counters[1].todayCount.total + this.counters[2].todayCount.total
            this.totalOfAllTime = this.counters[0].totalCount + this.counters[1].totalCount + this.counters[2].totalCount
        });
        this.socket.on("logedIn", (data) => {
            if (data) {
                this.accessLevel = data.accessLevel;
                localStorage.token = data.token;
                this.isLogedIn = true
            }
            this.loginPanelStatus = false;
        });
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.onResize);
        clearInterval(this.interval);
        this.socket.disconnect();
    },
    methods: {
        changeCount(data) {
            // console.log("data => ", data);
            this.socket.emit("updateCounter", {
                id: data.id,
                change: data.change,
                type: data.type,
                token: localStorage.token
            });
        },
        onResize() {
            this.windowHeight = window.innerHeight;
            this.windowWidth = window.innerWidth;
        },
        changeloginPanelStatus() {
            this.loginPanelStatus = !this.loginPanelStatus;
        },
        login(data) {
            // console.log(data);
            this.socket.emit("login", data);
        },
        resetCounts(data) {
            // console.log(data)
            this.socket.emit("resetCounts", { id: data.id, token: localStorage.token});
        },
        logout(){
            this.accessLevel = 0
            localStorage.removeItem("token")
            localStorage.removeItem("accessLevel")
            this.isLogedIn = false
        }
    },
};
</script>

<style>
body {
    background: #292626;
    margin: 0
}
button {
    border-radius: 8px;
    margin: 10px;
}
input {
    border-radius: 10px;
    margin: 10px;
}
a {
    color: inherit;
    text-decoration: none;
}
.flex-div {
    display: flex;
    align-items: center;
    align-self: center;
}
.date-text {
    font-size: 17px;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: whitesmoke;
    margin-top: 60px;
    font-size: 20px;
}
#header-div{
    flex-direction: column;
    font-size: 15px
}
#date-div{
    flex-direction: row-reverse;
}
#counter-div {
    display: flex;
    align-items: center;
}
#login-logout-div{
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    margin-bottom: 75px;
}
#about-developer{
    position: fixed;
    bottom: 0 ;
    width: 100%;
    align-self: center;
    margin: 0;
    align-items: center;
    color: black;
    background-color: aliceblue
}
</style>
