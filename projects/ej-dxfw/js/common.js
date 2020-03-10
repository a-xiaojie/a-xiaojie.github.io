/* 检查浏览器是否支持placeholder */
function isPlaceholder(){
    var input = document.createElement('input');
    return 'placeholder' in input;
}
if(!isPlaceholder()){
    $(function(){
       if(!isPlaceholder()){
           $('input').not('input[type="password"]').each(function(){    // 一般的输入框
              if($(this).val() == '' && $(this).attr('placeholder') != ''){
                  $(this).val($(this).attr('placeholder')).css('color','#999');
                  $(this).focus(function () {
                      if($(this).val() == $(this).attr('placeholder')){
                          $(this).val('').css('color','#666');
                      }
                  });
                  $(this).blur(function () {
                      if($(this).val() == ''){
                          $(this).val($(this).attr('placeholder')).css('color','#999');
                      }
                  });
              }
           });
           var pwdField = $('input[type="password"]');
           var pwdVal = pwdField.attr('placeholder');
           pwdField.after('<input id="pwdPlaceholder" type="text" value='+ pwdVal +' class="u-ipt u-login-ipt" style="color:#999" >');
           var pwdPlaceholder = $('#pwdPlaceholder');
           pwdPlaceholder.show();
           pwdField.hide();

           pwdPlaceholder.focus(function () {
               pwdPlaceholder.hide();
               pwdField.show().focus();
           });
           pwdField.blur(function () {
               if(pwdField.val() == ''){
                   pwdPlaceholder.show();
                   pwdField.hide();
               }
           })
       }
    });
}