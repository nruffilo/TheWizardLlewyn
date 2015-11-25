var world = {};
var personHeight = 64;
var personWidth = 42;
var collectableCount = 0;
var hero_top = 120;
var hero_left = 20;
var hero_velocity_x = 0;
var hero_velocity_y = 0;
var black_holes = [];
var max_black_holes = 0;
var hero_height = 64;
var hero_width = 42;
var black_holes_used = 0;
var game_active = false;
var sensitivity = 10; //higher numbers, slower game
$(document).ready(function() {
    /*
    $(document).click(function(event) {
       //alert("You clicked me! " + event.pageX + " " + event.pageY);
        $("#hero_div").css("top",event.pageY+"px");
        $("#hero_div").css("left",event.pageX+"px");
    });
    */

    $(document).click(function(event) {
        if (game_active) {
            //remove old black holes, create new black hole
            black_holes_used++;
            if (black_holes.length == max_black_holes) {
                black_hole_to_remove = black_holes.shift();
                black_hole_to_remove.el.remove();
            }

            var el = $("<div class='black_hole'></div>");
            $("#gameboard").append(el);

            el.css("top", event.pageY + "px");
            el.css("left", event.pageX + "px");
            black_holes.push({el: el, top: event.pageY, left: event.pageX});
        }
    });

    world.people = [];
    world.collectables = [];
    world.obstacles = [];
    /*
    world.people.push({el: $("#extra1"), top: 120, left: 0, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra2"), top: 0, left: 0, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra3"), top: 100, left: 300, directionX: 1, directionY: 1});
    world.people.push({el: $("#extra4"), top: 100, left: 200, directionX: 1, directionY: 1});
    */

    //setStage(1);

    //createCollectables(5);
    //movePeople();
    //moveHero();
});


function moveHero() {
    var moveX = 0;
    var moveY = 0;

    for (i in black_holes) {
        if (typeof(black_holes[i]) != "undefined") {
            var total_distance = Math.sqrt(Math.abs(hero_top-black_holes[i].top)^2+Math.abs(hero_left-black_holes[i].left)^2);
            var amplification_effect = (1/((total_distance+10)^2));
            var yVelocity = (black_holes[i].top-hero_top) * amplification_effect;
            var xVelocity = (black_holes[i].left-hero_left) * amplification_effect;
            moveX = (xVelocity == NaN) ? 0 : xVelocity;
            moveY = (xVelocity == NaN) ? 0 : yVelocity;
        }
    }

    hero_velocity_x += (moveX/sensitivity);
    hero_velocity_y += (moveY/sensitivity);

    for (item in world.obstacles) {
        var checkItem = world.obstacles[item];
        if (checkItem.top <= hero_top + hero_height + hero_velocity_y
            && checkItem.top + hero_height + hero_velocity_y >= hero_top
            && checkItem.left + hero_width >= hero_left + hero_velocity_x
            && checkItem.left <= hero_left + hero_width + hero_velocity_x
        )
        {
            //is the collision from moving left
            if (
                (hero_left + hero_width < checkItem.left)
                && (hero_left + hero_width + hero_velocity_x >= checkItem.left)) {
                hero_velocity_x = 0;
                hero_left = checkItem.left - hero_width;
            } else if (
                (hero_left > checkItem.left + checkItem.width)
                && (hero_left + hero_velocity_x <= checkItem.left+ checkItem.width)) {
                hero_velocity_x = 0;
                hero_left = checkItem.left + checkItem.width;
            } else if (
                (hero_top + hero_height < checkItem.top)
                && (hero_top + hero_height + hero_velocity_y >= checkItem.top)
            ) {
                hero_velocity_y = 0;
                hero_top = checkItem.top-hero_height;
            } else if (
                (hero_top > checkItem.top + checkItem.height)
                && (hero_top + hero_velocity_y <= checkItem.top + checkItem.heigth)
            ) {
                hero_velocity_y = 0;
                hero_top = checkItem.top+ checkItem.height;
            } else {
                //see if newly hitting left
                if ((hero_velocity_x > 0) && (hero_left+hero_width < checkItem.left)) {
                    hero_velocity_x = 0;
                    hero_left = checkItem.left - hero_width;
                }
                if ((hero_velocity_x < 0) && (hero_left > checkItem.left + checkItem.width)) {
                    hero_velocity_x = 0;
                    hero_left = checkItem.left + checkItem.width;
                }
                if ((hero_velocity_y >0) && (hero_top + hero_height < checkItem.top)) {
                    hero_velocity_y = 0;
                    hero_top = checkItem.top - hero_height;
                }
                if ((hero_velocity_y <0) && (hero_top > checkItem.top+checkItem.height)) {
                    hero_velocity_y = 0;
                    hero_top = checkItem.top + checkItem.height;
                }


                console.log("Collission detected, but by golly we didn't know what to do with it...");
            }


            //is the collision from moving DOWN

        }
    }


    var new_hero_top = hero_velocity_y + hero_top;
    var new_hero_left = hero_velocity_x + hero_left;
    hero_top = new_hero_top;
    hero_left = new_hero_left;
    $("#hero_div").css("top",new_hero_top+"px");
    $("#hero_div").css("left",new_hero_left+"px");

    //check if the hero has collided with any of the collectables
    for (item in world.collectables) {
        var checkItem = world.collectables[item];
        if (checkItem.top <= hero_top + hero_height
            && checkItem.top + hero_height >= hero_top
            && checkItem.left + hero_width >= hero_left
            && checkItem.left <= hero_left + hero_width
        )
        {
            world.collectables[item].el.remove();
            world.collectables.splice(item,1);
        }
    }

    if (world.collectables.length == 0) {
        alert("YOU WON, it took you " + black_holes_used + " black holes.");
        game_active = false;
        $("#gameboard").hide();
        $("#stage_select").show();
        $(".black_hole").remove();
        black_holes = [];
        hero_velocity_x = 0;
        hero_velocity_y = 0;
    } else {
        setTimeout(moveHero, 50);
    }
}

function setStage(stage_num) {
    $("#gameboard").show();
    $("#stage_select").hide();

    $(".collectable").remove();
    world.collectables = [];
    black_holes_used = 0;
    switch (stage_num) {
        case 1:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 100px; left: 200px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 200px; left: 420px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 100, left: 200});
            world.collectables.push({el: $("#collectable1"), top: 200, left: 420});
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 1;
            break;
        case 2:
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 200px; left: 100px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 100px; left: 260px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 220px; left: 380px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 200, left: 100});
            world.collectables.push({el: $("#collectable1"), top: 100, left: 260});
            world.collectables.push({el: $("#collectable2"), top: 220, left: 380});
            hero_top = 120;
            hero_left = 20;
            max_black_holes = 2;
            break;
        case 5: //omgwtfbbq
            $("#gameboard").append("<div id='collectable0' class='collectable' style='top: 100px; left: 120px;'></div>");
            $("#gameboard").append("<div id='collectable1' class='collectable' style='top: 200px; left: 120px;'></div>");
            $("#gameboard").append("<div id='collectable2' class='collectable' style='top: 140px; left: 380px;'></div>");
            $("#gameboard").append("<div id='collectable3' class='collectable' style='top: 240px; left: 380px;'></div>");
            world.collectables.push({el: $("#collectable0"), top: 100, left: 120});
            world.collectables.push({el: $("#collectable1"), top: 200, left: 120});
            world.collectables.push({el: $("#collectable2"), top: 140, left: 380});
            world.collectables.push({el: $("#collectable3"), top: 240, left: 380});

            $("#gameboard").append("<div id='obstacle0' class='obstacle' style='top:60px;left:260px;width:16px; height: 100px;'></div>");
            $("#gameboard").append("<div id='obstacle1' class='obstacle' style='top:300px;left:260px;width:16px; height: 100px;'></div>");

            //load obstacles
            world.obstacles.push({el:$("#obstacle0"), top: 60, left: 260, width: 16, height: 100});
            world.obstacles.push({el:$("#obstacle1"), top: 300, left: 260, width: 16, height: 100});

            hero_top = 0;
            hero_left = 0;
            max_black_holes = 2;
            break;

    }
    $("#hero_div").css("top",hero_top+"px");
    $("#hero_div").css("left",hero_left+"px");
    moveHero();
    setTimeout(function() { game_active = true; }, 100);
}

function createCollectables(num) {
    for (var i=0; i<=num; i++) {
        $("#gameboard").append("<div id='collectable"+collectableCount+"' class='collectable'></div>");
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