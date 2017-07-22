/**
 * Created by Profesor08 on 30.05.2017.
 */


if (!Object.prototype.scrollTo)
{
  Object.defineProperty(Object.prototype, "scrollTo", {
    enumerable: false,
    configurable: true,
    writable: false,
    value: function (offset, duration)
    {
      let scrollCount = 0;
      let oldTimestamp = performance.now();
      let isScrollingDown = this.scrollTop < offset;
      let critical = isScrollingDown ? this.scrollHeight - this.clientHeight : 0;

      if (isScrollingDown)
      {
        if (offset > critical)
        {
          offset = critical;
        }
      }
      else
      {
        if (offset < critical)
        {
          offset = critical
        }
      }

      let step = newTimestamp =>
      {
        scrollCount += Math.PI / (duration / (newTimestamp - oldTimestamp));

        if (isScrollingDown)
        {
          if (this.scrollTop + scrollCount < offset)
          {
            this.scrollTop += scrollCount;
            requestAnimationFrame(step);
          }
          else
          {
            this.scrollTop = offset;
          }
        }
        else
        {
          if (this.scrollTop - scrollCount > offset)
          {
            this.scrollTop -= scrollCount;
            requestAnimationFrame(step);
          }
          else
          {
            this.scrollTop = offset;
          }
        }
      };

      requestAnimationFrame(step);
    }
  });
}

function timestampToTime(seconds)
{
  let hours = parseInt(seconds / 3600);
  seconds %= 3600;
  let minutes = parseInt(seconds / 60);
  seconds %= 60;

  let time = [];

  if (hours > 0)
  {
    time.push(hours);
    time.push(minutes >= 10 ? minutes : "0" + minutes);
  }
  else
  {
    time.push(minutes);
  }

  time.push(seconds >= 10 ? seconds : "0" + seconds);

  return time.join(":");
}