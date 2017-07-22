/**
 * Created by Profesor08 on 01.06.2017.
 */

class Carousel
{
  /**
   * Initialize carousel
   * @param {HTMLElement} container
   * @param {Track[]} tracks
   */
  constructor(container, tracks)
  {
    this.container = container;
    this.carousel = null;
    this.tracks = tracks;

    this._init();
  }

  /**
   * Initialization
   * @private
   */
  _init()
  {
    this.container.innerHTML = "";
    this._createSlides();
    this.carousel = new Flickity(".image-carousel", {
      cellSelector: ".image",
      wrapAround: true,
      dragThreshold: 50,
      selectedAttraction: 0.2,
      friction: 0.8,
      prevNextButtons: false,
      pageDots: false,
      setGallerySize: false
    });
  }

  /**
   * Creating all slides and appending them to container
   * @private
   */
  _createSlides()
  {
    if (this.tracks.length > 0)
    {
      let tpl = new Tpl("#slide-template");

      this.tracks.forEach((track, id) =>
      {
        this.container.appendChild(this._createSlide(tpl.get(), track, id));
      })
    }
  }

  /**
   * Creating a slide
   * @param {HTMLElement} slide
   * @param {Track} track
   * @param {int | string} id
   * @return {HTMLElement}
   * @private
   */
  _createSlide(slide, track, id)
  {
    slide.style.backgroundImage = "url(" + track.artwork_url + ")";
    slide.setAttribute("data-track-id", id);
    return slide;
  }

  /**
   * Add event listener
   * @param {string} event
   * @param {function} callback
   */
  on(event, callback)
  {
    this.carousel.on(event, callback);
  }

  /**
   * Get selected index
   * @return {number|*|int}
   */
  index()
  {
    return this.carousel.selectedIndex;
  }

  /**
   * Select required slide by id
   * @param index
   * @param {boolean} [instant] - animate selecting or not
   */
  select(index, instant)
  {
    if (instant === true)
    {
      this.carousel.select(index, false, true);
    }
    else
    {
      this.carousel.select(index, false);
    }
  }
}