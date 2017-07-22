/**
 * Created by Profesor08 on 26.05.2017.
 */

const app = new Vue({
  el: "#player-material",
  data: {
    tracks: [],
    client_id: "2t9loNQH90kzJcsFCODdigxfp325aq4z"
  },

  methods: {

    tryLoadData: async function (url, params)
    {
      let tryCount = 5;
      let data = null;

      while (tryCount)
      {
        try
        {
          data = await axios.get(url, params);

          break;
        }
        catch (err)
        {
          tryCount--;

          if (tryCount <= 0)
          {
            console.log(err);
            throw err;
          }
        }
      }

      return data;
    },

    getProfileData: async function (profileUrl)
    {
      try
      {
        let profile = await this.tryLoadData("https://api.soundcloud.com/resolve", {
          params: {
            url: profileUrl,
            client_id: this.client_id
          }
        });

        return profile.data;
      }
      catch (err)
      {
        throw "Unable to load Soundcloud profile data.";
      }
    },

    getLikesData: async function (userId)
    {
      try
      {
        let likes = await axios.get("https://api.soundcloud.com/e1/users/" + userId + "/likes", {
          params: {
            format: "json",
            limit: 1000,
            date: Date.now(),
            client_id: this.client_id
          }
        });

        return likes.data;
      }
      catch (err)
      {
        throw "Unable to load profile likes data.";
      }
    }
  },

  created: async function ()
  {
    try
    {
      let user = await this.getProfileData("https://soundcloud.com/profesor08");
      let likes = await this.getLikesData(user.id);

      this.tracks = likes
        .map(like =>
        {
          let track = like.track;

          if (track !== null)
          {
            track.artwork_url.replace(/large/, "badge");
          }

          return track
        })
        .filter(item => item !== null);
    }
    catch (err)
    {
      alertify.logPosition("top right");
      alertify.error("Unable to load Soundcloud data.");
    }
  }
});