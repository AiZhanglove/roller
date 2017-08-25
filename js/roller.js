/**
 * Created by ZhangAi on 2017/8/24.
 */
Vue.component('roller',{
    props:['prizelist','rollerdata'],
    template:'<div id="roller">\
        <div class="roller-top">\
            <img :src="rollerBg">\
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
        <div class="roller-text">{{rollerPreText}}<strong class="leftChance" v-html="leftChance">0</strong>{{rollerNextText}}</div>\
        <div class="rollerBtn" id="start" @click="btnClick">\
            <img :src="btnBg" alt="">\
        </div>\
    </div>',
    data:function(){
        var data = this.rollerdata;
        data.cfg = {};
        data.prizeThumb = [];
        var prizelist = this.prizelist;
        var prizeThumb = [];
        for(var i=0,j=prizelist.length;i<j;i++){
            var i0=i,
                i1=i-1,
                i2=i-2;
            if(i==0){
                i1 =j-1;
                i2 =j-2;
            }
            if(i==1){
                i2 =j-1;
            }
            prizeThumb[i] = [i0,i1,i2]
        }
        data.prizeThumb = prizeThumb;
        return data;
    },
    methods:{
        getRowsData:function(){
            var self = this;
            var rows = self.rows;
            var rowsData = [];
            for(var i=0;i<rows;i++){
                var prizeList = JSON.parse(JSON.stringify(self.prizelist));
                var endPrize = prizeList.splice(0,i);
                rowsData[i] = prizeList.concat(endPrize);
            }
            self.rowsData = rowsData;
        },
        btnClick:function(){
            var self = this;
            if(!self.cfg.flag)return;
            self.$emit('rollerclick',function(code){
                var index = self.getIndex(code);
                self.start(index)
            })
        },
        start:function(index){
            //开始游戏
            var self = this;
            var rs = self.cfg.rs;
            for(var i=0;i<rs.length;i++){
                rs[i]['stopImageNumber'] = self.prizeThumb[index][i];
            }
            rs[rs.length-1].stopCallback = function(){
                setTimeout(function(){
                    self.stopCallback(index)
                },500)

            }
            self.startRoulette();
        },
        //滚动结束后回调
        stopCallback:function(index){
             //alert('stop')
            this.$emit('rollercb',index)
            this.cfg.flag = true;
        },
        //老虎机配置项
        setCfg:function(){
            var self = this;
            var cfg = self.cfg;
            cfg.flag = true;
            cfg.p = {};
            cfg.rs=[];
            cfg.eles=[];
            for(var i=0;i<self.rows;i++){
                cfg.eles[i] = $('div.roulette').eq(i);
                cfg.eles[i].roulette(cfg.p);
                cfg.rs[i] = {};
                cfg.rs[i]['speed']=self.rows;
            }
            self.cfg = cfg;
        },
        //滚动老虎机
        startRoulette:function(){
            var self = this;
            var cfg =this.cfg;
            cfg.flag = false;
            for(var i=0;i<cfg.eles.length;i++){
                cfg.eles[i].roulette('option',cfg.rs[i])
                cfg.eles[i].roulette('start')
            }
        },
        //获取奖品位置
        getIndex:function(code,list,attr){
            var self = this;
            var attr = attr || 'prizeCode';
            var list = list || self.prizelist;
            for(var i= 0;i<list.length;i++){
                if(list[i][attr] == code){
                    return i;
                }
            }
            return -1;
        }
    },
    created:function(){
        this.getRowsData();
    },
    mounted:function(){
        this.setCfg();
    }
})