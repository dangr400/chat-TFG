<template>
    <div class="sala-container">
        <div class="salas-header">
             <p class="add-sala" @click="$emit('add-sala')"><i class="fa fa-plus"></i>sala</p>
             <i class="fa fa-users" @click.stop="$emit('sala-click')"></i>
        </div>
        <div class="search">
            <i class="fa fa-search"></i>
            <input type="text" placeholder="search" v-model="salaSearch">
        </div>
           <div class="sala-box">
                  <div class="sala" v-for="(sala,index) in computedChannels" :key="index">
                        <router-link   :to="{name: 'sala', params: { id: sala._id }}">
                            <div class="sala-name">
                                <span :class="{'picked':($route.params.id===sala._id)}">CH</span>
                                <p>{{sala.name}}</p>
                            </div>
                        </router-link>
                    <i class="fa fa-times-circle" v-if="($route.params.id===sala._id)" @click="confirmIndex=index"></i>
                    <div class="confirm" v-if="confirm(index)" :id="index">
                            <p class="sala-name">Leave '{{sala.name}}'</p>
                            <p>Are you sure</p>
                            <div>
                                <p class="cancel" @click="confirmIndex=undefined">Cancel</p>
                                <button @click="leaveChannel(sala,index)">Leave sala</button>
                            </div>
                    </div>
                  </div>
           </div>
    </div>
</template>

<script>
export default {
     props:['salas'],
     data(){
         return{
            confirmIndex:undefined,
            salaSearch:''
         }
     },
     computed:{
         computedChannels(){
             return this.salas.filter(sala=>{return sala.name.includes(this.salaSearch)});
         }
     },
     methods:{
        confirm(index){
            if(index===this.confirmIndex){
                return true;
            }
            else{
                return false;
            }
        },
        leaveChannel(sala,index){
             this.confirmIndex=undefined;
             this.$emit('leave-sala',sala,index);
        }
     }
}
</script>

<style scoped>
p.add-sala,i.fa-users,i.fa-times-circle,div.sala-name,p.cancel{
    cursor: pointer;
}
div.sala-container{
    font-size: 0.8rem;
    color: var(--button-text);
    height: 92%;
    position: relative;
}
div.salas-header,div.sala,div.search,div.sala-name{
    display: flex;
    align-items: center;
}
div.salas-header{
    justify-content: space-between;
    padding: 0.8rem 1rem;
    display: flex;
    border-bottom: 3px solid var(--button-text);
    font-size: 0.9rem;
    margin-bottom: 2rem;
}
div.salas-header i.fa-plus{
    margin-right: 0.7rem;
}
div.salas-header p,div.head i{
    margin: 0;
}
div.search{
    height: 35px;
    width: 90%;
    margin: auto;
    border-radius: 0.3rem;
    padding: 0rem 0.5rem;
    background: var(--background);
}
div.search i{
    margin-right: 0.5rem;
    color: var(--button);
}
div.search input{
    outline: none;
    border: none;
    height: 100%;
    width: 100%;
    background: transparent;
}
div.sala{
      width: 90%;
      margin: auto;
      justify-content: space-between;
      position: relative;
}
div.sala-box{
    -ms-overflow-style: none; 
    scrollbar-width: none;
    overflow: scroll;
    max-height: 72%;
    padding: 2rem 0rem;
}
div.sala-box::-webkit-scrollbar {
    display: none;
}
div.sala-name{
    width: 90%;
}
i.fa-times-circle:hover{
    transform: scale(1.2);
    color: var(--error);
}
div.sala-name span{
   padding: 0.2rem; 
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 0.2rem;
   margin-right: 0.5rem;
   color: var(--text);
   background: var(--background);
}
div.sala-name span.picked{
    background: var(--error);
    color: var(--button-text);
}
div.confirm{
    position: absolute;
    width: 100%;
    background:var(--stroke);
    border-radius: 0.4rem;
    color: white;
    z-index: 99;
    text-align: center;
    transform: translateY(40px);
}
div.confirm p{
    margin: 0;
}
div.confirm  p.sala-name{
    font-size: 1.1rem;
    text-transform: uppercase;
    margin: 0.6rem 0rem 0.8rem 0rem;
}
div.confirm div{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background: var(--sec-bg);
    border-bottom-left-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
    padding: 0.7rem;
    margin-top: 2rem;
}
div.confirm p.cancel{
    font-size: 0.8rem;
    margin: 0;
    margin-right:0.6rem;
}
div.confirm p.cancel:hover{
    text-decoration: underline;
}
div.confirm button{
    background: var(--error);
    font-size: 0.8rem;
    padding: 0.7rem;
    border-radius: 0.35rem;
    color: var(--button-text);
    border: 0;
    outline: 0;
    text-align: center;
}
a{
    text-decoration: none;
    color:var(--button-text);
    width: 100%;
}

</style>