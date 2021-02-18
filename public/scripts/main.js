import ChatMessage from "./components/TheMessageComponent.js"


(() => {
    /* 获取地址栏参数：没有输入则当作用户名 */
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    function time() {
        var now = new Date;
        var h = now.getHours();
        var mm = now.getMinutes();
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        var str;
        if(h>12) {
            h -= 12;
            str = " PM";
        }else{
            str = " AM";
        }
        return h + ':' + mm + str;
    };
    console.log(new Date());
    const socket = io();
    /* 客户端发送自定义事件给服务器端 */
    socket.emit('broadcastEventClient', 'take care');
    //显示服务器端发送的send推送的消息内容
    socket.on('connected', setUserId)
    /* 在线人数 */
    function numbers(data) {
        console.log( data.number)
        vm.number = data.number;
    }
    // pass in data from ChatMessage.js props
    function appendNewMessage(msg) {
        // take the incoming message and push it into the Vue instance
        // into the messages array
        console.log(msg)
        vm.list.push(msg);
    }

    function setUserId({sID,}) {
        console.log('sID:'+sID)
        // debugger;
        // testing in multiple browsers, you will have different IDs
        // pass in sID into vue socketID
        vm.socketID = sID;
        console.log(sID, '(you) joined');
    }
    /* 客户端接收服务器端响应的消息 */
    socket.on('message', (data) => {
        console.log(data);
        // debugger;
        console.log('发送消息后服务器返回数据')
        vm.list.push({id: data.id, username: data.username, name: data.name, message: data.message,time: data.time });
        var scrollTarget = document.querySelector('.mainbox');
        scrollTarget.scrollTop=scrollTarget.scrollHeight;
    });
    
    socket.on('number', (data) => {
        console.log(data)
        vm.number = vm.number;
    })
    const vm = new Vue({
        data: {
            list: [],
            message:"",
            username: "",
            name:"",
            socketID: "",
            number:"",/* number */
        },
        created: function () {
        },
        methods: {
            dispatchMessage() {
                console.log('提交表单信息')
                if (this.message == '') {
                    alert('Please enter a message')
                } else {
                /* 客户端发送自定义事件给服务器端 */
                    socket.emit('chat_message', {id:this.socketID,message: this.message,name:GetQueryString("username"), username: this.username==''?GetQueryString("username"):this.username,time:time()  })
                    this.message = "";
                    this.username = "";
                    setTimeout(function () {
                        var scrollTarget = document.querySelector('.mainbox');
                        // scrollTarget.scrollTop = scrollTarget.scrollHeight;
                        scrollTarget.scrollTo(0,scrollTarget.scrollHeight)
                    },200)
                }

            }  

        },
        
        components: {
            newmessage: ChatMessage
        }
    }).$mount("#app");
    socket.addEventListener('new_message', appendNewMessage);
    socket.addEventListener('number', numbers)
})();