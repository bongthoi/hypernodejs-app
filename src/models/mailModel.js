class Mail{
    constructor(from,to,subject,content){
        this.$class="Mail";
        this.from=from;
        this.to=to;
        this.subject=subject;
        this.content=content;
    }
}

module.exports=Mail;