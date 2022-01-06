var socket = io({ autoConnect: false });

$(function() {
    const username = localStorage.getItem('username')
    if (username) {
        socket.auth = { username }
        socket.connect()

        $('#spanUsername').text(username)
        $('#loginContainer').hide()
        $('#containerChat').show()
        $('button.change-username').show()
    }
})

$(document).on('click', 'button.change-username', changeUsername)

function changeUsername() {
    localStorage.removeItem('username')
    socket.disconnect()
    $('#loginContainer').show()
    $('#containerChat').hide()
    $('button.change-username').hide()
}

$(document).on('click', 'button.join', validate)

function validate() {
    let username = document.getElementById('username').value
    if (username.trim() == '') {
        alert('Username tidak boleh kosong')
        return false
    }

    socket.auth = { username }
    socket.connect();
    localStorage.setItem('username', username)
    $('#spanUsername').text(username)
    $('#loginContainer').hide()
    $('#containerChat').show()
    $('button.change-username').show()
}

socket.on('connect_error', (err) => {
    if (err.message === 'Invalid username') {
        document.getElementById('username').value = ''
        alert('Username telah digunakan')
    }
})

socket.on('session', ({sessionID, userID}) => {
    socket.auth = { sessionID }
    localStorage.setItem('sessionID', sessionID)
    socket.userID = userID
})

$(document).on('click', '#btnHit', function() {
    let name = $('#spanUsername').text()
    socket.emit('leaderboard', name);
    socket.emit('chat message', `Hit by ${name}`);
    canHit = false
    $('#btnHit').remove()
})

socket.on('admin command', function(data) {
    if (data == 'release') {
        addButton()
    }
    if (data == 'not-release') {
        $('#btnHit').remove()
    }
});

function addButton() {
    let btnElement = document.getElementById("btnHit")
    if(document.body.contains(btnElement)) {
        return
    } else{
        let btn = '<button type="button" class="btn btn-primary btn-lg rounded-circle" id="btnHit">Hit me!</button>'
        $('#divButton').append(btn)
    }
}

socket.on('chat message', function(data) {
    $('#messages').append($('<li>').text(data));
    let messageWindow = document.getElementById('divMessage')
    messageWindow.scrollTo(0, messageWindow.scrollHeight);
});
socket.on('leaderboard', function(data) {
    $('#listUrutan').empty()
    if (data.length > 0) {
        data.forEach(element => {
            $('#listUrutan').append($('<li>').text(element));
        });
    } 
});

socket.on('update content', function(data) {
    $('#judulGame').text(data.content)
});