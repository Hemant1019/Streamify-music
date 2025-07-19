console.log("Lets write some java script")
let currentsong = new Audio();
let songs;
let currfolder;
function formatTime(seconds) {
    // Remove milliseconds if present (considering seconds might have fractional part)
    seconds = Math.floor(seconds);

    // Calculate whole minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Format the seconds to always have two digits
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return the formatted time as a string
    return minutes + ':' + formattedSeconds;
}

document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.querySelector('.signup');
    const modal = document.getElementById('signup-modal');
    const closeButton = document.querySelector('.close-button');

    // Show modal when Sign Up button is clicked
    signupButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission (basic example)
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Sign up form submitted!');
        modal.style.display = 'none'; // Close modal after submission
    });
});

formatTime();


   async function getsongs(folder){
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
     songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs);
    // show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                        <img class="invert" src="music.svg" alt="music">
                        <div class="info">
                            <span> ${song.replaceAll("%20"," ")}</span>
                        </div>

                        <div class="playnow">
                            <span>Play now</span>
                            <img class=" invert" src="play.svg" alt="play">
                        </div>
                   </li>`
    // Attach an event listner to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
})
    }
    return songs;

   }
  const playMusic = (track,pause=false)=>{
    // let audio = new Audio("/songs/" + track);
   currentsong.src =  `/${currfolder}/`+ track;
   if(!pause){
    
       
       currentsong.play();
       play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    // document.querySelector(".songtime").innerHTML = "00.00/00.00"    

}
   
// getsongs(); 

async function displayAlbums(){
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);
      for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
      
        if(e.href.includes("/songs")){
     let folder = (e.href.split("/").slice(-2)[0]);
     // ge the metadata of the folder
     let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
    let response = await a.json();
    console.log(response);
    cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="61" height="61" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#1ed760" />
                            <path
                                d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                fill="#000000" />
                        </svg>



                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="card">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>

                </div>`

           
        }

    }
    // Load the playlist whenever card is clicked
 Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
       
        playMusic(songs[0]);
        
    })
 })

}

async function main() {
    // get the list of all songs            
    await getsongs("songs/ncs");
    console.log(songs);
    playMusic(songs[0],true)
    displayAlbums();
   
    
//     // play the first song
//     var audio = new Audio(songs[20]);
//     audio.play();
//     // const audioElement = new Audio("car_horn.wav");
// audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   // The duration variable now holds the duration (in seconds) of the audio clip
//   console.log(duration);
// });



// Attach an event listner to play , next and previous
play.addEventListener("click" , ()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src = "pause.svg";
    }
    else{
        currentsong.pause();
        play.src = "play.svg"
    }
})

// listen for timeupdate event
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime , currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
})
  // Add an event listner for seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    // console.log(e.target.getBoundingClientRect(),e.offsetX)
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration)*percent)/100;

  })

  // Add an event listner for hameburger

document.querySelector(".hameburger").addEventListener("click",()=>{
       document.querySelector(".left").style.left = "0";
})
// Add an event listner for close 
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-130%";
})
//  Add event listner for previous
previous.addEventListener("click",()=>{
    currentsong.pause();
    console.log("Previous clicked");
   
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index-1)>= 0){
        playMusic(songs[index-1]);
    }
   
})

//  Add event listner for next
next.addEventListener("click",()=>{
    console.log("next clicked");
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if((index+1)<songs.length){
        playMusic(songs[index+1]);
    }
})

// Add event listner for volume 
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log("Setting volume to",e.target.value,"/100" );                                                                                                                                                                                                                             
    currentsong.volume = parseInt(e.target.value)/100


})

// Add an evnet listner to mute the track
document.querySelector(".volume>img").addEventListener("click",(e)=>{
    console.log(e.target);
    if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg");
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg");
        currentsong.volume = 0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
    }
})
 

}


main();
