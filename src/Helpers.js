export var checkImageUrl = (url) => {
   var http = new XMLHttpRequest()
   http.open('GET', url, false)
   http.send()

   if (http.status === 200) {
      return url
   } else {
      return baseURL + 'admin/img/warning.png'
   }
}

export var removeArray = (array, element) => {
   return array.filter(el => el !== element)
}