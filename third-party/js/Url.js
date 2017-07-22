/**
 * Created by Profesor08 on 04.04.2017.
 */

class Url
{
  constructor(path)
  {
    this.base = "";
    this.pathString = "";
    this.queryParams = {};
    this.queryKeys = [];

    if (path)
    {
      this.base = path.rtrim("/");
    }
  }

  path(path)
  {
    if(typeof path !== "number")
    {
      this.pathString += "/" + path.ltrim("/").rtrim("/");
    }
    else
    {
      this.pathString += "/" + path;
    }

    return this;
  }

  query(params)
  {
    if (params instanceof Object)
    {
      this.queryParams = Object.assign(this.queryParams, params);
    }
    else if (typeof params === "string")
    {
      if (this.queryKeys.indexOf(params) === -1)
      {
        this.queryKeys.push(params);
      }
    }

    return this;
  }

  get()
  {
    let url = this.base + this.pathString;
    let queryString = this._build(this.queryParams);
    let keysString = this._keys(this.queryKeys);

    if (queryString.length > 0)
    {
      url += "?" + queryString;
    }

    if (keysString.length > 0)
    {
      if (queryString.length > 0)
      {
        url += "&" + keysString;
      }
      else
      {
        url += keysString;
      }
    }

    this._reset();

    return url;
  }

  _reset()
  {
    this.pathString = "";
    this.queryParams = {};
    this.queryKeys = [];
  }

  _keys(keys)
  {
    return keys.join("&");
  }

  _build(params)
  {
    return Object.getOwnPropertyNames(params).map(
      property => encodeURIComponent(property) + "=" + encodeURIComponent(params[property])
    ).join("&");
  }
}