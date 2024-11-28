const firebaseConfig = {
    apiKey: "AIzaSyBUJ888L66wYbN8FE1CDIaHhC11tKm-Lds",
    authDomain: "legitdevgroup093029032090902.firebaseapp.com",
    databaseURL: "https://legitdevgroup093029032090902-default-rtdb.firebaseio.com",
    projectId: "legitdevgroup093029032090902",
    storageBucket: "legitdevgroup093029032090902.appspot.com",
    messagingSenderId: "172353240360",
    appId: "1:172353240360:web:4aac8eca167cb8d2db641d"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const loginEmailInput = document.getElementById('email');
const loginPasswordInput = document.getElementById('password');
const loginError = document.getElementById('signupError');
const loadinn = document.getElementById('loadinn');

document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (
        loginEmailInput.value.trim() !== '' &&
        loginPasswordInput.value.trim() !== ''
    ) {
        console.log('All required fields have been filled. Proceed with the form submission.');
        loadinn.style.display = 'flex'
        login();
    } else {
        console.log('All required fields must be filled. return.');
    }
});


loadinn.style.display = 'none'

function login() {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid;

            // Update user status
            const userStatData = {
                stat: 'on',
                lseendate: new Date().toLocaleDateString(),
                lsTime: new Date().toLocaleTimeString()
            };

            database.ref('userStats/' + userId).set(userStatData)
                .then(() => {
                    // Login successful, redirect to index.html or perform any other actions
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    loadinn.style.display = 'none'
                    console.log(error.message);
                    document.getElementById('signupError').style.display = 'flex';
                    loginError.textContent = error.message;
                });
        })
        .catch((error) => {
            loadinn.style.display = 'none'
            console.log(error.message);
            document.getElementById('signupError').style.display = 'flex';
            loginError.textContent = error.message;
        });
}