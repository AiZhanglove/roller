/**
 * Created by ZhangAi on 2017/8/24.
 */
Vue.component('roller',{
    //props:{
    //    prizelist:{
    //        type:Object,
    //        default:function(){
    //
    //        }
    //    }
    //},
    props:['prizelist','rollerdata'],
    template:'<div id="roller">\
        <div class="roller-top">\
            <img src="https://ts.market.mi-img.com/thumbnail/jpeg/q80w768/Finance/02756479e59529fd2ca8d7d41762a3126e9427267">\
            <div class="roulette-box" >\
                <div class="roulette-container" v-for="rowdata in rowsData">\
                    <div class="roulette">\
                        <div class="roulette-inner">\
                            <img v-for="data in rowdata" :data-value="data.id" :data-prize="data.prizeName" :src="data.imgSrc" style="display: block;">\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        <div class="roller-text">您有<strong class="leftChance">0</strong>次抽奖机会，赶快抽奖吧！</div>\
        <div class="rollerBtn" id="start">\
            <img src="https://ts.market.mi-img.com/thumbnail/png/q80/Finance/02756479e59525fd25a8d9d41b62aa12669427267" alt="">\
        </div>\
    </div>',
    data:function(){
        var data = this.rollerdata;
        console.log(this.rollerdata.leftChance)
        return data;
    },
    methods:{
        getRowsData:function(){
            var self = this;
            var rows = self.rows;
            var rowsData = [];
            for(var i=0;i<rows;i++){
                var prizeList = JSON.parse(JSON.stringify(self.props.prizelist));
                var endPrize = prizeList.splice(0,i);
                rowsData[i] = prizeList.concat(endPrize);
            }
            self.rowsData = rowsData;
            console.log(self.rowsData)
        },
    },
    created:function(){
        var self = this;
        self.getRowsData()
    }
})