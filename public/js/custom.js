var pusher = new Pusher('35dd6f0cf8fc48b87b2c', {
   cluster: 'ap1',
   forceTLS: true
}), channel = pusher.subscribe('my-channel');