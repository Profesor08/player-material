/**
 * Created by Profesor08 on 26.05.2017.
 */

class Player
{

  /**
   * Initialize Player
   * @param params
   */
  constructor(params)
  {
    /**
     * Defaul parameters
     * @type {{autoplay: boolean, loop: boolean, lang: Array, error: Player.params.error}}
     */
    this.params = {
      error: function (err)
      {
      }
    };

    /**
     * Audio element
     * @type {Audio}
     */
    this.audio = new Audio();

    /**
     * Array of tracks
     * @type {Track[]}
     */
    this.tracks = null;

    /**
     * Indicates that player should play random track on .next method call
     * @type {boolean}
     */
    this.shuffle = false;

    /**
     * Indicate that player was stopped manually
     * @type {boolean}
     */
    this.paused = true;

    /**
     * Reinitialize default values with passed to constructor
     */
    if (params !== undefined)
    {
      Object.assign(this.params, params);
    }

    this._initAudio();
  }

  /**
   * Initialize audio element
   * @private
   */
  _initAudio()
  {
    this.audio.addEventListener("canplay", () =>
    {
      /**
       * Prevent player from auto playing if it paused manually
       */
      if (this.paused !== true)
      {
        this.audio.play();
      }
    });

    this.audio.addEventListener("error", () =>
    {
      let currentTime = this.audio.currentTime;
      this._setTrack(this.tracks.get());
      this.setTime(currentTime);
    });
  }

  /**
   * Set Audio track
   * @param {Track} track
   * @private
   */
  _setTrack(track)
  {
    this.audio.src = track.stream_url;
  }

  /**
   * Play current track
   */
  play()
  {
    this.paused = false;

    if (this.audio.readyState === 4)
    {
      this.audio.play();
    }
  }

  /**
   * Pause playing track
   */
  pause()
  {
    if (this.audio.paused === false)
    {
      this.audio.pause();
      this.paused = true;
    }
  }

  /**
   * Stop playing track
   */
  stop()
  {
    if (this.audio.paused === false)
    {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.paused = true;
    }
  }

  /**
   * Play next track
   */
  next()
  {
    if (this.shuffle)
    {
      this._setTrack(this.tracks.getRandomTrack());
    }
    else
    {
      this._setTrack(this.tracks.next());
    }
  }

  /**
   * Play previous track
   */
  previous()
  {
    this._setTrack(this.tracks.previous());
  }

  /**
   * Set loop
   * @param {boolean} value
   */
  loop(value)
  {
    this.audio.loop = value;
  }

  /**
   * Set shuffle
   * @param {boolean} value
   */
  setShuffle(value)
  {
    this.shuffle = value;
  }

  /**
   * Get shuffle
   * @return {boolean}
   */
  getShuffle()
  {
    return this.shuffle;
  }

  /**
   * Add new event listener to track
   * @param event
   * @param callback
   */
  on(event, callback)
  {
    this.audio.addEventListener(event, callback);
  }

  /**
   * Add Track or Tracks list
   * @param {Track | Track[]} data
   */
  setTracks(data)
  {
    if (!Array.isArray(data))
    {
      data = [data];
    }

    this.tracks = new TrackArray(data);

    if (data.length > 0)
    {
      this._setTrack(this.tracks.get());
    }
  }

  /**
   * Set track by id
   * @param {number} id
   */
  setTrackById(id)
  {
    this.tracks.setId(id);
    this._setTrack(this.tracks.get());
  }

  /**
   * Set playback position of current track in seconds
   * @param {int} time
   */
  setTime(time)
  {
    this.audio.currentTime = time;
  }

  /**
   * Set audio volume between 0.0 - 1.0
   * @param {float} volume
   */
  setVolume(volume)
  {
    this.audio.volume = volume;
  }

  /**
   * Get current parameter of audio
   * @param {string} property
   * @return {*}
   */
  getAudioProperty(property)
  {
    return this.audio[property];
  }

  /**
   * Get current track
   * @return {Track}
   */
  getTrack()
  {
    return this.tracks.get();
  }

  /**
   * Get current track id
   * @return {int}
   */
  getTrackId()
  {
    return this.tracks.getId();
  }

}