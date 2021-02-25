<template>
  <div
    style="max-height: 64vh;overflow: hidden;height: 64vh;overflow-x:hiddex;border-right:1px solid #C3DAE0"
  >
    <el-image src="https://img01.yzcdn.cn/vant/cat.jpeg"></el-image>
    <el-button type="success" @click="editImg(picSrc)">编辑图片</el-button>
    <el-dialog :visible.sync="charRecordImgVisible"  :before-close="closeImg" :fullscreen="true"  :modal="false" custom-class="charRecordImg">
      <canvas id="drawCanvas"></canvas>
      <canvas id="test" style="display:none"></canvas>
      <textarea name="textBox" id="textBox"  contenteditable="true" class="text-style" v-show="clickEdge == 14"></textarea>
      <section id="colorSwatch" v-show="clickEdge == 3 || clickEdge == 4 || clickEdge == 5 || clickEdge == 6 || clickEdge == 14">
        <el-row class="text-center">
          <el-col :span="12" :offset="11">
          <p v-for="(item,color) in colorArray"
           :key="color"
           :style="{background:item.color}"
           class="colorStyle m-l-5"
           :class="colorCheck == item.id ? 'm-t-5' : 'm-t-10'"
           @click="colorMeth(item)"></p>
          </el-col>
        </el-row>
        <input style="display:none" type="radio" name="color" value="gold" id="yellow" checked />
        <label style="display:none" for="yellow"></label>
        <input style="display:none" type="radio" name="color" value="red" id="red" />
        <label style="display:none" for="red"></label>
        <input style="display:none" type="radio" name="color" value="blue" id="blue" />
        <label style="display:none" for="blue"></label>
        <input style="display:none" type="radio" name="color" value="lime" id="lime" />
        <label style="display:none" for="lime"></label>
        <input style="display:none" type="radio" name="color" value="magenta" id="magenta" />
        <label style="display:none" for="magenta"></label>
        <input style="display:none" type="radio" name="color" value="cyan" id="cyan" />
        <label style="display:none" for="cyan"></label>
      </section>
      <el-row class=" el-image-viewer__actions" style="position:fixed;bottom:5%;right:10%;background:white;border:1px solid black;width:550px">
        <el-row class="el-image-viewer__actions__inner" style="width:500px">
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-thumb" @click="sTools" title="标记"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-zoom-out" @click="zoomOut" title="缩小"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-zoom-in" @click="zoomIn" title="放大"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-refresh-right" @click="refreshRight" title="顺时针翻转90°"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-refresh-left" @click="refreshLeft" title="逆时针翻转90°"></i>
          <i v-show="clickEdge != 13" :style="{color:clickEdge == 14 ? 'red' : 'black',border:clickEdge == 14 ? '1px solid black' : ''}" class="iconfont icon-twenbenkuang" @click="edit" title="输入文字"></i>
          <i v-show="clickEdge != 13"  :style="{color:clickEdge == 4 ? 'red' : 'black',border:clickEdge == 4 ? '1px solid black' : ''}" class="el-icon-edit" @click="magicStick" title="画笔"></i>
          <i v-show="clickEdge != 13" :style="{color:clickEdge == 15 ? 'red' : 'black',border:clickEdge == 15 ? '1px solid black' : ''}" class="iconfont icon-masaike" @click="masaike" title="马赛克"></i>
          <i v-show="clickEdge != 13"  :style="{color:clickEdge == 3 ? 'red' : 'black',border:clickEdge == 3 ? '1px solid black' : ''}" class="el-icon-top-right"  @click="topRight" title="箭头"></i>
          <i v-show="clickEdge != 13"  :style="{color:clickEdge == 5 ? 'red' : 'black',border:clickEdge == 5 ? '1px solid black' : ''}" class="iconfont icon-yk_fangkuai" @click="sOpen" title="方块"></i>
          <i v-show="clickEdge != 13"  :style="{color:clickEdge == 6 ? 'red' : 'black',border:clickEdge == 6 ? '1px solid black' : ''}" class="iconfont icon-yuanxing" @click="aim" title="圆形"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-download" @click="download" title="下载到本地"></i>
          <i v-show="clickEdge != 13" style="color:black" class="el-icon-scissors" @click="scissors" title="裁剪"></i>
          <i v-show="clickEdge != 13"  class="el-icon-close" @click="closeImg" title="取消"></i>
          <i v-show="clickEdge != 13"  class="el-icon-check" @click="imgBaseSubmit" title="发送"></i>
          <i v-show="clickEdge == 13" class="el-icon-close" @click="close" title="取消"></i>
          <i v-show="clickEdge == 13" class="el-icon-check" @click="check" title="裁剪"></i>
        </el-row>
      </el-row>
      
    
    </el-dialog>
  </div>
</template>

<script>
// import "../../../../../src/utils/item/jq";
import "..//utils/Ypaint"
// import virtualList from "vue-virtual-scroll-list";
// import VinEditItem from "@/components/opportunity/pages/Chat/VinEditItem";

// import Item from "./Item";
export default {
  name: "ChatRecordItem",
  data() {
    return {
      picSrc:'https://img01.yzcdn.cn/vant/cat.jpeg',
      clickEdge:1,
      editFile:'',
      paint:'',
      colorCheck:1,
      colorArray:[{id:1,color:"yellow"},{id:2,color:"red"},{id:3,color:"blue"},{id:4,color:"lime"},{id:5,color:"magenta"},{id:6,color:"cyan"},],
      vinDialogLoading: false,
      requestChatType:true,  // 是否可以继续请求聊天记录
      menuKey: true,
      // itemComponent: Item,
      debagVisible: false,
      additionalNum: 0, // 追加次数
      deg: 0,
      charRecordImgVisible: false, // 用来控制图片的显示
      dialogCharRecordImg: "",
      // dialogCharRecordImg:'http://192.168.1.8:8080/images/Suffix/20200911/20200911145512090_01576e.jpg?T=e9186239d2337ae5532bd40450c0e9bc',
      chatRecordLoading: false, // 用来控制等待框是否显示
      chatData: [],
      firstLoad: true,
      index:0,
      loadAgain:false,
      subImgLoading:true,
      chatRecordId:'',
      vinVisible:false,
      editVinType: false,
      mark: "",
      radio: "1",
      frontFrame: "", // 前车架号
      rearFrame: "", // 后车架号
      vinMsg: "", // 输入的Vvin码信息
      businessBlockHeight:234,  // 每个商机块的高度
      chartNum:1
    };
  },
  created() {
    this.chartRecScrollarBar();
  },
  methods: {
    // 买塞克
    masaike(){
      this.clickEdge = 15
      this.paint.masaiked()
    },
    // 写文字
    edit(){
      this.clickEdge = 14
      this.paint.edit()

    },
    // 关闭裁剪图片功能
    close(){
      var cropContainer = document.getElementById("cropContainer");
      cropContainer.parentNode.removeChild(cropContainer);
      this.clickEdge = 1
    },
    // 裁剪完成的图片
    check(){
      this.clickEdge = 1
      this.paint.check()
      // this.clickEdge = 1

    },
    // 裁剪图片
    scissors(){
      this.clickEdge = 13
      this.paint.scissors()

    },
    sTools(){
      this.clickEdge = 12
      this.debagVisible = true
    },
    // 放大图片
    zoomIn(){
      
      this.clickEdge = 2
      this.paint.zoomIn()
    },
    // 缩小图片
    zoomOut(){
      this.clickEdge = 1
      this.paint.zoomOut()
    },
    // 下载图片到本地
    download(){
      this.clickEdge = 9
      const el = document.createElement('a');
      el.href = document.getElementById("drawCanvas").toDataURL();
      el.download = 'canvas';
      const event = new MouseEvent('click');
      el.dispatchEvent(event);
    },
    // 顺时针选择canvas
    refreshRight(){
      this.clickEdge = 7
      this.paint.refreshRight()
    },
    refreshLeft(){
      this.clickEdge = 8
     this.paint.refreshLeft()
    },
    // 给canvas画马赛克
    sOpen(){
      this.clickEdge = 5
      this.paint.chooseRect()
    },
    aim(){
      this.clickEdge = 6
      this.paint.chooseCircle()
    },
    // 给canvas画箭头
    topRight(){
      this.clickEdge = 3
      this.paint.chooseArrow()
    },
    // 给canvas画线条
    magicStick(){
      this.clickEdge = 4
      this.paint.chooseLine()
    },
    // 更换颜色标记
    colorMeth(item){
      this.paint.outerParams.rect.color = item.color;
      this.paint.outerParams.circle.color = item.color;
      this.paint.outerParams.line.color = item.color;
      this.paint.outerParams.arrow.color = item.color;
      this.colorCheck = item.id
      // this.colorArray.forEach(pojo => {
      //   document.getElementById(pojo.color).checked = false
      // })
      // document.getElementById(item.color).checked = true
    },
    // 修改等待框状态
    edidVinDialogLoading(val) {
      this.vinDialogLoading = val;
    },
    vinVisibleClose() {
      this.vinVisible = false;
      // this.debagVisible = true;
    },
    virtualMeth(e) {
      if(this.$refs.virtualList.$el.scrollTop > 10) return false  // 如果滚动条距离顶部大于10  返回
      if(this.chatRecordBusiness.length >= this.businessTotal) return false  // 如果现有的商机总数大于等于后端返回的商机总数 返回
      if(!this.continueRequestType || !this.requestChatType) return false  // 如果上个请求还没有完成  返回
      if(this.$refs.virtualList.$el.scrollTop <= 10){
        this.chatRecordLoading = true
        this.requestChatType = false
        this.$emit("businessGroup")
        setTimeout(() => {
          this.requestChatType = true
          this.chatRecordLoading = false
        }, 300);
      }
    },
    // 用来监听滚动条
    ChatRecordScrollbar() {
      return;
      let chatScroll = this.$refs.chatRecScrollBarRef.wrap;
      chatScroll.onscroll = e => {
        let i = parseInt(e.target.scrollTop);
      };
    },
    // 关闭标记对话框
    closeBadgeDialog() {
      this.debagVisible = false;
    },
    // 追加标签
    additional(imgUrl, entity,index,e) {

      this.chatRecordId = entity.id;
      let _that = this;
        _that.editImg(imgUrl);
    },
    // 发送图片
    imgBaseSubmit() {
      this.clickEdge = 11
      if(!this.subImgLoading) return false
      this.subImgLoading = false
      // base64  传给后台
      const imgFile = document.getElementById("drawCanvas").toDataURL();
      let data = {
        base64File: imgFile,
        mark: 5,
        sendAccount: this.$store.state.getUserId()
      };
      this.Api.business.fromBase64ToImage(data).then(res => {
        if (res.code === 200) {
          setTimeout(() => {
            this.subImgLoading = true
          }, 600);
          this.closeImg(); // 关闭图片编辑对话框
          this.$store.commit("Business/editReplyPicture"); 
          this.$store.commit("Business/editReplyPictureUrl", res.data.path); // 将图片地址存放到vuex中.
        }
      });
    },
    // 编辑图片
    editImg(file) {
      if(file == null || file == undefined || file == '') return false
      this.editFile = file
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      const imageUrl = file;
      image.onload = () => {
        var cancas = document.createElement("canvas");
        cancas.width = image.width;
        cancas.height = image.height;
        var context = cancas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var quality = 0.8;
        const dataurl = cancas.toDataURL("image/png", quality);
        this.charRecordImgVisible = true;
        var isActive = false;
        var canvas = document.getElementById("drawCanvas");
        var ax , ay, r = 30
        if (canvas == null) {
          this.editImg(file);
          return false;
        }
        var ctx = canvas.getContext("2d");
        // console.log(document.documentElement.clientHeight);
        
        if (window.matchMedia("(min-width: 420px)").matches) {
          canvas.width = image.width;
          canvas.height = image.height;
        } else {
          canvas.width = 300;
          canvas.height = 300;
        }
        let pingH = (document.documentElement.clientHeight - 200)
        if(pingH > canvas.height){
          document.getElementById("drawCanvas").style.marginTop = 0
          // console.log(pingH - canvas.height);
          document.getElementById("drawCanvas").style.marginTop = ((pingH - canvas.height) / 2) + 'px'
        }
        ctx.lineWidth = "3";
        var img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, 0);
        };
        if (window.matchMedia("(min-width: 420px)").matches) {
          img.src = dataurl;
        } else {
          img.src = dataurl;
        }

      document.getElementById("drawCanvas").style.backgroundImage = "url('"+imageUrl+"')";
      this.paint = Ypaint(document.getElementById("drawCanvas"),)
      this.paint.YpaintFile  = this.editFile;
      document.getElementById("drawCanvas").style.transform = 'rotate(' + 0 + 'deg)'

      this.paint.outerParams.rect.lineWidth = 2;
      this.paint.outerParams.rect.radius = 2;
      this.paint.outerParams.rect.color =' yellow';

      this.paint.outerParams.circle.lineWidth = 2;
      this.paint.outerParams.circle.color = 'yellow';

      this.paint.outerParams.line.lineWidth = 2;	
      this.paint.outerParams.line.color = 'yellow';

      this.paint.outerParams.arrow.range = 10;
      this.paint.outerParams.arrow.color = 'yellow';
      this.zoomIn()
      };
      image.src = imageUrl;

      
    },

    // 查看大图
    chatRecordImg(item) {
      this.dialogCharRecordImg = item.sendContent;
      this.charRecordImgVisible = true;
    },
    closeImg() {
      this.clickEdge = 10
      this.charRecordImgVisible = false;
    },
    // 查看原文
    lookOriginal(item) {
      this.$emit("lookOriginal", item);
    },
    chartRecScrollarBar(e) {
      this.$nextTick(() => {
        let top = 0;
        top = this.showBusinessId * this.businessBlockHeight;
        if(this.$refs.virtualList == undefined) return false
        this.$refs.virtualList.$el.scrollTop = top;
      });
    },
  },
};
</script>

<style scoped>
/* @import './font_sfvnjmbnbe/iconfont.css'; */
#textBox :focus{
  border: 1px solid yellow;
  background: white;
}
#textBox{
  /* width: 100px; */
            min-height: 20px;
            /* max-height: 70px;s */
            outline: 0;
            border: 1px solid #397EFF;
            font-size: 28px;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-user-modify: read-write-plaintext-only;
}
[contentEditable=true]:empty:not(:focus):before {
          content: attr(data-text);
      }
.text-style {
			float: left;
			position: absolute;
			font: 28px orbitron;
			word-break: break-all;
			background-color: transparent;
			resize: none;
			z-index: 1;
		}
#colorSwatch{
  position: fixed;
  left: 40%;
  top: 85%;
  width: 300px;
}
.el-image-viewer__actions{
  width: 400px;
}
.el-icon-check{
  font-size: 26px;
  color: green;
}
.el-icon-close{
  color: red;
}
#chart{
  height:100%;
  overflow:auto 
}
.colorStyle{
  width:20px;
  height:20px;
  float:left;
  cursor: pointer;
}
.debgeStyle {
  text-align: center;
  border-bottom: 1px solid #eeeeee;
  cursor: pointer;
}
.debgeStyle:hover {
  color: red;
}
.el-dialog__header {
  background-color: #ecf5ff;
}
.picture_contaner {
  height: 600px;
  width: 600px;
}
.img_box {
  width: 100%;
  height: 100%;
  position: relative;
}
.picture_contaner .img_box img {
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.wrapper {
  white-space: pre-wrap;
}
.lookMore:hover {
  cursor: pointer;
  color: blue;
}
.chatShowif:hover {
  cursor: pointer;
  color: blue;
}
.el-scrollbar__wrap {
  overflow: hidden;
}
.BadgeStyle >>> .is-fixed {
  /**此处css修改的是商机处理右上角未读显示 */
  right: 22px !important;
}
</style>
