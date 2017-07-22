/**
 * Created by Profesor08 on 01.06.2017.
 */


class Playlist
{
  /**
   * Create playlist
   * @param {Player} player
   * @param {HTMLElement} wrapper - playlist main container
   * @param {HTMLElement} container - playlist tracks container
   * @param {Track[]} tracks - tracks
   */
  constructor(player, wrapper, container, tracks)
  {
    this.player = player;
    this.wrapper = wrapper;
    this.container = container;
    this.tracks = tracks;
    this.tracksAnchors = [];

    /**
     * Selected track id
     * @type {int}
     */
    this._selected = 0;
    this._init();
  }

  /**
   * Add event to track HTMLElement
   * @param {string} event
   * @param {function} callback
   */
  on(event, callback)
  {
    this.tracksAnchors.forEach(div =>
    {
      div.addEventListener(event, event =>
      {
        callback(event, div);
      });
    });
  }

  /**
   * Activate track in playlist
   * @param {int} id
   * @param {boolean} [instant = false] - skip animation
   * @param {int} [duration] - scroll duration time
   * @param {int} [delay] - delay in ms before scroll starts
   */
  select(id, instant, duration, delay)
  {
    if (instant === undefined)
    {
      instant = false;
    }

    if (duration === undefined)
    {
      duration = 500;
    }

    if (delay === undefined)
    {
      delay = 0;
    }

    if (this._selected !== null)
    {
      this._deselectTrack(this._selected);
    }

    this._selected = id;

    this._selectTrack(id);

    this.pauseState(id, this.player.getAudioProperty("paused"));

    setTimeout(() =>
    {
      this._scrollToTrack(id, duration, instant);
    }, delay);
  }

  /**
   * Set pause state
   * @param {int} id
   * @param {boolean} paused
   */
  pauseState(id, paused)
  {
    if (paused)
    {
      this.tracksAnchors[id].classList.remove("pause");
    }
    else
    {
      this.tracksAnchors[id].classList.add("pause");
    }
  }

  /**
   * Update progress bar
   * @param {int} value
   */
  updateProgress(value)
  {
    this.tracksAnchors[this._selected].children[0].style.width = value + "%";
  }

  /**
   * Initialize
   * @private
   */
  _init()
  {
    this.container.innerHTML = "";
    this._createPlaylist();
    this.select(this.player.getTrackId(), true);
  }

  /**
   * Creating playlist elements
   * @private
   */
  _createPlaylist()
  {
    if (this.tracks.length > 0)
    {
      let tpl = new Tpl("#track-template");

      this.tracks.forEach((track, id) =>
      {
        this.container.appendChild(this._createTrack(
          tpl.html(),
          track,
          id
        ));
      });
    }
  }

  /**
   * Creating playlist element
   * @param html
   * @param track
   * @param id
   * @return {HTMLElement}
   * @private
   */
  _createTrack(html, track, id)
  {
    let tpl = Tpl.fromHTML(html);

    let div = tpl.replace([
      "{title}",
      "{user}",
      "{duration}"
    ], [
      track.title,
      track.user.username,
      timestampToTime(track.duration)
    ]).get();

    div.setAttribute("data-id", id);
    div.setAttribute("data-track-id", track.id);

    this.tracksAnchors.push(div);

    return div;
  }

  /**
   * Select track
   * @param id
   * @private
   */
  _selectTrack(id)
  {
    this.tracksAnchors[id].classList.add("active");
  }

  /**
   * Deselect track
   * @param id
   * @private
   */
  _deselectTrack(id)
  {
    this.tracksAnchors[id].classList.remove("active");
    this.tracksAnchors[id].classList.remove("pause");
    this.tracksAnchors[this._selected].children[0].removeAttribute("style");
  }

  /**
   * Scroll playlist to track
   * @param {int} id
   * @param {int} [duration] - scroll duration time
   * @param {boolean} [instant] - skip animation
   */
  _scrollToTrack(id, duration, instant)
  {
    let trackHeight = this.tracksAnchors[id].offsetHeight;
    let wrapperHeight = this.wrapper.offsetHeight;
    let scroll = trackHeight * id - wrapperHeight / 2 + trackHeight / 2;

    if (instant)
    {
      this.wrapper.scrollTop = scroll;
    }
    else
    {
      this.wrapper.scrollTo(scroll, duration);
    }
  }

}