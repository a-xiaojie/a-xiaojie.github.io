/**
 * Created by Linjie on 2015/12/18 0018.
 */
$(function () {
    $.ajax({
        url: 'dist/message.json',
        type: 'get',
        async: false,
        dataType: 'json',
        success: function(data){
            var skills = data.skills;
            var skillsHTML = '';
            $('#skillList').html('');
            $.each(skills, function (key, val) {
                console.log(key+':'+val);
                skillsHTML = '<li><h4>' + key + '</h4>' +
                    '<div title="' + key + ':' + val[0] + '" class="skill-bar">' +
                    '<div id="' + key + '" style=" background: ' + val[1] + '">' + val[0] + '</div></div></li>'
                $('#skillList').append(skillsHTML);
                $('#' + key).animate({
                    width: val[0],
                    opacity: 1
                },600)
            })

        }
    })
})
