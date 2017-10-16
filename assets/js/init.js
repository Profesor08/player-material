/**
 * Created by Profesor08 on 01.06.2017.
 */


const app = new App({
  // client_id: "2t9loNQH90kzJcsFCODdigxfp325aq4z"
  // client_id: "viGqqUJ1aoaFVSMA7EdLE3IZJLwYFKU"
  client_id: "e9f897e4636fc2682a1c243b511d30b8"
});

app.initControls({
  playerContainer: document.querySelector(".player"),
  playButton: document.querySelector("#play-button"),
  pauseButton: document.querySelector("#pause-button"),
  nextButton: document.querySelector("#next-button"),
  previousButton: document.querySelector("#previous-button"),
  repeatButton: document.querySelector("#repeat-button"),
  shuffleButton: document.querySelector("#shuffle-button"),
  trackInfo: document.querySelector(".track-info"),
  progressSlider: document.querySelector("#progress-slider"),
  progressBar: document.querySelector(".progress-bar .background-bar.track-progress"),
  imageContainer: document.querySelector(".image-container"),
  imageCarousel: document.querySelector(".image-container .image-carousel"),
  title: document.querySelector(".track-info .title"),
  user: document.querySelector(".track-info .user"),
  playTime: document.querySelector(".track-info .play-time"),
  durationTime: document.querySelector(".track-info .duration-time"),
  playlistContainer: document.querySelector(".playlist .tracks-wrapper"),
  playlistWrapper: document.querySelector(".playlist"),
  header: document.querySelector(".header"),
  arrow: document.querySelector(".arrow"),
  topNav: document.querySelector(".top-nav"),

  volumeSlider: document.querySelector("#volume-slider"),
  volumeBar: document.querySelector(".progress-bar .background-bar.volume-bar"),
});

app.loadTracks("https://soundcloud.com/profesor08");

$(".button-collapse").sideNav();