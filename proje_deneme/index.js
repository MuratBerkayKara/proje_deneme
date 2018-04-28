var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


kullanicilar= [];

var tutucu = 0;
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/cikis.html', function(req, res){
    res.sendFile(__dirname + '/cikis.html');
});

io.on('connection', function(socket){


    socket.on('new user',function (data,callback) {

        if(kullanicilar.indexOf(data) !=-1){
            callback(false);
        }else{
            callback(true);
            var obj = JSON.stringify(data);
            var ayrilmis = JSON.parse(obj);
            socket.kullaniciAdi = ayrilmis.nick;
            socket.ip = ayrilmis.ip;
            socket.durum = ayrilmis.durum;
            kullanicilar.push(ayrilmis);
            //kullanicilar.push(data);
            console.log(kullanicilar);
            //io.emit('usernames',kullanicilar);
                update_kullanicilar();
        }

    });

    function update_kullanicilar() {
        io.emit('usernames',kullanicilar);
    }


    socket.on('tanisma',function (data) {
        io.emit('tanisma_2',data);
        console.log(data);
    });

    socket.on('tanisma_3',function (data) {
        io.emit('tanisma_4',data);
        console.log(data);
    });


    socket.on('send message',function (data) {
        io.emit('new messages',data);
        console.log(data);
    });

    socket.on('disconnect' ,function (data) {
       if(!socket.kullaniciAdi) return;
       //kullanicilar.splice(kullanicilar.indexOf(socket.durum),1);
        for(var i=0;i<kullanicilar.length;i++){
            if(kullanicilar[i].nick == socket.kullaniciAdi){
                kullanicilar[i].durum = 'Offline';
            }
        }

        setInterval(function(){
            update_kullanicilar();
        }, 15000);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});