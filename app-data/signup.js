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
const signupImageInput = document.getElementById('userImage');
const signupFirstNameInput = document.getElementById('username');
const signupOWHubTagInput = document.getElementById('tagname');
const signupEmailInput = document.getElementById('email');
const signupPasswordInput = document.getElementById('password');
const signupError = document.getElementById('signupError');
const loadinn = document.getElementById('loadinn');
loadinn.style.display = 'none'

document.getElementById('signMeUp').addEventListener('click', (e) => {
    e.preventDefault();
    if (
        signupImageInput.value.trim() !== '' &&
        signupFirstNameInput.value.trim() !== '' &&
        signupEmailInput.value.trim() !== '' &&
        signupOWHubTagInput.value.trim() !== '' &&
        signupPasswordInput.value.trim() !== ''
    ) {
        console.log('All required fields have been filled. Proceed with the form submission.');
        signUp();
    } else {
        event.preventDefault();
        console.log('Please fill in all the required fields.');
    }
});

function signUp() {
    // loadinn.style.display = 'flex'
    const email = signupEmailInput.value;
    const password = signupPasswordInput.value;
    const name = signupFirstNameInput.value;
    const tag = signupOWHubTagInput.value;

    // Check if the tag already exists
    database.ref('userAuths').orderByChild('tag').equalTo(tag).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Tag already exists, display error and return
                console.log('Tag already exists');
                document.getElementById('signupError').style.display = 'flex';
                signupError.textContent = 'Tag already exists';
                loadinn.style.display = 'none'
                return;
            }

            // Tag doesn't exist, proceed with user creation
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const userId = user.uid;

                    // Send email verification
                    user.sendEmailVerification()
                        .then(() => {
                            console.log('Verification email sent');
                            // Proceed with the rest of the user creation process
                            const imageFile = signupImageInput.files[0];
                            const storageRef = firebase.storage().ref(`user-images/${userId}`);
                            const imageTask = storageRef.put(imageFile);

                            imageTask.then(() => {
                                    storageRef.getDownloadURL()
                                        .then((imageUrl) => {
                                            const userData = {
                                                image: imageUrl,
                                                name: name,
                                                tag: tag,
                                                email: email,
                                                date: new Date().toLocaleString()
                                            };

                                            database.ref('userAuths/' + userId).set(userData)
                                                .then(() => {
                                                    const userStatData = {
                                                        stat: 'on',
                                                        lseendate: new Date().toLocaleDateString(),
                                                        lsTime: new Date().toLocaleTimeString()
                                                    };

                                                    database.ref('userStats/' + userId).set(userStatData)
                                                        .then(() => {
                                                            window.location.href = 'link.html';
                                                        })
                                                        .catch((error) => {
                                                            loadinn.style.display = 'none'
                                                            console.log(error.message);
                                                            document.getElementById('signupError').style.display = 'flex';
                                                            signupError.textContent = error.message;
                                                            loadinn.style.display = 'none'
                                                        });
                                                })
                                                .catch((error) => {
                                                    loadinn.style.display = 'none'
                                                    console.log(error.message);
                                                    document.getElementById('signupError').style.display = 'flex';
                                                    signupError.textContent = error.message;
                                                    loadinn.style.display = 'none'
                                                });
                                        })
                                        .catch((error) => {
                                            loadinn.style.display = 'none'
                                            console.log(error.message);
                                            document.getElementById('signupError').style.display = 'block';
                                            signupError.textContent = error.message;
                                            loadinn.style.display = 'none'
                                        });
                                })
                                .catch((error) => {
                                    loadinn.style.display = 'none'
                                    console.log(error.message);
                                    document.getElementById('signupError').style.display = 'block';
                                    signupError.textContent = error.message;
                                    loadinn.style.display = 'none'
                                });
                        })
                        .catch((error) => {
                            loadinn.style.display = 'none'
                            console.log(error.message);
                            document.getElementById('signupError').style.display = 'block';
                            signupError.textContent = error.message;
                            loadinn.style.display = 'none'
                        });
                })
                .catch((error) => {
                    loadinn.style.display = 'none'
                    console.log(error.message);
                    document.getElementById('signupError').style.display = 'block';
                    signupError.textContent = error.message;
                    loadinn.style.display = 'none'
                });
        })
        .catch((error) => {
            console.log(error.message);
            // Handle error checking if tag exists
        });
}