/**
 * Created by Profesor08 on 01.06.2017.
 */


class ProgressBar
{

  /**
   * Initialize progress bar control
   * @param {Player} player
   */
  constructor(player)
  {
    this.bars = {};
    this.player = player;
  }

  setBar(name, element)
  {
    if (this.bars.hasOwnProperty(name))
    {
      this.deleteBar(name);
    }

    this.bars[name] = element;
  }

  clearStyle(name)
  {
    if (this.bars.hasOwnProperty(name))
    {
      this.bars[name].removeAttribute("style");
    }
  }

  deleteBar(name)
  {
    if (this.bars.hasOwnProperty(name))
    {
      this.clearStyle(name);
      return delete this.bars[name];
    }

    return false;
  }

  updateProgress()
  {
    let track = this.player.getTrack();
    let currentTime = this.player.getAudioProperty("currentTime");
    let progress = 100 / track.duration * currentTime;

    for(let name in this.bars)
    {
      if (this.bars.hasOwnProperty(name))
      {
        this.bars.style.width = progress + "%";
      }
    }
  }
}