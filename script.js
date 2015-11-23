var world = {};
var personHeight = 64;
var personWidth = 42;
var collectableCount = 0;
$(document).ready(function() {
    $(document).click(function(event) {
       //alert("You clicked me! " + event.pageX + " " + event.pageY);
        $("#hero_div").css("top",event.pageY+"px");
        $("#hero_div").css("left",event.pageX+"px");
    });

    world.people = [];
    world.collectables = [];
    world.people.push({el: $("#extra1"), top: 120, left: 0, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra2"), top: 0, left: 0, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra3"), top: 100, left: 300, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra4"), top: 100, left: 200, directionX: 1, directionY: 1});
    createCollectables(5);
    movePeople();
});

function createCollectables(num) {
    for (var i=0; i<=num; i++) {
        $("body").append("<div id='collectable"+collectableCount+"' class='collectable'></div>");
        var top = Math.random()*340;
        var left = Math.random()*540;
        $("#collectable"+i).css("left",left+"px");
        $("#collectable"+i).css("top",top+"px");
        world.collectables.push({el: $("#collectable"+collectableCount), top: top, left: left});
        collectableCount++;
    }
}

function movePeople() {
    for (num in world.people) {
        var person = world.people[num];

        var original_top = person.top;
        var original_left = person.left;

        person.top = person.top + (parseInt(Math.random()*10)*person.directionY);
        person.left = person.left + (parseInt(Math.random()*10)*person.directionX);

        if (checkCollision(person, num)) {
            person.top = original_top;
            person.left = original_left;
        }


        checkCollectableCollision(person);

        if (Math.random()>.95) {
            person.directionY = -person.directionY;
        }

        if (Math.random()>.95) {
            person.directionX = -person.directionX;
        }

        if (person.left < 5) { person.left = 5; }
        if (person.left > 540) { person.left = 540; }
        if (person.top < 5) { person.top = 5; }
        if (person.top > 340) { person.top = 340; }

        /*
        if (checkCollision(person, num)) {
            console.log("Things are hitting");
            //world.people[other].top -= 20;
            person.top += personHeight;
            //world.people[other].left -= 20;
            person.left += personWidth;
        }
        */

        person.el.css("top",person.top+"px");
        person.el.css("left",person.left+"px");
    }

    setTimeout(movePeople, 500);
}

function checkCollectableCollision(person) {
    for (item in world.collectables) {
        var checkItem = world.collectables[item];
        if (checkItem.top <= person.top + personHeight
            && checkItem.top + personHeight >= person.top
            && checkItem.left + personWidth >= person.left
            && checkItem.left <= person.left + personWidth
        )
        {
            person.el.append("<div class='collected_item'></div>");
            checkItem.el.remove();
            world.collectables.splice(item,1);
            createCollectables(1);

        }
    }

}

function checkCollision(person, num) {
    for (other in world.people) {
        if (other == num) continue;
        if (world.people[other].top <= person.top + personHeight
            && world.people[other].top + personHeight >= person.top
            && world.people[other].left + personWidth >= person.left
            && world.people[other].left <= person.left + personWidth
        )
        {
            return true;
        }
    }
    return false;
}