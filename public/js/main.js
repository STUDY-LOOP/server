$(function () {
    $('#calendar').fullCalendar({
        dayMaxEvents: true, //+more
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,
        navLinks: true,

        header: {
            left: 'today, prev',
            center: 'title',
            right: 'next',
        },

        events: function (start, end, timezone, callback) { 
            
            $.ajax({
                type: "get",
                url: "/events",
                data: {
                    startDate: moment(start).format('YYYY-MM-DD'),
                    endDate: moment(end).format('YYYY-MM-DD')
                },
                
                
            });
            //console.log(start, end); //o

        },

        eventRender: function (event, $el) {
            $el.popover({
                title: event.title,
                content: event.description,
                trigger: 'hover',
                placement: 'top',
                container: 'body',
            });
        },

        select: function (selectionInfo) {

            $(".fc-body").unbind('click');
            $(".fc-body").on('click', 'td', function (e) {
                $("#eventModal")
                    .addClass("opened")
                    .css({
                        display: "block",
                        left: e.pageX,
                        top: e.pageY
                    });
                return false;
            });

            selectedDay = selectionInfo._d; //선택한 날 정보

            var today = moment();

            startDate = selectionInfo._d;
            endDate = selectionInfo._d;

            startDate.setHours(today._d.getHours());
            startDate.setMinutes(today._d.getMinutes());

            startDate = moment(startDate).format('YYYY-MM-DD HH:mm');

            //console.log(startDate);
            //endDate = moment(endDate).subtract(1, 'days');
            endDate.setHours(today._d.getHours() + 1);
            endDate.setMinutes(today._d.getMinutes());

            endDate = moment(endDate).format('YYYY-MM-DD HH:mm');
            //console.log(endDate);

            //var $eventModal = $('#eventModal');
            createEvent(startDate, endDate);

        },

        eventClick: function (event, element) {
            //console.log('event clicked');
            editEvent(event, element);
        },

    });
});
