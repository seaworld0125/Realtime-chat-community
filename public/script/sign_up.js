
// const socket = io();
// import { io } from "socket.io-client";
const socket = io.connect('http://121.127.175.142/', { transports: ['websocket'] });

// make account form area
const username = document.getElementById('username');
const password = document.getElementById('password');
const nickname = document.getElementById('nickname');
const button01 = document.getElementById('button01');
const button02 = document.getElementById('button02');
const createAccountForm = document.getElementById('form-new-account');

// socket.io Event naming
const CHECK_USERNAME = 'check-username';
const CHECK_NICKNAME = 'check-nickname';
const CREATE_ACCOUNT = 'create-account';
const SET_NICKNAME = 'set-nickname';

// account check values
let password_check = false;
let username_check = false;
let nickname_check = false;
let username_length_check = false;
let nickname_length_check = false;

// 소켓연결을 통해 ip 체크 요청
var ip = "";
$.getJSON('https://ipapi.co/json/', function(result){
    ip =  result.ip;
    $.ajax({
        type: "POST",
        url: "/signup/ip",
        data: {"ip" : ip},
        success: (unique) => {
            if(!unique) {
                alert('접속자 ip는 이미 계정이 있습니다');
                location.href = '/';
            }
        }
    });
});

// Real-time Input Value Change Detection
var old_username = "";       
$("#username").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == old_username) {
        return;
    }
    old_username = currentVal;
    let length_ = old_username.length;
    if(length_ == 0){
        $("label[for='username']").text('아이디');
        username_length_check = false;
    }
    else if(length_ < 6 || length_ > 20){
        $("label[for='username']").text('6글자 이상 20글자 이하입니다.');
        username_length_check = false;
    }
    else if(length_ > 5 && length_ < 21){
        $("label[for='username']").text('적당한 길이네요!');
        username_length_check = true;
    }
});      
var old_password = "";      
$("#password").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == old_password) {
        return;
    }
    old_password = currentVal;
    let length_ = old_password.length;
    if(length_ == 0){
        $("label[for='password']").text('비밀번호');
        password_check = false;
    }
    else if(length_ < 6 || length_ > 20){
        $("label[for='password']").text('6글자 이상 20글자 이하입니다.');
        password_check = false;
    }
    else if(length_ > 5 && length_ < 21){
        $("label[for='password']").text('적당한 길이네요!');
        password_check = true;
    }
});
var old_nickname = "";      
$("#nickname").on("propertychange change keyup paste input", function() {
    var currentVal = $(this).val();
    if(currentVal == old_nickname) {
        return;
    }
    old_nickname = currentVal;
    let length_ = old_nickname.length;
    if(length_ == 0){
        $("label[for='nickname']").text('닉네임');
        nickname_length_check = false;
    }
    else if(length_ < 4 || length_ > 10){
        $("label[for='nickname']").text('4글자 이상 10글자 이하입니다.');
        nickname_length_check = false;
    }
    else if(length_ > 3 && length_ < 11){
        $("label[for='nickname']").text('적당한 길이네요!');
        nickname_length_check = true;
    }
});

// check Id unique
button01.addEventListener('click', (e) => {
    e.preventDefault();
    if(username_length_check){
        let username_ = username.value;
        $.ajax({
            type: "GET",
            url: "/signup/id",
            data: {"id" : username_},
            success: (result) => {
                if(result) {
                    alert(username_ + ' 은 사용가능한 ID입니다.');
                    username_check = true;
                }
                else {
                    alert(username_ + '은 이미 존재하는 ID입니다.');
                    username_check = false;
                }
            }
        });   
    }
    else alert('아이디 길이를 다시 확인해주세요');
});

// check Nickname unique
button02.addEventListener('click', (e) => {
    e.preventDefault();
    if(nickname_length_check){
        let nickname_ = nickname.value;
        $.ajax({
            type: "GET",
            url: "/signup/nickname",
            data: {"nickname" : nickname_},
            success: (result) => {
                if(result) {
                    alert(nickname_ + ' 은 사용가능한 별명입니다.');
                    nickname_check = true;
                }
                else {
                    alert(nickname_ + '은 이미 존재하는 별명입니다.');
                    nickname_check = false;
                }
            }
        });  
    }
    else alert('닉네임 길이를 다시 확인해주세요');              
});

// create new account & redirect
createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // check new account
    if(!username_length_check) {alert('아이디 길이를 확인해주세요'); return;}
    if(!password_check) {alert('비밀번호를 확인해주세요'); return;}
    if(!nickname_length_check) {alert('닉네임 길이를 확인해주세요'); return;}
    if(!username_check) {alert('아이디 중복을 확인해주세요'); return;}
    if(!nickname_check) {alert('닉네임 중복을 확인해주세요'); return;}
    
    // get users input
    let username_ = username.value;
    let password_ = password.value;
    let nickname_ = nickname.value;

    // Send Account Information & Redirect to Home Screen
    let account = {"id" : username_, 
                "password" : password_, 
                "nickname" : nickname_, 
                "ip" : ip};
    $.ajax({
        type: "POST",
        url: "/signup",
        data: account,
        success: (result) => {
            if(result) {
                alert('회원가입을 환영합니다!');
                location.href = '/';
            }
            else {
                alert('회원가입 실패 : 서버 에러(' + result + ')');
                location.href = '/';
            }
        }
    });
});
    