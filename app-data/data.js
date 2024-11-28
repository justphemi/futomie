
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
    const logoutButton = document.getElementById('yesLog');
    const userImageElement = document.getElementById('myUserImg');
    const userNameElement = document.getElementById('myUserName');
    const userImageElement2 = document.getElementById('myUserImg2');
    const userNameElement2 = document.getElementById('myUserName2');
    const userEmailElement = document.getElementById('myUserEmail');
    const userTagElement = document.getElementById('myUserTag');
    const findTagBtn = document.getElementById('find')
    const restls = document.getElementById('reslts')
    const startElement = document.querySelector('.start');
    const chatBox = document.getElementById('chatCont')
    const chatBoxx = document.getElementById('chatBoxx')
    const inputCont = document.getElementById('inputContainer')
    const msgInput = document.getElementById('msgInput')
    const sendMsg = document.getElementById('sendMSG') 
    const noUser = document.getElementById('nobody')
    const addNewUserPage = document.getElementById('newFriend')
    const profilePage = document.getElementById('profilep')
    const lists = document.getElementById('theLists')
    const mainHead = document.getElementById('headerr')
    const headLeft = document.getElementById('headLeft')
    const headRight = document.getElementById('headRight')
    const nav = document.getElementById('navgtion')
    const trunk = document.getElementById('trunk')
    const navImg = document.getElementById('navImg')
    const navName = document.getElementById('navName')
    const goBack = document.getElementById('goBack')
    const showAddNewPage2 = document.getElementById('addNewF')
    const addNewPage2 = document.getElementById('newFriend')
    const inn = document.getElementById('in')
    const loadinn = document.getElementById('loadinn')
    const theStart = document.getElementById('theStrt')
    const noonetxt = document.getElementById('noonetxt')
    const theresNo = document.getElementById('theresNoUser')
    const thelists = document.getElementById('thelists')
    const searchInput = document.getElementById('searchMyBuddies');
    const userChats = document.getElementsByClassName('user-item');
  
    var myUid = sessionStorage.getItem('myId');
  
    startElement.onclick = function(){
      startNew()
    }  
    var displayedUsers = {};
  
  
    sendMsg.addEventListener('click', (e) => {
      e.preventDefault()
      var activeId = sessionStorage.getItem('activeUser')  
      var msgcontent = msgInput.value
      if(msgcontent !== ''){
      sendTextMessage(activeId)
    }else{
      console.log('empty')
    }
    })
  
    findTagBtn.addEventListener('click', (e)=>{
      e.preventDefault()
      searchNewUserTag()
    })
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
    
        // Retrieve user information from the database
        database.ref('userAuths/' + userId).once('value')
          .then((snapshot) => {
            const userData = snapshot.val();
    
            // Display user information on the page
            if (userData) {
              userImageElement.src = userData.image;
              userNameElement.textContent = userData.name;
              userImageElement2.src = userData.image;
              userNameElement2.textContent = userData.name;
              userEmailElement.textContent = userData.email;
              userTagElement.textContent = `@${userData.tag}`;
              sessionStorage.setItem('myName', userData.name)
              sessionStorage.setItem('myImg', userData.image)
              sessionStorage.setItem('myId', userId)
              displayList();
              firebase.database().ref("userChats").child(myUid).on("child_added", displayList);
              loadinn.style.display = 'none'
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
      }
    });
    
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  
    searchInput.addEventListener('input', function() {
    var searchValue = searchInput.value.toLowerCase();
    Array.from(userChats).forEach(function(userChat) {
      const userChatName = userChat.querySelector('.user-nm').textContent.toLowerCase();
      if (searchValue !== '' && !userChatName.includes(searchValue)) {
        userChat.style.display = 'none'; 
      } else {
        userChat.style.display = 'flex';
      }
    });
    });
  
  
    
    function logout() {
      const user = firebase.auth().currentUser;
    
      const userStatData = {
        stat: 'off',
        lseendate: new Date().toLocaleDateString(),
        lsTime: new Date().toLocaleTimeString()
      };
    
      database.ref('userStats/' + user.uid).set(userStatData)
        .then(() => {
          firebase.auth().signOut()
            .then(() => {
              window.location.href = 'login.html';
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    
    function genChatKey(){
      var chars = 'RSTeafIJKLMNQghOPopqDEFGHYZrstuvwxijklmnyzAUVWXbcdBC'
      var key = ''
      for (var i = 0; i < 24; i++){
        var randomIndex = Math.floor(Math.random() * 11)
        key += chars[randomIndex]
      }
      return key;
    }
    
  function searchNewUserTag() {
    const buddyTag = document.getElementById('searchBuddyTag').value;
    const getMyId = sessionStorage.getItem('myId');
  
    database.ref('userAuths').orderByChild('tag').equalTo(buddyTag).once('value')
      .then((snapshot) => {
        const user = snapshot.val();
        if (user) {
          // User found
          var foundUserId = Object.keys(user)[0];
          var foundUserData = user[foundUserId];
          var foundUserName = foundUserData.name;
          var foundUserProImage = foundUserData.image;
          if(foundUserId === getMyId){
            const foundTagFriendImage = document.getElementById('displayFoundImg');
            const foundTagFriendName = document.getElementById('nm');
            foundTagFriendImage.src = '';
            foundTagFriendName.style.marginTop = '2px';
            theStart.style.display = 'none'
            noonetxt.style.display = 'flex'
            theresNo.textContent = 'Oops! This is your tag';
            foundTagFriendImage.style.display = 'none';
            foundTagFriendName.style.display = 'flex';
            restls.style.display = 'flex' 
            startElement.classList.add('disabled');
            return
          }
  
          // Check if the user is already in the chat list
          firebase.database().ref('userChats').child(getMyId).orderByChild('userId').equalTo(foundUserId).once('value')
            .then((chatSnapshot) => {
              if (chatSnapshot.exists()) {
                // User is already in the chat list
                const foundTagFriendImage = document.getElementById('displayFoundImg');
                const foundTagFriendName = document.getElementById('nm');
                foundTagFriendImage.src = '';
                foundTagFriendName.style.marginTop = '2px';
                theStart.style.display = 'none'
                noonetxt.style.display = 'flex'
                theresNo.textContent = 'User is in your chat list';
                foundTagFriendImage.style.display = 'none';
                foundTagFriendName.style.display = 'flex';
                restls.style.display = 'flex' 
                startElement.classList.add('disabled');
              } else {
                // User is not in the chat list, proceed with displaying user info
                const ourKey = genChatKey();
                // Display user info
                const foundTagFriendImage = document.getElementById('displayFoundImg');
                const foundTagFriendName = document.getElementById('nm');
                foundTagFriendImage.src = foundUserProImage;
                theStart.style.display = 'flex'
                noonetxt.style.display = 'none'
                foundTagFriendName.textContent = foundUserName;
                foundTagFriendImage.style.display = 'flex';
                restls.style.display = 'flex';  
                startElement.id = `${ourKey}`;
                sessionStorage.setItem('ourKey', ourKey);
                sessionStorage.setItem('friendName', foundUserName);
                sessionStorage.setItem('friendImg', foundUserProImage);
                sessionStorage.setItem('friendId', foundUserId);
                // ...
              }
            })
            .catch((error) => {
              console.log(error.message);
            });
        } else {
          // User not found
          const foundTagFriendImage = document.getElementById('displayFoundImg');
          const foundTagFriendName = document.getElementById('nm');
          foundTagFriendImage.src = '';
          foundTagFriendName.style.marginTop = '2px';
          theresNo.textContent = 'No user found';
          foundTagFriendImage.style.display = 'none';
          foundTagFriendName.style.display = 'flex';
          theStart.style.display = 'none'
          noonetxt.style.display = 'flex'
          restls.style.display = 'flex';
          startElement.classList.add('disabled');
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  
  function startNew(){
    var ourKey = sessionStorage.getItem('ourKey')
    var friendName = sessionStorage.getItem('friendName')
    var friendImg = sessionStorage.getItem('friendImg')
    var friendId = sessionStorage.getItem('friendId')
    addToChatList(ourKey, friendName, friendImg, friendId)  
  }
  
  function addToChatList(ourKey, friendName, friendImg, friendId) {
    var dbChatList = firebase.database().ref('userChats');
    var getMyId = sessionStorage.getItem('myId');
    var myName = sessionStorage.getItem('myName');
    var myImg = sessionStorage.getItem('myImg');
  
    // Create a new chat entry
    var newChatEntry = {
      userId : friendId,
      userName: friendName,
      userImg: friendImg,
      chatKey: ourKey
    }; 
    var userChatEntry = {
      userId : getMyId,
      userName: myName,
      userImg: myImg,
      chatKey: ourKey
    } 
  
    // Save the new chat entry to the chat list
    dbChatList.child(getMyId).child(friendId).set(newChatEntry)
      .then(function() { 
        dbChatList.child(friendId).child(getMyId).set(userChatEntry)
        .then(function() {
          const buddyTag = document.getElementById('searchBuddyTag').value;
          buddyTag.value === ''
          const foundTagFriendImage = document.getElementById('displayFoundImg');
          const foundTagFriendName = document.getElementById('nm');
          foundTagFriendImage.src = '';
          foundTagFriendName.style.marginTop = '2px';
          theStart.style.display = 'none'
          noonetxt.style.display = 'flex'
          theresNo.textContent = 'User is in your chat list';
          foundTagFriendImage.style.display = 'none';
          foundTagFriendName.style.display = 'flex';
          restls.style.display = 'flex' 
          startElement.classList.add('disabled');
          addNewUserPage.style.display = 'none'
        })
        .catch(function(error) {
          console.error('Error user adding you to the chat list:', error);
        });
      })
      .catch(function(error) {
        console.error('Error adding user to the chat list:', error);
      });
  }
  
  function displayList() {
    var dbChatList = firebase.database().ref('userChats');
    var getMyId = sessionStorage.getItem('myId');
    var chatListContainer = document.getElementById('lists');
  
    // Clear the chat list container
    chatListContainer.innerHTML = '';
  
    dbChatList.child(getMyId).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var chatEntry = childSnapshot.val();
          var userName = chatEntry.userName;
          var userImg = chatEntry.userImg;
          var userId = chatEntry.userId;
          var chatKey = chatEntry.chatKey;
  
          // Check if the user has already been displayed
          if (!displayedUsers[userId]) {
            // Create the chat list item HTML
            var myChatListItem = `
              <div class="user-item" id=${chatKey} onclick="showOurChat('${chatKey}','${userImg}','${userName}','${userId}')">
                <div class="user-img"><img src="${userImg}" alt=""></div>
                <div class="user-name">
                  <label class="user-nm">${userName}</label>
                  <label class="user-lm"></label>
                </div>
                <div class="user-time-noti">
                  <label for="">just now</label>
                  <div class="div-noti" style="display: 'none'"></div>
                </div>
              </div>`;
  
            // Append the chat list item to the container
            chatListContainer.innerHTML += myChatListItem;
  
            // Mark the user as displayed
            displayedUsers[userId] = true;
          }
        });
      })
      .catch(function(error) {
        console.error('Error retrieving chat list:', error);
      });
  }
  
  function showOurChat(chatKey, userImg, userName, userId) {
    var userChatItems = document.querySelectorAll('.user-item');
    var previousUserChatItem = null;
  
    function handleUserItemClick(userChatItem) {
      const userChatImage = userChatItem.querySelector('img').getAttribute('src');
      const userChatName = userChatItem.querySelector('.user-nm').textContent;
      const chatKey = userChatItem.getAttribute('id'); // Get the ID of the clicked user-item
      console.log(chatKey)
      const activeChatUserImage = document.querySelector('.active-user-img');
      const activeChatUserName = document.querySelector('.active-user-nm');
      activeChatUserImage.setAttribute('src', userChatImage);
      activeChatUserName.textContent = userChatName;
      nav.style.display = "flex";
      noUser.style.display = 'none'
      chatBox.style.display = 'flex'
      chatBox.style.flexDirection = 'column'
      inputCont.style.display = 'flex'
  
      userChatItem.style.backgroundColor = '#024e028a';
      userChatItem.disabled = true; // Disable the clicked user item
      addNewUserPage.style.display = 'none'
      profilePage.style.display = 'none'
  
      if (window.innerWidth < 830) {
        userChatItem.style.backgroundColor = '#5354545e';
        goBack.style.display = 'flex'
        thelists.style.display = 'none'
        thelists.style.borderRadius = '0px'
        headLeft.style.borderRadius = '0px'
        mainHead.style.borderRadius = '0px'
        chatBoxx.style.borderRadius = '0px'
        headLeft.style.display = 'none'
        headRight.style.display = 'flex'
        headRight.style.flexDirection = 'row'
        nav.style.backgroundColor = 'red'
        chatBoxx.style.display = 'flex'
        chatBoxx.style.flexDirection = 'column'
        chatBoxx.style.width = '100%'
        chatBoxx.style.borderRadius = '0px'
        nav.style.display = 'flex'
        nav.style.width = '100%'
        navImg.style.marginLeft = '4px'
        navName.style.width = '90%'
        navName.style.whiteSpace = 'nowrap'
        nav.style.alignItems = 'center'
        nav.style.flexDirection = 'flex'
        trunk.style.borderRadius = '0px'
        inputCont.style.borderRadius = '0px'
        mainHead.style.borderRadius = '0px'
        headRight.style.borderRadius = '0px'
        inputCont.style.display = 'flex'
        console.log("Screen width is less than 830 pixels");
  
          addNewPage2.style.width = '100%'
          addNewPage2.style.left = '0px'
          addNewPage2.style.borderRadius = '0px'
          addNewPage2.style.marginRight = '35%'
          inn.style.width = '100%'
      } 
  
  
      if (previousUserChatItem !== null && previousUserChatItem !== userChatItem) {
        previousUserChatItem.style.backgroundColor = '';
      }
  
      previousUserChatItem = userChatItem;
      console.log(`chat key ${chatKey}`)
      loadMessages(chatKey)
      sessionStorage.setItem('activeUser', chatKey);
    }
  
    userChatItems.forEach(function(userChatItem) {
      userChatItem.onclick = function() {
        handleUserItemClick(userChatItem);
      };
    });
  }
  
  goBack.onclick = function(){
    chatBoxx.style.display = 'none'
    thelists.style.display = 'flex'
    headLeft.style.display = 'flex'
    headRight.style.display = 'none'
  }
  
  function isDuplicateMessage(loadedMessages, msg, tm) {
    for (var key in loadedMessages) {
      var loadedMsg = loadedMessages[key];
      if (loadedMsg.msg === msg && loadedMsg.tm === tm) {
        return true; // Duplicate message found
      }
    }
    return false; // No duplicate message found
  }
  
  function loadMessages(chatKey) {
    var myId = sessionStorage.getItem('myId');
    var db = firebase.database().ref('messages').child(chatKey);
    var chatBox = document.getElementById('chatCont');
    chatBox.innerHTML = '';
  
    var loadedMessages = {}; // Object to store loaded messages (using message ID as key)
  
    db.on('child_added', function(snapshot) {
      var messageId = snapshot.key;
  
      // Check if the message already exists in loaded messages
      if (loadedMessages[messageId]) {
        return; // Skip the already loaded message
      }
  
      loadedMessages[messageId] = true; // Mark the message as loaded
  
      var chat = snapshot.val();
      var msg = chat.messgCont;
      var dateTime = chat.dateTime;
      var tm = `${dateTime[0]}:${dateTime[1]} ${dateTime[5]}`;
  
      // Check if the message is a duplicate
      if (isDuplicateMessage(loadedMessages, msg, tm)) {
        return; // Skip the duplicate message
      }
  
      var messageContent = '';
  
      if (chat.userId !== myId) {
        messageContent += `
        <div class="rec">
            <label class="rec-mg">${msg}</label>
            <label class="rec-ts">${tm}</label>
        </div>`;
      } else {
        messageContent += `
        <div class="sent">
            <label class="sent-mg">${msg}</label>
            <label class="sent-ts">${tm}</label>
        </div>`;
      }
  
      chatBox.innerHTML += messageContent;
      chatBox.scrollTo(0, chatBox.scrollHeight);
    });
  }
  
  
  function sendTextMessage(activeId){  
    var now = new Date();  
    var hour = now.getHours();
    var hr = hour % 12 || 12; 
    var min = ('0' + now.getMinutes()).slice(-2);
    var day = now.toLocaleString('en-US', { weekday: 'long' }); 
    var month = now.toLocaleString('en-US', { month: 'long' }); 
    var year = now.getFullYear();
    var ampm = hour >= 12 ? 'PM' : 'AM';   
    var time = [hr, min, day, month, year, ampm];
  
    var getMyId =  sessionStorage.getItem('myId')
    var msgcontent = msgInput.value
    var msg = {
      userId: getMyId,
      messgCont : msgcontent,
      msgType : 'normal',
      dateTime : time
    }
    console.log(`sending to ${activeId}`)
    firebase.database().ref('messages').child(activeId).push(msg, function(error){
      if(error){
        alert(error)
      }else{
        msgInput.value = ''
      }
    })
  }
  
  
  const me = document.getElementById('me')
  const myPop = document.getElementById('myPop') 
  const profile = document.getElementById('profilep')
  const showProfile = document.getElementById('showProfile')
  const showLogout = document.getElementById('showLogout')
  const closeProfile = document.getElementById('closeProfile')
  const closeNewProfile = document.getElementById('closenewpage')
  const logBase = document.getElementById('logBase')
  const logoutBtn = document.getElementById('yesLog')
  const showAddNewPage = document.getElementById('addNewF')
  const addNewPage = document.getElementById('newFriend')
  const searchTagInput = document.getElementById('searchBuddyTag')
  const findTag = document.getElementById('find')
  const inputContainer = document.getElementById('inputContainer')
  
  
  searchTagInput.addEventListener('input', () => {
      if(searchTagInput.value.length > 1){
          findTag.style.visibility = 'visible'
      }else{
          findTag.style.visibility = 'hidden'        
      }
  })
  showAddNewPage.onclick = function(){
      addNewPage.style.display = 'flex'
  }
  
  showLogout.onclick = function(){
      logBase.style.display = 'flex'
  }
  logBase.onclick = function(){
      logBase.style.display = 'none'
  }
  showProfile.onclick = function(){
      profile.style.display = 'flex'
  }
  closeProfile.onclick = function(){
      profile.style.display = 'none'
  }
  closeNewProfile.onclick = function(){
      addNewPage.style.display = 'none'
  }
  
  me.addEventListener('click', () => {
      myPop.style.display = 'flex'
  })
  myPop.addEventListener('mouseout', () => {
      myPop.style.display = 'none'
  })
  myPop.addEventListener('mouseover', () => {
      myPop.style.display = 'flex'
  })
  var userChatDivs = document.getElementsByClassName("user-item");
  for (var i = 0; i < userChatDivs.length; i++) {
    var userChatDiv = userChatDivs[i];
    var labelElement = userChatDiv.querySelector(".user-lm");
    var labelText = labelElement.textContent;
    if (labelText.length > 46) {
      var shortenedText = labelText.substring(0, 46);
      labelElement.textContent = `${shortenedText}..`;
    }
  
    
  }
  loadinn.style.display = 'none'