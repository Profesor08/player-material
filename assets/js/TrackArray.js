/**
 * Created by Profesor08 on 05.04.2017.
 */

class TrackArray
{

  /**
   * Initialize TrackArray
   * @param {Track[]} tracks
   */
  constructor(tracks)
  {
    this.id = 0;
    this.tracks = tracks;
    this.randHistory = [];
  }

  /**
   * Get current track
   * @returns {Track}
   */
  get()
  {
    return this.tracks[this.id];
  }

  /**
   * Get current track id
   * @returns {int}
   */
  getId()
  {
    return this.id;
  }

  /**
   * Set current track id
   * @param {number} id
   */
  setId(id)
  {
    this.id = id;
  }

  /**
   * Get next track and move cursor to it
   */
  next()
  {
    if (this.id < this.tracks.length - 1)
    {
      this.id++;
    }
    else
    {
      this.id = 0;
    }

    return this.tracks[this.id];
  }

  /**
   * Get previous track and move cursor to it
   */
  previous()
  {
    if (this.randHistory.length > 0)
    {
      if (this.randHistory[this.randHistory.length - 1] === this.id)
      {
        this.randHistory.pop();
      }

      if (this.randHistory.length > 0)
      {
        this.id = this.randHistory.pop();
      }
      else
      {
        this.previous();
      }
    }
    else
    {
      if (this.id > 0)
      {
        this.id--;
      }
      else
      {
        this.id = this.tracks.length - 1;
      }
    }

    return this.tracks[this.id];
  }

  /**
   * Shuffle all tracks and return pointer to this object
   * @returns {TrackArray} - self reference
   */
  shuffle()
  {
    for (let i = 0; i < this.tracks.length; i++)
    {
      let index = Math.floor(Math.random() * this.tracks.length);

      [this.tracks[i], this.tracks[index]] = [this.tracks[index], this.tracks[i]];
    }

    this.id = 0;

    return this;
  }

  /**
   * Return tracks as array
   * @returns {Track[]}
   */
  toArray()
  {
    return this.tracks;
  }

  /**
   * Get random track from tracks array and saving it to history
   * @return {Track}
   */
  getRandomTrack()
  {
    function rand(min, max)
    {
      return Math.floor(min + Math.random() * (max + 1 - min));
    }

    let id = 0;

    do
    {
      id = rand(0, this.tracks.length - 1);
    }
    while(id === this.id);

    if (this.randHistory.length === 0)
    {
      this.randHistory.push(this.id);
    }

    this.id = id;

    this.randHistory.push(this.id);

    return this.tracks[this.id];
  }
}