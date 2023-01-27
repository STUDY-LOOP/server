var editEvent = function (event, element) {
    //console.log('edit event function run');
    $('#event-delete-btn').data('id', event._id); 

    $('.popover.fade.top').remove();
    $(element).popover("hide");

    if (event.end === null) {
        event.end = event.start;
    }
    editEnd.val(event.end.format('YYYY-MM-DD HH:mm'));
    
    editTitle.val(event.title);
    editType.val(event.type);
    editStart.val(event.start.format('YYYY-MM-DD HH:mm'));
    editDes.val(event.description);

    newBtnCon.hide();
    existBtnCon.show();
    eventModal.modal('show');

    $('#event-update-btn').unbind();
    $('#event-update-btn').on('click', function () {

        if (editStart.val() > editEnd.val()) {
            alert('마치는 시각이 시작하는 시각보다 이릅니다');
            return false;
        }

        if (editTitle.val() === '') {
            alert('제목을 적어주세요');
            return false;
        }
        var startDate;
        var endDate;

        startDate = editStart.val();
        endDate = editEnd.val();

        eventModal.modal('hide');

        event.title = editTitle.val();
        event.type = editType.val();
        event.start = startDate;
        event.end = endDate;
        event.description = editDes.val();

        $("#calendar").fullCalendar('updateEvent', event);

        $.ajax({
            type: "patch",
            url: "/events/" + event.id,
            data: {
                //"id": eventInfo._id,
                "title": event.title,
                "type": event.type,
                "start": event.start,
                "end": event.end,
                "description": event.description,
            },
            success: function (response) {
                alert('수정되었습니다.')
            }
        });


    });
};

$('#event-delete-btn').on('click', function() {
    $.ajax({
        type: "delete",
        url: "/events/" + event.id,
        data: {
        },
        success: function (response) {
            alert('삭제되었습니다.');
        }
    });
    
    $('#event-delete-btn').unbind();
    $("#calendar").fullCalendar('removeEvents', $(this).data('id'));
    eventModal.modal('hide');


   
});