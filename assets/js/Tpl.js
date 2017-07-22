/**
 * Created by Profesor08 on 01.06.2017.
 */

class Tpl
{
  /**
   * Creates new html template
   * @param {int | string} data - id or html
   * @param {boolean} [isHtml] - is data is html?
   */
  constructor(data, isHtml)
  {
    if (isHtml === true)
    {
      this.template = data;
    }
    else
    {
      this.template = document.querySelector(data).innerHTML;
    }
  }

  /**
   * Get template HTMLElement
   * @return {HTMLElement}
   */
  get()
  {
    let div = document.createElement("div");
    div.innerHTML = this.template;
    return div.firstElementChild;
  }

  /**
   * Get template html string
   * @return {int|string|*|int|string}
   */
  html()
  {
    return this.template;
  }

  /**
   * Initialize template from html string
   * @param html
   * @return {Tpl}
   */
  static fromHTML(html)
  {
    return new Tpl(html, true);
  }

  /**
   *
   * @param {string | []} search
   * @param {string | []} replace
   * @return {Tpl}
   */
  replace(search, replace)
  {
    let tpl = this.template;

    if (Array.isArray(search))
    {
      if (Array.isArray(replace))
      {
        for(let i = 0; i < search.length; i++)
        {
          tpl = tpl.replace(search[i], replace[i]);
        }
      }
      else
      {
        for(let i = 0; i < search.length; i++)
        {
          tpl = tpl.replace(search[i], replace);
        }
      }
    }
    else
    {
      tpl = tpl.replace(search, replace);
    }

    this.template = tpl;

    return this;
  }
}