let user = [];

function Adduser(a, b, io, socket){
    const verif = user.findIndex(x => x.pseudo === a);
    if(verif == -1){
        user.push({pseudo: a, id: b})
        io.to(b).emit("receive_pseudo", {message : "user ajouter"})
        io.emit("receive_online", {message: user.length})
    }else{
        io.to(b).emit("receive_pseudo", {message : "user déjà existant"})
    }
}

function GetUser(a ,b , io){
    const destinataire = user.findIndex(x => x.pseudo === a);
    if(destinataire == -1){
        io.to(b).emit("receive_getpseudo", {message : "user introuvable"})
    }else{
        if(user[destinataire].id == b){
            io.to(b).emit("receive_getpseudo", {message : "it's you !"})
        }else{
            io.to(b).emit("receive_getpseudo", {message : "user trouvé"})
        }
        
    }    
}

function sendMes(a, b , c, io){
    const destinataire = user.findIndex(x => x.pseudo === a);
    if(destinataire == -1){
        io.to(b).emit("receive_getpseudo", {message : "user introuvable"})
    }else{
        if(user[destinataire].id == b){
            io.to(b).emit("receive_getpseudo", {message : "it's you !"})
        }else{
            io.to(user[destinataire].id).emit("receive_message", {message : c})
        }
        
    }
}

function connect(io){
    console.log("user connected")
    io.emit("receive_online", {message: user.length})
}

function deconnect(socket, io){
    
    const isconnect = user.findIndex(x => x.id === socket.id);
    if(isconnect !== -1){
        user.splice(isconnect, 1);
        io.emit("receive_online", {message: user.length})
    }
}

module.exports = {Adduser,GetUser, sendMes, connect,deconnect};