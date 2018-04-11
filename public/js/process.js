let processes = [
    {
        id:'P01',
        arrival_time:1,
        burst_time:4
    },
    {
        id:'P02',
        arrival_time:3,
        burst_time:5
    },
    {
        id:'P03',
        arrival_time:2,
        burst_time:2
    },
    {
        id:'P04',
        arrival_time:4,
        burst_time:3
    },
];

$("#processAdd").click(()=>{
    let id = $('#pid').val();
    let arrival_time = parseInt($('#pat').val());
    let burst_time = parseInt($('#pbt').val());
    let processs  = {
        id,
        arrival_time,
        burst_time
    }
    processes.push(processs);
    populateTable();
    console.log(processes);
});

$("#set").click(populateQueue);
$("#go").click(startEvent);

function populateTable(){
    let i = 0;
    $('#process_table').html('');
    let colors = ['primary','danger','info','success']
    processes.forEach(element => {
        i++;
        html = `
            <tr id="${element.id}r">
                <td style="width:50px;"><span class="round round-${colors[(i-1)%4]}">${i}</span></td>
                <td>
                    <h3>${element.id}</h3></td>
                <td>
                    <h3>${element.arrival_time}</h3>
                </td>
                <td>
                    <h3>${element.burst_time}</h3>
                </td>
            </tr>
        `;
        $("#process_table").append(html);
    });
}

function compare(a,b) {
    if (a.arrival_time < b.arrival_time)
      return -1;
    if (a.arrival_time > b.arrival_time)
      return 1;
    return 0;
  }

function populateQueue(){
    $('#queue').html(`<div class="col-sm-12">
    <h2>
        Process Queue
    </h2>
</div>`);
    processes.sort(compare);
    time_slot = process_time();
    let i = 0;
    processes.forEach(element => {
        let html = `
        <div id="${element.id}" class="col-sm-${time_slot[i]}">
            <div class="card">
                <div class="card-block">
                    <h4 class="card-title">${element.id}</h4>
                    
                    <span class="text-info so">0%</span>
                    <div class="progress">
                        <div class="progress-bar bg-info" role="progressbar" style="width: 0%; height: 6px;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
            </div>
        </div>
        `;
        $('#queue').append(html);
        i++;
    });
}

function process_time(){
    let btsum = 0;
    let widths = [];
    processes.forEach(element => {
        btsum+=element.burst_time;
    });
    processes.forEach(element => {
        let width = 1;
        console.log(btsum);
        console.log(element.burst_time);
        console.log((element.burst_time/btsum)*12);
        if(!(Math.floor((element.burst_time/btsum)*12))){
            widths.push(width);
        }else{
            width = Math.floor((element.burst_time/btsum)*12);
            widths.push(width);
        }
    });
    console.log(widths);
    return widths;
}

function startEvent(){
    let btsum = 0; 
    processes.forEach(element => {
        btsum+=element.burst_time;
    });
    let timec = 0;
    let timet = 0;
    // processes.forEach(element => {
    //     setTimeout(()=>{
    //         fill($('#' + element.id),element.burst_time);
    //     },timet);
    //     timet += element.burst_time;
        
    // });
    let triggers = [];
    let trigger = 0;
    processes.forEach(element => {
        trigger += element.burst_time*1000;
        triggers.push(trigger);
    });
    $('#timer').html(timec/1000);
    timec+=1000;
    let i = 0;
    fill($('#'+ processes[i].id),processes[i].burst_time);
    $('#'+processes[i].id+'r').css('background','#cdffb2');
    
    y = setInterval(()=>{
        $('#timer').html(timec/1000);
        if(timec == triggers[i]){
            if(i>=triggers.length-1){
                alert("done!");
                $('#'+processes[i].id+'r').css('background','#fff');
                clearInterval(y);
                return;

            }
            console.log(processes[i+1]);
            fill($('#'+processes[i+1].id),processes[i+1].burst_time);
            $('#'+processes[i+1].id+'r').css('background','#cdffb2');
            $('#'+processes[i].id+'r').css('background','#fff');
            i++;
        }
        timec+=1000;
        
        if(timec > btsum*1000){
            clearInterval(y);
        }
    },1000);
}

function populateRemove(){
    $('select').html('');
    processes.forEach(element => {
        let html = `<option value="${element.id}">${element.id}</option>`;
        $('select').append(html);
    });
    
}



function fill(ele,time){

    time = time*1000;
    timecheck = 0;
    ele.find('.so').html('0%');
    ele.find('.progress-bar').css('width','0%');
    x = setInterval(()=>{
        timecheck += 10;
        let pc = Math.round((timecheck/time)*100);
        ele.find('.so').html(pc+ '%');
        ele.find('.progress-bar').css('width',pc+'%');
        if(timecheck >= time || (Math.round((timecheck/time)*100) >= 100)){
            clearInterval(x);
            return;
        }
    },10);
}

function removeProcess(){
    id = $('#select').val();
    processes.splice(processes.findIndex(item => item.id === id), 1);
    populateTable();
}