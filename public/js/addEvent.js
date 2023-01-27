var eventModal = $('#eventModal');
var editTitle = $('#event-title');
var editType = $('#event-type');
var editStart = $('#event-start');
var editEnd = $('#event-end');
var editDes = $('#event-des');

var newBtnCon = $('.modal-btn-new');
var existBtnCon = $('.modal-btn-exist');

var createEvent = function(start, end) {
    //console.log('create event function run');
    // console.log($('#createEvent').data('id', event._id));

    editTitle.val('');
    editType.val('');
    editStart.val(start);
    editEnd.val(end);
    editDes.val('');

    newBtnCon.show();
    existBtnCon.hide();
    eventModal.modal('show');

    //var eventId = 1 + Math.floor(Math.random() * 1000);

    $('#event-save-btn').unbind();
    $('#event-save-btn').on('click', function() {
        var eventInfo = {
            //_id: eventId,
            title: editTitle.val(),
            type: editType.val(),
            start: editStart.val(),
            end: editEnd.val(),
            description: editDes.val()
        };
    
        if (eventInfo.start > eventInfo.end) {
            alert('마치는 시각이 시작하는 시각보다 이릅니다');
            return false;
        }
    
        if (eventInfo.title === '') {
            alert('제목을 적어주세요');
            return false;
        }

        $('#calendar').fullCalendar('renderEvent', eventInfo, true);
        eventModal.find('input, textarea').val('');
        eventModal.modal('hide');

        $.ajax({
            type: "post",
            url: "/events",
            data: {
                //"id": eventInfo._id,
                "title": eventInfo.title,
                "type": eventInfo.type,
                "start": eventInfo.start,
                "end": eventInfo.end,
                "description": eventInfo.description,
            },

            success: function (response) {
                
                //DB연동시 중복이벤트 방지를 위한
                //$('#calendar').fullCalendar('removeEvents');
                //$('#calendar').fullCalendar('refetchEvents');
            }
        });
    });
};