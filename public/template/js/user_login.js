localStorage.clear()

$("#submit_button").click(function () {
  var formData = {
    username: $("#username").val(),
    password: $("#password").val(),
  };

  $.ajax({
    type: "POST",
    url: "/login/auth",
    data: formData,
    dataType: "json",
    encode: true,
  })
    .done(
      (data) => {
        localStorage.setItem('token', 'Bearer ' + data.token)
        window.location.href = '/home'
      }
    )
    .fail((error) => {
      alert('Tài khoản của bạn không đúng hoặc đã bị khóa!');
      location.reload();
    })
})
