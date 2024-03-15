export const formatTime = (time) => {
    return time.split(':').map(part => part.length < 2 ? `0${part}` : part).join(':');
  }