export default {
    props: ['msg', 'socketid'],

    template: 
    `
    <div class="box " :class="[matchedID?'fr':'fl']">
    <article class="new-message">
        <div class="name">{{msg.username}}</div>
        <div class="desc">
            {{msg.message}}
            <span class="fr time">Time：{{msg.time}}</span>
        </div> 
    </article>
    </div>
    `,


    data: function() {
        return {
            matchedID: this.socketid == this.msg.id
        }
    },
    created: function () {
        console.log('socketid:'+this.socketid)
        console.log('id：'+this.msg.id)
    }

}
/*    <article class="new-message" :class="{ 'my-message' : matchedID }">
        <h1>This is a message</h1>
        <h4>{{msg.message.name}} says:</h4>
        <p>{{msg.message.content}}
    </article> */ 