/**
 * Created by Profesor08 on 27.05.2017.
 */

class App
{
  /**
   *
   * @param {{client_id: string, [tryCount]: number}} params
   */
  constructor(params)
  {
    this.options = {
      client_id: "",
      debug: true
    };

    if (params)
    {
      Object.assign(this.options, params);
    }

    this.controls = null;
    this.tracks = null;
    this.player = new Player();
    this.sc = new SoundCloud({
      client_id: this.options.client_id
    });
    this.save = {
      loop: false,
      shuffle: false,
      lastTrack: null,
      volume: 1
    };
    this.ready = false;

    this.carousel = null;
    this.playlist = null;
  }

  playTrack()
  {
    this.controls.playButton.classList.add("scale-out");
    this.controls.pauseButton.classList.remove("scale-out");
    this.player.play();
    this.playlist.select(this.player.getTrackId());
  }

  pauseTrack()
  {
    this.controls.playButton.classList.remove("scale-out");
    this.controls.pauseButton.classList.add("scale-out");
    this.player.pause();
  }

  nextTrack()
  {
    this.player.next();
    this.carousel.select(this.player.getTrackId());
    this.playlist.select(this.player.getTrackId());
  }

  previousTrack()
  {
    this.player.previous();
    this.carousel.select(this.player.getTrackId());
    this.playlist.select(this.player.getTrackId());
  }

  updateTrackInfo()
  {
    let track = this.player.getTrack();
    this.controls.title.innerText = track.title;
    this.controls.user.innerText = track.user.username;
    this.updatePlayTime();
    this.updateProgressbar();
  }

  updateProgressbar()
  {
    let track = this.player.getTrack();
    let currentTime = this.player.getAudioProperty("currentTime");
    let progress = 100 / track.duration * currentTime;
    this.controls.progressSlider.max = track.duration;
    this.controls.progressSlider.value = currentTime;
    this.controls.progressBar.style.width = progress + "%";
    this.playlist.updateProgress(progress);
  }

  updateVolumeBar(volume)
  {
     this.controls.volumeBar.style.width = (volume * 100) + "%";
  }

  updatePlayTime()
  {
    let track = this.player.getTrack();
    let currentTime = this.player.getAudioProperty("currentTime");
    this.controls.durationTime.innerText = timestampToTime(parseInt(track.duration));
    this.controls.playTime.innerText = timestampToTime(parseInt(currentTime));
  }

  loadTracks(profileUrl)
  {
    (async () =>
    {
      try
      {
        let user = await this.sc.getProfileData(profileUrl);
        let likes = await this.sc.getLikesData(user.id);

        this.tracks = this.sc.prepareTrackList(likes, SoundCloud.coverSize.x500);

        this.player.setTracks(this.tracks);

        this.carousel = new Carousel(
          this.controls.imageCarousel,
          this.tracks
        );

        this.carousel.on("select", () =>
        {
          if (this.carousel.index() !== this.player.getTrackId())
          {
            this.player.setTrackById(this.carousel.index());
            this.playlist.select(this.carousel.index());
            this.updateTrackInfo();
            this.saveData();
          }
        });

        this.playlist = new Playlist(
          this.player,
          this.controls.playlistWrapper,
          this.controls.playlistContainer,
          this.tracks
        );

        this.playlist.on("click", (event, div) =>
        {
          let id = parseInt(div.getAttribute("data-id"));

          if (this.player.getTrackId() === id)
          {
            if (this.player.getAudioProperty("paused") === true)
            {
              this.playTrack();
              this.updateTrackInfo();
              this.saveData();
            }
            else
            {
              this.pauseTrack();
              this.updateTrackInfo();
              this.saveData();
            }
          }
          else
          {
            this.player.setTrackById(id);
            this.carousel.select(id);
            this.playTrack();
            this.updateTrackInfo();
            this.playlist.select(id);
            this.saveData();
          }
        });

        let id = this._findIdByTrackId(this.save.lastTrack);

        if (id !== false)
        {
          this.player.setTrackById(id);
          this.carousel.select(id, true);
        }

        this.playlist.select(this.player.getTrackId());
        // this.activatePlaylistTrack(true);
        this.updateTrackInfo();
        this.ready = true;
      }
      catch (err)
      {
        alertify.logPosition("top right");
        alertify.error(err);

        if (this.options.debug === true)
        {
          throw err;
        }
      }
    })();
  }

  /**
   * Find track by it Track.id
   * @param {Track.id} id
   * @return {int | boolean}
   * @private
   */
  _findIdByTrackId(id)
  {
    for (let i = 0; i < this.tracks.length; i++)
    {
      if (this.tracks[i].id === id)
      {
        return i;
      }
    }

    return false;
  }

  _init()
  {
    this.controls.playButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        this.playTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this.controls.pauseButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        this.pauseTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this.controls.nextButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        this.nextTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this.controls.previousButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        this.previousTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this.controls.progressSlider.addEventListener("input", () =>
    {
      if (this.ready)
      {
        this.player.setTime(this.controls.progressSlider.value);
        this.updateProgressbar();
        this.updatePlayTime();
      }
    });

    this.controls.volumeSlider.addEventListener("input", () =>
    {
      if (this.ready)
      {
        this.setVolume(this.controls.volumeSlider.value);
        this.saveData();
      }
    });

    this.controls.repeatButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        if (this.player.getAudioProperty("loop") === false)
        {
          this.player.loop(true);
          this.controls.repeatButton.classList.add("active");
        }
        else
        {
          this.player.loop(false);
          this.controls.repeatButton.classList.remove("active");
        }

        this.saveData();
      }
    });

    this.controls.shuffleButton.addEventListener("click", () =>
    {
      if (this.ready)
      {
        if (this.player.getShuffle() === false)
        {
          this.player.setShuffle(true);
          this.controls.shuffleButton.classList.add("active");
        }
        else
        {
          this.player.setShuffle(false);
          this.controls.shuffleButton.classList.remove("active");
        }

        this.saveData();
      }
    });

    this.controls.arrow.addEventListener("click", () =>
    {
      this.toggleTopNav();
    });

    this.controls.imageContainer.addEventListener("click", () =>
    {
      this.toggleTopNav(false);
    });

    this._swipe(this.controls.trackInfo, "swipeleft", () =>
    {
      if (this.ready)
      {
        this.nextTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this._swipe(this.controls.trackInfo, "swiperight", () =>
    {
      if (this.ready)
      {
        this.previousTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this._swipe(this.controls.trackInfo, "swipeup", () =>
    {
      if (this.ready)
      {
        this.playlist.select(this.player.getTrackId());
        this.showSmallPlaylist();
      }
    });

    this._swipe(this.controls.trackInfo, "swipedown", () =>
    {
      if (this.ready)
      {
        this.hidePlaylist();
      }
    });

    this._swipe(this.controls.imageContainer, "swipeup", () =>
    {
      if (this.ready)
      {
        this.playlist.select(this.player.getTrackId());
        this.showSmallPlaylist();
      }
    });

    this._swipe(this.controls.imageContainer, "swipedown", () =>
    {
      if (this.ready)
      {
        this.hidePlaylist();
      }
    });

    this.player.on("timeupdate", () =>
    {
      if (this.ready)
      {
        this.updateProgressbar();
        this.updatePlayTime();
      }
    });

    this.player.on("ended", () =>
    {
      if (this.ready && this.player.getAudioProperty("loop") === false)
      {
        this.nextTrack();
        this.updateTrackInfo();
        this.saveData();
      }
    });

    this.player.on("pause", () =>
    {
      this.playlist.pauseState(this.player.getTrackId(), this.player.getAudioProperty("paused"));
    });

    this.player.on("canplay", () =>
    {
      this.playlist.pauseState(this.player.getTrackId(), this.player.getAudioProperty("paused"));
    });

    if (this.save.loop === true)
    {
      this.controls.repeatButton.classList.add("active");
    }

    if (this.save.shuffle === true)
    {
      this.controls.shuffleButton.classList.add("active");
    }
  }

  showSmallPlaylist()
  {
    this.controls.playerContainer.classList.remove("full-playlist");
    this.controls.playerContainer.classList.add("small-playlist");
  }

  showFullPlaylist()
  {
    this.controls.playerContainer.classList.remove("small-playlist");
    this.controls.playerContainer.classList.add("full-playlist");
  }

  hidePlaylist()
  {
    this.controls.playerContainer.classList.remove("small-playlist");
    this.controls.playerContainer.classList.remove("full-playlist");
  }

  loadSavedData()
  {
    if ("playerSave" in localStorage)
    {
      Object.assign(this.save, JSON.parse(localStorage["playerSave"]));
    }
  }

  toggleTopNav(show)
  {
    if (this.controls.hasOwnProperty("header"))
    {
      if (typeof show === "boolean")
      {
        if (show)
        {
          this.controls.header.classList.add("active");
        }
        else
        {
          this.controls.header.classList.remove("active");
        }
      }
      else
      {
        if (this.controls.header.classList.contains("active"))
        {
          this.controls.header.classList.remove("active");
        }
        else
        {
          this.controls.header.classList.add("active");
        }
      }
    }
  }

  setVolume(volume)
  {
    this.player.setVolume(volume);
    this.updateVolumeBar(volume);
  }

  updateVolume(volume)
  {
    this.controls.volumeSlider.value = volume;
    this.setVolume(volume);
  }

  saveData()
  {
    this.save.loop = this.player.getAudioProperty("loop");
    this.save.shuffle = this.player.getShuffle();
    this.save.lastTrack = this.player.getTrack().id;
    this.save.volume = this.player.getAudioProperty("volume");

    localStorage["playerSave"] = JSON.stringify(this.save);
  }

  initControls(controls)
  {
    this.controls = controls;

    this.loadSavedData();

    this.player.loop(this.save.loop);
    this.player.setShuffle(this.save.shuffle);
    this.updateVolume(this.save.volume);

    this._init();
  }

  _swipe(element, direction, callback)
  {
    let hm = new Hammer(element);
    hm.get('swipe').set({direction: Hammer.DIRECTION_ALL});
    hm.on(direction, callback);
  }


}


