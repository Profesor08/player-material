/**
 * Created by Profesor08 on 27.05.2017.
 */

class SoundCloud
{

  /**
   * SoundCloud constructor
   * @param {{client_id: string, [tryCount]: number}} params
   */
  constructor(params)
  {
    this.options = {
      client_id: null,
      tryCount: 5
    };

    Object.assign(this.options, params);
  }

  /**
   * Loading data from SoundCloud api by ajax
   * Sometimes SoundCloud service returns 500 error, I don't know why,
   * but this method will repeat ajax request up to 5 times
   * before to throw exception
   * @param url
   * @param params
   * @return {Promise.<*>}
   */
  async tryLoadData(url, params)
  {
    let tryCount = this.options.tryCount;
    let data = null;

    while (tryCount)
    {
      try
      {console.log(url);
        data = await axios.get(url, params);

        break;
      }
      catch (err)
      {
        tryCount--;

        if (tryCount <= 0)
        {
          throw err;
        }
      }
    }

    return data;
  }

  /**
   * Get SoundCloud user data by profile url
   * @param profileUrl
   * @return {Promise.<void>}
   */
  async getProfileData(profileUrl)
  {
    try
    {

      let profile = await this.tryLoadData("https://api.soundcloud.com/resolve", {
        params: {
          url: profileUrl,
          client_id: this.options.client_id
        }
      });

      return profile.data;
    }
    catch (err)
    {
      throw "Unable to load Soundcloud profile data.";
    }
  }

  /**
   * Get SoundCloud user likes
   * @param userId
   * @return {Promise.<void>}
   */
  async getLikesData(userId)
  {
    try
    {
      let likes = await this.tryLoadData("https://api.soundcloud.com/e1/users/" + userId + "/likes", {
        params: {
          format: "json",
          limit: 1000,
          date: Date.now(),
          client_id: this.options.client_id
        }
      });

      return likes.data;
    }
    catch (err)
    {
      throw "Unable to load profile likes data.";
    }
  }

  /**
   * Prepare track to required format
   * @param track
   * @param coverSize
   * @return {*}
   */
  prepareTrack(track, coverSize)
  {
    if (track.artwork_url !== null)
    {
      track.artwork_url = track.artwork_url.replace(/large/, coverSize);
    }
    else if (track.user.avatar_url !== null)
    {
      track.artwork_url = track.user.avatar_url.replace(/large/, coverSize);
    }

    track.duration = parseInt(track.duration / 1000);
    track.stream_url = track.stream_url + "?client_id=" + this.options.client_id;

    return track
  }

  /**
   * Prepare tracks list to required format
   * @param list
   * @param {SoundCloud.coverSize.} coverSize
   */
  prepareTrackList(list, coverSize)
  {
    return list
      .map(like =>
      {
        let track = like.track;

        if (track !== null)
        {
          return this.prepareTrack(track, coverSize);
        }

        return track
      })
      .filter(item => item !== null);
  }
}

/**
 * Default SoundClouds cover size
 * @type {{x500: string, x400: string, x300: string, x100: string, x67: string, x47: string, x32: string, x20: string, x18: string, x16: string}}
 */
SoundCloud.coverSize = {
  x500: "t500x500",
  x400: "crop",
  x300: "t300x300",
  x100: "large",
  x67: "t67x67",
  x47: "badge",
  x32: "small",
  x20: "tiny",
  x18: "tiny",
  x16: "mini"
};