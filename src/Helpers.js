export var checkImageUrl = (url) => {
   var http = new XMLHttpRequest()
   http.open('GET', url, false)
   http.send()

   if (http.status === 200 && http.responseText !== 'no direct script access allowed') {
      return url
   } else {
      return baseURL + 'img/avatar.png'
   }
}

export var removeArray = (array, element) => {
   return array.filter(el => el !== element)
}

export var contextMenu = (e, root) => {
   if (root) {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const rootW = root.offsetWidth;
      const rootH = root.offsetHeight;

      const right = (screenW - clickX) > rootW;
      const left = !right;
      const top = (screenH - clickY) > rootH;
      const bottom = !top;

      if (right) {
         root.style.left = `${clickX + 5}px`;
      }

      if (left) {
         root.style.left = `${clickX - rootW - 5}px`;
      }

      if (top) {
         root.style.top = `${clickY + 5}px`;
      }

      if (bottom) {
         root.style.top = `${clickY - rootH - 5}px`;
      }
   }
}